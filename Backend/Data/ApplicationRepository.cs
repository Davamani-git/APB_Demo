using ProviderEnrollment.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ProviderEnrollment.Data
{
    public interface IApplicationRepository
    {
        Task<IEnumerable<Application>> GetAllAsync();
        Task<Application> GetByIdAsync(string id);
        Task<Application> CreateAsync(Application application);
        Task<Application> UpdateAsync(Application application);
        Task<bool> DeleteAsync(string id);
    }

    public class ApplicationRepository : IApplicationRepository
    {
        private readonly string _filePath = "Data/applications.json";
        private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions { WriteIndented = true };

        public async Task<IEnumerable<Application>> GetAllAsync()
        {
            if (!File.Exists(_filePath))
            {
                return new List<Application>();
            }

            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize<List<Application>>(json) ?? new List<Application>();
        }

        public async Task<Application> GetByIdAsync(string id)
        {
            var applications = await GetAllAsync();
            return applications.FirstOrDefault(a => a.Id == id);
        }

        public async Task<Application> CreateAsync(Application application)
        {
            var applications = (await GetAllAsync()).ToList();
            applications.Add(application);
            await SaveAllAsync(applications);
            return application;
        }

        public async Task<Application> UpdateAsync(Application application)
        {
            var applications = (await GetAllAsync()).ToList();
            var index = applications.FindIndex(a => a.Id == application.Id);
            if (index == -1) return null;

            applications[index] = application;
            await SaveAllAsync(applications);
            return application;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var applications = (await GetAllAsync()).ToList();
            var application = applications.FirstOrDefault(a => a.Id == id);
            if (application == null) return false;

            applications.Remove(application);
            await SaveAllAsync(applications);
            return true;
        }

        private async Task SaveAllAsync(List<Application> applications)
        {
            var directory = Path.GetDirectoryName(_filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var json = JsonSerializer.Serialize(applications, _jsonOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}