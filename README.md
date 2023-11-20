# PdfTools Enterprise Suite

A comprehensive, enterprise-grade PDF manipulation and conversion platform featuring a .NET 8 Web API backend and a modern Next.js client interface.

## Overview

PdfTools provides a high-performance micro-architecture for document processing. It supports merging, splitting, rotating, compressing, and encrypting PDFs, alongside advanced workflows for Optical Character Recognition (OCR), document repair, and MS Office format conversions.

## Core Capabilities

- Document Manipulation: Merge, split, rotate, and delete PDF pages.
- Security & Compliance: Apply passwords, watermarks, digital signatures, and PDF/A archiving.
- Advanced Processing: Tesseract OCR text extraction, PDF repair, and ImageMagick visual comparisons.
- Format Conversion: Bi-directional conversion between PDF, MS Office (Word, Excel, PPT), and images.

## Technology Stack

### Backend (PdfTools.Api)
- Framework: .NET 8 Web API
- PDF Engine: PdfSharpCore
- Advanced Processing: Tesseract OCR, Magick.NET, PuppeteerSharp
- Document Rendering: DocumentFormat.OpenXml

### Frontend (pdf-tools-client)
- Framework: Next.js (App Router), React 18
- Styling: Tailwind CSS
- Testing: Vitest, Playwright E2E

## Setup & Execution

### Backend API
1. Navigate to `PdfTools.Api`.
2. Restore packages: `dotnet restore`
3. Run API server: `dotnet run`

### Frontend Client
1. Navigate to `pdf-tools-client`.
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
