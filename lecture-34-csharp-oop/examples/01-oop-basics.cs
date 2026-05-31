// OOP IN C# — Lecture 34

using System;

namespace ObjectOrientedCSharp
{
    // 1. INTERFACE
    public interface IAnimal
    {
        void Speak();
    }

    // 2. BASE CLASS (Abstract)
    public abstract class Animal : IAnimal
    {
        // Properties
        public string Name { get; set; }
        
        // Constructor
        public Animal(string name)
        {
            Name = name;
        }

        // Abstract method (must be overridden)
        public abstract void Speak();

        // Virtual method (can optionally be overridden)
        public virtual void Sleep()
        {
            Console.WriteLine($"{Name} is sleeping.");
        }
    }

    // 3. DERIVED CLASS (Inheritance)
    public class Dog : Animal
    {
        public string Breed { get; set; }

        public Dog(string name, string breed) : base(name)
        {
            Breed = breed;
        }

        // Overriding abstract method
        public override void Speak()
        {
            Console.WriteLine($"{Name} the {Breed} says Woof!");
        }

        // Overriding virtual method
        public override void Sleep()
        {
            Console.WriteLine($"{Name} curls up and goes to sleep.");
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            // Polymorphism
            Animal myDog = new Dog("Buddy", "Golden Retriever");
            
            myDog.Speak(); // Outputs: Buddy the Golden Retriever says Woof!
            myDog.Sleep(); // Outputs: Buddy curls up and goes to sleep.
            
            // myDog.Breed // Error: 'Breed' is not a property of 'Animal'. 
            // Must cast to Dog to access Breed:
            if (myDog is Dog d)
            {
                Console.WriteLine($"Breed: {d.Breed}");
            }
        }
    }
}
