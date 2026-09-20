using Microsoft.AspNetCore.Mvc;
using ProviderEnrollment.Services;
using ProviderEnrollment.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProviderEnrollment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RuleSetsController : ControllerBase
    {
        private readonly IRuleSetService _ruleSetService;

        public RuleSetsController(IRuleSetService ruleSetService)
        {
            _ruleSetService = ruleSetService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RuleSet>>> GetRuleSets()
        {
            var ruleSets = await _ruleSetService.GetAllRuleSetsAsync();
            return Ok(ruleSets);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RuleSet>> GetRuleSet(string id)
        {
            var ruleSet = await _ruleSetService.GetRuleSetByIdAsync(id);
            if (ruleSet == null)
            {
                return NotFound();
            }
            return Ok(ruleSet);
        }

        [HttpGet("effective")]
        public async Task<ActionResult<RuleSet>> GetEffectiveRuleSet([FromQuery] string payerId, [FromQuery] DateTime submissionDate)
        {
            var ruleSet = await _ruleSetService.GetEffectiveRuleSetAsync(payerId, submissionDate);
            if (ruleSet == null)
            {
                return NotFound();
            }
            return Ok(ruleSet);
        }

        [HttpPost]
        public async Task<ActionResult<RuleSet>> CreateRuleSet([FromBody] RuleSet ruleSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _ruleSetService.CreateRuleSetAsync(ruleSet);
            return CreatedAtAction(nameof(GetRuleSet), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RuleSet>> UpdateRuleSet(string id, [FromBody] RuleSet ruleSet)
        {
            if (id != ruleSet.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await _ruleSetService.UpdateRuleSetAsync(ruleSet);
            if (updated == null)
            {
                return NotFound();
            }

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRuleSet(string id)
        {
            var result = await _ruleSetService.DeleteRuleSetAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}