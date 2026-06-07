using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Hangfire;
using Hangfire.MemoryStorage;
using LabHangfire.Services;

namespace LabHangfire
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // TODO: Register the IBackupService and its implementation in Dependency Injection as Transient/Scoped
            builder.Services.AddScoped<IBackupService, BackupService>();

            // TODO: Configure Hangfire to use In-Memory storage (Hangfire.MemoryStorage)
            // Use builder.Services.AddHangfire with UseMemoryStorage() configuration option
            builder.Services.AddHangfire(config => config
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseMemoryStorage());

            // TODO: Register the Hangfire Background Job Server
            builder.Services.AddHangfireServer();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // TODO: Enable the Hangfire Dashboard middleware at "/hangfire"
            app.UseHangfireDashboard("/hangfire");

            // TODO: Register the recurring backup job using RecurringJob.AddOrUpdate
            // Schedule the PerformDbBackup method on IBackupService to run daily at 2 AM (CRON: "0 2 * * *")
            // Make sure to use the generic version of AddOrUpdate that resolves the service automatically!
            RecurringJob.AddOrUpdate<IBackupService>(
                "nightly-db-backup",
                service => service.PerformDbBackup(),
                "0 2 * * *"
            );

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
