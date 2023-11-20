using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public interface IPdfToPdfAService
    {
        Task<byte[]> ConvertToPdfAAsync(IFormFile file);
    }
}
