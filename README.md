# Provider Enrollment Work Management System

## Epic: PRDENRLMT01

This application implements a comprehensive Provider Enrollment Work Management system for healthcare credentialing coordinators and enrollment managers.

## Features

### Epic QE-6017: Provider Enrollment Application Work Management
- List and detail views for active provider enrollment applications
- Readiness status buckets (Ready to Submit, Incomplete, Expiring Soon)
- Payer-level status aggregation and display
- Dashboard with counts by status category
- Drill-down by coordinator and payer
- Prioritized work queue based on risk/priority scores

### Epic QE-6018: Payer Rule Set Management and Versioning
- Configurable library of payer-specific requirement rule sets
- Versioning with effective dates
- Support for required documents and data fields per payer
- Admin-configurable rules
- Pre-built rule sets for top payers

### Epic QE-6019: Automated Readiness Classification and Deficiency Guidance
- Automated evaluation against payer rule sets
- Status assignment at application, payer, and requirement levels
- Priority and risk scoring
- Requirement-level deficiency details with actionable recommendations
- Expiration tracking with configurable alert thresholds

## Technology Stack

### Frontend
- Angular (Standalone Components)
- TypeScript
- Responsive CSS

### Backend
- .NET 8.0 (C#)
- ASP.NET Core Web API
- JSON file-based data storage
- Swagger/OpenAPI documentation

## Project Structure

```
├── index.html
├── src/
│   └── app/
│       ├── applications/          # Application list and detail components
│       ├── rule-sets/             # Rule set management components
│       ├── dashboard/             # Dashboard component
│       ├── services/              # Angular services
│       ├── models/                # TypeScript interfaces
│       └── styles/                # Global styles
├── Backend/
│   ├── Controllers/               # API controllers
│   ├── Services/                  # Business logic services
│   ├── Models/                    # Data models
│   ├── Data/                      # Repository layer and JSON data files
│   ├── Program.cs                 # Application entry point
│   └── appsettings.json          # Configuration
└── README.md
```

## API Endpoints

### Applications
- `GET /api/applications` - Get all applications
- `GET /api/applications/{id}` - Get application by ID
- `POST /api/applications` - Create new application
- `PUT /api/applications/{id}` - Update application
- `DELETE /api/applications/{id}` - Delete application

### Rule Sets
- `GET /api/rulesets` - Get all rule sets
- `GET /api/rulesets/{id}` - Get rule set by ID
- `GET /api/rulesets/effective?payerId={id}&submissionDate={date}` - Get effective rule set
- `POST /api/rulesets` - Create new rule set
- `PUT /api/rulesets/{id}` - Update rule set
- `DELETE /api/rulesets/{id}` - Delete rule set

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Readiness
- `POST /api/readiness/evaluate` - Evaluate application readiness
- `GET /api/readiness/history/{applicationId}` - Get evaluation history

## Setup Instructions

### Backend Setup
1. Navigate to the Backend directory
2. Restore dependencies: `dotnet restore`
3. Run the application: `dotnet run`
4. API will be available at `http://localhost:5000`
5. Swagger UI available at `http://localhost:5000/swagger`

### Frontend Setup
1. Open `index.html` in a web browser or serve via a local web server
2. Ensure the backend API is running on `http://localhost:5000`

## User Stories Implemented

### QE-6020: Application Readiness List View
Credentialing coordinators can view a list of active provider enrollment applications with readiness statuses.

### QE-6021: Priority-Based Work Queue Sorting
Enrollment managers can sort applications by risk or priority score to focus on urgent applications.

### QE-6022: Configurable Payer Rule Library
Admin users can configure payer-specific rule sets with required documents and data fields.

### QE-6023: Versioned Rules With Effective Dates
Payer rule sets support versioning with effective dates for accurate historical evaluations.

### QE-6024: Automated Readiness Status Evaluation
Applications are automatically evaluated against payer rule sets with accurate readiness statuses.

### QE-6025: Deficiency Guidance and Priority Scoring
Requirement-level deficiency details and priority scores help coordinators address urgent items.

## Compliance

- HIPAA Security Rule and Privacy Rule compliant
- Auditable configuration changes
- Secure handling of ePHI (Electronic Protected Health Information)

## Performance Considerations

- Responsive list and dashboard views for large volumes
- Near real-time status evaluation
- Optimized for multiple payers per application
- Scalable rule set evaluation

## License

Proprietary - Healthcare Provider Enrollment System