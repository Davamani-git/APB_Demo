using EnrollmentReadiness.Data;
using EnrollmentReadiness.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Services
{
    public class ReadinessEvaluationService : IReadinessEvaluationService
    {
        private readonly IPayerRulesRepository _payerRulesRepository;
        private const int ExpiringSoonThresholdDays = 30;
        private const int HighPriorityThresholdDays = 15;

        public ReadinessEvaluationService(IPayerRulesRepository payerRulesRepository)
        {
            _payerRulesRepository = payerRulesRepository;
        }

        public async Task EvaluateApplicationAsync(EnrollmentApplication application)
        {
            var allRuleSets = await _payerRulesRepository.GetAllAsync();
            var activeRuleSets = allRuleSets.Where(r => r.IsActive).ToList();

            foreach (var payerReq in application.PayerRequirements)
            {
                var ruleSet = activeRuleSets.FirstOrDefault(r => 
                    r.PayerName.Equals(payerReq.PayerName, StringComparison.OrdinalIgnoreCase));

                if (ruleSet != null)
                {
                    EvaluatePayerRequirements(payerReq, ruleSet);
                }
            }

            // Calculate overall status based on worst-case payer status
            application.OverallStatus = CalculateOverallStatus(application.PayerRequirements);
            
            // Calculate priority based on status and expiration
            application.Priority = CalculatePriority(application);
            
            return application;
        }

        private void EvaluatePayerRequirements(PayerRequirement payerReq, PayerRuleSet ruleSet)
        {
            var deficiencies = new List();
            int missingCount = 0;
            int expiredCount = 0;
            int expiringSoonCount = 0;

            foreach (var ruleRequirement in ruleSet.Requirements)
            {
                var requirement = payerReq.Requirements.FirstOrDefault(r => 
                    r.RequirementName.Equals(ruleRequirement.Name, StringComparison.OrdinalIgnoreCase));

                if (requirement == null && ruleRequirement.Mandatory)
                {
                    // Missing requirement
                    missingCount++;
                    var newReq = new Requirement
                    {
                        RequirementName = ruleRequirement.Name,
                        RequirementType = ruleRequirement.Type,
                        Status = "Missing",
                        Details = "This required document or data field is missing"
                    };
                    payerReq.Requirements.Add(newReq);

                    deficiencies.Add(new RequirementDeficiency
                    {
                        RequirementName = ruleRequirement.Name,
                        Issue = "Missing required item",
                        OutreachRecommendations = new List
                        {
                            $"Contact provider to obtain {ruleRequirement.Name}",
                            "Verify the requirement type and format needed",
                            "Set follow-up reminder for 3 business days"
                        }
                    });
                }
                else if (requirement != null)
                {
                    // Check expiration
                    if (!string.IsNullOrEmpty(requirement.ExpirationDate))
                    {
                        if (DateTime.TryParse(requirement.ExpirationDate, out var expirationDate))
                        {
                            var daysUntilExpiration = (expirationDate - DateTime.UtcNow).Days;

                            if (daysUntilExpiration < 0)
                            {
                                requirement.Status = "Expired";
                                expiredCount++;
                                deficiencies.Add(new RequirementDeficiency
                                {
                                    RequirementName = requirement.RequirementName,
                                    Issue = "Document has expired",
                                    ExpirationDate = requirement.ExpirationDate,
                                    OutreachRecommendations = new List
                                    {
                                        "Immediately contact provider for updated document",
                                        "Mark as high priority for renewal",
                                        "Verify current validity requirements"
                                    }
                                });
                            }
                            else if (daysUntilExpiration <= ExpiringSoonThresholdDays)
                            {
                                requirement.Status = "Expiring Soon";
                                expiringSoonCount++;
                                deficiencies.Add(new RequirementDeficiency
                                {
                                    RequirementName = requirement.RequirementName,
                                    Issue = $"Document expires in {daysUntilExpiration} days",
                                    ExpirationDate = requirement.ExpirationDate,
                                    OutreachRecommendations = new List
                                    {
                                        "Proactively contact provider for renewal",
                                        $"Schedule follow-up before {expirationDate:yyyy-MM-dd}",
                                        "Prepare renewal documentation"
                                    }
                                });
                            }
                            else
                            {
                                requirement.Status = "Present & Valid";
                            }
                        }
                    }
                    else
                    {
                        requirement.Status = "Present & Valid";
                    }
                }
            }

            payerReq.Deficiencies = deficiencies;

            // Determine payer status
            if (expiredCount > 0 || missingCount > 0)
            {
                payerReq.PayerStatus = "Incomplete";
            }
            else if (expiringSoonCount > 0)
            {
                payerReq.PayerStatus = "Expiring Soon";
            }
            else
            {
                payerReq.PayerStatus = "Ready to Submit";
            }
        }

        private string CalculateOverallStatus(List payerRequirements)
        {
            if (payerRequirements.Any(p => p.PayerStatus == "Incomplete"))
            {
                return "Incomplete";
            }
            if (payerRequirements.Any(p => p.PayerStatus == "Expiring Soon"))
            {
                return "Expiring Soon";
            }
            return "Ready to Submit";
        }

        private string CalculatePriority(EnrollmentApplication application)
        {
            if (application.DaysUntilExpiration <= HighPriorityThresholdDays || 
                application.OverallStatus == "Incomplete")
            {
                return "High";
            }
            if (application.DaysUntilExpiration <= ExpiringSoonThresholdDays || 
                application.OverallStatus == "Expiring Soon")
            {
                return "Medium";
            }
            return "Low";
        }
    }
}