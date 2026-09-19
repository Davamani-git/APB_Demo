namespace VK004Demo.Services
{
    public interface IDashboardService
    {
        Task<object> GetManagerDashboardAsync();
        Task<object> GetCoordinatorDashboardAsync(string coordinatorId);
    }
}