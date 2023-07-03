## Problem
https://leetcode.com/problems/buddy-strings/description/

Given two strings s and goal, return true if you can swap two letters in s so the result is equal to goal, otherwise, return false.

Swapping letters is defined as taking two indices i and j (0-indexed) such that i != j and swapping the characters at s[i] and s[j].

For example, swapping at indices 0 and 2 in "abcd" results in "cbad".
 

Example 1:

Input: s = "ab", goal = "ba"
Output: true
Explanation: You can swap s[0] = 'a' and s[1] = 'b' to get "ba", which is equal to goal.
Example 2:

Input: s = "ab", goal = "ab"
Output: false
Explanation: The only letters you can swap are s[0] = 'a' and s[1] = 'b', which results in "ba" != goal.
Example 3:

Input: s = "aa", goal = "aa"
Output: true
Explanation: You can swap s[0] = 'a' and s[1] = 'a' to get "aa", which is equal to goal.
 

Constraints:

1 <= s.length, goal.length <= 2 * 104
s and goal consist of lowercase letters.


## Solution

```python
class Solution:
    def buddyStrings(self, s: str, goal: str) -> bool:
        # 1. not same length or len < 2, return False
        # 2. if s == goal, check whether there are any repeatable letter, if yes, True, otherwise False
        # 3. for other cases, check diff letters, if len(diffs) >= 3, False. otherwise, pair[0] == reverse[pair[1]]
        if len(s) != len(goal):
            return False
        if s == goal:
            return len(set(s)) < len(s)
        diffs = [(a, b) for a, b in zip(s, goal) if a != b]
        return len(diffs) == 2 and diffs[0] == diffs[1][::-1]

```