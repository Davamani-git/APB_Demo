using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IReadinessService
    {
        Task EvaluateReadinessAsync(string applicationId);
    }
}