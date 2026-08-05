# Low-Level Design (LLD): AI Portfolio Management Dashboard

## 1. Component Specifications

### 1.1. Dashboard UI
- **Framework:** React (preferred) or Angular
- **Accessibility:** WCAG 2.1 AA compliance via ARIA roles, semantic HTML, keyboard navigation, color contrast
- **Widgets:** Modular components (usage, spend, alerts, reports, benchmarks)
- **Customizability:** User profile stores widget layout/preferences
- **Drill-down Analytics:** Dynamic routing, context-based filters
- **Error Handling:** Global error boundary, notification banners

### 1.2. API Layer
- **Technology:** Node.js (Express) or Java (Spring Boot) or .NET Core
- **Authentication:** SSO (OAuth2, SAML), JWT session tokens
- **Endpoints:**
  - `/companies` (GET, POST, PUT, DELETE)
  - `/ai-integrations` (GET, POST, PUT, DELETE)
  - `/departments` (GET, POST, PUT, DELETE)
  - `/projects` (GET, POST, PUT, DELETE)
  - `/users` (GET, POST, PUT, DELETE)
  - `/alerts` (GET, POST, PUT, DELETE)
  - `/reports` (GET, POST)
  - `/audit-logs` (GET)
- **Validation:** OpenAPI schema, Joi/Yup validation middleware
- **Rate Limiting:** API gateway throttling

### 1.3. Data Layer
- **DB Engine:** Azure SQL or PostgreSQL
- **Schema:** Matches domain model (see below)
- **Encryption:** Transparent Data Encryption (TDE), field-level AES-256 for sensitive fields
- **ORM:** Sequelize (Node.js), Hibernate (Java), EF Core (.NET)
- **Backups:** Automated daily, geo-redundant

### 1.4. Integration Manager
- **Function:** Scheduled sync jobs (cron, cloud scheduler)
- **Providers:** AWS, Azure, GCP (SDK-based, REST API fallback)
- **Error Handling:** Exponential backoff, circuit breaker (Hystrix/Polly)
- **Secrets:** Managed in Azure Key Vault/AWS Secrets Manager
- **Logging:** Per-integration logs, error metrics

### 1.5. Reporting Engine
- **Export:** PDF (jsPDF, iText), Excel (SheetJS)
- **Custom Reports:** Dynamic query builder, user-defined filters
- **Scheduling:** Async background jobs (BullMQ, Hangfire)

### 1.6. Alerting System
- **Thresholds:** Configurable per company, project, or department
- **Detection:** Budget overrun, anomaly (z-score, ML-based optional)
- **Notification:** Email (SMTP, SendGrid), webhooks, dashboard toasts
- **Resolution:** Alert state management, audit log entry

### 1.7. Audit Logging
- **Scope:** All user/admin actions, config changes, access attempts
- **Immutability:** Append-only, tamper-evident (write-once storage)

### 1.8. Data Freshness Monitor
- **Indicators:** Last sync timestamp, color-coded status
- **Notifications:** Stale data alerts via UI and email

---

## 2. Data Flows

### 2.1. User Authentication
1. User accesses dashboard, redirected to SSO provider
2. On success, receives JWT token, session established
3. User info/roles loaded, dashboard personalized

### 2.2. AI Usage/Spend Sync
1. Scheduled job triggers Integration Manager
2. For each company/provider, fetches AI usage/spend data
3. Data validated, transformed, stored (encrypted)
4. Data freshness monitor updates status
5. Alerts generated if thresholds breached

### 2.3. Reporting
1. User requests report via UI
2. API triggers report job (PDF/Excel)
3. Report generated, stored, user notified
4. Audit log updated with report action

### 2.4. Alert Workflow
1. Budget/anomaly detected
2. Alert created, notification sent
3. User acknowledges/resolves alert
4. State change logged in AuditLog

---

## 3. Sequence Diagrams (Textual)

