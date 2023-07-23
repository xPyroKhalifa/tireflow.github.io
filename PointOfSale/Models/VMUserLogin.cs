namespace PointOfSale.Models
{
    public class VMUserLogin
    {
        public string? Email { get; set; }
        public string? PassWord { get; set; }
        public bool KeepLoggedIn { get; set; }
    }
}
