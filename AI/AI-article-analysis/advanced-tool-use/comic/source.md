# Advanced Tool Use on the Claude Developer Platform

By Anthropic | Published Nov 24, 2025

We've added three new beta features that let Claude discover, learn, and execute tools dynamically.

The future of AI agents is one where models work seamlessly across hundreds or thousands of tools - IDE assistants, operations coordinators connecting Slack, GitHub, Jira, and dozens of MCP servers.

## The Core Problems

1. **Context pollution from tool definitions**: 50+ MCP tools can consume 100K+ tokens before conversation starts
2. **Inference overhead**: Each tool call requires full model inference pass
3. **Schema isn't enough**: JSON Schema defines structure but not usage patterns

## Three New Features

### 1. Tool Search Tool
Instead of loading all 55K tokens of tool definitions upfront, Claude discovers tools on-demand.
- 85% reduction in token usage
- Only loads tools actually needed
- Opus 4 accuracy improved: 49% → 74%

### 2. Programmatic Tool Calling (PTC)
Claude writes Python code to orchestrate tools instead of individual API round-trips.
- 37% token reduction on complex tasks
- Eliminates 19+ inference passes for 20 tool calls
- Only final results enter context, not intermediate data

Example: "Which team exceeded Q3 budget?"
- Traditional: 2000+ expense line items in context
- PTC: Only 3 names who exceeded budget in context

### 3. Tool Use Examples
Provide concrete usage examples in tool definitions.
- Shows format conventions, ID patterns, correlations
- Accuracy improved: 72% → 90% on complex parameters

## Best Practices

- Layer features strategically based on bottleneck
- Keep 3-5 most-used tools always loaded
- Document return formats for PTC
- Use 1-5 realistic examples per tool
