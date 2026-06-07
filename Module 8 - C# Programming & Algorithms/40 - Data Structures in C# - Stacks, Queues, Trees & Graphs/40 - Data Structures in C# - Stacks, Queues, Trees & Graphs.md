# Module 39: Data Structures in C# - Stacks, Queues, Trees & Graphs

## 1. Prerequisites
Before starting this module, you should be comfortable with:
- **C# Fundamentals**: Variables, loops, conditionals, and methods.
- **Object-Oriented Programming**: Classes, objects, inheritance, and interfaces.
- **Generics in C#**: Understanding `<T>` to create reusable and type-safe components.
- **Standard C# Collections**: Familiarity with `List<T>`, `Dictionary<TKey, TValue>`, and basic arrays from the previous module.
- **Memory Management Basics**: Basic understanding of value types (stack) vs. reference types (heap), and how the Garbage Collector works in .NET.

## 2. Objectives
By the end of this module, you will be able to:
1. **Understand Under-the-Hood Mechanisms**: Comprehend how foundational data structures operate in memory.
2. **Build Custom Stacks and Queues**: Implement your own generic stack and queue classes from scratch using arrays and linked nodes.
3. **Master Linked Lists**: Understand singly and doubly linked lists, and build them from the ground up to handle dynamic data insertion and deletion.
4. **Explore Binary Trees**: Grasp the concept of hierarchical data, implement a basic Binary Search Tree (BST), and traverse it (In-order, Pre-order, Post-order).
5. **Introduce Graphs**: Understand graph terminology (vertices, edges, directed/undirected) and implement an adjacency list representation in C#.
6. **Analyze Time and Space Complexity**: Evaluate the Big O notation for operations on these data structures to make informed choices in your applications.

## 3. Agenda
1. **Introduction to Custom Data Structures** (30 mins)
   - Why build custom structures when C# has them built-in?
   - Array-based vs. Node-based structures.
2. **Deep Dive: Linked Lists** (60 mins)
   - Singly Linked Lists.
   - Doubly Linked Lists.
   - Building a `CustomLinkedList<T>`.
3. **Deep Dive: Stacks** (45 mins)
   - LIFO principle.
   - Array-based and Node-based implementation.
4. **Deep Dive: Queues** (45 mins)
   - FIFO principle.
   - Array-based (circular array) and Node-based implementation.
5. **Deep Dive: Trees** (90 mins)
   - Terminology: Root, Node, Leaf, Edge, Height, Depth.
   - Binary Search Trees (BST).
   - Traversals.
6. **Deep Dive: Graphs** (90 mins)
   - Graph representations: Adjacency Matrix vs. Adjacency List.
   - Graph traversals: BFS and DFS basics.
7. **Think Like a Dev & Before/After Scenarios** (30 mins)
8. **Labs & Interview Prep** (120 mins)

## 4. Deep Dive

### 4.1. Why Build Custom Data Structures?
While C# provides excellent built-in collections in the `System.Collections.Generic` namespace, building them from scratch is crucial for several reasons:
- **Performance Tuning**: Sometimes built-in collections carry overhead you don't need. A highly specialized structure can out-perform generic ones in critical paths.
- **Memory Layout**: Understanding how elements are linked or stored contiguously helps prevent memory fragmentation and improves cache locality.
- **Interview Readiness**: Almost all technical interviews at top-tier companies require implementing or heavily manipulating custom data structures.

### 4.2. Linked Lists
A linked list is a linear data structure where elements are not stored at contiguous memory locations. Instead, each element (node) contains a data part and a reference (link) to the next node.

#### Singly Linked List Node
```csharp
public class Node<T>
{
    public T Data { get; set; }
    public Node<T> Next { get; set; }

    public Node(T data)
    {
        Data = data;
        Next = null;
    }
}
```

#### Custom Singly Linked List Implementation
Let's build a fully functional singly linked list from scratch.

