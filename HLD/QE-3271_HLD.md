# High-Level Design (HLD) - QE-3271 Monthly Spending Summary Dashboard

## 1. Architecture Overview

### 1.1 Context & Goals
This design provides a web-based monthly spending summary for credit card customers. It must:
- Compute monthly total credit card spend and related KPIs.
- Present visual summaries of spending for a selected month.
- Allow customers to select a month and see a concise breakdown suitable as an entry point to deeper insights.
- Explicitly exclude non-credit-card products and detailed transaction-level management features.

### 1.2 Logical Architecture Overview
The solution follows a layered enterprise architecture:
- **Client Layer**: Web front-end (browser-based dashboard) consuming secure APIs.
- **API / Edge Layer**: HTTPS REST APIs for spending summary, month selection, and KPI retrieval; API gateway for routing, auth, and rate limiting.
- **Domain Services Layer**: Spending Summary Service responsible for computing monthly totals, KPIs, and basic breakdowns from credit card transaction data.
- **Data Stores Layer**: Transaction data store for credit card transactions; analytics store or materialized views for pre-aggregated monthly summaries.
- **Integration Layer**: Secure integration with existing credit card transaction systems and customer profile services.
- **Cross-Cutting Concerns**: Security, compliance, observability, configuration, secrets management, error handling, and resiliency.

### 1.3 Component Diagram (Mermaid)
```mermaid
flowchart LR
    subgraph Client_Layer
        WEB[Web Front-End
        Monthly Spend Dashboard]
    end

    subgraph Edge_Layer
        APIGW[API Gateway
        (Routing, AuthZ, Rate Limit)]
        AUTH[Auth Service
        (Session & Token Validation)]
    end

    subgraph Domain_Services
        MSS[Monthly Spending
        Summary Service]
        KPI[KPIs & Metrics
        Calculator]
        BRK[Basic Spend Breakdown
        Orchestrator]
        MONTHSEL[Month Selection
        & Context Manager]
    end

    subgraph Data_Stores
        TXDB[Credit Card
        Transaction Store]
        SUMDB[Monthly Summary
        & KPI Store]
        CFGDB[Configuration
        & Feature Flags]
    end

    subgraph Integration_Layer
        CC_SYS[Credit Card Core
        Transaction System]
        CUST[Customer Profile
        Service]
    end

    subgraph Cross_Cutting
        OBS[Observability Stack
        (Logs, Metrics, Traces)]
        AUDIT[Audit Logging
        Service]
        SEC[Secrets Vault]
    end

    WEB -->|HTTPS| APIGW
    APIGW --> AUTH
    APIGW -->|REST: /spend/summary| MSS
    APIGW -->|REST: /spend/kpis| KPI
    APIGW -->|REST: /spend/breakdown| BRK
    APIGW -->|REST: /spend/month-context| MONTHSEL

    MSS --> SUMDB
    MSS --> TXDB
    KPI --> SUMDB
    KPI --> TXDB
    BRK --> SUMDB

    MSS --> CC_SYS
    CC_SYS --> TXDB

    MONTHSEL --> SUMDB
    MONTHSEL --> CFGDB

    MSS --> OBS
    KPI --> OBS
    BRK --> OBS
    APIGW --> OBS

    MSS --> AUDIT
    APIGW --> AUDIT

    MSS --> SEC
    APIGW --> SEC
```

## 2. Component Descriptions

### 2.1 Client Layer
**WEB – Web Front-End Monthly Spend Dashboard**  
- Provides the customer-facing dashboard for monthly credit card spending summaries.  
- Implements month selection (e.g., dropdown or date picker) and displays total spend, number of transactions, and high-level breakdowns.  
- Calls back-end APIs via HTTPS, using authenticated sessions/tokens (no direct data access).  
- Shows visual components such as summary tiles and charts for monthly spend; does not expose detailed transaction-management capabilities (e.g., dispute flows, tagging, exporting) as they are out of scope.  
- Applies client-side input validation on month selection and basic filtering parameters.

