using PointOfSale.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PointOfSale.Business.Contracts
{
    public interface ISaleService
    {
        Task<List<Product>> GetProducts(string search);

        Task<Sale> Register(Sale entity);

        Task<List<Sale>> SaleHistory(string SaleNumber, string StarDate, string EndDate);
        Task<Sale> Detail(string SaleNumber);
        Task<List<DetailSale>> Report(string StarDate, string EndDate);
    }
}
