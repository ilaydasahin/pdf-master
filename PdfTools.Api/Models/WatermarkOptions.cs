namespace PdfTools.Api.Models
{
    public class WatermarkOptions
    {
        public string Text { get; set; } = "";
        public int Opacity { get; set; } = 50; // 0-100
        public string Position { get; set; } = "center"; // center, diagonal, top-right, etc.
        public int FontSize { get; set; } = 48;
    }
}
