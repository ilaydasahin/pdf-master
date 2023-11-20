using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Services;
using System;
using System.Threading.Tasks;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PdfToPdfAController : ControllerBase
    {
        private readonly IPdfToPdfAService _pdfToPdfAService;

        public PdfToPdfAController(IPdfToPdfAService pdfToPdfAService)
        {
            _pdfToPdfAService = pdfToPdfAService;
        }

        [HttpPost]
        public async Task<IActionResult> ConvertToPdfA(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                var pdfBytes = await _pdfToPdfAService.ConvertToPdfAAsync(file);
                return File(pdfBytes, "application/pdf", "converted_pdfa.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
