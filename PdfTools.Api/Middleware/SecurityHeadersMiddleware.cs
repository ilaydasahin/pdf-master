using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace PdfTools.Api.Middleware
{
    /// <summary>
    /// Middleware to add security headers to all HTTP responses
    /// Implements OWASP best practices for web application security headers
    /// </summary>
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<SecurityHeadersMiddleware> _logger;

        public SecurityHeadersMiddleware(RequestDelegate next, ILogger<SecurityHeadersMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // X-Content-Type-Options: Prevents MIME type sniffing
            context.Response.Headers.Append("X-Content-Type-Options", "nosniff");

            // X-Frame-Options: Prevents clickjacking attacks
            context.Response.Headers.Append("X-Frame-Options", "DENY");

            // X-XSS-Protection: Legacy XSS protection (for older browsers)
            context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");

            // Referrer-Policy: Controls referrer information
            context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

            // Permissions-Policy: Disables unnecessary browser features
            context.Response.Headers.Append("Permissions-Policy",
                "geolocation=(), microphone=(), camera=(), payment=(), usb=()");

            // Strict-Transport-Security: Force HTTPS (only add if using HTTPS)
            if (context.Request.IsHttps)
            {
                context.Response.Headers.Append("Strict-Transport-Security",
                    "max-age=63072000; includeSubDomains; preload");
            }

            // Content-Security-Policy: Enhanced CSP for better XSS protection
            // Note: May need adjustment based on frontend requirements (especially for AdSense)
            context.Response.Headers.Append("Content-Security-Policy",
                "default-src 'self'; " +
                "img-src 'self' data: https:; " +
                "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://adservice.google.com; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com; " +
                "connect-src 'self' https://pagead2.googlesyndication.com; " +
                "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com; " +
                "frame-ancestors 'none'; " +
                "base-uri 'self'; " +
                "form-action 'self';");

            _logger.LogDebug("Security headers applied to response");

            await _next(context);
        }
    }
}
