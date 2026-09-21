using ProviderEnrollmentSystem.Data;
using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Services
{
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

            return new DashboardStats
            {
                Total = appList.Count,
                ReadyToSubmit = appList.Count(a => a.OverallStatus == "Ready to Submit"),
                Incomplete = appList.Count(a => a.OverallStatus == "Incomplete"),
                ExpiringSoon = appList.Count(a => a.OverallStatus == "Expiring Soon")
            };
        }

        public async Task<IEnumerable<DrillDownData>> GetDrillDownDataAsync(string status, string groupBy)
        {
            var applications = await _applicationRepository.GetAllAsync();
            var filtered = applications.Where(a => a.OverallStatus == status).ToList();

            if (groupBy.Equals("coordinator", StringComparison.OrdinalIgnoreCase))
            {
                return filtered
                    .GroupBy(a => a.Coordinator)
                    .Select(g => new DrillDownData
                    {
                        GroupName = g.Key,
                        Count = g.Count(),
                        ApplicationIds = g.Select(a => a.Id).ToList()
                    })
                    .OrderByDescending(d => d.Count)
                    .ToList();
            }
            else if (groupBy.Equals("payer", StringComparison.OrdinalIgnoreCase))
            {
                var payerGroups = new Dictionary<string, List<string>>();
                foreach (var app in filtered)
                {
                    foreach (var payer in app.TargetPayers)
                    {
                        if (!payerGroups.ContainsKey(payer))
                        {
                            payerGroups[payer] = new List<string>();
                        }
                        if (!payerGroups[payer].Contains(app.Id))
                        {
                            payerGroups[payer].Add(app.Id);
                        }
                    }
                }

                return payerGroups
                    .Select(kvp => new DrillDownData
                    {
                        GroupName = kvp.Key,
                        Count = kvp.Value.Count,
                        ApplicationIds = kvp.Value
                    })
                    .OrderByDescending(d => d.Count)
                    .ToList();
            }

            return new List<DrillDownData>();
        }
    }
}