```csharp
using System;

public class CustomLinkedList<T>
{
    public Node<T> Head { get; private set; }
    public Node<T> Tail { get; private set; }
    public int Count { get; private set; }

    // Add to the end of the list
    public void AddLast(T data)
    {
        Node<T> newNode = new Node<T>(data);
        if (Head == null)
        {
            Head = newNode;
            Tail = newNode;
        }
        else
        {
            Tail.Next = newNode;
            Tail = newNode;
        }
        Count++;
    }

    // Add to the beginning of the list
    public void AddFirst(T data)
    {
        Node<T> newNode = new Node<T>(data);
        if (Head == null)
        {
            Head = newNode;
            Tail = newNode;
        }
        else
        {
            newNode.Next = Head;
            Head = newNode;
        }
        Count++;
    }

    // Remove the first occurrence of a specific item
    public bool Remove(T data)
    {
        if (Head == null) return false;

        if (Head.Data.Equals(data))
        {
            Head = Head.Next;
            if (Head == null) Tail = null; // List became empty
            Count--;
            return true;
        }

        Node<T> current = Head;
        while (current.Next != null)
        {
            if (current.Next.Data.Equals(data))
            {
                current.Next = current.Next.Next;
                if (current.Next == null) Tail = current; // Removed the last item
                Count--;
                return true;
            }
            current = current.Next;
        }
        return false;
    }

    public void PrintList()
    {
        Node<T> current = Head;
        while (current != null)
        {
            Console.Write(current.Data + " -> ");
            current = current.Next;
        }
        Console.WriteLine("null");
    }
}
```
**Time Complexity**: AddFirst is O(1), AddLast is O(1) (because we maintain a `Tail` pointer), Remove is O(N).

### 4.3. Stacks
A Stack is a LIFO (Last-In, First-Out) data structure. Think of it like a stack of plates: you can only add to the top and remove from the top.

#### Array-based Stack Implementation
Arrays provide fast contiguous memory access. However, they need resizing.

```csharp
using System;

public class CustomStack<T>
{
    private T[] _items;
    private int _count;
    private const int DefaultCapacity = 4;

    public int Count => _count;

    public CustomStack(int capacity = DefaultCapacity)
    {
        _items = new T[capacity];
        _count = 0;
    }

    public void Push(T item)
    {
        if (_count == _items.Length)
        {
            ResizeArray();
        }
        _items[_count] = item;
        _count++;
    }

    public T Pop()
    {
        if (_count == 0)
            throw new InvalidOperationException("Stack is empty");
        
        _count--;
        T item = _items[_count];
        _items[_count] = default(T); // Clear reference for GC
        return item;
    }

    public T Peek()
    {
        if (_count == 0)
            throw new InvalidOperationException("Stack is empty");
        
        return _items[_count - 1];
    }

    private void ResizeArray()
    {
        T[] newArray = new T[_items.Length * 2];
        Array.Copy(_items, newArray, _items.Length);
        _items = newArray;
    }
}
```
**Why resize by 2?** This ensures amortized O(1) time complexity for Push operations. 

#### Linked-List-based Stack Implementation
Alternatively, a stack can be implemented using a singly linked list where elements are inserted and removed from the `Head`. This avoids resizing overhead but incurs memory allocation overhead per node.

```csharp
public class NodeStack<T>
{
    private class StackNode
    {
        public T Data;
        public StackNode Next;
        public StackNode(T data) { Data = data; }
    }

    private StackNode _top;
    public int Count { get; private set; }

    public void Push(T item)
    {
        var newNode = new StackNode(item);
        newNode.Next = _top;
        _top = newNode;
        Count++;
    }

    public T Pop()
    {
        if (_top == null) throw new InvalidOperationException("Stack is empty.");
        T data = _top.Data;
        _top = _top.Next;
        Count--;
        return data;
    }
}
```

### 4.4. Queues
A Queue is a FIFO (First-In, First-Out) data structure. Think of it like a line at a grocery store.

#### Linked-List-based Queue
```csharp
public class CustomQueue<T>
{
    private class QueueNode
    {
        public T Data;
        public QueueNode Next;
        public QueueNode(T data) { Data = data; }
    }

    private QueueNode _head;
    private QueueNode _tail;
    public int Count { get; private set; }

    public void Enqueue(T item)
    {
        var newNode = new QueueNode(item);
        if (_tail != null)
        {
            _tail.Next = newNode;
        }
        _tail = newNode;
        if (_head == null)
        {
            _head = newNode;
        }
        Count++;
    }

    public T Dequeue()
    {
        if (_head == null) throw new InvalidOperationException("Queue is empty");
        T data = _head.Data;
        _head = _head.Next;
        if (_head == null)
        {
            _tail = null;
        }
        Count--;
        return data;
    }
}
```
**Time Complexity**: Enqueue O(1), Dequeue O(1).

