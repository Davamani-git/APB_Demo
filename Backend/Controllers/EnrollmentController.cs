using Microsoft.AspNetCore.Mvc;
using EnrollmentReadiness.Models;
using EnrollmentReadiness.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Controllers
{
    [ApiController]
    [Route("api/enrollment")]
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;
        private readonly IReadinessEvaluationService _evaluationService;

        public EnrollmentController(
            IEnrollmentService enrollmentService,
            IReadinessEvaluationService evaluationService)
        {
            _enrollmentService = enrollmentService;
            _evaluationService = evaluationService;
        }

        [HttpGet("applications")]
        public async Task>> GetApplications()
        {
            var applications = await _enrollmentService.GetAllApplicationsAsync();
            return Ok(applications);
        }

        [HttpGet("applications/{id}")]
        public async Task> GetApplication(string id)
        {
            var application = await _enrollmentService.GetApplicationByIdAsync(id);
            if (application == null)
            {
                return NotFound();
            }
            return Ok(application);
        }

        [HttpPost("applications")]
        public async Task> CreateApplication(
            [FromBody] EnrollmentApplication application)
        {
            var created = await _enrollmentService.CreateApplicationAsync(application);
            return CreatedAtAction(nameof(GetApplication), new { id = created.Id }, created);
        }

        [HttpPut("applications/{id}")]
        public async Task> UpdateApplication(
            string id,
            [FromBody] EnrollmentApplication application)
        {
            if (id != application.Id)
            {
                return BadRequest("ID mismatch");
            }

            var updated = await _enrollmentService.UpdateApplicationAsync(application);
            if (updated == null)
            {
                return NotFound();
            }
            return Ok(updated);
        }

        [HttpPost("applications/{id}/evaluate")]
        public async Task> EvaluateApplication(string id)
        {
            var application = await _enrollmentService.GetApplicationByIdAsync(id);
            if (application == null)
            {
                return NotFound();
            }

            var evaluated = await _evaluationService.EvaluateApplicationAsync(application);
            var updated = await _enrollmentService.UpdateApplicationAsync(evaluated);
            return Ok(updated);
        }
    }
}