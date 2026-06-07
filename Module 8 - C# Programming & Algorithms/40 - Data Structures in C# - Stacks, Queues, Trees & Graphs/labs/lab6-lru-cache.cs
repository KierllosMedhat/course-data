using System;
using System.Collections.Generic;

namespace DataStructures.Labs
{
    // TODO: Implement the Least Recently Used (LRU) Cache
    // Requirements:
    // - Get(key) and Put(key, value) must run in O(1) average time complexity.
    // - Use a Dictionary<int, LinkedListNode<CacheItem>> for O(1) lookups.
    // - Use a Doubly LinkedList (System.Collections.Generic.LinkedList<CacheItem>)
    //   to track the order of recently accessed elements.
    public class LRUCache
    {
        private class CacheItem
        {
            public int Key { get; }
            public int Value { get; set; }
            public CacheItem(int key, int value)
            {
                Key = key;
                Value = value;
            }
        }

        private readonly int _capacity;
        private readonly Dictionary<int, LinkedListNode<CacheItem>> _cacheMap = new Dictionary<int, LinkedListNode<CacheItem>>();
        private readonly LinkedList<CacheItem> _list = new LinkedList<CacheItem>();

        public LRUCache(int capacity)
        {
            _capacity = capacity;
        }

        public int Get(int key)
        {
            // TODO: Implement Get logic
            // If the key is not in the dictionary, return -1.
            // If it exists, move the corresponding node to the front of the list (most recently used),
            // and return its value.
            return -1; // Placeholder
        }

        public void Put(int key, int value)
        {
            // TODO: Implement Put logic
            // If the key already exists, update its value and move its node to the front of the list.
            // If the key does not exist:
            //   - Check if the cache is at capacity. If so, remove the last node from the list (least recently used)
            //     and delete its entry from the dictionary.
            //   - Create a new CacheItem, add it to the front of the list, and insert the node into the dictionary.
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== LRU Cache Lab ===");

            LRUCache cache = new LRUCache(2);

            // TODO: Test your LRUCache implementation.
            // Example:
            // cache.Put(1, 1);
            // cache.Put(2, 2);
            // Console.WriteLine(cache.Get(1));       // returns 1
            // cache.Put(3, 3);                        // evicts key 2
            // Console.WriteLine(cache.Get(2));       // returns -1 (not found)
            // cache.Put(4, 4);                        // evicts key 1
            // Console.WriteLine(cache.Get(1));       // returns -1 (not found)
            // Console.WriteLine(cache.Get(3));       // returns 3
            // Console.WriteLine(cache.Get(4));       // returns 4
        }
    }
}
