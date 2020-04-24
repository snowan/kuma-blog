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

This is a Bit operation problem, and I feel helpless every time when I see bit operation...
anyway, look at this problem, we can find out that it needed to bit AND to all the number for given range,
for example [4,5], it asking we do `4 (100) AND 5 (101) = 100 4(100)`, bit AND, only 1 & 1 = 1, otherwise is 0. 
for we can see we need to find out the highest common 1s(left most common 1s) in the range. 

i.e. [4,6] -- the left most common 1s is 100 = 4. 
```
 4     5    6
100   101  110
```

How to find the highest common 1s. 
- if `m != n`, left shift m and n, `m>>=1, n>>=1`
- count shifts for each shift
- until `m==n`, found left most common 1s, 
- the result is left most common 1s right shift shiftCounts.


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
