using Microsoft.AspNetCore.Http;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PdfTools.Api.Middleware
{
    /// <summary>
    /// Middleware to validate uploaded files for security purposes
    /// Prevents path traversal, validates file types via magic numbers, and enforces size limits
    /// </summary>
    public class FileValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<FileValidationMiddleware> _logger;
        private readonly long _maxFileSizeBytes;
        private static readonly byte[] PdfMagicNumber = { 0x25, 0x50, 0x44, 0x46 }; // %PDF

        public FileValidationMiddleware(
            RequestDelegate next,
            ILogger<FileValidationMiddleware> logger,
            IConfiguration configuration)
        {
            _next = next;
            _logger = logger;
            _maxFileSizeBytes = configuration.GetValue<long>("FileProcessing:MaxFileSizeBytes", 104857600); // Default 100MB
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Only validate POST/PUT requests with files
            if (context.Request.HasFormContentType &&
                (context.Request.Method == "POST" || context.Request.Method == "PUT"))
            {
                try
                {
                    var files = context.Request.Form.Files;

                    if (files.Any())
                    {
                        foreach (var file in files)
                        {
                            // 1. Sanitize filename (prevent path traversal)
                            var sanitizedFileName = SanitizeFileName(file.FileName);
                            _logger.LogDebug("Original filename: {Original}, Sanitized: {Sanitized}",
                                file.FileName, sanitizedFileName);

                            // 2. Validate file size
                            if (file.Length > _maxFileSizeBytes)
                            {
                                _logger.LogWarning("File size {Size} exceeds limit {Limit} for file {FileName}",
                                    file.Length, _maxFileSizeBytes, sanitizedFileName);
                                
                                context.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
                                await context.Response.WriteAsJsonAsync(new
                                {
                                    error = "File size exceeds maximum allowed size",
                                    maxSizeMb = _maxFileSizeBytes / (1024 * 1024)
                                });
                                return;
                            }

                            // 3. Validate file content (magic number check for PDFs)
                            if (IsPdfFile(file.FileName))
                            {
                                using var stream = file.OpenReadStream();
                                if (!await ValidatePdfMagicNumber(stream))
                                {
                                    _logger.LogWarning("Invalid PDF file detected: {FileName}", sanitizedFileName);
                                    
                                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                                    await context.Response.WriteAsJsonAsync(new
                                    {
                                        error = "Invalid PDF file. The file does not appear to be a valid PDF document."
                                    });
                                    return;
                                }
                                stream.Position = 0; // Reset stream for downstream processing
                            }

                            // 4. Check for empty files
                            if (file.Length == 0)
                            {
                                _logger.LogWarning("Empty file uploaded: {FileName}", sanitizedFileName);
                                
                                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                                await context.Response.WriteAsJsonAsync(new
                                {
                                    error = "Empty file detected. Please upload a valid file."
                                });
                                return;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during file validation");
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        error = "File validation failed"
                    });
                    return;
                }
            }

            await _next(context);
        }

        /// <summary>
        /// Sanitizes filename to prevent path traversal attacks
        /// </summary>
        private string SanitizeFileName(string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                return "unnamed";

            // Get filename only (remove any path)
            fileName = Path.GetFileName(fileName);

            // Remove dangerous characters
            var invalidChars = Path.GetInvalidFileNameChars();
            fileName = string.Join("_", fileName.Split(invalidChars, StringSplitOptions.RemoveEmptyEntries));

            // Remove path traversal attempts
            fileName = fileName.Replace("..", "").Replace("/", "").Replace("\\", "");

            // Limit length
            if (fileName.Length > 255)
                fileName = fileName.Substring(0, 255);

            return fileName;
        }

        /// <summary>
        /// Checks if file is a PDF based on extension
        /// </summary>
        private bool IsPdfFile(string fileName)
        {
            return fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Validates PDF file by checking magic number (%PDF)
        /// </summary>
        private async Task<bool> ValidatePdfMagicNumber(Stream stream)
        {
            if (stream.Length < 4)
                return false;

            var buffer = new byte[4];
            var bytesRead = await stream.ReadAsync(buffer, 0, 4);

            if (bytesRead < 4)
                return false;

            return buffer.SequenceEqual(PdfMagicNumber);
        }
    }
}
