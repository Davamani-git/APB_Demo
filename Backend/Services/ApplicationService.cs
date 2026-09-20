using ProviderEnrollment.Data;
using ProviderEnrollment.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProviderEnrollment.Services
{
    public interface IApplicationService
    {
        Task<IEnumerable<Application>> GetAllApplicationsAsync();
        Task<Application> GetApplicationByIdAsync(string id);
        Task<Application> CreateApplicationAsync(Application application);
        Task<Application> UpdateApplicationAsync(Application application);
        Task<bool> DeleteApplicationAsync(string id);
    }

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

        public async Task<Application> GetApplicationByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Application> CreateApplicationAsync(Application application)
        {
            return await _repository.CreateAsync(application);
        }

        public async Task<Application> UpdateApplicationAsync(Application application)
        {
            return await _repository.UpdateAsync(application);
        }

        public async Task<bool> DeleteApplicationAsync(string id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}