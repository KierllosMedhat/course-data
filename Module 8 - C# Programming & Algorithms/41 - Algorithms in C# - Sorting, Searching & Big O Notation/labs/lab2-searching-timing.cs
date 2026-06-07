using System;
using System.Diagnostics;

namespace Lecture41.Labs
{
    public class Lab2SearchingTiming
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Lab 2: Implement and Time Searching");

            int target = 9999999;
            int size = 10000000;

            Console.WriteLine($"Generating sorted array of {size:N0} elements...");
            // TODO: Step 1: Create and populate a sorted array of 10,000,000 integers from 1 to 10,000,000
            int[] data = new int[size];
            
            // TODO: Fill the array here

            Console.WriteLine("\n--- Linear Search ---");
            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            
            // TODO: Step 3: Call your Linear Search method to search for the target value
            int linearIndex = LinearSearch(data, target);
            
            stopwatch.Stop();
            Console.WriteLine($"Linear Search Result: Index {linearIndex}");
            Console.WriteLine($"Linear Search Time: {stopwatch.ElapsedMilliseconds} ms ({stopwatch.ElapsedTicks} ticks)");

            Console.WriteLine("\n--- Binary Search ---");
            stopwatch.Reset();
            stopwatch.Start();
            
            // TODO: Step 4: Call your Binary Search method to search for the target value
            int binaryIndex = BinarySearch(data, target);
            
            stopwatch.Stop();
            Console.WriteLine($"Binary Search Result: Index {binaryIndex}");
            Console.WriteLine($"Binary Search Time: {stopwatch.ElapsedMilliseconds} ms ({stopwatch.ElapsedTicks} ticks)");

            // TODO: Step 5: Compare the timing results and print a brief analysis
        }

        // TODO: Implement Linear Search
        // Time Complexity: O(n)
        public static int LinearSearch(int[] arr, int target)
        {
            // Write linear search implementation here
            return -1;
        }

        // TODO: Implement Binary Search
        // Time Complexity: O(log n)
        public static int BinarySearch(int[] arr, int target)
        {
            // Write binary search implementation here
            return -1;
        }
    }
}
