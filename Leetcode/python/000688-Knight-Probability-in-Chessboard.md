## Problem

https://leetcode.com/problems/knight-probability-in-chessboard/description/

On an n x n chessboard, a knight starts at the cell (row, column) and attempts to make exactly k moves. The rows and columns are 0-indexed, so the top-left cell is (0, 0), and the bottom-right cell is (n - 1, n - 1).

A chess knight has eight possible moves it can make, as illustrated below. Each move is two cells in a cardinal direction, then one cell in an orthogonal direction.


Each time the knight is to move, it chooses one of eight possible moves uniformly at random (even if the piece would go off the chessboard) and moves there.

The knight continues moving until it has made exactly k moves or has moved off the chessboard.

Return the probability that the knight remains on the board after it has stopped moving.


Example 1:

Input: n = 3, k = 2, row = 0, column = 0
Output: 0.06250
Explanation: There are two moves (to (1,2), (2,1)) that will keep the knight on the board.
From each of those positions, there are also two moves that will keep the knight on the board.
The total probability the knight stays on the board is 0.0625.

Example 2:

Input: n = 1, k = 0, row = 0, column = 0
Output: 1.00000
 

Constraints:

1 <= n <= 25
0 <= k <= 100
0 <= row, column <= n - 1

## Solution

Idea is to calculate sum of all posibilities that after k moves, knight still on the board. 

total possible with k moves = 8^k

probability = sum of all valid moves / total k moves

```python
class Solution:
    def knightProbability(self, n: int, k: int, row: int, column: int) -> float:
        DIRS = [(2,1),(-2,1),(2,-1),(-2,-1),(1,2),(1,-2),(-1,2),(-1,-2)]

        cache = {}
        
        def dp(r, c, remain):
            if (r, c, remain) in cache:
                return cache[(r,c,remain)]
            if not (0 <= r < n and 0 <= c < n):
                return 0
            
            if remain == 0:
                return 1
            
            pos = 0
            for dr, dc in DIRS:
                nr, nc = r + dr, c + dc
                pos += dp(nr, nc, remain-1)
            cache[(r,c,remain)] = pos
            return pos

        return dp(row, column, k) / (8**k)
```