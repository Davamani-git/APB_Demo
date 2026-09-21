using Microsoft.AspNetCore.Mvc;
using EnrollmentReadiness.Models;
using EnrollmentReadiness.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Controllers
{
    [ApiController]
    [Route("api/prebuilt-rules")]
    public class PrebuiltRulesController : ControllerBase
    {
        private readonly IPrebuiltRulesService _prebuiltRulesService;

        public PrebuiltRulesController(IPrebuiltRulesService prebuiltRulesService)
        {
            _prebuiltRulesService = prebuiltRulesService;
        }

        [HttpGet]
        public async Task>> GetPrebuiltRuleSets()
        {
            var ruleSets = await _prebuiltRulesService.GetAllPrebuiltRuleSetsAsync();
            return Ok(ruleSets);
        }

        [HttpPost("{id}/activate")]
        public async Task ActivateRuleSet(string id, [FromBody] ActivationRequest request)
        {
            var result = await _prebuiltRulesService.ActivateRuleSetAsync(id, request.Activate);
            if (!result)
            {
                return NotFound();
            }
            return Ok();
        }
    }

    public class ActivationRequest
    {
        public bool Activate { get; set; }
    }
}