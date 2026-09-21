using System.Collections.Generic;

namespace Backend.Models
{
    public class DashboardStats
    {
        public int TotalApplications { get; set; }
        public int ReadyApplications { get; set; }
        public int PendingApplications { get; set; }
        public int IncompleteApplications { get; set; }
        public Dictionary ByCoordinator { get; set; }
        public Dictionary ByPayer { get; set; }
    }
}