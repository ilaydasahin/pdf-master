using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Services;
using System;
using System.Threading.Tasks;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HtmlToPdfController : ControllerBase
    {
        private readonly IHtmlToPdfService _htmlToPdfService;

        public HtmlToPdfController(IHtmlToPdfService htmlToPdfService)
        {
            _htmlToPdfService = htmlToPdfService;
        }

        [HttpPost]
        public async Task<IActionResult> ConvertUrlToPdf([FromForm] string url)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                return BadRequest("URL is required.");
            }

            try
            {
                // Basic URL validation
                if (!Uri.TryCreate(url, UriKind.Absolute, out _))
                {
                    return BadRequest("Invalid URL format.");
                }

                var pdfBytes = await _htmlToPdfService.ConvertUrlToPdfAsync(url);
                return File(pdfBytes, "application/pdf", "converted.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
