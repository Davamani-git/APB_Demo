namespace VK004Demo.Models
{
    public class RuleSet
    {
        public string Id { get; set; } = string.Empty;
        public string PayerName { get; set; } = string.Empty;
        public string PayerId { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public DateTime EffectiveDate { get; set; }
        public int ExpiringThreshold { get; set; } = 90;
        public List<string> RequiredDocuments { get; set; } = new List<string>();
        public List<string> RequiredFields { get; set; } = new List<string>();
        public string RuleDescription { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime LastUpdated { get; set; } = DateTime.Now;
    }
}