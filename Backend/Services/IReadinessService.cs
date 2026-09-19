using VK004Demo.Models;

namespace VK004Demo.Services
{
    public interface IReadinessService
    {
        Task<ReadinessEvaluation?> EvaluateApplicationAsync(string applicationId);
        Task<int> EvaluateAllApplicationsAsync();
        Task<ReadinessExplanation?> GetReadinessExplanationAsync(string applicationId, string payerId);
        Task<object?> GetApplicationStatusAsync(string applicationId);
    }
}