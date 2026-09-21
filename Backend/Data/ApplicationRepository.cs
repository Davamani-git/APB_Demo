using System.Text.Json;
using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Data
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly string _filePath = "Backend/Data/applications.json";
        private readonly JsonSerializerOptions _jsonOptions;

        public ApplicationRepository()
        {
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                WriteIndented = true
            };
            EnsureFileExists();
        }

        private void EnsureFileExists()
        {
            if (!File.Exists(_filePath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(_filePath)!);
                File.WriteAllText(_filePath, "[]");
            }
        }

        public async Task<IEnumerable<Application>> GetAllAsync()
        {
            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize<List<Application>>(json, _jsonOptions) ?? new List<Application>();
        }

        public async Task<Application?> GetByIdAsync(string id)
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

        public async Task<Application?> UpdateAsync(Application application)
        {
            var applications = (await GetAllAsync()).ToList();
            var index = applications.FindIndex(a => a.Id == application.Id);
            if (index == -1) return null;

            applications[index] = application;
            await SaveAllAsync(applications);
            return application;
        }

        private async Task SaveAllAsync(List<Application> applications)
        {
            var json = JsonSerializer.Serialize(applications, _jsonOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}