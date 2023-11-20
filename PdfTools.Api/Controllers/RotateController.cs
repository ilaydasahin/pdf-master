using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Models;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RotateController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public RotateController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> Rotate([FromForm] IFormFile file, [FromForm] RotateOptions options)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided.");
            }

            var pdfStream = await _pdfService.RotatePdfAsync(file, options);
            return File(pdfStream, "application/pdf", "rotated.pdf");
        }
    }
}
