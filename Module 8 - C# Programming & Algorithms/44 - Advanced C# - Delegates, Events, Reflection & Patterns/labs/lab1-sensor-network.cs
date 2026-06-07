using System;
using System.Threading;

namespace Lecture44.Labs
{
    // TODO: Step 2: Define a custom TemperatureEventArgs holding temperature value and location
    public class TemperatureEventArgs : EventArgs
    {
        public double Temperature { get; }
        public string Location { get; }

        public TemperatureEventArgs(double temperature, string location)
        {
            Temperature = temperature;
            Location = location;
        }
    }

    // TODO: Step 1: Implement TemperatureSensor
    public class TemperatureSensor
    {
        public string Location { get; }
        private readonly Random _random = new Random();

        // TODO: Step 3: Define an event CriticalTemperatureReached using EventHandler<TemperatureEventArgs>
        public event EventHandler<TemperatureEventArgs> CriticalTemperatureReached;

        public TemperatureSensor(string location)
        {
            Location = location;
        }

        public void ReadTemperature()
        {
            // TODO: Step 4: Generate a random temperature between 0 and 100
            double temp = _random.NextDouble() * 100;

            Console.WriteLine($"[{Location}] Current reading: {temp:F1}°C");

            // If temperature exceeds 85, fire the event CriticalTemperatureReached safely
            if (temp > 85)
            {
                OnCriticalTemperatureReached(temp);
            }
        }

        protected virtual void OnCriticalTemperatureReached(double temp)
        {
            // Trigger event safely
            CriticalTemperatureReached?.Invoke(this, new TemperatureEventArgs(temp, Location));
        }
    }

    // TODO: Step 5: Implement the AlarmSystem class that subscribes to sensors
    public class AlarmSystem
    {
        public void Subscribe(TemperatureSensor sensor)
        {
            // Subscribe to sensor event here
        }

        public void Unsubscribe(TemperatureSensor sensor)
        {
            // Unsubscribe from sensor event here to prevent memory leaks
        }

        private void OnCriticalTemperature(object sender, TemperatureEventArgs e)
        {
            // When event fires, print a red warning to the console
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"[ALERT] CRITICAL TEMPERATURE OF {e.Temperature:F1}°C REACHED AT LOCATION: {e.Location}!");
            Console.ResetColor();
        }
    }

    public class Lab1SensorNetwork
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Lab 1: Event-Driven Sensor Network");

            // TODO: Create 3 sensors (e.g., "Server Room", "Kitchen", "Warehouse")
            // Instantiate AlarmSystem and subscribe it to all 3 sensors
            // Simulate readings in a loop to see the warning trigger
        }
    }
}