### 4.5. Trees (Binary Search Tree)
A Tree is a hierarchical data structure. The most common variation is the Binary Tree, where each node has at most two children. A Binary Search Tree (BST) has the property that the left child is less than the parent, and the right child is greater.

#### BST Node
```csharp
public class TreeNode<T> where T : IComparable<T>
{
    public T Value { get; set; }
    public TreeNode<T> Left { get; set; }
    public TreeNode<T> Right { get; set; }

    public TreeNode(T value)
    {
        Value = value;
    }
}
```

#### BST Implementation
```csharp
public class BinarySearchTree<T> where T : IComparable<T>
{
    public TreeNode<T> Root { get; private set; }

    public void Insert(T value)
    {
        Root = InsertRecursive(Root, value);
    }

    private TreeNode<T> InsertRecursive(TreeNode<T> node, T value)
    {
        if (node == null)
        {
            return new TreeNode<T>(value);
        }

        if (value.CompareTo(node.Value) < 0)
        {
            node.Left = InsertRecursive(node.Left, value);
        }
        else if (value.CompareTo(node.Value) > 0)
        {
            node.Right = InsertRecursive(node.Right, value);
        }

        return node;
    }

    public bool Contains(T value)
    {
        return ContainsRecursive(Root, value);
    }

    private bool ContainsRecursive(TreeNode<T> node, T value)
    {
        if (node == null) return false;

        if (value.CompareTo(node.Value) == 0) return true;
        if (value.CompareTo(node.Value) < 0) return ContainsRecursive(node.Left, value);
        
        return ContainsRecursive(node.Right, value);
    }

    // In-Order Traversal (Left, Root, Right)
    public void PrintInOrder()
    {
        InOrderRecursive(Root);
        Console.WriteLine();
    }

    private void InOrderRecursive(TreeNode<T> node)
    {
        if (node != null)
        {
            InOrderRecursive(node.Left);
            Console.Write(node.Value + " ");
            InOrderRecursive(node.Right);
        }
    }
}
```
**Why use BST?** Search, Insert, and Delete operations operate in O(log N) time on average. However, if the tree becomes unbalanced (e.g., inserting sorted data), it degrades to O(N) like a linked list. This leads to advanced structures like AVL or Red-Black trees.

### 4.6. Graphs
A Graph consists of vertices (nodes) and edges (connections). Graphs can be directed (one-way streets) or undirected.

#### Adjacency List Representation
An adjacency list represents a graph as an array (or dictionary) of linked lists.

```csharp
using System.Collections.Generic;

public class Graph<T>
{
    private Dictionary<T, List<T>> _adjacencyList;

    public Graph()
    {
        _adjacencyList = new Dictionary<T, List<T>>();
    }

    public void AddVertex(T vertex)
    {
        if (!_adjacencyList.ContainsKey(vertex))
        {
            _adjacencyList[vertex] = new List<T>();
        }
    }

    public void AddEdge(T source, T destination, bool isDirected = false)
    {
        if (!_adjacencyList.ContainsKey(source)) AddVertex(source);
        if (!_adjacencyList.ContainsKey(destination)) AddVertex(destination);

        _adjacencyList[source].Add(destination);

        if (!isDirected)
        {
            _adjacencyList[destination].Add(source);
        }
    }

    public void PrintGraph()
    {
        foreach (var vertex in _adjacencyList)
        {
            Console.Write($"{vertex.Key} -> ");
            Console.WriteLine(string.Join(", ", vertex.Value));
        }
    }
}
```

