using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public interface ICompareService
    {
        Task<byte[]> ComparePdfsAsync(IFormFile file1, IFormFile file2);
    }
}
