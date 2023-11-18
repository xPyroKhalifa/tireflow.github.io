using PointOfSale.Business.Contracts;
using PointOfSale.Data.Repository;
using PointOfSale.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PointOfSale.Business.Services
{
    public class TypeDocumentSaleService : ITypeDocumentSaleService
    {
        private readonly IGenericRepository<TypeDocumentSale> _repository;

        public TypeDocumentSaleService(IGenericRepository<TypeDocumentSale> repository)
        {
            _repository = repository;
        }

        public async Task<List<TypeDocumentSale>> List()
        {
            IQueryable<TypeDocumentSale> query = await _repository.Query();
            return query.ToList();
        }
    }
}
