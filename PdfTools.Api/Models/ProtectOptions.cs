namespace PdfTools.Api.Models
{
    public class ProtectOptions
    {
        public string UserPassword { get; set; } = "";
        public string OwnerPassword { get; set; } = "";
        public bool AllowPrint { get; set; } = true;
        public bool AllowCopy { get; set; } = true;
        public bool AllowModify { get; set; } = false;
    }
}
