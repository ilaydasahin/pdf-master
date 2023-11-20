namespace PdfTools.Api.Models
{
    public class PageNumberOptions
    {
        public string Format { get; set; } = "{page}"; // {page}, {page}/{total}
        public string Position { get; set; } = "bottom-center";
        public int StartNumber { get; set; } = 1;
        public int FontSize { get; set; } = 12;
    }
}
