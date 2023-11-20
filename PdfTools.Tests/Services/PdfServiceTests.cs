using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using PdfTools.Api.Services;
using System.IO;
using System.Threading.Tasks;

namespace PdfTools.Tests.Services;

public class PdfServiceTests
{
    private readonly Mock<ILogger<PdfService>> _mockLogger;
    private readonly PdfService _sut; // System Under Test

    public PdfServiceTests()
    {
        _mockLogger = new Mock<ILogger<PdfService>>();
        _sut = new PdfService(_mockLogger.Object);
    }

    [Fact]
    public async Task MergePdfsAsync_WithValidFiles_ShouldReturnMergedPdf()
    {
        // Arrange
        var files = new List<IFormFile>
        {
            CreateMockPdfFile("test1.pdf", 1024),
            CreateMockPdfFile("test2.pdf", 2048)
        };

        // Act
        var result = await _sut.MergePdfsAsync(files);

        // Assert
        result.Should().NotBeNull();
        result.Length.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task MergePdfsAsync_WithEmptyList_ShouldThrowArgumentException()
    {
        // Arrange
        var emptyFiles = new List<IFormFile>();

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => _sut.MergePdfsAsync(emptyFiles)
        );
    }

    [Fact]
    public async Task MergePdfsAsync_WithNullFiles_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(
            () => _sut.MergePdfsAsync(null!)
        );
    }

    [Fact]
    public async Task CompressPdfAsync_WithValidFile_ShouldReduceFileSize()
    {
        // Arrange
        var originalFile = CreateMockPdfFile("large.pdf", 10240);
        var quality = 50;

        // Act
        var result = await _sut.CompressPdfAsync(originalFile, quality);

        // Assert
        result.Should().NotBeNull();
        result.Length.Should().BeLessThan(originalFile.Length);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(101)]
    public async Task CompressPdfAsync_WithInvalidQuality_ShouldThrowArgumentOutOfRangeException(int quality)
    {
        // Arrange
        var file = CreateMockPdfFile("test.pdf", 1024);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(
            () => _sut.CompressPdfAsync(file, quality)
        );
    }

    [Fact]
    public async Task SplitPdfAsync_WithValidFile_ShouldReturnMultipleFiles()
    {
        // Arrange
        var file = CreateMockPdfFile("multi-page.pdf", 5120);
        var pageRanges = new List<string> { "1-2", "3-4" };

        // Act
        var results = await _sut.SplitPdfAsync(file, pageRanges);

        // Assert
        results.Should().NotBeNull();
        results.Should().HaveCount(2);
        results.All(r => r.Length > 0).Should().BeTrue();
    }

    [Fact]
    public async Task RotatePdfAsync_WithValid90Degrees_ShouldRotatePages()
    {
        // Arrange
        var file = CreateMockPdfFile("test.pdf", 2048);
        var rotation = 90;
        var pageNumbers = new List<int> { 1 };

        // Act
        var result = await _sut.RotatePdfAsync(file, rotation, pageNumbers);

        // Assert
        result.Should().NotBeNull();
        result.Length.Should().BeGreaterThan(0);
    }

    [Theory]
    [InlineData(45)]
    [InlineData(91)]
    [InlineData(-90)]
    public async Task RotatePdfAsync_WithInvalidRotation_ShouldThrowArgumentException(int rotation)
    {
        // Arrange
        var file = CreateMockPdfFile("test.pdf", 1024);
        var pageNumbers = new List<int> { 1 };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => _sut.RotatePdfAsync(file, rotation, pageNumbers)
        );
    }

    #region Helper Methods

    private IFormFile CreateMockPdfFile(string fileName, long size)
    {
        var mock = new Mock<IFormFile>();
        var content = new byte[size];
        // Add PDF header
        content[0] = 0x25; // %
        content[1] = 0x50; // P
        content[2] = 0x44; // D
        content[3] = 0x46; // F

        var ms = new MemoryStream(content);
        mock.Setup(f => f.FileName).Returns(fileName);
        mock.Setup(f => f.Length).Returns(size);
        mock.Setup(f => f.OpenReadStream()).Returns(ms);
        mock.Setup(f => f.ContentType).Returns("application/pdf");
        mock.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .Returns((Stream target, CancellationToken token) => ms.CopyToAsync(target, token));

        return mock.Object;
    }

    #endregion
}
