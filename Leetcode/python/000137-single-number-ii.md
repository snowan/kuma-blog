## Problem

https://leetcode.com/problems/single-number-ii/description/

Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element and return it.

You must implement a solution with a linear runtime complexity and use only constant extra space.

 

Example 1:

Input: nums = [2,2,3,2]
Output: 3
Example 2:

Input: nums = [0,1,0,1,0,1,99]
Output: 99
 

Constraints:

1 <= nums.length <= 3 * 104
-231 <= nums[i] <= 231 - 1
Each element in nums appears exactly three times except for one element which appears once.


## Solution
#### 1. Brute force 

```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        freq_counter = collections.Counter(list(nums))
        res = [k for k, v in freq_counter.items() if v == 1]
        return res[0]
```

other solutions refrence https://leetcode.com/problems/single-number-ii/solutions/3714928/bit-manipulation-c-java-python-beginner-friendly/