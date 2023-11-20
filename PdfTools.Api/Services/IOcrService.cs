using Microsoft.AspNetCore.Http;

namespace PdfTools.Api.Services
{
    public interface IOcrService
    {
        Task<Stream> ProcessPdfWithOcrAsync(IFormFile file, Models.OcrOptions options);
    }
}
