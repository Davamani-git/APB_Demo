# High-Level Design (HLD) – QE-3420: Monthly Spending Summary Dashboard v4

## 1. Architecture Overview

The Monthly Spending Summary Dashboard v4 is a web-based experience that presents an aggregated monthly view of credit card spending. The solution follows a layered enterprise architecture:

- **Client Layer (Web UI)** – Browser-based SPA (or modular web UI) that renders the monthly summary dashboard, invokes APIs for data retrieval, manages month selection, and presents KPIs and visualizations.
- **API / Edge Layer** – Secure REST/GraphQL API exposed by the banking channel gateway, responsible for request validation, authentication/authorization, routing, and response shaping for the dashboard.
- **Domain Services Layer (Spending Summary Service)** – Application services that calculate monthly totals, derive KPIs, and compose basic breakdowns of credit card spend based on transaction data.
- **Data Layer (Credit Card Transaction Store & Aggregates)** – Authoritative storage of credit card transactions and derived aggregates (materialized views or summary tables) used to compute monthly spending metrics.
- **Integration Layer (Core Card Systems & Analytics)** – Connectors/adapters to core card processing systems and, optionally, analytics engines or data warehouses that provide transaction feeds and aggregated metrics.
- **Cross-Cutting Concerns** – Security, compliance, observability, configuration, secrets management, and resiliency patterns applied consistently across layers.

The architecture is constrained to **credit card products only** and **does not provide detailed transaction-level management features** (e.g., dispute workflows, transaction editing, tagging). It focuses on aggregated monthly insights suitable as an entry point into deeper analysis experiences delivered by other epics.

### 1.1 Logical Component Diagram (Mermaid)

```mermaid
graph TD
    subgraph Client_Layer[Client Layer]
        WEB_UI[Monthly Spending Summary Web UI]
    end

    subgraph Edge_Layer[API / Edge Layer]
        API_GW[Channel API Gateway]
        SUMMARY_API[Spending Summary API]
    end

    subgraph Domain_Services[Domain Services Layer]
        SUMMARY_SVC[Monthly Summary Service]
        KPI_ENGINE[Summary KPI Calculator]
        BREAKDOWN_ENGINE[Basic Spend Breakdown Engine]
    end

    subgraph Data_Layer[Data Layer]
        TX_STORE[Credit Card Transaction Store]
        SUMMARY_VIEW[Monthly Spend Summary View]
        KPI_STORE[Aggregated KPI Store]
    end

    subgraph Integration_Layer[Integration Layer]
        CORE_CARDS[Core Card Processing System]
        DW_FEED[Analytics/Data Warehouse Feed]
    end

    subgraph Cross_Cutting[Cross-Cutting Concerns]
        AUTH_SVC[Authentication & RBAC Service]
        AUDIT_SVC[Audit & Event Logging]
        OBS_SVC[Monitoring & Metrics]
        CONFIG_SVC[Configuration & Feature Flags]
        SEC_MGMT[Secrets Management]
    end

    WEB_UI --> API_GW
    API_GW --> AUTH_SVC
    API_GW --> SUMMARY_API
    SUMMARY_API --> SUMMARY_SVC
    SUMMARY_SVC --> KPI_ENGINE
    SUMMARY_SVC --> BREAKDOWN_ENGINE

    SUMMARY_SVC --> SUMMARY_VIEW
    SUMMARY_SVC --> KPI_STORE
    SUMMARY_SVC --> TX_STORE

    TX_STORE <-- CORE_CARDS
    SUMMARY_VIEW <-- DW_FEED
    KPI_STORE <-- DW_FEED

    SUMMARY_API --> AUDIT_SVC
    SUMMARY_API --> OBS_SVC
```

## 2. Component Descriptions

### 2.1 Client Layer

**WEB_UI – Monthly Spending Summary Web UI**  
- Browser-based UI (e.g., React/Angular/Vue or server-rendered) that hosts the monthly spending summary dashboard.  
- Provides month selection controls, displays total monthly spend, number of transactions, and other summary KPIs.  
- Renders visual representations of spend (summary cards, bar/line charts, or donut charts).  
- Invokes the Spending Summary API over HTTPS, passing selected month and optional card/account identifiers.  
- Does **not** expose detailed transaction-level management capabilities (no editing, disputing, tagging, or per-transaction controls) per Out of Scope.  
- Acts as the entry point into deeper insights (e.g., navigation links to category views or comparison dashboards) that are implemented in other epics.

