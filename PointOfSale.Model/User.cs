using System;
using System.Collections.Generic;

namespace PointOfSale.Model
{
    public partial class User
    {
        public User()
        {
            Sales = new HashSet<Sale>();
        }

        public int IdUsers { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public int? IdRol { get; set; }
        public string? Password { get; set; }
        public byte[]? Photo { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? RegistrationDate { get; set; }

        public virtual Rol? IdRolNavigation { get; set; }
        public virtual ICollection<Sale> Sales { get; set; }
    }
}
