using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Testing;
using PdfSharpCore.Pdf;
using Xunit;

namespace PdfTools.Tests.Controllers;

public class SplitControllerTests : IClassFixture<WebApplicationFactory<PdfTools.Api.Program>>
{
    private readonly WebApplicationFactory<PdfTools.Api.Program> _factory;

    public SplitControllerTests(WebApplicationFactory<PdfTools.Api.Program> factory)
    {
        _factory = factory;
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
    }

    private byte[] CreateDummyPdf(int pages = 1)
    {
        using var stream = new MemoryStream();
        using var document = new PdfDocument();
        for (int i = 0; i < pages; i++)
        {
            document.AddPage();
        }
        document.Save(stream, false);
        return stream.ToArray();
    }

    [Fact]
    public async Task Split_ShouldReturnZip_WhenRangeIsValid()
    {
        // Arrange
        var client = _factory.CreateClient();
        var pdfBytes = CreateDummyPdf(5);

        using var content = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(pdfBytes);
        fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/pdf");
        content.Add(fileContent, "file", "test.pdf");

        content.Add(new StringContent("range"), "mode");
        content.Add(new StringContent("1-2"), "ranges");

        // Act
        var response = await client.PostAsync("/api/Split", content);

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/zip", response.Content.Headers.ContentType?.MediaType);
        
        var responseBytes = await response.Content.ReadAsByteArrayAsync();
        Assert.True(responseBytes.Length > 0);
    }

    [Fact]
    public async Task Split_ShouldReturnBadRequest_WhenNoFileProvided()
    {
        // Arrange
        var client = _factory.CreateClient();
        using var content = new MultipartFormDataContent();

        // Act
        var response = await client.PostAsync("/api/Split", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
