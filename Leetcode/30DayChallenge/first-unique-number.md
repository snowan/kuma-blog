## Problem
[First Unique Number](https://leetcode.com/explore/challenge/card/30-day-leetcoding-challenge/531/week-4/3313)

## Problem Description
```
You have a queue of integers, you need to retrieve the first unique integer in the queue.

Implement the FirstUnique class:

FirstUnique(int[] nums) Initializes the object with the numbers in the queue.
int showFirstUnique() returns the value of the first unique integer of the queue, and returns -1 if there is no such integer.
void add(int value) insert value to the queue.
 

Example 1:

Input: 
["FirstUnique","showFirstUnique","add","showFirstUnique","add","showFirstUnique","add","showFirstUnique"]
[[[2,3,5]],[],[5],[],[2],[],[3],[]]
Output: 
[null,2,null,2,null,3,null,-1]

Explanation: 
FirstUnique firstUnique = new FirstUnique([2,3,5]);
firstUnique.showFirstUnique(); // return 2
firstUnique.add(5);            // the queue is now [2,3,5,5]
firstUnique.showFirstUnique(); // return 2
firstUnique.add(2);            // the queue is now [2,3,5,5,2]
firstUnique.showFirstUnique(); // return 3
firstUnique.add(3);            // the queue is now [2,3,5,5,2,3]
firstUnique.showFirstUnique(); // return -1

Example 2:

Input: 
["FirstUnique","showFirstUnique","add","add","add","add","add","showFirstUnique"]
[[[7,7,7,7,7,7]],[],[7],[3],[3],[7],[17],[]]
Output: 
[null,-1,null,null,null,null,null,17]

Explanation: 
FirstUnique firstUnique = new FirstUnique([7,7,7,7,7,7]);
firstUnique.showFirstUnique(); // return -1
firstUnique.add(7);            // the queue is now [7,7,7,7,7,7,7]
firstUnique.add(3);            // the queue is now [7,7,7,7,7,7,7,3]
firstUnique.add(3);            // the queue is now [7,7,7,7,7,7,7,3,3]
firstUnique.add(7);            // the queue is now [7,7,7,7,7,7,7,3,3,7]
firstUnique.add(17);           // the queue is now [7,7,7,7,7,7,7,3,3,7,17]
firstUnique.showFirstUnique(); // return 17

Example 3:

Input: 
["FirstUnique","showFirstUnique","add","showFirstUnique"]
[[[809]],[],[809],[]]
Output: 
[null,809,null,-1]

Explanation: 
FirstUnique firstUnique = new FirstUnique([809]);
firstUnique.showFirstUnique(); // return 809
firstUnique.add(809);          // the queue is now [809,809]
firstUnique.showFirstUnique(); // return -1

 

Constraints:

1 <= nums.length <= 10^5
1 <= nums[i] <= 10^8
1 <= value <= 10^8
At most 50000 calls will be made to showFirstUnique and add.:x

```

## Solution
Using HashMap to keep track of number and the frequency, use Queue to store number in order. (FIFO -- first in first out).

when add(value), add value into Map, and check current value's frequency, if map.get(value) > 1, meaning not unique, not need to add into Queue.

when showFirstUnique(), check whether queue is empty:
- if queue.isEmpty(), then return -1.
- if queue is not empty, check queue's first value's frequency:
   - if first value's frequency > 1, then discard, until first value's frequency == 1, then return first value in queue.


There are other solutions like using LRU/LFU problem, using doubly linkedlist + hashmap to make all operation in `O(1)` time complexity.

For example: 

![First Unique Number](../../assets/leetcode/move-zeroes.png)

####Complexity Analysis

**Time Complexity:**
- add(value) - `O(1)`
- showFirstUnique() - `O(N)`

**Space Complexity:** `O(N)`

- N - the length of array nums

#### Code

```java
class FirstUnique {
    private Map<Integer, Integer> map;
    private Queue<Integer> queue;
    public FirstUnique(int[] nums) {
        map = new HashMap<>();
        queue = new LinkedList<>();
        for (int num : nums) {
            add(num);
        }
    }
    
    public int showFirstUnique() {
        if (queue.isEmpty()) return -1;
        while (!queue.isEmpty() && map.get(queue.peek()) > 1) {
            queue.poll();
        }
        return queue.isEmpty() ? -1 : queue.peek();
    }
    
    public void add(int value) {
        map.put(value, map.getOrDefault(value, 0) + 1);
        if (map.get(value) == 1) queue.add(value);
    }
}
```
