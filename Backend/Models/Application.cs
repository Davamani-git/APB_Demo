using System.Collections.Generic;

namespace HealthcareEnrollment.Models
{
    public class Application
    {
        public string Id { get; set; } = string.Empty;
        public string ProviderId { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty;
        public string CoordinatorId { get; set; } = string.Empty;
        public string CoordinatorName { get; set; } = string.Empty;
        public string OverallStatus { get; set; } = string.Empty;
        public int PriorityScore { get; set; }
        public string SubmissionDate { get; set; } = string.Empty;
        public string LastUpdated { get; set; } = string.Empty;
        public List<PayerStatus> Payers { get; set; } = new List<PayerStatus>();
    }

    public class PayerStatus
    {
        public string PayerId { get; set; } = string.Empty;
        public string PayerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public List<Requirement> Requirements { get; set; } = new List<Requirement>();
        public List<string> Recommendations { get; set; } = new List<string>();
    }

    public class Requirement
    {
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? ExpirationDate { get; set; }
        public int? DaysUntilExpiration { get; set; }
        public object? Value { get; set; }
    }
}