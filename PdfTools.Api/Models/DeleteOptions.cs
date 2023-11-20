namespace PdfTools.Api.Models
{
    public class DeleteOptions
    {
        // List of page numbers to delete (1-based)
        public List<int> PagesToDelete { get; set; } = new List<int>();
    }
}
