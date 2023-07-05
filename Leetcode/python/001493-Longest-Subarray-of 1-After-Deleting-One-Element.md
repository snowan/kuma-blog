
## Problem

https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/description/

Given a binary array nums, you should delete one element from it.

Return the size of the longest non-empty subarray containing only 1's in the resulting array. Return 0 if there is no such subarray.


Example 1:

Input: nums = [1,1,0,1]
Output: 3
Explanation: After deleting the number in position 2, [1,1,1] contains 3 numbers with value of 1's.

Example 2:

Input: nums = [0,1,1,1,0,1,1,0,1]
Output: 5
Explanation: After deleting the number in position 4, [0,1,1,1,1,1,0,1] longest subarray with value of 1's is [1,1,1,1,1].

Example 3:

Input: nums = [1,1,1]
Output: 2
Explanation: You must delete one element.
 

Constraints:

1 <= nums.length <= 105
nums[i] is either 0 or 1.

## Solution
keep track of pre_sum of 1's appears before 0, curr_sum appears after 0 and before the second 0. 

calculate result when encounter 0, and reset curr_sum for next cumulate 

```python
class Solution:
    def longestSubarray(self, nums: List[int]) -> int:
        pre_sum, curr_sum, has_zero, res = 0, 0, False, 0
        for num in nums:
            if num == 1:
                curr_sum += 1
            if num == 0:
                has_zero = True
                res = max(pre_sum + curr_sum, res)
                pre_sum = curr_sum
                curr_sum = 0
        res = max(pre_sum + curr_sum, res)
        return res if has_zero else res - 1
```