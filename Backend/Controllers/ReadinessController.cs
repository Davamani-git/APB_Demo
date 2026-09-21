using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/readiness")]
    public class ReadinessController : ControllerBase
    {
        private readonly IReadinessService _readinessService;

        public ReadinessController(IReadinessService readinessService)
        {
            _readinessService = readinessService;
        }

        [HttpPost("evaluate/{applicationId}")]
        public async Task> EvaluateReadiness(string applicationId)
        {
            var evaluation = await _readinessService.EvaluateReadinessAsync(applicationId);
            if (evaluation == null)
            {
                return NotFound();
            }
            return Ok(evaluation);
        }
    }
}