### 2.2 API / Edge Layer
**APIGW – API Gateway (Routing, AuthZ, Rate Limit)**  
- Terminates TLS, enforces authentication and authorization based on customer identity.  
- Exposes REST endpoints:
  - `GET /spend/summary?month={YYYY-MM}` – monthly total spend and key figures.
  - `GET /spend/kpis?month={YYYY-MM}` – monthly KPIs (total spend, transaction count, average transaction size, etc.).
  - `GET /spend/breakdown?month={YYYY-MM}` – high-level categories or summary groupings suitable for deeper insights entry.  
  - `GET /spend/month-context` – supported months, default month, and navigation metadata.  
- Implements rate limiting and threat protection (basic request size limits, IP throttling, and standardized error responses).  
- Ensures only credit card product data is routed; non-credit-card endpoints or product types are explicitly excluded from this API set.

**AUTH – Auth Service (Session & Token Validation)**  
- Validates customer identity tokens (e.g., OAuth2/OIDC access tokens) and sessions.  
- Provides user context (customer identifier, allowed card accounts) to downstream services via signed tokens or headers.  
- Does not manage card-level permissions beyond basic ownership; advanced features (e.g., multi-user cards, corporate hierarchies) are out of scope unless specified in future epics.

### 2.3 Domain Services Layer
**MSS – Monthly Spending Summary Service**  
- Primary domain service for computing monthly credit card spending summaries.  
- Aggregates transactions for a given customer and month across credit card accounts, calculating total spend and aligning with KPIs.  
- Applies domain rules for what counts as "spend" (e.g., excluding reversals/refunds where required by business rules).  
- Reads from the Transaction Store and/or pre-computed Monthly Summary Store; updates or refreshes aggregated data when needed.  
- Produces a consistent summary DTO for the front-end (month, currency, total spend, transaction count, high-level breakdown pointers).  
- Restricts its scope only to credit card transactions; non-credit-card products are filtered out at query-time or integration-time.

**KPI – KPIs & Metrics Calculator**  
- Derives summary KPIs from either raw transaction data or aggregated monthly summaries:  
  - Total monthly spend.  
  - Number of transactions.  
  - Average transaction value.  
  - Optional derived metrics (e.g., minimum/maximum transaction amount) keeping within simple summary scope.  
- Works closely with MSS to ensure KPI calculations are consistent with the business definition of spend.  
- Stores computed KPIs in SUMDB for repeat queries or recomputation strategies where necessary.

**BRK – Basic Spend Breakdown Orchestrator**  
- Provides high-level breakdowns of monthly spend, such as category groups (e.g., dining, travel) or merchant archetypes, without exposing full analytic features.  
- Leverages existing categorization fields attached to transactions or summary entries in SUMDB.  
- Produces simplified breakdowns designed as an entry point into more advanced analytics, leaving deeper insights (drill-downs, comparison across months, predictive models) out of scope for this epic.  
- Ensures breakdown views are limited to the basics (e.g., top categories by spend, high-level ratio charts) suitable for the monthly summary context.

**MONTHSEL – Month Selection & Context Manager**  
- Manages the set of months available for selection (e.g., last 12 billing cycles) and default selection rules (e.g., latest fully closed statement).  
- Provides metadata to the front-end (e.g., label, date range, billing cycle identifier) to allow consistent month selection UI.  
- Ensures month selection is constrained to the customer’s card accounts and data availability; does not provide arbitrary date range or custom filtering capabilities beyond defined months.  
- Reads configuration from CFGDB to support feature flags (e.g., pilot rollout for additional KPIs).  

### 2.4 Data Stores Layer
**TXDB – Credit Card Transaction Store**  
- Authoritative source of credit card transaction records in structured form (e.g., transaction id, card id, posting date, amount, merchant category code, currency, etc.).  
- Optimized for query by customer and month, with indexes on posting date and card references.  
- Does not store any detailed customer PII beyond standard identifiers required for linkage (e.g., pseudonymous customer id); access patterns avoid exposing raw personal fields in query results beyond what is necessary for aggregation.

