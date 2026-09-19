using VK004Demo.Models;

namespace VK004Demo.Services
{
    public interface IRuleSetService
    {
        Task<IEnumerable<RuleSet>> GetAllRuleSetsAsync();
        Task<RuleSet?> GetRuleSetByIdAsync(string id);
        Task<RuleSet?> GetActiveRuleSetForPayerAsync(string payerId);
        Task<RuleSet> CreateRuleSetAsync(RuleSet ruleSet);
        Task<RuleSet?> UpdateRuleSetAsync(RuleSet ruleSet);
        Task<bool> DeleteRuleSetAsync(string id);
    }
}