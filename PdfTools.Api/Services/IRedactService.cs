using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public class RedactionRequest
    {
        public int PageNumber { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
    }

    public interface IRedactService
    {
        Task<byte[]> RedactPdfAsync(IFormFile file, List<RedactionRequest> redactions);
    }
}
