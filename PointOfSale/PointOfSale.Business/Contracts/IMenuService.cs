using PointOfSale.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PointOfSale.Business.Contracts
{
    public interface IMenuService
    {
        Task<List<Menu>> GetMenus(int idUser);
    }
}
