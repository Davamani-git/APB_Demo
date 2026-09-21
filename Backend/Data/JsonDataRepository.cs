using Backend.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace Backend.Data
{
    public class JsonDataRepository : IDataRepository
    {
        private readonly string _dataFilePath = "Backend/Data/applications.json";
        private readonly JsonSerializerOptions _jsonOptions;

        public JsonDataRepository()
        {
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                WriteIndented = true
            };
            
            EnsureDataFileExists();
        }

        private void EnsureDataFileExists()
        {
            var directory = Path.GetDirectoryName(_dataFilePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            if (!File.Exists(_dataFilePath))
            {
                var sampleData = GenerateSampleData();
                var json = JsonSerializer.Serialize(sampleData, _jsonOptions);
                File.WriteAllText(_dataFilePath, json);
            }
        }

        public async Task> GetApplicationsAsync()
        {
            try
            {
                var json = await File.ReadAllTextAsync(_dataFilePath);
                var applications = JsonSerializer.Deserialize>(json, _jsonOptions);
                return applications ?? new List();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading applications: {ex.Message}");
                return new List();
            }
        }

        public async Task SaveApplicationsAsync(IEnumerable applications)
        {
            try
            {
                var json = JsonSerializer.Serialize(applications, _jsonOptions);
                await File.WriteAllTextAsync(_dataFilePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving applications: {ex.Message}");
                throw;
            }
        }

        private List GenerateSampleData()
        {
            return new List
            {
                new Application
                {
                    Id = "APP-001",
                    ProviderName = "Dr. Sarah Johnson",
                    Npi = "1234567890",
                    TaxId = "12-3456789",
                    Specialty = "Internal Medicine",
                    Address = "123 Medical Plaza, Suite 100, Boston, MA 02101",
                    Phone = "(617) 555-0100",
                    Email = "sjohnson@example.com",
                    EnrollmentType = "New Enrollment",
                    Status = "Pending",
                    Coordinator = "Jane Smith",
                    ReadinessScore = 75,
                    CreatedDate = DateTime.UtcNow.AddDays(-30).ToString("o"),
                    LastUpdated = DateTime.UtcNow.AddDays(-2).ToString("o"),
                    Payers = new List
                    {
                        new PayerData
                        {
                            PayerId = "PAYER-001",
                            PayerName = "Blue Cross Blue Shield",
                            Status = "Pending",
                            ReadinessStatus = "Pending",
                            Requirements = new List
                            {
                                new Requirement { RequirementId = "REQ-001", RequirementName = "Medical License", Status = "Met", DocumentId = "DOC-001" },
                                new Requirement { RequirementId = "REQ-002", RequirementName = "DEA Certificate", Status = "Met", DocumentId = "DOC-002" },
                                new Requirement { RequirementId = "REQ-003", RequirementName = "Malpractice Insurance", Status = "Pending" },
                                new Requirement { RequirementId = "REQ-004", RequirementName = "Board Certification", Status = "Met", DocumentId = "DOC-003" }
                            }
                        },
                        new PayerData
                        {
                            PayerId = "PAYER-002",
                            PayerName = "Aetna",
                            Status = "Incomplete",
                            ReadinessStatus = "Incomplete",
                            Requirements = new List
                            {
                                new Requirement { RequirementId = "REQ-005", RequirementName = "Medical License", Status = "Met", DocumentId = "DOC-001" },
                                new Requirement { RequirementId = "REQ-006", RequirementName = "CV", Status = "Missing" },
                                new Requirement { RequirementId = "REQ-007", RequirementName = "Malpractice Insurance", Status = "Missing" }
                            }
                        }
                    },
                    Documents = new List
                    {
                        new Document { DocumentId = "DOC-001", DocumentName = "MA Medical License", DocumentType = "License", UploadDate = DateTime.UtcNow.AddDays(-25).ToString("o"), ExpirationDate = DateTime.UtcNow.AddYears(2).ToString("o") },
                        new Document { DocumentId = "DOC-002", DocumentName = "DEA Registration", DocumentType = "Certificate", UploadDate = DateTime.UtcNow.AddDays(-20).ToString("o"), ExpirationDate = DateTime.UtcNow.AddYears(3).ToString("o") },
                        new Document { DocumentId = "DOC-003", DocumentName = "ABIM Board Certification", DocumentType = "Certificate", UploadDate = DateTime.UtcNow.AddDays(-15).ToString("o") }
                    }
                },
                new Application
                {
                    Id = "APP-002",
                    ProviderName = "Dr. Michael Chen",
                    Npi = "9876543210",
                    TaxId = "98-7654321",
                    Specialty = "Cardiology",
                    Address = "456 Heart Center Dr, Suite 200, Boston, MA 02102",
                    Phone = "(617) 555-0200",
                    Email = "mchen@example.com",
                    EnrollmentType = "Re-credentialing",
                    Status = "Incomplete",
                    Coordinator = "John Davis",
                    ReadinessScore = 45,
                    CreatedDate = DateTime.UtcNow.AddDays(-45).ToString("o"),
                    LastUpdated = DateTime.UtcNow.AddDays(-10).ToString("o"),
                    Payers = new List
                    {
                        new PayerData
                        {
                            PayerId = "PAYER-001",
                            PayerName = "Blue Cross Blue Shield",
                            Status = "Incomplete",
                            ReadinessStatus = "Incomplete",
                            Requirements = new List
                            {
                                new Requirement { RequirementId = "REQ-008", RequirementName = "Medical License", Status = "Expired", ExpirationDate = DateTime.UtcNow.AddDays(-30).ToString("o") },
                                new Requirement { RequirementId = "REQ-009", RequirementName = "Malpractice Insurance", Status = "Missing" },
                                new Requirement { RequirementId = "REQ-010", RequirementName = "Board Certification", Status = "Met", DocumentId = "DOC-004" }
                            }
                        }
                    },
                    Documents = new List
                    {
                        new Document { DocumentId = "DOC-004", DocumentName = "Cardiology Board Certification", DocumentType = "Certificate", UploadDate = DateTime.UtcNow.AddDays(-40).ToString("o") }
                    }
                },
                new Application
                {
                    Id = "APP-003",
                    ProviderName = "Dr. Emily Rodriguez",
                    Npi = "5555555555",
                    TaxId = "55-5555555",
                    Specialty = "Pediatrics",
                    Address = "789 Children's Way, Suite 300, Boston, MA 02103",
                    Phone = "(617) 555-0300",
                    Email = "erodriguez@example.com",
                    EnrollmentType = "New Enrollment",
                    Status = "Ready",
                    Coordinator = "Jane Smith",
                    ReadinessScore = 95,
                    CreatedDate = DateTime.UtcNow.AddDays(-60).ToString("o"),
                    LastUpdated = DateTime.UtcNow.AddDays(-1).ToString("o"),
                    Payers = new List
                    {
                        new PayerData
                        {
                            PayerId = "PAYER-003",
                            PayerName = "UnitedHealthcare",
                            Status = "Ready",
                            ReadinessStatus = "Ready",
                            Requirements = new List
                            {
                                new Requirement { RequirementId = "REQ-011", RequirementName = "Medical License", Status = "Met", DocumentId = "DOC-005" },
                                new Requirement { RequirementId = "REQ-012", RequirementName = "DEA Certificate", Status = "Met", DocumentId = "DOC-006" },
                                new Requirement { RequirementId = "REQ-013", RequirementName = "Malpractice Insurance", Status = "Met", DocumentId = "DOC-007" },
                                new Requirement { RequirementId = "REQ-014", RequirementName = "Board Certification", Status = "Met", DocumentId = "DOC-008" },
                                new Requirement { RequirementId = "REQ-015", RequirementName = "CV", Status = "Met", DocumentId = "DOC-009" }
                            }
                        }
                    },
                    Documents = new List
                    {
                        new Document { DocumentId = "DOC-005", DocumentName = "MA Medical License", DocumentType = "License", UploadDate = DateTime.UtcNow.AddDays(-55).ToString("o"), ExpirationDate = DateTime.UtcNow.AddYears(2).ToString("o") },
                        new Document { DocumentId = "DOC-006", DocumentName = "DEA Registration", DocumentType = "Certificate", UploadDate = DateTime.UtcNow.AddDays(-50).ToString("o"), ExpirationDate = DateTime.UtcNow.AddYears(3).ToString("o") },
                        new Document { DocumentId = "DOC-007", DocumentName = "Malpractice Insurance Certificate", DocumentType = "Insurance", UploadDate = DateTime.UtcNow.AddDays(-45).ToString("o"), ExpirationDate = DateTime.UtcNow.AddYears(1).ToString("o") },
                        new Document { DocumentId = "DOC-008", DocumentName = "Pediatrics Board Certification", DocumentType = "Certificate", UploadDate = DateTime.UtcNow.AddDays(-40).ToString("o") },
                        new Document { DocumentId = "DOC-009", DocumentName = "Current CV", DocumentType = "Credential", UploadDate = DateTime.UtcNow.AddDays(-35).ToString("o") }
                    }
                }
            };
        }
    }
}