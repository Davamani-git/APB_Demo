using VK004Demo.Models;

namespace VK004Demo.Services
{
    public interface IApplicationService
    {
        Task<IEnumerable<Application>> GetAllApplicationsAsync();
        Task<Application?> GetApplicationByIdAsync(string id);
        Task<ApplicationDetails?> GetApplicationDetailsAsync(string id);
        Task<Application> CreateApplicationAsync(Application application);
        Task<Application?> UpdateApplicationAsync(Application application);
        Task<bool> DeleteApplicationAsync(string id);
    }
}