namespace PdfTools.Api.Utils;

public static class FileValidator
{
    private static readonly Dictionary<string, byte[]> _fileSignatures = new()
    {
        { ".pdf", [0x25, 0x50, 0x44, 0x46] }, // %PDF
        { ".jpg", [0xFF, 0xD8, 0xFF] },
        { ".jpeg", [0xFF, 0xD8, 0xFF] },
        { ".png", [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
        { ".docx", [0x50, 0x4B, 0x03, 0x04] }, // ZIP format
        { ".xlsx", [0x50, 0x4B, 0x03, 0x04] }, // ZIP format
        { ".pptx", [0x50, 0x4B, 0x03, 0x04] }  // ZIP format
    };

    /// <summary>
    /// Validates file by checking magic number (file signature)
    /// </summary>
    public static bool IsValidFile(Stream stream, string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        
        if (!_fileSignatures.ContainsKey(extension))
        {
            return false;
        }

        var signature = _fileSignatures[extension];
        var buffer = new byte[signature.Length];
        
        stream.Position = 0;
        var bytesRead = stream.Read(buffer, 0, signature.Length);
        stream.Position = 0; // Reset position

        if (bytesRead < signature.Length)
        {
            return false;
        }

        return signature.SequenceEqual(buffer.Take(signature.Length));
    }

    /// <summary>
    /// Validates file size
    /// </summary>
    public static bool IsValidFileSize(long fileSizeBytes, long maxSizeBytes)
    {
        return fileSizeBytes > 0 && fileSizeBytes <= maxSizeBytes;
    }

    /// <summary>
    /// Sanitizes file name to prevent path traversal attacks
    /// </summary>
    public static string SanitizeFileName(string fileName)
    {
        // Remove path characters
        var sanitized = Path.GetFileName(fileName);
        
        // Remove potentially dangerous characters
        sanitized = string.Join("_", sanitized.Split(Path.GetInvalidFileNameChars()));
        
        // Limit length
        if (sanitized.Length > 255)
        {
            var extension = Path.GetExtension(sanitized);
            var nameWithoutExt = Path.GetFileNameWithoutExtension(sanitized);
            sanitized = nameWithoutExt[..Math.Min(nameWithoutExt.Length, 250)] + extension;
        }

        return sanitized;
    }

    /// <summary>
    /// Checks if file extension is allowed
    /// </summary>
    public static bool IsAllowedExtension(string fileName, string[] allowedExtensions)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return allowedExtensions.Contains(extension);
    }
}
