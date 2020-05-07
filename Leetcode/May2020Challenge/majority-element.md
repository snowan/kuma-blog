## Problem
[Majority Element](https://leetcode.com/explore/challenge/card/may-leetcoding-challenge/534/week-1-may-1st-may-7th/3321/)

## Problem Description
```
Given an array of size n, find the majority element. The majority element is the element that appears more than ⌊ n/2 ⌋ times.

You may assume that the array is non-empty and the majority element always exist in the array.

Example 1:

Input: [3,2,3]
Output: 3
Example 2:

Input: [2,2,1,1,1,2,2]
Output: 2
```

## Solution

#### Solution 1 -- HashMap
Using HashMap to store each element with its frequency as <key, value> pair. 
- iterate through array nums, add each number and its frequency into map 
- after add into map, check whether current element frequency already greater than [n/2],
    - if already, then terminate return current element.
    - if not, continue.
since it is already assumed that array is non-empty, and always has majority element exist, so during iterate, majority element must find. 


####Complexity Analysis

**Time Complexity:** `O(N)`

**Space Complexity:** `O(N)`

- N - length of array nums 

#### Code

```java
class Solution {
    public int majorityElement(int[] nums) {
        int len = nums.length;
        Map<Integer, Integer> map = new HashMap<>();
        for (int num : nums) {
            map.put(num, map.getOrDefault(num, 0) + 1);
            // check current element frequency 
            if (map.get(num) > len / 2) return num;
        }
        // should not be reached
        return 0;
    }
}
```

#### Solution 2 -- Boyer-Moor voting algorithm 
Assume that we maintain a candidate and count, iterate through array nums:
- We check count, if we found count == 0, reset candidate = num (current element)
- at the same time, we check current element num == candidate, 
    - if num == candidate, then count + 1;
    - if num != candidate, then count - 1
- at last, remain candidate is majority element.

####Complexity Analysis

**Time Complexity:** `O(N)`

**Space Complexity:** `O(1)`

- N - the length of array nums

#### Code -- Boyer-Moor voting algorithm
```java
class Solution {
    public int majorityElement(int[] nums) {
        int count = 0;
        int candidate = nums[0];
        for (int num : nums) {
            // check current count, if count = 0, reset candidate to current element
            if (count == 0) candidate = num;
            // calculate count
            count += candidate == num ? 1 : (-1);
        }
        // last candidate is majority element
        return candidate;
    }
}
```


