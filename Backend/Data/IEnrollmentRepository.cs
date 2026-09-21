using EnrollmentReadiness.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Data
{
    public interface IEnrollmentRepository
    {
        Task> GetAllAsync();
        Task GetByIdAsync(string id);
        Task AddAsync(EnrollmentApplication application);
        Task UpdateAsync(EnrollmentApplication application);
    }
}