using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using PointOfSale.Data.DBContext;
using PointOfSale.Data.Repository;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using PointOfSale.Model;

namespace PointOfSale.Data.Repository
{
    public class SaleRepository : GenericRepository<Sale>, ISaleRepository
    {
        private readonly POINTOFSALEContext _dbcontext;
        public SaleRepository(POINTOFSALEContext context) : base(context)
        {
            _dbcontext = context;
        }

        public async Task<Sale> Register(Sale entity)
        {

            Sale SaleGenerated = new Sale();
            using (var transaction = _dbcontext.Database.BeginTransaction())
            {
                try
                {
                    foreach (DetailSale dv in entity.DetailSales)
                    {

                        Product product_found = _dbcontext.Products.Where(p => p.IdProduct == dv.IdProduct).First();
                        int newQuantity = Convert.ToInt32(product_found.Quantity) - Convert.ToInt32(dv.Quantity);
						

                        if (dv.Quantity <0 || dv.Quantity == 0)
                        {
                            throw new Exception("Quantity cannot be less than 0.");
                        }
                        else if (newQuantity <0)
                        {
                            throw new Exception("Quantity cannot be less than 0.");
                        }


						product_found.Quantity = newQuantity;
                        _dbcontext.Products.Update(product_found);
                    }
                    await _dbcontext.SaveChangesAsync();

                    CorrelativeNumber correlative = _dbcontext.CorrelativeNumbers.Where(n => n.Management == "Sale").First();

                    correlative.LastNumber = correlative.LastNumber + 1;
                    correlative.DateUpdate = DateTime.Now;

                    _dbcontext.CorrelativeNumbers.Update(correlative);
                    await _dbcontext.SaveChangesAsync();


                    string ceros = string.Concat(Enumerable.Repeat("0", correlative.QuantityDigits.Value));
                    string saleNumber = ceros + correlative.LastNumber.ToString();
                    saleNumber = saleNumber.Substring(saleNumber.Length - correlative.QuantityDigits.Value, correlative.QuantityDigits.Value);

                    entity.SaleNumber = saleNumber;

                    await _dbcontext.Sales.AddAsync(entity);
                    await _dbcontext.SaveChangesAsync();

                    SaleGenerated = entity;

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw;
                }
            }

            return SaleGenerated;
        }

        public async Task<List<DetailSale>> Report(DateTime StarDate, DateTime EndDate)
        {
            List<DetailSale> listSummary = await _dbcontext.DetailSales
                .Include(v => v.IdSaleNavigation)
                .ThenInclude(u => u.IdUsersNavigation)
                .Include(v => v.IdSaleNavigation)
                .ThenInclude(tdv => tdv.IdTypeDocumentSaleNavigation)
                .Where(dv => dv.IdSaleNavigation.RegistrationDate.Value.Date >= StarDate.Date && dv.IdSaleNavigation.RegistrationDate.Value.Date <= EndDate.Date)
                .ToListAsync();

            return listSummary;
        }



    }
}
