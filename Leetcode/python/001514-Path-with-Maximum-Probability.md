### Problem 

https://leetcode.com/problems/path-with-maximum-probability/description/

You are given an undirected weighted graph of n nodes (0-indexed), represented by an edge list where edges[i] = [a, b] is an undirected edge connecting the nodes a and b with a probability of success of traversing that edge succProb[i].

Given two nodes start and end, find the path with the maximum probability of success to go from start to end and return its success probability.

If there is no path from start to end, return 0. Your answer will be accepted if it differs from the correct answer by at most 1e-5.

 
 #### Example 1
 
 ```
Input: n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.2], start = 0, end = 2
Output: 0.25000
Explanation: There are two paths from start to end, one having a probability of success = 0.2 and the other has 0.5 * 0.5 = 0.25.
```


#### Example 2 

```
Input: n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.3], start = 0, end = 2
Output: 0.30000
```

#### Example 3

```
Input: n = 3, edges = [[0,1]], succProb = [0.5], start = 0, end = 2
Output: 0.00000
Explanation: There is no path between 0 and 2.
```

##### Constraints:

2 <= n <= 10^4
0 <= start, end < n
start != end
0 <= a, b < n
a != b
0 <= succProb.length == edges.length <= 2*10^4
0 <= succProb[i] <= 1
There is at most one edge between every two nodes.


## Solution 

#### BFS 

```python
class Solution:
    def maxProbability(self, n: int, edges: List[List[int]], succProb: List[float], start: int, end: int) -> float:
        graph, queue = defaultdict(list), deque([start])
        for i, (s, e) in enumerate(edges):
            graph[s].append([e, i])
            graph[e].append([s, i])
        prob = [0.0] * n
        prob[start] = 1.0
        while queue:
            curr = queue.popleft()
            for nei, i in graph.get(curr, []):
                if prob[curr] * succProb[i] > prob[nei]:
                    prob[nei] = prob[curr] * succProb[i]
                    queue.append(nei)
        return prob[end]
```

#### Dijikstra's 
It is similar to BFS, it always choose the optimal path instead of go though all the paths. 

using max heap to always choose the optimal path 

```python

class Solution:
    def maxProbability(self, n: int, edges: List[List[int]], succProb: List[float], start: int, end: int) -> float:
        graph = defaultdict(list)
        for prob, (s, e) in zip(succProb, edges):
            graph[s].append([e, prob])
            graph[e].append([s, prob])
        pq = [[-1, start]] # max heap 
        visited = set() 
        while pq:
            prob, curr = heapq.heappop(pq) # max heap, always pick the max probability path first
            if curr in visited:
                continue
            visited.add(curr)
            if curr == end: # when found path, it is optimal, exit early
                return -prob

            for nei, p in graph.get(curr, []):
                heapq.heappush(pq, [p * prob, nei])
                    
        return 0 # no path found

```