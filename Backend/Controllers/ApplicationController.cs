using Microsoft.AspNetCore.Mvc;
using VK004Demo.Models;
using VK004Demo.Services;

namespace VK004Demo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        private readonly IReadinessService _readinessService;

        public ApplicationController(IApplicationService applicationService, IReadinessService readinessService)
        {
            _applicationService = applicationService;
            _readinessService = readinessService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetAllApplications()
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

        [HttpGet("{id}/details")]
        public async Task<ActionResult<ApplicationDetails>> GetApplicationDetails(string id)
        {
            try
            {
                var details = await _applicationService.GetApplicationDetailsAsync(id);
                if (details == null)
                {
                    return NotFound(new { message = $"Application details for {id} not found" });
                }
                return Ok(details);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving application details", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Application>> CreateApplication([FromBody] Application application)
        {
            try
            {
                if (string.IsNullOrEmpty(application.Id))
                {
                    application.Id = Guid.NewGuid().ToString();
                }

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
                application.Id = id;
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteApplication(string id)
        {
            try
            {
                var deleted = await _applicationService.DeleteApplicationAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = $"Application {id} not found" });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting application", error = ex.Message });
            }
        }
    }
}