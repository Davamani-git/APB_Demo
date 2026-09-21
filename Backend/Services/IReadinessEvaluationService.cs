using ProviderEnrollmentSystem.Models;

namespace ProviderEnrollmentSystem.Services
{
    public interface IReadinessEvaluationService
    {
        Task<Application> EvaluateApplicationAsync(Application application);
    }
}