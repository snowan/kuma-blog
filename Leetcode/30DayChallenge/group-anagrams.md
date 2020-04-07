## Problem
[Group Anagrams](https://leetcode.com/explore/challenge/card/30-day-leetcoding-challenge/528/week-1/3288/)

## Problem Description
```
Given an array of strings, group anagrams together.

Example:
Input: ["eat", "tea", "tan", "ate", "nat", "bat"],
Output:
[
  ["ate","eat","tea"],
  ["nat","tan"],
  ["bat"]
]

Note:

All inputs will be in lowercase.
The order of your output does not matter.
```

## Solution 1

1. sorted string alphabetically

2. sorted string as key, if after sorted, string is the same, put original string into list, group with the same sorted string. 

3. get result `new ArrayList<>(map.values());`

**Time complexity**: 
```
    O(NKlgK)
    N - the length of string array strs.
    K - the avg size of each string in strs. 
```

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        if (strs == null || strs.length == 0) return new ArrayList<>();
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            addInMap(map, s);
        }
        return new ArrayList<>(map.values());
    }
    
    private void addInMap(Map<String, List<String>> map, String s) {
        String newS = Stream.of(s.split(""))
					.sorted()
					.collect(Collectors.joining());

        map.computeIfAbsent(newS, k -> new ArrayList<>()).add(s);
    }
}

```

## Solution 2

From solution 1, we realize that if with the same anagram group, sorted string has the same value. 
How can we get the unique key without sorting original string. 
hash string, since all characters in string will be the same, calculate each character frequency into char array, 
get char array string value as key. 

```
for example:
["eat", "tea", "tan", "ate", "nat", "bat"]
"eat" - [e - 1, a - 1, t - 1], 
string key: 
a   e          t
100010000000...1

the rule, "tea" , "ate" will have the same key.
```

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        if (strs == null || strs.length == 0) return new ArrayList<>();
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            map.computeIfAbsent(formatKey(s), k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
    private String formatKey(String s) {
        char[] chs = new char[26];
        for (char c : s.toCharArray()) {
            chs[c - 'a']++;
        }
        return String.valueOf(chs);
    }
}
```
