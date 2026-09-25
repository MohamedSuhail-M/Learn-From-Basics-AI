export const SAMPLE_MATERIAL = `Chapter 3: Introduction to Data Structures

3.1 What is a Data Structure?

A data structure is a way of organizing and storing data in a computer so that it can be accessed and modified efficiently. The choice of data structure depends on the operations you need to perform. For example, if you need fast lookups, a hash table is ideal. If you need ordered traversal, a tree might be better. Understanding data structures is fundamental to writing efficient algorithms.

3.2 Arrays

An array is the simplest data structure. It stores elements in contiguous memory locations, allowing O(1) random access by index. However, inserting or deleting elements in the middle of an array requires shifting all subsequent elements, which takes O(n) time. Arrays are the building block for many other data structures, including stacks and queues.

3.3 Big O Notation

Before analyzing any data structure, we need a language to describe efficiency. Big O notation describes the upper bound on the time or space complexity of an algorithm as input size grows. For example, accessing an array element is O(1), while searching an unsorted array is O(n). Big O notation is a prerequisite for understanding the trade-offs between different data structures.

3.4 Linked Lists

A linked list is a linear data structure where elements (nodes) are stored non-contiguously. Each node contains data and a pointer to the next node. Unlike arrays, linked lists allow O(1) insertion and deletion at any position if you have a pointer to the node. However, random access is O(n) because you must traverse from the head. Linked lists build on the concept of pointers and dynamic memory allocation.

3.5 Pointers and Memory

A pointer is a variable that stores the memory address of another variable. Pointers are essential for understanding linked lists, trees, and graphs. In languages like C, you directly manipulate pointers. In higher-level languages like Python or Java, references serve a similar role. Without understanding pointers, you cannot understand how linked lists or trees are implemented.

3.6 Stacks

A stack is a LIFO (Last In, First Out) data structure. You can push elements onto the top and pop them off the top. Stacks are used in function call management, expression evaluation, and backtracking algorithms. A stack can be implemented using either an array or a linked list. Arrays are a prerequisite for understanding the array-based implementation of stacks.

3.7 Queues

A queue is a FIFO (First In, First Out) data structure. Elements are added at the rear (enqueue) and removed from the front (dequeue). Queues are used in breadth-first search, scheduling, and buffering. Like stacks, queues can be implemented using arrays or linked lists. Understanding linked lists is a prerequisite for understanding the linked-list implementation of queues.

3.8 Trees

A tree is a hierarchical data structure consisting of nodes connected by edges. Each node has a parent (except the root) and zero or more children. Trees are used to represent hierarchical relationships, enable efficient searching, and build more complex structures. Binary trees, where each node has at most two children, are the foundation of binary search trees and heaps. Understanding pointers is a prerequisite for understanding how trees are implemented, since tree nodes contain pointers to their children.

3.9 Binary Search Trees

A binary search tree (BST) is a binary tree where for each node, all values in the left subtree are less than the node's value, and all values in the right subtree are greater. BSTs allow O(log n) search, insert, and delete operations when balanced. BSTs build on the concept of binary trees. Understanding Big O notation is a prerequisite for analyzing BST operations. A common example of a BST is an ordered dictionary.

3.10 Hash Tables

A hash table maps keys to values using a hash function. It provides average O(1) insert, delete, and lookup operations. Collisions occur when two keys hash to the same index and are resolved by chaining (using linked lists) or open addressing. Understanding arrays is a prerequisite for understanding hash tables, since the hash table itself is backed by an array. Linked lists are also a prerequisite for understanding collision resolution by chaining.

3.11 Graphs

A graph is a collection of vertices (nodes) and edges connecting them. Graphs can be directed or undirected, weighted or unweighted. They are used to model networks, relationships, and dependencies. Graph traversal algorithms include depth-first search (DFS) and breadth-first search (BFS). Understanding trees is a prerequisite for understanding graphs, since trees are a special case of graphs. Queues are a prerequisite for breadth-first search, which uses a queue to track nodes to visit next.`;
