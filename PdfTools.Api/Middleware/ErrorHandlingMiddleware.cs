using System.Net;
using System.Text.Json;

namespace PdfTools.Api.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        var response = new ErrorResponse();

        switch (exception)
        {
            case InvalidFileException ife:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response.Error = "Invalid File";
                response.Message = ife.Message;
                response.Details = ife.Details;
                break;

            case PdfProcessingException ppe:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response.Error = "PDF Processing Error";
                response.Message = "An error occurred while processing the PDF file.";
                response.Details = ppe.Message;
                break;

            case FileNotFoundException fnfe:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                response.Error = "File Not Found";
                response.Message = fnfe.Message;
                break;

            case UnauthorizedAccessException:
                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                response.Error = "Access Denied";
                response.Message = "You do not have permission to perform this action.";
                break;

            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response.Error = "Internal Server Error";
                response.Message = "An unexpected error occurred. Please try again later.";
                // Don't expose internal error details in production
                break;
        }

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}

public class ErrorResponse
{
    public string Error { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Details { get; set; }
    public string Timestamp { get; set; } = DateTime.UtcNow.ToString("o");
}

// Custom Exceptions
public class InvalidFileException : Exception
{
    public string? Details { get; set; }

    public InvalidFileException(string message) : base(message) { }
    
    public InvalidFileException(string message, string details) : base(message)
    {
        Details = details;
    }
}

public class PdfProcessingException : Exception
{
    public PdfProcessingException(string message) : base(message) { }
    
    public PdfProcessingException(string message, Exception innerException) 
        : base(message, innerException) { }
}
