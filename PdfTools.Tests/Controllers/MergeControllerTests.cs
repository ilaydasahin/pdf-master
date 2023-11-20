using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Testing;
using PdfSharpCore.Pdf;
using Xunit;

namespace PdfTools.Tests.Controllers;

public class MergeControllerTests : IClassFixture<WebApplicationFactory<PdfTools.Api.Program>>
{
    private readonly WebApplicationFactory<PdfTools.Api.Program> _factory;

    public MergeControllerTests(WebApplicationFactory<PdfTools.Api.Program> factory)
    {
        _factory = factory;
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
    }

    private byte[] CreateDummyPdf()
    {
        using var stream = new MemoryStream();
        using var document = new PdfDocument();
        document.AddPage();
        document.Save(stream, false);
        return stream.ToArray();
    }

    [Fact]
    public async Task Merge_ShouldReturnPdf_WhenFilesAreValid()
    {
        // Arrange
        var client = _factory.CreateClient();
        var pdfBytes = CreateDummyPdf();

        using var content = new MultipartFormDataContent();
        var fileContent1 = new ByteArrayContent(pdfBytes);
        fileContent1.Headers.ContentType = MediaTypeHeaderValue.Parse("application/pdf");
        content.Add(fileContent1, "files", "file1.pdf");

        var fileContent2 = new ByteArrayContent(pdfBytes);
        fileContent2.Headers.ContentType = MediaTypeHeaderValue.Parse("application/pdf");
        content.Add(fileContent2, "files", "file2.pdf");

        // Act
        var response = await client.PostAsync("/api/Merge", content);

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/pdf", response.Content.Headers.ContentType?.MediaType);
        
        var responseBytes = await response.Content.ReadAsByteArrayAsync();
        Assert.True(responseBytes.Length > 0);
    }

    [Fact]
    public async Task Merge_ShouldReturnBadRequest_WhenNoFilesProvided()
    {
        // Arrange
        var client = _factory.CreateClient();
        using var content = new MultipartFormDataContent();

        // Act
        var response = await client.PostAsync("/api/Merge", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
