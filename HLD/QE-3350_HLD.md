# High-Level Design (HLD) – QE-3350 – Monthly Spending Summary Dashboard

## 1. Architecture Overview

The "Monthly Spending Summary Dashboard" is a responsive, multi-channel web experience that exposes credit-card spending insights, card-level metrics, transaction analytics, filters, and basic budgeting views. It is built as a secure, scalable, enterprise-grade solution with:

- **Client Layer**: Browser-based SPA (and responsive layouts for mobile/tablet/desktop) consuming REST/GraphQL APIs.
- **Edge/API Layer**: API Gateway and Web/API services offering endpoints for dashboard summary, cards, transactions, filters, and analytics.
- **Domain Services Layer**: Business services for card management, transaction management, analytics & reporting, and budgeting.
- **Data Layer**: Card, transaction, and budget stores optimized for analytical queries and secure retrieval; plus a read-optimized reporting store.
- **Integration Layer**: Interfaces to upstream systems (e.g., core card systems, statement feeds, categorization engines) via asynchronous ingestion.
- **Cross-Cutting Concerns**: Authentication, authorization, observability, audit logging, input validation, secrets management, configuration, and resiliency patterns.

All dashboard calculations (monthly spend, utilization, budgets) are computed in the domain services and exposed via read-only APIs. No PII/PCI sample values are exposed in logs or documentation; fields are described abstractly.


## 2. Logical Component Diagram

```mermaid
flowchart LR
    subgraph Client_Layer[Client Layer]
        WEB_UI[Responsive Web UI (SPA)]
    end

    subgraph Edge_Layer[Edge / API Layer]
        API_GW[API Gateway]
        DASH_API[Dashboard API Service]
    end

    subgraph Domain_Layer[Domain Services]
        CARD_SVC[Card Management Service]
        TXN_SVC[Transaction Management Service]
        ANALYTICS_SVC[Spending Analytics Service]
        BUDGET_SVC[Budget Tracking Service]
        SUMMARY_SVC[Dashboard Summary Aggregator]
    end

    subgraph Data_Layer[Data & Storage]
        CARD_DB[(Card Store)]
        TXN_DB[(Transaction Store)]
        BUDGET_DB[(Budget Store)]
        ANALYTICS_DB[(Reporting & Analytics Store)]
    end

    subgraph Integration_Layer[Integration Layer]
        CORE_CARD_SYS[(Core Card & Billing System)]
        TXN_FEEDS[(Transaction Feed Ingestion)]
        CATEGORY_ENGINE[(Categorization Engine)]
    end

    subgraph Cross_Cutting[Cross-cutting Services]
        AUTH_SVC[Authentication & Session Service]
        RBAC_SVC[RBAC/ABAC Authorization]
        AUDIT_SVC[Audit Logging Service]
        OBS_SVC[Monitoring & Observability]
        CONFIG_SVC[Config & Secrets Vault]
    end

    WEB_UI --> API_GW
    API_GW --> AUTH_SVC
    API_GW --> DASH_API

    DASH_API --> SUMMARY_SVC
    DASH_API --> CARD_SVC
    DASH_API --> TXN_SVC
    DASH_API --> ANALYTICS_SVC
    DASH_API --> BUDGET_SVC
    DASH_API --> RBAC_SVC
    DASH_API --> AUDIT_SVC

    CARD_SVC --> CARD_DB
    TXN_SVC --> TXN_DB
    BUDGET_SVC --> BUDGET_DB
    ANALYTICS_SVC --> ANALYTICS_DB

    SUMMARY_SVC --> CARD_DB
    SUMMARY_SVC --> TXN_DB
    SUMMARY_SVC --> BUDGET_DB
    SUMMARY_SVC --> ANALYTICS_DB

    TXN_FEEDS --> TXN_DB
    CORE_CARD_SYS --> CARD_DB
    CORE_CARD_SYS --> BUDGET_DB
    CATEGORY_ENGINE --> TXN_DB

    DASH_API --> OBS_SVC
    TXN_SVC --> OBS_SVC
    ANALYTICS_SVC --> OBS_SVC
    BUDGET_SVC --> OBS_SVC

    CONFIG_SVC --> DASH_API
    CONFIG_SVC --> DOMAIN_Layer
```


