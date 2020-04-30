## Problem
[Binary Tree Maximum Path Sum](https://leetcode.com/explore/featured/card/30-day-leetcoding-challenge/532/week-5/3314/)

## Problem Description
```
Given a non-empty binary tree, find the maximum path sum.

For this problem, a path is defined as any sequence of nodes from some starting node to any node in the tree along the parent-child connections. The path must contain at least one node and does not need to go through the root.

Example 1:
Input: [1,2,3]
  1
 / \
2   3

Output: 6 (1+2+3)

Example 2:
Input: [-10,9,20,null,null,15,7]
  -10
   / \
  9  20
    /  \
   15   7

Output: 42(15+20+7)
```

## Solution
For this problem, we can define a global parameter max and init max = Integer.MIN_VALUE;
personally do not like it, in real industry project, not recommend this way though.
Personally perfer to define a class (object) to hold max value. below will post both code.

As problem described, maximum path sum go be left subtree, right subtree, or include left subtree + right subtree + root.val. 

Recursively iterate subtree,
- iterate left subtree,`if left < 0`, discard left value, keep 0. 
- iterate right subtree, `if right < 0`, discard right value, keep 0. 
- compute maximum value (3 possible calculations)
- `max = max(max, left + right + node.val)`
- `return max(left, right) + node.val;`


#### Code
**Code with global parameter**
```java
class Solution {
    private int max = Integer.MIN_VALUE;
    public int maxPathSum(TreeNode root) {
        if (root == null) return 0;
        helper(root);
        return max;
    }

    private int helper(TreeNode node) {
        if (node == null) return 0;
        int left = Math.max(0, helper(node.left));
        int right = Math.max(0, helper(node.right));
        // cross root value
        max = Math.max(max, left + right + node.val);
        // return left or right subtree maximum value and extend to root
        return Math.max(left, right) + node.val;
    }
}
```

**Code with class to hold object**
```java
class Solution {
    public int maxPathSum(TreeNode root) {
        if (root == null) return 0;
        return helper(root).res;
    }
        
    private Result helper(TreeNode root) {
        if (root == null) return new Result(0, Integer.MIN_VALUE);
        Result left = helper(root.left);
        Result right = helper(root.right);
        int max = Math.max(0, Math.max(left.max, right.max)) + root.val;
        int arch = Math.max(0, left.max) + Math.max(0, right.max) + root.val;
        int res = Math.max(Math.max(max, arch), Math.max(left.res, right.res));
        return new Result(max, res);
    }
            
    class Result {
       int max;
       int res;
       public Result(int max, int res) {
           this.max = max;
           this.res = res;
       }                    
    }
}
```
