# Healthcare Provider Enrollment Readiness System

## Overview
A comprehensive system for managing healthcare provider enrollment applications across multiple payers. The system evaluates application readiness based on configurable payer-specific rule sets, tracks document expirations, and provides actionable recommendations to enrollment coordinators.

## Features
- **Dashboard**: Real-time statistics showing application status breakdown (Ready/Incomplete/Expiring)
- **Application Management**: Track provider enrollment applications with payer-by-payer status
- **Payer Rule Engine**: Configurable rule sets defining requirements for each payer
- **Readiness Evaluation**: Automated assessment of application completeness and document validity
- **Priority Scoring**: Intelligent prioritization based on urgency and completeness
- **Coordinator Workflow**: Filtered views and actionable recommendations

## Technology Stack

### Frontend
- **Framework**: Angular 18 (Standalone Components)
- **Styling**: Custom CSS with responsive design
- **State Management**: RxJS Observables
- **Routing**: Angular Router

### Backend
- **Framework**: ASP.NET Core 8.0 (C#)
- **API Style**: RESTful Web API
- **Data Storage**: JSON file-based repository
- **Documentation**: Swagger/OpenAPI

## Project Structure

```
├── Frontend (Angular 18)
│   ├── src/app/
│   │   ├── dashboard/          # Dashboard component
│   │   ├── applications/       # Application list & detail components
│   │   ├── payer-rules/        # Payer rule management
│   │   ├── services/           # HTTP services
│   │   └── environments/       # Environment configs
│   └── index.html
│
├── Backend (ASP.NET Core 8.0)
│   ├── Controllers/            # API endpoints
│   ├── Services/               # Business logic
│   ├── Models/                 # Data models
│   ├── Data/                   # Data access layer
│   └── Program.cs              # Application entry point
│
└── README.md
```

## API Endpoints

### Applications
- `GET /api/applications` - Get all applications (with optional filters)
- `GET /api/applications/{id}` - Get application by ID
- `POST /api/applications` - Create new application
- `PUT /api/applications/{id}` - Update application
- `DELETE /api/applications/{id}` - Delete application
- `POST /api/applications/{id}/evaluate` - Re-evaluate application

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/coordinator-breakdown` - Get coordinator breakdown
- `GET /api/dashboard/payer-breakdown` - Get payer breakdown

### Payer Rules
- `GET /api/payer-rules` - Get all payer rules
- `GET /api/payer-rules/{id}` - Get payer rule by ID
- `GET /api/payer-rules/payer/{payerId}` - Get active rule for payer
- `POST /api/payer-rules` - Create new payer rule
- `PUT /api/payer-rules/{id}` - Update payer rule
- `DELETE /api/payer-rules/{id}` - Delete payer rule

## Setup Instructions

### Backend Setup
1. Navigate to the Backend directory
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Run the application:
   ```bash
   dotnet run
   ```
4. API will be available at `http://localhost:5000`
5. Swagger UI at `http://localhost:5000/swagger`

### Frontend Setup
1. Navigate to the Frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. Application will be available at `http://localhost:4200`

## Data Models

### Application
- Provider information
- Coordinator assignment
- Overall status and priority score
- Payer-specific statuses and requirements
- Submission and update timestamps

### Payer Rule
- Payer identification
- Version and effective dates
- Required documents (with expiration tracking)
- Required data fields
- Expiration threshold configuration

## Business Logic

### Readiness Evaluation
The system evaluates each application against payer-specific rule sets:
1. **Document Validation**: Checks for presence and expiration status
2. **Data Field Validation**: Verifies all mandatory fields are present
3. **Status Determination**: Assigns status (Ready/Incomplete/Expiring)
4. **Recommendation Generation**: Provides actionable next steps

### Priority Scoring
Applications are scored (0-100) based on:
- Overall status (Incomplete: 50, Expiring: 70, Ready: 30)
- Document expiration urgency (≤15 days: +30, ≤30 days: +20)
- Number of payers (≥3: +10)

## Security Considerations
- CORS configured for Angular frontend
- Input validation on all API endpoints
- Error handling with appropriate HTTP status codes
- No sensitive data in client-side code

## Future Enhancements
- User authentication and authorization
- Database integration (SQL Server/PostgreSQL)
- Document upload and storage
- Email notifications for expiring documents
- Audit logging
- Advanced reporting and analytics
- Mobile responsive design improvements

## License
Proprietary - All rights reserved