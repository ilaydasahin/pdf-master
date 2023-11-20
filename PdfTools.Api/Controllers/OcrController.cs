using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Models;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OcrController : ControllerBase
    {
        private readonly IOcrService _ocrService;

        public OcrController(IOcrService ocrService)
        {
            _ocrService = ocrService;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> ProcessOcr([FromForm] IFormFile file, [FromForm] OcrOptions options)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided.");
            }

            try
            {
                var pdfStream = await _ocrService.ProcessPdfWithOcrAsync(file, options);
                return File(pdfStream, "application/pdf", "ocr_processed.pdf");
            }
            catch (FileNotFoundException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"OCR processing failed: {ex.Message}");
            }
        }
    }
}
