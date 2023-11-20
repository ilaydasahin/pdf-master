using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public interface IHtmlToPdfService
    {
        Task<byte[]> ConvertUrlToPdfAsync(string url);
    }
}
