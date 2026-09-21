using System.Collections.Generic;

namespace Backend.Models
{
    public class Application
    {
        public string Id { get; set; }
        public string ProviderName { get; set; }
        public string Npi { get; set; }
        public string TaxId { get; set; }
        public string Specialty { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string EnrollmentType { get; set; }
        public string Status { get; set; }
        public string Coordinator { get; set; }
        public List Payers { get; set; }
        public List Documents { get; set; }
        public int ReadinessScore { get; set; }
        public string CreatedDate { get; set; }
        public string LastUpdated { get; set; }
    }

    public class PayerData
    {
        public string PayerId { get; set; }
        public string PayerName { get; set; }
        public string Status { get; set; }
        public string ReadinessStatus { get; set; }
        public List Requirements { get; set; }
    }

    public class Requirement
    {
        public string RequirementId { get; set; }
        public string RequirementName { get; set; }
        public string Status { get; set; }
        public string ExpirationDate { get; set; }
        public string DocumentId { get; set; }
    }

    public class Document
    {
        public string DocumentId { get; set; }
        public string DocumentName { get; set; }
        public string DocumentType { get; set; }
        public string UploadDate { get; set; }
        public string ExpirationDate { get; set; }
        public string PayerId { get; set; }
    }
}