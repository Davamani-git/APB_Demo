using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Services
{
    public class ReadinessEvaluationService : IReadinessEvaluationService
    {
        private readonly IPayerRuleService _payerRuleService;

        public ReadinessEvaluationService(IPayerRuleService payerRuleService)
        {
            _payerRuleService = payerRuleService;
        }

        public async Task<Application> EvaluateApplicationAsync(Application application)
        {
            var payerRequirements = new List<PayerRequirement>();
            var worstStatus = "Ready to Submit";
            int totalPriorityScore = 0;

            foreach (var payerName in application.TargetPayers)
            {
                var rule = await _payerRuleService.GetActiveRuleForPayerAsync(payerName, application.SubmissionDate);
                if (rule == null) continue;

                var payerReq = EvaluatePayerRequirements(application, rule);
                payerRequirements.Add(payerReq);

                // Update worst status
                if (payerReq.Status == "Incomplete")
                {
                    worstStatus = "Incomplete";
                }
                else if (payerReq.Status == "Expiring Soon" && worstStatus != "Incomplete")
                {
                    worstStatus = "Expiring Soon";
                }

                // Calculate priority score component
                totalPriorityScore += CalculatePriorityScore(payerReq, rule);
            }

            application.PayerRequirements = payerRequirements;
            application.OverallStatus = worstStatus;
            application.PriorityScore = totalPriorityScore / Math.Max(application.TargetPayers.Count, 1);

            return application;
        }

        private PayerRequirement EvaluatePayerRequirements(Application application, PayerRule rule)
        {
            var documentItems = new List<RequirementItem>();
            var fieldItems = new List<RequirementItem>();
            var payerStatus = "Ready to Submit";

            // Evaluate documents
            foreach (var requiredDoc in rule.RequiredDocuments)
            {
                var doc = application.Documents.FirstOrDefault(d =>
                    d.Type.Equals(requiredDoc, StringComparison.OrdinalIgnoreCase));

                if (doc == null)
                {
                    documentItems.Add(new RequirementItem
                    {
                        Name = requiredDoc,
                        Status = "Missing",
                        Recommendation = $"Please upload {requiredDoc} to complete this requirement."
                    });
                    payerStatus = "Incomplete";
                }
                else if (doc.ExpirationDate.HasValue)
                {
                    var daysUntilExpiration = (doc.ExpirationDate.Value - DateTime.Now).Days;
                    if (daysUntilExpiration < 0)
                    {
                        documentItems.Add(new RequirementItem
                        {
                            Name = requiredDoc,
                            Status = "Expired",
                            ExpirationDate = doc.ExpirationDate,
                            Recommendation = $"{requiredDoc} expired on {doc.ExpirationDate:d}. Please upload a current version immediately."
                        });
                        payerStatus = "Incomplete";
                    }
                    else if (daysUntilExpiration <= rule.ExpirationThreshold)
                    {
                        documentItems.Add(new RequirementItem
                        {
                            Name = requiredDoc,
                            Status = "Expiring Soon",
                            ExpirationDate = doc.ExpirationDate,
                            Recommendation = $"{requiredDoc} expires on {doc.ExpirationDate:d} ({daysUntilExpiration} days). Please renew before submission."
                        });
                        if (payerStatus == "Ready to Submit")
                        {
                            payerStatus = "Expiring Soon";
                        }
                    }
                    else
                    {
                        documentItems.Add(new RequirementItem
                        {
                            Name = requiredDoc,
                            Status = "Present & Valid",
                            ExpirationDate = doc.ExpirationDate
                        });
                    }
                }
                else
                {
                    documentItems.Add(new RequirementItem
                    {
                        Name = requiredDoc,
                        Status = "Present & Valid"
                    });
                }
            }

            // Evaluate data fields
            foreach (var requiredField in rule.RequiredDataFields)
            {
                var field = application.DataFields.FirstOrDefault(f =>
                    f.Name.Equals(requiredField, StringComparison.OrdinalIgnoreCase));

                if (field == null || string.IsNullOrWhiteSpace(field.Value))
                {
                    fieldItems.Add(new RequirementItem
                    {
                        Name = requiredField,
                        Status = "Missing",
                        Recommendation = $"Please provide {requiredField} to complete this requirement."
                    });
                    payerStatus = "Incomplete";
                }
                else
                {
                    fieldItems.Add(new RequirementItem
                    {
                        Name = requiredField,
                        Status = "Present & Valid",
                        Value = field.Value
                    });
                }
            }

            return new PayerRequirement
            {
                PayerName = rule.PayerName,
                Status = payerStatus,
                Documents = documentItems,
                DataFields = fieldItems
            };
        }

        private int CalculatePriorityScore(PayerRequirement payerReq, PayerRule rule)
        {
            int score = 0;

            // Base score by status
            switch (payerReq.Status)
            {
                case "Incomplete":
                    score = 50;
                    break;
                case "Expiring Soon":
                    score = 70;
                    break;
                case "Ready to Submit":
                    score = 30;
                    break;
            }

            // Add urgency for expiring documents
            foreach (var doc in payerReq.Documents.Where(d => d.Status == "Expiring Soon" && d.ExpirationDate.HasValue))
            {
                var daysUntilExpiration = (doc.ExpirationDate.Value - DateTime.Now).Days;
                if (daysUntilExpiration <= 15)
                {
                    score += 30; // High urgency
                }
                else if (daysUntilExpiration <= 45)
                {
                    score += 15; // Medium urgency
                }
            }

            return Math.Min(score, 100);
        }
    }
}