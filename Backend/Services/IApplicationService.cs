using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IApplicationService
    {
        Task> GetAllApplicationsAsync();
        Task GetApplicationByIdAsync(string id);
        Task CreateApplicationAsync(Application application);
        Task UpdateApplicationAsync(string id, Application application);
        Task AddDocumentAsync(string applicationId, Document document);
        Task DeleteDocumentAsync(string applicationId, string documentId);
    }
}