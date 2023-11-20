namespace PdfTools.Api.Models
{
    public class EditOptions
    {
        public List<TextElement> TextElements { get; set; } = new();
        public List<ImageElement> ImageElements { get; set; } = new();
    }

    public class TextElement
    {
        public string Text { get; set; } = "";
        public int X { get; set; }
        public int Y { get; set; }
        public int FontSize { get; set; } = 12;
        public string? FontFamily { get; set; } = "Arial";
        public int PageNumber { get; set; } = 1;
        public ColorData Color { get; set; } = new ColorData { R = 0, G = 0, B = 0, A = 255 };
    }

    public class ImageElement
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int PageNumber { get; set; } = 1;
        public string ImageData { get; set; } = ""; // Base64 encoded image
    }

    public class ColorData
    {
        public byte R { get; set; }
        public byte G { get; set; }
        public byte B { get; set; }
        public byte A { get; set; } = 255;
    }
}
