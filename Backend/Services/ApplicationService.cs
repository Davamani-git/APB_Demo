using ProviderEnrollmentSystem.Data;
using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _repository;

        public ApplicationService(IApplicationRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Application>> GetAllApplicationsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Application?> GetApplicationByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Application> CreateApplicationAsync(Application application)
        {
            if (string.IsNullOrEmpty(application.Id))
            {
                application.Id = Guid.NewGuid().ToString();
            }
            application.ApplicationId = $"APP-{DateTime.Now:yyyyMMdd}-{application.Id.Substring(0, 6).ToUpper()}";
            return await _repository.CreateAsync(application);
        }

        public async Task<Application?> UpdateApplicationAsync(Application application)
        {
            return await _repository.UpdateAsync(application);
        }
    }
}