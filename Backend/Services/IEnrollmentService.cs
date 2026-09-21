using EnrollmentReadiness.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Services
{
    public interface IEnrollmentService
    {
        Task> GetAllApplicationsAsync();
        Task GetApplicationByIdAsync(string id);
        Task CreateApplicationAsync(EnrollmentApplication application);
        Task UpdateApplicationAsync(EnrollmentApplication application);
    }
}