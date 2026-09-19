# VK004Demo - Rule-Based Credentialing Readiness Engine

## Overview
This application delivers a deterministic, rule-based engine that evaluates provider enrollment applications and associated documents against payer-specific credentialing requirements to determine readiness for submission.

## Epic Coverage

### Epic QE-6002: Rule-Based Credentialing Readiness Engine
**User Stories Implemented:**
- QE-6005: Deterministic Readiness Classification Engine
- QE-6006: Traceable Rule-Based Explanations

### Epic QE-6003: Document Metadata Capture and Expiration Management
**User Stories Implemented:**
- QE-6007: Structured Document Metadata Capture
- QE-6008: Expiration Tracking and Alerting

### Epic QE-6004: Credentialing Coordinator and Manager Readiness Workflows
**User Stories Implemented:**
- QE-6009: Coordinator Readiness Work Queue
- QE-6010: Manager Pipeline Dashboard Reporting

## Technology Stack

### Frontend
- Vanilla JavaScript (ES6 Modules)
- HTML5 & CSS3
- Component-based architecture

### Backend
- .NET 8.0 (C#)
- ASP.NET Core Web API
- JSON file-based data storage
- RESTful API architecture

## Features

### 1. Work Queue Management (QE-6009)
- View all active provider enrollment applications
- Display readiness status (Ready to Submit, Incomplete, Expiring Soon)
- Drill down into application details
- View payer-by-payer breakdown
- Requirement-level status tracking

### 2. Document Metadata Management (QE-6007, QE-6008)
- Capture structured document metadata
- Track expiration dates
- Identify expired and expiring documents
- Support for multiple document types:
  - Medical License
  - DEA Certificate
  - Malpractice Insurance
  - Board Certification
  - State License
  - NPI Certificate

### 3. Readiness Engine (QE-6005, QE-6006)
- Deterministic rule-based evaluation
- Payer-specific rule sets with versioning
- Configurable expiring threshold (default: 90 days)
- Traceable explanations for all decisions
- Batch evaluation of all applications
- Rule-level audit trail

### 4. Manager Dashboard (QE-6010)
- Portfolio-level visibility
- KPI tracking:
  - Total applications
  - Ready to submit count
  - Incomplete count
  - Expiring soon count
  - Average days to ready
  - Completion rate
  - Rejection rate
- At-risk applications identification
- Payer breakdown analysis
- Risk level assessment

### 5. Explanation Views (QE-6006)
- Human-readable explanations
- Rule set version tracking
- Requirement-level details
- Actionable recommendations
- Full audit trail

## API Endpoints

### Applications
- `GET /api/application` - Get all applications
- `GET /api/application/{id}` - Get application by ID
- `GET /api/application/{id}/details` - Get detailed application view
- `POST /api/application` - Create new application
- `PUT /api/application/{id}` - Update application
- `DELETE /api/application/{id}` - Delete application

### Documents
- `GET /api/document` - Get all documents
- `GET /api/document/{id}` - Get document by ID
- `GET /api/document/application/{applicationId}` - Get documents by application
- `GET /api/document/expiring?thresholdDays=90` - Get expiring documents
- `GET /api/document/expired` - Get expired documents
- `POST /api/document` - Create new document
- `PUT /api/document/{id}` - Update document
- `DELETE /api/document/{id}` - Delete document

### Rule Sets
- `GET /api/ruleset` - Get all rule sets
- `GET /api/ruleset/{id}` - Get rule set by ID
- `GET /api/ruleset/payer/{payerId}` - Get active rule set for payer
- `POST /api/ruleset` - Create new rule set
- `PUT /api/ruleset/{id}` - Update rule set
- `DELETE /api/ruleset/{id}` - Delete rule set

### Readiness Evaluation
- `POST /api/readiness/evaluate/{applicationId}` - Evaluate single application
- `POST /api/readiness/evaluate-all` - Evaluate all applications
- `GET /api/readiness/explanation/{applicationId}/{payerId}` - Get explanation
- `GET /api/readiness/status/{applicationId}` - Get application status

### Dashboard
- `GET /api/dashboard/manager` - Get manager dashboard
- `GET /api/dashboard/coordinator/{coordinatorId}` - Get coordinator dashboard

## Data Models

### Application
- ID, Provider Name, Start Date
- Readiness Status
- Payer References
- Coordinator Assignment
- Timestamps

### Document
- ID, Application ID
- Document Type, Number
- Issue Date, Expiration Date
- Issuing Authority
- Notes, Timestamps

### Rule Set
- ID, Payer Name, Payer ID
- Version, Effective Date
- Expiring Threshold
- Required Documents List
- Required Fields List
- Rule Description

### Readiness Evaluation
- Application ID
- Evaluation Date
- Overall Status
- Payer Evaluations (with requirement-level details)

## Setup Instructions

### Backend Setup
1. Navigate to Backend directory
2. Restore dependencies: `dotnet restore`
3. Run the application: `dotnet run`
4. API will be available at `http://localhost:5000`
5. Swagger UI at `http://localhost:5000/swagger`

### Frontend Setup
1. Open `index.html` in a modern web browser
2. Or use a local server:
   ```bash
   npx http-server -p 8080
   ```
3. Access at `http://localhost:8080`

## Sample Data

The application includes sample data:
- 3 provider applications (APP-001, APP-002, APP-003)
- 5 credentialing documents
- 3 payer rule sets (BCBS, United Healthcare, Aetna)

## Key Design Decisions

1. **Rule-Based Architecture**: Deterministic evaluation ensures auditability and regulatory compliance
2. **Versioned Rule Sets**: Supports historical evaluation and payer requirement changes
3. **JSON Storage**: Simple file-based storage for demo purposes (production would use database)
4. **Component Architecture**: Modular frontend design for maintainability
5. **RESTful API**: Standard HTTP methods and status codes
6. **Separation of Concerns**: Clear separation between services, controllers, and data access

## NFR Compliance

- **Deterministic**: All decisions traceable to named rules
- **Performance**: Supports 20-50 active applications per coordinator
- **Auditability**: Full versioning and explanation tracking
- **Scalability**: Batch processing with on-demand refresh
- **Data Integrity**: Validation at API and service layers

## Future Enhancements

- OCR integration for document metadata extraction
- Email notifications for expiring documents
- Advanced reporting and analytics
- Integration with payer portals
- Role-based access control
- Real-time status updates via WebSockets

## License
Internal Use Only - AAVA™ Product Studio

## Support
For questions or issues, contact the development team.