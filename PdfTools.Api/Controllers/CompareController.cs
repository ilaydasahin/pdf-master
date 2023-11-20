using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Services;
using System;
using System.Threading.Tasks;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompareController : ControllerBase
    {
        private readonly ICompareService _compareService;

        public CompareController(ICompareService compareService)
        {
            _compareService = compareService;
        }

        [HttpPost]
        public async Task<IActionResult> ComparePdfs(IFormFile file1, IFormFile file2)
        {
            if (file1 == null || file1.Length == 0 || file2 == null || file2.Length == 0)
                return BadRequest("Two files are required.");

            try
            {
                var pdfBytes = await _compareService.ComparePdfsAsync(file1, file2);
                return File(pdfBytes, "application/pdf", "comparison_result.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
