using Microsoft.EntityFrameworkCore;
using PointOfSale.Business.Contracts;
using PointOfSale.Data.Repository;
using PointOfSale.Model;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PointOfSale.Business.Services
{
    public class SaleService : ISaleService
    {
        private readonly IGenericRepository<Product> _repositoryProduct;
        private readonly ISaleRepository _repositorySale;
        public SaleService(IGenericRepository<Product> repositoryProduct, ISaleRepository repositorySale)
        {
            _repositoryProduct = repositoryProduct;
            _repositorySale = repositorySale;
        }

        public async Task<List<Product>> GetProducts(string search)
        {
            IQueryable<Product> query = await _repositoryProduct.Query(p =>
           p.IsActive == true &&
           p.Quantity > 0 &&
           string.Concat(p.BarCode, p.Brand, p.Description).Contains(search)
           );

            return query.Include(c => c.IdCategoryNavigation).ToList();
        }

        public async Task<Sale> Register(Sale entity)
        {
            try
            {
                return await _repositorySale.Register(entity);
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<Sale>> SaleHistory(string SaleNumber, string StarDate, string EndDate)
        {
            IQueryable<Sale> query = await _repositorySale.Query();
            StarDate = StarDate is null ? "" : StarDate;
            EndDate = EndDate is null ? "" : EndDate;

            if (StarDate != "" && EndDate != "")
            {

                DateTime start_date = DateTime.ParseExact(StarDate, "dd/MM/yyyy", new CultureInfo("es-PE"));
                DateTime end_date = DateTime.ParseExact(EndDate, "dd/MM/yyyy", new CultureInfo("es-PE"));

                return query.Where(v =>
                    v.RegistrationDate.Value.Date >= start_date.Date &&
                    v.RegistrationDate.Value.Date <= end_date.Date
                )
                .Include(tdv => tdv.IdTypeDocumentSaleNavigation)
                .Include(u => u.IdUsersNavigation)
                .Include(dv => dv.DetailSales)
                .ToList();
            }
            else
            {
                return query.Where(v => v.SaleNumber == SaleNumber)
                .Include(tdv => tdv.IdTypeDocumentSaleNavigation)
                .Include(u => u.IdUsersNavigation)
                .Include(dv => dv.DetailSales)
                .ToList();
            }
        }

        public async Task<Sale> Detail(string SaleNumber)
        {
            IQueryable<Sale> query = await _repositorySale.Query(v => v.SaleNumber == SaleNumber);

            return query
               .Include(tdv => tdv.IdTypeDocumentSaleNavigation)
               .Include(u => u.IdUsersNavigation)
               .Include(dv => dv.DetailSales)
               .First();
        }

        public async Task<List<DetailSale>> Report(string StartDate, string EndDate)
        {
            DateTime start_date = DateTime.ParseExact(StartDate, "dd/MM/yyyy", new CultureInfo("es-PE"));
            DateTime end_date = DateTime.ParseExact(EndDate, "dd/MM/yyyy", new CultureInfo("es-PE"));

            List<DetailSale> lista = await _repositorySale.Report(start_date, end_date);

            return lista;
        }

        
    }
}
