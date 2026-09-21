using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IDashboardService
    {
        Task GetDashboardStatsAsync();
    }
}