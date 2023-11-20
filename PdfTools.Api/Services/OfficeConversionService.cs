using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Presentation;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System;
using A = DocumentFormat.OpenXml.Drawing;

namespace PdfTools.Api.Services
{
    public class OfficeConversionService : IOfficeConversionService
    {
        public async Task<byte[]> ConvertWordToPdfAsync(IFormFile file)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            using var wordDoc = WordprocessingDocument.Open(memoryStream, false);
            var body = wordDoc.MainDocumentPart.Document.Body;

            using var pdfDoc = new PdfDocument();
            var pdfPage = pdfDoc.AddPage();
            var gfx = XGraphics.FromPdfPage(pdfPage);
            var font = new XFont("Arial", 11, XFontStyle.Regular);
            
            double yPoint = 40;
            double margin = 40;
            double pageWidth = pdfPage.Width.Point;
            double pageHeight = pdfPage.Height.Point;

            foreach (var element in body.Elements())
            {
                if (element is DocumentFormat.OpenXml.Wordprocessing.Paragraph para)
                {
                    ProcessParagraph(para, gfx, font, ref yPoint, margin, pageWidth, pageHeight, ref pdfPage, pdfDoc);
                }
                else if (element is DocumentFormat.OpenXml.Wordprocessing.Table table)
                {
                    ProcessTable(table, gfx, font, ref yPoint, margin, pageWidth, pageHeight, ref pdfPage, pdfDoc);
                }
            }

            using var outputStream = new MemoryStream();
            pdfDoc.Save(outputStream, false);
            return outputStream.ToArray();
        }

        private void ProcessParagraph(DocumentFormat.OpenXml.Wordprocessing.Paragraph para, XGraphics gfx, XFont font, ref double yPoint, double margin, double pageWidth, double pageHeight, ref PdfPage pdfPage, PdfDocument pdfDoc)
        {
            var text = para.InnerText;
            if (string.IsNullOrWhiteSpace(text)) return;

            var words = text.Split(' ');
            var line = "";
            foreach(var word in words)
            {
                var testLine = line + word + " ";
                var size = gfx.MeasureString(testLine, font);
                if (size.Width > pageWidth - 2 * margin)
                {
                    gfx.DrawString(line, font, XBrushes.Black, new XRect(margin, yPoint, pageWidth, pageHeight), XStringFormats.TopLeft);
                    yPoint += 15;
                    line = word + " ";
                }
                else
                {
                    line = testLine;
                }

                CheckNewPage(ref yPoint, margin, pageHeight, ref pdfPage, ref gfx, pdfDoc);
            }
            if (!string.IsNullOrEmpty(line))
            {
                gfx.DrawString(line, font, XBrushes.Black, new XRect(margin, yPoint, pageWidth, pageHeight), XStringFormats.TopLeft);
                yPoint += 15;
            }
            CheckNewPage(ref yPoint, margin, pageHeight, ref pdfPage, ref gfx, pdfDoc);
        }

        private void ProcessTable(DocumentFormat.OpenXml.Wordprocessing.Table table, XGraphics gfx, XFont font, ref double yPoint, double margin, double pageWidth, double pageHeight, ref PdfPage pdfPage, PdfDocument pdfDoc)
        {
            var rows = table.Elements<DocumentFormat.OpenXml.Wordprocessing.TableRow>();
            double colWidth = 100; // Fixed column width for simplicity
            
            foreach (var row in rows)
            {
                double xPoint = margin;
                double maxRowHeight = 20;
                
                foreach (var cell in row.Elements<DocumentFormat.OpenXml.Wordprocessing.TableCell>())
                {
                    var text = cell.InnerText;
                    gfx.DrawString(text, font, XBrushes.Black, new XRect(xPoint, yPoint, colWidth, maxRowHeight), XStringFormats.TopLeft);
                    gfx.DrawRectangle(XPens.Gray, xPoint, yPoint, colWidth, maxRowHeight);
                    xPoint += colWidth;
                    
                    if (xPoint > pageWidth - margin) break; // Clip if too wide
                }
                yPoint += maxRowHeight;
                CheckNewPage(ref yPoint, margin, pageHeight, ref pdfPage, ref gfx, pdfDoc);
            }
            yPoint += 10; // Spacing after table
        }

