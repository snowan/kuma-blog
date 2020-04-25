## Problem
[LRC Cache](https://leetcode.com/explore/challenge/card/30-day-leetcoding-challenge/531/week-4/3309/)

## Problem Description
```
Design and implement a data structure for Least Recently Used (LRU) cache. It should support the following operations: get and put.

get(key) - Get the value (will always be positive) of the key if the key exists in the cache, otherwise return -1.
put(key, value) - Set or insert the value if the key is not already present. When the cache reached its capacity, it should invalidate the least recently used item before inserting a new item.

The cache is initialized with a positive capacity.

Follow up:
Could you do both operations in O(1) time complexity?

Example:

LRUCache cache = new LRUCache( 2 /* capacity */ );

cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // returns 1
cache.put(3, 3);    // evicts key 2
cache.get(2);       // returns -1 (not found)
cache.put(4, 4);    // evicts key 1
cache.get(1);       // returns -1 (not found)
cache.get(3);       // returns 3
cache.get(4);       // returns 4
```

## Solution
#### Solution 1 -- Java LinkedHashMap

Make use of Java library, LinkedHashMap, ordered and keep track of map size. 
- when insert into new (key,value) into map, check map already reach capacity or not:
    - if reach capacity, then remove last value from map, insert (key, value) into head of map
    - if not reach capacity, insert into head of map
- when fetch value by key, check whether key in map or not:
    - if key not in map, return -1
    - if key in map, get value by key, remove current key from map, insert current key into head of map

####Complexity Analysis

**Time Complexity:** `O(N)`

**Space Complexity:** `O(M)`

- N - N operation times
- M - M is the capacity

#### Code

```java
class LRUCache {
    private LinkedHashMap<Integer, Integer> map;
    private int capacity;
    public LRUCache(int capacity) {
        map = new LinkedHashMap<>(capacity);
        this.capacity = capacity;
    }
    
    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        int value = map.remove(key);
        map.put(key, value);
        return value;
    }
    
    public void put(int key, int value) {
        if (map.containsKey(key)) {
            map.remove(key);
        } else if (map.size() >= capacity) {
            map.remove(map.keySet().iterator().next());
        }
        map.put(key, value);
    }
}

```

#### Solution 2 -- double linkedlist + hashmap


```java
public class LRUCache {
    private Map<Integer, DoubleLinkedList> map;
    private int capacity;
    private DoubleLinkedList head;
    private DoubleLinkedList tail;
    public LRUCache(int capacity) {
        map = new HashMap<>(capacity);
        this.capacity = capacity;
    }
    
    public int get(int key) {
        // if key not in map, return -1
        if (!map.containsKey(key)) return -1;
        // if key in map, remove current node, insert current node into head
        DoubleLinkedList node = map.get(key);
        remove(node);
        setHead(node);
        return node.val;
    }
    
    public void put(int key, int value) {
        // if key in map, remove current node, and insert into head
        if (map.containsKey(key)) {
            DoubleLinkedList node = map.get(key);
            remove(node);
            node.val = value;
            setHead(node);
        } else {
            // key not in map, check current map is already reach capacity,
            // if yes, then remove last node, and insert current node into head
            // if not, insert current node into head
            // put current node into map
            DoubleLinkedList newNode = new DoubleLinkedList(key, value);
            if (map.size() >= capacity) {
                map.remove(tail.key);
                remove(tail);
            } 
            setHead(newNode);
            map.put(key, newNode);
        }
    }
    
    private void remove(DoubleLinkedList node) {
        if (node.pre != null) {
            node.pre.next = node.next;
        } else {
            head = node.next;
        }
        if (node.next != null) {
            node.next.pre = node.pre;
        } else {
            tail = node.pre;
        }
    }
    
    private void setHead(DoubleLinkedList node) {
        node.pre = null;
        node.next = head;
        if (head != null) {
            head.pre = node;
        }
        head = node;
        if (tail == null) {
            tail = head;
        }
    }
    
    class DoubleLinkedList {
        int key;
        int val;
        DoubleLinkedList pre;
        DoubleLinkedList next;
        public DoubleLinkedList(int key, int val) {
            this.key = key;
            this.val = val;
        }
    }
}
```