## 3. Component Descriptions

### 3.1 Client Layer

**Responsive Web UI (SPA)**
- Provides the monthly spending summary dashboard in a single-page application.
- Implements responsive layout for mobile, tablet, and desktop, including reflow of cards, tables, and charts.
- Presents widgets for:
  - Monthly summary metrics (spend, limit, available credit, outstanding amount, utilization percentage, number of transactions).
  - Multi-card view (per card details with masked card number and billing/due dates).
  - Transaction table with columns for date, merchant, category, card used, amount, payment status, remarks.
  - Filters and search controls (merchant, category, bank, card, date range, sort by amount/date).
  - Analytics visualizations (category-wise spending, monthly trend, card-wise distribution, category breakdown).
  - Budget tracking metrics (monthly budget, current spend, remaining budget, budget utilization percentage, progress bar).
  - Recent transactions widget showing most recent entries.
- Handles only presentation; does not store sensitive data beyond the user session. Masking/encryption handled by backend.

### 3.2 Edge / API Layer

**API Gateway**
- Single-entry point for client requests (HTTPS).
- Performs request routing to Dashboard API service based on URL and method.
- Enforces global security policies: TLS termination, rate limiting, API keys/tenant headers, basic WAF rules.
- Integrates with Authentication & Session Service to validate tokens.

**Dashboard API Service**
- Exposes REST/GraphQL endpoints for dashboard features:
  - GET /dashboard/summary – total monthly spend, total credit limit, available credit, outstanding amount, utilization %, number of transactions.
  - GET /cards – list of credit cards with card metadata (masked card number) and limits.
  - GET /transactions – paginated list of transactions with filters and sorting.
  - GET /analytics/category – category-wise spending.
  - GET /analytics/monthly-trend – monthly spending trend.
  - GET /analytics/card-distribution – card-wise spending distribution.
  - GET /budget – budget metrics for the selected month.
  - GET /transactions/recent – latest 5 transactions.
- Orchestrates calls into domain services and prepares response DTOs tailored to UI needs.
- Applies validation, authorization, and audit logging for all protected endpoints.

### 3.3 Domain Services Layer

**Card Management Service**
- Maintains card portfolio for the authenticated user within allowed scope.
- Provides card summary: card name, issuing bank, masked card number, credit limit, available credit, current outstanding, billing date, due date.
- Computes per-card metrics from card store and transaction store where required.
- Enforces card-level permissions (only cards belonging to current user context).

**Transaction Management Service**
- Manages retrieval and filtering of transaction data.
- Applies filters: merchant search, category, bank, card, date range; sorts by amount and date.
- Returns page-oriented response suitable for responsive table rendering.
- Integrates with categorization engine to ensure each transaction has a category.

**Spending Analytics Service**
- Aggregates transaction data to produce analytical views:
  - Category-wise spending for a selected period.
  - Monthly spending trends over configurable time windows.
  - Card-wise spending distribution (e.g., pie chart per card).
  - Category breakdown across the defined categories (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous).
- Writes summarized results to analytics store to allow efficient reads.

**Budget Tracking Service**
- Maintains and exposes monthly budget settings and utilization metrics.
- Computes current spend, remaining budget, and budget utilization percentage from transaction data.
- Provides progress-bar friendly outputs (e.g., percentage, status: under/near/over).

**Dashboard Summary Aggregator**
- Composes high-level dashboard metrics:
  - Total monthly spend (across cards in scope).
  - Total credit limit and available credit (per portfolio).
  - Outstanding amount.
  - Utilization percentage (spend vs. total credit or defined limit).
  - Number of transactions for the period.
