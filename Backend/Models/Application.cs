using System;
using System.Collections.Generic;

namespace ProviderEnrollment.Models
{
    public class Application
    {
        public string Id { get; set; }
        public string ProviderName { get; set; }
        public DateTime SubmissionDate { get; set; }
        public string OverallStatus { get; set; }
        public int PriorityScore { get; set; }
        public int RiskScore { get; set; }
        public string CoordinatorName { get; set; }
        public List<PayerStatus> Payers { get; set; }
    }

    public class PayerStatus
    {
        public string PayerId { get; set; }
        public string PayerName { get; set; }
        public string Status { get; set; }
        public string RuleSetVersion { get; set; }
        public List<Requirement> Requirements { get; set; }
    }

    public class Requirement
    {
        public string Name { get; set; }
        public string Status { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public string Recommendation { get; set; }
    }
}