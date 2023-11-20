using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public interface IRepairService
    {
        Task<byte[]> RepairPdfAsync(IFormFile file);
    }
}
