using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Services
{
    public interface IApplicationService
    {
        Task<IEnumerable<Application>> GetAllApplicationsAsync();
        Task<Application?> GetApplicationByIdAsync(string id);
        Task<Application> CreateApplicationAsync(Application application);
        Task<Application?> UpdateApplicationAsync(Application application);
    }
}