using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Services;
using System;
using System.Threading.Tasks;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CropController : ControllerBase
    {
        private readonly ICropService _cropService;

        public CropController(ICropService cropService)
        {
            _cropService = cropService;
        }

        [HttpPost]
        public async Task<IActionResult> CropPdf([FromForm] IFormFile file, [FromForm] double x, [FromForm] double y, [FromForm] double width, [FromForm] double height)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            if (width <= 0 || height <= 0)
                return BadRequest("Invalid crop dimensions.");

            try
            {
                var cropRequest = new CropRequest
                {
                    X = x,
                    Y = y,
                    Width = width,
                    Height = height
                };

                var pdfBytes = await _cropService.CropPdfAsync(file, cropRequest);
                return File(pdfBytes, "application/pdf", "cropped.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
