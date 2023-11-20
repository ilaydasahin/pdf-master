using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Models;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MergeController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public MergeController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> Merge([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files provided.");
            }

            var pdfStream = await _pdfService.MergePdfsAsync(files);
            return File(pdfStream, "application/pdf", "merged.pdf");
        }
    }
}
