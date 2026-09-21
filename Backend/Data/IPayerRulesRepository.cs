using EnrollmentReadiness.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Data
{
    public interface IPayerRulesRepository
    {
        Task> GetAllAsync();
        Task GetByIdAsync(string id);
        Task AddAsync(PayerRuleSet ruleSet);
        Task UpdateAsync(PayerRuleSet ruleSet);
        Task DeleteAsync(string id);
    }
}