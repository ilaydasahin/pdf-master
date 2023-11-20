using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace PdfTools.Api.HealthChecks;

public class ApiHealthCheck : IHealthCheck
{
    private readonly ILogger<ApiHealthCheck> _logger;

    public ApiHealthCheck(ILogger<ApiHealthCheck> logger)
    {
        _logger = logger;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Check disk space
            var drive = DriveInfo.GetDrives().FirstOrDefault(d => d.IsReady && d.Name == Path.GetPathRoot(AppContext.BaseDirectory));
            var availableGb = drive?.AvailableFreeSpace / 1024.0 / 1024.0 / 1024.0 ?? 0;

            // Check memory usage
            var gcMemory = GC.GetTotalMemory(false) / 1024.0 / 1024.0; // MB

            var data = new Dictionary<string, object>
            {
                { "diskSpaceAvailableGb", Math.Round(availableGb, 2) },
                { "memoryUsageMb", Math.Round(gcMemory, 2) },
                { "timestamp", DateTime.UtcNow }
            };

            // Health check thresholds
            if (availableGb < 1) // Less than 1GB
            {
                return HealthCheckResult.Unhealthy(
                    "Low disk space",
                    data: data);
            }

            if (availableGb < 5) // Less than 5GB warning
            {
                return HealthCheckResult.Degraded(
                    "Disk space running low",
                    data: data);
            }

            return HealthCheckResult.Healthy("API is healthy", data: data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Health check failed");
            return HealthCheckResult.Unhealthy("Health check failed", ex);
        }
    }
}