## 5. Think Like a Dev
When faced with a data structure choice, developers don't just guess. They ask:
1. **How much data am I storing?** (If millions of records, array resizing might be costly).
2. **What operations are most frequent?**
   - Lots of random access? Use an Array/List (O(1)).
   - Lots of insertions/deletions at the ends? Use a Linked List or Queue/Stack.
   - Fast lookups and sorting? Use a Binary Search Tree or Hash Map (Dictionary).
3. **Do I need relationships?** (Hierarchical = Trees, Interconnected = Graphs).
4. **Memory overhead?** Linked nodes use more memory due to object headers and reference pointers. Arrays are compact.

**Mental Model:**
Think of memory as a massive row of mailboxes. 
- Arrays are reserved contiguous blocks of mailboxes. If you need more space, you have to find a bigger empty block and move all your mail.
- Linked Lists are scattered mailboxes where each box contains the address of the next one. You never have to move mail, just update the address slips.

## 6. Before / After

### Scenario: Browser History functionality
**Before (Using a generic List incorrectly):**
```csharp
List<string> history = new List<string>();
// Adding page
history.Add("page1.com");
history.Add("page2.com");
// Hitting back button (need to remove the last and get it)
string lastPage = history[history.Count - 1];
history.RemoveAt(history.Count - 1); 
// RemoveAt(n) in a list is fast at the end, but conceptually, a List allows arbitrary access which breaks the strict constraint of "History".
```

**After (Using a Custom Stack):**
```csharp
CustomStack<string> history = new CustomStack<string>();
history.Push("page1.com");
history.Push("page2.com");

string lastPage = history.Pop(); // O(1), strictly enforced semantics.
```

### Scenario: Print Queue Spooler
**Before (Using an Array poorly):**
```csharp
string[] printJobs = new string[10];
// Need to shift everything left when item 0 is printed. O(N) operation.
```

**After (Using a Queue):**
```csharp
CustomQueue<string> spooler = new CustomQueue<string>();
spooler.Enqueue("Doc1.pdf");
spooler.Enqueue("Image.png");
string currentJob = spooler.Dequeue(); // O(1), no shifting required.
```

## 7. Common Mistakes
1. **Forgetting Garbage Collection in Arrays**: In array-based Stacks/Queues, when you `Pop` or `Dequeue`, failing to set the array index to `default(T)` can cause memory leaks (objects stay referenced by the unused portion of the array).
2. **Infinite Loops in Linked Lists**: Accidental circular references (e.g., node.Next = node) will freeze traversals.
3. **BST Unbalanced Trees**: Assuming a BST is always O(log N). If you insert `1, 2, 3, 4, 5` into a BST, it becomes a linked list (O(N)).
4. **Ignoring `CompareTo` in Trees**: Using `==` instead of `CompareTo` for generic BST nodes will result in compilation errors or incorrect logical comparisons.
5. **Stack Overflow in Recursion**: Tree and Graph traversals heavily use recursion. Very deep trees or cyclic graphs without a `visited` hashset can crash the application.

## 8. Labs

### Lab 39.1: Build a Min-Stack
**Objective**: Build a stack that supports `Push`, `Pop`, `Top`, and `GetMin` all in O(1) time.
**Instructions**:
1. Create a class `MinStack`.
2. Internally, you can use two stacks: one for the regular values and one to keep track of the minimum values.
3. Test your implementation.
```csharp
// Hint snippet:
public void Push(int x) {
    mainStack.Push(x);
    if (minStack.Count == 0 || x <= minStack.Peek()) {
        minStack.Push(x);
    }
}
```

### Lab 39.2: Reverse a Linked List
**Objective**: Write a method that reverses a singly linked list in place (O(1) auxiliary space).
**Instructions**:
1. Use the `CustomLinkedList<T>` built in the lesson.
2. Add a `Reverse()` method.
3. You will need three pointers: `prev`, `current`, and `next`.
```csharp
// Target logic inside the CustomLinkedList class:
public void Reverse() {
    Node<T> prev = null;
    Node<T> current = Head;
    Node<T> next = null;
    Tail = Head; // Head becomes tail
    
    while (current != null) {
        next = current.Next;
        current.Next = prev;
        prev = current;
        current = next;
    }
    Head = prev;
}
```

