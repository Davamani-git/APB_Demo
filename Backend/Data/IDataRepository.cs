using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Data
{
    public interface IDataRepository
    {
        Task> GetApplicationsAsync();
        Task SaveApplicationsAsync(IEnumerable applications);
    }
}