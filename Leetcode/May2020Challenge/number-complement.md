## Problem
[Number Complement](https://leetcode.com/explore/challenge/card/may-leetcoding-challenge/534/week-1-may-1st-may-7th/3319/)

## Problem Description
```
Given a positive integer, output its complement number. The complement strategy is to flip the bits of its binary representation.

 

 Example 1:

 Input: 5
 Output: 2
 Explanation: The binary representation of 5 is 101 (no leading zero bits), and its complement is 010. So you need to output 2.
  

  Example 2:

  Input: 1
  Output: 0
  Explanation: The binary representation of 1 is 1 (no leading zero bits), and its complement is 0. So you need to output 0.
   

   Note:

   The given integer is guaranteed to fit within the range of a 32-bit signed integer.
   You could assume no leading zero bit in the integer’s binary representation.
   This question is the same as 1009: https://leetcode.com/problems/complement-of-base-10-integer/

```

## Solution
To find complement number, observe that complete number, the binary only has 1s. 

ie.`7 (111)` `15(1111)` 

if we can find complete number, then the number complete = complete number - num.

to find complete number:
- complete start from 1, loop while num > complete, each iterate, `complete = complete * 2 + 1`
- when num <= complete, meaning complete found 
- return complete - num;

#### Code

```java
class Solution {
    public int findComplement(int num) {
        int complete = 1;
        while (num > complete) {
            complete = complete * 2 + 1;
        }
        return complete - num;
    }
}
```
