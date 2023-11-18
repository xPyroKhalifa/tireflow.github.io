using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PointOfSale.Business.Contracts;
using PointOfSale.Data.Repository;
using PointOfSale.Model;

namespace PointOfSale.Business.Services
{
    public class ProductService : IProductService
    {
        private readonly IGenericRepository<Product> _repository;
        public ProductService(IGenericRepository<Product> repository)
        {
            _repository = repository;
        }

        public async Task<List<Product>> List()
        {
            IQueryable<Product> query = await _repository.Query();
            return query.Include(c => c.IdCategoryNavigation).ToList();
        }
        public async Task<Product> Add(Product entity)
        {
            Product product_exists = await _repository.Get(p => p.BarCode == entity.BarCode);

            if (product_exists != null)
                throw new TaskCanceledException("The barcode already exists");

            try
            {
                Product product_created = await _repository.Add(entity);

                if (product_created.IdProduct == 0)
                    throw new TaskCanceledException("Failed to create product");

                IQueryable<Product> query = await _repository.Query(p => p.IdProduct == product_created.IdProduct);
                product_created = query.Include(c => c.IdCategoryNavigation).First();

                return product_created;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<Product> Edit(Product entity)
        {
            Product product_exists = await _repository.Get(p => p.BarCode == entity.BarCode && p.IdProduct != entity.IdProduct);

            if (product_exists != null)
                throw new TaskCanceledException("The barcode already exists");

            try
            {
                IQueryable<Product> queryProduct = await _repository.Query(u => u.IdProduct == entity.IdProduct);

                Product product_edit = queryProduct.First();

                product_edit.BarCode = entity.BarCode;
                product_edit.Brand = entity.Brand;
                product_edit.Description = entity.Description;
                product_edit.IdCategory = entity.IdCategory;

                if (entity.Quantity >= 0)
                {
                    product_edit.Quantity = entity.Quantity;
                }
                else
                {
                    throw new TaskCanceledException("Quantity cannot be a negative number");
                }



                product_edit.Price = entity.Price;
                if (entity.Photo != null && entity.Photo.Length > 0)
                    product_edit.Photo = entity.Photo;
                product_edit.IsActive = entity.IsActive;

                bool response = await _repository.Edit(product_edit);
                if (!response)
                    throw new TaskCanceledException("The product could not be modified");

                Product product_edited = queryProduct.Include(c => c.IdCategoryNavigation).First();

                return product_edited;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<bool> Delete(int idProduct)
        {
            try
            {
                Product product_found = await _repository.Get(p => p.IdProduct == idProduct);

                if (product_found == null)
                    throw new TaskCanceledException("The product does not exist");

                bool response = await _repository.Delete(product_found);

                return response;
            }
            catch (Exception ex)
            {
                throw;
            }
        }


    }
}
