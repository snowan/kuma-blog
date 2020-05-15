## Problem
[Implement Trie(prefix Tree)](https://leetcode.com/explore/challenge/card/may-leetcoding-challenge/535/week-2-may-8th-may-14th/3329/)

## Problem Description
```
```

## Solution
First understand what is trie, please read [Trie (Wiki)](https://en.m.wikipedia.org/wiki/Trie). 

Now define TrieNode with char, isWord, children. 
1. do insert:
    - iterate through each char in word, check whether current char ch in current node's children. if not, create new TrieNode(ch), put into current node children, other wise do nothing 
    - then reset current node as curr.children.get(ch).
    - after word, set current node isWord = true.
2. do search:
    - iterate through each char in word, for each ch:
        - if ch is in current node children, continue, if not in current node's children, return false. terminate early. 
        - reset current node as curr.children.get(ch), (go next level)
        - until at last char, check current node isWord is true or not, if isWord = true, return true. otherwise no word in trie. 
3. do prefix search:
    - same search steps as search word. 
    - at last step, return true (meaning it has prefix, do need to check isWord).



For example:

![Implement Trie](../../assets/leetcode/implement-trie.png)

####Complexity Analysis

**insert(word)**: `O(n) -- n is the length of word`

**search(word)**: `O(n) -- n is the length of word`

#### Code

```java
class Trie {
    TrieNode root;
    /** Initialize your data structure here. */
   public Trie() {
        root = new TrieNode();
   }
            
   /** Inserts a word into the trie. */
   public void insert(String word) {
       TrieNode curr = root;
       for (char ch : word.toCharArray()) {
            if (!curr.children.containsKey(ch)) {
                 curr.children.put(ch, new TrieNode(ch));
                                        
            }
            curr = curr.children.get(ch);
                           
       }
       curr.isWord = true;
   }
       
   /** Returns if the word is in the trie. */
   public boolean search(String word) {
       return isWordOrPrefix(word, true);
   }
               
   /** Returns if there is any word in the trie that starts with the given prefix. */
   public boolean startsWith(String prefix) {
       return isWordOrPrefix(prefix, false);
   }
       
   private boolean isWordOrPrefix(String prefix, boolean isWord) {
       TrieNode curr = root;
       for (char ch : prefix.toCharArray()) {
           if (!curr.children.containsKey(ch)) return false;
               curr = curr.children.get(ch);
       }
       return isWord ? curr.isWord : true; 
   }
       
}

class TrieNode {
    char ch;
    boolean isWord;
    Map<Character, TrieNode> children;
    public TrieNode(char ch) {
        this.ch = ch;
        isWord = false;
        children = new HashMap<>();
    }
    public TrieNode() {
       isWord = false;
       children = new HashMap<>();
    }
}

/**
 * Your Trie object will be instantiated and called as such:
 * Trie obj = new Trie();
 * obj.insert(word);
 * boolean param_2 = obj.search(word);
 * boolean param_3 = obj.startsWith(prefix);
 */
``
