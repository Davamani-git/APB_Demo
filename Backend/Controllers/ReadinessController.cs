using Microsoft.AspNetCore.Mvc;
using VK004Demo.Models;
using VK004Demo.Services;

namespace VK004Demo.Controllers
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

        [HttpPost("evaluate/{applicationId}")]
        public async Task<ActionResult<ReadinessEvaluation>> EvaluateApplication(string applicationId)
        {
            try
            {
                var evaluation = await _readinessService.EvaluateApplicationAsync(applicationId);
                if (evaluation == null)
                {
                    return NotFound(new { message = $"Application {applicationId} not found" });
                }
                return Ok(evaluation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error evaluating application", error = ex.Message });
            }
        }

        [HttpPost("evaluate-all")]
        public async Task<ActionResult<object>> EvaluateAllApplications()
        {
            try
            {
                var count = await _readinessService.EvaluateAllApplicationsAsync();
                return Ok(new { evaluatedCount = count, message = $"Successfully evaluated {count} applications" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error evaluating applications", error = ex.Message });
            }
        }

        [HttpGet("explanation/{applicationId}/{payerId}")]
        public async Task<ActionResult<ReadinessExplanation>> GetExplanation(string applicationId, string payerId)
        {
            try
            {
                var explanation = await _readinessService.GetReadinessExplanationAsync(applicationId, payerId);
                if (explanation == null)
                {
                    return NotFound(new { message = $"Explanation not found for application {applicationId} and payer {payerId}" });
                }
                return Ok(explanation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving explanation", error = ex.Message });
            }
        }

        [HttpGet("status/{applicationId}")]
        public async Task<ActionResult<object>> GetApplicationStatus(string applicationId)
        {
            try
            {
                var status = await _readinessService.GetApplicationStatusAsync(applicationId);
                if (status == null)
                {
                    return NotFound(new { message = $"Status not found for application {applicationId}" });
                }
                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving status", error = ex.Message });
            }
        }
    }
}