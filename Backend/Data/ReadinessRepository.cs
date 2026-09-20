using ProviderEnrollment.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ProviderEnrollment.Data
{
    public interface IReadinessRepository
    {
        Task<IEnumerable<ReadinessEvaluation>> GetAllAsync();
        Task<IEnumerable<ReadinessEvaluation>> GetByApplicationIdAsync(string applicationId);
        Task<ReadinessEvaluation> CreateAsync(ReadinessEvaluation evaluation);
    }

    public class ReadinessRepository : IReadinessRepository
    {
        private readonly string _filePath = "Data/evaluations.json";
        private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions { WriteIndented = true };

        public async Task<IEnumerable<ReadinessEvaluation>> GetAllAsync()
        {
            if (!File.Exists(_filePath))
            {
                return new List<ReadinessEvaluation>();
            }

            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize<List<ReadinessEvaluation>>(json) ?? new List<ReadinessEvaluation>();
        }

        public async Task<IEnumerable<ReadinessEvaluation>> GetByApplicationIdAsync(string applicationId)
        {
            var evaluations = await GetAllAsync();
            return evaluations.Where(e => e.ApplicationId == applicationId).OrderByDescending(e => e.EvaluationDate);
        }

        public async Task<ReadinessEvaluation> CreateAsync(ReadinessEvaluation evaluation)
        {
            var evaluations = (await GetAllAsync()).ToList();
            evaluations.Add(evaluation);
            await SaveAllAsync(evaluations);
            return evaluation;
        }

        private async Task SaveAllAsync(List<ReadinessEvaluation> evaluations)
        {
            var directory = Path.GetDirectoryName(_filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var json = JsonSerializer.Serialize(evaluations, _jsonOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}