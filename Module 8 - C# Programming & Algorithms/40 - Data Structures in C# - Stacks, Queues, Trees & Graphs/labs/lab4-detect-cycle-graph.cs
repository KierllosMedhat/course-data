using System;
using System.Collections.Generic;

namespace DataStructures.Labs
{
    public class DirectedGraph<T> where T : notnull
    {
        private Dictionary<T, List<T>> _adjacencyList = new Dictionary<T, List<T>>();

        public void AddVertex(T vertex)
        {
            if (!_adjacencyList.ContainsKey(vertex))
            {
                _adjacencyList[vertex] = new List<T>();
            }
        }

        public void AddEdge(T source, T destination)
        {
            if (!_adjacencyList.ContainsKey(source)) AddVertex(source);
            if (!_adjacencyList.ContainsKey(destination)) AddVertex(destination);

            _adjacencyList[source].Add(destination); // Directed only
        }

        // TODO: Implement Cycle Detection using Depth-First Search (DFS)
        // Requirements:
        // - Return true if a cycle exists, otherwise false.
        // - Maintain a 'visited' set to track all fully explored nodes.
        // - Maintain a 'recStack' (recursion stack) set to track nodes in the current recursive call path.
        // - If a node in the current recursion path is visited again, a cycle is detected.
        public bool HasCycle()
        {
            HashSet<T> visited = new HashSet<T>();
            HashSet<T> recStack = new HashSet<T>();

            foreach (var vertex in _adjacencyList.Keys)
            {
                if (HasCycleRecursive(vertex, visited, recStack))
                {
                    return true;
                }
            }

            return false;
        }

        private bool HasCycleRecursive(T vertex, HashSet<T> visited, HashSet<T> recStack)
        {
            // Implement the recursive helper here
            return false; // Placeholder
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Graph Cycle Detection Lab ===");

            // Graph with a cycle: A -> B -> C -> A
            DirectedGraph<string> cyclicGraph = new DirectedGraph<string>();
            cyclicGraph.AddEdge("A", "B");
            cyclicGraph.AddEdge("B", "C");
            cyclicGraph.AddEdge("C", "A");

            // Graph without a cycle: X -> Y -> Z
            DirectedGraph<string> acyclicGraph = new DirectedGraph<string>();
            acyclicGraph.AddEdge("X", "Y");
            acyclicGraph.AddEdge("Y", "Z");

            // TODO: Test both graphs for cycles and output the results
            // Console.WriteLine($"cyclicGraph has cycle: {cyclicGraph.HasCycle()} (Expected: True)");
            // Console.WriteLine($"acyclicGraph has cycle: {acyclicGraph.HasCycle()} (Expected: False)");
        }
    }
}
