using System;
using System.Collections.Generic;

namespace PointOfSale.Model
{
    public partial class Menu
    {
        public Menu()
        {
            InverseIdMenuParentNavigation = new HashSet<Menu>();
            RolMenus = new HashSet<RolMenu>();
        }

        public int IdMenu { get; set; }
        public string? Description { get; set; }
        public int? IdMenuParent { get; set; }
        public string? Icon { get; set; }
        public string? Controller { get; set; }
        public string? PageAction { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? RegistrationDate { get; set; }

        public virtual Menu? IdMenuParentNavigation { get; set; }
        public virtual ICollection<Menu> InverseIdMenuParentNavigation { get; set; }
        public virtual ICollection<RolMenu> RolMenus { get; set; }
    }
}
