using EnrollmentReadiness.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Data
{
    public interface IPrebuiltRulesRepository
    {
        Task> GetAllAsync();
        Task GetByIdAsync(string id);
        Task UpdateAsync(PrebuiltRuleSet ruleSet);
    }
}