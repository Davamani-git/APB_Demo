using ProviderEnrollment.Data;
using ProviderEnrollment.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProviderEnrollment.Services
{
    public interface IDashboardService
    {
        Task<DashboardStats> GetDashboardStatsAsync();
    }

    public class DashboardService : IDashboardService
    {
        private readonly IApplicationRepository _applicationRepository;

        public DashboardService(IApplicationRepository applicationRepository)
        {
            _applicationRepository = applicationRepository;
        }

        public async Task<DashboardStats> GetDashboardStatsAsync()
        {
            var applications = await _applicationRepository.GetAllAsync();
            var appList = applications.ToList();

            var stats = new DashboardStats
            {
                TotalApplications = appList.Count,
                ByStatus = appList
                    .GroupBy(a => a.OverallStatus)
                    .Select(g => new StatusCount { Status = g.Key, Count = g.Count() })
                    .ToList(),
                ByCoordinator = appList
                    .GroupBy(a => a.CoordinatorName)
                    .Select(g => new CoordinatorCount { CoordinatorName = g.Key, Count = g.Count() })
                    .ToList(),
                ByPayer = appList
                    .SelectMany(a => a.Payers)
                    .GroupBy(p => p.PayerName)
                    .Select(g => new PayerCount { PayerName = g.Key, Count = g.Count() })
                    .ToList(),
                HighPriorityApplications = appList
                    .Where(a => a.PriorityScore >= 80)
                    .OrderByDescending(a => a.PriorityScore)
                    .Take(10)
                    .Select(a => new HighPriorityApp
                    {
                        Id = a.Id,
                        ProviderName = a.ProviderName,
                        PriorityScore = a.PriorityScore,
                        Status = a.OverallStatus
                    })
                    .ToList()
            };

            return stats;
        }
    }
}