using Microsoft.AspNetCore.Http;

namespace PdfTools.Api.Services
{
    public interface IOfficeConversionService
    {
        Task<byte[]> ConvertWordToPdfAsync(IFormFile file);
        Task<byte[]> ConvertExcelToPdfAsync(IFormFile file);
        Task<byte[]> ConvertPptToPdfAsync(IFormFile file);
    }
}