**SUMDB – Monthly Summary & KPI Store**  
- Stores materialized monthly aggregates and KPIs per customer and month, enabling fast retrieval for dashboard views.  
- Contains pre-computed fields such as total spend, transaction count, categorized spend totals, and derived KPIs.  
- Built either as an analytics database (e.g., columnar store) or materialized views on top of TXDB.  
- Designed with appropriate partitioning to support high query volumes for dashboard traffic.

**CFGDB – Configuration & Feature Flags**  
- Holds configuration for visible KPIs, default month selection rules, rollout options, and thresholds for display.  
- Does not contain customer data; used solely for system behavior and toggle management.

### 2.5 Integration Layer
**CC_SYS – Credit Card Core Transaction System**  
- Upstream source of credit card transaction data for TXDB, via batch or streaming integration.  
- Ensures that all posted transactions for a given month are available for summary computation.  
- Integration is unidirectional for this epic (read-only); writing back into the core system is out of scope.

**CUST – Customer Profile Service**  
- Provides customer identifiers, card-account relationships, and high-level attributes necessary to scope queries to the correct accounts.  
- Does not expose or use detailed profile management functions in this epic (e.g., address updates, contact channels) which remain out of scope.

### 2.6 Cross-Cutting Services
**OBS – Observability Stack (Logs, Metrics, Traces)**  
- Collects structured logs for API requests, summary computations, and errors.  
- Stores metrics (e.g., response times, error rates, compute latencies) for operational dashboards.  
- Enables distributed tracing across APIGW, MSS, KPI, and BRK for end-to-end flow visibility.

**AUDIT – Audit Logging Service**  
- Records access to monthly spending summaries per customer and month, with non-PII identifiers and event metadata.  
- Logs creation or updates of monthly summary aggregates where applicable.  
- Provides audit reports for security and compliance reviews.

**SEC – Secrets Vault**  
- Stores encryption keys, API credentials, and database connection strings.  
- Ensures rotation and controlled access to secrets.  
- Integrates with runtime environments to provide secrets without embedding them in code or configuration files.

## 3. Integration Points & Data Flows

### 3.1 Flow 1 – Authentication & Session Establishment
1. Customer accesses the Monthly Spending Summary Dashboard via WEB.  
2. WEB redirects or integrates with AUTH for login and token acquisition (e.g., OIDC login).  
3. AUTH validates credentials and issues an access token (opaque or JWT) associated with the customer identifier and allowed card accounts.  
4. WEB stores the token in a secure, HTTP-only storage mechanism and includes it in subsequent API calls via standard authorization headers.  
5. APIGW validates the token with AUTH on each request or via cached validation, denying access if invalid or expired.

Scope Mapping:  
- Supports **month selection and view** by ensuring only authenticated customers can access their own data.

### 3.2 Flow 2 – Month Selection & Context Retrieval
1. WEB calls `GET /spend/month-context` on APIGW with the customer’s token.  
2. APIGW authenticates and authorizes the request and forwards it to MONTHSEL.  
3. MONTHSEL queries CFGDB for configuration (available months, default month rules, feature flags).  
4. MONTHSEL determines the list of months supported for the customer (e.g., based on data availability in SUMDB or constraints from CC_SYS) and selects a default month.  
5. MONTHSEL returns a month context payload to WEB (list of selectable months and default selection metadata).  
6. WEB renders month selection UI and uses the default month to trigger initial summary retrieval.

Scope Mapping:  
- Directly satisfies **Month selection to view a specific month’s summary**.

