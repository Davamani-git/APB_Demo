using HealthcareEnrollment.Models;
using HealthcareEnrollment.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IJsonDataRepository _repository;
        private const string ApplicationsFile = "applications.json";

        public ApplicationService(IJsonDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Application>> GetAllApplicationsAsync()
        {
            return await _repository.ReadAsync<Application>(ApplicationsFile);
        }

        public async Task<Application> GetApplicationByIdAsync(string id)
        {
            var applications = await GetAllApplicationsAsync();
            return applications.FirstOrDefault(a => a.Id == id);
        }

        public async Task<Application> CreateApplicationAsync(Application application)
        {
            var applications = await GetAllApplicationsAsync();
            applications.Add(application);
            await _repository.WriteAsync(ApplicationsFile, applications);
            return application;
        }

        public async Task<Application> UpdateApplicationAsync(string id, Application application)
        {
            var applications = await GetAllApplicationsAsync();
            var index = applications.FindIndex(a => a.Id == id);
            
            if (index >= 0)
            {
                applications[index] = application;
                await _repository.WriteAsync(ApplicationsFile, applications);
            }
            
            return application;
        }

        public async Task DeleteApplicationAsync(string id)
        {
            var applications = await GetAllApplicationsAsync();
            applications.RemoveAll(a => a.Id == id);
            await _repository.WriteAsync(ApplicationsFile, applications);
        }
    }
}