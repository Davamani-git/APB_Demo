using Backend.Data;
using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IDataRepository _dataRepository;

        public ApplicationService(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        public async Task> GetAllApplicationsAsync()
        {
            return await _dataRepository.GetApplicationsAsync();
        }

        public async Task GetApplicationByIdAsync(string id)
        {
            var applications = await _dataRepository.GetApplicationsAsync();
            return applications.FirstOrDefault(a => a.Id == id);
        }

        public async Task CreateApplicationAsync(Application application)
        {
            application.Id = "APP-" + Guid.NewGuid().ToString();
            application.CreatedDate = DateTime.UtcNow.ToString("o");
            application.LastUpdated = DateTime.UtcNow.ToString("o");
            application.Status = "Incomplete";
            application.ReadinessScore = 0;
            
            var applications = (await _dataRepository.GetApplicationsAsync()).ToList();
            applications.Add(application);
            await _dataRepository.SaveApplicationsAsync(applications);
            
            return application;
        }

        public async Task UpdateApplicationAsync(string id, Application application)
        {
            var applications = (await _dataRepository.GetApplicationsAsync()).ToList();
            var existing = applications.FirstOrDefault(a => a.Id == id);
            
            if (existing == null)
                return null;
            
            application.Id = id;
            application.LastUpdated = DateTime.UtcNow.ToString("o");
            
            var index = applications.IndexOf(existing);
            applications[index] = application;
            
            await _dataRepository.SaveApplicationsAsync(applications);
            return application;
        }

        public async Task AddDocumentAsync(string applicationId, Document document)
        {
            var applications = (await _dataRepository.GetApplicationsAsync()).ToList();
            var application = applications.FirstOrDefault(a => a.Id == applicationId);
            
            if (application == null)
                return false;
            
            if (application.Documents == null)
                application.Documents = new List();
            
            application.Documents.Add(document);
            application.LastUpdated = DateTime.UtcNow.ToString("o");
            
            await _dataRepository.SaveApplicationsAsync(applications);
            return true;
        }

        public async Task DeleteDocumentAsync(string applicationId, string documentId)
        {
            var applications = (await _dataRepository.GetApplicationsAsync()).ToList();
            var application = applications.FirstOrDefault(a => a.Id == applicationId);
            
            if (application == null || application.Documents == null)
                return false;
            
            var document = application.Documents.FirstOrDefault(d => d.DocumentId == documentId);
            if (document == null)
                return false;
            
            application.Documents.Remove(document);
            application.LastUpdated = DateTime.UtcNow.ToString("o");
            
            await _dataRepository.SaveApplicationsAsync(applications);
            return true;
        }
    }
}