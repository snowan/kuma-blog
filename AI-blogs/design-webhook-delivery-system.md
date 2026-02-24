# System Design: Webhook Delivery System

## From a Simple HTTP POST to Delivering Billions of Events — A Staff Engineer's Guide

---

## Table of Contents

1. [The Problem & Why It's Hard](#1-the-problem--why-its-hard)
2. [Requirements & Scope](#2-requirements--scope)
3. [Phase 1: Single Machine Webhook Dispatcher](#3-phase-1-single-machine-webhook-dispatcher)
4. [Why the Naive Approach Fails (The Math)](#4-why-the-naive-approach-fails-the-math)
5. [Phase 2: Distributed Webhook Delivery Platform](#5-phase-2-distributed-webhook-delivery-platform)
6. [Core Component Deep Dives](#6-core-component-deep-dives)
7. [The Scaling Journey](#7-the-scaling-journey)
8. [Failure Modes & Resilience](#8-failure-modes--resilience)
9. [Data Model & Storage](#9-data-model--storage)
10. [Observability & Operations](#10-observability--operations)
11. [Design Trade-offs](#11-design-trade-offs)
12. [Common Interview Mistakes](#12-common-interview-mistakes)
13. [Interview Cheat Sheet](#13-interview-cheat-sheet)

---

## 1. The Problem & Why It's Hard

You're asked to design a system that delivers webhook events to external customer endpoints. When something happens in your platform (a payment succeeds, a deployment completes, an order ships), you need to reliably POST a JSON payload to a URL the customer registered.

On the surface, it's "just fire an HTTP request." The trap is thinking the hard part is sending. The hard part is what happens when the other side doesn't cooperate.

> **The interviewer's real question**: Can you design a multi-tenant delivery system where one customer's broken endpoint doesn't degrade delivery for everyone else, while maintaining at-least-once guarantees across billions of events?

Your customers' endpoints are servers you don't control. They go down, they respond slowly, they return garbage status codes, they rate-limit you, and they do all of this unpredictably. You're building an outbound delivery system where every "client" is unreliable by definition.

> **Staff+ Signal:** The real challenge isn't throughput — it's tenant isolation. A single misbehaving endpoint that responds in 30 seconds per request can consume your entire worker pool, starving deliveries to every other customer. This is the noisy neighbor problem applied to outbound HTTP.

---

## 2. Requirements & Scope

### Functional Requirements

- **Event ingestion**: Accept events from internal services via API (event type, payload, target endpoint)
- **Subscription management**: CRUD for webhook endpoints with event type filtering
- **Reliable delivery**: At-least-once delivery with configurable retry policies
- **Signature verification**: Sign every payload so customers can verify authenticity
- **Delivery logs**: Full audit trail of every delivery attempt (request, response, latency)
- **Manual replay**: Allow re-delivery of failed events from the UI or API
- **Dead letter queue**: Store events that exhaust all retries for later inspection

### Non-Functional Requirements

| Requirement | Target | Rationale |
|---|---|---|
| Delivery latency (p99) | < 30s from event creation | Near-real-time for payment and order events |
| Throughput | 50,000 events/sec sustained | Supports platform-wide event fan-out |
| Availability | 99.95% | Webhook delivery is not on the critical path of user requests, but extended outages cause data loss |
| Delivery success rate | > 99.9% for healthy endpoints | Measured after retries complete |
| Retry window | Up to 72 hours | Match Stripe's 3-day retry policy |
| Max payload size | 256 KB (with claim check for larger) | Balance between utility and bandwidth |

### Scale Estimation (Back-of-Envelope)

```
Events per day:            500M (across all tenants)
Peak events per second:    ~20,000 (flash sales, batch jobs)
Average payload size:      5 KB
Registered endpoints:      200,000 across 50,000 tenants
Average subscriptions:     4 endpoints per tenant
Delivery attempts/day:     ~600M (500M + ~20% retries)
Outbound bandwidth:        500M × 5KB = 2.5 TB/day = ~230 Mbps sustained
Storage for delivery logs: 600M × 1KB metadata = 600 GB/day → ~220 TB/year
```

> **Staff+ Signal:** The bandwidth math reveals why the claim check pattern matters. If average payload grows to 50KB (which happens as APIs mature), outbound bandwidth jumps to 25 TB/day. At that point, you're spending more on egress than compute. Offering "thin events" (just event type + resource ID, customer fetches full data via API) saves 80%+ bandwidth.

---

## 3. Phase 1: Single Machine Webhook Dispatcher

The simplest approach: an application server that accepts events and delivers them synchronously.

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Internal     │────▶│  Webhook Server  │────▶│ Customer        │
│ Services     │     │  (single box)    │     │ Endpoints       │
└─────────────┘     │                  │     └─────────────────┘
                    │  - Accept event   │
                    │  - Look up subs   │
                    │  - POST to each   │
                    │  - Log result     │
                    │  - Retry on fail  │
                    └──────────────────┘
                           │
                    ┌──────┴──────┐
                    │  PostgreSQL  │
                    │  (events +   │
                    │   endpoints) │
                    └─────────────┘
```

```python
def handle_event(event):
    endpoints = db.get_subscriptions(event.type)
    for endpoint in endpoints:
        payload = sign(event.payload, endpoint.secret)
        try:
            response = http_post(endpoint.url, payload, timeout=10)
            db.log_delivery(event.id, endpoint.id, response.status)
        except Timeout:
            db.schedule_retry(event.id, endpoint.id, attempt=1)
```

**When does Phase 1 work?** < 1,000 events/day, < 100 endpoints, all endpoints are healthy and fast. Good for an internal tool or early-stage startup.

**When does Phase 1 fail?** See next section.

---

## 4. Why the Naive Approach Fails (The Math)

The synchronous model breaks in two dimensions simultaneously: throughput and isolation.

### Throughput Collapse

```
Events per second:         100
Endpoints per event:       3 (average fan-out)
HTTP calls per second:     300
Average response time:     200ms (healthy endpoint)
Threads needed:            300 × 0.2s = 60 concurrent threads

One slow endpoint at 10s response time:
Threads consumed:          100 × 0.2 + 200 × 10 = 2,020 threads
Thread pool exhausted at:  ~500 threads (typical server)
Result:                    ALL deliveries blocked, including healthy endpoints
```

### The Noisy Neighbor Problem (Quantified)

```
Tenant A: 1 endpoint, responds in 50ms    → consumes 0.05 thread-seconds/event
Tenant B: 1 endpoint, responds in 10,000ms → consumes 10 thread-seconds/event

Tenant B is 200x more expensive than Tenant A.
With a 500-thread pool, Tenant B alone consumes 50 threads at just 5 events/sec.
At 50 events/sec for Tenant B, the entire thread pool is consumed.
Every other tenant gets zero deliveries.
```

| Bottleneck | Single Machine | Distributed Fix |
|---|---|---|
| Thread pool exhaustion | One slow endpoint blocks all | Per-tenant worker pools with timeouts |
| Retry backlog | Retries compete with fresh events | Separate retry queues with lower priority |
| Database writes | Sequential delivery logging | Async batch writes to delivery log |
| No isolation | All tenants share everything | Circuit breakers per endpoint |
| Single point of failure | Server crash = all delivery stops | Horizontally scaled workers with at-least-once queue |

**The tipping point**: A single machine becomes unworkable the moment you have one unreliable endpoint. This isn't a scale problem — it's an isolation problem that manifests at any scale.

---

## 5. Phase 2: Distributed Webhook Delivery Platform

The key architectural insight: **Separate event ingestion from delivery, and isolate delivery per-endpoint so one customer's failure never affects another.**

```mermaid
flowchart TB
    subgraph Ingestion
        IS[Internal Services]
        API[Event API]
        Q[Message Queue<br/>Kafka / SQS]
    end

    subgraph Routing
        RT[Router Service]
        SR[Subscription Registry<br/>Cache]
    end

    subgraph Delivery
        DQ1[Tenant A Queue]
        DQ2[Tenant B Queue]
        DQ3[Tenant C Queue]
        W1[Worker Pool A]
        W2[Worker Pool B]
        W3[Worker Pool C]
    end

    subgraph Resilience
        CB[Circuit Breaker<br/>per endpoint]
        DLQ[Dead Letter Queue]
        RQ[Retry Scheduler]
    end

    subgraph Storage
        DB[(PostgreSQL<br/>Events + Endpoints)]
        LOG[(Delivery Log<br/>ClickHouse)]
        CACHE[(Redis<br/>Endpoint Health)]
    end

    IS --> API --> Q
    Q --> RT
    RT --> SR
    RT --> DQ1 & DQ2 & DQ3
    DQ1 --> W1
    DQ2 --> W2
    DQ3 --> W3
    W1 & W2 & W3 --> CB
    CB -->|healthy| EXT[Customer Endpoints]
    CB -->|open| DLQ
    W1 & W2 & W3 --> LOG
    RQ --> DQ1 & DQ2 & DQ3
    DLQ --> RQ
```

### How Real Companies Built This

**Stripe** delivers webhooks with at-least-once guarantees using a retry schedule of: immediately → 5min → 30min → 2hr → 5hr → 10hr → then every 12hr for up to 3 days. They recently introduced "thin events" — a claim check pattern where the webhook payload contains just the event type and resource ID, and the customer fetches the full object via API. This dramatically reduces bandwidth and eliminates payload staleness (where a webhook contains outdated data because the resource changed between event creation and delivery).

**Shopify** processes 58 million requests per minute during Black Friday/Cyber Monday. Their webhook system retries failed deliveries up to 8 times over 4 hours. Critically, if an endpoint continues to fail past this window, Shopify *removes the webhook subscription entirely*. This is a deliberate trade-off: they protect system health by shedding load from persistently unhealthy endpoints, at the cost of requiring merchants to re-register.

**Hookdeck** (webhook infrastructure provider) has processed over 100 billion webhooks. During Black Friday 2024, they handled 10x normal traffic without a single timeout. Their key insight: queue depth alone isn't a useful metric — you need "estimated time to drain" (combining queue size, processing rate, and arrival rate) to understand if the system is keeping pace.

### Key Data Structure: Delivery Task

```json
{
  "delivery_id": "del_abc123",
  "event_id": "evt_xyz789",
  "endpoint_id": "ep_456",
  "tenant_id": "tenant_42",
  "url": "https://customer.com/webhooks",
  "payload": "{...}",
  "signature": "sha256=...",
  "attempt": 0,
  "max_attempts": 8,
  "next_retry_at": null,
  "created_at": "2026-02-23T10:00:00Z",
  "timeout_ms": 10000,
  "priority": "standard"
}
```

---

## 6. Core Component Deep Dives

### 6.1 Event Router

**Responsibilities:**
- Consume events from the ingestion queue
- Look up active subscriptions for the event type
- Fan out: create one delivery task per matching endpoint
- Route each task to the correct tenant-partitioned delivery queue

```mermaid
stateDiagram-v2
    [*] --> Consuming: Poll queue
    Consuming --> Routing: Event received
    Routing --> FanOut: Subscriptions found
    Routing --> Dropped: No subscriptions
    FanOut --> Queued: Delivery tasks enqueued
    Queued --> Consuming: Ack original event
    Dropped --> Consuming: Ack + log skip
```

The router is the fan-out amplifier. One inbound event becomes N delivery tasks (one per subscribed endpoint). The subscription registry should be cached in-memory with a TTL (Redis or local cache with pub/sub invalidation) because subscription lookups are on the hot path for every single event.

> **Staff+ Signal:** The router must be idempotent. If the process crashes after enqueuing 3 of 5 delivery tasks, the event will be re-consumed from the ingestion queue. Each delivery task needs a deterministic ID (e.g., `hash(event_id, endpoint_id)`) so re-routing produces deduplicable tasks, not duplicates.

### 6.2 Delivery Worker

**Responsibilities:**
- Pull delivery tasks from the tenant-partitioned queue
- Make the HTTP POST with timeout enforcement
- Classify the response (success, retryable failure, permanent failure)
- Update delivery log and schedule retries as needed

Response classification:

| Status Code | Action | Reasoning |
|---|---|---|
| 2xx | Success, ack task | Delivered |
| 429 | Retry, respect Retry-After header | Consumer is rate-limiting us |
| 408, 5xx | Retry with exponential backoff | Transient server error |
| 3xx | Follow redirect (once), then deliver | Endpoint moved |
| 4xx (except 408, 429) | Permanent failure, send to DLQ | Client-side error, retrying won't help |
| Timeout (>10s) | Retry, increment endpoint latency counter | Slow consumer |
| Connection refused | Retry, check circuit breaker | Endpoint down |

> **Staff+ Signal:** The timeout value is a critical design decision. GitHub uses 10 seconds. Stripe is more generous. Too short and you'll false-positive on healthy-but-slow endpoints. Too long and a single stuck connection consumes a worker thread for the duration. The right answer is adaptive timeouts: start at 10s, and if an endpoint consistently responds in 50ms, tighten the timeout to 5s. If it consistently takes 8s, consider flagging it as degraded.

### 6.3 Circuit Breaker (Per-Endpoint)

**Responsibilities:**
- Track delivery success/failure rates per endpoint
- Trip open when failure rate exceeds threshold (e.g., >50% over 10 attempts)
- Divert new deliveries to a holding queue while open
- Periodically probe the endpoint to detect recovery
- Gradually ramp traffic back after recovery

```mermaid
stateDiagram-v2
    [*] --> Closed: Initial state
    Closed --> Open: Failure rate > 50%<br/>over 10 attempts
    Open --> HalfOpen: Probe timer expires<br/>(30s → 1m → 5m → 30m)
    HalfOpen --> Closed: Probe succeeds (2xx)
    HalfOpen --> Open: Probe fails
    Closed --> Closed: Success
    Open --> Open: New deliveries → holding queue
```

The gradual recovery ramp is critical. When an endpoint recovers, you can't immediately blast it with the full backlog. Hookdeck uses an exponential ramp: `Rate(t) = H × (1 - e^(-t/τ))` where H is historical throughput and τ is typically 5 minutes. This reaches 63% capacity at τ and 95% at 3τ.

### 6.4 Retry Scheduler

**Responsibilities:**
- Calculate next retry time using exponential backoff with jitter
- Re-enqueue delivery tasks at the scheduled time
- Respect per-endpoint rate limits and circuit breaker state
- Expire retries after the maximum window (72 hours)

Retry schedule (matching Stripe's approach):

| Attempt | Delay | Cumulative |
|---|---|---|
| 1 | Immediate | 0 |
| 2 | 5 min | 5 min |
| 3 | 30 min | 35 min |
| 4 | 2 hours | 2h 35m |
| 5 | 5 hours | 7h 35m |
| 6 | 10 hours | 17h 35m |
| 7 | 12 hours | 29h 35m |
| 8 | 12 hours | 41h 35m |

Formula: `delay = min(base_delay × 2^attempt + jitter, max_delay)` where `jitter = random(0, delay/4)`.

The jitter prevents thundering herd: if 10,000 events fail at the same moment, without jitter they all retry at exactly the same moment, causing another spike.

---

## 7. The Scaling Journey

### Stage 1: Startup (0–10K events/day)

```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│ App      │────▶│ Webhook      │────▶│ Customer │
│ Server   │     │ Worker       │     │ Endpoint │
└──────────┘     │ (background  │     └──────────┘
                 │  thread pool)│
                 └──────┬───────┘
                        │
                 ┌──────┴──────┐
                 │  PostgreSQL  │
                 │  (everything)│
                 └─────────────┘
```

Background thread pool in your main application. Retries stored as rows in PostgreSQL with a `next_retry_at` column, polled by a cron job. No separate infrastructure.

**Limit**: One slow endpoint blocks the thread pool. No isolation. No monitoring beyond "did it work?"

### Stage 2: Growing (10K–1M events/day)

```mermaid
flowchart LR
    APP[App Servers] --> Q[Redis Queue]
    Q --> W1[Worker 1]
    Q --> W2[Worker 2]
    Q --> W3[Worker 3]
    W1 & W2 & W3 --> PG[(PostgreSQL)]
    W1 & W2 & W3 --> EXT[Endpoints]
```

**New capabilities at this stage:**
- Dedicated worker processes (separated from the app server)
- Redis-backed queue (Sidekiq, Celery, BullMQ) for async delivery
- Basic retry logic with exponential backoff
- Delivery logs in PostgreSQL

**Limit**: Single shared queue. One tenant's slow endpoint consumes workers, blocking everyone. No circuit breaking. Delivery log table grows large and queries slow down.

### Stage 3: Platform Scale (1M–100M events/day)

```mermaid
flowchart TB
    subgraph Ingestion
        API[Event API<br/>stateless] --> KAFKA[Kafka<br/>partitioned by tenant]
    end
    subgraph Routing
        KAFKA --> ROUTER[Router<br/>fan-out + dedup]
        ROUTER --> TQ1[Tenant Queue 1]
        ROUTER --> TQ2[Tenant Queue 2]
        ROUTER --> TQN[Tenant Queue N]
    end
    subgraph Delivery
        TQ1 --> WP1[Worker Pool 1<br/>concurrency: 10]
        TQ2 --> WP2[Worker Pool 2<br/>concurrency: 5]
        TQN --> WPN[Worker Pool N<br/>concurrency: 2]
    end
    subgraph Resilience
        WP1 & WP2 & WPN --> CB[Circuit Breakers<br/>per endpoint]
        CB --> DLQ[Dead Letter Queue]
        CB --> EXT[Customer Endpoints]
    end
    subgraph Storage
        WP1 & WP2 & WPN --> CH[(ClickHouse<br/>delivery logs)]
        ROUTER --> PG[(PostgreSQL<br/>events + subscriptions)]
        CB --> REDIS[(Redis<br/>endpoint health)]
    end
```

**New capabilities at this stage:**
- Kafka for ingestion (durability, replay, partitioning by tenant)
- Per-tenant delivery queues with configurable concurrency limits
- Circuit breakers per endpoint with health probing
- ClickHouse for delivery log analytics (replaces PostgreSQL for high-write volume)
- Tiered worker allocation: enterprise tenants get dedicated pools

**Limit**: Operational complexity. Need dedicated on-call rotation. Kafka cluster management. Cross-region delivery adds latency variance.

> **Staff+ Signal:** At this stage, the team structure matters as much as the architecture. The ingestion pipeline should be owned by a platform team, while delivery workers and circuit breakers are owned by a reliability team. The subscription API is a product surface owned by the developer experience team. Drawing these boundaries wrong means three teams coordinate on every incident.

### Stage 4: Enterprise (100M+ events/day)

Everything in Stage 3, plus:
- Multi-region deployment with geo-routed delivery (deliver from the region closest to the customer endpoint)
- Claim check pattern for large payloads (store payload in S3, webhook contains a signed URL)
- Customer-facing delivery dashboard (self-service debugging)
- SLA-backed delivery guarantees with financial penalties
- Automated endpoint health scoring that affects retry aggressiveness

---

## 8. Failure Modes & Resilience

### Delivery Flow with Failure Handling

```mermaid
sequenceDiagram
    participant IS as Internal Service
    participant API as Event API
    participant Q as Kafka
    participant R as Router
    participant W as Worker
    participant EP as Customer Endpoint
    participant DLQ as Dead Letter Queue

    IS->>API: POST /events {type, payload}
    API->>Q: Enqueue event
    API-->>IS: 202 Accepted

    Q->>R: Consume event
    R->>R: Fan-out to N endpoints
    R->>W: Delivery task (per endpoint)

    alt Healthy endpoint
        W->>EP: POST webhook (signed)
        EP-->>W: 200 OK
        W->>W: Log success, ack task
    else Timeout / 5xx
        W->>EP: POST webhook
        EP-->>W: 503 / timeout
        W->>W: Schedule retry (exp backoff)
    else Circuit open
        W->>DLQ: Divert to holding queue
        Note over W,DLQ: Probe endpoint periodically
    else Permanent failure (4xx)
        W->>DLQ: Send to dead letter queue
        Note over DLQ: Available for manual replay
    end
```

### Failure Scenarios

| Failure | Detection | Recovery | Blast Radius |
|---|---|---|---|
| Worker crash mid-delivery | Task visibility timeout (Kafka consumer group rebalance) | Another worker picks up the task; at-least-once semantics | Single delivery task; endpoint may receive duplicate |
| Customer endpoint down | HTTP timeout or connection refused | Exponential backoff retries for 72 hours | Only that endpoint; other tenants unaffected due to queue isolation |
| Kafka broker failure | ISR replication; consumer lag alerts | Automatic leader election; consumers reconnect | Brief ingestion delay; no data loss if replication factor ≥ 3 |
| Database (PostgreSQL) down | Connection pool errors; health checks | Failover to read replica; delivery continues from queues | New subscription changes delayed; active deliveries continue from queue state |
| Retry storm after outage | Queue depth spike; "estimated time to drain" metric | Circuit breaker opens; gradual recovery ramp | Contained to affected endpoints; other tenants isolated |
| Poison payload | Worker crashes repeatedly on same event | Dead letter after N crash-retries; alert on-call | Single event; worker restarts on other tasks |
| Clock skew across workers | Signature timestamp validation fails at customer | NTP sync; use event creation timestamp not worker clock | Customer rejects valid webhooks until clocks sync |

> **Staff+ Signal:** The most dangerous failure mode is the "success that isn't." The worker POSTs to the endpoint, the endpoint processes it and returns 200 — but the response is lost due to a network partition. The worker retries, and the customer processes the event twice. You can't prevent this on the sender side. The right approach is to include an idempotency key (`X-Webhook-ID` header) and document that customers must implement deduplication. Stripe, GitHub, and Shopify all do this.

---

## 9. Data Model & Storage

### Core Tables (PostgreSQL)

```sql
CREATE TABLE webhook_endpoints (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    url             TEXT NOT NULL,
    secret          TEXT NOT NULL,          -- HMAC signing key
    event_types     TEXT[] NOT NULL,        -- filter: ['payment.completed', 'order.*']
    status          VARCHAR(20) DEFAULT 'active',  -- active, paused, disabled
    rate_limit      INT DEFAULT 100,        -- max deliveries/sec to this endpoint
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_endpoints_tenant ON webhook_endpoints(tenant_id);
CREATE INDEX idx_endpoints_status ON webhook_endpoints(status) WHERE status = 'active';

CREATE TABLE webhook_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    event_type      VARCHAR(100) NOT NULL,  -- e.g., 'payment.completed'
    payload         JSONB NOT NULL,
    idempotency_key VARCHAR(255),           -- dedup at ingestion
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_tenant_type ON webhook_events(tenant_id, event_type);
CREATE INDEX idx_events_created ON webhook_events(created_at);
```

### Delivery Log (ClickHouse — high write volume)

```sql
CREATE TABLE delivery_log (
    delivery_id     UUID,
    event_id        UUID,
    endpoint_id     UUID,
    tenant_id       UUID,
    attempt         UInt8,
    status_code     UInt16,
    response_body   String,             -- truncated to 1KB
    latency_ms      UInt32,
    error_message   Nullable(String),
    created_at      DateTime64(3)
) ENGINE = MergeTree()
ORDER BY (tenant_id, created_at)
PARTITION BY toYYYYMM(created_at)
TTL created_at + INTERVAL 90 DAY;
```

### Endpoint Health State (Redis)

```
Key:    endpoint_health:{endpoint_id}
Value:  {
    "state": "CLOSED",           -- CLOSED / OPEN / HALF_OPEN
    "failure_count": 2,
    "success_count": 148,
    "last_failure_at": "2026-02-23T10:05:00Z",
    "last_success_at": "2026-02-23T10:06:30Z",
    "avg_latency_ms": 120,
    "probe_interval_s": 30
}
TTL:    3600 (auto-expire stale health data)
```

### Storage Engine Choice

| Engine | Role | Why |
|---|---|---|
| PostgreSQL | Events, endpoints, subscriptions | ACID for subscription changes; complex queries for management API |
| Kafka | Event ingestion queue, tenant-partitioned delivery queues | Durable, replayable, ordered within partition; handles burst traffic |
| ClickHouse | Delivery log analytics | Columnar, handles 600M+ rows/day writes; efficient time-range aggregation |
| Redis | Endpoint health, circuit breaker state, subscription cache | Sub-millisecond reads for hot-path decisions; TTL for auto-cleanup |

---

## 10. Observability & Operations

### Key Metrics

- `webhook_events_ingested_total{tenant, event_type}` — inbound event rate; detect traffic spikes
- `webhook_deliveries_total{tenant, endpoint, status}` — delivery outcomes (success/retry/failed/dlq)
- `webhook_delivery_latency_seconds{tenant, quantile}` — time from event creation to successful delivery
- `webhook_queue_depth{tenant}` — pending delivery tasks per tenant; the primary scaling signal
- `webhook_queue_max_age_seconds{tenant}` — age of the oldest undelivered task; stale = falling behind
- `webhook_estimated_drain_time_seconds{tenant}` — (queue_depth × avg_processing_time) / worker_count; the single best metric for system health
- `webhook_circuit_breaker_state{endpoint}` — open/closed/half_open per endpoint
- `webhook_retry_total{attempt_number}` — retry distribution; spikes at high attempt numbers = systemic endpoint issues
- `webhook_dlq_depth` — dead letter queue size; should trend toward zero, growth means unresolved failures

### Distributed Tracing

A full trace for a single webhook delivery:

```
[Event API] receive event (2ms)
  └── [Kafka] produce to ingestion topic (5ms)
       └── [Router] consume + fan-out to 3 endpoints (8ms)
            ├── [Worker A] deliver to endpoint 1 (120ms) ✓ 200
            ├── [Worker B] deliver to endpoint 2 (timeout 10,000ms) ✗ retry
            │    └── [Retry Scheduler] scheduled retry in 5min
            └── [Worker C] deliver to endpoint 3 (85ms) ✓ 200
```

Each delivery task carries a trace ID derived from the original event, so you can follow one event through fan-out to all its delivery attempts.

### Alerting Strategy

| Alert | Condition | Severity | Action |
|---|---|---|---|
| Queue drain time > 5 min | Sustained for 10 min | P2 | Scale workers; investigate slow endpoints |
| DLQ depth growing | > 1,000 new entries/hour | P2 | Check for widespread endpoint outages |
| Circuit breakers opening | > 10 endpoints in 5 min | P1 | Possible outbound network issue; check proxy health |
| Delivery success rate < 95% | Platform-wide for 15 min | P1 | Page on-call; check DNS, TLS cert, or proxy issues |
| Event ingestion lag > 30s | Kafka consumer lag metric | P2 | Scale routers; check for poison messages |

> **Staff+ Signal:** The most useful on-call dashboard isn't per-metric — it's a tenant-level heatmap showing delivery success rate × queue depth. A single red cell means one tenant is having issues (their problem). A full red row means a system-wide outage (your problem). This distinction determines whether you page the customer or yourself.

---

## 11. Design Trade-offs

| Decision | Option A | Option B | Recommended | Why |
|---|---|---|---|---|
| Queue backend | Redis (Sidekiq/BullMQ) | Kafka | Redis < 10M events/day; Kafka above | Redis is simpler to operate. Kafka gives durability, replay, and partitioning at cost of operational complexity. This is a two-way door — you can migrate later. |
| Delivery log storage | PostgreSQL | ClickHouse | ClickHouse at scale | PostgreSQL works to ~10M rows/day. Beyond that, write amplification from indexes becomes painful. ClickHouse handles 100x the write volume with time-range partitioning. |
| Payload strategy | Full payload in webhook | Thin event (claim check) | Thin events for large payloads | Full payloads are simpler but stale on arrival (resource may have changed). Thin events save bandwidth and guarantee freshness but add an API round-trip for the customer. Stripe offers both. |
| Tenant isolation | Shared queue with priority | Per-tenant queues | Per-tenant queues | Shared queues inevitably leak isolation under load. Per-tenant queues have higher overhead but bounded blast radius. |
| Retry policy | Fixed schedule (Stripe-style) | Adaptive (based on endpoint health) | Fixed schedule for v1 | Fixed is predictable and documented. Adaptive is better but harder to explain to customers ("why did my retry timing change?"). Ship fixed, iterate to adaptive. |
| Signature scheme | HMAC-SHA256 (symmetric) | Ed25519 (asymmetric) | HMAC-SHA256 | Svix benchmarks: symmetric is ~50x faster for signing, ~160x faster for verification. Asymmetric only needed if customers must verify without knowing the secret (rare for webhooks). |

> **Staff+ Signal:** The payload strategy decision is a one-way door for your API contract. Once customers build integrations expecting full payloads, switching to thin events is a multi-year migration. Stripe is going through this right now. If you're designing from scratch, support both modes from day one and default to thin events.

---

## 12. Common Interview Mistakes

1. **Designing synchronous delivery**: "The API accepts the event and delivers it before responding." → This couples your API latency to the slowest customer endpoint. Staff+ answer: decouple ingestion from delivery. Return 202 immediately, deliver asynchronously.

2. **Single shared retry queue**: "Failed deliveries go back into the main queue." → Retry traffic competes with fresh events. During an outage, retries can completely crowd out new deliveries. Staff+ answer: separate retry queues with lower priority, or time-bucketed retry scheduling.

3. **Ignoring tenant isolation**: "All deliveries go through one worker pool." → This is the #1 mistake. One slow endpoint degrades everyone. Staff+ answer: per-tenant (or per-endpoint) queue partitioning with circuit breakers.

4. **Treating all errors the same**: "We retry on any non-200 response." → Retrying a 401 Unauthorized is pointless and wastes resources. Staff+ answer: classify responses into retryable (5xx, timeout, 429) and permanent (4xx) with different handling.

5. **No idempotency story**: "We guarantee exactly-once delivery." → You can't. Network partitions make exactly-once impossible in a distributed system. Staff+ answer: guarantee at-least-once delivery and require customers to deduplicate using the webhook ID. Document this explicitly.

6. **Forgetting the recovery thundering herd**: "When the endpoint comes back up, we deliver the backlog." → Blasting the backlog at full speed often crashes the endpoint again immediately. Staff+ answer: gradual recovery ramp with exponential traffic increase.

7. **No payload size strategy**: "We just send the full event data." → Fine at 1KB payloads, catastrophic at 50KB × 500M events/day = 25 TB egress. Staff+ answer: claim check pattern or thin events for payloads above a threshold.

---

## 13. Interview Cheat Sheet

### Time Allocation (45-minute interview)

| Phase | Time | What to Cover |
|---|---|---|
| Clarify requirements | 5 min | Event types, delivery guarantees (at-least-once), scale, multi-tenant? |
| High-level design | 10 min | Ingestion → queue → router → per-tenant delivery queues → workers |
| Deep dive | 15 min | Circuit breaker per endpoint, retry with backoff, tenant isolation |
| Scale + failures | 10 min | Noisy neighbor, retry storms, DLQ, gradual recovery |
| Trade-offs + wrap-up | 5 min | Full vs. thin payloads, queue backend choice, signature scheme |

### Step-by-Step Answer Guide

1. **Clarify**: "Is this for sending webhooks (platform-side) or receiving them? How many tenants and endpoints? What delivery guarantee — at-least-once or best-effort?"
2. **Key insight**: "The hard part isn't sending HTTP requests — it's isolating tenants so one broken endpoint doesn't affect others."
3. **Single machine**: Synchronous delivery from app server, PostgreSQL for state. Works under 1K events/day.
4. **Prove it fails**: "One endpoint responding in 10s consumes 200x more worker capacity than a 50ms endpoint. The thread pool is exhausted."
5. **Distributed design**: Kafka ingestion → router → per-tenant queues → worker pools → circuit breakers
6. **Components**: Router (fan-out + dedup), workers (delivery + classification), circuit breaker (per-endpoint health), retry scheduler (exponential backoff + jitter)
7. **Failure handling**: Circuit breaker states, DLQ for permanent failures, gradual recovery ramp, idempotency keys for customers
8. **Scale levers**: Partition queues by tenant, scale workers per queue depth, ClickHouse for delivery logs, thin events for bandwidth
9. **Trade-offs**: Per-tenant queues (isolation) vs. shared queue (simplicity). Full payload (convenience) vs. thin events (bandwidth + freshness). HMAC (fast) vs. Ed25519 (no shared secret).
10. **Observe**: Queue drain time (best single metric), circuit breaker state heatmap, delivery success rate by tenant

### What the Interviewer Wants to Hear

- At **L5/Senior**: Async delivery, retry with backoff, basic queue design. Mentions idempotency.
- At **L6/Staff**: Per-tenant isolation with circuit breakers, quantified noisy neighbor problem, gradual recovery ramp, claim check pattern. References how Stripe or GitHub actually does it.
- At **L7/Principal**: Organizational ownership boundaries (who owns ingestion vs. delivery vs. customer API), multi-region delivery routing, SLA design with blast radius guarantees, migration path from shared queue to per-tenant isolation.

*Written as a reference for staff-level system design interviews.*
