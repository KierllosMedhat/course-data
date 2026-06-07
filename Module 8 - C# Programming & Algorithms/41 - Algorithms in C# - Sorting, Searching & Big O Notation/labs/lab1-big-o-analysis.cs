using System;

namespace Lecture41.Labs
{
    public class Lab1BigOAnalysis
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Lab 1: Big O Analysis");
            
            // TODO: Analyze the time and space complexity of the method PrintMatrixAndLinear below.
            // Write your explanation and final Big O complexity in the comments.
            
            /*
             * Time Complexity: TODO
             * Space Complexity: TODO
             * Explanation: TODO
             */
        }

        public static void PrintMatrixAndLinear(int[,] matrix, int[] array)
        {
            int rows = matrix.GetLength(0);
            int cols = matrix.GetLength(1);

            // Loop 1
            for (int i = 0; i < rows; i++)
            {
                for (int j = 0; j < cols; j++)
                {
                    Console.WriteLine(matrix[i, j]);
                }
            }

            // Loop 2
            for (int k = 0; k < array.Length; k++)
            {
                Console.WriteLine(array[k]);
            }
        }
    }
}
