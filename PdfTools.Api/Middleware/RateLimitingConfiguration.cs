using System.Threading.RateLimiting;

namespace PdfTools.Api.Middleware;

public static class RateLimitingConfiguration
{
    public static IServiceCollection AddRateLimiting(this IServiceCollection services, IConfiguration configuration)
    {
        var permitLimit = configuration.GetValue<int>("RateLimiting:FixedWindow:PermitLimit", 30);
        var windowMinutes = configuration.GetValue<int>("RateLimiting:FixedWindow:WindowMinutes", 1);
        
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            // Global limiter - IP bazlı
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
            {
                var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                
                return RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: ipAddress,
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = permitLimit,
                        Window = TimeSpan.FromMinutes(windowMinutes),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
            });

            // Custom rejection response
            options.OnRejected = async (context, token) =>
            {
                context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.HttpContext.Response.ContentType = "application/json";

                var response = new
                {
                    error = "Too Many Requests",
                    message = $"Rate limit exceeded. Please try again in {windowMinutes} minute(s).",
                    retryAfter = windowMinutes * 60 // seconds
                };

                await context.HttpContext.Response.WriteAsJsonAsync(response, cancellationToken: token);
            };
        });

        return services;
    }
}

