# High-Level Design (HLD) – QE-3413 – Monthly Spending Summary Dashboard v3

## 1. Architecture Overview

### 1.1 Purpose and Context
The solution provides a monthly spending summary dashboard for credit card customers in a web banking application. It calculates and displays monthly total spend, key summary KPIs, and a basic breakdown of spend for a user-selected month. The dashboard acts as an entry point into deeper insights, but detailed transaction management and non-credit-card products are explicitly excluded.

### 1.2 High-Level Architecture
The architecture follows a layered, enterprise-grade pattern:

- **Client Layer** – Web frontend rendered in the existing online banking channel, responsible for month selection, visual presentation of KPIs, and basic breakdown charts/cards.
- **API / Edge Layer** – Secure, stateless REST/GraphQL API behind an API gateway, providing endpoints to retrieve monthly spend summaries and breakdown data.
- **Domain Services Layer** – Application services implementing business logic for monthly credit card spend aggregation and KPI computation.
- **Data Access and Stores Layer** – Read-only access to normalized credit card transaction and account data; possible use of a read-optimized reporting store or cache for performance.
- **Integration Layer** – Services connecting to existing credit card ledger/transaction systems and customer profile services, via secure service-to-service communication.
- **Cross-Cutting Concerns** – Authentication/authorization, input validation, observability, audit logging, configuration and secrets management, and compliance-aligned data handling.

This design satisfies the following high-level requirements:
- Monthly total credit card spend calculation.
- Monthly summary KPIs (e.g., total spend, transaction count).
- Visual representation of monthly spend on the web dashboard.
- Month selection to view a specific month’s summary.
- Basic breakdown of spend to serve as an entry point into deeper insights.

Non-credit-card products and detailed transaction-level management are out of scope and are explicitly excluded from components and flows.

## 2. Architecture Diagram (Mermaid)

```mermaid
flowchart LR
    subgraph ClientLayer[Client Layer]
        WEB_UI[Web Banking UI - Monthly Spend Dashboard]
    end

    subgraph EdgeLayer[API / Edge Layer]
        API_GW[API Gateway]
        MSSD_API[Monthly Spend Summary API]
    end

    subgraph DomainLayer[Domain Services Layer]
        MSS_SVC[Monthly Spend Summary Service]
        KPI_SVC[Summary KPI Computation Service]
        BRK_SVC[Spend Breakdown Service]
    end

    subgraph DataLayer[Data Access & Stores]
        CC_TXN_DB[Credit Card Transactions Store]
        CC_ACCT_DB[Credit Card Accounts Store]
        RPT_STORE[Reporting / Aggregation Store]
        CACHE[Summary Cache]
    end

    subgraph IntegrationLayer[Integration Layer]
        LEDGER_SVC[Credit Card Ledger Service]
        CUST_SVC[Customer Profile Service]
    end

    subgraph CrossCutting[Cross-Cutting Concerns]
        AUTH_SVC[Authentication & Session]
        RBAC_SVC[Authorization (RBAC/ABAC)]
        AUDIT_SVC[Audit Logging]
        OBS_SVC[Monitoring & Tracing]
        CONF_SEC[Config & Secrets Management]
    end

    WEB_UI -- HTTPS + Auth Token --> API_GW
    API_GW --> AUTH_SVC
    API_GW --> MSSD_API

    MSSD_API --> MSS_SVC
    MSSD_API --> KPI_SVC
    MSSD_API --> BRK_SVC

    MSS_SVC --> CACHE
    MSS_SVC --> RPT_STORE
    MSS_SVC --> CC_TXN_DB
    MSS_SVC --> CC_ACCT_DB
    MSS_SVC --> LEDGER_SVC

    KPI_SVC --> RPT_STORE
    KPI_SVC --> CC_TXN_DB

    BRK_SVC --> RPT_STORE
    BRK_SVC --> CC_TXN_DB

    LEDGER_SVC --> CC_TXN_DB
    LEDGER_SVC --> CC_ACCT_DB

    CUST_SVC --> CC_ACCT_DB

    MSSD_API --> AUDIT_SVC
    MSSD_API --> OBS_SVC
```

## 3. Component Descriptions

### 3.1 Web Banking UI – Monthly Spend Dashboard (WEB_UI)
- **Role**: Presents the monthly spending summary to authenticated credit card customers within the existing online banking interface.
- **Responsibilities**:
  - Render UI controls to select the month (e.g., dropdown/calendar limited to permitted date range).
  - Display monthly total spend and summary KPIs (e.g., total spend amount, number of transactions, average transaction value).
  - Render basic breakdown visualization such as bar charts or summary cards (e.g., spend by high-level category or spend vs. credit limit).
  - Handle navigation to deeper insights views (which may be handled by separate features/epics) without implementing detailed transaction management.
