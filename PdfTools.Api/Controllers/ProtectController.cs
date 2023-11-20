using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Models;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProtectController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public ProtectController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> Protect([FromForm] IFormFile file, [FromForm] ProtectOptions options)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided.");
            }

            if (string.IsNullOrEmpty(options.UserPassword) && string.IsNullOrEmpty(options.OwnerPassword))
            {
                return BadRequest("At least one password (user or owner) must be provided.");
            }

            var pdfStream = await _pdfService.ProtectPdfAsync(file, options);
            return File(pdfStream, "application/pdf", "protected.pdf");
        }
    }
}
