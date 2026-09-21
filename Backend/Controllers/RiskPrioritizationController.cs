using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/risk-prioritization")]
    public class RiskPrioritizationController : ControllerBase
    {
        private readonly IRiskPrioritizationService _riskPrioritizationService;

        public RiskPrioritizationController(IRiskPrioritizationService riskPrioritizationService)
        {
            _riskPrioritizationService = riskPrioritizationService;
        }

        [HttpGet]
        public async Task>> GetRiskScoredApplications()
        {
            var applications = await _riskPrioritizationService.GetRiskScoredApplicationsAsync();
            return Ok(applications);
        }
    }
}