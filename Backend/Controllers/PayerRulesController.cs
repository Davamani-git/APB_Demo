using Microsoft.AspNetCore.Mvc;
using ProviderEnrollmentSystem.Models;
using ProviderEnrollmentSystem.Services;

namespace ProviderEnrollmentSystem.Controllers
{
    [ApiController]
    [Route("api/payer-rules")]
    public class PayerRulesController : ControllerBase
    {
        private readonly IPayerRuleService _payerRuleService;

        public PayerRulesController(IPayerRuleService payerRuleService)
        {
            _payerRuleService = payerRuleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayerRule>>> GetPayerRules()
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
        public async Task<ActionResult<PayerRule>> GetPayerRule(string id)
        {
            try
            {
                var rule = await _payerRuleService.GetPayerRuleByIdAsync(id);
                if (rule == null)
                {
                    return NotFound(new { message = $"Payer rule {id} not found" });
                }
                return Ok(rule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving payer rule", error = ex.Message });
            }
        }

        [HttpGet("active")]
        public async Task<ActionResult<PayerRule>> GetActiveRule(
            [FromQuery] string payerName,
            [FromQuery] DateTime date)
        {
            try
            {
                var rule = await _payerRuleService.GetActiveRuleForPayerAsync(payerName, date);
                if (rule == null)
                {
                    return NotFound(new { message = $"No active rule found for {payerName} on {date}" });
                }
                return Ok(rule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving active rule", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<PayerRule>> CreatePayerRule([FromBody] PayerRule rule)
        {
            try
            {
                var created = await _payerRuleService.CreatePayerRuleAsync(rule);
                return CreatedAtAction(nameof(GetPayerRule), new { id = created.Id }, created);
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
                if (id != rule.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                var updated = await _payerRuleService.UpdatePayerRuleAsync(rule);
                if (updated == null)
                {
                    return NotFound(new { message = $"Payer rule {id} not found" });
                }
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating payer rule", error = ex.Message });
            }
        }
    }
}