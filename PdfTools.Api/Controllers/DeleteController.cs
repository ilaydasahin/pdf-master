using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Models;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeleteController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public DeleteController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> Delete([FromForm] IFormFile file, [FromForm] DeleteOptions options)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided.");
            }

            if (options.PagesToDelete == null || options.PagesToDelete.Count == 0)
            {
                return BadRequest("No pages selected for deletion.");
            }

            var pdfStream = await _pdfService.DeletePagesAsync(file, options);
            return File(pdfStream, "application/pdf", "modified.pdf");
        }
    }
}
