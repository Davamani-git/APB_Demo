using System.Collections.Generic;

namespace Backend.Models
{
    public class DeficiencyGuidance
    {
        public string ApplicationId { get; set; }
        public string ProviderName { get; set; }
        public List Deficiencies { get; set; }
    }

    public class DeficiencyItem
    {
        public string RequirementId { get; set; }
        public string RequirementName { get; set; }
        public string DocumentName { get; set; }
        public string Status { get; set; }
        public string Deadline { get; set; }
        public string Urgency { get; set; }
        public string OutreachText { get; set; }
        public string PayerName { get; set; }
    }
}