using System;
using System.Threading.Tasks;

namespace LabHangfire.Services
{
    public interface IBackupService
    {
        Task PerformDbBackup();
    }

    public class BackupService : IBackupService
    {
        public async Task PerformDbBackup()
        {
            Console.WriteLine("Backup Service: Beginning database backup process...");
            
            // TODO: Simulate a long-running database backup task using Task.Delay (e.g., 5 seconds)
            await Task.Delay(5000);

            // TODO: Print "Backup complete!" to the console
            Console.WriteLine("Backup Service: Backup complete!");
        }
    }
}
