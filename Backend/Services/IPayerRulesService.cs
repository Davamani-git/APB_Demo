using EnrollmentReadiness.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Services
{
    public interface IPayerRulesService
    {
        Task> GetAllRuleSetsAsync();
        Task GetRuleSetByIdAsync(string id);
        Task CreateRuleSetAsync(PayerRuleSet ruleSet);
        Task UpdateRuleSetAsync(PayerRuleSet ruleSet);
        Task DeleteRuleSetAsync(string id);
    }
}