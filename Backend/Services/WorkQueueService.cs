using Backend.Data;
using Backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class WorkQueueService : IWorkQueueService
    {
        private readonly IDataRepository _dataRepository;

        public WorkQueueService(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        public async Task> GetWorkQueueAsync()
        {
            var applications = await _dataRepository.GetApplicationsAsync();
            
            var workQueue = applications.Select(app => new WorkQueueItem
            {
                Id = app.Id,
                ProviderName = app.ProviderName,
                Status = app.Status,
                ReadinessScore = app.ReadinessScore,
                RiskScore = CalculateRiskScore(app),
                PriorityScore = CalculatePriorityScore(app),
                Payers = app.Payers?.Select(p => p.PayerName).ToList() ?? new List(),
                Coordinator = app.Coordinator,
                DueDate = app.LastUpdated
            }).OrderByDescending(w => w.PriorityScore).ToList();
            
            return workQueue;
        }

        private int CalculateRiskScore(Application app)
        {
            int score = 0;
            
            // Higher risk if incomplete
            if (app.Status == "Incomplete") score += 50;
            if (app.Status == "Pending") score += 30;
            
            // Higher risk if low readiness
            if (app.ReadinessScore < 50) score += 30;
            else if (app.ReadinessScore < 75) score += 15;
            
            // Higher risk if multiple payers
            if (app.Payers != null && app.Payers.Count > 2) score += 20;
            
            return Math.Min(score, 100);
        }

        private int CalculatePriorityScore(Application app)
        {
            int score = 0;
            
            // Higher priority if incomplete
            if (app.Status == "Incomplete") score += 40;
            if (app.Status == "Pending") score += 60;
            if (app.Status == "Ready") score += 20;
            
            // Higher priority if close to ready
            if (app.ReadinessScore >= 75) score += 40;
            else if (app.ReadinessScore >= 50) score += 25;
            
            return Math.Min(score, 100);
        }
    }
}