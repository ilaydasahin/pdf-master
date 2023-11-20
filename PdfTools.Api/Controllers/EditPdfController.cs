using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EditPdfController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public EditPdfController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // 100 MB
        public async Task<IActionResult> EditPdf([FromForm] IFormFile file, [FromForm] string? textElements, [FromForm] string? imageElements)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // Parse options from form data
            var options = new Models.EditOptions();
            
            if (!string.IsNullOrEmpty(textElements))
            {
                options.TextElements = System.Text.Json.JsonSerializer.Deserialize<List<Models.TextElement>>(textElements) ?? new();
            }
            
            if (!string.IsNullOrEmpty(imageElements))
            {
                options.ImageElements = System.Text.Json.JsonSerializer.Deserialize<List<Models.ImageElement>>(imageElements) ?? new();
            }

            var result = await _pdfService.EditPdfAsync(file, options);
            return File(result, "application/pdf", "edited.pdf");
        }
    }
}
