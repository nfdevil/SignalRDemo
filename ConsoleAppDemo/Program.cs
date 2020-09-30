using System;
using System.Threading;
using System.Threading.Tasks;

using Dtos;

using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ConsoleAppDemo
{
    internal class Program
    {
        private static HubConnection _hubConnection;

        private static async Task Main()
        {
            Console.WriteLine("Will connect to Hub in 5 seconds ...");
            await SetupSignalRHubAsync();
            _hubConnection.On<string>("Send", (message) =>
            {
                Console.WriteLine($"{message}");
            });
            Console.WriteLine("Connected to Hub");
            Console.WriteLine("Press ESC to stop");
            do
            {
                while (!Console.KeyAvailable)
                {
                    string message = Console.ReadLine();
                    await _hubConnection.SendAsync("Send", $"Console Server: {message}");
                    Console.WriteLine("SendAsync to Hub");
                }
            }
            while (Console.ReadKey(true).Key != ConsoleKey.Escape);

            await _hubConnection.DisposeAsync();
        }

        public static async Task SetupSignalRHubAsync()
        {
            Thread.Sleep(TimeSpan.FromSeconds(5));
            _hubConnection = new HubConnectionBuilder()
                             .WithUrl("https://localhost:5001/loopy")
                             .AddMessagePackProtocol()
                             .ConfigureLogging(factory =>
                             {
                                 factory.AddConsole();
                                 factory.AddFilter("Console", level => level >= LogLevel.Trace);
                             })
                             .Build();

            await _hubConnection.StartAsync();
        }
    }
}
