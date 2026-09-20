using System;
using System.Collections.Generic;

namespace ProviderEnrollment.Models
{
    public class ReadinessEvaluation
    {
        public string ApplicationId { get; set; }
        public DateTime EvaluationDate { get; set; }
        public string OverallStatus { get; set; }
        public int PriorityScore { get; set; }
        public int RiskScore { get; set; }
        public List<PayerEvaluation> PayerEvaluations { get; set; }
    }

    public class PayerEvaluation
    {
        public string PayerId { get; set; }
        public string PayerName { get; set; }
        public string Status { get; set; }
        public string RuleSetVersion { get; set; }
        public List<RequirementResult> RequirementResults { get; set; }
    }

    public class RequirementResult
    {
        public string RequirementName { get; set; }
        public string Status { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public string Recommendation { get; set; }
    }
}