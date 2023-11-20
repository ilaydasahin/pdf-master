using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Models;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PageNumberController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public PageNumberController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> AddPageNumbers([FromForm] IFormFile file, [FromForm] PageNumberOptions options)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided.");
            }

            var pdfStream = await _pdfService.AddPageNumbersAsync(file, options);
            return File(pdfStream, "application/pdf", "numbered.pdf");
        }
    }
}
