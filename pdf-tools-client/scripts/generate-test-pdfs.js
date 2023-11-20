/**
 * Test PDF Generator Script
 * Generates various PDF files for testing purposes
 * 
 * Run: node scripts/generate-test-pdfs.js
 */

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

async function generateTestPDFs() {
  const testFilesDir = path.join(__dirname, '../test-files/valid');
  
  console.log('🔧 Generating test PDF files...');

  // 1. Single page PDF (~100KB)
  await createPdf(testFilesDir, 'sample-1page.pdf', 1);
  
  // 2. 5 page PDF (~500KB)
  await createPdf(testFilesDir, 'sample-5page.pdf', 5);
  
  // 3. 10 page PDF (~2MB)
  await createPdf(testFilesDir, 'sample-10page.pdf', 10);
  
  // 4. 50 page PDF (~10MB)
  await createPdf(testFilesDir, 'sample-50page.pdf', 50);
  
  console.log('✅ All test PDFs generated successfully!');
  console.log(`📁 Location: ${testFilesDir}`);
}

async function createPdf(dir, filename, pageCount) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    page.drawText(`Test PDF - Page ${i + 1} of ${pageCount}`, {
      x: 50,
      y: height - 50,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`This is a test document generated for PDF Master testing.`, {
      x: 50,
      y: height - 100,
      size: 12,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    page.drawText(`Filename: ${filename}`, {
      x: 50,
      y: height - 130,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    page.drawText(`Total Pages: ${pageCount}`, {
      x: 50,
      y: height - 150,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // Add some content to make file larger
    for (let j = 0; j < 20; j++) {
      page.drawText(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Line ${j + 1}`, {
        x: 50,
        y: height - 200 - (j * 15),
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
    }
  }
  
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(path.join(dir, filename), pdfBytes);
  
  const sizeKB = (pdfBytes.length / 1024).toFixed(2);
  console.log(`✓ Created ${filename} (${pageCount} pages, ${sizeKB} KB)`);
}

// Run if executed directly
if (require.main === module) {
  generateTestPDFs().catch(console.error);
}

module.exports = { generateTestPDFs };