- Coordinates with Card, Transaction, Analytics, and Budget services, then returns consolidated summary.

### 3.4 Data Layer

**Card Store**
- Holds non-sensitive card metadata used by the dashboard (card identifiers, masked card reference, issuing institution, limit, billing and due dates).
- Does not store full card numbers or CVV values; only safe identifiers required for display.
- Indexed by user/account context and card ID.

**Transaction Store**
- Stores normalized transaction records:
  - Transaction identifiers, timestamps, merchant descriptors, category identifiers, card references, amounts, payment status, remarks.
- Indexed by user, card, category, merchant, and date to support filters.
- Designed for high-volume writes from ingestion and optimized reads for analytics.

**Budget Store**
- Holds per-user/per-period budget configuration and state (e.g., monthly budget amount and metadata).
- Stores aggregated budget states (current spend, remaining budget) when precomputed.

**Reporting & Analytics Store**
- Holds precomputed aggregates for category-wise spending, monthly trends, card-wise distributions.
- Enables performant queries for chart generation without scanning full transaction history each request.

### 3.5 Integration Layer

**Core Card & Billing System Integration**
- Ingests card and billing data from upstream card management systems.
- Updates card store with credit limits, available credit, current outstanding, billing and due dates.
- Uses batch or streaming interfaces; sensitive data is reduced to masked references before persistence.

**Transaction Feed Ingestion**
- Receives transaction feeds from payment networks or card processors.
- Normalizes transactions and persists them into transaction store.
- Associates categories via categorization engine and handles idempotency to avoid duplicate records.

**Categorization Engine**
- Assigns categories (Food & Dining, Fuel, etc.) to transactions based on merchant code, descriptors, rules, or models.
- Can be an internal service or third-party integration; results written into transaction store.

### 3.6 Cross-Cutting Services

**Authentication & Session Service**
- Handles login, token issuance, and session management.
- Exposes user identity and tenant context to the API Gateway and Dashboard API.

**RBAC/ABAC Authorization Service**
- Evaluates access policies based on roles (e.g., consumer, support analyst) and attributes (e.g., tenant, portfolio ownership).
- Ensures dashboard data is restricted to authorized context.

**Audit Logging Service**
- Captures significant actions (dashboard access, filter changes that export data, budget updates if enabled later).
- Logs are structured and avoid storing raw card numbers or other PCI data.

**Monitoring & Observability Service**
- Centralized collection of metrics, traces, and logs for all services.
- Provides dashboards and alerts for performance, error rates, and availability.

**Config & Secrets Vault**
- Stores connection strings, API keys for upstream systems, and encryption keys.
- Provides runtime configuration to API and domain services via secure APIs.


## 4. Integration Points & Data Flows

### Flow 1 – Authentication & Session Establishment
1. User accesses the dashboard via browser; WEB_UI triggers authentication if no session exists.
2. WEB_UI redirects to Authentication & Session Service (via API Gateway or IdP UI) and performs login.
3. Authentication service issues a secure token (e.g., JWT or opaque session token).
4. WEB_UI stores token in secure browser storage and includes it in Authorization header for subsequent calls.
5. API Gateway validates token with Authentication & Session Service and forwards authorized requests to Dashboard API.

**Scope coverage**: Enables secure access for dashboard summary, card management, transaction display, filters, analytics, budget, and recent transactions.

### Flow 2 – Dashboard Summary Retrieval
1. WEB_UI calls GET /dashboard/summary through API Gateway with user token and selected month.
2. API Gateway validates token and forwards to Dashboard API.
3. Dashboard API invokes Dashboard Summary Aggregator with user context and period.
4. Summary Aggregator obtains card portfolio from Card Management Service (which reads from Card Store).
5. Summary Aggregator queries Transaction Management Service for transactions in the period from Transaction Store.
6. Summary Aggregator (optionally) consults Spending Analytics Service for precalculated metrics from Analytics Store.
7. Summary Aggregator computes:
   - Total monthly spend.
   - Total credit limit.
   - Available credit.
   - Outstanding amount.
   - Utilization percentage.
   - Number of transactions.