### 3.3 Flow 3 – Monthly Total Credit Card Spend & KPIs Retrieval
1. WEB issues `GET /spend/summary?month={YYYY-MM}` to APIGW with authorization token and selected month.  
2. APIGW validates the token via AUTH and authorizes access for the customer.  
3. APIGW forwards the request to MSS, including customer context and selected month.  
4. MSS checks SUMDB for an existing aggregated summary for the customer and month; if present, it retrieves the summary.  
5. If not present or stale, MSS queries TXDB or integrated CC_SYS data to compute the summary, then writes/refreshes SUMDB.  
6. MSS returns total spend, transaction count, and basic breakdown references to APIGW.  
7. WEB displays overall monthly total credit card spend and high-level metrics.  
8. WEB optionally invokes KPI endpoints (`GET /spend/kpis`) for additional KPIs (number of transactions, average transaction amount, etc.), which follow the same validation and retrieval pattern via KPI service and SUMDB.  
9. Metrics, logs, and traces are captured across APIGW, MSS, KPI, and OBS.

Scope Mapping:  
- Satisfies **Monthly total credit card spend calculation** and **Monthly summary KPIs (e.g., total spend, number of transactions)**.

### 3.4 Flow 4 – Visual Representation & Basic Breakdown
1. WEB calls `GET /spend/breakdown?month={YYYY-MM}` to APIGW with the selected month and token.  
2. APIGW validates and forwards the request to BRK.  
3. BRK reads from SUMDB to obtain aggregated category-level or grouping-level spend totals for the requested month.  
4. BRK returns a compact breakdown payload (e.g., category identifiers, spend totals, relative percentages).  
5. WEB renders charts or summary cards (e.g., bar chart for top categories, pie chart for category distribution) using the breakdown data.  
6. WEB links certain breakdown elements to deeper analytics journeys (e.g., navigation to a separate, out-of-scope analytics page), ensuring this epic only provides the entry point and does not implement detailed analysis logic.  
7. OBS captures metrics such as breakdown retrieval latency and request volumes.

Scope Mapping:  
- Satisfies **Visual representation of monthly spend (e.g., summary cards or charts)** and **Basic breakdown of spend suitable as an entry point into deeper insights**.

### 3.5 Flow 5 – Observability & Audit
1. For each customer request to summary or breakdown endpoints, APIGW emits structured logs and metrics to OBS.  
2. MSS, KPI, and BRK emit domain-specific logs (e.g., aggregation duration, cache hits/misses) and traces.  
3. AUDIT records access events (customer identifier, month viewed, timestamp, channel) for compliance purposes.  
4. Operational teams use observability dashboards to monitor availability, latency, and error rates; audit reports are used for security and compliance checks.

Scope Mapping:  
- Indirectly supports all scope items by ensuring reliable, auditable delivery of summaries and breakdowns.

## 4. Security & Compliance Features

### 4.1 Transport Security
- All client-to-server and service-to-service communications use TLS 1.2+ with modern cipher suites.  
- APIGW terminates client TLS; internal microservice calls may use mutual TLS for stronger service identity guarantees.

### 4.2 Data Encryption
- Transaction data at rest (TXDB) and aggregated summaries (SUMDB) are encrypted using strong AES-class encryption at the storage level.  
- Backups and replicas are encrypted.  
- Encryption keys are managed via SEC, with rotation policies defined by security operations.

### 4.3 Input Validation & Output Filtering
- APIGW and WEB validate month parameters (format, allowed range) and reject invalid or unexpected values.  
- Services validate customer identifiers, card references, and query filters to avoid injection attacks or unauthorized data access.  
- Output payloads include strictly defined fields (e.g., month, totals, counts, category identifiers) without exposing raw PII; transaction-level fields are not returned by this epic’s endpoints.  
- Any free-text or label fields (e.g., category names) are sanitized before display.

### 4.4 RBAC/ABAC
- Access to summaries is controlled by the customer’s authenticated identity; each request is authorized based on customer-to-card mappings from CUST.  
- No back-office roles are exposed through this dashboard; staff views would be subject to separate access policies, out of scope here.  
- Attribute-based rules (e.g., restricting access by region or product configuration) can be implemented via APIGW and AUTH policies.

