using Microsoft.AspNetCore.Mvc;
using HealthcareEnrollment.Services;
using System;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Controllers
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

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
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

        [HttpGet("coordinator-breakdown")]
        public async Task<IActionResult> GetCoordinatorBreakdown()
        {
            try
            {
                var breakdown = await _dashboardService.GetCoordinatorBreakdownAsync();
                return Ok(breakdown);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving coordinator breakdown", error = ex.Message });
            }
        }

        [HttpGet("payer-breakdown")]
        public async Task<IActionResult> GetPayerBreakdown()
        {
            try
            {
                var breakdown = await _dashboardService.GetPayerBreakdownAsync();
                return Ok(breakdown);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving payer breakdown", error = ex.Message });
            }
        }
    }
}