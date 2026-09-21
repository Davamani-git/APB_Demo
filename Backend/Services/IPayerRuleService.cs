using HealthcareEnrollment.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Services
{
    public interface IPayerRuleService
    {
        Task<List<PayerRule>> GetAllPayerRulesAsync();
        Task<PayerRule> GetPayerRuleByIdAsync(string id);
        Task<PayerRule> GetPayerRuleByPayerIdAsync(string payerId, string? effectiveDate = null);
        Task<PayerRule> CreatePayerRuleAsync(PayerRule rule);
        Task<PayerRule> UpdatePayerRuleAsync(string id, PayerRule rule);
        Task DeletePayerRuleAsync(string id);
    }
}