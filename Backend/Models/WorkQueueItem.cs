using System.Collections.Generic;

namespace Backend.Models
{
    public class WorkQueueItem
    {
        public string Id { get; set; }
        public string ProviderName { get; set; }
        public string Status { get; set; }
        public int ReadinessScore { get; set; }
        public int RiskScore { get; set; }
        public int PriorityScore { get; set; }
        public List Payers { get; set; }
        public string Coordinator { get; set; }
        public string DueDate { get; set; }
    }
}