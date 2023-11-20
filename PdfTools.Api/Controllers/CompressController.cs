using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Models;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompressController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public CompressController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> Compress([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided.");
            }

            // Extract compression level from form
            var levelStr = Request.Form["level"].ToString();
            var level = Enum.TryParse<CompressionLevel>(levelStr, true, out var parsedLevel) 
                ? parsedLevel 
                : CompressionLevel.Medium;

            var options = new CompressOptions { Level = level };

            var compressedPdfStream = await _pdfService.CompressPdfAsync(file, options);
            return File(compressedPdfStream, "application/pdf", "compressed.pdf");
        }
    }
}
