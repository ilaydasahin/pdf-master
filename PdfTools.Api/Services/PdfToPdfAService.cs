using Microsoft.AspNetCore.Http;
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;
using System.IO;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public class PdfToPdfAService : IPdfToPdfAService
    {
        public async Task<byte[]> ConvertToPdfAAsync(IFormFile file)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            using var document = PdfReader.Open(memoryStream, PdfDocumentOpenMode.Import);
            
            using var outputDocument = new PdfDocument();
            // Attempt to set PDF/A conformance level (PdfSharpCore support is limited)
            // We can set the version, but full PDF/A validation requires more (embedded fonts, color profiles, etc.)
            // This is a "best effort" conversion with the available free library.
            outputDocument.Version = 14; // PDF 1.4 is often used for PDF/A-1
            
            foreach (var page in document.Pages)
            {
                outputDocument.AddPage(page);
            }
            
            // In a real scenario with Ghostscript, we would shell out to gs:
            // gs -dPDFA -dBATCH -dNOPAUSE -sProcessColorModel=DeviceCMYK -sDEVICE=pdfwrite -sPDFACompatibilityPolicy=1 -sOutputFile=output.pdf input.pdf

            using var outputStream = new MemoryStream();
            outputDocument.Save(outputStream);
            return outputStream.ToArray();
        }
    }
}
