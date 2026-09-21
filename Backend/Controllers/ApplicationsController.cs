using Microsoft.AspNetCore.Mvc;
using ProviderEnrollmentSystem.Models;
using ProviderEnrollmentSystem.Services;

namespace ProviderEnrollmentSystem.Controllers
{
    [ApiController]
    [Route("api/applications")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        private readonly IReadinessEvaluationService _evaluationService;

        public ApplicationsController(
            IApplicationService applicationService,
            IReadinessEvaluationService evaluationService)
        {
            _applicationService = applicationService;
            _evaluationService = evaluationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplications()
        {
            try
            {
                var applications = await _applicationService.GetAllApplicationsAsync();
                return Ok(applications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving applications", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Application>> GetApplication(string id)
        {
            try
            {
                var application = await _applicationService.GetApplicationByIdAsync(id);
                if (application == null)
                {
                    return NotFound(new { message = $"Application {id} not found" });
                }
                return Ok(application);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving application", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Application>> CreateApplication([FromBody] Application application)
        {
            try
            {
                var created = await _applicationService.CreateApplicationAsync(application);
                return CreatedAtAction(nameof(GetApplication), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating application", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Application>> UpdateApplication(string id, [FromBody] Application application)
        {
            try
            {
                if (id != application.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                var updated = await _applicationService.UpdateApplicationAsync(application);
                if (updated == null)
                {
                    return NotFound(new { message = $"Application {id} not found" });
                }
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating application", error = ex.Message });
            }
        }

        [HttpPost("{id}/evaluate")]
        public async Task<ActionResult<Application>> EvaluateApplication(string id)
        {
            try
            {
                var application = await _applicationService.GetApplicationByIdAsync(id);
                if (application == null)
                {
                    return NotFound(new { message = $"Application {id} not found" });
                }

                var evaluated = await _evaluationService.EvaluateApplicationAsync(application);
                var updated = await _applicationService.UpdateApplicationAsync(evaluated);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error evaluating application", error = ex.Message });
            }
        }
    }
}