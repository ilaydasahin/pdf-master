using System;
using System.IO;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public class HtmlToPdfService : IHtmlToPdfService
    {
        public async Task<byte[]> ConvertUrlToPdfAsync(string url)
        {
            // PuppeteerSharp v20+ API: BrowserFetcher is not IDisposable, use static approach
            var browserFetcher = new PuppeteerSharp.BrowserFetcher();
            await browserFetcher.DownloadAsync();

            await using var browser = await PuppeteerSharp.Puppeteer.LaunchAsync(new PuppeteerSharp.LaunchOptions
            {
                Headless = true
            });

            await using var page = await browser.NewPageAsync();
            await page.GoToAsync(url);
            await page.WaitForNetworkIdleAsync();

            var pdfStream = await page.PdfStreamAsync(new PuppeteerSharp.PdfOptions
            {
                Format = PuppeteerSharp.Media.PaperFormat.A4,
                PrintBackground = true
            });

            using var memoryStream = new MemoryStream();
            await pdfStream.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }
    }
}
