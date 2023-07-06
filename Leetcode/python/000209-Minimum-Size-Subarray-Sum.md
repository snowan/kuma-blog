## Problem

https://leetcode.com/problems/minimum-size-subarray-sum/description/

Given an array of positive integers nums and a positive integer target, return the minimal length of a 
subarray
whose sum is greater than or equal to target. If there is no such subarray, return 0 instead.

 

Example 1:

Input: target = 7, nums = [2,3,1,2,4,3]
Output: 2
Explanation: The subarray [4,3] has the minimal length under the problem constraint.

Example 2:

Input: target = 4, nums = [1,4,4]
Output: 1

Example 3:

Input: target = 11, nums = [1,1,1,1,1,1,1,1]
Output: 0
 

Constraints:

1 <= target <= 109
1 <= nums.length <= 105
1 <= nums[i] <= 104
 

Follow up: If you have figured out the O(n) solution, try coding another solution of which the time complexity is O(n log(n)).

## Solution

 ```python
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        left, right = 0, 0
        sub_sum, min_len = 0, float('inf')
        while right < len(nums):
            sub_sum += nums[right]

            while sub_sum >= target:
                min_len = min(min_len, right-left+1)
                sub_sum -= nums[left]
                left += 1
            right += 1
        
        if min_len == float('inf'):
            return 0
        return min_len
        
 ```