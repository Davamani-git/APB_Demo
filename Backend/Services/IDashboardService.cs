using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Services
{
    public interface IDashboardService
    {
        Task<object> GetDashboardStatsAsync();
        Task<List<object>> GetCoordinatorBreakdownAsync();
        Task<List<object>> GetPayerBreakdownAsync();
    }
}