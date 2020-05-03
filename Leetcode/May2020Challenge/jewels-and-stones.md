## Problem
[Jewels and Stones](https://leetcode.com/explore/challenge/card/may-leetcoding-challenge/534/week-1-may-1st-may-7th/3317/)

## Problem Description
```
You're given strings J representing the types of stones that are jewels, and S representing the stones you have.  Each character in S is a type of stone you have.  You want to know how many of the stones you have are also jewels.

The letters in J are guaranteed distinct, and all characters in J and S are letters. Letters are case sensitive, so "a" is considered a different type of stone from "A".

Example 1:

Input: J = "aA", S = "aAAbbbb"
Output: 3
Example 2:

Input: J = "z", S = "ZZ"
Output: 0
Note:

S and J will consist of letters and have length at most 50.
The characters in J are distinct.
```

## Solution
Using Hashset to store all types of jewels from J. 
iterate stones S, check each stone whether equals to jewels in HashSet, 
- if current stone in set, then count++;
- if current stone not in set, continue.


####Complexity Analysis

**Time Complexity:** `O(max(N, M))`

**Space Complexity:** `O(N)`

- N - length of string jewels J
- M - length of string stones S 

#### Code

```java
class Solution {
    public int numJewelsInStones(String J, String S) {
        if (J == null || S == null || S.length() == 0) return 0;
        int count = 0;
        Set<Character> set = new HashSet<>();
        for (char ch : J.toCharArray()) {
            set.add(ch);
        }
        for (char ch : S.toCharArray()) {
            if (set.contains(ch)) count++;
        }
        return count;
    }
}
```
