## Problem

https://leetcode.com/problems/longest-valid-parentheses/description/

Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses 
substring
.

 

Example 1:

Input: s = "(()"
Output: 2
Explanation: The longest valid parentheses substring is "()".

Example 2:

Input: s = ")()())"
Output: 4
Explanation: The longest valid parentheses substring is "()()".

Example 3:

Input: s = ""
Output: 0
 

Constraints:

0 <= s.length <= 3 * 104
s[i] is '(', or ')'.

## Solution
using stack to keep track index of every '(' 

```python
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        max_len = 0
        # init with a start index 
        stack = [-1]
        for idx in range(len(s)):
            # when encounter of '(', put index into stack, keep track of index of '('
            if s[idx] == '(':
                stack.append(idx)
            else:
                # when encounter ')', pop out top index
                stack.pop()
                # if stack is empty (notice already init -1), indicates no valid cases at this point, continue 
                if not stack:
                    stack.append(idx)
                else: # if stack not empty, keep tracking max_length of the valid cases 
                    max_len = max(max_len, idx - stack[-1])

        return max_len
```
