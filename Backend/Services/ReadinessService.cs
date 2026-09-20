using ProviderEnrollment.Data;
using ProviderEnrollment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProviderEnrollment.Services
{
    public interface IReadinessService
    {
        Task<ReadinessEvaluation> EvaluateApplicationAsync(string applicationId);
        Task<IEnumerable<ReadinessEvaluation>> GetEvaluationHistoryAsync(string applicationId);
    }

    public class ReadinessService : IReadinessService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IRuleSetRepository _ruleSetRepository;
        private readonly IReadinessRepository _readinessRepository;
        private const int EXPIRATION_THRESHOLD_DAYS = 90;

        public ReadinessService(
            IApplicationRepository applicationRepository,
            IRuleSetRepository ruleSetRepository,
            IReadinessRepository readinessRepository)
        {
            _applicationRepository = applicationRepository;
            _ruleSetRepository = ruleSetRepository;
            _readinessRepository = readinessRepository;
        }

        public async Task<ReadinessEvaluation> EvaluateApplicationAsync(string applicationId)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null) return null;

            var evaluation = new ReadinessEvaluation
            {
                ApplicationId = applicationId,
                EvaluationDate = DateTime.UtcNow,
                PayerEvaluations = new List<PayerEvaluation>()
            };

            var payerEvaluations = new List<PayerEvaluation>();
            var worstStatus = "Ready to Submit";
            int totalDeficiencies = 0;
            int expiringCount = 0;

            foreach (var payer in application.Payers)
            {
                var ruleSet = await GetEffectiveRuleSet(payer.PayerId, application.SubmissionDate);
                if (ruleSet == null) continue;

                var payerEval = EvaluatePayer(payer, ruleSet);
                payerEvaluations.Add(payerEval);

                // Track worst-case status
                if (payerEval.Status == "Expiring Soon") worstStatus = "Expiring Soon";
                else if (payerEval.Status == "Incomplete" && worstStatus != "Expiring Soon") worstStatus = "Incomplete";

                totalDeficiencies += payerEval.RequirementResults.Count(r => r.Status != "Present and Valid");
                expiringCount += payerEval.RequirementResults.Count(r => r.Status == "Expiring Soon");
            }

            evaluation.PayerEvaluations = payerEvaluations;
            evaluation.OverallStatus = worstStatus;
            evaluation.PriorityScore = CalculatePriorityScore(totalDeficiencies, expiringCount);
            evaluation.RiskScore = CalculateRiskScore(totalDeficiencies, expiringCount);

            // Save evaluation
            await _readinessRepository.CreateAsync(evaluation);

            // Update application
            application.OverallStatus = evaluation.OverallStatus;
            application.PriorityScore = evaluation.PriorityScore;
            application.RiskScore = evaluation.RiskScore;
            await _applicationRepository.UpdateAsync(application);

            return evaluation;
        }

        public async Task<IEnumerable<ReadinessEvaluation>> GetEvaluationHistoryAsync(string applicationId)
        {
            return await _readinessRepository.GetByApplicationIdAsync(applicationId);
        }

        private async Task<RuleSet> GetEffectiveRuleSet(string payerId, DateTime submissionDate)
        {
            var ruleSets = await _ruleSetRepository.GetAllAsync();
            return ruleSets
                .Where(rs => rs.PayerId == payerId &&
                            rs.EffectiveDate <= submissionDate &&
                            (rs.EndDate == null || rs.EndDate >= submissionDate))
                .OrderByDescending(rs => rs.EffectiveDate)
                .FirstOrDefault();
        }

        private PayerEvaluation EvaluatePayer(PayerStatus payer, RuleSet ruleSet)
        {
            var requirementResults = new List<RequirementResult>();
            var hasIncomplete = false;
            var hasExpiring = false;

            foreach (var doc in ruleSet.RequiredDocuments)
            {
                var requirement = payer.Requirements.FirstOrDefault(r => r.Name == doc.DocumentType);
                var result = new RequirementResult
                {
                    RequirementName = doc.DocumentType
                };

                if (requirement == null)
                {
                    result.Status = "Missing";
                    result.Recommendation = $"Please provide {doc.DocumentType}";
                    hasIncomplete = true;
                }
                else if (requirement.ExpirationDate.HasValue)
                {
                    var daysUntilExpiration = (requirement.ExpirationDate.Value - DateTime.UtcNow).Days;
                    if (daysUntilExpiration < 0)
                    {
                        result.Status = "Expired";
                        result.Recommendation = $"{doc.DocumentType} has expired. Please provide updated document.";
                        hasIncomplete = true;
                    }
                    else if (daysUntilExpiration <= EXPIRATION_THRESHOLD_DAYS)
                    {
                        result.Status = "Expiring Soon";
                        result.Recommendation = $"{doc.DocumentType} expires in {daysUntilExpiration} days. Consider renewal.";
                        hasExpiring = true;
                    }
                    else
                    {
                        result.Status = "Present and Valid";
                    }
                    result.ExpirationDate = requirement.ExpirationDate;
                }
                else
                {
                    result.Status = "Present and Valid";
                }

                requirementResults.Add(result);
            }

            string payerStatus = "Ready to Submit";
            if (hasExpiring) payerStatus = "Expiring Soon";
            if (hasIncomplete) payerStatus = "Incomplete";

            return new PayerEvaluation
            {
                PayerId = payer.PayerId,
                PayerName = payer.PayerName,
                Status = payerStatus,
                RuleSetVersion = ruleSet.Version,
                RequirementResults = requirementResults
            };
        }

        private int CalculatePriorityScore(int deficiencies, int expiring)
        {
            int score = 50;
            score += deficiencies * 10;
            score += expiring * 15;
            return Math.Min(score, 100);
        }

        private int CalculateRiskScore(int deficiencies, int expiring)
        {
            int score = 30;
            score += deficiencies * 8;
            score += expiring * 20;
            return Math.Min(score, 100);
        }
    }
}