- **Scope Compliance**: Covers visual representation of monthly spend, month selection, and basic breakdown.
- **Explicit Exclusions**:
  - Does not provide non-credit-card product views (e.g., checking accounts, loans).
  - Does not implement detailed transaction-level operations such as dispute, categorize, or export – those are out of scope and delegated to other modules.

### 3.2 API Gateway (API_GW)
- **Role**: Centralized entry point for client traffic, enforcing transport security, request routing, and coarse-grained access control.
- **Responsibilities**:
  - Terminate TLS connections from the client and enforce HTTPS-only communication.
  - Validate auth tokens and route authorized requests to `MSSD_API`.
  - Apply rate limiting and basic threat protection (e.g., request size limits, malformed payload rejection).
- **Explicit Exclusions**:
  - No business logic for computing spend or KPIs.

### 3.3 Monthly Spend Summary API (MSSD_API)
- **Role**: Edge API providing monthly spend summary data to the web UI.
- **Responsibilities**:
  - Define endpoints such as `GET /credit-cards/{cardId}/monthly-summary?month=YYYY-MM`.
  - Validate path and query parameters (e.g., month format, cardId association with authenticated user).
  - Invoke domain services (`MSS_SVC`, `KPI_SVC`, `BRK_SVC`) to fetch and assemble response payload.
  - Enforce authorization rules so that customers can only access their own card data.
  - Ensure responses contain high-level summary data only – no detailed transaction list.
- **Explicit Exclusions**:
  - No APIs for non-credit-card products.
  - No endpoints exposing detailed transaction management actions.

### 3.4 Monthly Spend Summary Service (MSS_SVC)
- **Role**: Core domain service responsible for aggregating monthly credit card spend.
- **Responsibilities**:
  - Compute total spend for the given month by aggregating posted (and optionally pending, if defined by product rules) credit card transactions from `CC_TXN_DB`.
  - Apply business rules for inclusion/exclusion (e.g., reversed transactions, fees, adjustments) according to agreed product definitions.
  - Provide a normalized “monthly summary” domain object that can be consumed by KPI and breakdown services.
  - Optimize performance via use of `RPT_STORE` and `CACHE` for frequently accessed months.
- **Explicit Exclusions**:
  - Does not mutate ledger or transaction records.
  - Does not support non-credit-card accounts.

### 3.5 Summary KPI Computation Service (KPI_SVC)
- **Role**: Computes key performance indicators for the monthly spending summary.
- **Responsibilities**:
  - Derive summary KPIs such as number of transactions, average transaction amount, highest transaction amount, and utilization versus credit limit (if available).
  - Use aggregated data from `RPT_STORE` or directly from `CC_TXN_DB` where necessary.
  - Expose results to `MSSD_API` as part of the monthly summary payload.
- **Explicit Exclusions**:
  - No predictive analytics or advanced forecasting – limited to basic KPIs supporting awareness.

### 3.6 Spend Breakdown Service (BRK_SVC)
- **Role**: Provides a basic breakdown of monthly spend to help customers understand patterns.
- **Responsibilities**:
  - Group transactions into high-level buckets (e.g., spend by merchant category group, online vs. in-store, domestic vs. international), as agreed with product management.
  - Expose aggregated breakdown metrics only; no transactional details.
  - Provide data structures suitable for driving charts/cards in the UI.
- **Explicit Exclusions**:
  - No detailed, drill-down transaction management; deeper insights or category management features are assumed to be implemented in separate epics.

### 3.7 Credit Card Transactions Store (CC_TXN_DB)
- **Role**: Authoritative store of credit card transaction records.
- **Responsibilities**:
  - Provide query interfaces for fetching transactions filtered by card, month, and relevant criteria (e.g., posted status, currency).
  - Support read-only access by domain services for aggregation and breakdown.
- **Explicit Exclusions**:
  - No schema or logic for non-credit-card products.

### 3.8 Credit Card Accounts Store (CC_ACCT_DB)
- **Role**: Stores credit card account data (e.g., account identifiers, credit limit, ownership relationships).
- **Responsibilities**:
  - Allow domain services to validate that a card belongs to the requesting customer.
  - Provide metadata such as credit limit for KPI computation.
- **Explicit Exclusions**:
  - Account-level operations like limit changes or account servicing workflows.

