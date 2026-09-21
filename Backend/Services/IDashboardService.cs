using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Services
{
    public interface IDashboardService
    {
        Task<DashboardStats> GetDashboardStatsAsync();
        Task<IEnumerable<DrillDownData>> GetDrillDownDataAsync(string status, string groupBy);
    }
}