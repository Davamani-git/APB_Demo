using Microsoft.AspNetCore.Mvc;
using EnrollmentReadiness.Models;
using EnrollmentReadiness.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnrollmentReadiness.Controllers
{
    [ApiController]
    [Route("api/payer-rules")]
    public class PayerRulesController : ControllerBase
    {
        private readonly IPayerRulesService _payerRulesService;

        public PayerRulesController(IPayerRulesService payerRulesService)
        {
            _payerRulesService = payerRulesService;
        }

        [HttpGet]
        public async Task>> GetRuleSets()
        {
            var ruleSets = await _payerRulesService.GetAllRuleSetsAsync();
            return Ok(ruleSets);
        }

        [HttpGet("{id}")]
        public async Task> GetRuleSet(string id)
        {
            var ruleSet = await _payerRulesService.GetRuleSetByIdAsync(id);
            if (ruleSet == null)
            {
                return NotFound();
            }
            return Ok(ruleSet);
        }

        [HttpPost]
        public async Task> CreateRuleSet([FromBody] PayerRuleSet ruleSet)
        {
            var created = await _payerRulesService.CreateRuleSetAsync(ruleSet);
            return CreatedAtAction(nameof(GetRuleSet), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task> UpdateRuleSet(
            string id,
            [FromBody] PayerRuleSet ruleSet)
        {
            if (id != ruleSet.Id)
            {
                return BadRequest("ID mismatch");
            }

            var updated = await _payerRulesService.UpdateRuleSetAsync(ruleSet);
            if (updated == null)
            {
                return NotFound();
            }
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task DeleteRuleSet(string id)
        {
            var result = await _payerRulesService.DeleteRuleSetAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}