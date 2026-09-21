using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IWorkQueueService
    {
        Task> GetWorkQueueAsync();
    }
}