using VK004Demo.Models;
using VK004Demo.Data;

namespace VK004Demo.Services
{
    public class DocumentService : IDocumentService
    {
        private readonly IJsonDataRepository _repository;

        public DocumentService(IJsonDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Document>> GetAllDocumentsAsync()
        {
            return await _repository.GetAllAsync<Document>("documents");
        }

        public async Task<Document?> GetDocumentByIdAsync(string id)
        {
            var documents = await _repository.GetAllAsync<Document>("documents");
            return documents.FirstOrDefault(d => d.Id == id);
        }

        public async Task<IEnumerable<Document>> GetDocumentsByApplicationIdAsync(string applicationId)
        {
            var documents = await _repository.GetAllAsync<Document>("documents");
            return documents.Where(d => d.ApplicationId == applicationId);
        }

        public async Task<IEnumerable<Document>> GetExpiringDocumentsAsync(int thresholdDays)
        {
            var documents = await _repository.GetAllAsync<Document>("documents");
            var thresholdDate = DateTime.Now.AddDays(thresholdDays);
            return documents.Where(d => d.ExpirationDate <= thresholdDate && d.ExpirationDate >= DateTime.Now);
        }

        public async Task<IEnumerable<Document>> GetExpiredDocumentsAsync()
        {
            var documents = await _repository.GetAllAsync<Document>("documents");
            return documents.Where(d => d.ExpirationDate < DateTime.Now);
        }

        public async Task<Document> CreateDocumentAsync(Document document)
        {
            var documents = (await _repository.GetAllAsync<Document>("documents")).ToList();
            documents.Add(document);
            await _repository.SaveAllAsync("documents", documents);
            return document;
        }

        public async Task<Document?> UpdateDocumentAsync(Document document)
        {
            var documents = (await _repository.GetAllAsync<Document>("documents")).ToList();
            var index = documents.FindIndex(d => d.Id == document.Id);
            if (index == -1) return null;

            documents[index] = document;
            await _repository.SaveAllAsync("documents", documents);
            return document;
        }

        public async Task<bool> DeleteDocumentAsync(string id)
        {
            var documents = (await _repository.GetAllAsync<Document>("documents")).ToList();
            var document = documents.FirstOrDefault(d => d.Id == id);
            if (document == null) return false;

            documents.Remove(document);
            await _repository.SaveAllAsync("documents", documents);
            return true;
        }
    }
}