namespace PointOfSale.Models
{
    public class VMProduct
    {
        public int IdProduct { get; set; }
        public string? BarCode { get; set; }
        public string? Brand { get; set; }
        public string? Description { get; set; }
        public int? IdCategory { get; set; }
        public string? NameCategory { get; set; }
        public int? Quantity { get; set; }
        public string? Price { get; set; }
        public byte[]? Photo { get; set; }
        public string? PhotoBase64 { get; set; }
        public int? IsActive { get; set; }
    }
}
