# AI Portfolio Management Dashboard - High Level Design (HLD)

## Domain Model (UML Class Diagram)

```
+--------------------+         +-------------------+         +-------------------+
|    User            |         |   PortfolioCompany|         |   AIProvider      |
+--------------------+         +-------------------+         +-------------------+
| userId: UUID       |<------->| companyId: UUID   |<------->| providerId: UUID  |
| name: String       |         | name: String      |         | name: String      |
| email: String      |         | aiUsage: List     |         | apiEndpoint: URL  |
| role: Enum         |         | budgetThreshold:  |         | integrationStatus |
| status: Enum       |         | dataFreshness:    |         | ...               |
| lastLogin: Date    |         | ...               |         |                   |
+--------------------+         +-------------------+         +-------------------+
     |                       |                        |
     |                       |                        |
     |                       |                        |
     v                       v                        v
+---------------------+   +---------------------+  +---------------------+
|   AuditLog          |   |   Report            |  |   Alert             |
+---------------------+   +---------------------+  +---------------------+
| logId: UUID         |   | reportId: UUID      |  | alertId: UUID       |
| userId: UUID        |   | companyId: UUID     |  | companyId: UUID     |
| action: String      |   | generatedBy: UUID   |  | triggeredBy: String |
| timestamp: Date     |   | type: Enum          |  | type: Enum          |
| status: Enum        |   | createdAt: Date     |  | createdAt: Date     |
+---------------------+   +---------------------+  +---------------------+
```

### Key Entities & Relationships:
- User (Enterprise Admin, Operating Partner, Deal Partner, General Partner)
- PortfolioCompany (AI usage, spend, budget thresholds, data freshness)
- AIProvider (AWS, Azure, GCP, niche platforms)
- Report (PDF, Excel)
- Alert (budget threshold, data freshness)
- AuditLog (access, actions)

## High-Level Design Document

### 1. Architecture Overview

**Cloud-based microservices architecture**:
- **Frontend**: React/Angular SPA dashboard
- **Backend**: Node.js/Java Spring Boot REST APIs
- **Data Layer**: PostgreSQL + Redis cache
- **Integration Layer**: Secure connectors to AWS, Azure, GCP APIs
- **Authentication**: SSO integration (OAuth2/SAML)
- **Reporting Service**: PDF/Excel generation
- **Alerting Service**: Real-time notifications
- **Audit Logging**: Centralized log store

#### Architecture Diagram

```
[User] --> [SPA Dashboard] <--> [API Gateway] <--> [Microservices]
                                   |
                                   v
                           [Integration Service]
                                   |
                                   v
                        [Cloud Provider APIs]
                                   |
                                   v
                              [Data Store]
```

### 2. Major Components

- **Dashboard UI**: Real-time data visualization, drill-down analytics, customizable widgets, accessibility (WCAG 2.1 AA)
- **Integration Service**: Automated data ingestion from AWS, Azure, GCP, extensible for niche platforms
- **User Management**: Role-based access control (RBAC), SSO, lockout recovery
- **Reporting Service**: Export to PDF/Excel, custom report generation
- **Alerting Service**: Budget threshold, data freshness alerts
- **Benchmarking Analytics**: Compare AI adoption/spend across companies and industry
- **Audit Logging**: Tracks access, actions, and unauthorized attempts

### 3. Integration Points

- **Cloud Providers**: Secure API connections (TLS 1.3), automated data sync, versioning for API changes
- **SSO Providers**: OAuth2/SAML, consent management
- **Reporting Tools**: PDF/Excel export

### 4. Security & Compliance Features

- **Input Validation**: Strict schema checks on all API inputs
- **Output Filtering**: Prevents data leaks, XSS, and injection attacks
- **Encryption**: AES-256 for data at rest, TLS 1.3 for data in transit
- **RBAC/ABAC**: Role-based and attribute-based access control
- **Audit Logging**: All access and actions recorded
- **Secrets Management**: Vault-based storage for API keys and credentials
- **Consent Management**: User consent tracked for integrations
- **Data Retention**: Configurable retention policies, daily backups
- **Data Lineage**: Track source, transformation, and destination of data
- **Compliance Reporting**: Automated logs and reports for regulatory audits

### 5. Data Flow

1. User logs in via SSO, permissions validated.
2. Dashboard queries API Gateway for portfolio/company data.
3. Integration Service fetches AI usage from cloud provider APIs.
4. Data stored in PostgreSQL, cached in Redis for performance.
5. Alerts generated based on spend/data freshness rules.
6. Reports exported via Reporting Service.
7. Audit logs captured for all actions.

### 6. Enterprise Error Handling

- **Retries**: Automated retry for API calls (exponential backoff)
- **Logging**: Centralized error and access logs
- **Circuit Breaker**: Protects against API outages
- **User Notifications**: Clear error messages, lockout recovery flows

### 7. Compliance Checklist

- [x] Data encrypted at rest/in transit (AES-256/TLS 1.3)
- [x] Role-based access control
- [x] Audit logging for all access/actions
- [x] Consent management for integrations
- [x] Data retention and daily backups
- [x] Accessibility (WCAG 2.1 AA)
- [x] Compliance reporting (logs, exports)

### 8. Requirements Validation Report

| Requirement | Coverage | Compliance | Error Handling |
|-------------|----------|-----------|---------------|
| Data aggregation (AWS/Azure/GCP) | Yes | Yes | Yes |
| Real-time dashboard | Yes | Yes | Yes |
| RBAC | Yes | Yes | Yes |
| Alerts (budget/data freshness) | Yes | Yes | Yes |
| Report export | Yes | Yes | Yes |
| Drill-down analytics | Yes | Yes | Yes |
| Benchmarking | Yes | Yes | Yes |
| Accessibility | Yes | Yes | Yes |
| Audit logging | Yes | Yes | Yes |
| Lockout recovery | Yes | Yes | Yes |
| Compliance features | Yes | Yes | Yes |

---

**All requirements from PRD are covered, validated, and compliant.**
