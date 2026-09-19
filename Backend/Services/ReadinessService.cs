using VK004Demo.Models;
using VK004Demo.Data;

namespace VK004Demo.Services
{
    public class ReadinessService : IReadinessService
    {
        private readonly IJsonDataRepository _repository;
        private readonly IApplicationService _applicationService;
        private readonly IDocumentService _documentService;
        private readonly IRuleSetService _ruleSetService;

        public ReadinessService(
            IJsonDataRepository repository,
            IApplicationService applicationService,
            IDocumentService documentService,
            IRuleSetService ruleSetService)
        {
            _repository = repository;
            _applicationService = applicationService;
            _documentService = documentService;
            _ruleSetService = ruleSetService;
        }

        public async Task<ReadinessEvaluation?> EvaluateApplicationAsync(string applicationId)
        {
            var application = await _applicationService.GetApplicationByIdAsync(applicationId);
            if (application == null) return null;

            var documents = await _documentService.GetDocumentsByApplicationIdAsync(applicationId);
            var evaluation = new ReadinessEvaluation
            {
                ApplicationId = applicationId,
                EvaluationDate = DateTime.Now,
                PayerEvaluations = new List<PayerEvaluation>()
            };

            var overallStatus = "Ready to Submit";

            foreach (var payerRef in application.Payers)
            {
                var ruleSet = await _ruleSetService.GetActiveRuleSetForPayerAsync(payerRef);
                if (ruleSet == null) continue;

                var payerEval = new PayerEvaluation
                {
                    PayerId = ruleSet.PayerId,
                    PayerName = ruleSet.PayerName,
                    RuleSetVersion = ruleSet.Version,
                    Status = "Ready to Submit",
                    RequirementEvaluations = new List<RequirementEvaluation>()
                };

                foreach (var reqDoc in ruleSet.RequiredDocuments)
                {
                    var doc = documents.FirstOrDefault(d => d.DocumentType == reqDoc);
                    var reqEval = new RequirementEvaluation
                    {
                        RequirementName = reqDoc,
                        Status = doc == null ? "Missing" : EvaluateDocumentStatus(doc, ruleSet.ExpiringThreshold),
                        RuleApplied = $"Rule_{ruleSet.PayerId}_{reqDoc.Replace(" ", "")}",
                        Explanation = doc == null
                            ? $"Required document '{reqDoc}' is missing"
                            : $"Document '{reqDoc}' expires on {doc.ExpirationDate:yyyy-MM-dd}"
                    };
                    payerEval.RequirementEvaluations.Add(reqEval);

                    if (reqEval.Status == "Missing" || reqEval.Status == "Expired")
                    {
                        payerEval.Status = "Incomplete";
                        overallStatus = "Incomplete";
                    }
                    else if (reqEval.Status == "Expiring Soon" && payerEval.Status != "Incomplete")
                    {
                        payerEval.Status = "Expiring Soon";
                        if (overallStatus == "Ready to Submit")
                        {
                            overallStatus = "Expiring Soon";
                        }
                    }
                }

                evaluation.PayerEvaluations.Add(payerEval);
            }

            evaluation.OverallStatus = overallStatus;

            // Update application status
            application.ReadinessStatus = overallStatus;
            await _applicationService.UpdateApplicationAsync(application);

            // Save evaluation
            var evaluations = (await _repository.GetAllAsync<ReadinessEvaluation>("evaluations")).ToList();
            evaluations.RemoveAll(e => e.ApplicationId == applicationId);
            evaluations.Add(evaluation);
            await _repository.SaveAllAsync("evaluations", evaluations);

            return evaluation;
        }

        private string EvaluateDocumentStatus(Document document, int expiringThreshold)
        {
            var daysUntilExpiration = (document.ExpirationDate - DateTime.Now).Days;
            if (daysUntilExpiration < 0) return "Expired";
            if (daysUntilExpiration <= expiringThreshold) return "Expiring Soon";
            return "Present & Valid";
        }

