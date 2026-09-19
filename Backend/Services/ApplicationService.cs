using VK004Demo.Models;
using VK004Demo.Data;

namespace VK004Demo.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IJsonDataRepository _repository;
        private readonly IDocumentService _documentService;
        private readonly IRuleSetService _ruleSetService;

        public ApplicationService(IJsonDataRepository repository, IDocumentService documentService, IRuleSetService ruleSetService)
        {
            _repository = repository;
            _documentService = documentService;
            _ruleSetService = ruleSetService;
        }

        public async Task<IEnumerable<Application>> GetAllApplicationsAsync()
        {
            return await _repository.GetAllAsync<Application>("applications");
        }

        public async Task<Application?> GetApplicationByIdAsync(string id)
        {
            var applications = await _repository.GetAllAsync<Application>("applications");
            return applications.FirstOrDefault(a => a.Id == id);
        }

        public async Task<ApplicationDetails?> GetApplicationDetailsAsync(string id)
        {
            var application = await GetApplicationByIdAsync(id);
            if (application == null) return null;

            var documents = await _documentService.GetDocumentsByApplicationIdAsync(id);
            var details = new ApplicationDetails
            {
                Id = application.Id,
                ProviderName = application.ProviderName,
                StartDate = application.StartDate,
                ReadinessStatus = application.ReadinessStatus,
                Payers = new List<PayerStatus>()
            };

            foreach (var payerRef in application.Payers)
            {
                var ruleSet = await _ruleSetService.GetActiveRuleSetForPayerAsync(payerRef);
                if (ruleSet == null) continue;

                var payerStatus = new PayerStatus
                {
                    PayerId = ruleSet.PayerId,
                    PayerName = ruleSet.PayerName,
                    Status = "Ready to Submit",
                    Requirements = new List<RequirementStatus>()
                };

                foreach (var reqDoc in ruleSet.RequiredDocuments)
                {
                    var doc = documents.FirstOrDefault(d => d.DocumentType == reqDoc);
                    var reqStatus = new RequirementStatus
                    {
                        Name = reqDoc,
                        Status = doc == null ? "Missing" : CalculateDocumentStatus(doc.ExpirationDate),
                        Details = doc == null ? "Document not uploaded" : $"Expires: {doc.ExpirationDate:yyyy-MM-dd}"
                    };
                    payerStatus.Requirements.Add(reqStatus);

                    if (reqStatus.Status != "Present & Valid")
                    {
                        payerStatus.Status = reqStatus.Status == "Missing" ? "Incomplete" : "Expiring Soon";
                    }
                }

                details.Payers.Add(payerStatus);
            }

            return details;
        }

        private string CalculateDocumentStatus(DateTime expirationDate)
        {
            var daysUntilExpiration = (expirationDate - DateTime.Now).Days;
            if (daysUntilExpiration < 0) return "Expired";
            if (daysUntilExpiration <= 90) return "Expiring Soon";
            return "Present & Valid";
        }

        public async Task<Application> CreateApplicationAsync(Application application)
        {
            var applications = (await _repository.GetAllAsync<Application>("applications")).ToList();
            applications.Add(application);
            await _repository.SaveAllAsync("applications", applications);
            return application;
        }

        public async Task<Application?> UpdateApplicationAsync(Application application)
        {
            var applications = (await _repository.GetAllAsync<Application>("applications")).ToList();
            var index = applications.FindIndex(a => a.Id == application.Id);
            if (index == -1) return null;

            applications[index] = application;
            await _repository.SaveAllAsync("applications", applications);
            return application;
        }

        public async Task<bool> DeleteApplicationAsync(string id)
        {
            var applications = (await _repository.GetAllAsync<Application>("applications")).ToList();
            var application = applications.FirstOrDefault(a => a.Id == id);
            if (application == null) return false;

            applications.Remove(application);
            await _repository.SaveAllAsync("applications", applications);
            return true;
        }
    }
}