### Lab 39.3: Graph BFS Traversal
**Objective**: Implement a Breadth-First Search (BFS) starting from a specific node in your `Graph<T>`.
**Instructions**:
1. BFS uses a Queue.
2. Keep a `HashSet<T>` of visited nodes.
3. Print nodes as they are visited.

## 9. Interview Prep

### Behavioral Questions
- **Q**: Tell me about a time you had to choose between different data structures for a feature. What was your thought process?
  - *Tip*: Talk about a scenario where you analyzed the Big O complexity for read vs write operations and chose accordingly (e.g., choosing a HashSet over a List for fast lookups).

### Technical Questions
- **Q**: How do you detect a cycle in a Linked List?
  - *A*: Floyd's Cycle-Finding Algorithm (Tortoise and Hare). Use a slow pointer (moves 1 step) and a fast pointer (moves 2 steps). If they meet, there is a cycle.
- **Q**: What is the difference between a Tree and a Graph?
  - *A*: A tree is a special type of graph. Specifically, a tree is a connected acyclic undirected graph. A graph can have cycles and multiple disconnected components.
- **Q**: How would you implement a Queue using two Stacks?
  - *A*: Keep an `inbox` stack and an `outbox` stack. Enqueue pushes to `inbox`. Dequeue checks if `outbox` is empty; if so, pop everything from `inbox` and push to `outbox`. Then pop from `outbox`.

## 10. Cheat Sheet

### Time Complexity Comparison
| Structure | Access | Search | Insertion | Deletion |
| :--- | :---: | :---: | :---: | :---: |
| Array | O(1) | O(N) | O(N) | O(N) |
| Linked List | O(N) | O(N) | O(1)* | O(1)* |
| Stack | O(N) | O(N) | O(1) | O(1) |
| Queue | O(N) | O(N) | O(1) | O(1) |
| Binary Search Tree | O(log N) | O(log N) | O(log N) | O(log N) |

*\*Insertion/Deletion at known pointers (head/tail).*

### Graph Terminology
- **Vertex**: A node in the graph.
- **Edge**: A connection between two vertices.
- **Directed**: Edges have a direction (A -> B).
- **Undirected**: Edges are bidirectional (A <-> B).
- **Weighted**: Edges have an associated cost/weight.
- **Adjacency List**: Array of lists. Best for sparse graphs.
- **Adjacency Matrix**: 2D array. Best for dense graphs.

## 11. Key Takeaways
- **C# Collections are Abstractions**: Underneath `List<T>` is an array. Underneath `Stack<T>` is an array. Understanding the underlying mechanism helps you predict performance bottlenecks.
- **Pointers/References are Powerful**: Linked nodes allow for highly dynamic structures without the overhead of contiguous memory reallocation.
- **Trees structure relationships**: Use trees when data is hierarchical (like a file system or an HTML DOM).
- **Graphs model networks**: Use graphs when data is interconnected without a strict hierarchy (like social networks or maps).
- **Always think of Big O**: Knowing your data structure's time and space complexity is the hallmark of a senior developer.

---

## 12. Extended Deep Dive: Advanced Implementations and Optimizations

To truly master data structures in C#, it is essential to look beyond the basic implementations and explore how these structures can be optimized for real-world, enterprise-level applications. In this extended section, we will build out advanced versions of our structures, incorporate C# specific features like `IEnumerable<T>`, `IEnumerator<T>`, `ICollection<T>`, and discuss thread-safety.

### 12.1. The `IEnumerable<T>` Interface and Custom Iterators
A professional custom data structure in C# must support `foreach` iteration. This is achieved by implementing `IEnumerable<T>`.

Let's upgrade our `CustomLinkedList<T>` to support iteration:

```csharp
using System;
using System.Collections;
using System.Collections.Generic;

public class EnumerableLinkedList<T> : IEnumerable<T>
{
    public Node<T> Head { get; private set; }
    public Node<T> Tail { get; private set; }
    public int Count { get; private set; }

    public void AddLast(T data)
    {
        Node<T> newNode = new Node<T>(data);
        if (Head == null)
        {
            Head = newNode;
            Tail = newNode;
        }
        else
        {
            Tail.Next = newNode;
            Tail = newNode;
        }
        Count++;
    }

    // Implementing IEnumerable<T>
    public IEnumerator<T> GetEnumerator()
    {
        Node<T> current = Head;
        while (current != null)
        {
            // The yield keyword magically creates a state machine for iteration
            yield return current.Data;
            current = current.Next;
        }
    }

    // Explicit interface implementation for non-generic IEnumerable
    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}
```

