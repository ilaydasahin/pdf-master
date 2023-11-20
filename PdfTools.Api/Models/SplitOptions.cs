using System.Collections.Generic;

namespace PdfTools.Api.Models
{
    public class PdfSplitOptions
    {
        public string Mode { get; set; }
        public List<int> SelectedPages { get; set; }
        public string Ranges { get; set; }
    }
}
