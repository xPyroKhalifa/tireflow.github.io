using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PointOfSale.Business.Contracts;
using PointOfSale.Model;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace PointOfSale.Business.Services
{
    public class LowStockProductCheckerService : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IMemoryCache _memoryCache;
        private const int CheckIntervalInSeconds = 5; // Adjust the interval as needed
      


        public LowStockProductCheckerService(IServiceScopeFactory serviceScopeFactory, IMemoryCache memoryCache)
        {
            
            _serviceScopeFactory = serviceScopeFactory;
            _memoryCache = memoryCache;
          
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckLowStockProducts();
                await Task.Delay(TimeSpan.FromSeconds(CheckIntervalInSeconds), stoppingToken);
            }
        }

       
        private async Task CheckLowStockProducts()
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var productService = scope.ServiceProvider.GetRequiredService<IProductService>();

                // Retrieve products and check for low stock
                List<Product> products = await productService.List();
                List<string> lowStockProducts = GetProductsBelowThreshold(products);


                // Create notification message for low stock products
                if (lowStockProducts.Count > 0)
                {
                    // string notification = "Warning: The following products have a quantity below 5: " + string.Join(", ", lowStockProducts);
                        string notification = GetNotificationMessage(lowStockProducts);
                    _memoryCache.Set("LowQuantityNotification", notification, DateTimeOffset.Now.AddMinutes(10)); // Set notification in cache for 10 minutes

                   
                }
                else
                {
                    // Clear the notification from cache if no low stock products
                    _memoryCache.Remove("LowQuantityNotification");
                }
            }
        }
        private List<string> GetProductsBelowThreshold(List<Product> products)
        {
           // const int notificationThreshold = 5;
            List<string> lowStockProducts = new List<string>();

            foreach (var product in products)
            {
                // Modify the thresholds as needed
                const int criticalThreshold = 5;
                const int floorThreshold = 10;
                const int ceilingThreshold = 15;

                if (product.Quantity < criticalThreshold)
                {
                    lowStockProducts.Add($"Critical Level: {product.Description} (Quantity: {product.Quantity})");
                }
                else if (product.Quantity < floorThreshold)
                {
                    lowStockProducts.Add($"Floor Level: {product.Description} (Quantity: {product.Quantity})");
                }
                else if (product.Quantity < ceilingThreshold)
                {
                    lowStockProducts.Add($"Ceiling Level: {product.Description} (Quantity: {product.Quantity})");
                }
            }

            return lowStockProducts;
        }
        private string GetNotificationMessage(List<string> lowStockProducts)
        {
            // Create a separate message box for each low stock product with the timestamp
            List<string> notificationMessages = new List<string>();

            for (int i = 0; i < lowStockProducts.Count; i++)
            {
                // Split the product message into lines for description and quantity
                var productLines = lowStockProducts[i].Split('\n');
                string description = productLines[0];
                string quantity = productLines.Length > 1 ? productLines[1] : string.Empty;

                string productMessage = $"\n   {description}\n   {quantity}\n\n";
                notificationMessages.Add($"\n Notification {i + 1}:\n{productMessage}");
            }

            // Join all the notification messages into a single string
            string messageContent = string.Join("\n", notificationMessages);

            // Add the general warning message at the beginning and a newline character
            string warningMessage = "Warning: The following products have a quantity below the specified thresholds: <br><br>";
            string notificationMessage = warningMessage + messageContent;

            return notificationMessage;
        }
    }
}