### 2.2 API / Edge Layer

**API_GW – Channel API Gateway**  
- Terminates TLS and enforces transport security for all dashboard requests.  
- Validates access tokens/session (integration with Authentication & RBAC Service).  
- Performs coarse-grained authorization to ensure the user can only access their own credit card accounts.  
- Applies rate limiting, request size limits, and basic input validation on path/query parameters and headers.  
- Routes monthly summary requests to the Spending Summary API.  
- Normalizes error responses and HTTP status codes.

**SUMMARY_API – Spending Summary API**  
- Exposes a versioned endpoint, e.g., `GET /v4/spending-summary/{cardId}?month=YYYY-MM`.  
- Performs fine-grained validation of request parameters and bindings to the authenticated user.  
- Orchestrates calls to Monthly Summary Service and KPI/Breakdown engines.  
- Shapes the response payload for the UI (summary KPIs, total spend, transaction count, and high-level breakdown data).  
- Performs response filtering to avoid leaking internal identifiers or configuration details.  
- Triggers audit and observability events (via Audit & Event Logging, Monitoring & Metrics).  
- Excludes non-credit-card products from aggregation by constraining domain calls to credit card accounts only.

### 2.3 Domain Services Layer

**SUMMARY_SVC – Monthly Summary Service**  
- Core domain service responsible for computing monthly total credit card spend and assembling dashboard data.  
- Coordinates retrieval of transaction data and pre-computed aggregates from the Data Layer.  
- Ensures only transactions for the selected month and relevant credit card accounts are included.  
- Handles normalization of transaction amounts (e.g., local currency, refunds, reversals) for correct total calculation.  
- Enforces business rules for which transactions are counted in monthly spend (e.g., authorizations vs. postings, fees, interest).  
- Provides a stable contract for downstream features like category-wise views and month-over-month comparisons (future/other epics).

**KPI_ENGINE – Summary KPI Calculator**  
- Derives and returns monthly summary metrics, such as:  
  - Total spend amount for the month.  
  - Number of posted transactions.  
  - Optional derived KPIs (e.g., average transaction value, largest transaction amount, optional utilization metrics if in scope).  
- Reads from Monthly Spend Summary View and/or raw transactions depending on data freshness and completeness requirements.  
- Abstracts KPI formulas as configurable rules to allow evolution without UI changes.

**BREAKDOWN_ENGINE – Basic Spend Breakdown Engine**  
- Produces high-level breakdowns of spend designed as an entry point into deeper insights, e.g.:  
  - Spend grouped by broad categories (if category tags are available).  
  - Spend by merchant type or region at a coarse granularity.  
  - Split between one or two major dimensions (e.g., online vs. in-store).  
- Ensures the breakdown remains high level; it does **not** support detailed per-transaction management operations.  
- Aggregates data leveraging analytics feeds or summary views when available for performant queries.

### 2.4 Data Layer

**TX_STORE – Credit Card Transaction Store**  
- Authoritative ledger for posted credit card transactions.  
- Contains non-PII operational data required for aggregation (e.g., transaction timestamps, amounts, merchant category codes, product identifiers).  
- Exposed to the domain via controlled read models and views, preventing direct raw table access from UI or edge layers.  
- Applies data access policies that restrict queries to the authenticated customer’s accounts.

**SUMMARY_VIEW – Monthly Spend Summary View**  
- Materialized view or summary table that pre-aggregates transaction data by card/account and month.  
- Stores computed monthly totals and coarse breakdown fields to support low-latency dashboard queries.  
- Refreshed periodically or via streaming updates from CORE_CARDS/DW_FEED, with mechanisms to ensure eventual consistency.  
- Serves as the main source for total monthly spend calculation and summary KPIs.

**KPI_STORE – Aggregated KPI Store**  
- Persisted store (could be part of SUMMARY_VIEW or separate) for computed KPIs that are expensive to compute on the fly.  
- Holds pre-computed metrics needed by KPI_ENGINE when building the dashboard data.  
- Maintains versioned KPI definitions to ensure reproducibility of historical views.