### 3.9 Reporting / Aggregation Store (RPT_STORE)
- **Role**: Read-optimized store or data mart for reporting and summary queries.
- **Responsibilities**:
  - Maintain pre-aggregated or materialized views to speed up monthly summary calculations.
  - Support analytics-friendly querying while still adhering to credit card-only scope.
- **Explicit Exclusions**:
  - Non-credit-card data sets are outside scope of this epic.

### 3.10 Summary Cache (CACHE)
- **Role**: In-memory or distributed cache for frequently accessed monthly summaries.
- **Responsibilities**:
  - Cache summary responses keyed by `(customerId, cardId, month)` to reduce load.
  - Apply cache expiration policies aligned to transaction posting schedules.
- **Explicit Exclusions**:
  - Caching detailed transaction lists.

### 3.11 Credit Card Ledger Service (LEDGER_SVC)
- **Role**: Integration point with the authoritative ledger of credit card balances and postings.
- **Responsibilities**:
  - Supply up-to-date transaction and balance information to `CC_TXN_DB` and `RPT_STORE`.
  - Ensure referential integrity and financial correctness.
- **Explicit Exclusions**:
  - No direct customer-facing endpoints.

### 3.12 Customer Profile Service (CUST_SVC)
- **Role**: Provides information about the customer and owned credit card accounts.
- **Responsibilities**:
  - Validate card ownership for authorization decisions in `MSSD_API`.
  - Supply customer identifiers used for scoping queries.
- **Explicit Exclusions**:
  - Non-credit-card relationships not needed for the dashboard.

### 3.13 Cross-Cutting Services (AUTH_SVC, RBAC_SVC, AUDIT_SVC, OBS_SVC, CONF_SEC)
- **Role**: Provide security, observability, and configuration services.
- **Responsibilities**:
  - AUTH_SVC: Authenticate user sessions via existing SSO or banking identity provider.
  - RBAC_SVC: Enforce authorizations such that customers access only their own credit card data.
  - AUDIT_SVC: Record access to monthly summaries for compliance and fraud monitoring.
  - OBS_SVC: Capture metrics, logs, and traces to monitor performance and errors.
  - CONF_SEC: Manage configuration and secrets (e.g., DB connection strings, API credentials) securely.

## 4. Integration Points & Data Flow

### 4.1 Flow 1 – Authentication and Session Establishment
1. User navigates to the online banking portal and signs in.
2. `AUTH_SVC` authenticates the user (e.g., username/password + MFA) and creates a secure session or issues a token.
3. The web UI stores the session/token in a secure context (e.g., HTTP-only cookie or secure storage) and uses it for subsequent API calls.

**Scope Mapping**:
- Supports secure access to monthly spend views but does not itself fulfill a specific scope bullet.

### 4.2 Flow 2 – Monthly Summary Request and Response
1. In `WEB_UI`, the user selects a month using the month selector control.
2. `WEB_UI` sends a `GET /credit-cards/{cardId}/monthly-summary?month=YYYY-MM` request over HTTPS to `API_GW`, including the auth token.
3. `API_GW` validates the token with `AUTH_SVC` and checks coarse-grained authorization.
4. `API_GW` forwards the request to `MSSD_API`.
5. `MSSD_API` validates the `cardId` and `month` parameters (format, allowed range) and calls `CUST_SVC` to confirm that the card belongs to the authenticated customer.
6. `MSSD_API` checks `CACHE` for an existing monthly summary; if present and not stale, it returns the cached result.
7. If not cached, `MSSD_API` invokes `MSS_SVC` to compute monthly total spend:
   - `MSS_SVC` queries `RPT_STORE` for aggregated spend for the card and month.
   - If data is missing or outdated, `MSS_SVC` queries `CC_TXN_DB` (and indirectly `LEDGER_SVC` if needed) to aggregate spend and updates `RPT_STORE`.
8. `MSSD_API` invokes `KPI_SVC` to compute summary KPIs using aggregated data (including transaction counts and credit limit from `CC_ACCT_DB`).
9. `MSSD_API` invokes `BRK_SVC` to compute a basic spend breakdown (e.g., by category group) from `RPT_STORE` or `CC_TXN_DB`.
10. `MSSD_API` assembles a response containing:
    - Monthly total spend.
    - Summary KPIs (e.g., total spend, transaction count, average transaction amount).
    - Basic breakdown aggregates suitable for UI charts/cards.
11. `MSSD_API` records an audit entry via `AUDIT_SVC` and emits metrics/traces via `OBS_SVC`.
12. `MSSD_API` stores the assembled summary in `CACHE` keyed by `(customerId, cardId, month)`.
13. `MSSD_API` returns the response to `API_GW`, which returns it to `WEB_UI`.
14. `WEB_UI` renders the updated dashboard view.

