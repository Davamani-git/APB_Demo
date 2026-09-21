using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("stats")]
        public async Task> GetDashboardStats()
        {
            var stats = await _dashboardService.GetDashboardStatsAsync();
            return Ok(stats);
        }
    }
}