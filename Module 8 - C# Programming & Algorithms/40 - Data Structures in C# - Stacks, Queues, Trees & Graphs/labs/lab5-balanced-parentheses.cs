using System;
using System.Collections.Generic;

namespace DataStructures.Labs
{
    class Lab5BalancedParentheses
    {
        // TODO: Implement the IsValid/IsBalanced method using a Stack
        // Requirements:
        // - Determine if the input string has balanced parenthesis.
        // - Supported brackets: '(', ')', '{', '}', '[', ']'
        // - Return true if valid/balanced, otherwise false.
        // - Example: "()[]{}" -> true, "([)]" -> false, "(" -> false
        public static bool IsBalanced(string s)
        {
            Stack<char> stack = new Stack<char>();

            // Implement check here
            
            return false; // Placeholder
        }

        static void Main(string[] args)
        {
            Console.WriteLine("=== Balanced Parentheses Lab ===");

            // TODO: Test various string scenarios
            string test1 = "()[]{}";
            string test2 = "([{}])";
            string test3 = "([)]";
            string test4 = "(";

            // Print test results:
            // Console.WriteLine($"'{test1}' is balanced: {IsBalanced(test1)} (Expected: True)");
            // Console.WriteLine($"'{test2}' is balanced: {IsBalanced(test2)} (Expected: True)");
            // Console.WriteLine($"'{test3}' is balanced: {IsBalanced(test3)} (Expected: False)");
            // Console.WriteLine($"'{test4}' is balanced: {IsBalanced(test4)} (Expected: False)");
        }
    }
}