### 2.5 Integration Layer

**CORE_CARDS – Core Card Processing System**  
- Upstream system responsible for credit card authorization, posting, and ledger maintenance.  
- Provides transaction feeds to TX_STORE and SUMMARY_VIEW via batch or streaming integration.  
- Acts as the source of truth for posted transactions, limits, and basic account status data relevant for the dashboard.  
- Non-credit-card products from other cores are explicitly excluded from these integrations for this epic.

**DW_FEED – Analytics/Data Warehouse Feed**  
- ETL or streaming pipeline that delivers aggregated transaction and category data to SUMMARY_VIEW and KPI_STORE.  
- Used when complex aggregations require offline processing.  
- Maintains data quality checks so that summary views are consistent with card ledger.

### 2.6 Cross-Cutting Concerns

**AUTH_SVC – Authentication & RBAC Service**  
- Provides token-based authentication (e.g., OAuth2/OIDC) for web clients via API_GW.  
- Implements role-based access control (RBAC) to ensure dashboard access only for authorized customers and support roles.  
- Enforces account ownership checks for summary queries.

**AUDIT_SVC – Audit & Event Logging**  
- Captures access events to the monthly summary dashboard, including which card/month was queried.  
- Logs administrative or support access distinctly from customer access.  
- Provides immutable logs for investigation and compliance reporting.

**OBS_SVC – Monitoring & Metrics**  
- Collects performance and reliability metrics (latency, error rate, throughput) for SUMMARY_API and domain services.  
- Captures business metrics such as dashboard usage, months accessed most frequently, and query success rates.  
- Integrates with alerting systems to notify operations of anomalies.

**CONFIG_SVC – Configuration & Feature Flags**  
- Manages environment-specific configuration (e.g., KPI thresholds, default month selection rules).  
- Enables rollout control for dashboard variations or new KPIs.  
- Ensures configuration changes are audited and managed as code.

**SEC_MGMT – Secrets Management**  
- Stores and rotates credentials used for integrations with CORE_CARDS and DW_FEED.  
- Integrates with the API_GW and backend services to retrieve secrets securely at runtime.  
- Enforces access control over secrets with least-privilege policies.

## 3. Integration Points & Data Flow

### 3.1 Flow 1 – Authentication & Session Establishment

1. **User navigates to the Monthly Spending Summary Dashboard** in the web application.  
2. WEB_UI checks for an existing authenticated session/token. If not present, it redirects to the login flow.  
3. User authenticates via AUTH_SVC (e.g., OIDC) and, on success, the browser receives a secure token/session cookie.  
4. WEB_UI stores the token in a secure storage mechanism (e.g., HTTP-only cookie) and uses it for subsequent API calls.  
5. API_GW validates the token on each request, enforcing RBAC to confirm that the user may view credit card summary data.

**Scope Mapping:**  
- Required for all scope items that rely on secure access to monthly spend data and dashboard views.

### 3.2 Flow 2 – Monthly Summary Retrieval (Primary Request Flow)

1. User selects a month (or the default current month) in WEB_UI.  
2. WEB_UI invokes SUMMARY_API via API_GW: `GET /v4/spending-summary/{cardId}?month=YYYY-MM`.  
3. API_GW validates the request (authentication, rate limiting, basic input validation on `cardId` and `month`).  
4. SUMMARY_API performs fine-grained validation: ensures `cardId` belongs to the authenticated user and `month` is in an allowed range.  
5. SUMMARY_API calls SUMMARY_SVC with the normalized request (customer identifier, cardId, month).  
6. SUMMARY_SVC fetches monthly aggregated data from SUMMARY_VIEW and KPI_STORE when available.  
7. If aggregates are missing or incomplete, SUMMARY_SVC queries TX_STORE for relevant transactions and triggers on-demand aggregation.  
8. KPI_ENGINE calculates summary KPIs: total monthly credit card spend, number of transactions, and any derived metrics.  
9. BREAKDOWN_ENGINE assembles basic breakdown data (e.g., by broad category or merchant type) based on SUMMARY_VIEW/DW_FEED.  
10. SUMMARY_SVC composes a domain-level response model containing monthly total spend, KPIs, and breakdown entries.  
11. SUMMARY_API shapes this model into a client-facing response, omitting internal identifiers and technical fields.  
12. API_GW returns the response to WEB_UI over HTTPS.  
13. WEB_UI renders the dashboard: summary cards, KPIs, charts, and breakdown components.

