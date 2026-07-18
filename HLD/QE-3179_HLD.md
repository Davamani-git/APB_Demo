# QE-3179 – DAVMS Monthly Spending Summary Dashboard – High-Level Design (HLD)

## 1. Architecture Overview

### 1.1 Goal
Design a secure, web-based monthly spending summary experience for credit card customers that:
- Calculates monthly total credit card spend.
- Exposes monthly summary KPIs (e.g., total spend, transaction count).
- Provides visual representations (summary cards/charts).
- Allows month selection.
- Provides a concise breakdown suitable as an entry point into deeper insights.

Non–credit-card products and detailed transaction-level management capabilities are explicitly excluded.

### 1.2 Logical Architecture

```mermaid
flowchart TD
    subgraph CL[Client Layer]
        WEB[Web UI - Monthly Spend Dashboard]
        AUTHW[Client Auth Session Handler]
    end

    subgraph EDGE[API / Edge Layer]
        APIGW[API Gateway / Edge Router]
        AUTHZ[Auth & Token Validation Service]
        RATELIM[Rate Limiting & Throttling]
    end

    subgraph DOM[Domain Services Layer]
        MCALC[Monthly Spend Calculation Service]
        MSUM[Monthly Summary & KPI Service]
        VIZ[Visualization & Layout Service]
        MSEL[Month Selection & Context Service]
        BRKDWN[High-Level Spend Breakdown Service]
    end

    subgraph DATA[Data Stores]
        TXNDB[Credit Card Transactions Data Store]
        ACCTDB[Card & Customer Reference Store]
        CFGDB[Configuration & Feature Flags Store]
        AUDDB[Audit & Event Log Store]
        CACHEDB[Caching Store (Session & Aggregates)]
    end

    subgraph INTEG[Integration Layer]
        ETL[Transaction Ingestion / ETL Pipeline]
        LEDGER[Card Ledger & Posting System]
        IDP[Identity Provider / SSO]
        OBS[Observability Stack (Logs/Metrics/Traces)]
    end

    subgraph XCC[Cross-Cutting Concerns]
        SEC[Security & Compliance Controls]
        ERR[Error Handling & Resiliency]
    end

    WEB --> AUTHW
    AUTHW --> APIGW
    APIGW --> AUTHZ
    APIGW --> RATELIM

    APIGW --> MCALC
    APIGW --> MSUM
    APIGW --> VIZ
    APIGW --> MSEL
    APIGW --> BRKDWN

    MCALC --> TXNDB
    MCALC --> CACHEDB
    MSUM --> TXNDB
    MSUM --> CACHEDB
    BRKDWN --> TXNDB
    BRKDWN --> ACCTDB

    VIZ --> CACHEDB

    ETL --> TXNDB
    LEDGER --> ETL

    AUTHZ --> IDP

    MCALC --> OBS
    MSUM --> OBS
    BRKDWN --> OBS
    APIGW --> OBS
    WEB --> OBS

    SEC --- APIGW
    SEC --- MCALC
    SEC --- MSUM
    SEC --- TXNDB

    ERR --- APIGW
    ERR --- MCALC
    ERR --- MSUM
    ERR --- WEB

    APIGW --> AUDDB
    WEB --> AUDDB
```

## 2. Component Descriptions

### 2.1 Client Layer

**WEB – Web UI - Monthly Spend Dashboard**  
Single-page web application module within the banking portal that renders the monthly spending summary. Responsibilities:
- Presents total monthly credit card spend and KPIs as cards and charts.
- Provides month selector (e.g., dropdown or date picker constrained to months with data).
- Displays high-level spend breakdown (e.g., by broad category or segment) without exposing detailed transaction management features.
- Calls backend APIs to fetch summaries and breakdown data; no direct data access.
- Implements client-side input validation for month selection and display-only formatting.

**AUTHW – Client Auth Session Handler**  
Client-side session handling integrated with the bank’s existing authentication framework. Responsibilities:
- Stores and refreshes access tokens issued by the Identity Provider.
- Ensures only authenticated sessions can access the dashboard routes.
- Redirects unauthenticated/expired sessions to login.

### 2.2 API / Edge Layer

**APIGW – API Gateway / Edge Router**  
Unified ingress for the monthly spending summary APIs. Responsibilities:
- Routes requests from WEB to the appropriate domain services (MCALC, MSUM, BRKDWN, VIZ, MSEL).
- Enforces REST/JSON over HTTPS.
- Applies rate limiting (via RATELIM) to prevent abuse.
- Normalizes error responses and propagates correlation IDs.