**Why is this important?** 
By implementing `IEnumerable<T>`, your custom linked list now fully integrates with LINQ. You can now do:
```csharp
var list = new EnumerableLinkedList<int>();
list.AddLast(1);
list.AddLast(2);
list.AddLast(3);

var evenNumbers = list.Where(n => n % 2 == 0).ToList();
```

### 12.2. Doubly Linked Lists
A doubly linked list adds a `Previous` pointer to each node. This allows for O(1) deletion from the tail and reverse traversal, at the cost of extra memory per node.

```csharp
public class DoubleNode<T>
{
    public T Data { get; set; }
    public DoubleNode<T> Next { get; set; }
    public DoubleNode<T> Previous { get; set; }

    public DoubleNode(T data)
    {
        Data = data;
    }
}

public class DoublyLinkedList<T> : IEnumerable<T>
{
    public DoubleNode<T> Head { get; private set; }
    public DoubleNode<T> Tail { get; private set; }
    public int Count { get; private set; }

    public void AddLast(T data)
    {
        DoubleNode<T> newNode = new DoubleNode<T>(data);
        if (Head == null)
        {
            Head = newNode;
            Tail = newNode;
        }
        else
        {
            Tail.Next = newNode;
            newNode.Previous = Tail;
            Tail = newNode;
        }
        Count++;
    }

    public void RemoveLast()
    {
        if (Tail == null) throw new InvalidOperationException("List is empty.");

        if (Tail == Head)
        {
            Head = null;
            Tail = null;
        }
        else
        {
            Tail = Tail.Previous;
            Tail.Next = null;
        }
        Count--;
    }

    public IEnumerator<T> GetEnumerator()
    {
        DoubleNode<T> current = Head;
        while (current != null)
        {
            yield return current.Data;
            current = current.Next;
        }
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
```

### 12.3. Advanced Stack: Thread-Safe Concurrent Stack
In multi-threaded server applications, standard generic collections are not thread-safe. Let's look at how to implement a basic thread-safe stack using locking, though in production you'd use `System.Collections.Concurrent.ConcurrentStack<T>`.

```csharp
using System;
using System.Threading;

public class ThreadSafeStack<T>
{
    private readonly T[] _items;
    private int _count;
    private readonly object _lockObject = new object();

    public ThreadSafeStack(int capacity)
    {
        _items = new T[capacity];
    }

    public void Push(T item)
    {
        lock (_lockObject)
        {
            if (_count == _items.Length)
                throw new InvalidOperationException("Stack is full");
            
            _items[_count] = item;
            _count++;
        }
    }

    public bool TryPop(out T result)
    {
        lock (_lockObject)
        {
            if (_count == 0)
            {
                result = default;
                return false;
            }

            _count--;
            result = _items[_count];
            _items[_count] = default; // GC cleanup
            return true;
        }
    }
}
```
**Concurrency note**: The lock ensures that only one thread can modify `_count` or read `_items` at a time. The `TryPop` pattern is preferred in concurrent scenarios to prevent race conditions between checking if it's empty and popping.

### 12.4. Advanced Queue: Circular Array Implementation
Our basic array queue from earlier has a flaw: if we enqueue and dequeue repeatedly, we keep moving right along the array until we run out of space, even if the front of the array is empty. A Circular Array Queue solves this using modular arithmetic.

```csharp
public class CircularQueue<T>
{
    private T[] _items;
    private int _head;
    private int _tail;
    private int _count;
    private int _capacity;

    public CircularQueue(int capacity)
    {
        _capacity = capacity;
        _items = new T[capacity];
    }

    public void Enqueue(T item)
    {
        if (_count == _capacity)
            throw new InvalidOperationException("Queue is full");

        _items[_tail] = item;
        _tail = (_tail + 1) % _capacity; // Wrap around
        _count++;
    }

    public T Dequeue()
    {
        if (_count == 0)
            throw new InvalidOperationException("Queue is empty");

        T item = _items[_head];
        _items[_head] = default(T); // GC Cleanup
        _head = (_head + 1) % _capacity; // Wrap around
        _count--;

        return item;
    }
}
```
**Memory efficiency**: Circular queues are highly efficient for fixed-size buffers, such as network packet buffers or audio streams, because they never require shifting elements or dynamic allocations once instantiated.