**Scope Mapping:**  
- **Monthly total credit card spend calculation** – Steps 6–8 using SUMMARY_VIEW, TX_STORE, and KPI_ENGINE.  
- **Monthly summary KPIs (e.g., total spend, number of transactions)** – Steps 8–10 via KPI_ENGINE and SUMMARY_SVC.  
- **Visual representation of monthly spend (summary cards/charts)** – Steps 12–13 via WEB_UI.  
- **Month selection to view a specific month’s summary** – Steps 1–2 via WEB_UI and SUMMARY_API request.  
- **Basic breakdown of spend suitable as an entry point into deeper insights** – Steps 7–9 via BREAKDOWN_ENGINE.

### 3.3 Flow 3 – Observability & Audit

1. On each SUMMARY_API call, a structured audit event is generated: user identifier (non-PII pseudonymous ID), cardId reference, month, and outcome (success/failure).  
2. AUDIT_SVC persists audit events to an append-only store with tamper-evident properties.  
3. OBS_SVC records operational metrics (latency, status codes, error types) and business metrics (dashboard views, selected months).  
4. Observability dashboards and alerts consume these metrics to monitor user experience and system health.

**Scope Mapping:**  
- Supports reliability and traceability of all scope items by ensuring monthly summary access is observable and auditable.

### 3.4 Flow 4 – Data Refresh & Aggregation (Back-end)

1. CORE_CARDS produces transaction feeds for posted credit card transactions.  
2. TX_STORE ingests these feeds via secure integration channels.  
3. DW_FEED processes the incoming data into analytics-friendly structures.  
4. SUMMARY_VIEW and KPI_STORE are refreshed/updated with new transaction data and aggregated KPIs.  
5. SUMMARY_SVC consumes updated views on subsequent dashboard requests, ensuring monthly totals and KPIs reflect the latest reconciled data.

**Scope Mapping:**  
- Ensures accurate and timely **monthly total credit card spend calculation** and **monthly summary KPIs** using updated transaction sources.  
- Enables consistent **basic breakdown of spend** via enriched analytics feeds.

## 4. Security & Compliance Features

Security and compliance are applied in alignment with the dashboard’s purpose, focusing on access to aggregated credit card spend data without exposing full PII or detailed transaction management capabilities.

### 4.1 Transport Security

- All communication between WEB_UI and API_GW, and between API_GW and backend services, uses HTTPS/TLS with modern ciphers.  
- HSTS is enabled on the web channel to prevent downgrade attacks.  
- Mutual TLS may be used between API_GW and backend services within the data center or cloud environment.

### 4.2 Data Encryption

- Data at rest in TX_STORE, SUMMARY_VIEW, and KPI_STORE is encrypted using enterprise-standard encryption (e.g., using the platform’s key management service).  
- Keys are managed and rotated via SEC_MGMT according to organizational policy.  
- Backups and replicas of the stores follow the same encryption and access control policies.

### 4.3 Input Validation & Output Filtering

- API_GW and SUMMARY_API validate `cardId` and `month` parameters: format, range, and existence checks.  
- Requests that attempt to access non-credit-card products are rejected as invalid or unauthorized.  
- Output payloads are filtered to only include fields necessary for the dashboard visualization.  
- Internal IDs, configuration flags, and technical metadata are excluded from responses.

### 4.4 RBAC / ABAC

- AUTH_SVC provides authenticated identities bound to customer accounts.  
- RBAC ensures only customer roles (or authorized support roles) can access the dashboard.  
- Attribute-based checks (ABAC) validate account ownership and product type (credit card) before aggregations are retrieved.  
- Support/staff access is logged and may be subject to stricter audit rules.

### 4.5 Audit Logging

- AUDIT_SVC logs each summary request with non-sensitive identifiers and access context.  
- Audit records are immutable and retained per organizational retention policy.  
- Administrative actions on CONFIG_SVC and SEC_MGMT are also audited.

