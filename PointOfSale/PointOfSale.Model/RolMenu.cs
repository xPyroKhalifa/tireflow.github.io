using System;
using System.Collections.Generic;

namespace PointOfSale.Model
{
    public partial class RolMenu
    {
        public int IdRolMenu { get; set; }
        public int? IdRol { get; set; }
        public int? IdMenu { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? RegistrationDate { get; set; }

        public virtual Menu? IdMenuNavigation { get; set; }
        public virtual Rol? IdRolNavigation { get; set; }
    }
}
