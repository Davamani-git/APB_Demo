using ProviderEnrollment.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ProviderEnrollment.Data
{
    public interface IRuleSetRepository
    {
        Task<IEnumerable<RuleSet>> GetAllAsync();
        Task<RuleSet> GetByIdAsync(string id);
        Task<RuleSet> CreateAsync(RuleSet ruleSet);
        Task<RuleSet> UpdateAsync(RuleSet ruleSet);
        Task<bool> DeleteAsync(string id);
    }

    public class RuleSetRepository : IRuleSetRepository
    {
        private readonly string _filePath = "Data/rulesets.json";
        private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions { WriteIndented = true };

        public async Task<IEnumerable<RuleSet>> GetAllAsync()
        {
            if (!File.Exists(_filePath))
            {
                return new List<RuleSet>();
            }

            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize<List<RuleSet>>(json) ?? new List<RuleSet>();
        }

        public async Task<RuleSet> GetByIdAsync(string id)
        {
            var ruleSets = await GetAllAsync();
            return ruleSets.FirstOrDefault(rs => rs.Id == id);
        }

        public async Task<RuleSet> CreateAsync(RuleSet ruleSet)
        {
            var ruleSets = (await GetAllAsync()).ToList();
            ruleSets.Add(ruleSet);
            await SaveAllAsync(ruleSets);
            return ruleSet;
        }

        public async Task<RuleSet> UpdateAsync(RuleSet ruleSet)
        {
            var ruleSets = (await GetAllAsync()).ToList();
            var index = ruleSets.FindIndex(rs => rs.Id == ruleSet.Id);
            if (index == -1) return null;

            ruleSets[index] = ruleSet;
            await SaveAllAsync(ruleSets);
            return ruleSet;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var ruleSets = (await GetAllAsync()).ToList();
            var ruleSet = ruleSets.FirstOrDefault(rs => rs.Id == id);
            if (ruleSet == null) return false;

            ruleSets.Remove(ruleSet);
            await SaveAllAsync(ruleSets);
            return true;
        }

        private async Task SaveAllAsync(List<RuleSet> ruleSets)
        {
            var directory = Path.GetDirectoryName(_filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var json = JsonSerializer.Serialize(ruleSets, _jsonOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}