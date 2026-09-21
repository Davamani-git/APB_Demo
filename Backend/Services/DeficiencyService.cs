using Backend.Data;
using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class DeficiencyService : IDeficiencyService
    {
        private readonly IDataRepository _dataRepository;

        public DeficiencyService(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        public async Task GetDeficienciesAsync(string applicationId)
        {
            var applications = await _dataRepository.GetApplicationsAsync();
            var application = applications.FirstOrDefault(a => a.Id == applicationId);
            
            if (application == null)
                return null;
            
            var deficiencies = new List();
            
            if (application.Payers != null)
            {
                foreach (var payer in application.Payers)
                {
                    if (payer.Requirements != null)
                    {
                        foreach (var req in payer.Requirements.Where(r => r.Status != "Met"))
                        {
                            var deficiency = new DeficiencyItem
                            {
                                RequirementId = req.RequirementId,
                                RequirementName = req.RequirementName,
                                DocumentName = GetDocumentNameForRequirement(req.RequirementName),
                                Status = req.Status,
                                Deadline = req.ExpirationDate ?? DateTime.UtcNow.AddDays(30).ToString("o"),
                                Urgency = DetermineUrgency(req),
                                OutreachText = GenerateOutreachText(application.ProviderName, req, payer.PayerName),
                                PayerName = payer.PayerName
                            };
                            deficiencies.Add(deficiency);
                        }
                    }
                }
            }
            
            return new DeficiencyGuidance
            {
                ApplicationId = applicationId,
                ProviderName = application.ProviderName,
                Deficiencies = deficiencies
            };
        }

        private string GetDocumentNameForRequirement(string requirementName)
        {
            var mapping = new Dictionary
            {
                { "Medical License", "State Medical License" },
                { "DEA Certificate", "DEA Registration Certificate" },
                { "Malpractice Insurance", "Professional Liability Insurance Certificate" },
                { "Board Certification", "Board Certification Document" },
                { "CV", "Current Curriculum Vitae" }
            };
            
            return mapping.ContainsKey(requirementName) ? mapping[requirementName] : requirementName + " Document";
        }

        private string DetermineUrgency(Requirement req)
        {
            if (req.Status == "Expired" || req.Status == "Missing")
                return "High";
            
            if (!string.IsNullOrEmpty(req.ExpirationDate))
            {
                if (DateTime.TryParse(req.ExpirationDate, out DateTime expDate))
                {
                    var daysUntilExpiration = (expDate - DateTime.UtcNow).Days;
                    if (daysUntilExpiration <= 30)
                        return "High";
                    if (daysUntilExpiration <= 60)
                        return "Medium";
                }
            }
            
            return "Low";
        }

        private string GenerateOutreachText(string providerName, Requirement req, string payerName)
        {
            var documentName = GetDocumentNameForRequirement(req.RequirementName);
            var deadline = !string.IsNullOrEmpty(req.ExpirationDate) 
                ? DateTime.Parse(req.ExpirationDate).ToString("MMMM dd, yyyy")
                : DateTime.UtcNow.AddDays(30).ToString("MMMM dd, yyyy");
            
            return $"Dear {providerName},\n\n" +
                   $"We are processing your enrollment application with {payerName}. " +
                   $"To complete your application, we require the following:\n\n" +
                   $"Document Required: {documentName}\n" +
                   $"Requirement: {req.RequirementName}\n" +
                   $"Status: {req.Status}\n" +
                   $"Deadline: {deadline}\n\n" +
                   $"Please submit this document at your earliest convenience to avoid delays in processing your application.\n\n" +
                   $"If you have any questions, please contact our enrollment team.\n\n" +
                   $"Thank you,\nProvider Enrollment Team";
        }
    }
}