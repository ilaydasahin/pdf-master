using ImageMagick;
using Microsoft.AspNetCore.Http;
using PdfSharpCore.Pdf;
using PdfSharpCore.Drawing;
using System;
using System.IO;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public class CompareService : ICompareService
    {
        public async Task<byte[]> ComparePdfsAsync(IFormFile file1, IFormFile file2)
        {
            // Render first PDF as images for comparison output
            using var stream1 = file1.OpenReadStream();

            var settings = new MagickReadSettings
            {
                Density = new Density(150)
            };

            using var images = new MagickImageCollection();
            images.Read(stream1, settings);

            using var outputDoc = new PdfDocument();

            foreach (var image in images)
            {
                var page = outputDoc.AddPage();
                page.Width = image.Width * 72.0 / 150.0;
                page.Height = image.Height * 72.0 / 150.0;

                using var gfx = XGraphics.FromPdfPage(page);

                // Convert image to PNG bytes and render on PDF page
                var magickImage = (MagickImage)image;
                magickImage.Format = MagickFormat.Png;
                var imageBytes = magickImage.ToByteArray();

                using var ms = new MemoryStream(imageBytes);
                using var xImage = XImage.FromStream(() => ms);

                gfx.DrawImage(xImage, 0, 0, page.Width, page.Height);
            }

            using var outputStream = new MemoryStream();
            outputDoc.Save(outputStream);
            return outputStream.ToArray();
        }
    }
}
