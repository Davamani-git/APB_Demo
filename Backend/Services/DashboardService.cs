using VK004Demo.Models;
using VK004Demo.Data;

namespace VK004Demo.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IJsonDataRepository _repository;
        private readonly IApplicationService _applicationService;
        private readonly IDocumentService _documentService;

        public DashboardService(
            IJsonDataRepository repository,
            IApplicationService applicationService,
            IDocumentService documentService)
        {
            _repository = repository;
            _applicationService = applicationService;
            _documentService = documentService;
        }

        public async Task<object> GetManagerDashboardAsync()
        {
            var applications = (await _applicationService.GetAllApplicationsAsync()).ToList();
            var evaluations = (await _repository.GetAllAsync<ReadinessEvaluation>("evaluations")).ToList();

            var totalApplications = applications.Count;
            var readyToSubmit = applications.Count(a => a.ReadinessStatus == "Ready to Submit");
            var incomplete = applications.Count(a => a.ReadinessStatus == "Incomplete");
            var expiringSoon = applications.Count(a => a.ReadinessStatus == "Expiring Soon");

            var atRiskApplications = applications
                .Where(a => a.ReadinessStatus != "Ready to Submit")
                .Select(a => new
                {
                    id = a.Id,
                    providerName = a.ProviderName,
                    startDate = a.StartDate,
                    status = a.ReadinessStatus,
                    daysUntilStart = (a.StartDate - DateTime.Now).Days,
                    riskLevel = CalculateRiskLevel(a.StartDate, a.ReadinessStatus)
                })
                .OrderBy(a => a.daysUntilStart)
                .Take(10)
                .ToList();

            var payerBreakdown = evaluations
                .SelectMany(e => e.PayerEvaluations)
                .GroupBy(p => p.PayerName)
                .Select(g => new
                {
                    payerName = g.Key,
                    total = g.Count(),
                    ready = g.Count(p => p.Status == "Ready to Submit"),
                    incomplete = g.Count(p => p.Status == "Incomplete"),
                    expiringSoon = g.Count(p => p.Status == "Expiring Soon")
                })
                .ToList();

            var kpis = new
            {
                avgDaysToReady = applications.Any() ? 15 : 0,
                completionRate = totalApplications > 0 ? (readyToSubmit * 100 / totalApplications) : 0,
                rejectionRate = 5,
                activeCoordinators = 3
            };

            return new
            {
                totalApplications,
                readyToSubmit,
                incomplete,
                expiringSoon,
                atRiskApplications,
                payerBreakdown,
                kpis
            };
        }

        private string CalculateRiskLevel(DateTime startDate, string status)
        {
            var daysUntilStart = (startDate - DateTime.Now).Days;
            if (status == "Incomplete" && daysUntilStart < 30) return "High";
            if (status == "Incomplete" || daysUntilStart < 60) return "Medium";
            return "Low";
        }

        public async Task<object> GetCoordinatorDashboardAsync(string coordinatorId)
        {
            var applications = (await _applicationService.GetAllApplicationsAsync()).ToList();
            
            var coordinatorApplications = applications.Take(20).ToList();

            var summary = new
            {
                totalAssigned = coordinatorApplications.Count,
                readyToSubmit = coordinatorApplications.Count(a => a.ReadinessStatus == "Ready to Submit"),
                incomplete = coordinatorApplications.Count(a => a.ReadinessStatus == "Incomplete"),
                expiringSoon = coordinatorApplications.Count(a => a.ReadinessStatus == "Expiring Soon"),
                applications = coordinatorApplications.Select(a => new
                {
                    id = a.Id,
                    providerName = a.ProviderName,
                    startDate = a.StartDate,
                    status = a.ReadinessStatus
                })
            };

            return summary;
        }
    }
}