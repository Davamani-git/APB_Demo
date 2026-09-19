using Microsoft.AspNetCore.Mvc;
using VK004Demo.Models;
using VK004Demo.Services;

namespace VK004Demo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RuleSetController : ControllerBase
    {
        private readonly IRuleSetService _ruleSetService;

        public RuleSetController(IRuleSetService ruleSetService)
        {
            _ruleSetService = ruleSetService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RuleSet>>> GetAllRuleSets()
        {
            try
            {
                var ruleSets = await _ruleSetService.GetAllRuleSetsAsync();
                return Ok(ruleSets);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving rule sets", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RuleSet>> GetRuleSet(string id)
        {
            try
            {
                var ruleSet = await _ruleSetService.GetRuleSetByIdAsync(id);
                if (ruleSet == null)
                {
                    return NotFound(new { message = $"Rule set {id} not found" });
                }
                return Ok(ruleSet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving rule set", error = ex.Message });
            }
        }

        [HttpGet("payer/{payerId}")]
        public async Task<ActionResult<RuleSet>> GetActiveRuleSetForPayer(string payerId)
        {
            try
            {
                var ruleSet = await _ruleSetService.GetActiveRuleSetForPayerAsync(payerId);
                if (ruleSet == null)
                {
                    return NotFound(new { message = $"No active rule set found for payer {payerId}" });
                }
                return Ok(ruleSet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving rule set", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<RuleSet>> CreateRuleSet([FromBody] RuleSet ruleSet)
        {
            try
            {
                if (string.IsNullOrEmpty(ruleSet.Id))
                {
                    ruleSet.Id = Guid.NewGuid().ToString();
                }

                var created = await _ruleSetService.CreateRuleSetAsync(ruleSet);
                return CreatedAtAction(nameof(GetRuleSet), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating rule set", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RuleSet>> UpdateRuleSet(string id, [FromBody] RuleSet ruleSet)
        {
            try
            {
                ruleSet.Id = id;
                var updated = await _ruleSetService.UpdateRuleSetAsync(ruleSet);
                if (updated == null)
                {
                    return NotFound(new { message = $"Rule set {id} not found" });
                }
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating rule set", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRuleSet(string id)
        {
            try
            {
                var deleted = await _ruleSetService.DeleteRuleSetAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = $"Rule set {id} not found" });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting rule set", error = ex.Message });
            }
        }
    }
}