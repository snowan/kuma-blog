## Problem
[Cousins in Binary Tree](https://leetcode.com/explore/challenge/card/may-leetcoding-challenge/534/week-1-may-1st-may-7th/3322/)

## Problem Description
```
In a binary tree, the root node is at depth 0, and children of each depth k node are at depth k+1.

Two nodes of a binary tree are cousins if they have the same depth, but have different parents.

We are given the root of a binary tree with unique values, and the values x and y of two different nodes in the tree.

Return true if and only if the nodes corresponding to the values x and y are cousins.


Example 1:

    1
   / \
  2   3
 /   
4   

Input: root = [1,2,3,4], x = 4, y = 3
Output: false

Example 2:

       1
      / \
     2   3
      \   \
       4   5

Input: root = [1,2,3,null,4,null,5], x = 5, y = 4
Output: true

Example 3:

          1
         / \
        2   3
         \   
          4   


Input: root = [1,2,3,null,4], x = 2, y = 3
Output: false


Note:

The number of nodes in the tree will be between 2 and 100.
Each node has a unique integer value from 1 to 100.

```

## Solution
BFS -- level by level check whether current level encounter both x and y node, is yes, then compare their parents nodes.
- construct Node to store node x parent(int parent) and whether encountered(boolean isCurr)
- use queue to store all treenodes in the same level. ie. example 1, level 0 {1} level 1 {2, 3}, level 2 {4}
- for each level, we check whether next level node is x node, if yes, store in Node xn{curr.val, true}. 
- after one level traverse, check whether found x and y, if yes, compare parents
    - if x and y parents are the same, continue.
    - if x and y parents are not the same, then return true, already found 
    - if only found x or y, then return false.
- after traverse all nodes, then return fase. 

####Complexity Analysis

**Time Complexity:** `O(N)`

**Space Complexity:** `O(N)`

- N - the number of treenodes

#### Code

```java
class Solution {
    public boolean isCousins(TreeNode root, int x, int y) {
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            Node xn = null;
            Node yn = null;
            while (size-- > 0) {
                TreeNode curr = queue.poll();
                if (curr.left != null) {
                    queue.add(curr.left);
                    if (curr.left.val == x) xn = new Node(curr.val, true);
                    if (curr.left.val == y) yn = new Node(curr.val, true);
                }
                if (curr.right != null) {
                    queue.add(curr.right);
                    if (curr.right.val == x) xn = new Node(curr.val, true);
                    if (curr.right.val == y) yn = new Node(curr.val, true);
                }
            }
            if (xn != null && yn != null) {
              if (xn.parent != yn.parent) return true;
            } else if (xn != null || yn != null) return false;
        }
        return false;
    }
    class Node {
        int parent;
        boolean isCurr;
        public Node(int parent, boolean isCurr) {
            this.parent = parent;
            this.isCurr = isCurr;
        }
    }
}
```
