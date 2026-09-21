using EnrollmentReadiness.Models;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Services
{
    public interface IReadinessEvaluationService
    {
        Task EvaluateApplicationAsync(EnrollmentApplication application);
    }
}