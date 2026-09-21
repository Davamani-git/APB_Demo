using System.Collections.Generic;

namespace EnrollmentReadiness.Models
{
    public class PayerRuleSet
    {
        public string Id { get; set; } = string.Empty;
        public string PayerName { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public string EffectiveDate { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List Requirements { get; set; } = new();
    }

    public class RuleRequirement
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool Mandatory { get; set; }
        public int? ExpirationThresholdDays { get; set; }
        public List? ValidationRules { get; set; }
    }

    public class PrebuiltRuleSet
    {
        public string Id { get; set; } = string.Empty;
        public string PayerName { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string LastUpdated { get; set; } = string.Empty;
        public bool IsActivated { get; set; }
        public List Requirements { get; set; } = new();
    }
}