**Scope Mapping**:
- **Monthly total credit card spend calculation** – Steps 7, 10.
- **Monthly summary KPIs** – Steps 8, 10.
- **Visual representation of monthly spend** – Steps 13–14 (data delivered, visualization handled by WEB_UI).
- **Month selection** – Step 1.
- **Basic breakdown of spend** – Step 9–10.

### 4.3 Flow 3 – Observability, Audit, and Error Handling
1. For each request to `MSSD_API`, structured logs (request ID, customerId, cardId, month, outcome) are captured and sent to `OBS_SVC`.
2. KPI metrics such as response time, cache hit rate, and error counts are recorded.
3. Audit events (e.g., “MonthlySummaryViewed”) with non-sensitive metadata are sent to `AUDIT_SVC` for compliance tracking.
4. Failures in domain services (e.g., DB connectivity issues) are captured, correlated, and surfaced to alerting systems.

**Scope Mapping**:
- Supports reliable functioning of all scope items but no direct user-facing requirement.

## 5. Security & Compliance Features

### 5.1 Transport Security
- All client-server communication uses HTTPS with modern TLS configurations.
- API gateway enforces TLS and rejects plaintext HTTP.

### 5.2 Data Encryption
- Sensitive data at rest (credit card transaction and account data) is encrypted using industry-standard encryption mechanisms in `CC_TXN_DB`, `CC_ACCT_DB`, and `RPT_STORE`.
- Keys are managed by a centralized key management service, integrated via `CONF_SEC`.

### 5.3 Input Validation
- `MSSD_API` validates all inputs:
  - `cardId` must be a valid identifier; cross-checked with customer ownership via `CUST_SVC`.
  - `month` must follow the expected format (e.g., `YYYY-MM`) and be within allowed date ranges.
- API gateway enforces payload size limits and rejects malformed or excessively large requests.

### 5.4 Output Filtering
- Responses expose aggregated summary and breakdown data only, not raw transaction lists or PII fields.
- Customer identifiers are minimized in the payload; the UI relies on local session context rather than repeated PII.

### 5.5 Authorization (RBAC/ABAC)
- `RBAC_SVC` enforces that only authenticated customers with appropriate roles may access credit card summary endpoints.
- Attribute-based rules ensure that a customer can only request summaries for cards they own.

### 5.6 Audit Logging
- `AUDIT_SVC` records:
  - Successful and failed summary views.
  - Key attributes such as customerId (internal identifier), cardId, month, and outcome status (no sensitive narrative text or transaction details).
- Audit logs are immutable and retained per compliance requirements.

### 5.7 Secrets Management
- All credentials (DB connections, service API keys) are stored in a secure secrets manager under `CONF_SEC`.
- Services retrieve secrets via short-lived tokens; secrets are never hard-coded.

### 5.8 Compliance Mapping
- **PCI-DSS** is implicated because credit card spend data is involved:
  - PCI scope is minimized by returning only aggregated information to the UI.
  - The solution relies on existing PCI-compliant transaction and account data stores and secure network segmentation.
  - Access control, encryption, and logging are aligned with PCI-DSS requirements for cardholder data environments.

## 6. Resiliency & Error Handling

### 6.1 Retry Mechanisms
- Domain services (`MSS_SVC`, `KPI_SVC`, `BRK_SVC`) implement bounded retries for transient failures when calling data stores or integration services (e.g., `LEDGER_SVC`).
- Retries use exponential backoff and jitter to avoid thundering herd issues.

### 6.2 Circuit Breakers
- Calls to downstream services (e.g., `LEDGER_SVC`, `RPT_STORE`, `CC_TXN_DB`) are wrapped in circuit breakers.
- On repeated failures, the circuit opens, and domain services return gracefully degraded responses (e.g., partial data using last known summary from `CACHE`).

### 6.3 Timeouts
- API calls and database queries are configured with strict timeouts based on SLA requirements.
- Timeouts are surfaced as well-defined error responses so that the UI can inform the customer appropriately.

### 6.4 Graceful Degradation
- If real-time data is unavailable, the API can fall back to the most recently cached summary, clearly indicating to the UI that data may not reflect the latest postings.
- If breakdown data cannot be computed, the API may return summary KPIs without breakdown, with an appropriate status field.

### 6.5 Error Handling
- Standardized error responses include:
  - **400 Bad Request** – Invalid month format or cardId; message indicates which parameter is invalid without revealing internal details.
  - **401 Unauthorized** – Missing or invalid auth token.
  - **403 Forbidden** – Authenticated user not authorized for the requested card.
  - **404 Not Found** – Card or data for the requested month not found.
  - **500 Internal Server Error** – Unexpected internal failures, with generic customer-facing messages.
