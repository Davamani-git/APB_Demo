using System.Text.Json;
using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Data
{
    public class PayerRuleRepository : IPayerRuleRepository
    {
        private readonly string _filePath = "Backend/Data/payer-rules.json";
        private readonly JsonSerializerOptions _jsonOptions;

        public PayerRuleRepository()
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

        public async Task<IEnumerable<PayerRule>> GetAllAsync()
        {
            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize<List<PayerRule>>(json, _jsonOptions) ?? new List<PayerRule>();
        }

        public async Task<PayerRule?> GetByIdAsync(string id)
        {
            var rules = await GetAllAsync();
            return rules.FirstOrDefault(r => r.Id == id);
        }

        public async Task<PayerRule> CreateAsync(PayerRule rule)
        {
            var rules = (await GetAllAsync()).ToList();
            rules.Add(rule);
            await SaveAllAsync(rules);
            return rule;
        }

        public async Task<PayerRule?> UpdateAsync(PayerRule rule)
        {
            var rules = (await GetAllAsync()).ToList();
            var index = rules.FindIndex(r => r.Id == rule.Id);
            if (index == -1) return null;

            rules[index] = rule;
            await SaveAllAsync(rules);
            return rule;
        }

        private async Task SaveAllAsync(List<PayerRule> rules)
        {
            var json = JsonSerializer.Serialize(rules, _jsonOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}