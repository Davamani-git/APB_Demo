using VK004Demo.Models;

namespace VK004Demo.Services
{
    public interface IDocumentService
    {
        Task<IEnumerable<Document>> GetAllDocumentsAsync();
        Task<Document?> GetDocumentByIdAsync(string id);
        Task<IEnumerable<Document>> GetDocumentsByApplicationIdAsync(string applicationId);
        Task<IEnumerable<Document>> GetExpiringDocumentsAsync(int thresholdDays);
        Task<IEnumerable<Document>> GetExpiredDocumentsAsync();
        Task<Document> CreateDocumentAsync(Document document);
        Task<Document?> UpdateDocumentAsync(Document document);
        Task<bool> DeleteDocumentAsync(string id);
    }
}