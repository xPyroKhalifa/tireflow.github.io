namespace PointOfSale.Models
{
    public class VMSalesReport
    {
        public string? RegistrationDate { get; set; }
        public string? SaleNumber { get; set; }
        public string? DocumentType { get; set; }
        public string? DocumentClient { get; set; }
        public string? ClientName { get; set; }
        public string? SubTotalSale { get; set; }
        public string? TaxTotalSale { get; set; }
        public string? TotalSale { get; set; }
        public string? Product { get; set; }
        public int Quantity { get; set; }
        public string? Price { get; set; }
        public string? Total { get; set; }
    }
}
