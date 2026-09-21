using HealthcareEnrollment.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Services
{
    public interface IApplicationService
    {
        Task<List<Application>> GetAllApplicationsAsync();
        Task<Application> GetApplicationByIdAsync(string id);
        Task<Application> CreateApplicationAsync(Application application);
        Task<Application> UpdateApplicationAsync(string id, Application application);
        Task DeleteApplicationAsync(string id);
    }
}