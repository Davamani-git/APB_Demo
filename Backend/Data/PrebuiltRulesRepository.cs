using EnrollmentReadiness.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Data
{
    public class PrebuiltRulesRepository : IPrebuiltRulesRepository
    {
        private readonly string _filePath = "Backend/Data/prebuilt-rules.json";
        private readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            WriteIndented = true
        };

        public async Task> GetAllAsync()
        {
            if (!File.Exists(_filePath))
            {
                return GetDefaultPrebuiltRules();
            }

            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize>(json, _jsonOptions) 
                   ?? GetDefaultPrebuiltRules();
        }

        public async Task GetByIdAsync(string id)
        {
            var ruleSets = await GetAllAsync();
            return ruleSets.FirstOrDefault(r => r.Id == id);
        }

        public async Task UpdateAsync(PrebuiltRuleSet ruleSet)
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

        private List GetDefaultPrebuiltRules()
        {
            return new List
            {
                new PrebuiltRuleSet
                {
                    Id = "prebuilt-1",
                    PayerName = "Medicare",
                    Version = "1.0",
                    Description = "Standard Medicare enrollment requirements",
                    LastUpdated = "2024-01-01",
                    IsActivated = false,
                    Requirements = new List
                    {
                        new RuleRequirement { Name = "Medical License", Type = "Document", Mandatory = true, ExpirationThresholdDays = 30 },
                        new RuleRequirement { Name = "DEA Certificate", Type = "Document", Mandatory = true, ExpirationThresholdDays = 30 },
                        new RuleRequirement { Name = "Malpractice Insurance", Type = "Document", Mandatory = true, ExpirationThresholdDays = 30 },
                        new RuleRequirement { Name = "NPI Number", Type = "Data", Mandatory = true }
                    }
                },
                new PrebuiltRuleSet
                {
                    Id = "prebuilt-2",
                    PayerName = "Blue Cross Blue Shield",
                    Version = "1.0",
                    Description = "BCBS network enrollment requirements",
                    LastUpdated = "2024-01-01",
                    IsActivated = false,
                    Requirements = new List
                    {
                        new RuleRequirement { Name = "Medical License", Type = "Document", Mandatory = true, ExpirationThresholdDays = 30 },
                        new RuleRequirement { Name = "Board Certification", Type = "Document", Mandatory = true, ExpirationThresholdDays = 30 },
                        new RuleRequirement { Name = "Malpractice Insurance", Type = "Document", Mandatory = true, ExpirationThresholdDays = 30 },
                        new RuleRequirement { Name = "Hospital Privileges", Type = "Document", Mandatory = false }
                    }
                },
                new PrebuiltRuleSet
                {
                    Id = "prebuilt-3",
                    PayerName = "Aetna",
                    Version = "1.0",
                    Description = "Aetna provider network requirements",
                    LastUpdated = "2024-01-01",
                    IsActivated = false,
                    Requirements = new List
                    {
                        new RuleRequirement { Name = "Medical License", Type = "Document", Mandatory = true, ExpirationThresholdDays = 30 },
                        new RuleRequirement { Name = "DEA Certificate", Type = "Document", Mandatory = true, ExpirationThresholdDays = 30 },
                        new RuleRequirement { Name = "Professional Liability Insurance", Type = "Document", Mandatory = true, ExpirationThresholdDays = 30 },
                        new RuleRequirement { Name = "CV/Resume", Type = "Document", Mandatory = true }
                    }
                }
            };
        }
    }
}