**AUTHZ – Auth & Token Validation Service**  
Authorization component operating behind APIGW. Responsibilities:
- Validates OAuth2/OIDC tokens from AUTHW via the IDP.
- Resolves customer identity and associated card accounts.
- Applies RBAC/ABAC rules so a user only accesses their own credit card data.

**RATELIM – Rate Limiting & Throttling**  
Edge control for traffic management. Responsibilities:
- Enforces per-user and per-IP rate limits on dashboard-related APIs.
- Provides burst control to protect back-end services.

### 2.3 Domain Services Layer

**MSEL – Month Selection & Context Service**  
Service responsible for month context management. Responsibilities:
- Validates requested month (e.g., no future months, within allowed historical window).
- Normalizes month representation (e.g., YYYY-MM) and passes it to computation services.
- Derives default month (e.g., last full statement cycle) when user does not specify one.

**MCALC – Monthly Spend Calculation Service**  
Core service computing monthly total credit card spend. Responsibilities:
- Retrieves posted credit card transactions for the selected month from TXNDB.
- Applies business rules for spend inclusion/exclusion (e.g., posted vs pending, reversals, fees where applicable), strictly within credit card domain.
- Aggregates total spend amount per month.
- Writes/updates aligned aggregates into CACHEDB for frequent queries.

**MSUM – Monthly Summary & KPI Service**  
Service that composes monthly summary KPIs. Responsibilities:
- Uses MCALC outputs and direct queries to TXNDB/CACHEDB to compute KPIs:
  - Total spend.
  - Number of transactions.
  - Optional high-level metrics (e.g., average transaction amount, share of online vs in-store if available as attributes).
- Normalizes KPI payloads into an API contract consumed by WEB.

**BRKDWN – High-Level Spend Breakdown Service**  
Service responsible for providing an entry-point breakdown without full transaction management. Responsibilities:
- Aggregates spend into high-level segments (e.g., broad categories, merchant type bands) from TXNDB and ACCTDB metadata.
- Returns aggregated totals and percentages per segment, without transaction-level operations like dispute, tagging, or export.
- Optimizes repeated queries using CACHEDB.

**VIZ – Visualization & Layout Service**  
Backend-centric service deciding visual layout semantics. Responsibilities:
- Maps MSUM and BRKDWN data into representation-ready structures (e.g., card models, chart series).
- Applies server-side feature flags from CFGDB to enable/disable certain charts or KPIs.

### 2.4 Data Stores

**TXNDB – Credit Card Transactions Data Store**  
Logical store (could be an existing card transaction database or analytics mart) for credit card transactions. Responsibilities:
- Holds posted credit card transaction records with minimal, properly protected attributes (transaction IDs, timestamps, amounts, merchant category codes, etc.).
- Exposes read-only queries to MCALC, MSUM, BRKDWN.
- Explicitly limited to credit card products; non-credit-card products are excluded.

**ACCTDB – Card & Customer Reference Store**  
Reference data store. Responsibilities:
- Maintains card-account metadata required for breakdown segmentation.
- Links customer identities to card accounts for authorization decisions.

**CFGDB – Configuration & Feature Flags Store**  
Configuration store. Responsibilities:
- Holds feature flags and visualization configurations (e.g., which KPI cards to show).

**AUDDB – Audit & Event Log Store**  
Audit store. Responsibilities:
- Receives append-only audit events for key operations (view summary, change month, access breakdown).
- Supports compliance reviews and operational forensics.

**CACHEDB – Caching Store (Session & Aggregates)**  
Caching layer (e.g., Redis). Responsibilities:
- Caches per-user monthly spend summaries and KPIs.
- Briefly caches breakdown aggregates to improve performance.

### 2.5 Integration Layer

**ETL – Transaction Ingestion / ETL Pipeline**  
Data ingestion pipeline. Responsibilities:
- Periodically ingests and transforms transaction data from the core ledger (LEDGER) into TXNDB.
- Ensures records used by MCALC/MSUM/BRKDWN are complete and consistent for posted transactions.

**LEDGER – Card Ledger & Posting System**  
Upstream system of record. Responsibilities:
- Maintains authoritative credit card postings and balances.
- Serves as the source for ETL ingestion.

**IDP – Identity Provider / SSO**  
Enterprise authentication system. Responsibilities:
- Issues tokens to authenticated customers.
- Provides introspection/keys for AUTHZ to validate tokens.

