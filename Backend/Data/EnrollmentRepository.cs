using EnrollmentReadiness.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Data
{
    public class EnrollmentRepository : IEnrollmentRepository
    {
        private readonly string _filePath = "Backend/Data/enrollment-applications.json";
        private readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            WriteIndented = true
        };

        public async Task> GetAllAsync()
        {
            if (!File.Exists(_filePath))
            {
                return new List();
            }

            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize>(json, _jsonOptions) 
                   ?? new List();
        }

        public async Task GetByIdAsync(string id)
        {
            var applications = await GetAllAsync();
            return applications.FirstOrDefault(a => a.Id == id);
        }

        public async Task AddAsync(EnrollmentApplication application)
        {
            var applications = (await GetAllAsync()).ToList();
            applications.Add(application);
            await SaveAllAsync(applications);
            return application;
        }

        public async Task UpdateAsync(EnrollmentApplication application)
        {
            var applications = (await GetAllAsync()).ToList();
            var index = applications.FindIndex(a => a.Id == application.Id);
            
            if (index == -1)
            {
                return null;
            }

            applications[index] = application;
            await SaveAllAsync(applications);
            return application;
        }

        private async Task SaveAllAsync(List applications)
        {
            var directory = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var json = JsonSerializer.Serialize(applications, _jsonOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}