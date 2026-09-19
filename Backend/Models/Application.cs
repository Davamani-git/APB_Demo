namespace VK004Demo.Models
{
    public class Application
    {
        public string Id { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public string ReadinessStatus { get; set; } = "Incomplete";
        public List<string> Payers { get; set; } = new List<string>();
        public string CoordinatorId { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime LastUpdated { get; set; } = DateTime.Now;
    }

    public class ApplicationDetails
    {
        public string Id { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public string ReadinessStatus { get; set; } = string.Empty;
        public List<PayerStatus> Payers { get; set; } = new List<PayerStatus>();
    }

    public class PayerStatus
    {
        public string PayerId { get; set; } = string.Empty;
        public string PayerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public List<RequirementStatus> Requirements { get; set; } = new List<RequirementStatus>();
    }

    public class RequirementStatus
    {
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
    }
}