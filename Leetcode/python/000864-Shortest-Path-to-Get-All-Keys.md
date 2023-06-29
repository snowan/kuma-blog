## Problem

https://leetcode.com/problems/shortest-path-to-get-all-keys/description/

864. Shortest Path to Get All Keys


You are given an m x n grid grid where:

'.' is an empty cell.
'#' is a wall.
'@' is the starting point.
Lowercase letters represent keys.
Uppercase letters represent locks.
You start at the starting point and one move consists of walking one space in one of the four cardinal directions. You cannot walk outside the grid, or walk into a wall.

If you walk over a key, you can pick it up and you cannot walk over a lock unless you have its corresponding key.

For some 1 <= k <= 6, there is exactly one lowercase and one uppercase letter of the first k letters of the English alphabet in the grid. This means that there is exactly one key for each lock, and one lock for each key; and also that the letters used to represent the keys and locks were chosen in the same order as the English alphabet.

Return the lowest number of moves to acquire all keys. If it is impossible, return -1.

 
Example 1

```
Input: grid = ["@.a..","###.#","b.A.B"]
Output: 8
Explanation: Note that the goal is to obtain all the keys not to open all the locks.

```

Example 2

```
Input: grid = ["@..aA","..B#.","....b"]
Output: 6
```

Example 3

```
Input: grid = ["@Aa"]
Output: -1

```

Constraints:

m == grid.length
n == grid[i].length
1 <= m, n <= 30
grid[i][j] is either an English letter, '.', '#', or '@'.
The number of keys in the grid is in the range [1, 6].
Each key in the grid is unique.
Each key in the grid has a matching lock.


## Solution 

BFS 

```python
class Solution:
    def shortestPathAllKeys(self, grid: List[str]) -> int:
        rows, cols = len(grid), len(grid[0])
        
        # find start pos and number of keys 
        start_r, start_c, keys = 0, 0, 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '@':
                    start_r, start_c = r, c
                elif grid[r][c].islower():
                    keys += 1
        
        # BFS
        queue = deque()
        queue.append((start_r, start_c, 0))
        visited = set()
        visited.add((start_r, start_c, 0))
        steps = 0
        while queue:
            size = len(queue)
            for _ in range(size):
                r, c, key = queue.popleft()
                if grid[r][c].islower():
                    key |= 1 << (ord(grid[r][c]) - ord('a'))
                
                if key == (1 << keys) - 1:
                    return steps

                # scan 4 directions 
                for nr, nc in [(r+1, c), (r-1, c), (r, c+1), (r, c-1)]:
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != '#':
                        if grid[nr][nc].isupper() and key & (1 << (ord(grid[nr][nc]) - ord('A'))) == 0:
                            continue
                        if (nr, nc, key) not in visited:
                            visited.add((nr, nc, key))
                            queue.append((nr, nc, key))
                        
            steps += 1
        return -1 # not found
```

