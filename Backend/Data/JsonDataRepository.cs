using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace VK004Demo.Data
{
    public class JsonDataRepository : IJsonDataRepository
    {
        private readonly string _dataPath;
        private readonly JsonSerializerOptions _jsonOptions;

        public JsonDataRepository(IConfiguration configuration)
        {
            _dataPath = configuration["DataPath"] ?? "Data";
            if (!Directory.Exists(_dataPath))
            {
                Directory.CreateDirectory(_dataPath);
            }

            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                WriteIndented = true
            };
        }

        public async Task<IEnumerable<T>> GetAllAsync<T>(string collectionName)
        {
            var filePath = Path.Combine(_dataPath, $"{collectionName}.json");
            
            if (!File.Exists(filePath))
            {
                return new List<T>();
            }

            try
            {
                var json = await File.ReadAllTextAsync(filePath);
                var items = JsonSerializer.Deserialize<List<T>>(json, _jsonOptions);
                return items ?? new List<T>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading {collectionName}: {ex.Message}");
                return new List<T>();
            }
        }

        public async Task SaveAllAsync<T>(string collectionName, IEnumerable<T> items)
        {
            var filePath = Path.Combine(_dataPath, $"{collectionName}.json");
            
            try
            {
                var json = JsonSerializer.Serialize(items, _jsonOptions);
                await File.WriteAllTextAsync(filePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error writing {collectionName}: {ex.Message}");
                throw;
            }
        }
    }
}