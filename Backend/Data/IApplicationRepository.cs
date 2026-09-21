using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Data
{
    public interface IApplicationRepository
    {
        Task<IEnumerable<Application>> GetAllAsync();
        Task<Application?> GetByIdAsync(string id);
        Task<Application> CreateAsync(Application application);
        Task<Application?> UpdateAsync(Application application);
    }
}