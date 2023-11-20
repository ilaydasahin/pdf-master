using Microsoft.AspNetCore.Http;
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;
using System.IO;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public class RepairService : IRepairService
    {
        public async Task<byte[]> RepairPdfAsync(IFormFile file)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            // PdfSharpCore's Open method with PdfDocumentOpenMode.Import can often read slightly damaged files
            // and saving them creates a clean new structure.
            using var document = PdfReader.Open(memoryStream, PdfDocumentOpenMode.Import);
            
            using var outputDocument = new PdfDocument();
            foreach (var page in document.Pages)
            {
                outputDocument.AddPage(page);
            }

            using var outputStream = new MemoryStream();
            outputDocument.Save(outputStream);
            return outputStream.ToArray();
        }
    }
}
