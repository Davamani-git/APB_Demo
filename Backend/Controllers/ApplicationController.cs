using Microsoft.AspNetCore.Mvc;
using HealthcareEnrollment.Services;
using HealthcareEnrollment.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        public async Task<ActionResult<List<Application>>> GetAllApplications(
            [FromQuery] string? status = null,
            [FromQuery] string? coordinatorId = null,
            [FromQuery] string? payerId = null)
        {
            try
            {
                var applications = await _applicationService.GetAllApplicationsAsync();
                
                if (!string.IsNullOrEmpty(status))
                {
                    applications = applications.Where(a => 
                        a.OverallStatus.Contains(status, StringComparison.OrdinalIgnoreCase)).ToList();
                }
                
                if (!string.IsNullOrEmpty(coordinatorId))
                {
                    applications = applications.Where(a => a.CoordinatorId == coordinatorId).ToList();
                }
                
                if (!string.IsNullOrEmpty(payerId))
                {
                    applications = applications.Where(a => 
                        a.Payers.Any(p => p.PayerId == payerId)).ToList();
                }
                
                return Ok(applications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving applications", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Application>> GetApplicationById(string id)
        {
            try
            {
                var application = await _applicationService.GetApplicationByIdAsync(id);
                if (application == null)
                {
                    return NotFound(new { message = $"Application with ID {id} not found" });
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
                if (application == null)
                {
                    return BadRequest(new { message = "Application data is required" });
                }

                application.Id = Guid.NewGuid().ToString();
                application.LastUpdated = DateTime.UtcNow.ToString("o");
                
                // Evaluate the application
                var evaluatedApp = await _evaluationService.EvaluateApplicationAsync(application);
                
                var created = await _applicationService.CreateApplicationAsync(evaluatedApp);
                return CreatedAtAction(nameof(GetApplicationById), new { id = created.Id }, created);
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
                if (application == null || application.Id != id)
                {
                    return BadRequest(new { message = "Invalid application data" });
                }

                var existing = await _applicationService.GetApplicationByIdAsync(id);
                if (existing == null)
                {
                    return NotFound(new { message = $"Application with ID {id} not found" });
                }

                application.LastUpdated = DateTime.UtcNow.ToString("o");
                
                // Re-evaluate the application
                var evaluatedApp = await _evaluationService.EvaluateApplicationAsync(application);
                
                var updated = await _applicationService.UpdateApplicationAsync(id, evaluatedApp);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating application", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplication(string id)
        {
            try
            {
                var existing = await _applicationService.GetApplicationByIdAsync(id);
                if (existing == null)
                {
                    return NotFound(new { message = $"Application with ID {id} not found" });
                }

                await _applicationService.DeleteApplicationAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting application", error = ex.Message });
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
                    return NotFound(new { message = $"Application with ID {id} not found" });
                }

                var evaluated = await _evaluationService.EvaluateApplicationAsync(application);
                var updated = await _applicationService.UpdateApplicationAsync(id, evaluated);
                
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error evaluating application", error = ex.Message });
            }
        }
    }
}