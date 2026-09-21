using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/applications")]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        [HttpGet]
        public async Task>> GetApplications()
        {
            var applications = await _applicationService.GetAllApplicationsAsync();
            return Ok(applications);
        }

        [HttpGet("{id}")]
        public async Task> GetApplication(string id)
        {
            var application = await _applicationService.GetApplicationByIdAsync(id);
            if (application == null)
            {
                return NotFound();
            }
            return Ok(application);
        }

        [HttpPost]
        public async Task> CreateApplication([FromBody] Application application)
        {
            var created = await _applicationService.CreateApplicationAsync(application);
            return CreatedAtAction(nameof(GetApplication), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task> UpdateApplication(string id, [FromBody] Application application)
        {
            var updated = await _applicationService.UpdateApplicationAsync(id, application);
            if (updated == null)
            {
                return NotFound();
            }
            return Ok(updated);
        }

        [HttpPost("{applicationId}/documents")]
        public async Task AddDocument(string applicationId, [FromBody] Document document)
        {
            var result = await _applicationService.AddDocumentAsync(applicationId, document);
            if (!result)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpDelete("{applicationId}/documents/{documentId}")]
        public async Task DeleteDocument(string applicationId, string documentId)
        {
            var result = await _applicationService.DeleteDocumentAsync(applicationId, documentId);
            if (!result)
            {
                return NotFound();
            }
            return Ok();
        }
    }
}