8. Dashboard API returns summary DTO to WEB_UI.
9. WEB_UI renders summary section.

**Scope coverage**: Dashboard Summary, Total Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount, Utilization Percentage, Number of Transactions.

### Flow 3 – Multi-Card Management View
1. WEB_UI calls GET /cards via API Gateway.
2. Dashboard API invokes Card Management Service with user context.
3. Card Management Service queries Card Store for all cards associated with the user.
4. Card Management Service enriches results with real-time balances if required (from Core Card & Billing System or cached).
5. Dashboard API masks card identifiers (e.g., last 4 digits only) and returns card DTOs.
6. WEB_UI renders card tiles/list showing card name, issuing bank, masked card reference, credit limit, available credit, current outstanding, billing dates, and due dates.

**Scope coverage**: Credit Card Management; display multiple credit cards with card details.

### Flow 4 – Transaction Table with Filters & Search
1. WEB_UI calls GET /transactions with query parameters (merchant search, category, bank, card, date range, sorting options).
2. API Gateway validates token and forwards to Dashboard API.
3. Dashboard API validates request parameters (e.g., allowed categories, date ranges) and invokes Transaction Management Service.
4. Transaction Management Service builds query against Transaction Store using filters and sorting.
5. Transaction Management Service retrieves results, including columns: transaction date, merchant, category, card, amount, payment status, remarks.
6. Dashboard API returns paginated transaction DTOs.
7. WEB_UI renders a responsive table with the results and pagination controls.

**Scope coverage**: Transaction Management; display transactions table; search and filter by merchant, category, bank, card, date range; sort by amount and date.

### Flow 5 – Spending Analytics (Charts)
1. WEB_UI calls GET /analytics/category, /analytics/monthly-trend, /analytics/card-distribution as needed.
2. API Gateway forwards authorized calls to Dashboard API.
3. Dashboard API invokes Spending Analytics Service for each requested analytic.
4. Spending Analytics Service queries Analytics Store and/or Transaction Store to compute aggregations for:
   - Category-wise spending.
   - Monthly spending trend.
   - Card-wise spending distribution.
   - Category breakdown across defined categories.
5. Analytics results returned to Dashboard API, then to WEB_UI.
6. WEB_UI renders charts (e.g., bar charts, line graphs, pie charts) per analytic.

**Scope coverage**: Spending Analytics; category-wise spending, monthly trend, card-wise distribution, category breakdown.

### Flow 6 – Budget Tracking & Progress Bar
1. WEB_UI calls GET /budget for a selected month.
2. API Gateway forwards to Dashboard API after auth validation.
3. Dashboard API invokes Budget Tracking Service.
4. Budget Tracking Service reads budget configuration from Budget Store.
5. Budget Tracking Service queries Transaction Store for spending in the period.
6. Budget Tracking Service computes current spend, remaining budget, and utilization percentage; updates Budget Store if persistence of computed values is required.
7. Dashboard API returns budget DTO including numeric values and statuses.
8. WEB_UI renders budget section and progress bar.

**Scope coverage**: Budget Tracking; monthly budget, current spend, remaining budget, budget utilization %, progress bar.

### Flow 7 – Recent Transactions Widget
1. WEB_UI calls GET /transactions/recent with a limit (e.g., 5).
2. Dashboard API routes to Transaction Management Service.
3. Transaction Management Service queries Transaction Store for most recent transactions by date for the user.
4. Results returned as compact DTO set to Dashboard API.
5. Dashboard API sends response to WEB_UI.
6. WEB_UI displays latest 5 transactions in the dedicated widget.

**Scope coverage**: Recent Transactions Widget; show latest 5 transactions.