        public async Task<int> EvaluateAllApplicationsAsync()
        {
            var applications = await _applicationService.GetAllApplicationsAsync();
            var count = 0;

            foreach (var application in applications)
            {
                await EvaluateApplicationAsync(application.Id);
                count++;
            }

            return count;
        }

        public async Task<ReadinessExplanation?> GetReadinessExplanationAsync(string applicationId, string payerId)
        {
            var evaluations = await _repository.GetAllAsync<ReadinessEvaluation>("evaluations");
            var evaluation = evaluations.FirstOrDefault(e => e.ApplicationId == applicationId);
            if (evaluation == null) return null;

            var payerEval = evaluation.PayerEvaluations.FirstOrDefault(p => p.PayerId == payerId);
            if (payerEval == null) return null;

            var ruleSet = await _ruleSetService.GetActiveRuleSetForPayerAsync(payerId);
            if (ruleSet == null) return null;

            var explanation = new ReadinessExplanation
            {
                ApplicationId = applicationId,
                PayerName = payerEval.PayerName,
                Status = payerEval.Status,
                RuleSetVersion = payerEval.RuleSetVersion,
                RuleSetEffectiveDate = ruleSet.EffectiveDate,
                EvaluationDate = evaluation.EvaluationDate,
                Explanation = GenerateExplanationText(payerEval),
                Requirements = payerEval.RequirementEvaluations.Select(r => new RequirementExplanation
                {
                    Name = r.RequirementName,
                    Status = r.Status,
                    RuleApplied = r.RuleApplied,
                    Explanation = r.Explanation
                }).ToList(),
                Recommendations = GenerateRecommendations(payerEval)
            };

            return explanation;
        }

        private string GenerateExplanationText(PayerEvaluation payerEval)
        {
            var missingCount = payerEval.RequirementEvaluations.Count(r => r.Status == "Missing");
            var expiredCount = payerEval.RequirementEvaluations.Count(r => r.Status == "Expired");
            var expiringCount = payerEval.RequirementEvaluations.Count(r => r.Status == "Expiring Soon");

            if (payerEval.Status == "Ready to Submit")
            {
                return $"All requirements for {payerEval.PayerName} are satisfied. The application is ready for submission.";
            }
            else if (payerEval.Status == "Incomplete")
            {
                return $"The application for {payerEval.PayerName} is incomplete. {missingCount} document(s) are missing and {expiredCount} document(s) have expired.";
            }
            else
            {
                return $"The application for {payerEval.PayerName} has {expiringCount} document(s) expiring soon. Please renew these documents to maintain readiness.";
            }
        }

        private List<string> GenerateRecommendations(PayerEvaluation payerEval)
        {
            var recommendations = new List<string>();

            foreach (var req in payerEval.RequirementEvaluations)
            {
                if (req.Status == "Missing")
                {
                    recommendations.Add($"Upload {req.RequirementName} to complete the application");
                }
                else if (req.Status == "Expired")
                {
                    recommendations.Add($"Renew expired {req.RequirementName} immediately");
                }
                else if (req.Status == "Expiring Soon")
                {
                    recommendations.Add($"Schedule renewal for {req.RequirementName} to avoid expiration");
                }
            }

            return recommendations;
        }

        public async Task<object?> GetApplicationStatusAsync(string applicationId)
        {
            var evaluations = await _repository.GetAllAsync<ReadinessEvaluation>("evaluations");
            var evaluation = evaluations.FirstOrDefault(e => e.ApplicationId == applicationId);
            if (evaluation == null) return null;

            return new
            {
                applicationId = evaluation.ApplicationId,
                overallStatus = evaluation.OverallStatus,
                evaluationDate = evaluation.EvaluationDate,
                payerStatuses = evaluation.PayerEvaluations.Select(p => new
                {
                    payerId = p.PayerId,
                    payerName = p.PayerName,
                    status = p.Status,
                    ruleSetVersion = p.RuleSetVersion
                })
            };
        }
    }
}