using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Models;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SplitController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public SplitController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> Split([FromForm] IFormFile file, [FromForm] string mode, [FromForm] string ranges, [FromForm] List<int> selectedPages)
        {
            var options = new PdfSplitOptions
            {
                Mode = mode,
                Ranges = ranges,
                SelectedPages = selectedPages
            };
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided.");
            }



            var zipStream = await _pdfService.SplitPdfAsync(file, options);
            return File(zipStream, "application/zip", "split_files.zip");
        }
    }
}
