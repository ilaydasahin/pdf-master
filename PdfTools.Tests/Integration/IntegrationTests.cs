using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using System.IO;
using System.Net.Http.Headers;
using PdfTools.Api;

namespace PdfTools.Tests.Integration;

public class IntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public IntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    private MultipartFormDataContent CreatePdfContent(string fileName)
    {
        var content = new MultipartFormDataContent();
        var pdfContent = new ByteArrayContent(CreateMinimalPdfBytes());
        pdfContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/pdf");
        content.Add(pdfContent, "files", fileName);
        return content;
    }
    
    private MultipartFormDataContent CreateSingleFileContent(string paramName, string fileName)
    {
        var content = new MultipartFormDataContent();
        var pdfContent = new ByteArrayContent(CreateMinimalPdfBytes());
        pdfContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/pdf");
        content.Add(pdfContent, paramName, fileName);
        return content;
    }

    private byte[] CreateMinimalPdfBytes()
    {
        using var stream = new MemoryStream();
        using var doc = new PdfSharpCore.Pdf.PdfDocument();
        doc.AddPage();
        doc.Save(stream, false);
        return stream.ToArray();
    }

    [Fact]
    public async Task Merge_Endpoint_ReturnsPdf()
    {
        // Arrange
        var client = _factory.CreateClient();
        var content = new MultipartFormDataContent();
        content.Add(new ByteArrayContent(CreateMinimalPdfBytes()), "files", "file1.pdf");
        content.Add(new ByteArrayContent(CreateMinimalPdfBytes()), "files", "file2.pdf");

        // Act
        var response = await client.PostAsync("/api/merge", content);

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/pdf", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Split_Endpoint_ReturnsZip()
    {
        // Arrange
        var client = _factory.CreateClient();
        var content = CreateSingleFileContent("file", "test.pdf");
        content.Add(new StringContent("range"), "Mode");
        content.Add(new StringContent("1-1"), "Ranges");

        // Act
        var response = await client.PostAsync("/api/split", content);

        // Assert
        response.EnsureSuccessStatusCode();
        // Check for zip content type (application/zip or application/octet-stream)
        var mediaType = response.Content.Headers.ContentType?.MediaType;
        Assert.True(mediaType == "application/zip" || mediaType == "application/octet-stream");
    }
    
    [Fact]
    public async Task Rotate_Endpoint_ReturnsPdf()
    {
        // Arrange
        var client = _factory.CreateClient();
        var content = CreateSingleFileContent("file", "test.pdf");
        content.Add(new StringContent("90"), "RotationDegrees[1]");

        // Act
        var response = await client.PostAsync("/api/rotate", content);

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/pdf", response.Content.Headers.ContentType?.MediaType);
    }
}
