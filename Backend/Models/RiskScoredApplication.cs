using System.Collections.Generic;

namespace Backend.Models
{
    public class RiskScoredApplication
    {
        public string Id { get; set; }
        public string ProviderName { get; set; }
        public int RiskScore { get; set; }
        public int PriorityScore { get; set; }
        public List RiskFactors { get; set; }
        public List PriorityFactors { get; set; }
        public string Status { get; set; }
        public string DueDate { get; set; }
    }
}