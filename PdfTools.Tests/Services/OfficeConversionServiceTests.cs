using Xunit;
using Moq;
using PdfTools.Api.Services;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml;

namespace PdfTools.Tests.Services
{
    public class OfficeConversionServiceTests
    {
        private readonly OfficeConversionService _service;

        public OfficeConversionServiceTests()
        {
            _service = new OfficeConversionService();
        }

        [Fact]
        public async Task ConvertWordToPdf_ValidFile_ReturnsPdfStream()
        {
            // Arrange
            var fileName = "test.docx";
            var stream = new MemoryStream();
            
            // Create a valid empty Word document
            using (var wordDoc = WordprocessingDocument.Create(stream, WordprocessingDocumentType.Document))
            {
                var mainPart = wordDoc.AddMainDocumentPart();
                mainPart.Document = new Document();
                mainPart.Document.Body = new Body(new Paragraph(new Run(new Text("Hello World"))));
            }
            stream.Position = 0;

            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(_ => _.OpenReadStream()).Returns(stream);
            fileMock.Setup(_ => _.FileName).Returns(fileName);
            fileMock.Setup(_ => _.Length).Returns(stream.Length);
            fileMock.Setup(_ => _.CopyToAsync(It.IsAny<Stream>(), It.IsAny<System.Threading.CancellationToken>()))
                .Callback<Stream, System.Threading.CancellationToken>((target, token) => stream.CopyTo(target))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _service.ConvertWordToPdfAsync(fileMock.Object);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Length > 0);
            // Check for PDF header
            Assert.Equal((byte)'%', result[0]);
            Assert.Equal((byte)'P', result[1]);
            Assert.Equal((byte)'D', result[2]);
            Assert.Equal((byte)'F', result[3]);
        }

        [Fact]
        public async Task ConvertExcelToPdf_ValidFile_ReturnsPdfStream()
        {
             // Arrange
            var fileName = "test.xlsx";
            var stream = new MemoryStream();
            
            // Create a valid empty Excel document
            using (var spreadsheetDoc = SpreadsheetDocument.Create(stream, SpreadsheetDocumentType.Workbook))
            {
                var workbookPart = spreadsheetDoc.AddWorkbookPart();
                workbookPart.Workbook = new DocumentFormat.OpenXml.Spreadsheet.Workbook();
                var worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
                worksheetPart.Worksheet = new DocumentFormat.OpenXml.Spreadsheet.Worksheet(new DocumentFormat.OpenXml.Spreadsheet.SheetData());
                var sheets = spreadsheetDoc.WorkbookPart!.Workbook.AppendChild(new DocumentFormat.OpenXml.Spreadsheet.Sheets());
                var sheet = new DocumentFormat.OpenXml.Spreadsheet.Sheet() { Id = spreadsheetDoc.WorkbookPart.GetIdOfPart(worksheetPart), SheetId = 1, Name = "Sheet1" };
                sheets.Append(sheet);
            }
            stream.Position = 0;

            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(_ => _.OpenReadStream()).Returns(stream);
            fileMock.Setup(_ => _.FileName).Returns(fileName);
            fileMock.Setup(_ => _.Length).Returns(stream.Length);
            fileMock.Setup(_ => _.CopyToAsync(It.IsAny<Stream>(), It.IsAny<System.Threading.CancellationToken>()))
                .Callback<Stream, System.Threading.CancellationToken>((target, token) => stream.CopyTo(target))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _service.ConvertExcelToPdfAsync(fileMock.Object);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Length > 0);
             // Check for PDF header
            Assert.Equal((byte)'%', result[0]);
            Assert.Equal((byte)'P', result[1]);
            Assert.Equal((byte)'D', result[2]);
            Assert.Equal((byte)'F', result[3]);
        }
    }
}
