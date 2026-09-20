using ProviderEnrollment.Data;
using ProviderEnrollment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProviderEnrollment.Services
{
    public interface IRuleSetService
    {
        Task<IEnumerable<RuleSet>> GetAllRuleSetsAsync();
        Task<RuleSet> GetRuleSetByIdAsync(string id);
        Task<RuleSet> GetEffectiveRuleSetAsync(string payerId, DateTime submissionDate);
        Task<RuleSet> CreateRuleSetAsync(RuleSet ruleSet);
        Task<RuleSet> UpdateRuleSetAsync(RuleSet ruleSet);
        Task<bool> DeleteRuleSetAsync(string id);
    }

    public class RuleSetService : IRuleSetService
    {
        private readonly IRuleSetRepository _repository;

        public RuleSetService(IRuleSetRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<RuleSet>> GetAllRuleSetsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<RuleSet> GetRuleSetByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<RuleSet> GetEffectiveRuleSetAsync(string payerId, DateTime submissionDate)
        {
            var ruleSets = await _repository.GetAllAsync();
            return ruleSets
                .Where(rs => rs.PayerId == payerId && 
                            rs.EffectiveDate <= submissionDate && 
                            (rs.EndDate == null || rs.EndDate >= submissionDate))
                .OrderByDescending(rs => rs.EffectiveDate)
                .FirstOrDefault();
        }

        public async Task<RuleSet> CreateRuleSetAsync(RuleSet ruleSet)
        {
            ruleSet.LastModified = DateTime.UtcNow;
            return await _repository.CreateAsync(ruleSet);
        }

        public async Task<RuleSet> UpdateRuleSetAsync(RuleSet ruleSet)
        {
            ruleSet.LastModified = DateTime.UtcNow;
            return await _repository.UpdateAsync(ruleSet);
        }

        public async Task<bool> DeleteRuleSetAsync(string id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}