namespace PdfTools.Api.Models
{
    public class CompressOptions
    {
        public CompressionLevel Level { get; set; } = CompressionLevel.Medium;
    }

    public enum CompressionLevel
    {
        Low,    // screen quality (72 DPI)
        Medium, // ebook quality (150 DPI)
        High    // printer quality (300 DPI)
    }
}