        private void CheckNewPage(ref double yPoint, double margin, double pageHeight, ref PdfPage pdfPage, ref XGraphics gfx, PdfDocument pdfDoc)
        {
            if (yPoint > pageHeight - margin)
            {
                pdfPage = pdfDoc.AddPage();
                gfx = XGraphics.FromPdfPage(pdfPage);
                yPoint = margin;
            }
        }

        public async Task<byte[]> ConvertExcelToPdfAsync(IFormFile file)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            using var spreadsheetDoc = SpreadsheetDocument.Open(memoryStream, false);
            var workbookPart = spreadsheetDoc.WorkbookPart;
            var sheet = workbookPart.Workbook.Descendants<DocumentFormat.OpenXml.Spreadsheet.Sheet>().FirstOrDefault();
            
            if (sheet == null) return Array.Empty<byte>();

            var worksheetPart = (WorksheetPart)workbookPart.GetPartById(sheet.Id);
            var sheetData = worksheetPart.Worksheet.Elements<DocumentFormat.OpenXml.Spreadsheet.SheetData>().First();
            var sharedStringTable = workbookPart.SharedStringTablePart?.SharedStringTable;

            using var pdfDoc = new PdfDocument();
            var pdfPage = pdfDoc.AddPage();
            var gfx = XGraphics.FromPdfPage(pdfPage);
            var font = new XFont("Arial", 10, XFontStyle.Regular);

            double yPoint = 40;
            double margin = 40;
            double colWidth = 80;
            double rowHeight = 20;

            foreach (var row in sheetData.Elements<DocumentFormat.OpenXml.Spreadsheet.Row>())
            {
                double xPoint = margin;
                foreach (var cell in row.Elements<DocumentFormat.OpenXml.Spreadsheet.Cell>())
                {
                    string text = GetCellValue(cell, sharedStringTable);
                    
                    gfx.DrawString(text, font, XBrushes.Black, new XRect(xPoint, yPoint, colWidth, rowHeight), XStringFormats.TopLeft);
                    gfx.DrawRectangle(XPens.LightGray, xPoint, yPoint, colWidth, rowHeight);
                    
                    xPoint += colWidth;
                    if (xPoint > pdfPage.Width.Point - margin) break;
                }
                yPoint += rowHeight;

                if (yPoint > pdfPage.Height.Point - margin)
                {
                    pdfPage = pdfDoc.AddPage();
                    gfx = XGraphics.FromPdfPage(pdfPage);
                    yPoint = margin;
                }
            }

            using var outputStream = new MemoryStream();
            pdfDoc.Save(outputStream, false);
            return outputStream.ToArray();
        }

        private string GetCellValue(DocumentFormat.OpenXml.Spreadsheet.Cell cell, DocumentFormat.OpenXml.Spreadsheet.SharedStringTable sharedStringTable)
        {
            if (cell.CellValue == null) return "";
            string value = cell.CellValue.InnerText;
            if (cell.DataType != null && cell.DataType.Value == DocumentFormat.OpenXml.Spreadsheet.CellValues.SharedString)
            {
                return sharedStringTable.ElementAt(int.Parse(value)).InnerText;
            }
            return value;
        }

        public async Task<byte[]> ConvertPptToPdfAsync(IFormFile file)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            using var presentationDoc = PresentationDocument.Open(memoryStream, false);
            var presentationPart = presentationDoc.PresentationPart;
            var slideIds = presentationPart.Presentation.SlideIdList.ChildElements;

            using var pdfDoc = new PdfDocument();

            foreach (var slideId in slideIds)
            {
                var pdfPage = pdfDoc.AddPage();
                pdfPage.Orientation = PdfSharpCore.PageOrientation.Landscape;
                var gfx = XGraphics.FromPdfPage(pdfPage);
                var font = new XFont("Arial", 12, XFontStyle.Regular);

                var slidePart = (SlidePart)presentationPart.GetPartById(((DocumentFormat.OpenXml.Presentation.SlideId)slideId).RelationshipId);
                var slide = slidePart.Slide;

                var texts = slide.Descendants<A.Text>();
                double yPoint = 50;
                
                foreach (var text in texts)
                {
                    if (!string.IsNullOrWhiteSpace(text.Text))
                    {
                        gfx.DrawString(text.Text, font, XBrushes.Black, new XRect(50, yPoint, pdfPage.Width.Point - 100, 20), XStringFormats.TopLeft);
                        yPoint += 20;
                    }
                }
            }

            using var outputStream = new MemoryStream();
            pdfDoc.Save(outputStream, false);
            return outputStream.ToArray();
        }
    }
}
