using Serilog;
using PdfTools.Api.Services;
using PdfTools.Api.Middleware;
using PdfTools.Api.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();

// PDF Services
builder.Services.AddScoped<IPdfService, PdfService>();
builder.Services.AddScoped<IOfficeConversionService, OfficeConversionService>();
builder.Services.AddScoped<IOcrService, OcrService>();
builder.Services.AddScoped<IImageConversionService, ImageConversionService>();
builder.Services.AddScoped<IHtmlToPdfService, HtmlToPdfService>();
builder.Services.AddScoped<IRepairService, RepairService>();
builder.Services.AddScoped<ICompareService, CompareService>();
builder.Services.AddScoped<IRedactService, RedactService>();
builder.Services.AddScoped<ICropService, CropService>();
builder.Services.AddScoped<IPdfToPdfAService, PdfToPdfAService>();
builder.Services.AddScoped<IWorkflowService, WorkflowService>();

// Memory Cache
builder.Services.AddMemoryCache();

// Response Compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

// Rate Limiting
builder.Services.AddRateLimiting(builder.Configuration);

// Health Checks
builder.Services.AddHealthChecks()
    .AddCheck<ApiHealthCheck>("api_health_check");

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSerilogRequestLogging();

// Global Error Handling Middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// CORS
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
app.UseCors(builder => builder
    .WithOrigins(allowedOrigins)
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseHttpsRedirection();

// Security Headers Middleware
app.UseMiddleware<SecurityHeadersMiddleware>();

// File Validation Middleware (before controllers)
app.UseMiddleware<FileValidationMiddleware>();

// Response Compression
app.UseResponseCompression();

// Rate Limiting
app.UseRateLimiter();

// Health Check Endpoints
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/ready");

app.MapControllers();

app.Run();

namespace PdfTools.Api
{
    public partial class Program { }
}
