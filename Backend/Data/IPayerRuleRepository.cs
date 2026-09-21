using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Data
{
    public interface IPayerRuleRepository
    {
        Task<IEnumerable<PayerRule>> GetAllAsync();
        Task<PayerRule?> GetByIdAsync(string id);
        Task<PayerRule> CreateAsync(PayerRule rule);
        Task<PayerRule?> UpdateAsync(PayerRule rule);
    }
}