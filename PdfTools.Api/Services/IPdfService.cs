using Microsoft.AspNetCore.Http;
using PdfTools.Api;

namespace PdfTools.Api.Services
{
    public interface IPdfService
    {
        Task<Stream> MergePdfsAsync(List<IFormFile> files);
        Task<Stream> SplitPdfAsync(IFormFile file, PdfTools.Api.Models.PdfSplitOptions options);
        Task<Stream> RotatePdfAsync(IFormFile file, Models.RotateOptions options);
        Task<Stream> DeletePagesAsync(IFormFile file, Models.DeleteOptions options);
        Task<Stream> CompressPdfAsync(IFormFile file, Models.CompressOptions options);
        Task<Stream> AddWatermarkAsync(IFormFile file, Models.WatermarkOptions options);
        Task<Stream> AddPageNumbersAsync(IFormFile file, Models.PageNumberOptions options);
        Task<Stream> ProtectPdfAsync(IFormFile file, Models.ProtectOptions options);
        Task<Stream> UnlockPdfAsync(IFormFile file, Models.UnlockOptions options);
        Task<Stream> EditPdfAsync(IFormFile file, Models.EditOptions options);
    }
}