- Detailed diagnostics are logged server-side via `OBS_SVC` but not exposed to clients.

### 6.6 Observability
- `OBS_SVC` collects metrics and traces for:
  - Request rates, success/error counts by endpoint.
  - Latency percentiles for summary endpoints.
  - Cache hit/miss rates.
- Dashboards and alerts are configured to detect performance degradation or elevated error rates.

## 7. Validation Report

### 7.1 Requirements Coverage
- **Scope: Monthly total credit card spend calculation**
  - **Components**: MSS_SVC, CC_TXN_DB, RPT_STORE, CACHE, LEDGER_SVC.
  - **Flows**: Flow 2 (steps 7, 10).
- **Scope: Monthly summary KPIs (e.g., total spend, number of transactions)**
  - **Components**: KPI_SVC, MSS_SVC, CC_TXN_DB, CC_ACCT_DB, RPT_STORE.
  - **Flows**: Flow 2 (steps 7–10).
- **Scope: Visual representation of monthly spend (e.g., summary cards or charts)**
  - **Components**: WEB_UI, MSSD_API, API_GW.
  - **Flows**: Flow 2 (steps 1–2, 10–14).
- **Scope: Month selection to view a specific month’s summary**
  - **Components**: WEB_UI, MSSD_API, API_GW.
  - **Flows**: Flow 2 (steps 1–5).
- **Scope: Basic breakdown of spend suitable as an entry point into deeper insights**
  - **Components**: BRK_SVC, MSSD_API, WEB_UI, CC_TXN_DB, RPT_STORE.
  - **Flows**: Flow 2 (steps 9–10, 13–14).

### 7.2 Compliance Status
- **Transport Security** – **Pass**
  - TLS enforced via API gateway, HTTPS-only traffic.
- **Data Encryption at Rest** – **Pass-with-conditions**
  - Design assumes underlying stores are already configured for encryption; implementation must verify and align with enterprise standards.
- **Access Control (RBAC/ABAC)** – **Pass**
  - Role and attribute-based controls defined; card ownership validation via CUST_SVC.
- **Audit Logging** – **Pass**
  - Audit events structured and stored; solution integrates with existing audit infrastructure.
- **PCI-DSS Alignment** – **Pass-with-conditions**
  - Aggregated data minimizes cardholder exposure; full compliance depends on underlying infrastructure (network segmentation, key management) outside this epic.
- **Privacy/PII Handling** – **Pass**
  - Dashboard relies on internal identifiers and aggregated spend; no sample values or unnecessary PII exposure.

### 7.3 Identified Ambiguities/Risks
- **Ambiguity/Risk 1 – Inclusion of Pending Transactions**
  - **Consequence**: If the design inconsistently includes/excludes pending authorizations, customers may see totals that differ from statements, reducing trust.
  - **Mitigation**: Define business rules for which transaction states are included in monthly totals and KPIs; implement corresponding filters in MSS_SVC and document clearly in UI.

- **Ambiguity/Risk 2 – Breakdown Granularity**
  - **Consequence**: Without a defined set of breakdown categories, the service may overcomplicate or underrepresent spending patterns, limiting usefulness.
  - **Mitigation**: Product and analytics teams should specify a fixed set of high-level buckets that are stable over time; BRK_SVC should implement these and expose a schema that can evolve without breaking the UI.

- **Ambiguity/Risk 3 – Out-of-Scope Transaction Management Boundaries**
  - **Consequence**: Users may expect to manage transactions directly from the dashboard (e.g., dispute or categorize). If not clearly separated, the UX could be confusing.
  - **Mitigation**: UI should provide clear navigation to transaction management features implemented in other epics and explicitly label the dashboard as a summary view; backend APIs must avoid exposing endpoints that suggest transaction management capabilities.

- **Ambiguity/Risk 4 – Non-Credit-Card Product Visibility**
  - **Consequence**: If the dashboard is placed near multi-product views, users might expect cross-product summaries, which are out of scope.
  - **Mitigation**: Ensure the dashboard is labeled as “Credit Card Monthly Summary” and that APIs enforce credit-card-only filtering; expansions to other products should be handled via separate epics.

## 8. PII/PHI/PCI Data Handling Validation
- No sample card numbers, names, addresses, or other PII/PHI/PCI values are used in the design.
- All data references are conceptual (e.g., “customerId”, “cardId”, “transaction amount”) without real data examples.
- PCI-DSS implications are recognized and scoped to aggregated views and existing compliant systems.
