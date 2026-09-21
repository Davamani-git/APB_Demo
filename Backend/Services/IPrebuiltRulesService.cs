using EnrollmentReadiness.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Services
{
    public interface IPrebuiltRulesService
    {
        Task> GetAllPrebuiltRuleSetsAsync();
        Task ActivateRuleSetAsync(string id, bool activate);
    }
}