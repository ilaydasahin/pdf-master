using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Services;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RedactController : ControllerBase
    {
        private readonly IRedactService _redactService;

        public RedactController(IRedactService redactService)
        {
            _redactService = redactService;
        }

        [HttpPost]
        public async Task<IActionResult> RedactPdf([FromForm] IFormFile file, [FromForm] string redactionsJson)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            if (string.IsNullOrWhiteSpace(redactionsJson))
                return BadRequest("No redactions specified.");

            try
            {
                var redactions = JsonSerializer.Deserialize<List<RedactionRequest>>(redactionsJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (redactions == null || redactions.Count == 0)
                    return BadRequest("Invalid redaction data.");

                var pdfBytes = await _redactService.RedactPdfAsync(file, redactions);
                return File(pdfBytes, "application/pdf", "redacted.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
