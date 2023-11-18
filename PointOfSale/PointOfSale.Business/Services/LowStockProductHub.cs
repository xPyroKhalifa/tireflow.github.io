using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace PointOfSale.Business.Services
{
    public class LowStockProductHub : Hub
    {
        public async Task SendLowStockNotification(string notification)
        {
            // Call this method to send the notification to all connected clients
            await Clients.All.SendAsync("ReceiveLowStockNotification", notification);
        }
    }
}
