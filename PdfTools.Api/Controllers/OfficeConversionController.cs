using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OfficeConversionController : ControllerBase
    {
        private readonly IOfficeConversionService _conversionService;

        public OfficeConversionController(IOfficeConversionService conversionService)
        {
            _conversionService = conversionService;
        }

        [HttpPost("word-to-pdf")]
        public async Task<IActionResult> ConvertWordToPdf(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                var pdfBytes = await _conversionService.ConvertWordToPdfAsync(file);
                return File(pdfBytes, "application/pdf", "converted.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("excel-to-pdf")]
        public async Task<IActionResult> ConvertExcelToPdf(IFormFile file)
        {
             if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                var pdfBytes = await _conversionService.ConvertExcelToPdfAsync(file);
                return File(pdfBytes, "application/pdf", "converted.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("ppt-to-pdf")]
        public async Task<IActionResult> ConvertPptToPdf(IFormFile file)
        {
             if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                var pdfBytes = await _conversionService.ConvertPptToPdfAsync(file);
                return File(pdfBytes, "application/pdf", "converted.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
