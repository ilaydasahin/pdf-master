using Microsoft.AspNetCore.Http;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public class RedactService : IRedactService
    {
        public async Task<byte[]> RedactPdfAsync(IFormFile file, List<RedactionRequest> redactions)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            using var document = PdfReader.Open(memoryStream, PdfDocumentOpenMode.Modify);

            foreach (var redaction in redactions)
            {
                if (redaction.PageNumber < 1 || redaction.PageNumber > document.PageCount) continue;

                var page = document.Pages[redaction.PageNumber - 1];
                using var gfx = XGraphics.FromPdfPage(page);

                // Draw black rectangle
                gfx.DrawRectangle(XBrushes.Black, redaction.X, redaction.Y, redaction.Width, redaction.Height);
            }

            using var outputStream = new MemoryStream();
            document.Save(outputStream);
            return outputStream.ToArray();
        }
    }
}
