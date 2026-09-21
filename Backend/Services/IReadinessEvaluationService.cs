using HealthcareEnrollment.Models;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Services
{
    public interface IReadinessEvaluationService
    {
        Task<Application> EvaluateApplicationAsync(Application application);
    }
}