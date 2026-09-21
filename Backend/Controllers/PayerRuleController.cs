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
    public class PayerRulesController : ControllerBase
    {
        private readonly IPayerRuleService _payerRuleService;

        public PayerRulesController(IPayerRuleService payerRuleService)
        {
            _payerRuleService = payerRuleService;
        }

        [HttpGet]
        public async Task<ActionResult<List<PayerRule>>> GetAllPayerRules()
        {
            try
            {
                var rules = await _payerRuleService.GetAllPayerRulesAsync();
                return Ok(rules);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving payer rules", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PayerRule>> GetPayerRuleById(string id)
        {
            try
            {
                var rule = await _payerRuleService.GetPayerRuleByIdAsync(id);
                if (rule == null)
                {
                    return NotFound(new { message = $"Payer rule with ID {id} not found" });
                }
                return Ok(rule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving payer rule", error = ex.Message });
            }
        }

        [HttpGet("payer/{payerId}")]
        public async Task<ActionResult<PayerRule>> GetPayerRuleByPayerId(
            string payerId,
            [FromQuery] string? effectiveDate = null)
        {
            try
            {
                var rule = await _payerRuleService.GetPayerRuleByPayerIdAsync(payerId, effectiveDate);
                if (rule == null)
                {
                    return NotFound(new { message = $"Payer rule for payer {payerId} not found" });
                }
                return Ok(rule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving payer rule", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<PayerRule>> CreatePayerRule([FromBody] PayerRule rule)
        {
            try
            {
                if (rule == null)
                {
                    return BadRequest(new { message = "Payer rule data is required" });
                }

                rule.Id = Guid.NewGuid().ToString();
                var created = await _payerRuleService.CreatePayerRuleAsync(rule);
                return CreatedAtAction(nameof(GetPayerRuleById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating payer rule", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PayerRule>> UpdatePayerRule(string id, [FromBody] PayerRule rule)
        {
            try
            {
                if (rule == null || rule.Id != id)
                {
                    return BadRequest(new { message = "Invalid payer rule data" });
                }

                var existing = await _payerRuleService.GetPayerRuleByIdAsync(id);
                if (existing == null)
                {
                    return NotFound(new { message = $"Payer rule with ID {id} not found" });
                }

                var updated = await _payerRuleService.UpdatePayerRuleAsync(id, rule);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating payer rule", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayerRule(string id)
        {
            try
            {
                var existing = await _payerRuleService.GetPayerRuleByIdAsync(id);
                if (existing == null)
                {
                    return NotFound(new { message = $"Payer rule with ID {id} not found" });
                }

                await _payerRuleService.DeletePayerRuleAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting payer rule", error = ex.Message });
            }
        }
    }
}