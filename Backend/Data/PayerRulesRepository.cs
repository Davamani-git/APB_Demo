using EnrollmentReadiness.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Data
{
    public class PayerRulesRepository : IPayerRulesRepository
    {
        private readonly string _filePath = "Backend/Data/payer-rules.json";
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
            var ruleSets = await GetAllAsync();
            return ruleSets.FirstOrDefault(r => r.Id == id);
        }

        public async Task AddAsync(PayerRuleSet ruleSet)
        {
            var ruleSets = (await GetAllAsync()).ToList();
            ruleSets.Add(ruleSet);
            await SaveAllAsync(ruleSets);
            return ruleSet;
        }

        public async Task UpdateAsync(PayerRuleSet ruleSet)
        {
            var ruleSets = (await GetAllAsync()).ToList();
            var index = ruleSets.FindIndex(r => r.Id == ruleSet.Id);
            
            if (index == -1)
            {
                return null;
            }

            ruleSets[index] = ruleSet;
            await SaveAllAsync(ruleSets);
            return ruleSet;
        }

        public async Task DeleteAsync(string id)
        {
            var ruleSets = (await GetAllAsync()).ToList();
            var ruleSet = ruleSets.FirstOrDefault(r => r.Id == id);
            
            if (ruleSet == null)
            {
                return false;
            }

            ruleSets.Remove(ruleSet);
            await SaveAllAsync(ruleSets);
            return true;
        }

        private async Task SaveAllAsync(List ruleSets)
        {
            var directory = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var json = JsonSerializer.Serialize(ruleSets, _jsonOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}