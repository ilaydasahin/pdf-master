using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;
using PdfSharpCore.Drawing;
using Microsoft.AspNetCore.Http;

namespace PdfTools.Api.Services
{
    public class PdfService : IPdfService
    {
        public async Task<Stream> MergePdfsAsync(List<IFormFile> files)
        {
            var outputDocument = new PdfDocument();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using var stream = file.OpenReadStream();
                    using var inputDocument = PdfReader.Open(stream, PdfDocumentOpenMode.Import);
                    
                    int count = inputDocument.PageCount;
                    for (int idx = 0; idx < count; idx++)
                    {
                        var page = inputDocument.Pages[idx];
                        outputDocument.AddPage(page);
                    }
                }
            }

            var memoryStream = new MemoryStream();
            outputDocument.Save(memoryStream, false);
            memoryStream.Position = 0;
            return memoryStream;
        }

        public async Task<Stream> SplitPdfAsync(IFormFile file, PdfTools.Api.Models.PdfSplitOptions options)
        {
            using var stream = file.OpenReadStream();
            using var inputDocument = PdfReader.Open(stream, PdfDocumentOpenMode.Import);
            var zipStream = new MemoryStream();
            Console.WriteLine($"SplitPdfAsync called. Mode: {options.Mode}, Ranges: {options.Ranges}, Pages: {inputDocument.PageCount}");

            using (var archive = new System.IO.Compression.ZipArchive(zipStream, System.IO.Compression.ZipArchiveMode.Create, true))
            {
                if (options.Mode == "extract" && options.SelectedPages != null)
                {
                    foreach (var pageNum in options.SelectedPages)
                    {
                        if (pageNum < 1 || pageNum > inputDocument.PageCount) continue;

                        using var outputDocument = new PdfDocument();
                        outputDocument.AddPage(inputDocument.Pages[pageNum - 1]);

                        using var memoryStream = new MemoryStream();
                        outputDocument.Save(memoryStream, false);
                        memoryStream.Position = 0;

                        var entry = archive.CreateEntry($"page_{pageNum}.pdf");
                        using var entryStream = entry.Open();
                        memoryStream.CopyTo(entryStream);
                    }
                }
                else if (options.Mode == "range" && !string.IsNullOrEmpty(options.Ranges))
                {
                    var ranges = options.Ranges.Split(',');
                    int rangeIndex = 1;

                    foreach (var range in ranges)
                    {
                        var parts = range.Split('-');
                        if (parts.Length != 2) continue;

                        if (int.TryParse(parts[0], out int start) && int.TryParse(parts[1], out int end))
                        {
                            using var outputDocument = new PdfDocument();
                            for (int i = start; i <= end; i++)
                            {
                                if (i < 1 || i > inputDocument.PageCount) continue;
                                outputDocument.AddPage(inputDocument.Pages[i - 1]);
                            }

                            if (outputDocument.PageCount > 0)
                            {
                                using var memoryStream = new MemoryStream();
                                outputDocument.Save(memoryStream, false);
                                memoryStream.Position = 0;

                                var entry = archive.CreateEntry($"split_{rangeIndex}_{start}-{end}.pdf");
                                using var entryStream = entry.Open();
                                memoryStream.CopyTo(entryStream);
                                rangeIndex++;
                            }
                        }
                    }
                }
            }

            zipStream.Position = 0;
            return zipStream;
        }

        public async Task<Stream> RotatePdfAsync(IFormFile file, Models.RotateOptions options)
        {
            using var stream = file.OpenReadStream();
            using var inputDocument = PdfReader.Open(stream, PdfDocumentOpenMode.Import);
            var outputDocument = new PdfDocument();

            int count = inputDocument.PageCount;
            for (int idx = 0; idx < count; idx++)
            {
                var page = inputDocument.Pages[idx];
                int pageNumber = idx + 1;

                if (options.RotationDegrees.TryGetValue(pageNumber, out int degrees))
                {
                    int currentRotation = page.Rotate;
                    int newRotation = (currentRotation + degrees) % 360;
                    if (newRotation < 0) newRotation += 360;
                    
                    page.Rotate = newRotation;
                }

                outputDocument.AddPage(page);
            }

            var memoryStream = new MemoryStream();
            outputDocument.Save(memoryStream, false);
            memoryStream.Position = 0;
            return memoryStream;
        }

        public async Task<Stream> DeletePagesAsync(IFormFile file, Models.DeleteOptions options)
        {
            using var stream = file.OpenReadStream();
            using var inputDocument = PdfReader.Open(stream, PdfDocumentOpenMode.Import);
            var outputDocument = new PdfDocument();

            int count = inputDocument.PageCount;
            var pagesToDelete = new HashSet<int>(options.PagesToDelete);

            for (int idx = 0; idx < count; idx++)
            {
                int pageNumber = idx + 1;
                if (!pagesToDelete.Contains(pageNumber))
                {
                    var page = inputDocument.Pages[idx];
                    outputDocument.AddPage(page);
                }
            }

            var memoryStream = new MemoryStream();
            outputDocument.Save(memoryStream, false);
            memoryStream.Position = 0;
            return memoryStream;
        }

        public async Task<Stream> CompressPdfAsync(IFormFile file, Models.CompressOptions options)
        {
            using var stream = file.OpenReadStream();
            using var inputDocument = PdfReader.Open(stream, PdfDocumentOpenMode.Import);
            var outputDocument = new PdfDocument();

            outputDocument.Options.CompressContentStreams = true;
            outputDocument.Options.NoCompression = false;

            int count = inputDocument.PageCount;
            for (int idx = 0; idx < count; idx++)
            {
                var page = inputDocument.Pages[idx];
                outputDocument.AddPage(page);
            }

            var memoryStream = new MemoryStream();
            outputDocument.Save(memoryStream, false);
            memoryStream.Position = 0;
            return memoryStream;
        }

        public async Task<Stream> AddWatermarkAsync(IFormFile file, Models.WatermarkOptions options)
        {
            using var stream = file.OpenReadStream();
            using var inputDocument = PdfReader.Open(stream, PdfDocumentOpenMode.Modify);
            
            var font = new XFont("Arial", options.FontSize, XFontStyle.Regular);
            
            foreach (var page in inputDocument.Pages)
            {
                using var gfx = XGraphics.FromPdfPage(page);
                var size = gfx.MeasureString(options.Text, font);
                
                double x, y;
                if (options.Position == "diagonal")
                {
                    x = page.Width / 2;
                    y = page.Height / 2;
                    gfx.RotateAtTransform(-45, new XPoint(x, y));
                }
                else if (options.Position == "center")
                {
                    x = (page.Width - size.Width) / 2;
                    y = (page.Height - size.Height) / 2;
                }
                else
                {
                    x = page.Width - size.Width - 50;
                    y = 50;
                }

                var alpha = options.Opacity / 100.0;
                var brush = new XSolidBrush(
                    XColor.FromArgb((int)(alpha * 255), 128, 128, 128));
                
                gfx.DrawString(options.Text, font, brush, x, y);
            }

            var memoryStream = new MemoryStream();
            inputDocument.Save(memoryStream, false);
            memoryStream.Position = 0;
            return memoryStream;
        }

        public async Task<Stream> AddPageNumbersAsync(IFormFile file, Models.PageNumberOptions options)
        {
            using var stream = file.OpenReadStream();
            using var inputDocument = PdfReader.Open(stream, PdfDocumentOpenMode.Modify);
            
            var font = new XFont("Arial", options.FontSize, XFontStyle.Regular);
            var brush = XBrushes.Black;
            
            int pageNum = options.StartNumber;
            foreach (var page in inputDocument.Pages)
            {
                using var gfx = XGraphics.FromPdfPage(page);
                
                var text = options.Format
                    .Replace("{page}", pageNum.ToString())
                    .Replace("{total}", inputDocument.PageCount.ToString());
                
                var size = gfx.MeasureString(text, font);
                
                double x, y;
                var parts = options.Position.Split('-');
                
                if (parts[0] == "top")
                    y = 30;
                else
                    y = page.Height - 30;
                
                if (parts.Length > 1 && parts[1] == "left")
                    x = 30;
                else if (parts.Length > 1 && parts[1] == "right")
                    x = page.Width - size.Width - 30;
                else
                    x = (page.Width - size.Width) / 2;
                
                gfx.DrawString(text, font, brush, x, y);
                pageNum++;
            }

            var memoryStream = new MemoryStream();
            inputDocument.Save(memoryStream, false);
            memoryStream.Position = 0;
            return memoryStream;
        }

        public async Task<Stream> ProtectPdfAsync(IFormFile file, Models.ProtectOptions options)
        {
            using var stream = file.OpenReadStream();
            using var inputDocument = PdfReader.Open(stream, PdfDocumentOpenMode.Modify);
            
            var securitySettings = inputDocument.SecuritySettings;
            
            if (!string.IsNullOrEmpty(options.UserPassword))
                securitySettings.UserPassword = options.UserPassword;
            
            if (!string.IsNullOrEmpty(options.OwnerPassword))
                securitySettings.OwnerPassword = options.OwnerPassword;
            else if (!string.IsNullOrEmpty(options.UserPassword))
                securitySettings.OwnerPassword = options.UserPassword;
            
            securitySettings.PermitPrint = options.AllowPrint;
            securitySettings.PermitExtractContent = options.AllowCopy;
            securitySettings.PermitModifyDocument = options.AllowModify;

            var memoryStream = new MemoryStream();
            inputDocument.Save(memoryStream, false);
            memoryStream.Position = 0;
            return memoryStream;
        }

        public async Task<Stream> UnlockPdfAsync(IFormFile file, Models.UnlockOptions options)
        {
            using var stream = file.OpenReadStream();
            
            PdfDocument inputDocument;
            try
            {
                inputDocument = PdfReader.Open(stream, options.Password, PdfDocumentOpenMode.Import);
            }
            catch
            {
                throw new UnauthorizedAccessException("Invalid password or unable to unlock PDF.");
            }
            
            var outputDocument = new PdfDocument();
            
            foreach (var page in inputDocument.Pages)
            {
                outputDocument.AddPage(page);
            }

            var memoryStream = new MemoryStream();
            outputDocument.Save(memoryStream, false);
            memoryStream.Position = 0;
            return memoryStream;
        }

        public async Task<Stream> EditPdfAsync(IFormFile file, Models.EditOptions options)
        {
            using var stream = file.OpenReadStream();
            using var inputDocument = PdfReader.Open(stream, PdfDocumentOpenMode.Modify);
            
            foreach (var page in inputDocument.Pages)
            {
                using var gfx = XGraphics.FromPdfPage(page);
                
                foreach (var textElement in options.TextElements)
                {
                    var font = new XFont(
                        textElement.FontFamily ?? "Arial", 
                        textElement.FontSize, 
                        XFontStyle.Regular);
                    
                    var color = XColor.FromArgb(
                        textElement.Color.A,
                        textElement.Color.R,
                        textElement.Color.G,
                        textElement.Color.B);
                    
                    var brush = new XSolidBrush(color);
                    
                    gfx.DrawString(textElement.Text, font, brush, textElement.X, textElement.Y);
                }
                
                foreach (var imageElement in options.ImageElements)
                {
                    try
                    {
                        var imageBytes = Convert.FromBase64String(imageElement.ImageData);
                        using var imageStream = new MemoryStream(imageBytes);
                        using var xImage = XImage.FromStream(() => imageStream);
                        
                        gfx.DrawImage(xImage, imageElement.X, imageElement.Y, imageElement.Width, imageElement.Height);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to add image: {ex.Message}");
                    }
                }
            }

            var memoryStream = new MemoryStream();
            inputDocument.Save(memoryStream, false);
            memoryStream.Position = 0;
            return memoryStream;
        }
    }
}
