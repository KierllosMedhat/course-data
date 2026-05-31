// ADVANCED C# — Lecture 38

using System;
using System.Reflection;

namespace AdvancedCSharp
{
    // ===== 1. DELEGATES =====
    // A delegate is a type that represents references to methods with a particular parameter list and return type.
    public delegate void Notify(string message);

    class Program
    {
        static void Main(string[] args)
        {
            // Using the Delegate
            Notify notifyDelegate = ShowMessage;
            notifyDelegate("Hello via Delegate!");

            // Action (void return) and Func (returns a value) are built-in delegates
            Action<string> printAction = msg => Console.WriteLine(msg);
            Func<int, int, int> addFunc = (a, b) => a + b;

            printAction($"Func Result: {addFunc(5, 7)}");

            // ===== 2. EVENTS =====
            var process = new ProcessBusinessLogic();
            
            // Subscribe to the event
            process.ProcessCompleted += Process_ProcessCompleted;
            
            process.StartProcess();

            // ===== 3. EXTENSION METHODS =====
            string text = "hello world";
            Console.WriteLine(text.CapitalizeFirstLetter());

            // ===== 4. REFLECTION =====
            // Inspecting types at runtime
            Type type = typeof(Person);
            Console.WriteLine($"\nInspecting: {type.Name}");
            
            PropertyInfo[] props = type.GetProperties();
            foreach (var prop in props)
            {
                Console.WriteLine($"- Property: {prop.Name} ({prop.PropertyType.Name})");
            }
        }

        static void ShowMessage(string msg) => Console.WriteLine(msg);

        // Event Handler matching the signature of EventHandler
        static void Process_ProcessCompleted(object sender, EventArgs e)
        {
            Console.WriteLine("Process Completed Event Received!");
        }
    }

    // ===== 2. EVENTS (Publisher) =====
    public class ProcessBusinessLogic
    {
        // Declare the event
        public event EventHandler ProcessCompleted;

        public void StartProcess()
        {
            Console.WriteLine("Process Started!");
            // Simulate work
            System.Threading.Thread.Sleep(1000);
            
            // Raise the event
            OnProcessCompleted(EventArgs.Empty);
        }

        protected virtual void OnProcessCompleted(EventArgs e)
        {
            ProcessCompleted?.Invoke(this, e);
        }
    }

    // ===== 3. EXTENSION METHODS (Must be in a static class) =====
    public static class StringExtensions
    {
        public static string CapitalizeFirstLetter(this string input)
        {
            if (string.IsNullOrEmpty(input)) return input;
            return char.ToUpper(input[0]) + input.Substring(1);
        }
    }

    class Person
    {
        public string Name { get; set; }
        public int Age { get; set; }
    }
}
