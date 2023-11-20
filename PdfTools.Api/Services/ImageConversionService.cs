using ImageMagick;
using Microsoft.AspNetCore.Http;
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;
using System.IO.Compression;

namespace PdfTools.Api.Services
{
    public class ImageConversionService : IImageConversionService
    {
        public async Task<Stream> ConvertImagesToPdfAsync(List<IFormFile> images)
        {
            var pdfDocument = new PdfDocument();

            foreach (var image in images)
            {
                if (image.Length > 0)
                {
                    using var imageStream = image.OpenReadStream();
                    
                    // Convert image stream to byte array
                    using var memStream = new MemoryStream();
                    await imageStream.CopyToAsync(memStream);
                    var imageBytes = memStream.ToArray();
                    
                    // Use ImageMagick to get image dimensions
                    using var magickImage = new MagickImage(imageBytes);
                    
                    // Create PDF page
                    var page = pdfDocument.AddPage();
                    page.Width = magickImage.Width;
                    page.Height = magickImage.Height;

                    using var gfx = PdfSharpCore.Drawing.XGraphics.FromPdfPage(page);
                    
                    // Load image from bytes
                    using var imgStream = new MemoryStream(imageBytes);
                    using var xImage = PdfSharpCore.Drawing.XImage.FromStream(() => imgStream);
                    gfx.DrawImage(xImage, 0, 0, page.Width, page.Height);
                }
            }

            var memoryStream = new MemoryStream();
            pdfDocument.Save(memoryStream, false);
            memoryStream.Position = 0;
            return memoryStream;
        }

        public async Task<Stream> ConvertPdfToImagesAsync(IFormFile pdf)
        {
            using var stream = pdf.OpenReadStream();
            var zipStream = new MemoryStream();

            using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, true))
            {
                // Read PDF using Magick.NET
                using var images = new MagickImageCollection();
                
                var settings = new MagickReadSettings
                {
                    Density = new Density(150) // 150 DPI for good quality
                };
                
                images.Read(stream, settings);

                int pageNumber = 1;
                foreach (var image in images)
                {
                    // Convert to JPG
                    image.Format = MagickFormat.Jpg;
                    image.Quality = 90;
                    
                    var imageBytes = image.ToByteArray();
                    
                    var entry = archive.CreateEntry($"page_{pageNumber}.jpg");
                    using var entryStream = entry.Open();
                    await entryStream.WriteAsync(imageBytes.AsMemory());
                    
                    pageNumber++;
                }
            }

            zipStream.Position = 0;
            return zipStream;
        }
    }
}
