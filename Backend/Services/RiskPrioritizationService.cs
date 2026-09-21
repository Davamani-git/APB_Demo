using Backend.Data;
using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class RiskPrioritizationService : IRiskPrioritizationService
    {
        private readonly IDataRepository _dataRepository;

        public RiskPrioritizationService(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        public async Task> GetRiskScoredApplicationsAsync()
        {
            var applications = await _dataRepository.GetApplicationsAsync();
            
            var scoredApplications = applications.Select(app =>
            {
                var riskFactors = CalculateRiskFactors(app);
                var priorityFactors = CalculatePriorityFactors(app);
                
                return new RiskScoredApplication
                {
                    Id = app.Id,
                    ProviderName = app.ProviderName,
                    RiskScore = riskFactors.Sum(f => f.Score),
                    PriorityScore = priorityFactors.Sum(f => f.Score),
                    RiskFactors = riskFactors.Select(f => f.Description).ToList(),
                    PriorityFactors = priorityFactors.Select(f => f.Description).ToList(),
                    Status = app.Status,
                    DueDate = app.LastUpdated
                };
            }).OrderByDescending(a => a.PriorityScore).ThenByDescending(a => a.RiskScore).ToList();
            
            return scoredApplications;
        }

        private List CalculateRiskFactors(Application app)
        {
            var factors = new List();
            
            // Status-based risk
            if (app.Status == "Incomplete")
                factors.Add(new ScoringFactor { Score = 40, Description = "Application incomplete" });
            else if (app.Status == "Pending")
                factors.Add(new ScoringFactor { Score = 20, Description = "Application pending review" });
            
            // Readiness-based risk
            if (app.ReadinessScore < 50)
                factors.Add(new ScoringFactor { Score = 30, Description = "Low readiness score (<50%)" });
            else if (app.ReadinessScore < 75)
                factors.Add(new ScoringFactor { Score = 15, Description = "Moderate readiness score (50-75%)" });
            
            // Multiple payers increase complexity/risk
            if (app.Payers != null && app.Payers.Count > 3)
                factors.Add(new ScoringFactor { Score = 20, Description = $"Multiple payers ({app.Payers.Count})" });
            else if (app.Payers != null && app.Payers.Count > 1)
                factors.Add(new ScoringFactor { Score = 10, Description = $"Multiple payers ({app.Payers.Count})" });
            
            // Missing documents
            if (app.Documents == null || app.Documents.Count == 0)
                factors.Add(new ScoringFactor { Score = 25, Description = "No documents uploaded" });
            
            // Expired documents
            if (app.Documents != null)
            {
                var expiredCount = app.Documents.Count(d => 
                    !string.IsNullOrEmpty(d.ExpirationDate) && 
                    DateTime.TryParse(d.ExpirationDate, out DateTime expDate) && 
                    expDate < DateTime.UtcNow);
                
                if (expiredCount > 0)
                    factors.Add(new ScoringFactor { Score = expiredCount * 10, Description = $"{expiredCount} expired document(s)" });
            }
            
            return factors;
        }

        private List CalculatePriorityFactors(Application app)
        {
            var factors = new List();
            
            // Status-based priority
            if (app.Status == "Pending")
                factors.Add(new ScoringFactor { Score = 50, Description = "Pending applications require immediate attention" });
            else if (app.Status == "Incomplete")
                factors.Add(new ScoringFactor { Score = 30, Description = "Incomplete applications need completion" });
            else if (app.Status == "Ready")
                factors.Add(new ScoringFactor { Score = 20, Description = "Ready for submission" });
            
            // High readiness increases priority (close to completion)
            if (app.ReadinessScore >= 75)
                factors.Add(new ScoringFactor { Score = 30, Description = "High readiness - near completion" });
            else if (app.ReadinessScore >= 50)
                factors.Add(new ScoringFactor { Score = 15, Description = "Moderate readiness" });
            
            // Re-credentialing is time-sensitive
            if (app.EnrollmentType == "Re-credentialing")
                factors.Add(new ScoringFactor { Score = 25, Description = "Re-credentialing is time-sensitive" });
            
            // Recent updates indicate active work
            if (!string.IsNullOrEmpty(app.LastUpdated))
            {
                if (DateTime.TryParse(app.LastUpdated, out DateTime lastUpdate))
                {
                    var daysSinceUpdate = (DateTime.UtcNow - lastUpdate).Days;
                    if (daysSinceUpdate <= 7)
                        factors.Add(new ScoringFactor { Score = 15, Description = "Recently updated (active)" });
                }
            }
            
            return factors;
        }

        private class ScoringFactor
        {
            public int Score { get; set; }
            public string Description { get; set; }
        }
    }
}