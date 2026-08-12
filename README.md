# AI Portfolio Management Dashboard

Production-ready AngularJS 1.7.x application for managing AI portfolio investments across multiple cloud providers.

## Features

### Data Infrastructure (Epic QE-4267)
- **QE-4274**: Multi-Cloud AI Data Integration
  - AWS, Azure, GCP integration via `cloudProviderFactory`
  - Real-time usage data collection with `dataCollectionService`
  - Currency normalization and data transformation

- **QE-4275**: Data Freshness Monitoring Alerts
  - Automated staleness detection (24-hour threshold)
  - Real-time alerting via `freshnessMonitorService` and `alertService`
  - Visual indicators for stale data

### Security & RBAC (Epic QE-4268)
- **QE-4272**: Role-Based Access Control Configuration
  - Fine-grained permissions via `rbacService` and `authorizationService`
  - Route-level access control with `routeGuard`
  - UI element visibility control with `rbac-show` directive

- **QE-4273**: User Lockout Recovery Management
  - User lock/unlock functionality in `userManagementService`
  - Password reset workflows
  - Audit logging for all access attempts

### Analytics & Reporting (Epic QE-4269)
- **QE-4270**: Consolidated Real-Time Portfolio Dashboard
  - Real-time portfolio summary with drill-down capabilities
  - Interactive charts via Chart.js integration
  - Company-level cost breakdown and trends

- **QE-4271**: Automated Budget Threshold Alerts
  - Configurable budget thresholds
  - Automated monitoring every 30 minutes via `budgetAlertService`
  - Multi-channel notifications (in-app, email)

## Architecture

```
src/app/
├── app.module.js          # Module definitions
├── app.config.js          # Routing and HTTP interceptors
├── app.css                # Global styles
├── services/              # Shared services
│   ├── authService.js
│   ├── authInterceptor.js
│   ├── auditLogService.js
│   ├── notificationService.js
│   ├── alertService.js
│   ├── notificationFactory.js
│   └── dataStorageService.js
└── modules/
    ├── data-infrastructure/
    │   ├── factories/
    │   ├── services/
    │   └── controllers/
    ├── security/
    │   ├── services/
    │   └── directives/
    ├── admin/
    │   ├── services/
    │   └── controllers/
    ├── analytics/
    │   ├── filters/
    │   ├── services/
    │   ├── directives/
    │   └── controllers/
    └── reporting/
        ├── services/
        └── controllers/
```

## Installation

1. Clone the repository
2. Open `index.html` in a web server (required for AngularJS routing)
3. Configure backend API endpoints in each service

## Backend API Requirements

The application expects the following REST endpoints:

### Authentication
- `POST /api/auth/sso/login`
- `GET /api/auth/sso/logout`

### Data Infrastructure
- `POST /api/integrations/{provider}/connect`
- `GET /api/integrations/{provider}/usage`
- `POST /api/aggregated-data`
- `GET /api/aggregated-data`
- `GET /api/aggregated-data/freshness`
- `POST /api/alerts/freshness`

### RBAC & Security
- `GET /api/rbac/roles`
- `GET /api/rbac/roles/{roleId}/permissions`
- `POST /api/rbac/users/{userId}/roles`
- `DELETE /api/rbac/users/{userId}/roles/{roleId}`
- `POST /api/audit/log`

### User Management
- `GET /api/users`
- `POST /api/users/{userId}/lock`
- `POST /api/users/{userId}/unlock`
- `POST /api/users/{userId}/reset-password`

### Analytics
- `GET /api/dashboard/portfolio-summary`
- `GET /api/dashboard/companies/{companyId}`
- `GET /api/analytics/trends`
- `GET /api/analytics/forecasts`
- `GET /api/budgets/check-thresholds`

### Notifications
- `POST /api/notifications/send`

### Reporting
- `POST /api/reports/generate`
- `GET /api/reports/{reportId}/export`

## User Stories Implemented

- ✅ **QE-4270**: Consolidated Real-Time Portfolio Dashboard
- ✅ **QE-4271**: Automated Budget Threshold Alerts
- ✅ **QE-4272**: Role-Based Access Control Configuration
- ✅ **QE-4273**: User Lockout Recovery Management
- ✅ **QE-4274**: Multi-Cloud AI Data Integration
- ✅ **QE-4275**: Data Freshness Monitoring Alerts

## Technology Stack

- AngularJS 1.7.9
- Lodash 4.17.21
- Moment.js 2.29.4
- Chart.js 2.9.4

## Security Features

- JWT-based authentication
- HTTP interceptor for automatic token injection
- Role-based access control (RBAC)
- Audit logging for all access attempts
- Session management
- Route guards

## Monitoring & Alerts

- Data freshness monitoring (24-hour staleness threshold)
- Budget threshold alerts (30-minute check interval)
- Real-time in-app notifications
- Multi-channel alert delivery

## License

Proprietary - All rights reserved
