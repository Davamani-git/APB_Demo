using EnrollmentReadiness.Data;
using EnrollmentReadiness.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Services
{
    public class PrebuiltRulesService : IPrebuiltRulesService
    {
        private readonly IPrebuiltRulesRepository _repository;

        public PrebuiltRulesService(IPrebuiltRulesRepository repository)
        {
            _repository = repository;
        }

        public async Task> GetAllPrebuiltRuleSetsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task ActivateRuleSetAsync(string id, bool activate)
        {
            var ruleSet = await _repository.GetByIdAsync(id);
            if (ruleSet == null)
            {
                return false;
            }

            ruleSet.IsActivated = activate;
            await _repository.UpdateAsync(ruleSet);
            return true;
        }
    }
}