using PointOfSale.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PointOfSale.Business.Contracts
{
    public interface IProductService
    {
        Task<List<Product>> List();
        Task<Product> Add(Product entity);
        Task<Product> Edit(Product entity);
        Task<bool> Delete(int idProduct);
    }
}