### 4.5 Audit Logging
- AUDIT records viewing of monthly summaries and breakdowns, including customer pseudonymous identifiers, month, channel, and outcome (success/failure).  
- Audit logs are immutable and retained according to defined retention schedules.  
- Access to audit logs is restricted to authorized operational and compliance roles.

### 4.6 Secrets Management
- SEC manages database credentials, API keys for CC_SYS and CUST integrations, and encryption keys.  
- Applications retrieve secrets at runtime via secure APIs or environment injection; secrets are not hard-coded or stored in plain text.  
- Secrets rotation is automated where possible, with monitoring for usage and anomalies.

### 4.7 Compliance Mapping
- **Data Protection & Privacy**: The dashboard exposes only aggregated, non-sensitive spending information and does not display customer PII fields (names, addresses, card numbers). All identifiers used are pseudonymous and scoped to internal systems.  
- **Card Data Protection**: Card numbers and sensitive authentication data are not returned in monthly summary responses; only high-level aggregates are used.  
- **Access & Audit**: Access control and audit logging support internal security and privacy requirements; exact regulatory mappings (e.g., jurisdiction-specific frameworks) are assumed to be addressed by institutional policy overlays.

Compliance Status:  
- Data Protection & Privacy: **Pass** (aggregation only, no PII exposure).  
- Card Data Protection: **Pass** (no card numbers or sensitive auth data exposed; encryption enforced).  
- Access & Audit: **Pass-with-conditions** (requires ongoing review of access policies and retention schedules).

## 5. Resiliency & Error Handling

### 5.1 Retry Mechanisms
- Internal calls between APIGW and MSS/KPI/BRK use bounded retries for transient network or service issues (e.g., exponential backoff, capped attempts).  
- MSS may retry reads from TXDB or SUMDB in case of transient storage errors, while detecting non-retriable conditions (e.g., malformed queries).

### 5.2 Circuit Breakers & Timeouts
- APIGW applies timeouts to downstream service calls; if MSS or KPI are slow or failing, circuit breakers prevent cascading failure by returning standardized error responses.  
- Domain services use circuit breakers for integrations with CC_SYS, isolating external system failures from the dashboard experience.

### 5.3 Graceful Degradation
- If SUMDB is unavailable, MSS may fall back to a simplified view (e.g., display a message indicating temporary unavailability of detailed metrics) without exposing raw error details.  
- KPI and BRK endpoints degrade by returning limited data or maintenance messages instead of failing with unhandled exceptions.  
- WEB displays user-friendly notices (e.g., "Monthly summary temporarily unavailable; please try again later") while preserving core navigation.

### 5.4 Error Handling & Response Semantics
- Standardized HTTP status codes:  
  - `200 OK`: Successful retrieval of summary, KPIs, or breakdown.  
  - `400 Bad Request`: Invalid month format or unsupported query parameters; response contains a generic error description (no internal details).  
  - `401 Unauthorized`: Missing or invalid token.  
  - `403 Forbidden`: Customer not authorized to view requested card or month.  
  - `404 Not Found`: No data available for the requested month (e.g., no transactions).  
  - `429 Too Many Requests`: Rate limit exceeded.  
  - `500 Internal Server Error`: Unexpected error; response excludes stack traces or implementation details.  
- Responses return safe, generic error messages and correlation identifiers for support follow-up, with details available only in internal logs.

### 5.5 Observability
- Metrics and trace IDs are attached to all API responses, enabling correlation with logs and traces in OBS.  
- Dashboards show service health, latency percentiles, and error distributions for summary and breakdown flows.  
- Alerting thresholds are configured for key indicators (e.g., high 5xx rate, latency spikes).

## 6. Validation Report

### 6.1 Requirements Coverage
- **Scope Item: Monthly total credit card spend calculation**  
  - Components: MSS, TXDB, SUMDB, APIGW, WEB.  
  - Flows: Flow 3 (Monthly Total Credit Card Spend & KPIs Retrieval).

