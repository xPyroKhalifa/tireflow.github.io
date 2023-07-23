namespace PointOfSale.Models
{
    public class VMMenu
    {
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public string? Controller { get; set; }
        public string? PageAction { get; set; }
        public virtual ICollection<VMMenu> SubMenus { get; set; }
    }
}
