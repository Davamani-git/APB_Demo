using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IRiskPrioritizationService
    {
        Task> GetRiskScoredApplicationsAsync();
    }
}