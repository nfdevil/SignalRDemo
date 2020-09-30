using System.Threading.Tasks;

using Dtos;

using Microsoft.AspNetCore.SignalR;

namespace SignalRDemo.Hubs
{
    // Send messages using Message Pack binary formatter
    public class LoopyMessageHub : Hub
    {
        public Task Send(MessageDto data)
        {
            return Clients.All.SendAsync("Send", data);
        }
    }
}
