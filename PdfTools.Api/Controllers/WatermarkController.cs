using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Models;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WatermarkController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public WatermarkController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> AddWatermark([FromForm] IFormFile file, [FromForm] WatermarkOptions options)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided.");
            }

            var pdfStream = await _pdfService.AddWatermarkAsync(file, options);
            return File(pdfStream, "application/pdf", "watermarked.pdf");
        }
    }
}