### 3.1. AI Data Sync
```
User/Job Scheduler -> Integration Manager: Trigger sync
Integration Manager -> CloudProviderAPI: Fetch usage/spend
CloudProviderAPI -> Integration Manager: Return data
Integration Manager -> Data Layer: Store data (encrypted)
Integration Manager -> Data Freshness Monitor: Update status
Integration Manager -> Alert System: Trigger alert if needed
```

### 3.2. Report Generation
```
User -> Dashboard UI: Request report
Dashboard UI -> API Layer: POST /reports
API Layer -> Reporting Engine: Generate report
Reporting Engine -> Data Layer: Fetch data
Reporting Engine -> Data Layer: Store report
Reporting Engine -> API Layer: Notify ready
API Layer -> Dashboard UI: Report ready/download
API Layer -> AuditLog: Log report action
```

### 3.3. Alert Handling
```
Integration Manager -> Alert System: Budget breach detected
Alert System -> User: Send notification
User -> Dashboard UI: View/resolve alert
Dashboard UI -> API Layer: Update alert status
API Layer -> AuditLog: Log resolution
```

---

## 4. Implementation Details

### 4.1. Security
- **API Gateway:** Enforces authentication, input validation, rate limiting
- **Encryption:** All PII and sensitive data encrypted at rest (AES-256), TLS 1.3 in transit
- **RBAC:** Enforced in API and UI; permission checks on every endpoint/action
- **Secrets:** Never hardcoded, always in vaults
- **Audit:** All access, changes, and exports logged
- **Compliance:** Data retention, consent, and lineage enforced by scheduled jobs

### 4.2. Reliability
- **Retries:** Exponential backoff for all integrations
- **Circuit Breaker:** Prevents cascading failures
- **Failover:** Cloud DB with geo-redundancy, backup restore scripts
- **Monitoring:** Centralized logs, error dashboards, alerting

### 4.3. Accessibility & UX
- **ARIA roles, keyboard shortcuts, screen reader support
- **Customizable widgets, responsive layouts

### 4.4. DevOps
- **CI/CD:** Automated build, test, deploy (GitHub Actions/Azure Pipelines)
- **IaC:** Terraform/Bicep for cloud infra
- **Secrets:** Managed in cloud vaults
- **Monitoring:** AppInsights, CloudWatch, Stackdriver

---

## 5. Database Schema (Entity Definitions)

- **PortfolioCompany**: id (PK), name, industry, aiSpend, aiUsage, departments[]
- **AIIntegration**: id (PK), companyId (FK), providerId (FK), integrationType, lastSync, status
- **CloudProvider**: id (PK), name, apiEndpoint, providerType
- **Department**: id (PK), name, aiUsage, projects[]
- **Project**: id (PK), name, aiUsage
- **User**: id (PK), name, email, role, assignedCompanies[], lastLogin
- **Role**: id (PK), name, permissions[]
- **Alert**: id (PK), companyId (FK), type, threshold, triggeredAt, resolved
- **Report**: id (PK), companyId (FK), generatedBy, generatedAt, format, content
- **AuditLog**: id (PK), userId (FK), action, timestamp, details

---

## 6. Compliance Mapping

| Requirement                           | LLD Section(s)         |
|----------------------------------------|------------------------|
| Secure API integration                 | 1.4, 4.1              |
| RBAC & user management                 | 1.2, 1.3, 4.1          |
| Audit logging & compliance             | 1.7, 4.1, 4.4, 6       |
| Data encryption & retention            | 1.3, 4.1, 4.4          |
| Accessibility (WCAG 2.1 AA)            | 1.1, 4.3               |
| Automated reporting & alerting         | 1.5, 1.6, 2.3, 2.4     |
| Error handling & reliability           | 1.4, 4.2               |
| Data freshness, anomaly detection      | 1.8, 2.2, 2.4          |
| Customizable dashboard                 | 1.1, 4.3               |
| Cloud-native secrets management        | 1.4, 4.1, 4.4          |

---

**This LLD is based on the HLD for WesTest2 and fully covers all functional, non-functional, security, and compliance requirements as outlined in the PRD and HLD.**
