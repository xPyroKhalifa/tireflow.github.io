namespace PointOfSale.Models
{
    public class VMDashBoard
    {
        public int TotalSales { get; set; }
        public string? TotalIncome { get; set; }
        public int TotalProducts { get; set; }
        public int TotalCategories { get; set; }
        public List<VMSalesWeek> SalesLastWeek { get; set; }
        public List<VMProductsWeek> ProductsTopLastWeek { get; set; }
    }
}
