using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using PdfTools.Api.Services;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Threading;

namespace PdfTools.Tests.Services;

public class OcrServiceTests
{
    private readonly Mock<ILogger<OcrService>> _mockLogger;
    private readonly OcrService _sut;

    public OcrServiceTests()
    {
        _mockLogger = new Mock<ILogger<OcrService>>();
        _sut = new OcrService(_mockLogger.Object);
    }

    [Fact]
    public async Task PerformOcrAsync_WithValidPdf_ShouldReturnExtractedText()
    {
        // Arrange
        var file = CreateMockPdfFile("scanned.pdf", 2048);
        var language = "eng";

        // Act
        var result = await _sut.PerformOcrAsync(file, language);

        // Assert
        result.Should().NotBeNull();
        result.Should().NotBeEmpty();
    }

    [Fact]
    public async Task PerformOcrAsync_WithNullFile_ShouldThrowArgumentNullException()
    {
        // Arrange
        var language = "eng";

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(
            () => _sut.PerformOcrAsync(null!, language)
        );
    }

    [Theory]
    [InlineData("eng")]
    [InlineData("tur")]
    [InlineData("fra")]
    public async Task PerformOcrAsync_WithDifferentLanguages_ShouldProcess(string language)
    {
        // Arrange
        var file = CreateMockPdfFile("scanned.pdf", 2048);

        // Act
        var result = await _sut.PerformOcrAsync(file, language);

        // Assert
        result.Should().NotBeNull();
    }

    [Fact]
    public async Task PerformOcrAsync_WithEmptyPdf_ShouldThrowException()
    {
        // Arrange
        var file = CreateMockPdfFile("empty.pdf", 0);
        var language = "eng";

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _sut.PerformOcrAsync(file, language)
        );
    }

    [Fact]
    public async Task ConvertToSearchablePdfAsync_WithValidFile_ShouldReturnSearchablePdf()
    {
        // Arrange
        var file = CreateMockPdfFile("scanned.pdf", 4096);
        var language = "eng";

        // Act
        var result = await _sut.ConvertToSearchablePdfAsync(file, language);

        // Assert
        result.Should().NotBeNull();
        result.Length.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task ConvertToSearchablePdfAsync_WithNullFile_ShouldThrowArgumentNullException()
    {
        // Arrange
        var language = "eng";

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(
            () => _sut.ConvertToSearchablePdfAsync(null!, language)
        );
    }

    [Fact]
    public async Task ExtractTextFromImageAsync_WithValidImage_ShouldReturnText()
    {
        // Arrange
        var file = CreateMockImageFile("screenshot.png", 1024);
        var language = "eng";

        // Act
        var result = await _sut.ExtractTextFromImageAsync(file, language);

        // Assert
        result.Should().NotBeNull();
    }

    #region Helper Methods

    private IFormFile CreateMockPdfFile(string fileName, long size)
    {
        var mock = new Mock<IFormFile>();
        var content = new byte[size];
        // Add PDF header
        if (size >= 4)
        {
            content[0] = 0x25; // %
            content[1] = 0x50; // P
            content[2] = 0x44; // D
            content[3] = 0x46; // F
        }

        var ms = new MemoryStream(content);
        mock.Setup(f => f.FileName).Returns(fileName);
        mock.Setup(f => f.Length).Returns(size);
        mock.Setup(f => f.OpenReadStream()).Returns(ms);
        mock.Setup(f => f.ContentType).Returns("application/pdf");
        mock.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .Returns((Stream target, CancellationToken token) => ms.CopyToAsync(target, token));

        return mock.Object;
    }

    private IFormFile CreateMockImageFile(string fileName, long size)
    {
        var mock = new Mock<IFormFile>();
        var content = new byte[size];
        var ms = new MemoryStream(content);
        
        mock.Setup(f => f.FileName).Returns(fileName);
        mock.Setup(f => f.Length).Returns(size);
        mock.Setup(f => f.OpenReadStream()).Returns(ms);
        mock.Setup(f => f.ContentType).Returns("image/png");
        mock.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .Returns((Stream target, CancellationToken token) => ms.CopyToAsync(target, token));

        return mock.Object;
    }

    #endregion
}
