using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PointOfSale.Business.Contracts;
using PointOfSale.Model;
using PointOfSale.Models;
using PointOfSale.Utilities.Response;

namespace PointOfSale.Controllers
{
    [Authorize]
    public class InventoryController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly IProductService _productService;
        private readonly IMapper _mapper;
        public InventoryController(ICategoryService categoryService, IProductService productService, IMapper mapper)
        {
            _categoryService = categoryService;
            _productService = productService;
            _mapper = mapper;
        }

        public IActionResult Categories()
        {
            return View();
        }

        public IActionResult Products()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {

            List<VMCategory> vmCategoryList = _mapper.Map<List<VMCategory>>(await _categoryService.List());
            return StatusCode(StatusCodes.Status200OK, new { data = vmCategoryList });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] VMCategory model)
        {
            GenericResponse<VMCategory> gResponse = new GenericResponse<VMCategory>();
            try
            {
                Category category_created = await _categoryService.Add(_mapper.Map<Category>(model));

                model = _mapper.Map<VMCategory>(category_created);

                gResponse.State = true;
                gResponse.Object = model;
            }
            catch (Exception ex)
            {
                gResponse.State = false;
                gResponse.Message = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, gResponse);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCategory([FromBody] VMCategory model)
        {
            GenericResponse<VMCategory> gResponse = new GenericResponse<VMCategory>();
            try
            {

                Category edited_category = await _categoryService.Edit(_mapper.Map<Category>(model));

                model = _mapper.Map<VMCategory>(edited_category);

                gResponse.State = true;
                gResponse.Object = model;
            }
            catch (Exception ex)
            {
                gResponse.State = false;
                gResponse.Message = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, gResponse);
        }


        [HttpDelete]
        public async Task<IActionResult> DeleteCategory(int idCategory)
        {
            GenericResponse<string> gResponse = new GenericResponse<string>();
            try
            {
                gResponse.State = await _categoryService.Delete(idCategory);
            }
            catch (Exception ex)
            {
                gResponse.State = false;
                gResponse.Message = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, gResponse);
        }


        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            List<VMProduct> vmProductList = _mapper.Map<List<VMProduct>>(await _productService.List());

            /*
            // Get products with low stock
            List<string> lowStockProducts = GetProductsBelowThreshold(vmProductList);

            // Create notification message for low stock products
            if (lowStockProducts.Count > 0)
            {
                string notification = "Warning: The following products have a quantity below 5: " + string.Join(", ", lowStockProducts);
                TempData["LowQuantityNotification"] = notification;
            }
            */
            return StatusCode(StatusCodes.Status200OK, new { data = vmProductList });


        }


        private List<string> GetProductsBelowThreshold(List<VMProduct> products)
        {
            const int notificationThreshold = 5;
            List<string> lowStockProducts = new List<string>();

            foreach (var product in products)
            {
                if (product.Quantity < notificationThreshold)
                {
                    lowStockProducts.Add(product.Description);
                }
            }

            return lowStockProducts;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] IFormFile photo, [FromForm] string model)
        {
            GenericResponse<VMProduct> gResponse = new GenericResponse<VMProduct>();
            try
            {
                VMProduct vmProduct = JsonConvert.DeserializeObject<VMProduct>(model);

                if (photo != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        photo.CopyTo(ms);
                        var fileBytes = ms.ToArray();
                        vmProduct.Photo = fileBytes;
                    }
                }
                else
                    vmProduct.Photo = null;

                Product product_created = await _productService.Add(_mapper.Map<Product>(vmProduct));

                vmProduct = _mapper.Map<VMProduct>(product_created);

                gResponse.State = true;
                gResponse.Object = vmProduct;
            }
            catch (Exception ex)
            {
                gResponse.State = false;
                gResponse.Message = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, gResponse);
        }

        [HttpPut]
        public async Task<IActionResult> EditProduct([FromForm] IFormFile photo, [FromForm] string model)
        {
            GenericResponse<VMProduct> gResponse = new GenericResponse<VMProduct>();
            try
            {
                VMProduct vmProduct = JsonConvert.DeserializeObject<VMProduct>(model);

                if (photo != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        photo.CopyTo(ms);
                        var fileBytes = ms.ToArray();
                        vmProduct.Photo = fileBytes;
                    }
                }
                else
                    vmProduct.Photo = null;

                Product product_edited = await _productService.Edit(_mapper.Map<Product>(vmProduct));

                vmProduct = _mapper.Map<VMProduct>(product_edited);

                gResponse.State = true;
                gResponse.Object = vmProduct;
            }
            catch (Exception ex)
            {
                gResponse.State = false;
                gResponse.Message = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, gResponse);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteProduct(int IdProduct)
        {
            GenericResponse<string> gResponse = new GenericResponse<string>();
            try
            {
                gResponse.State = await _productService.Delete(IdProduct);
            }
            catch (Exception ex)
            {
                gResponse.State = false;
                gResponse.Message = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, gResponse);
        }



    }
}
