using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Testing;
using PdfSharpCore.Pdf;
using Xunit;

namespace PdfTools.Tests.Controllers;

public class DeleteControllerTests : IClassFixture<WebApplicationFactory<PdfTools.Api.Program>>
{
    private readonly WebApplicationFactory<PdfTools.Api.Program> _factory;

    public DeleteControllerTests(WebApplicationFactory<PdfTools.Api.Program> factory)
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
    public async Task Delete_ShouldReturnPdf_WhenValid()
    {
        // Arrange
        var client = _factory.CreateClient();
        var pdfBytes = CreateDummyPdf(5);

        using var content = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(pdfBytes);
        fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/pdf");
        content.Add(fileContent, "file", "test.pdf");

        // Bind List<int> PagesToDelete
        content.Add(new StringContent("2"), "PagesToDelete[0]");
        content.Add(new StringContent("4"), "PagesToDelete[1]");

        // Act
        var response = await client.PostAsync("/api/Delete", content);

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/pdf", response.Content.Headers.ContentType?.MediaType);
        
        var responseBytes = await response.Content.ReadAsByteArrayAsync();
        Assert.True(responseBytes.Length > 0);
    }
}
