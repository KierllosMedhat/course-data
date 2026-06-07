using System;
using System.Collections.Generic;

namespace DataStructures.Labs
{
    // TODO: Implement the MinStack class
    // Requirements:
    // - Push, Pop, Top, and GetMin must all run in O(1) time.
    // - Hint: You can use two standard Stacks internally: one for all values and one for minimums.
    public class MinStack
    {
        private Stack<int> mainStack = new Stack<int>();
        private Stack<int> minStack = new Stack<int>();

        public void Push(int x)
        {
            // TODO: Implement Push logic
            // Push x onto the main stack.
            // If the min stack is empty or x is less than or equal to the current minimum,
            // push x onto the min stack as well.
        }

        public void Pop()
        {
            // TODO: Implement Pop logic
            // Pop the top item from the main stack.
            // If the popped value matches the top of the min stack, pop it from the min stack too.
        }

        public int Top()
        {
            // TODO: Return the top element of the main stack
            return 0; // Placeholder
        }

        public int GetMin()
        {
            // TODO: Return the top element of the min stack
            return 0; // Placeholder
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== MinStack Lab ===");

            MinStack minStack = new MinStack();
            
            // TODO: Test your MinStack implementation.
            // Example:
            // minStack.Push(-2);
            // minStack.Push(0);
            // minStack.Push(-3);
            // Console.WriteLine(minStack.GetMin()); // Should return -3
            // minStack.Pop();
            // Console.WriteLine(minStack.Top());    // Should return 0
            // Console.WriteLine(minStack.GetMin()); // Should return -2
        }
    }
}
