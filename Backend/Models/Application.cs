namespace ProviderEnrollmentSystem.Models
{
    public class Application
    {
        public string Id { get; set; } = string.Empty;
        public string ApplicationId { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty;
        public string Coordinator { get; set; } = string.Empty;
        public DateTime SubmissionDate { get; set; }
        public List<string> TargetPayers { get; set; } = new();
        public string OverallStatus { get; set; } = "Incomplete";
        public int PriorityScore { get; set; } = 0;
        public List<PayerRequirement> PayerRequirements { get; set; } = new();
        public List<Document> Documents { get; set; } = new();
        public List<DataField> DataFields { get; set; } = new();
    }

    public class PayerRequirement
    {
        public string PayerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public List<RequirementItem> Documents { get; set; } = new();
        public List<RequirementItem> DataFields { get; set; } = new();
    }

    public class RequirementItem
    {
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? ExpirationDate { get; set; }
        public string? Value { get; set; }
        public string? Recommendation { get; set; }
    }

    public class Document
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }

    public class DataField
    {
        public string Name { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public bool Required { get; set; }
    }
}