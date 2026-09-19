namespace VK004Demo.Models
{
    public class ReadinessEvaluation
    {
        public string ApplicationId { get; set; } = string.Empty;
        public DateTime EvaluationDate { get; set; }
        public string OverallStatus { get; set; } = string.Empty;
        public List<PayerEvaluation> PayerEvaluations { get; set; } = new List<PayerEvaluation>();
    }

    public class PayerEvaluation
    {
        public string PayerId { get; set; } = string.Empty;
        public string PayerName { get; set; } = string.Empty;
        public string RuleSetVersion { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public List<RequirementEvaluation> RequirementEvaluations { get; set; } = new List<RequirementEvaluation>();
    }

    public class RequirementEvaluation
    {
        public string RequirementName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string RuleApplied { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;
    }

    public class ReadinessExplanation
    {
        public string ApplicationId { get; set; } = string.Empty;
        public string PayerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string RuleSetVersion { get; set; } = string.Empty;
        public DateTime RuleSetEffectiveDate { get; set; }
        public DateTime EvaluationDate { get; set; }
        public string Explanation { get; set; } = string.Empty;
        public List<RequirementExplanation> Requirements { get; set; } = new List<RequirementExplanation>();
        public List<string> Recommendations { get; set; } = new List<string>();
    }

    public class RequirementExplanation
    {
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string RuleApplied { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;
    }
}