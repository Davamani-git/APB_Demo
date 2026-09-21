namespace ProviderEnrollmentSystem.Models
{
    public class PayerRule
    {
        public string Id { get; set; } = string.Empty;
        public string PayerName { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public DateTime EffectiveDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; } = true;
        public List<string> RequiredDocuments { get; set; } = new();
        public List<string> RequiredDataFields { get; set; } = new();
        public int ExpirationThreshold { get; set; } = 90;
    }
}