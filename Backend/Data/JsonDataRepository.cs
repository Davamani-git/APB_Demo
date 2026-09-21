using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Data
{
    public class JsonDataRepository : IJsonDataRepository
    {
        private readonly string _dataPath;
        private readonly JsonSerializerOptions _jsonOptions;

        public JsonDataRepository()
        {
            _dataPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "JsonFiles");
            
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

        public async Task<List<T>> ReadAsync<T>(string fileName)
        {
            var filePath = Path.Combine(_dataPath, fileName);
            
            if (!File.Exists(filePath))
            {
                return new List<T>();
            }

            try
            {
                var json = await File.ReadAllTextAsync(filePath);
                var data = JsonSerializer.Deserialize<List<T>>(json, _jsonOptions);
                return data ?? new List<T>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading {fileName}: {ex.Message}");
                return new List<T>();
            }
        }

        public async Task WriteAsync<T>(string fileName, List<T> data)
        {
            var filePath = Path.Combine(_dataPath, fileName);
            
            try
            {
                var json = JsonSerializer.Serialize(data, _jsonOptions);
                await File.WriteAllTextAsync(filePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error writing {fileName}: {ex.Message}");
                throw;
            }
        }
    }
}