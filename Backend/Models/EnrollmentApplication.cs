using System.Collections.Generic;

namespace EnrollmentReadiness.Models
{
    public class EnrollmentApplication
    {
        public string Id { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty;
        public string OverallStatus { get; set; } = string.Empty;
        public string Priority { get; set; } = "Medium";
        public List TargetPayers { get; set; } = new();
        public int DaysUntilExpiration { get; set; }
        public List PayerRequirements { get; set; } = new();
        public string CreatedDate { get; set; } = string.Empty;
        public string LastUpdated { get; set; } = string.Empty;
    }

    public class PayerRequirement
    {
        public string PayerName { get; set; } = string.Empty;
        public string PayerStatus { get; set; } = string.Empty;
        public List Requirements { get; set; } = new();
        public List? Deficiencies { get; set; }
    }

    public class Requirement
    {
        public string RequirementName { get; set; } = string.Empty;
        public string RequirementType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? ExpirationDate { get; set; }
        public string Details { get; set; } = string.Empty;
    }

    public class RequirementDeficiency
    {
        public string RequirementName { get; set; } = string.Empty;
        public string Issue { get; set; } = string.Empty;
        public string? ExpirationDate { get; set; }
        public List OutreachRecommendations { get; set; } = new();
    }
}