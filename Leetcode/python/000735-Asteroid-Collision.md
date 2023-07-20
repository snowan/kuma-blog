
## Problem

https://leetcode.com/problems/asteroid-collision/description/

We are given an array asteroids of integers representing asteroids in a row.

For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.

Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.

 

Example 1:

Input: asteroids = [5,10,-5]
Output: [5,10]
Explanation: The 10 and -5 collide resulting in 10. The 5 and 10 never collide.

Example 2:

Input: asteroids = [8,-8]
Output: []
Explanation: The 8 and -8 collide exploding each other.

Example 3:

Input: asteroids = [10,2,-5]
Output: [10]
Explanation: The 2 and -5 collide resulting in -5. The 10 and -5 collide resulting in 10.
 

Constraints:

2 <= asteroids.length <= 104
-1000 <= asteroids[i] <= 1000
asteroids[i] != 0

## Solution

```python
class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        if not asteroids:
            return []
        stack = []
        for ast in asteroids:
            while stack and stack[-1] > 0 and ast < 0:
                diff = stack[-1] + ast
                # move right > left, keep right, discard left
                if diff > 0:
                    ast = 0
                # move right < left, keep left, discard right, pop stack 
                elif diff < 0:
                    stack.pop()
                else: # move right == left, discard both 
                    ast = 0
                    stack.pop()
            # only when asteroid not 0, add into stack
            if ast != 0:
                stack.append(ast)
        return stack

```