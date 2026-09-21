using EnrollmentReadiness.Data;
using EnrollmentReadiness.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Services
{
    public class PayerRulesService : IPayerRulesService
    {
        private readonly IPayerRulesRepository _repository;

        public PayerRulesService(IPayerRulesRepository repository)
        {
            _repository = repository;
        }

        public async Task> GetAllRuleSetsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task GetRuleSetByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task CreateRuleSetAsync(PayerRuleSet ruleSet)
        {
            ruleSet.Id = Guid.NewGuid().ToString();
            return await _repository.AddAsync(ruleSet);
        }

        public async Task UpdateRuleSetAsync(PayerRuleSet ruleSet)
        {
            return await _repository.UpdateAsync(ruleSet);
        }

        public async Task DeleteRuleSetAsync(string id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}