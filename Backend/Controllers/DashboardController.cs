using Microsoft.AspNetCore.Mvc;
using ProviderEnrollmentSystem.Models;
using ProviderEnrollmentSystem.Services;

namespace ProviderEnrollmentSystem.Controllers
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
        public async Task<ActionResult<DashboardStats>> GetDashboardStats()
        {
            try
            {
                var stats = await _dashboardService.GetDashboardStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving dashboard stats", error = ex.Message });
            }
        }

        [HttpGet("drilldown")]
        public async Task<ActionResult<IEnumerable<DrillDownData>>> GetDrillDownData(
            [FromQuery] string status,
            [FromQuery] string groupBy)
        {
            try
            {
                var data = await _dashboardService.GetDrillDownDataAsync(status, groupBy);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving drill-down data", error = ex.Message });
            }
        }
    }
}