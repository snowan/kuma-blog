## Problem
[  Bitwise AND of Numbers Range](https://leetcode.com/explore/challenge/card/30-day-leetcoding-challenge/531/week-4/3308/)

## Problem Description
```
Given a range [m, n] where 0 <= m <= n <= 2147483647, return the bitwise AND of all numbers in this range, inclusive.

Example 1:

Input: [5,7]
Output: 4
Example 2:

Input: [0,1]
Output: 0
```

## Solution





#### Code

```java
class Solution {
    public int rangeBitwiseAnd(int m, int n) {
        if (m == 0) return 0;
        int shift = 0;
        while (m != n) {
            m >>= 1;
            n >>= 1;
            shift++;
        }
        return m << shift;
    }
}
```
