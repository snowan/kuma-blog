## Problem
[Perform String Shifts](https://leetcode.com/explore/challenge/card/30-day-leetcoding-challenge/529/week-2/3299/)

## Problem Description
```
You are given a string s containing lowercase English letters, and a matrix shift, where shift[i] = [direction, amount]:

direction can be 0 (for left shift) or 1 (for right shift). 
amount is the amount by which string s is to be shifted.
A left shift by 1 means remove the first character of s and append it to the end.
Similarly, a right shift by 1 means remove the last character of s and add it to the beginning.
Return the final string after all operations.

 
Example 1:

Input: s = "abc", shift = [[0,1],[1,2]]
Output: "cab"
Explanation: 
[0,1] means shift to left by 1. "abc" -> "bca"
[1,2] means shift to right by 2. "bca" -> "cab"
Example 2:

Input: s = "abcdefg", shift = [[1,1],[1,1],[0,2],[1,3]]
Output: "efgabcd"
Explanation:  
[1,1] means shift to right by 1. "abcdefg" -> "gabcdef"
[1,1] means shift to right by 1. "gabcdef" -> "fgabcde"
[0,2] means shift to left by 2. "fgabcde" -> "abcdefg"
[1,3] means shift to right by 3. "abcdefg" -> "efgabcd"
 

Constraints:

1 <= s.length <= 100
s only contains lower case English letters.
1 <= shift.length <= 100
shift[i].length == 2
0 <= shift[i][0] <= 1
0 <= shift[i][1] <= 100
```

## Solution

Intuitive solution is to iterate through shifts, and perform shift operations. performance in this approach is `O(N * M)`. 

How can we improve performance? 

Think about when left shift i and then right shift i, the result is right cancels left shifts, for example, 

```
s = "abcdefg", shift = [[1,1],[0,1]]
[1,1] - right shift by 1, -> "gabcdef"
[0,1] - left shift by 1,  -> "abcdefg" -- notice it is origin string.

```

Now we know the same left shifts can be canceled by the same right shifts. it becomes easy to calculate total diff shifts between
left and right, at last perform one operation.

Note: `diff = diff % len(s)` -- diff is more than string length, no need to shift all.


For example: 

####Complexity Analysis

**Time Complexity:** `O(N + M)`

**Space Complexity:** `O(1)`

- N - the length of array shift
- M - avg length of string s

#### Code
**Java code**
```java
class Solution {
    public String stringShift(String s, int[][] shift) {
        // counts[0] -- left shift count
        // counts[1] -- right shift count
        int[] counts = new int[2];
        for (int[] sh : shift) {
            counts[sh[0]] += sh[1];
        }
        int len = s.length();
        // diff shift % len(s)
        int diff = ((counts[0] - counts[1])) % len;
        
        if (diff == 0) return s;
        // if diff > 0, left shifts, else right shifts
        return diff > 0 ? s.substring(diff) + s.substring(0, diff)
            : s.substring(len + diff) + s.substring(0, len + diff);
    }
}
```

