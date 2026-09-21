using HealthcareEnrollment.Models;
using HealthcareEnrollment.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Services
{
    public class PayerRuleService : IPayerRuleService
    {
        private readonly IJsonDataRepository _repository;
        private const string PayerRulesFile = "payer-rules.json";

        public PayerRuleService(IJsonDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<PayerRule>> GetAllPayerRulesAsync()
        {
            return await _repository.ReadAsync<PayerRule>(PayerRulesFile);
        }

        public async Task<PayerRule> GetPayerRuleByIdAsync(string id)
        {
            var rules = await GetAllPayerRulesAsync();
            return rules.FirstOrDefault(r => r.Id == id);
        }

        public async Task<PayerRule> GetPayerRuleByPayerIdAsync(string payerId, string? effectiveDate = null)
        {
            var rules = await GetAllPayerRulesAsync();
            var payerRules = rules.Where(r => r.PayerId == payerId).ToList();

            if (!payerRules.Any())
                return null;

            if (string.IsNullOrEmpty(effectiveDate))
            {
                // Return the most recent active rule
                return payerRules
                    .Where(r => string.IsNullOrEmpty(r.EndDate) || DateTime.Parse(r.EndDate) > DateTime.UtcNow)
                    .OrderByDescending(r => r.EffectiveDate)
                    .FirstOrDefault();
            }

            // Return the rule that was effective on the given date
            var targetDate = DateTime.Parse(effectiveDate);
            return payerRules
                .Where(r => DateTime.Parse(r.EffectiveDate) <= targetDate &&
                           (string.IsNullOrEmpty(r.EndDate) || DateTime.Parse(r.EndDate) > targetDate))
                .OrderByDescending(r => r.EffectiveDate)
                .FirstOrDefault();
        }

        public async Task<PayerRule> CreatePayerRuleAsync(PayerRule rule)
        {
            var rules = await GetAllPayerRulesAsync();
            rules.Add(rule);
            await _repository.WriteAsync(PayerRulesFile, rules);
            return rule;
        }

        public async Task<PayerRule> UpdatePayerRuleAsync(string id, PayerRule rule)
        {
            var rules = await GetAllPayerRulesAsync();
            var index = rules.FindIndex(r => r.Id == id);
            
            if (index >= 0)
            {
                rules[index] = rule;
                await _repository.WriteAsync(PayerRulesFile, rules);
            }
            
            return rule;
        }

        public async Task DeletePayerRuleAsync(string id)
        {
            var rules = await GetAllPayerRulesAsync();
            rules.RemoveAll(r => r.Id == id);
            await _repository.WriteAsync(PayerRulesFile, rules);
        }
    }
}