### 12.5. Tree Traversal Deep Dive: Iterative Methods
Earlier we traversed trees using recursion. Recursion uses the call stack. For massive trees, this can cause a `StackOverflowException`. Professional implementations often use iterative traversal with an explicit Stack.

#### Iterative In-Order Traversal
```csharp
using System.Collections.Generic;

public void IterativeInOrder(TreeNode<T> root)
{
    if (root == null) return;

    Stack<TreeNode<T>> stack = new Stack<TreeNode<T>>();
    TreeNode<T> current = root;

    while (current != null || stack.Count > 0)
    {
        // Reach the left most Node of the current Node
        while (current != null)
        {
            stack.Push(current);
            current = current.Left;
        }

        // Current must be NULL at this point
        current = stack.Pop();
        Console.Write(current.Value + " ");

        // We have visited the node and its left subtree. Now, it's right subtree's turn
        current = current.Right;
    }
}
```

### 12.6. Advanced Graphs: Dijkstra's Shortest Path Algorithm
Graphs become immensely powerful when edges have weights. Finding the shortest path in a weighted graph is a common interview question and real-world problem (e.g., GPS routing).

Let's model a weighted graph and sketch out Dijkstra's algorithm.

```csharp
using System;
using System.Collections.Generic;

public class DirectedWeightedEdge
{
    public int From { get; }
    public int To { get; }
    public double Weight { get; }

    public DirectedWeightedEdge(int from, int to, double weight)
    {
        From = from;
        To = to;
        Weight = weight;
    }
}

public class WeightedGraph
{
    private readonly int _vertices;
    private readonly List<DirectedWeightedEdge>[] _adj;

    public WeightedGraph(int vertices)
    {
        _vertices = vertices;
        _adj = new List<DirectedWeightedEdge>[vertices];
        for (int i = 0; i < vertices; i++)
        {
            _adj[i] = new List<DirectedWeightedEdge>();
        }
    }

    public void AddEdge(DirectedWeightedEdge edge)
    {
        _adj[edge.From].Add(edge);
    }

    // Simplified Dijkstra using an array for distances (O(V^2))
    // A production version would use a Priority Queue / Min-Heap for O(E log V)
    public void Dijkstra(int startVertex)
    {
        double[] distTo = new double[_vertices];
        bool[] visited = new bool[_vertices];

        for (int i = 0; i < _vertices; i++)
        {
            distTo[i] = double.PositiveInfinity;
        }
        distTo[startVertex] = 0.0;

        for (int i = 0; i < _vertices - 1; i++)
        {
            // Find vertex with minimum distance
            int minVertex = -1;
            double minDistance = double.PositiveInfinity;
            for (int v = 0; v < _vertices; v++)
            {
                if (!visited[v] && distTo[v] <= minDistance)
                {
                    minDistance = distTo[v];
                    minVertex = v;
                }
            }

            if (minVertex == -1) break;

            visited[minVertex] = true;

            // Relax edges
            foreach (var edge in _adj[minVertex])
            {
                int w = edge.To;
                if (!visited[w] && distTo[minVertex] + edge.Weight < distTo[w])
                {
                    distTo[w] = distTo[minVertex] + edge.Weight;
                }
            }
        }

        // Print results
        Console.WriteLine("Vertex   Distance from Source");
        for (int i = 0; i < _vertices; i++)
        {
            Console.WriteLine($"{i}		{distTo[i]}");
        }
    }
}
```

### 12.7. More Extensive Labs and Coding Challenges

#### Lab 39.4: Detect a Cycle in a Graph
**Objective**: Given a directed graph, write an algorithm to determine if there is a cycle.
**Instructions**:
1. You can use Depth-First Search (DFS).
2. Keep track of visited nodes.
3. Also keep a boolean array `recStack` to track nodes in the current recursive call stack. If you visit a node that is already in `recStack`, you have found a cycle.

