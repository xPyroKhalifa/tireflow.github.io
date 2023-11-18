using Microsoft.EntityFrameworkCore;
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
    public class RolService: IRolService
    {
        private readonly IGenericRepository<Rol> _repository;
        public RolService(IGenericRepository<Rol> repository)
        {
            _repository = repository;
        }
        public async Task<List<Rol>> List()
        {
            IQueryable<Rol> query = await _repository.Query();
            return query.ToList();
        }

    }
}
