using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public class CropRequest
    {
        public double X { get; set; }
        public double Y { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
    }

    public interface ICropService
    {
        Task<byte[]> CropPdfAsync(IFormFile file, CropRequest cropArea);
    }
}
