## Problem

https://leetcode.com/problems/maximum-profit-in-job-scheduling/description/

We have n jobs, where every job is scheduled to be done from startTime[i] to endTime[i], obtaining a profit of profit[i].

You're given the startTime, endTime and profit arrays, return the maximum profit you can take such that there are no two jobs in the subset with overlapping time range.

If you choose a job that ends at time X you will be able to start another job that starts at time X.

 

Example 1:

Input: startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]
Output: 120
Explanation: The subset chosen is the first and fourth job. 
Time range [1-3]+[3-6] , we get profit of 120 = 50 + 70.

Example 2:

Input: startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,70,60]
Output: 150
Explanation: The subset chosen is the first, fourth and fifth job. 
Profit obtained 150 = 20 + 70 + 60.

Example 3:

Input: startTime = [1,1,1], endTime = [2,3,4], profit = [5,6,4]
Output: 6
 

Constraints:

1 <= startTime.length == endTime.length == profit.length <= 5 * 104
1 <= startTime[i] < endTime[i] <= 109
1 <= profit[i] <= 104

## Solution

```python

class Solution:
    def jobScheduling(self, startTime: List[int], endTime: List[int], profit: List[int]) -> int:
        if not startTime:
            return 0
        # sort job by endtime jobs = [endtime, starttime, profit]
        jobs = sorted(zip(endTime, startTime, profit))
        print("jobs== ", jobs)

        n = len(jobs)
        # max profit at ith job
        dp = [0] * n
        dp[0] = jobs[0][2]
        # iterate all jobs
        for i in range(1, n):
            # not pick up ith job
            dp[i] = dp[i-1]
            # pick up ith job, 
            # search previous job end time <= current job start time.
            # since end time is sorted, do binary search 
            prev_idx = bisect.bisect_left(jobs, (jobs[i][1]+1, 0, 0))
            if prev_idx == 0:
                dp[i] = max(dp[i-1], jobs[i][2])
            else:
                dp[i] = max(dp[i], dp[prev_idx-1] + jobs[i][2])
        
        return dp[-1]
```
