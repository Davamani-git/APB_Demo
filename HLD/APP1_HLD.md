# AI Portfolio Management Dashboard – High-Level Design (HLD) and Domain Model

## Validation Report

**Requirements Coverage Checklist:**
- [x] Aggregates AI usage data from AWS, Azure, GCP (FR1, AC1)
- [x] Real-time view of usage/spend for all portfolio companies (FR2)
- [x] Role-based access control and user management (FR3, AC2)
- [x] Automated alerts for budget threshold (FR4, AC3)
- [x] Export reports in PDF/Excel (FR5, AC5)
- [x] Data freshness indicators and notifications (FR6, AC4)
- [x] Drill-down analytics and benchmarking (FR7, FR9, AC6)
- [x] Customizable dashboard widgets (FR8)
- [x] User lockout recovery (US10, AC7)
- [x] Accessibility (NFR, AC8)
- [x] Security: AES-256/TLS 1.3, audit logging, RBAC/ABAC, secrets mgmt (NFR)
- [x] Compliance: data retention, consent mgmt, data lineage, reporting (NFR)
- [x] Error handling: retries, logging, circuit breaker (NFR)
- [x] Non-functional: <3s load, 99.5% uptime, 1,000 users, WCAG 2.1 AA

**Compliance:**
- Security (input validation, encryption, RBAC, audit logging, secrets management)
- Data protection (data retention, consent management, data lineage, reporting)
- Accessibility (WCAG 2.1 AA)

**Error Handling:**
- Retries for API/data ingest, circuit breaker for integrations
- Logging for failed access, export, and sync attempts

## Domain Model (ERD/UML)

```mermaid
erDiagram
    User ||--o{ UserRole : has
    UserRole }o--|| Role : assigns
    User ||--o{ Integration : configures
    User ||--o{ AccessLog : generates
    User ||--o{ ReportExport : requests
    PortfolioCompany ||--o{ AIUsageRecord : owns
    PortfolioCompany ||--o{ Integration : connects
    PortfolioCompany ||--o{ BudgetThreshold : sets
    PortfolioCompany ||--o{ Alert : triggers
    AIUsageRecord }o--|| DataFreshnessIndicator : updates
    ReportExport ||--|| ReportFile : generates

    User {
        string userId
        string email
        string name
        string status
        datetime createdAt
        datetime lastLogin
    }
    Role {
        string roleId
        string name
        string description
    }
    UserRole {
        string userId
        string roleId
        string companyId
    }
    PortfolioCompany {
        string companyId
        string name
        string industry
        string region
    }
    Integration {
        string integrationId
        string provider (AWS/Azure/GCP)
        string companyId
        string status
        datetime lastSync
        string apiKey (encrypted)
    }
    AIUsageRecord {
        string recordId
        string companyId
        string provider
        string service
        float usageAmount
        float spend
        datetime recordDate
        string department
        string project
    }
    DataFreshnessIndicator {
        string recordId
        datetime lastUpdate
        bool isFresh
    }
    BudgetThreshold {
        string companyId
        float thresholdAmount
        string currency
        datetime setDate
    }
    Alert {
        string alertId
        string companyId
        string type (Budget, DataFreshness)
        string message
        datetime triggeredAt
        bool acknowledged
    }
    AccessLog {
        string logId
        string userId
        string action
        datetime timestamp
        string ip
    }
    ReportExport {
        string exportId
        string userId
        string companyId
        string format (PDF/Excel)
        datetime requestedAt
    }
    ReportFile {
        string exportId
        string filePath
        datetime generatedAt
    }
```

## High-Level Design Document

### 1. Architecture Overview

