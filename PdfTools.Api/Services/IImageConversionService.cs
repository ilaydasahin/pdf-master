using Microsoft.AspNetCore.Http;

namespace PdfTools.Api.Services
{
    public interface IImageConversionService
    {
        Task<Stream> ConvertImagesToPdfAsync(List<IFormFile> images);
        Task<Stream> ConvertPdfToImagesAsync(IFormFile pdf);
    }
}
