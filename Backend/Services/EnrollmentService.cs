using EnrollmentReadiness.Data;
using EnrollmentReadiness.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _repository;

        public EnrollmentService(IEnrollmentRepository repository)
        {
            _repository = repository;
        }

        public async Task> GetAllApplicationsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task GetApplicationByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task CreateApplicationAsync(EnrollmentApplication application)
        {
            application.Id = Guid.NewGuid().ToString();
            application.CreatedDate = DateTime.UtcNow.ToString("yyyy-MM-dd");
            application.LastUpdated = DateTime.UtcNow.ToString("yyyy-MM-dd");
            return await _repository.AddAsync(application);
        }

        public async Task UpdateApplicationAsync(EnrollmentApplication application)
        {
            application.LastUpdated = DateTime.UtcNow.ToString("yyyy-MM-dd");
            return await _repository.UpdateAsync(application);
        }
    }
}