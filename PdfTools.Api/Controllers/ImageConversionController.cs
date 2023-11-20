using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Services;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageConversionController : ControllerBase
    {
        private readonly IImageConversionService _conversionService;

        public ImageConversionController(IImageConversionService conversionService)
        {
            _conversionService = conversionService;
        }

        [HttpPost("jpg-to-pdf")]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> JpgToPdf(List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files provided.");
            }

            try
            {
                var pdfStream = await _conversionService.ConvertImagesToPdfAsync(files);
                return File(pdfStream, "application/pdf", "images_to_pdf.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Image conversion failed: {ex.Message}");
            }
        }

        [HttpPost("pdf-to-jpg")]
        [RequestSizeLimit(100_000_000)] // 100 MB limit
        public async Task<IActionResult> PdfToJpg(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided.");
            }

            try
            {
                var zipStream = await _conversionService.ConvertPdfToImagesAsync(file);
                return File(zipStream, "application/zip", "pdf_images.zip");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"PDF conversion failed: {ex.Message}");
            }
        }
    }
}
