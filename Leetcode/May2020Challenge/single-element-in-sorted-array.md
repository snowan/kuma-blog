## Problem
[Single Element in a Sorted Array](https://leetcode.com/explore/featured/card/may-leetcoding-challenge/535/week-2-may-8th-may-14th/3327/)

## Problem Description
```
You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once. Find this single element that appears only once.

 

 Example 1:

 Input: [1,1,2,3,3,4,4,8,8]
 Output: 2
 Example 2:

 Input: [3,3,7,7,10,11,11]
 Output: 10
  

  Note: Your solution should run in O(log n) time and O(1) space.
```

## Solution
#### Solution 1
This problem has multiple solutions, first intuitive solution is O(n), scan the array, and check each elements, if element not appear 2 times, return current element. 

we can use bit or operation, `(a ^ a = 0)`, so if we do OR(^) operation for every element, the remaining element is single element.


####Complexity Analysis

**Time Complexity:** `O(N)`

**Space Complexity:** `O(1)`

- N - the length of array nums

#### Code
**Bites OR(^) operation solution**
```java
class Solution {
    public int singleNonDuplicate(int[] nums) {
        int res = 0;
        for (int n : nums) {
            res ^= n;
        }
        return res;
    }
}
```

#### Solution 2
Since it is in a sorted array, so think about wether we can solve it in `O(logn)`, and it also require to solve it in O(logn). question is in what condition to search left half and what condition search right half.

Notice that each element appears in array exactly 2 times and only 1 single element, so 
- if it is even position (i.e. index = 0, 2, 4...), if all elements appears 2 times, then current pos element must equal to next element. (`nums[curr] == nums[curr + 1]`)
- if it is odd position (curr) (i.e. index = 1, 3, 5...), if all elements appears 2 times, then current pos elements must equal to previous element, `nums[curr] == nums[curr - 1]`.
- what if not meet above 2 if condition, then meaning left half pattern broken, and single number is in left half. 
- if by far meet above 2 if conditions, then left half pattern not broken, search for right half.

Convert to equation: 
- `lo = 0, hi = len - 1`
- `mid = (lo + hi) / 2`
- `if (mid % 2 == 0 && nums[mid] == mid[mid + 1] || (mid % 2 == 1 && nums[mid] == nums[mid - 1])) left = mid + 1;`
- otherwise `right = mid;'
- until when `lo == hi, return nums[lo]`.

**Binary search solution**

```java
class Solution {
    public int singleNonDuplicate(int[] nums) {
        int lo = 0;
        int hi = nums.length - 1;
        while (lo < hi) {
            // calculate mid position, avoid overflow
            int mid = lo + (hi - lo) / 2;
            // check whether single number is in left half or right half,
            // if mid is odd and mid element equals to previous element (mid - 1)
            // if mid is even and mid element equals to next element (mid + 1)
            // if any above condition met, then left half elements appears 2 times, check right half
            if (mid % 2 == 0 && nums[mid] == nums[mid + 1]
                || (mid % 2 == 1 && nums[mid] == nums[mid - 1])) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return nums[lo];
    }
}
```

