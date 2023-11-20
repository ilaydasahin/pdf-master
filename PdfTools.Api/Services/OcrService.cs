using ImageMagick;
using Microsoft.AspNetCore.Http;
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;

namespace PdfTools.Api.Services
{
    public class OcrService : IOcrService
    {
        private readonly string _tessDataPath;
        private readonly ILogger<OcrService>? _logger;

        public OcrService(ILogger<OcrService>? logger = null)
        {
            _logger = logger;
            // Tesseract language files path
            _tessDataPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "tessdata");
            
            // Create tessdata directory if it doesn't exist
            if (!Directory.Exists(_tessDataPath))
            {
                Directory.CreateDirectory(_tessDataPath);
            }
        }

        public async Task<Stream> ProcessPdfWithOcrAsync(IFormFile file, Models.OcrOptions options)
        {
            // Check if tessdata exists
            var tessdataFile = Path.Combine(_tessDataPath, $"{options.Language}.traineddata");
            if (!File.Exists(tessdataFile))
            {
                throw new FileNotFoundException(
                    $"OCR feature requires Tesseract language data. " +
                    $"Please download '{options.Language}.traineddata' from " +
                    $"https://github.com/tesseract-ocr/tessdata and place it in '{_tessDataPath}'.");
            }

            using var engine = new Tesseract.TesseractEngine(_tessDataPath, options.Language, Tesseract.EngineMode.Default);
            using var stream = file.OpenReadStream();
            
            // Convert PDF to Images using Magick.NET
            // Note: This requires Ghostscript to be installed on the server/machine
            using var images = new MagickImageCollection();
            var settings = new MagickReadSettings
            {
                Density = new Density(300) // High DPI for better OCR
            };
            
            try 
            {
                images.Read(stream, settings);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to convert PDF to images. Ensure Ghostscript is installed. Error: {ex.Message}", ex);
            }

            var outputDocument = new PdfDocument();

            foreach (var image in images)
            {
                // 1. Create PDF Page matching image dimensions
                // Convert pixels (at 300 DPI) to points (72 DPI)
                var widthInPoints = image.Width * 72.0 / 300.0;
                var heightInPoints = image.Height * 72.0 / 300.0;

                var page = outputDocument.AddPage();
                page.Width = widthInPoints;
                page.Height = heightInPoints;
                
                using var gfx = PdfSharpCore.Drawing.XGraphics.FromPdfPage(page);

                // 2. Draw the original image as background
                // We need to convert MagickImage to a format XImage can read
                image.Format = MagickFormat.Png;
                var imageBytes = image.ToByteArray();
                using var ms = new MemoryStream(imageBytes);
                using var xImage = PdfSharpCore.Drawing.XImage.FromStream(() => ms);
                
                gfx.DrawImage(xImage, 0, 0, widthInPoints, heightInPoints);

                // 3. Perform OCR
                using var pix = Tesseract.Pix.LoadFromMemory(imageBytes);
                using var pageOcr = engine.Process(pix);
                
                // 4. Add invisible text overlay
                using var iter = pageOcr.GetIterator();
                iter.Begin();
                
                do
                {
                    if (iter.TryGetBoundingBox(Tesseract.PageIteratorLevel.Word, out var rect))
                    {
                        var text = iter.GetText(Tesseract.PageIteratorLevel.Word);
                        if (string.IsNullOrWhiteSpace(text)) continue;

                        // Convert coordinates from Pixels (300 DPI) to Points (72 DPI)
                        double x = rect.X1 * 72.0 / 300.0;
                        double y = rect.Y1 * 72.0 / 300.0;
                        double w = rect.Width * 72.0 / 300.0;
                        double h = rect.Height * 72.0 / 300.0;

                        // Font size estimation (height of the bounding box)
                        // We use a transparent brush to make text invisible but selectable
                        var font = new PdfSharpCore.Drawing.XFont("Arial", h, PdfSharpCore.Drawing.XFontStyle.Regular);
                        var brush = new PdfSharpCore.Drawing.XSolidBrush(PdfSharpCore.Drawing.XColor.FromArgb(0, 0, 0, 0));

                        gfx.DrawString(text, font, brush, new PdfSharpCore.Drawing.XRect(x, y, w, h), PdfSharpCore.Drawing.XStringFormats.TopLeft);
                    }
                } while (iter.Next(Tesseract.PageIteratorLevel.Word));
            }

            var memoryStream = new MemoryStream();
            outputDocument.Save(memoryStream, false);
            memoryStream.Position = 0;
            
            return memoryStream;
        }
    }
}
