using Microsoft.AspNetCore.Http;
using PdfTools.Api.Models;

namespace PdfTools.Api.Models
{
    public class RotateRequest
    {
        public IFormFile File { get; set; }
        public RotateOptions Options { get; set; }
    }
}
