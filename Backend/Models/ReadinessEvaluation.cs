using System.Collections.Generic;

namespace Backend.Models
{
    public class ReadinessEvaluation
    {
        public string ApplicationId { get; set; }
        public string ProviderName { get; set; }
        public string OverallReadiness { get; set; }
        public int OverallScore { get; set; }
        public string EvaluationDate { get; set; }
        public string RuleSetVersion { get; set; }
        public List PayerEvaluations { get; set; }
    }

    public class PayerEvaluation
    {
        public string PayerId { get; set; }
        public string PayerName { get; set; }
        public string ReadinessStatus { get; set; }
        public int ReadinessScore { get; set; }
        public string RuleSetVersion { get; set; }
        public List RequirementResults { get; set; }
    }

    public class RequirementResult
    {
        public string RequirementId { get; set; }
        public string RequirementName { get; set; }
        public string Status { get; set; }
        public string Result { get; set; }
        public string Notes { get; set; }
    }
}