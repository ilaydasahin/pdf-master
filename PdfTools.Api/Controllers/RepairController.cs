using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Services;
using System;
using System.Threading.Tasks;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RepairController : ControllerBase
    {
        private readonly IRepairService _repairService;

        public RepairController(IRepairService repairService)
        {
            _repairService = repairService;
        }

        [HttpPost]
        public async Task<IActionResult> RepairPdf(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                var pdfBytes = await _repairService.RepairPdfAsync(file);
                return File(pdfBytes, "application/pdf", "repaired.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