### Flow 8 – Observability & Audit
1. For each incoming request, Dashboard API emits structured logs (request ID, user ID/tenant ID, endpoint, status) to Monitoring & Observability Service.
2. Domain services emit metrics (latency, throughput, error counts) and traces for internal calls.
3. Audit Logging Service records security-sensitive events (access to dashboard, filter operations that may trigger exports, etc.).
4. Observability platform correlates logs and metrics for centralized dashboards.

**Scope coverage**: Observability for dashboard behavior and traceability of access and usage.


## 5. Security & Compliance Features

### 5.1 Transport Security
- All client-to-server communication secured with TLS 1.2+.
- API Gateway acts as TLS termination point; internal service calls can use mutual TLS where required.

### 5.2 Data Encryption
- Sensitive fields in Card Store and Transaction Store encrypted at rest using strong encryption (e.g., AES-256) where applicable.
- Configuration and secrets (e.g., connection strings, external API keys) stored encrypted in Config & Secrets Vault.

### 5.3 Input Validation
- API Gateway and Dashboard API validate all query parameters and request bodies:
  - Enforce strict type and length constraints for merchant search, categories, banks, cards, date ranges.
  - Reject malformed or out-of-range dates and numeric values.
  - Sanitize user-supplied text (e.g., remarks) to prevent injection attacks.

### 5.4 Output Filtering & Data Minimization
- Card identifiers displayed only in masked form (e.g., last 4 digits, masked prefix).
- Response payloads constrained to required fields for dashboard display; no unnecessary PII/PCI fields returned.
- Audit logs and observability events avoid storing raw transaction amounts tied to personally identifiable details; use identifiers and aggregates where possible.

### 5.5 RBAC/ABAC
- Access control enforced at Dashboard API and domain services using RBAC/ABAC policies.
- Policies ensure:
  - Users see only their own card and transaction data within their tenant context.
  - Support roles only access aggregated or anonymized views (if enabled in future epics; out of scope here for implementation but acknowledged as a boundary).

### 5.6 Audit Logging
- Audit Logging Service records:
  - Successful/failed dashboard access events.
  - Data-access actions that may be sensitive (e.g., exporting transactions via filters).
- Logs include timestamp, user identifier, operation type, outcome; no sensitive card numbers or personal identifiers.

### 5.7 Secrets Management
- All service credentials, encryption keys, and external integration secrets stored in Config & Secrets Vault.
- Services obtain secrets at runtime via secure channels; secrets are not stored in application config files or code.

### 5.8 Compliance Mapping
- The design avoids exposure of full card numbers or CVV values and masks card references, aligning with secure handling expectations for card-related data.
- For regulatory and enterprise policy compliance (e.g., internal security baselines), encryption and access control patterns are enforced.
- Specific external standards (e.g., PCI-DSS) are not explicitly designed here unless mandated in a separate epic; this design remains compatible with future hardening.


## 6. Resiliency & Error Handling

### 6.1 Retry Mechanisms
- Internal service-to-service calls (Dashboard API to domain services) use bounded retries with exponential backoff for transient errors.
- Ingestion interfaces to upstream card and transaction feeds also use retry on network/transient failures.

### 6.2 Circuit Breakers
- Circuit breakers applied on calls to external integrations (Core Card & Billing System, Transaction Feeds, Categorization Engine).
- When a downstream system is unhealthy, calls are short-circuited and fallback data (cached or last-known-good values) may be returned when compatible with accuracy requirements.

### 6.3 Timeouts
- All HTTP and DB calls have explicit, reasonable timeouts to prevent hanging requests.
- Dashboard API enforces max response time budgets; slow sub-calls are aborted and surfaced as controlled errors.

### 6.4 Graceful Degradation
- If analytics service or store is unavailable, dashboard still serves core summary and transaction lists, with analytics sections marked as temporarily unavailable.
- If budget service is unavailable, dashboard can omit budget section or show a clear message without failing the whole page.

