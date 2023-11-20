# Test Strategy - PDF Master

## Overview

Comprehensive testing strategy to achieve:

- **Backend**: 80%+ code coverage
- **Frontend**: 70%+ code coverage
- **E2E**: All critical user flows covered

---

## Backend Testing (xUnit + Moq)

### Test Framework:

- **xUnit** - Test runner
- **Moq** - Mocking framework
- **FluentAssertions** - Assertion library

### Coverage Target: 80%

### Test Categories:

#### 1. Unit Tests (`PdfTools.Tests/Services/`)

- ✅ `PdfServiceTests.cs` - PDF operations (Merge, Split, Rotate, Compress)
- ✅ `ImageConversionServiceTests.cs` - PDF ↔ Image conversions
- 🔄 `OfficeConversionServiceTests.cs` - Office → PDF
- 🔄 `OcrServiceTests.cs` - OCR functionality
- 🔄 `WorkflowServiceTests.cs` - Workflow execution

#### 2. Integration Tests (`PdfTools.Tests/Integration/`)

- Controller tests with TestServer
- Middleware integration tests
- End-to-end API tests

### Running Tests:

```bash
# All tests
dotnet test

# With coverage
dotnet test --collect:"XPlat Code Coverage"

# Specific test class
dotnet test --filter "FullyQualifiedName~PdfServiceTests"

# View coverage report
reportgenerator -reports:**/coverage.cobertura.xml -targetdir:coverage-report
```

---

## Frontend Testing (Vitest + Playwright)

### Unit Tests (Vitest):

- Component testing
- Utility function testing
- Hook testing

### E2E Tests (Playwright):

- ✅ `tests/e2e/pdf-tools.spec.ts` - Main tool flows
- Critical user journeys
- Responsive design testing
- Accessibility testing

### Coverage Target: 70%

### Running Tests:

```bash
cd pdf-tools-client

# Unit tests
npm run test

# Unit tests with coverage
npm run test -- --coverage

# E2E tests
npx playwright test

# E2E tests with UI
npx playwright test --ui

# E2E specific test
npx playwright test pdf-tools.spec.ts

# Generate HTML report
npx playwright show-report
```

---

## Test Scenarios

### Critical User Flows (E2E):

#### 1. Merge PDF

- ✅ Upload multiple PDFs
- ✅ Reorder files (drag-drop)
- ✅ Remove files
- ✅ Merge and download
- ✅ Error handling (invalid files)

#### 2. Split PDF

- ✅ Upload multi-page PDF
- ✅ Select page ranges
- ✅ Split and download multiple files

#### 3. Compress PDF

- ✅ Upload large PDF
- ✅ Adjust quality slider
- ✅ Compress and view size reduction

#### 4. Navigation & Responsiveness

- ✅ Navigate between tools
- ✅ Mobile responsive (375px)
- ✅ Tablet responsive (768px)

#### 5. Error Handling

- ✅ 500 Internal Server Error
- ✅ 429 Rate Limiting
- ✅ Invalid file types
- ✅ File size limits

#### 6. Accessibility

- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus visibility

---

## Test Data

### Required Test Files:

```
pdf-tools-client/test-files/
├── sample1.pdf (2 pages, ~500KB)
├── sample2.pdf (3 pages, ~800KB)
├── multi-page.pdf (10 pages, ~2MB)
├── large.pdf (50 pages, ~10MB)
└── invalid.txt (for error testing)
```

### Generating Test PDFs:

```bash
# Install test utilities
npm install --save-dev pdf-lib

# Run test data generator (create if needed)
node scripts/generate-test-pdfs.js
```

---

## CI/CD Integration

### GitHub Actions:

Tests run automatically on:

- Every push to `main`/`develop`
- All pull requests

### Backend CI:

```yaml
- name: Run tests
  run: dotnet test --collect:"XPlat Code Coverage"

- name: Upload coverage
  uses: codecov/codecov-action@v4
```

### Frontend CI:

```yaml
- name: Unit tests
  run: npm run test -- --coverage

- name: E2E tests
  run: npx playwright test
```

---

## Coverage Reports

### Backend (Codecov):

- View at: https://codecov.io/gh/YOUR_REPO
- Target: 80%+ overall
- Services: 90%+ (critical business logic)

### Frontend (Codecov):

- Components: 70%+
- Utils: 80%+
- Services: 85%+

### Viewing Locally:

```bash
# Backend
dotnet test --collect:"XPlat Code Coverage"
reportgenerator -reports:**/coverage.cobertura.xml -targetdir:./coverage-report -reporttypes:Html
open coverage-report/index.html

# Frontend
npm run test -- --coverage
open coverage/index.html
```

---

## Test Quality Metrics

### Tests Should:

- ✅ Follow AAA pattern (Arrange, Act, Assert)
- ✅ Be independent (no test order dependency)
- ✅ Use descriptive names
- ✅ Test one thing per test
- ✅ Use Theory/InlineData for parameterized tests

### Example:

```csharp
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
```

---

## Next Steps

### Immediate:

- [ ] Create test PDF files
- [ ] Run all tests locally
- [ ] Fix any failing tests
- [ ] Verify coverage reports

### Future Enhancements:

- [ ] Performance testing (K6)
- [ ] Load testing (concurrent users)
- [ ] Security testing (OWASP ZAP)
- [ ] Visual regression testing (Percy)
- [ ] Contract testing (Pact)

---

## Troubleshooting

### Common Issues:

**1. Tests fail locally but pass in CI:**

- Check file paths (absolute vs relative)
- Verify test data exists
- Check environment variables

**2. Low coverage:**

- Review uncovered lines in report
- Add tests for edge cases
- Test error paths

**3. E2E tests flaky:**

- Increase timeouts
- Add explicit waits
- Check for race conditions
- Use test isolation

**4. Mock setup issues:**

- Verify mock expectations
- Check call sequences
- Use It.IsAny<T>() for flexible matching

---

## Resources

- [xUnit Documentation](https://xunit.net/)
- [Moq Documentation](https://github.com/moq/moq4)
- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
