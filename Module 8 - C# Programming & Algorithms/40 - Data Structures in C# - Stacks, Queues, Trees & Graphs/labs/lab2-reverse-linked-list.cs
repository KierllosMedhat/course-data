using System;

namespace DataStructures.Labs
{
    public class Node<T>
    {
        public T Data { get; set; }
        public Node<T>? Next { get; set; }

        public Node(T data)
        {
            Data = data;
            Next = null;
        }
    }

    public class CustomLinkedList<T>
    {
        public Node<T>? Head { get; private set; }
        public Node<T>? Tail { get; private set; }
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
                Tail!.Next = newNode;
                Tail = newNode;
            }
            Count++;
        }

        // TODO: Implement the Reverse() method in place
        // Requirements:
        // - Reverses the singly linked list using O(1) auxiliary space (no new lists or arrays).
        // - You will need three pointers/references: prev, current, next.
        // - Correctly update Head and Tail properties.
        public void Reverse()
        {
            // Implement in-place reversal logic here
        }

        public void PrintList()
        {
            Node<T>? current = Head;
            while (current != null)
            {
                Console.Write(current.Data + " -> ");
                current = current.Next;
            }
            Console.WriteLine("null");
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Reverse Linked List Lab ===");

            CustomLinkedList<int> list = new CustomLinkedList<int>();
            list.AddLast(1);
            list.AddLast(2);
            list.AddLast(3);
            list.AddLast(4);

            Console.Write("Original List: ");
            list.PrintList();

            // TODO: Call list.Reverse() and print the reversed list
            // list.Reverse();
            // Console.Write("Reversed List: ");
            // list.PrintList();
        }
    }
}
