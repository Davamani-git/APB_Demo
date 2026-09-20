using System.Collections.Generic;

namespace ProviderEnrollment.Models
{
    public class DashboardStats
    {
        public int TotalApplications { get; set; }
        public List<StatusCount> ByStatus { get; set; }
        public List<CoordinatorCount> ByCoordinator { get; set; }
        public List<PayerCount> ByPayer { get; set; }
        public List<HighPriorityApp> HighPriorityApplications { get; set; }
    }

    public class StatusCount
    {
        public string Status { get; set; }
        public int Count { get; set; }
    }

    public class CoordinatorCount
    {
        public string CoordinatorName { get; set; }
        public int Count { get; set; }
    }

    public class PayerCount
    {
        public string PayerName { get; set; }
        public int Count { get; set; }
    }

    public class HighPriorityApp
    {
        public string Id { get; set; }
        public string ProviderName { get; set; }
        public int PriorityScore { get; set; }
        public string Status { get; set; }
    }
}