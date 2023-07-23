using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PointOfSale.Business.Contracts;
using PointOfSale.Models;

namespace PointOfSale.Controllers
{
    public class TemplateController : Controller
    {
        private readonly ISaleService _saleService;
        private readonly IMapper _mapper;
        public TemplateController(ISaleService saleService, IMapper mapper)
        {
            _saleService = saleService;
            _mapper = mapper;
        }
        public async Task<IActionResult> PDFSale(string saleNumber)
        {
            VMSale vmVenta = _mapper.Map<VMSale>(await _saleService.Detail(saleNumber));

            return View(vmVenta);
        }
    }
}
