using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthcareEnrollment.Data
{
    public interface IJsonDataRepository
    {
        Task<List<T>> ReadAsync<T>(string fileName);
        Task WriteAsync<T>(string fileName, List<T> data);
    }
}