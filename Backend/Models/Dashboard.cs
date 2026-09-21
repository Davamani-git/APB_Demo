namespace ProviderEnrollmentSystem.Models
{
    public class DashboardStats
    {
        public int Total { get; set; }
        public int ReadyToSubmit { get; set; }
        public int Incomplete { get; set; }
        public int ExpiringSoon { get; set; }
    }

    public class DrillDownData
    {
        public string GroupName { get; set; } = string.Empty;
        public int Count { get; set; }
        public List<string> ApplicationIds { get; set; } = new();
    }
}