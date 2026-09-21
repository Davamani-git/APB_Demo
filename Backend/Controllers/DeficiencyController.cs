using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/deficiencies")]
    public class DeficiencyController : ControllerBase
    {
        private readonly IDeficiencyService _deficiencyService;

        public DeficiencyController(IDeficiencyService deficiencyService)
        {
            _deficiencyService = deficiencyService;
        }

        [HttpGet("{applicationId}")]
        public async Task> GetDeficiencies(string applicationId)
        {
            var deficiencies = await _deficiencyService.GetDeficienciesAsync(applicationId);
            if (deficiencies == null)
            {
                return NotFound();
            }
            return Ok(deficiencies);
        }
    }
}