**OBS – Observability Stack (Logs/Metrics/Traces)**  
Central observability platform. Responsibilities:
- Collects logs, metrics, and traces from WEB, APIGW, MCALC, MSUM, BRKDWN.
- Enables performance monitoring, anomaly detection, and error investigations.

### 2.6 Cross-Cutting Concerns

**SEC – Security & Compliance Controls**  
Abstract grouping of technical controls. Responsibilities:
- Enforces TLS for all client-to-edge and edge-to-service communication.
- Manages encryption of sensitive fields at rest in TXNDB and ACCTDB.
- Integrates with secrets management for credentials and keys.

**ERR – Error Handling & Resiliency**  
Cross-cutting error and resiliency components. Responsibilities:
- Applies timeouts, retries, and circuit breaking patterns at APIGW and domain service clients.
- Provides standardized error mapping to API responses.

## 3. Integration Points & Data Flow

### 3.1 Flow 1 – Authentication & Session Establishment

1. User navigates to the banking web portal and attempts to access the Monthly Spending Summary Dashboard (WEB).
2. WEB checks for a valid access token via AUTHW.
3. If absent or expired, AUTHW redirects user to IDP for login.
4. IDP authenticates the user and issues an access token.
5. AUTHW stores the token and returns user to WEB.
6. WEB uses the token on subsequent API calls through APIGW.
7. APIGW passes tokens to AUTHZ, which validates token and resolves authorized credit card accounts.

Scope coverage: Required to protect access to monthly summary and breakdown data for credit card spend.

### 3.2 Flow 2 – Monthly Total Credit Card Spend Calculation

1. WEB requests monthly spend summary for a selected or default month from APIGW.
2. APIGW authenticates and authorizes via AUTHZ, applies RATELIM.
3. APIGW calls MSEL with the requested month.
4. MSEL validates month (not future, within configured window), normalizes format (e.g., YYYY-MM), and returns normalized context.
5. APIGW calls MCALC with normalized month and authorized card account identifiers.
6. MCALC queries TXNDB for posted transactions in the normalized month.
7. MCALC applies business rules to include/exclude specific transaction types, limited strictly to credit card products.
8. MCALC aggregates the total monthly spend and persists or updates aggregates in CACHEDB.
9. MCALC returns total monthly spend to APIGW.
10. APIGW returns the monthly total spend to WEB as part of the summary payload.

Scope coverage: Directly maps to the “Monthly total credit card spend calculation” requirement.

### 3.3 Flow 3 – Monthly Summary KPIs & Visualization

1. WEB requests monthly summary KPIs, including charts, for a selected month from APIGW.
2. APIGW verifies auth via AUTHZ and applies RATELIM.
3. APIGW calls MSEL to validate and normalize the requested month.
4. APIGW calls MSUM with normalized month and account context.
5. MSUM retrieves total spend from CACHEDB or MCALC and number of transactions from TXNDB.
6. MSUM computes derived KPIs (e.g., average transaction amount) and normalizes them into a summary DTO.
7. APIGW calls VIZ with KPIs from MSUM and month context from MSEL.
8. VIZ queries CFGDB for feature flags and layout configuration.
9. VIZ creates chart series and card models, optionally caching layout hints in CACHEDB.
10. VIZ returns visualization-ready payloads to APIGW.
11. APIGW returns KPIs and visualization payloads to WEB.
12. WEB renders summary cards and charts for the selected month.

Scope coverage: Satisfies “Monthly summary KPIs” and “Visual representation of monthly spend”.

### 3.4 Flow 4 – Month Selection & Context Handling

1. User selects a month via WEB’s month selector.
2. WEB validates the selection client-side (e.g., format, range) and sends the requested month to APIGW.
3. APIGW forwards month to MSEL.
4. MSEL validates business constraints (e.g., no future months, max historical window), normalizes the month value, and returns normalized context.
5. APIGW reuses the normalized month for calls to MCALC, MSUM, BRKDWN, and VIZ.

Scope coverage: Implements “Month selection to view a specific month’s summary”.

### 3.5 Flow 5 – High-Level Spend Breakdown as Entry Point for Deeper Insights

