## Problem
https://leetcode.com/problems/number-of-longest-increasing-subsequence/description/

Given an integer array nums, return the number of longest increasing subsequences.

Notice that the sequence has to be strictly increasing.


Example 1:

Input: nums = [1,3,5,4,7]
Output: 2
Explanation: The two longest increasing subsequences are [1, 3, 4, 7] and [1, 3, 5, 7].

Example 2:

Input: nums = [2,2,2,2,2]
Output: 5
Explanation: The length of the longest increasing subsequence is 1, and there are 5 increasing subsequences of length 1, so output 5.
 

Constraints:

1 <= nums.length <= 2000
-106 <= nums[i] <= 106

## Solution

```python
class Solution:
    def findNumberOfLIS(self, nums: List[int]) -> int:
        if not nums or len(nums) == 0:
            return 0
        
        n, max_len, res = len(nums), 1, 0
        dp = [1] * n
        cnt = [1] * n
        
        for r in range(n):
            for l in range(r):
                # when right > left, found increase sequence, +1 
                if nums[r] > nums[l]:
                    if dp[l]+1 == dp[r]:
                        cnt[r] += cnt[l]
                    # only when left sequence + 1 > right sequence, right sequence +1
                    elif dp[l]+1 > dp[r]:
                        dp[r] = dp[l] + 1
                        cnt[r] = cnt[l]
            
            if max_len == dp[r]:
                res += cnt[r]
            if max_len < dp[r]:
                max_len = dp[r]
                res = cnt[r]
     
        return res

# 
# [1,3,5,4,7]
# dp = [1, 2, 3, 3, 4]
# cnt = [1, 1, 1, 1, 2]
```
