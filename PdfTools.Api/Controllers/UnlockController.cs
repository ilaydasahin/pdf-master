using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Models;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnlockController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public UnlockController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> Unlock([FromForm] IFormFile file, [FromForm] UnlockOptions options)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided.");
            }

            if (string.IsNullOrEmpty(options.Password))
            {
                return BadRequest("Password is required to unlock the PDF.");
            }

            try
            {
                var pdfStream = await _pdfService.UnlockPdfAsync(file, options);
                return File(pdfStream, "application/pdf", "unlocked.pdf");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}