- **Scope Item: Monthly summary KPIs (e.g., total spend, number of transactions)**  
  - Components: KPI, MSS, SUMDB, APIGW, WEB.  
  - Flows: Flow 3 (Monthly Total Credit Card Spend & KPIs Retrieval).

- **Scope Item: Visual representation of monthly spend (e.g., summary cards or charts)**  
  - Components: WEB, BRK, APIGW, SUMDB.  
  - Flows: Flow 4 (Visual Representation & Basic Breakdown).

- **Scope Item: Month selection to view a specific month’s summary**  
  - Components: WEB, MONTHSEL, APIGW, CFGDB, SUMDB.  
  - Flows: Flow 2 (Month Selection & Context Retrieval) and Flow 3 (Summary Retrieval for selected month).

- **Scope Item: Basic breakdown of spend suitable as an entry point into deeper insights**  
  - Components: BRK, SUMDB, WEB, APIGW.  
  - Flows: Flow 4 (Visual Representation & Basic Breakdown).

### 6.2 Compliance Status
- **Data Protection & Privacy**: Pass.  
  - Justification: Aggregated spending only; no direct PII exposure in responses; encryption at rest and in transit; pseudonymous identifiers.  
- **Card Data Protection**: Pass.  
  - Justification: No card numbers, CVV, or sensitive auth data returned; card data stored in encrypted TXDB; secrets handled via SEC.  
- **Access Control & Auditability**: Pass-with-conditions.  
  - Justification: Strong auth via AUTH and APIGW; AUDIT logs; requires defined RBAC/ABAC policies and audit retention aligned to organizational and regulatory standards.  
- **Operational Resilience**: Pass-with-conditions.  
  - Justification: Circuit breakers, retries, timeouts, and graceful degradation are designed; effectiveness depends on concrete parameter tuning and production monitoring.

### 6.3 Identified Ambiguities / Risks
- **Ambiguity/Risk 1 – Business Rules for "Spend" Definition**  
  - Consequence: Inconsistent totals across systems (e.g., including or excluding reversals, fees, or credits) can erode customer trust and lead to support issues.  
  - Mitigation: Define and document spending aggregation rules centrally; align MSS, KPI, and SUMDB with core system definitions; add test cases comparing sample months across systems (using synthetic data only).

- **Ambiguity/Risk 2 – Depth of Breakdown Granularity**  
  - Consequence: If breakdowns are too granular, they may implicitly become a detailed analytics feature, blurring boundaries with out-of-scope deeper insights.  
  - Mitigation: Restrict BRK output to a limited number of categories or groupings; cap the number of categories displayed; use clear product requirements describing that drill-downs and advanced comparisons are handled by separate, future epics.

- **Ambiguity/Risk 3 – Non-Credit-Card Product Data**  
  - Consequence: If integration boundaries are not clearly enforced, data from other products (e.g., loans, checking accounts) might appear, violating scope and confusing customers.  
  - Mitigation: Enforce product filters in MSS and TXDB queries; constrain APIs to credit card accounts only; add tests ensuring other product types are excluded from summary computations.

- **Ambiguity/Risk 4 – Handling of Months with Partial Data**  
  - Consequence: For months where data is incomplete (e.g., current billing cycle), totals may change after viewing, confusing customers.  
  - Mitigation: MONTHSEL should indicate whether a month is final vs. in-progress; WEB should label summaries accordingly; MSS may apply flags in payloads to show data completeness.

- **Ambiguity/Risk 5 – Out-of-Scope Detailed Transaction-Level Management**  
  - Consequence: If WEB UI inadvertently exposes links or actions for transaction-level management (e.g., disputes, tagging, export), it may create unmet expectations and partial behavior.  
  - Mitigation: Ensure UX design limits actions to viewing aggregated summaries and basic breakdowns; route any advanced actions to separate, purpose-built flows not covered by this epic; explicitly validate UI against out-of-scope features.
