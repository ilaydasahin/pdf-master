namespace PdfTools.Api.Models
{
    public class RotateOptions
    {
        // Key: Page Number (1-based), Value: Rotation in degrees (e.g., 90, 180, 270)
        // This represents the amount to rotate clockwise relative to the current orientation.
        public Dictionary<int, int> RotationDegrees { get; set; } = new Dictionary<int, int>();
    }
}
