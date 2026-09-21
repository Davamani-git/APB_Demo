using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IDeficiencyService
    {
        Task GetDeficienciesAsync(string applicationId);
    }
}