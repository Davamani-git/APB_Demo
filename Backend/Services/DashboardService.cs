using Backend.Data;
using Backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IDataRepository _dataRepository;

        public DashboardService(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        public async Task GetDashboardStatsAsync()
        {
            var applications = (await _dataRepository.GetApplicationsAsync()).ToList();
            
            var stats = new DashboardStats
            {
                TotalApplications = applications.Count,
                ReadyApplications = applications.Count(a => a.Status == "Ready"),
                PendingApplications = applications.Count(a => a.Status == "Pending"),
                IncompleteApplications = applications.Count(a => a.Status == "Incomplete"),
                ByCoordinator = new Dictionary(),
                ByPayer = new Dictionary()
            };
            
            // Group by coordinator
            var coordinatorGroups = applications.GroupBy(a => a.Coordinator);
            foreach (var group in coordinatorGroups)
            {
                stats.ByCoordinator[group.Key] = group.Count();
            }
            
            // Group by payer
            foreach (var app in applications)
            {
                if (app.Payers != null)
                {
                    foreach (var payer in app.Payers)
                    {
                        if (!stats.ByPayer.ContainsKey(payer.PayerName))
                            stats.ByPayer[payer.PayerName] = 0;
                        stats.ByPayer[payer.PayerName]++;
                    }
                }
            }
            
            return stats;
        }
    }
}