```
+-------------------+    +-------------------------+    +--------------------+
|  User Interface   |    |   API Gateway & BFF     |    |  Notification Svc  |
|  (Web Dashboard)  |--->|  (Input/Output Filter)  |--->|  (Alerts/Emails)   |
+-------------------+    +-------------------------+    +--------------------+
         |                        |                              |
         v                        v                              v
  +----------------------+   +--------------------+   +-------------------------+
  |   Auth Service       |   |  AI Usage Engine   |   |  Reporting & Export Svc |
  |  (SSO, RBAC/ABAC)   |   | (Data Aggregation, |   | (PDF/Excel Generation)  |
  +----------------------+   |  Freshness Check)  |   +-------------------------+
         |                        |                              |
         v                        v                              v
   +--------------------+   +-------------------+   +-----------------------+
   | Cloud Integrations |   | Portfolio DB      |   | Audit Log DB          |
   | (AWS/Azure/GCP)    |   | (AI Usage, Users) |   | (Access, Exports)     |
   +--------------------+   +-------------------+   +-----------------------+
         |                        |                              |
         v                        v                              v
   +--------------------+   +-------------------+   +-----------------------+
   | Secrets Manager    |   | Encryption Module |   | Consent/Data Retention|
   +--------------------+   +-------------------+   +-----------------------+
```

### 2. Major Components

- **Web Dashboard**: Responsive UI for all personas; supports accessibility.
- **API Gateway/BFF**: Input validation, output filtering, API versioning.
- **Authentication**: Integrates with SSO, enforces RBAC/ABAC.
- **Integration Layer**: Secure connectors to AWS, Azure, GCP APIs; retries, circuit breaker patterns.
- **AI Usage Engine**: Aggregates, normalizes, and analyzes usage and spend data.
- **Alerting Service**: Monitors thresholds, data freshness; sends email/notification via Notification Svc.
- **Reporting Service**: On-demand or scheduled export to PDF/Excel; audit logs all exports.
- **Audit/Access Logging**: Tracks user actions, export/downloads, admin operations.
- **Secrets Management**: All credentials/API keys stored encrypted (e.g., HashiCorp Vault, KMS).
- **Encryption Module**: All data at rest (AES-256) and in transit (TLS 1.3+).
- **Consent/Data Retention**: Manages user/company data consent, retention, and compliance reporting.

### 3. Integration Points

- **Cloud APIs**: AWS, Azure, GCP for ingesting AI usage/spend; extensible for future providers.
- **SSO Provider**: Enterprise authentication, user provisioning.
- **Notification/Email**: For alerts, budget notifications, lockout recovery.

### 4. Security & Compliance Features

- **Input Validation/Output Filtering**: At API Gateway and all ingestion points.
- **Encryption**: AES-256 at rest, TLS 1.3+ in transit.
- **RBAC/ABAC**: Fine-grained, company- and role-scoped access. Roles: Admin, Operating Partner, Deal Partner, General Partner.
- **Audit Logging**: All access, exports, and admin actions; immutable logs.
- **Secrets Management**: API keys and credentials encrypted and access-controlled.
- **Consent Management**: User consent tracked and auditable.
- **Data Retention**: Configurable per company; automated data purging per policy.
- **Data Lineage**: Track source, transformations, and flow of AI usage data.
- **Compliance Reporting**: Automated reports for audits and regulatory checks.

### 5. Data Flow

1. **User logs in (SSO), authenticated, RBAC context loaded.**
2. **Admin configures integrations; credentials stored in Secrets Manager.**
3. **Data Ingest Service polls/receives data from cloud APIs; data validated, normalized, encrypted at rest.**
4. **AI Usage Engine processes data; updates Portfolio DB, checks thresholds, triggers alerts as needed.**
5. **Dashboard queries Portfolio DB (read replicas for scale), renders analytics, benchmarks, and freshness indicators.**
6. **Users export reports; all exports logged, files encrypted, delivered via secure download.**
7. **Audit logs and consent changes sent to Compliance subsystem for retention and reporting.**

### 6. Error Handling Patterns

- **Retries & Backoff**: For all cloud API/data ingest operations
- **Circuit Breaker**: For integrations to prevent cascading failures
- **Comprehensive Logging**: All errors, warnings, and failed attempts to access/export data
- **Alerting**: For integration failures, data staleness, and security events

---

## Appendix

- **WCAG 2.1 AA Accessibility Matrix**: Keyboard navigation, high contrast, ARIA labels
- **Regulatory Considerations**: GDPR, CCPA, data residency (where applicable)
- **Extensibility**: Modular integration layer for new cloud/AI providers
- **Scalability**: Horizontal scaling of data ingest and dashboard services
