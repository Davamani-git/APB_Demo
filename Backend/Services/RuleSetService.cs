using VK004Demo.Models;
using VK004Demo.Data;

namespace VK004Demo.Services
{
    public class RuleSetService : IRuleSetService
    {
        private readonly IJsonDataRepository _repository;

        public RuleSetService(IJsonDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<RuleSet>> GetAllRuleSetsAsync()
        {
            return await _repository.GetAllAsync<RuleSet>("rulesets");
        }

        public async Task<RuleSet?> GetRuleSetByIdAsync(string id)
        {
            var ruleSets = await _repository.GetAllAsync<RuleSet>("rulesets");
            return ruleSets.FirstOrDefault(r => r.Id == id);
        }

        public async Task<RuleSet?> GetActiveRuleSetForPayerAsync(string payerId)
        {
            var ruleSets = await _repository.GetAllAsync<RuleSet>("rulesets");
            return ruleSets
                .Where(r => r.PayerId == payerId && r.EffectiveDate <= DateTime.Now)
                .OrderByDescending(r => r.EffectiveDate)
                .FirstOrDefault();
        }

        public async Task<RuleSet> CreateRuleSetAsync(RuleSet ruleSet)
        {
            var ruleSets = (await _repository.GetAllAsync<RuleSet>("rulesets")).ToList();
            ruleSets.Add(ruleSet);
            await _repository.SaveAllAsync("rulesets", ruleSets);
            return ruleSet;
        }

        public async Task<RuleSet?> UpdateRuleSetAsync(RuleSet ruleSet)
        {
            var ruleSets = (await _repository.GetAllAsync<RuleSet>("rulesets")).ToList();
            var index = ruleSets.FindIndex(r => r.Id == ruleSet.Id);
            if (index == -1) return null;

            ruleSets[index] = ruleSet;
            await _repository.SaveAllAsync("rulesets", ruleSets);
            return ruleSet;
        }

        public async Task<bool> DeleteRuleSetAsync(string id)
        {
            var ruleSets = (await _repository.GetAllAsync<RuleSet>("rulesets")).ToList();
            var ruleSet = ruleSets.FirstOrDefault(r => r.Id == id);
            if (ruleSet == null) return false;

            ruleSets.Remove(ruleSet);
            await _repository.SaveAllAsync("rulesets", ruleSets);
            return true;
        }
    }
}