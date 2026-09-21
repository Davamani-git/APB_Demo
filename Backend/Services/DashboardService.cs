using HealthcareEnrollment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IApplicationService _applicationService;

        public DashboardService(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        public async Task<object> GetDashboardStatsAsync()
        {
            var applications = await _applicationService.GetAllApplicationsAsync();

            var readyCount = applications.Count(a => 
                a.OverallStatus.Contains("Ready", StringComparison.OrdinalIgnoreCase));
            var incompleteCount = applications.Count(a => 
                a.OverallStatus.Contains("Incomplete", StringComparison.OrdinalIgnoreCase));
            var expiringCount = applications.Count(a => 
                a.OverallStatus.Contains("Expiring", StringComparison.OrdinalIgnoreCase));

            var coordinatorBreakdown = await GetCoordinatorBreakdownAsync();
            var payerBreakdown = await GetPayerBreakdownAsync();

            return new
            {
                readyCount,
                incompleteCount,
                expiringCount,
                totalApplications = applications.Count,
                coordinatorBreakdown,
                payerBreakdown
            };
        }

        public async Task<List<object>> GetCoordinatorBreakdownAsync()
        {
            var applications = await _applicationService.GetAllApplicationsAsync();

            var breakdown = applications
                .GroupBy(a => new { a.CoordinatorId, a.CoordinatorName })
                .Select(g => new
                {
                    coordinatorId = g.Key.CoordinatorId,
                    name = g.Key.CoordinatorName,
                    ready = g.Count(a => a.OverallStatus.Contains("Ready", StringComparison.OrdinalIgnoreCase)),
                    incomplete = g.Count(a => a.OverallStatus.Contains("Incomplete", StringComparison.OrdinalIgnoreCase)),
                    expiring = g.Count(a => a.OverallStatus.Contains("Expiring", StringComparison.OrdinalIgnoreCase)),
                    total = g.Count()
                })
                .OrderBy(x => x.name)
                .Cast<object>()
                .ToList();

            return breakdown;
        }

        public async Task<List<object>> GetPayerBreakdownAsync()
        {
            var applications = await _applicationService.GetAllApplicationsAsync();

            var payerStats = new Dictionary<string, Dictionary<string, int>>();

            foreach (var app in applications)
            {
                foreach (var payer in app.Payers)
                {
                    if (!payerStats.ContainsKey(payer.PayerName))
                    {
                        payerStats[payer.PayerName] = new Dictionary<string, int>
                        {
                            { "ready", 0 },
                            { "incomplete", 0 },
                            { "expiring", 0 },
                            { "total", 0 }
                        };
                    }

                    payerStats[payer.PayerName]["total"]++;

                    if (payer.Status.Contains("Ready", StringComparison.OrdinalIgnoreCase))
                        payerStats[payer.PayerName]["ready"]++;
                    else if (payer.Status.Contains("Incomplete", StringComparison.OrdinalIgnoreCase))
                        payerStats[payer.PayerName]["incomplete"]++;
                    else if (payer.Status.Contains("Expiring", StringComparison.OrdinalIgnoreCase))
                        payerStats[payer.PayerName]["expiring"]++;
                }
            }

            var breakdown = payerStats
                .Select(kvp => new
                {
                    name = kvp.Key,
                    ready = kvp.Value["ready"],
                    incomplete = kvp.Value["incomplete"],
                    expiring = kvp.Value["expiring"],
                    total = kvp.Value["total"]
                })
                .OrderBy(x => x.name)
                .Cast<object>()
                .ToList();

            return breakdown;
        }
    }
}