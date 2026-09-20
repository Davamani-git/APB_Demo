using System;
using System.Collections.Generic;

namespace ProviderEnrollment.Models
{
    public class RuleSet
    {
        public string Id { get; set; }
        public string PayerId { get; set; }
        public string PayerName { get; set; }
        public string Version { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
        public List<RequiredDocument> RequiredDocuments { get; set; }
        public List<RequiredDataField> RequiredDataFields { get; set; }
        public string CreatedBy { get; set; }
        public DateTime LastModified { get; set; }
    }

    public class RequiredDocument
    {
        public string DocumentType { get; set; }
        public string Description { get; set; }
        public bool IsMandatory { get; set; }
        public bool ExpirationRequired { get; set; }
    }

    public class RequiredDataField
    {
        public string FieldName { get; set; }
        public string FieldType { get; set; }
        public bool IsMandatory { get; set; }
        public string ValidationRule { get; set; }
        public string Description { get; set; }
    }
}