#### Lab 39.5: Balanced Parentheses using Stacks
**Objective**: Given a string containing just the characters `'(', ')', '{', '}', '[' and ']'`, determine if the input string is valid.
**Rules**:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.

**Solution Skeleton**:
```csharp
public bool IsValid(string s) {
    Stack<char> stack = new Stack<char>();
    foreach (char c in s) {
        if (c == '(' || c == '{' || c == '[') {
            stack.Push(c);
        } else {
            if (stack.Count == 0) return false;
            char top = stack.Pop();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return stack.Count == 0;
}
```

#### Lab 39.6: LRU Cache Implementation
**Objective**: Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. It must support `Get` and `Put` operations in O(1) average time complexity.
**Hints**:
- To get O(1) lookup, use a `Dictionary`.
- To get O(1) removal and insertion representing the "recently used" order, use a Doubly Linked List.
- When an item is accessed via `Get` or inserted via `Put`, move its node to the front of the list.
- When the cache exceeds capacity, remove the tail of the list and remove it from the dictionary.

### 12.8. Real-world Architecture Scenarios

**Scenario 1: Task Scheduling in an Operating System**
When you run multiple programs, the OS scheduler decides who gets CPU time.
- *Data Structure Used*: A Priority Queue (often implemented via a Heap tree structure).
- *Why*: High priority tasks can jump the line, but standard tasks are processed roughly in a Queue fashion (FIFO).

**Scenario 2: Compiler Syntax Checking**
When you write code in an IDE, the IDE highlights syntax errors, such as missing curly braces.
- *Data Structure Used*: A Stack.
- *Why*: The LIFO nature flawlessly tracks nested structures like blocks `{ ... }`, parentheses, and HTML tags.

**Scenario 3: Auto-Complete Systems**
When you type into Google or your IDE, it suggests words.
- *Data Structure Used*: A Trie (Prefix Tree).
- *Why*: Tries are specialized trees where each node represents a character. They allow O(L) lookup where L is the length of the string, making auto-complete blazingly fast regardless of the dictionary size.

**Scenario 4: Routing Packets over the Internet**
When you send an HTTP request, the packets traverse multiple routers to reach the server.
- *Data Structure Used*: A Graph.
- *Why*: Routers act as vertices, physical cables act as edges, and latency/bandwidth act as edge weights. Algorithms like Dijkstra or Bellman-Ford find the optimal path.

\n<!-- padding aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa -->\n
**Next Lecture:** [Lecture 41 — Algorithms in C# - Sorting, Searching & Big O Notation](../41%20-%20Algorithms%20in%20C%23%20-%20Sorting%2C%20Searching%20%26%20Big%20O%20Notation/41%20-%20Algorithms%20in%20C%23%20-%20Sorting%2C%20Searching%20%26%20Big%20O%20Notation.md)

### 📚 Extensive Tutorials & Resources
- **Source:** [Microsoft Learn: Generic Collections in .NET](https://learn.microsoft.com/en-us/dotnet/standard/collections/thread-safe/generic-collections)
- **Source:** [CodeMaze: Stack and Queue in C# - Ultimate Guide](https://code-maze.com/csharp-stack/)
- **Source:** [DotNetTutorials: Singly Linked List in C# with Examples](https://dotnettutorials.net/lesson/singly-linked-list-in-csharp/)
- **Source:** [C# Corner: Binary Search Tree Implementation in C#](https://www.c-sharpcorner.com/article/binary-search-tree-implementation-in-c-sharp/)
- **Source:** [CodeMaze: Dijkstra's Algorithm in C#](https://code-maze.com/dijkstras-algorithm-in-csharp/)
- **Source:** [DotNetTutorials: Graph Representation and Traversal in C#](https://dotnettutorials.net/lesson/graph-implementation-in-csharp/)
- **Source:** [FreeCodeCamp: Data Structures and Algorithms in C# - Explained](https://www.freecodecamp.org/news/data-structures-and-algorithms-in-c-sharp/)
