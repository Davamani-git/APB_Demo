using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/workqueue")]
    public class WorkQueueController : ControllerBase
    {
        private readonly IWorkQueueService _workQueueService;

        public WorkQueueController(IWorkQueueService workQueueService)
        {
            _workQueueService = workQueueService;
        }

        [HttpGet]
        public async Task>> GetWorkQueue()
        {
            var workQueue = await _workQueueService.GetWorkQueueAsync();
            return Ok(workQueue);
        }
    }
}