### 4.6 Secrets Management

- SEC_MGMT centralizes credentials for CORE_CARDS and DW_FEED integrations and database connections.  
- Secrets are never embedded in source code or configuration files; services retrieve them at runtime through secure channels.  
- Access to secrets is granted using least privilege and is periodically reviewed.

### 4.7 Compliance Mapping

Based on the epic’s scope:

- **Credit card spending data** is involved, but the dashboard uses aggregated views rather than full cardholder data or transaction line items.  
- The design avoids storing or exposing card numbers, expiration dates, CVV, or detailed PII in the dashboard payloads.

Compliance coverage (example mapping):

- **Payment data protection standards** – Aggregated usage is handled according to organizational payment security guidelines; deeper cardholder data handling remains within CORE_CARDS and underlying systems governed by formal standards.  
- **Data privacy regulations** – Access controls and data minimization ensure only necessary aggregated information is presented to authenticated users.

## 5. Resiliency & Error Handling

### 5.1 Resiliency Patterns

- **Retry mechanisms** – SUMMARY_SVC uses bounded retries for transient failures when reading from SUMMARY_VIEW or TX_STORE.  
- **Circuit breakers** – If CORE_CARDS or DW_FEED integrations are degraded, circuit breakers prevent cascading failures, and SUMMARY_SVC falls back to last known good aggregates when allowed.  
- **Timeouts** – API_GW and SUMMARY_API enforce timeouts on downstream calls to keep user-facing responses predictable.  
- **Graceful degradation** – If breakdown data is unavailable, the dashboard still shows total spend and core KPIs, with a clear message indicating limited data.

### 5.2 Error Handling & Status Codes

- **2xx (Success)** – Monthly summary successfully retrieved; dashboard displays all available metrics.  
- **400 (Bad Request)** – Invalid `month` or `cardId` format; the UI may show “Unable to load summary – check your selection.”  
- **401/403 (Unauthorized/Forbidden)** – Missing or invalid token, or access to non-owned account; UI prompts re-authentication or displays an access error message.  
- **404 (Not Found)** – Requested card or month summary does not exist (e.g., no transactions); UI shows an informative empty-state message.  
- **429 (Too Many Requests)** – Rate limiting triggered; UI suggests retrying after a short interval.  
- **5xx (Server Error)** – Unexpected failure; UI shows a generic error while OBS_SVC captures diagnostics.

Error responses expose only non-sensitive, user-friendly messages and generic error codes; internal traces and identifiers are kept in logs and monitoring systems.

### 5.3 Observability

- Metrics on request latency, error rates, and throughput for SUMMARY_API and SUMMARY_SVC.  
- Health checks for dependencies (TX_STORE, SUMMARY_VIEW, KPI_STORE, CORE_CARDS, DW_FEED).  
- Correlation IDs included in logs across API_GW, SUMMARY_API, and domain services to trace individual requests without exposing sensitive data.

## 6. Validation Report

### 6.1 Requirements Coverage (Scope → Components/Flows)

1. **Monthly total credit card spend calculation**  
   - **Components:** SUMMARY_SVC, KPI_ENGINE, SUMMARY_VIEW, TX_STORE.  
   - **Flows:** Flow 2 (Monthly Summary Retrieval), Flow 4 (Data Refresh & Aggregation).  
2. **Monthly summary KPIs (e.g., total spend, number of transactions)**  
   - **Components:** KPI_ENGINE, KPI_STORE, SUMMARY_SVC, WEB_UI.  
   - **Flows:** Flow 2, Flow 4.  
3. **Visual representation of monthly spend (e.g., summary cards or charts)**  
   - **Components:** WEB_UI, SUMMARY_API.  
   - **Flows:** Flow 2.  
4. **Month selection to view a specific month’s summary**  
   - **Components:** WEB_UI, SUMMARY_API, API_GW.  
   - **Flows:** Flow 2 (user selection and API invocation), Flow 1 (session establishment prerequisite).  
5. **Basic breakdown of spend suitable as an entry point into deeper insights**  
   - **Components:** BREAKDOWN_ENGINE, SUMMARY_VIEW, DW_FEED, WEB_UI.  
   - **Flows:** Flow 2 (breakdown retrieval), Flow 4 (back-end aggregation updates).