1. WEB requests high-level spend breakdown for the current month context from APIGW.
2. APIGW validates auth via AUTHZ and applies RATELIM.
3. APIGW calls MSEL to ensure a valid normalized month context.
4. APIGW calls BRKDWN with normalized month and account identifiers.
5. BRKDWN queries TXNDB and ACCTDB to map transactions into broad segments (e.g., category bands or merchant groupings).
6. BRKDWN aggregates totals and percentages per segment and caches results in CACHEDB where appropriate.
7. BRKDWN returns the breakdown to APIGW.
8. APIGW returns breakdown data to WEB.
9. WEB renders a high-level breakdown (e.g., stacked bar chart or category list) with links/outbound triggers to other application modules that handle deeper analytics (those modules are out of scope here).

Scope coverage: Satisfies “Basic breakdown of spend suitable as an entry point into deeper insights”.

### 3.6 Flow 6 – Observability and Audit

1. On each API request, APIGW attaches a correlation ID and logs request metadata to OBS.
2. MCALC, MSUM, BRKDWN, and WEB include correlation IDs in logs and traces sent to OBS.
3. Key user operations (view monthly summary, change month, view breakdown) generate audit events.
4. APIGW and WEB emit audit events into AUDDB using an append-only pattern.

Scope coverage: Supports operational monitoring and traceability for all scoped functionalities.

## 4. Security & Compliance Features

### 4.1 Transport Security

- All client-to-server communication (WEB ↔ APIGW) uses HTTPS with strong TLS configuration.
- Service-to-service calls (APIGW ↔ domain services ↔ data stores) are protected via mutual TLS or secure service mesh where available.

### 4.2 Data Encryption

- Sensitive card-related data at rest in TXNDB and ACCTDB is encrypted using industry-standard algorithms.
- Encryption keys are stored and rotated via centralized secrets management.
- Cached aggregates in CACHEDB may be stored in plain or tokenized form depending on internal policy; no raw card numbers or holder-identifying values are stored in cache.

### 4.3 Input Validation & Output Filtering

- Month selection and other user inputs are validated both in WEB and MSEL (server-side) for format, range, and business constraints.
- APIGW performs strict schema validation on incoming API requests to prevent injection or malformed data.
- Output payloads from domain services exclude detailed transaction-level attributes; only aggregated metrics and segment identifiers are returned.

### 4.4 RBAC/ABAC

- AUTHZ enforces that users can only access data associated with their own card accounts.
- Domain services never accept arbitrary account identifiers from the client; they rely on authenticated context from AUTHZ.

### 4.5 Audit Logging

- Access to monthly summaries and breakdowns is logged with non-identifying references (e.g., hashed user identifiers, month, card account token).
- Audit events are immutable and retained according to internal governance.

### 4.6 Secrets Management

- Database credentials, API keys, and encryption keys are stored in a centralized secrets vault.
- Services retrieve secrets at runtime via secure channels and do not log them.

### 4.7 Compliance Mapping

Based on the scope (credit card transaction data, aggregated views):
- **PCI-DSS** – Applicable for handling card-related data. The design ensures that only tokenized or non-sensitive aggregates are exposed to the UI and that cardholder data is confined to protected data stores with encryption, access control, and audit.
- **Privacy / Data Protection (e.g., GDPR-like controls)** – Personally identifiable details are not surfaced; data is aggregated by account contexts. User rights to access and view their own data are supported by AUTHZ.

No PHI or healthcare-specific regulation is implicated by the scope.

## 5. Resiliency & Error Handling

### 5.1 Retry Mechanisms

- APIGW employs bounded retries for idempotent calls to MCALC, MSUM, BRKDWN, and VIZ when transient errors are detected.
- Retry backoff strategies prevent cascading failures.

### 5.2 Circuit Breakers & Timeouts

- Circuit breakers are configured at APIGW and service-to-service clients to open when error rates exceed thresholds.
- Timeouts are set per API (e.g., summary calculation must respond within a configured SLA) and tuned to prevent thread exhaustion.

### 5.3 Graceful Degradation

- If BRKDWN fails, WEB still displays base KPIs from MSUM and clearly marks breakdown as temporarily unavailable.
- If CACHEDB is unavailable, services fall back to direct TXNDB queries while respecting performance limits.

### 5.4 Error Handling

- Standardized error responses (e.g., HTTP status codes) are used:
  - `400 Bad Request` – invalid month format or out-of-range month.
  - `401 Unauthorized` – missing or invalid tokens.
  - `403 Forbidden` – user not authorized for the requested account.
  - `429 Too Many Requests` – rate limits exceeded.
  - `500 Internal Server Error` – unexpected back-end failure.
  - `503 Service Unavailable` – dependent services unreachable.
- Error responses expose only minimal details (code, generic message, correlation ID), no stack traces or sensitive data.

### 5.5 Observability

