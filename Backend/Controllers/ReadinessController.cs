using Microsoft.AspNetCore.Mvc;
using ProviderEnrollment.Services;
using ProviderEnrollment.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProviderEnrollment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReadinessController : ControllerBase
    {
        private readonly IReadinessService _readinessService;

        public ReadinessController(IReadinessService readinessService)
        {
            _readinessService = readinessService;
        }

        [HttpPost("evaluate")]
        public async Task<ActionResult<ReadinessEvaluation>> EvaluateApplication([FromBody] EvaluationRequest request)
        {
            var evaluation = await _readinessService.EvaluateApplicationAsync(request.ApplicationId);
            if (evaluation == null)
            {
                return NotFound();
            }
            return Ok(evaluation);
        }

        [HttpGet("history/{applicationId}")]
        public async Task<ActionResult<IEnumerable<ReadinessEvaluation>>> GetEvaluationHistory(string applicationId)
        {
            var history = await _readinessService.GetEvaluationHistoryAsync(applicationId);
            return Ok(history);
        }
    }

    public class EvaluationRequest
    {
        public string ApplicationId { get; set; }
    }
}