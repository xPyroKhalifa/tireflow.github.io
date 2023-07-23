using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PointOfSale.Model;

namespace PointOfSale.Business.Contracts
{
    public interface ITypeDocumentSaleService
    {
        Task<List<TypeDocumentSale>> List();
    }
}