- Metrics such as request latency, error rates, cache hit rates, and ETL freshness are collected and monitored.
- Structured logs and traces enable root-cause analysis of performance and error conditions.

## 6. Validation Report

### 6.1 Requirements Coverage

1. **Monthly total credit card spend calculation**  
   - Components: MCALC, TXNDB, CACHEDB, APIGW, WEB.  
   - Flows: Flow 2 (Monthly Total Credit Card Spend Calculation).

2. **Monthly summary KPIs (e.g., total spend, number of transactions)**  
   - Components: MSUM, MCALC, TXNDB, CACHEDB, APIGW, WEB, VIZ, CFGDB.  
   - Flows: Flow 3 (Monthly Summary KPIs & Visualization).

3. **Visual representation of monthly spend (e.g., summary cards or charts)**  
   - Components: WEB, VIZ, MSUM, CFGDB, APIGW.  
   - Flows: Flow 3 (Monthly Summary KPIs & Visualization).

4. **Month selection to view a specific month’s summary**  
   - Components: WEB, MSEL, APIGW, MCALC, MSUM, BRKDWN, VIZ.  
   - Flows: Flow 4 (Month Selection & Context Handling), reused in Flows 2, 3, and 5.

5. **Basic breakdown of spend suitable as an entry point into deeper insights**  
   - Components: BRKDWN, TXNDB, ACCTDB, CACHEDB, APIGW, WEB.  
   - Flows: Flow 5 (High-Level Spend Breakdown as Entry Point for Deeper Insights).

### 6.2 Out of Scope Acknowledgement

1. **Non-credit-card products**  
   - Design explicitly restricts TXNDB and MCALC/MSUM/BRKDWN logic to credit card product lines only. No integration with non-credit-card transaction sources is modeled.

2. **Detailed transaction-level management features**  
   - The WEB UI and APIs provide only aggregated summaries and breakdowns. Operations such as transaction tagging, dispute initiation, export, or editing are intentionally excluded from component definitions and flows.

### 6.3 Compliance Status

- **Transport Security** – **Pass**. TLS enforced across all channels.
- **Data Encryption at Rest** – **Pass-with-conditions**. Requires implementation of encryption and key management in TXNDB/ACCTDB consistent with internal standards.
- **Access Control (RBAC/ABAC)** – **Pass**. AUTHZ enforces per-user account-level access; services rely on resolved context rather than client-provided identifiers.
- **Audit Logging** – **Pass-with-conditions**. Audit schema and retention policies must align with institutional governance and PCI-DSS logging guidelines.
- **PCI-DSS Alignment** – **Pass-with-conditions**. Design avoids exposing cardholder data but depends on underlying infrastructures (TXNDB, LEDGER, secrets management) being PCI-DSS compliant.
- **Privacy / Data Protection** – **Pass**. Only aggregated views are exposed; no PII values or sample data are surfaced.

### 6.4 Identified Ambiguities/Risks

1. **Ambiguity: Exact Spend Inclusion Rules**  
   - Consequence: Inconsistent total spend values across channels or misaligned with official statements, eroding customer trust.
   - Mitigation: Define and version a precise business rules catalogue for MCALC (e.g., handling of reversals, fees, cash advances). Implement automated reconciliation checks against statement data.

2. **Ambiguity: Breakdown Segmentation Model**  
   - Consequence: Users may misinterpret categories or see unstable breakdowns as segmentation rules change.
   - Mitigation: Establish a governance process for category/segment definitions managed via CFGDB, with clear customer-facing labels and change management.

3. **Boundary Risk: Deeper Insights Modules (Out of Scope)**  
   - Consequence: Links from the dashboard to deeper analytics modules might create expectations for features (e.g., transaction tagging or advanced analytics) not covered by this epic.
   - Mitigation: Define clear integration contracts and navigation behavior to downstream modules, ensuring that this dashboard remains a summary entry point and does not own deeper-feature responsibilities.

4. **Risk: ETL Freshness & Data Latency**  
   - Consequence: Users could view outdated monthly data if ETL lags behind the ledger, leading to incorrect budgeting perceptions.
   - Mitigation: Track ETL freshness in OBS and expose a “data as of” indicator in WEB; define SLAs for ETL and alerting for breach.

5. **Risk: Performance Degradation for High-Volume Accounts**  
   - Consequence: Slow dashboard load times for customers with many transactions.
   - Mitigation: Use CACHEDB effectively, index TXNDB queries, and consider pre-computed aggregates for very high-volume segments.
