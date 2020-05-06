## Problem
[First Unique Character in a String](https://leetcode.com/explore/challenge/card/may-leetcoding-challenge/534/week-1-may-1st-may-7th/3320/)

## Problem Description
```
Given a string, find the first non-repeating character in it and return it's index. If it doesn't exist, return -1.

Examples:

s = "leetcode"
return 0.

s = "loveleetcode",
return 2.
Note: You may assume the string contain only lowercase letters.
```

## Solution
Straight solution, build a map of frequency, 
- build a map with [char:frequency] as <key, value> pair
- iterate through chars in string s, return index of the first char with frequency = 1, `map.get(ch)==1`

#### Code


```java
class Solution {
    public int firstUniqChar(String s) {
        if (s == null || s.length()) return -1;
        Map<Character, Integer> map = new HashMap<>();
        // build a map with char and frequency as <key, value> pair
        for (char ch : s.toCharArray()) {
            map.put(ch, map.getOrDefault(ch, 0) + 1);
        }
        // iterate through chars in s, return the index of the first char with frequency = 1
        for (int i = 0; i < s.length(); i++) {
            if (map.get(s.charAt(i)) == 1) return i;
        }
        return -1;
    }
}
```
