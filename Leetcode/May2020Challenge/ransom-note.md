## Problem
[Ransom Note](https://leetcode.com/explore/featured/card/may-leetcoding-challenge/534/week-1-may-1st-may-7th/3318/)

## Problem Description
```
Given an arbitrary ransom note string and another string containing letters from all the magazines, write a function that will return true if the ransom note can be constructed from the magazines ; otherwise, it will return false.

Each letter in the magazine string can only be used once in your ransom note.

Note:
You may assume that both strings contain only lowercase letters.

canConstruct("a", "b") -> false
canConstruct("aa", "ab") -> false
canConstruct("aa", "aab") -> true
```

## Solution
This problem is to check whether magazine contains all char in ransomNote, 
- if magazine contains all characters in ransomNote, then true
- otherwise any character in ransomNote but not in magazine, return false.

Using Map to keep char and frequency as <key, value> pair in map. 
- Iterate magazine characters, add characters and frequency into map
- Iterate ransomNote, check each character, if not exist in map or current frequency in map <= 0, then return false. otherwise continue.
- For each visit, in map, put frequency - 1 back into map, continue
- when done iterate ransomNote, all chars in map (in magazine)

####Complexity Analysis

**Time Complexity:** `O(N)`

**Space Complexity:** `O(N)`

- N - Max (ransom note length, magazine length)

#### Code

```java
class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        if (ransomNote == null || ransomNote == null && magazine == null) return true;
        if (magazine == null) return false;
        
        Map<Character, Integer> map = new HashMap<>();
        for (char ch : magazine.toCharArray()) {
            map.put(ch, map.getOrDefault(ch, 0) + 1);
        }
        for (char ch : ransomNote.toCharArray()) {
            if (!map.containsKey(ch) || map.get(ch) <= 0) return false;
            map.put(ch, map.get(ch) - 1);
        }

        return true;
    }   
}
```
