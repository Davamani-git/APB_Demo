using Microsoft.AspNetCore.Mvc;
using VK004Demo.Services;

namespace VK004Demo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("manager")]
        public async Task<ActionResult<object>> GetManagerDashboard()
        {
            try
            {
                var dashboard = await _dashboardService.GetManagerDashboardAsync();
                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving dashboard data", error = ex.Message });
            }
        }

        [HttpGet("coordinator/{coordinatorId}")]
        public async Task<ActionResult<object>> GetCoordinatorDashboard(string coordinatorId)
        {
            try
            {
                var dashboard = await _dashboardService.GetCoordinatorDashboardAsync(coordinatorId);
                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving coordinator dashboard", error = ex.Message });
            }
        }
    }
}