### 6.5 Error Handling Strategy
- Common error types and responses:
  - 400 Bad Request – malformed parameters (e.g., invalid date range, unknown categories); message indicates which field is invalid without exposing stack traces.
  - 401 Unauthorized – missing/invalid token; message instructs user to log in.
  - 403 Forbidden – token valid but no rights to requested resource; message states access is not permitted.
  - 404 Not Found – requested resource not found (e.g., card reference not in portfolio); message avoids revealing whether a card exists for other users.
  - 429 Too Many Requests – rate limits exceeded; response suggests user retry later.
  - 500 Internal Server Error – unexpected failure; message is generic, detailed context logged internally.
- Error payloads are sanitized and standardized, exposing only correlation IDs and high-level messages.

### 6.6 Observability
- Services emit:
  - Metrics: request count, latency, error rates, utilization metrics by endpoint.
  - Logs: structured with correlation IDs for each request and internal call.
  - Traces: distributed tracing for chains of calls (Gateway → API → Domain Services → DB).
- Dashboards and alerts created for:
  - API latency and availability.
  - DB performance.
  - Error spikes in domain services.


## 7. Validation Report

### 7.1 Requirements Coverage (Scope Mapping)

For the Epic QE-3350, the following "Scope (High Level)" items inferred from the description are covered:

1. **Dashboard Summary (Total Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount, Utilization Percentage, Number of Transactions)**
   - Components: Dashboard API Service, Dashboard Summary Aggregator, Card Management Service, Transaction Management Service, Card Store, Transaction Store.
   - Flows: Flow 2 – Dashboard Summary Retrieval.

2. **Credit Card Management – Display Multiple Credit Cards with Card Details**
   - Components: Dashboard API Service, Card Management Service, Card Store, Core Card & Billing System Integration.
   - Flows: Flow 3 – Multi-Card Management View.

3. **Transaction Management – Responsive Table with Transaction Date, Merchant, Category, Card Used, Amount, Payment Status, Remarks**
   - Components: Dashboard API Service, Transaction Management Service, Transaction Store, Categorization Engine.
   - Flows: Flow 4 – Transaction Table with Filters & Search.

4. **Filters and Search – Search by Merchant; Filter by Category, Bank, Card, Date Range; Sort by Amount and Date**
   - Components: Dashboard API Service, Transaction Management Service, Transaction Store.
   - Flows: Flow 4 – Transaction Table with Filters & Search.

5. **Spending Analytics – Category-wise Spending, Monthly Spending Trend, Card-wise Spending Distribution, Category Breakdown**
   - Components: Dashboard API Service, Spending Analytics Service, Reporting & Analytics Store, Transaction Store.
   - Flows: Flow 5 – Spending Analytics (Charts).

6. **Defined Spending Categories (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous)**
   - Components: Categorization Engine, Transaction Management Service, Transaction Store, Spending Analytics Service.
   - Flows: Flow 5 – Spending Analytics (Charts) and Flow 4 – Transaction Table with Filters & Search.

7. **Budget Tracking – Monthly Budget, Current Spend, Remaining Budget, Budget Utilization %, Progress Bar**
   - Components: Dashboard API Service, Budget Tracking Service, Budget Store, Transaction Store.
   - Flows: Flow 6 – Budget Tracking & Progress Bar.

8. **Recent Transactions Widget – Show Latest 5 Transactions**
   - Components: Dashboard API Service, Transaction Management Service, Transaction Store.
   - Flows: Flow 7 – Recent Transactions Widget.

9. **Responsive Design – Mobile Friendly, Tablet Friendly, Desktop Friendly**
   - Components: Responsive Web UI (SPA).
   - Flows: Flow 1 – Authentication & Session Establishment (for initial access); subsequent flows utilize responsive layout for all endpoints.

10. **Observability & Audit (Implied enterprise requirement)**
    - Components: Monitoring & Observability Service, Audit Logging Service, Dashboard API, Domain Services.
    - Flows: Flow 8 – Observability & Audit.

### 7.2 Compliance Status

