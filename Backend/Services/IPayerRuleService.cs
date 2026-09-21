using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Services
{
    public interface IPayerRuleService
    {
        Task<IEnumerable<PayerRule>> GetAllPayerRulesAsync();
        Task<PayerRule?> GetPayerRuleByIdAsync(string id);
        Task<PayerRule?> GetActiveRuleForPayerAsync(string payerName, DateTime date);
        Task<PayerRule> CreatePayerRuleAsync(PayerRule rule);
        Task<PayerRule?> UpdatePayerRuleAsync(PayerRule rule);
    }
}