using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using PdfTools.Api.Services;

namespace PdfTools.Tests.Services;

public class ImageConversionServiceTests
{
    private readonly Mock<ILogger<ImageConversionService>> _mockLogger;
    private readonly ImageConversionService _sut;

    public ImageConversionServiceTests()
    {
        _mockLogger = new Mock<ILogger<ImageConversionService>>();
        _sut = new ImageConversionService(_mockLogger.Object);
    }

    [Fact]
    public async Task ConvertPdfToImagesAsync_WithValidPdf_ShouldReturnImages()
    {
        // Arrange
        var pdfFile = CreateMockPdfFile("test.pdf", 2048);

        // Act
        var results = await _sut.ConvertPdfToImagesAsync(pdfFile, "jpg");

        // Assert
        results.Should().NotBeNull();
        results.Should().NotBeEmpty();
        results.All(r => r.Length > 0).Should().BeTrue();
    }

    [Theory]
    [InlineData("jpg")]
    [InlineData("png")]
    [InlineData("webp")]
    public async Task ConvertPdfToImagesAsync_WithDifferentFormats_ShouldSucceed(string format)
    {
        // Arrange
        var pdfFile = CreateMockPdfFile("test.pdf", 2048);

        // Act
        var results = await _sut.ConvertPdfToImagesAsync(pdfFile, format);

        // Assert
        results.Should().NotBeNull();
        results.Should().NotBeEmpty();
    }

    [Fact]
    public async Task ConvertImagesToPdfAsync_WithValidImages_ShouldReturnPdf()
    {
        // Arrange
        var images = new List<IFormFile>
        {
            CreateMockImageFile("image1.jpg", 1024),
            CreateMockImageFile("image2.jpg", 2048)
        };

        // Act
        var result = await _sut.ConvertImagesToPdfAsync(images);

        // Assert
        result.Should().NotBeNull();
        result.Length.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task ConvertImagesToPdfAsync_WithEmptyList_ShouldThrowArgumentException()
    {
        // Arrange
        var emptyImages = new List<IFormFile>();

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => _sut.ConvertImagesToPdfAsync(emptyImages)
        );
    }

    #region Helper Methods

    private IFormFile CreateMockPdfFile(string fileName, long size)
    {
        var mock = new Mock<IFormFile>();
        var content = new byte[size];
        content[0] = 0x25; content[1] = 0x50; content[2] = 0x44; content[3] = 0x46; // %PDF

        var ms = new MemoryStream(content);
        mock.Setup(f => f.FileName).Returns(fileName);
        mock.Setup(f => f.Length).Returns(size);
        mock.Setup(f => f.OpenReadStream()).Returns(ms);
        mock.Setup(f => f.ContentType).Returns("application/pdf");

        return mock.Object;
    }

    private IFormFile CreateMockImageFile(string fileName, long size)
    {
        var mock = new Mock<IFormFile>();
        var content = new byte[size];
        // JPEG header
        content[0] = 0xFF; content[1] = 0xD8; content[2] = 0xFF;

        var ms = new MemoryStream(content);
        mock.Setup(f => f.FileName).Returns(fileName);
        mock.Setup(f => f.Length).Returns(size);
        mock.Setup(f => f.OpenReadStream()).Returns(ms);
        mock.Setup(f => f.ContentType).Returns("image/jpeg");

        return mock.Object;
    }

    #endregion
}
