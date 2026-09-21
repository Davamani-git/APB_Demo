using ProviderEnrollmentSystem.Data;
using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Services
{
    public class PayerRuleService : IPayerRuleService
    {
        private readonly IPayerRuleRepository _repository;

        public PayerRuleService(IPayerRuleRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PayerRule>> GetAllPayerRulesAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<PayerRule?> GetPayerRuleByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<PayerRule?> GetActiveRuleForPayerAsync(string payerName, DateTime date)
        {
            var allRules = await _repository.GetAllAsync();
            return allRules.FirstOrDefault(r =>
                r.PayerName.Equals(payerName, StringComparison.OrdinalIgnoreCase) &&
                r.IsActive &&
                r.EffectiveDate <= date &&
                (!r.EndDate.HasValue || r.EndDate.Value >= date));
        }

        public async Task<PayerRule> CreatePayerRuleAsync(PayerRule rule)
        {
            if (string.IsNullOrEmpty(rule.Id))
            {
                rule.Id = Guid.NewGuid().ToString();
            }
            return await _repository.CreateAsync(rule);
        }

        public async Task<PayerRule?> UpdatePayerRuleAsync(PayerRule rule)
        {
            return await _repository.UpdateAsync(rule);
        }
    }
}