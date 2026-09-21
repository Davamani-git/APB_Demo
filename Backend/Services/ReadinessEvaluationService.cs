using HealthcareEnrollment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Services
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
            var evaluatedPayers = new List<PayerStatus>();

            foreach (var payer in application.Payers)
            {
                var rule = await _payerRuleService.GetPayerRuleByPayerIdAsync(
                    payer.PayerId, 
                    application.SubmissionDate);

                if (rule == null)
                {
                    payer.Status = "Unknown";
                    payer.Requirements = new List<Requirement>();
                    payer.Recommendations = new List<string> { "No rule set found for this payer" };
                    evaluatedPayers.Add(payer);
                    continue;
                }

                var requirements = new List<Requirement>();
                var recommendations = new List<string>();
                var hasIncomplete = false;
                var hasExpiring = false;

                // Evaluate documents
                foreach (var reqDoc in rule.RequiredDocuments)
                {
                    var appDoc = payer.Requirements?.FirstOrDefault(r => 
                        r.Type == "Document" && r.Name == reqDoc.DocumentName);

                    if (appDoc == null)
                    {
                        requirements.Add(new Requirement
                        {
                            Type = "Document",
                            Name = reqDoc.DocumentName,
                            Status = "Missing"
                        });
                        hasIncomplete = true;
                        recommendations.Add($"Upload required document: {reqDoc.DocumentName}");
                    }
                    else if (reqDoc.RequiresExpiration && !string.IsNullOrEmpty(appDoc.ExpirationDate))
                    {
                        var expirationDate = DateTime.Parse(appDoc.ExpirationDate);
                        var daysUntilExpiration = (expirationDate - DateTime.UtcNow).Days;

                        if (daysUntilExpiration < 0)
                        {
                            requirements.Add(new Requirement
                            {
                                Type = "Document",
                                Name = reqDoc.DocumentName,
                                Status = "Expired",
                                ExpirationDate = appDoc.ExpirationDate,
                                DaysUntilExpiration = daysUntilExpiration
                            });
                            hasIncomplete = true;
                            recommendations.Add($"Renew expired document: {reqDoc.DocumentName}");
                        }
                        else if (daysUntilExpiration <= rule.ExpirationThresholdDays)
                        {
                            requirements.Add(new Requirement
                            {
                                Type = "Document",
                                Name = reqDoc.DocumentName,
                                Status = "Expiring Soon",
                                ExpirationDate = appDoc.ExpirationDate,
                                DaysUntilExpiration = daysUntilExpiration
                            });
                            hasExpiring = true;
                            recommendations.Add($"Document {reqDoc.DocumentName} expires in {daysUntilExpiration} days - consider renewal");
                        }
                        else
                        {
                            requirements.Add(new Requirement
                            {
                                Type = "Document",
                                Name = reqDoc.DocumentName,
                                Status = "Present & Valid",
                                ExpirationDate = appDoc.ExpirationDate,
                                DaysUntilExpiration = daysUntilExpiration
                            });
                        }
                    }
                    else
                    {
                        requirements.Add(new Requirement
                        {
                            Type = "Document",
                            Name = reqDoc.DocumentName,
                            Status = "Present & Valid"
                        });
                    }
                }

                // Evaluate data fields
                foreach (var reqField in rule.RequiredDataFields)
                {
                    var appField = payer.Requirements?.FirstOrDefault(r => 
                        r.Type == "DataField" && r.Name == reqField.FieldName);

                    if (appField == null || string.IsNullOrEmpty(appField.Value?.ToString()))
                    {
                        requirements.Add(new Requirement
                        {
                            Type = "DataField",
                            Name = reqField.FieldLabel,
                            Status = "Missing"
                        });
                        hasIncomplete = true;
                        recommendations.Add($"Provide required field: {reqField.FieldLabel}");
                    }
                    else
                    {
                        requirements.Add(new Requirement
                        {
                            Type = "DataField",
                            Name = reqField.FieldLabel,
                            Status = "Present & Valid",
                            Value = appField.Value
                        });
                    }
                }

                // Determine payer status
                string payerStatus;
                if (hasIncomplete)
                {
                    payerStatus = "Incomplete";
                }
                else if (hasExpiring)
                {
                    payerStatus = "Expiring Soon";
                }
                else
                {
                    payerStatus = "Ready to Submit";
                }

                payer.Status = payerStatus;
                payer.Requirements = requirements;
                payer.Recommendations = recommendations;
                evaluatedPayers.Add(payer);
            }

            application.Payers = evaluatedPayers;

            // Determine overall status (worst case)
            if (evaluatedPayers.Any(p => p.Status == "Incomplete"))
            {
                application.OverallStatus = "Incomplete";
            }
            else if (evaluatedPayers.Any(p => p.Status == "Expiring Soon"))
            {
                application.OverallStatus = "Expiring Soon";
            }
            else if (evaluatedPayers.All(p => p.Status == "Ready to Submit"))
            {
                application.OverallStatus = "Ready to Submit";
            }
            else
            {
                application.OverallStatus = "Unknown";
            }

            // Calculate priority score
            application.PriorityScore = CalculatePriorityScore(application);

            return application;
        }

        private int CalculatePriorityScore(Application application)
        {
            int score = 0;

            // Base score on status
            if (application.OverallStatus == "Incomplete")
                score += 50;
            else if (application.OverallStatus == "Expiring Soon")
                score += 70;
            else if (application.OverallStatus == "Ready to Submit")
                score += 30;

            // Add urgency based on expiration dates
            foreach (var payer in application.Payers)
            {
                var expiringReqs = payer.Requirements
                    .Where(r => r.DaysUntilExpiration.HasValue && r.DaysUntilExpiration.Value <= 30)
                    .ToList();

                if (expiringReqs.Any())
                {
                    var minDays = expiringReqs.Min(r => r.DaysUntilExpiration!.Value);
                    if (minDays <= 15)
                        score += 30;
                    else if (minDays <= 30)
                        score += 20;
                }
            }

            // Add weight for number of payers (high-volume)
            if (application.Payers.Count >= 3)
                score += 10;

            return Math.Min(score, 100);
        }
    }
}