### 6.2 Out of Scope Acknowledgement

- **Non-credit-card products**  
  - Explicitly excluded in API and domain logic: SUMMARY_API and SUMMARY_SVC filter requests to credit card products only.  
  - Integrations from CORE_CARDS are constrained to credit card transaction feeds; other product systems are not wired into this dashboard.  
- **Detailed transaction-level management features**  
  - WEB_UI does not provide controls for transaction editing, disputing, tagging, or advanced filtering.  
  - SUMMARY_API and domain services return aggregated data only; endpoints for transaction-level management are not part of this epic.  
  - Deeper analysis flows are accessed by navigation to other modules/epics, not via detailed management in this dashboard.

### 6.3 Compliance Status

- **Transport Security** – **Pass**  
  - TLS enforced end to end; gateway terminates HTTPS; internal mutual TLS as needed.  
- **Data Encryption at Rest** – **Pass**  
  - TX_STORE, SUMMARY_VIEW, KPI_STORE encrypted; keys managed via SEC_MGMT.  
- **Input Validation & Output Filtering** – **Pass**  
  - Strict validation for `cardId` and `month`; responses limited to required summary fields.  
- **RBAC/ABAC** – **Pass**  
  - AUTH_SVC with RBAC; attribute checks ensure access only to customer’s credit card accounts.  
- **Audit Logging** – **Pass-with-conditions**  
  - Audit implemented for summary access and administrative changes; final retention policies and event schemas must align with enterprise compliance standards.  
- **Secrets Management** – **Pass**  
  - SEC_MGMT used for all sensitive credentials; no secrets in code.  
- **Payment/Financial Data Protection Policies** – **Pass-with-conditions**  
  - Aggregated spend is handled securely; overall compliance depends on underlying CORE_CARDS and organizational certification for card data handling.

### 6.4 Identified Ambiguities/Risks

1. **Definition of “monthly total spend”**  
   - **Ambiguity/Risk:** It is not fully specified whether fees, interest, refunds, and reversals should be included in the monthly total.  
   - **Consequence:** Inconsistent totals across channels and customer confusion if different views show different numbers.  
   - **Mitigation:** Define a canonical business rule for monthly total spend, align SUMMARY_SVC and CORE_CARDS aggregation logic to this rule, and document it in product and technical specifications.

2. **Scope of KPIs beyond total and count**  
   - **Ambiguity/Risk:** The epic mentions “summary KPIs” but does not specify whether additional metrics (e.g., average transaction size) are in scope for v4.  
   - **Consequence:** Over- or under-implementation; UI and API may diverge from expected KPI set.  
   - **Mitigation:** Product owner and analytics stakeholders should define a minimal baseline KPI set and their formulas, then configure KPI_ENGINE accordingly.

3. **Granularity of basic breakdown**  
   - **Ambiguity/Risk:** “Basic breakdown” is not strictly defined (categories, merchant types, regions, etc.).  
   - **Consequence:** Breakdown may be too coarse to be useful or too detailed, bleeding into functionality better owned by deeper analysis epics.  
   - **Mitigation:** Specify a limited set of high-level dimensions (e.g., 3–5 broad categories) for BREAKDOWN_ENGINE in v4, and ensure deeper breakdowns are deferred to future epics.

4. **Data latency and refresh expectations**  
   - **Ambiguity/Risk:** The required freshness of summary data (near real-time vs. end-of-day) is not stated.  
   - **Consequence:** Users might see discrepancies between transaction lists in other views and the monthly summary totals.  
   - **Mitigation:** Define SLOs for data freshness and communicate them to users (e.g., “Data updated daily”); configure SUMMARY_VIEW and DW_FEED schedules accordingly.

5. **Navigation to deeper insights**  
   - **Ambiguity/Risk:** The entry point nature of the dashboard implies navigation to other experiences, but the exact target modules/epics are not specified.  
   - **Consequence:** UI might include links that are non-functional or inconsistent across platforms.  
   - **Mitigation:** Coordinate with owning teams for category-wise and comparison views; design navigation placeholders that degrade gracefully if unavailable.