- **Transport Security**: **Pass**
  - TLS enforced at API Gateway; secure communication designed end-to-end.

- **Data Encryption at Rest and in Transit**: **Pass-with-conditions**
  - Design specifies encryption for sensitive data and secrets; actual key management policies and crypto algorithms depend on enterprise security standards and must be configured.

- **Input Validation & Output Filtering**: **Pass**
  - Strong validation on filters and search parameters; response payloads constrained and masked.

- **RBAC/ABAC Enforcement**: **Pass-with-conditions**
  - Authorization model and enforcement points defined; role and attribute taxonomy must be finalized by security/governance teams.

- **Audit Logging**: **Pass-with-conditions**
  - Audit events and structure defined; retention periods and access controls for logs must align with organizational policies.

- **Secrets Management**: **Pass**
  - All secrets managed via Config & Secrets Vault; no secrets in code or configs.

- **Regulatory Compliance (e.g., PCI-Related Constraints)**: **Pass-with-conditions**
  - Design avoids storing or exposing full card numbers and CVV and supports masking; formal certification against external standards, if required, must be handled by separate compliance processes.

### 7.3 Identified Ambiguities / Risks

1. **Ambiguity: Exact Definition of "Monthly" Period**
   - Consequence: Inconsistent calculation of monthly spend, budget utilization, and trends across systems (calendar month vs. billing cycle).
   - Mitigation: Define a canonical period (e.g., billing cycle vs. calendar month) in requirements and configure Dashboard Summary Aggregator and Budget Tracking Service to use that definition. Expose configuration in Config & Secrets Vault.

2. **Ambiguity: Scope of Budget Modification Capabilities**
   - Consequence: Risk of misalignment if UI is expected to allow users to modify budgets while this epic is focused on read-only tracking, or vice versa.
   - Mitigation: Clarify whether users can create/update budgets within this epic or in future epics. If out of scope, ensure APIs expose only read operations and UI controls for editing are not implemented yet.

3. **Ambiguity: Support/User Roles Beyond End-User Access**
   - Consequence: RBAC/ABAC policies may be incomplete, affecting security posture for non-consumer roles.
   - Mitigation: Define role model separately (e.g., consumer vs. operations vs. support) and update authorization service policies. Treat advanced support views as out of scope for this epic.

4. **Risk: Dependency on External Systems (Card & Transaction Feeds)**
   - Consequence: Dashboard accuracy depends on timely ingestion of card balances and transactions; outages in upstream systems degrade data freshness.
   - Mitigation: Implement data freshness indicators in the UI, retries and circuit breakers in integration layer, and alerts on ingestion lag. Consider caching last-known-good data with clear labeling.

5. **Risk: Performance Under High Transaction Volume**
   - Consequence: Filters and analytics queries may degrade in performance for large histories.
   - Mitigation: Optimize Transaction Store indexes; employ Analytics Store for pre-aggregations; implement pagination and query limits; load-test key endpoints.

6. **Risk: Category Assignment Quality from Categorization Engine**
   - Consequence: Misclassified transactions may lead to misleading charts and budget utilization views.
   - Mitigation: Add reconciliation mechanisms and correction workflows in future epics; for this epic, display categories as provided by engine and consider flagging "uncategorized" as Miscellaneous.


## 8. Out-of-Scope Acknowledgements

Although the Epic description focuses on dashboard and analytics, certain related aspects are explicitly treated as out of scope for this design:

- **Payment execution flows** (e.g., paying outstanding balances) and associated APIs.
- **Detailed card application or lifecycle management** (card issuance, closure, limit change self-service).
- **Support/admin consoles for monitoring user portfolios** beyond aggregated observability.
- **Manual transaction categorization workflows** (user-driven recategorization and training of categorization engine).
- **Regulatory certification processes** for specific standards (e.g., PCI-DSS certification), though design remains compatible with future compliance work.

These boundaries are explicitly recognized to avoid architectural coupling; integration points can be extended in future epics without refactoring core dashboard services.
