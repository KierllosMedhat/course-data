using System;
using System.Reflection;

namespace Lecture44.Labs
{
    // TODO: Step 1: Implement ConfidentialData with private fields and methods
    public class ConfidentialData
    {
        private string _socialSecurityNumber = "123-456-7890";
        private string _encryptionKey = "SuperSecretKey123";

        private void PrintConfidentialStatus()
        {
            Console.WriteLine($"SSN: {_socialSecurityNumber}, Key: {_encryptionKey}");
        }
    }

    public class Lab2ReflectionInspector
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Lab 2: The Reflection Inspector");

            // TODO: Step 2: Use Reflection to instantiate ConfidentialData
            Type type = typeof(ConfidentialData);
            object confidentialObj = null;

            Console.WriteLine("\n--- Inspecting Private Fields ---");
            // TODO: Step 3: Use GetFields(BindingFlags.NonPublic | BindingFlags.Instance)
            // to iterate through and print all private field names and their values

            Console.WriteLine("\n--- Forcefully Modifying Private Field ---");
            // TODO: Step 4: Use GetField and SetValue to forcefully change the private _encryptionKey at runtime

            Console.WriteLine("\n--- Invoking Private Method ---");
            // TODO: Invoke the private PrintConfidentialStatus method via Reflection to verify the modification worked
        }
    }
}
