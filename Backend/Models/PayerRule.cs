using System.Collections.Generic;

namespace HealthcareEnrollment.Models
{
    public class PayerRule
    {
        public string Id { get; set; } = string.Empty;
        public string PayerId { get; set; } = string.Empty;
        public string PayerName { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public string EffectiveDate { get; set; } = string.Empty;
        public string? EndDate { get; set; }
        public List<RequiredDocument> RequiredDocuments { get; set; } = new List<RequiredDocument>();
        public List<RequiredDataField> RequiredDataFields { get; set; } = new List<RequiredDataField>();
        public int ExpirationThresholdDays { get; set; } = 90;
    }

    public class RequiredDocument
    {
        public string DocumentType { get; set; } = string.Empty;
        public string DocumentName { get; set; } = string.Empty;
        public bool RequiresExpiration { get; set; }
    }

    public class RequiredDataField
    {
        public string FieldName { get; set; } = string.Empty;
        public string FieldLabel { get; set; } = string.Empty;
        public string DataType { get; set; } = string.Empty;
        public bool Mandatory { get; set; }
    }
}