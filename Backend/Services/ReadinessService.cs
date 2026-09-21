using Backend.Data;
using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class ReadinessService : IReadinessService
    {
        private readonly IDataRepository _dataRepository;
        private const string RULE_SET_VERSION = "v1.0.2024";

        public ReadinessService(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        public async Task EvaluateReadinessAsync(string applicationId)
        {
            var applications = await _dataRepository.GetApplicationsAsync();
            var application = applications.FirstOrDefault(a => a.Id == applicationId);
            
            if (application == null)
                return null;
            
            var payerEvaluations = new List();
            
            if (application.Payers != null)
            {
                foreach (var payer in application.Payers)
                {
                    var payerEval = EvaluatePayer(payer);
                    payerEvaluations.Add(payerEval);
                }
            }
            
            var overallScore = payerEvaluations.Any() 
                ? (int)payerEvaluations.Average(p => p.ReadinessScore) 
                : 0;
            
            var overallStatus = DetermineOverallStatus(overallScore);
            
            return new ReadinessEvaluation
            {
                ApplicationId = applicationId,
                ProviderName = application.ProviderName,
                OverallReadiness = overallStatus,
                OverallScore = overallScore,
                EvaluationDate = DateTime.UtcNow.ToString("o"),
                RuleSetVersion = RULE_SET_VERSION,
                PayerEvaluations = payerEvaluations
            };
        }

        private PayerEvaluation EvaluatePayer(PayerData payer)
        {
            var requirementResults = new List();
            
            if (payer.Requirements != null)
            {
                foreach (var req in payer.Requirements)
                {
                    var result = EvaluateRequirement(req);
                    requirementResults.Add(result);
                }
            }
            
            var metCount = requirementResults.Count(r => r.Status == "Met");
            var totalCount = requirementResults.Count;
            var score = totalCount > 0 ? (int)((double)metCount / totalCount * 100) : 0;
            
            return new PayerEvaluation
            {
                PayerId = payer.PayerId,
                PayerName = payer.PayerName,
                ReadinessStatus = DetermineReadinessStatus(score),
                ReadinessScore = score,
                RuleSetVersion = RULE_SET_VERSION,
                RequirementResults = requirementResults
            };
        }

        private RequirementResult EvaluateRequirement(Requirement req)
        {
            var result = new RequirementResult
            {
                RequirementId = req.RequirementId,
                RequirementName = req.RequirementName,
                Status = req.Status
            };
            
            if (req.Status == "Met")
            {
                result.Result = "Pass";
                result.Notes = "Requirement satisfied";
            }
            else if (req.Status == "Expired")
            {
                result.Result = "Fail";
                result.Notes = "Document expired - renewal required";
            }
            else if (req.Status == "Missing")
            {
                result.Result = "Fail";
                result.Notes = "Required document not provided";
            }
            else
            {
                result.Result = "Pending";
                result.Notes = "Under review";
            }
            
            return result;
        }

        private string DetermineReadinessStatus(int score)
        {
            if (score >= 90) return "Ready";
            if (score >= 60) return "Pending";
            return "Incomplete";
        }

        private string DetermineOverallStatus(int score)
        {
            if (score >= 90) return "Ready";
            if (score >= 60) return "Pending";
            return "Incomplete";
        }
    }
}