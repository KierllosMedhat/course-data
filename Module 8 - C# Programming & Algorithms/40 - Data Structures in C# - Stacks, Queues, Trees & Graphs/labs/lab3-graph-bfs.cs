using System;
using System.Collections.Generic;

namespace DataStructures.Labs
{
    public class Graph<T> where T : notnull
    {
        private Dictionary<T, List<T>> _adjacencyList = new Dictionary<T, List<T>>();

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

        // TODO: Implement the Breadth-First Search (BFS) Traversal method
        // Requirements:
        // - Accept a start vertex of type T.
        // - Use a Queue<T> to manage the traversal order.
        // - Use a HashSet<T> to keep track of visited vertices to prevent infinite loops.
        // - Print nodes to the console as they are visited.
        public void BreadthFirstSearch(T start)
        {
            // Implement BFS here
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

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Graph BFS Traversal Lab ===");

            Graph<string> graph = new Graph<string>();
            graph.AddEdge("A", "B");
            graph.AddEdge("A", "C");
            graph.AddEdge("B", "D");
            graph.AddEdge("C", "E");
            graph.AddEdge("D", "E");

            Console.WriteLine("Graph structure:");
            graph.PrintGraph();

            // TODO: Test your BFS method
            // Console.WriteLine("\nBFS starting from 'A':");
            // graph.BreadthFirstSearch("A");
        }
    }
}
