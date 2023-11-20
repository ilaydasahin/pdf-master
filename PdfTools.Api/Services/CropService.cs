using Microsoft.AspNetCore.Http;
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;
using System.IO;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public class CropService : ICropService
    {
        public async Task<byte[]> CropPdfAsync(IFormFile file, CropRequest cropArea)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            using var document = PdfReader.Open(memoryStream, PdfDocumentOpenMode.Modify);

            foreach (var page in document.Pages)
            {
                // PdfRectangle in PdfSharpCore takes (x1, y1, x2, y2) as doubles (bottom-left to top-right in PDF coords)
                var newRect = new PdfRectangle(
                    cropArea.X,
                    cropArea.Y,
                    cropArea.X + cropArea.Width,
                    cropArea.Y + cropArea.Height
                );
                page.CropBox = newRect;
                page.MediaBox = newRect;
            }

            using var outputStream = new MemoryStream();
            document.Save(outputStream);
            return outputStream.ToArray();
        }
    }
}
