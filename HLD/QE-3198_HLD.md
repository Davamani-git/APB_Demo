# QE-3198 – Monthly Spending Summary Dashboard – High-Level Design (HLD)

## 1. Architecture Overview

The "Monthly Spending Summary Dashboard" provides credit card customers with a web-based view of their monthly spending, with aggregate metrics and a high-level breakdown for a selected month. The solution is implemented as a secure, enterprise-grade, API-driven architecture integrating with existing card transaction and account platforms.

### 1.1 Logical Architecture

```mermaid
flowchart LR
    subgraph Client_Layer[Client Layer]
        WEB_UI[Web Dashboard (SPA/Web App)]
    end

    subgraph Edge_API_Layer[API / Edge Layer]
        APIGW[API Gateway]
        AUTH[Auth & Session Service]
    end

    subgraph Domain_Services[Domain Services]
        MSSL[Monthly Spend Summary Service]
        CARD_TX_SVC[Card Transactions Adapter Service]
        METRIC_SVC[Summary Metrics Service]
    end

    subgraph Data_Stores[Data Stores]
        SUM_DB[(Spend Summary Store)]
        METRIC_DB[(Analytics & KPIs Store)]
    end

    subgraph Integration_Layer[Integration Layer]
        CORE_CARD_API[Core Card Platform API]
        CUST_PROFILE_API[Customer Profile Service]
    end

    subgraph Cross_Cutting[Cross-Cutting Concerns]
        LOG[Centralized Logging]
        AUDIT[Audit Log Service]
        MON[Monitoring & Alerts]
        CFG[Config & Feature Flags]
        SEC_VAULT[Secrets Vault]
    end

    WEB_UI --> APIGW
    APIGW --> AUTH
    APIGW --> MSSL

    MSSL --> CARD_TX_SVC
    MSSL --> METRIC_SVC
    MSSL --> SUM_DB

    CARD_TX_SVC --> CORE_CARD_API
    MSSL --> CUST_PROFILE_API

    METRIC_SVC --> METRIC_DB

    LOG -.-> APIGW
    LOG -.-> MSSL
    LOG -.-> CARD_TX_SVC
    LOG -.-> METRIC_SVC

    AUDIT -.-> APIGW
    AUDIT -.-> MSSL

    MON -.-> APIGW
    MON -.-> MSSL
    MON -.-> CARD_TX_SVC
    MON -.-> METRIC_SVC

    SEC_VAULT -.-> APIGW
    SEC_VAULT -.-> MSSL
    SEC_VAULT -.-> CARD_TX_SVC
    SEC_VAULT -.-> METRIC_SVC

    CFG -.-> WEB_UI
    CFG -.-> APIGW
    CFG -.-> MSSL
```

### 1.2 Scope Mapping in Architecture

- Monthly total credit card spend calculation → Monthly Spend Summary Service, Card Transactions Adapter Service, Core Card Platform API, Spend Summary Store.
- Monthly summary KPIs (total spend, number of transactions) → Monthly Spend Summary Service, Summary Metrics Service, Analytics & KPIs Store.
- Visual representation of monthly spend → Web Dashboard (SPA/Web App), API Gateway, Monthly Spend Summary Service.
- Month selection to view specific month’s summary → Web Dashboard, API Gateway, Monthly Spend Summary Service, Spend Summary Store.
- Basic breakdown of spend as entry point into deeper insights → Monthly Spend Summary Service, Summary Metrics Service, Web Dashboard, Analytics & KPIs Store.

Out-of-scope elements such as non-credit-card products and detailed transaction management are explicitly excluded from the domain services and UI flows; the architecture only aggregates and summarizes credit card data and exposes links or hooks for deeper analysis handled by other epics.

## 2. Component Descriptions

### 2.1 Web Dashboard (SPA/Web App)

- Provides the front-end experience for the monthly spending summary.
- Implements UI components for:
  - Month selector (e.g., dropdown or date-picker constrained to months with statements).
  - Summary cards showing total spend, transaction count, and other KPIs.
  - High-level breakdown visualization (e.g., simple chart or grouped summary list) designed as an entry point to more detailed insights handled by separate epics.
- Communicates with the backend through secure HTTPS calls to the API Gateway.
- Performs basic client-side validation (valid month value, supported card accounts) before sending requests.
- Does not implement detailed transaction management (filtering by merchant, dispute flows, etc.); these remain out of scope.

### 2.2 API Gateway

- Provides a unified, versioned REST/JSON interface for the dashboard client.
- Enforces authentication and authorization by integrating with the Auth & Session Service.
- Handles routing of dashboard-related requests to the Monthly Spend Summary Service.
- Performs request validation (schema, required fields, permissible month ranges) and rate limiting.
- Terminates TLS connections and offloads cross-cutting responsibilities such as correlation ID injection and request logging.

### 2.3 Auth & Session Service

- Integrates with the bank’s identity platform (e.g., OIDC, SAML) to authenticate credit card customers.
- Issues and validates session tokens or access tokens for API calls.
- Evaluates authorization rules to ensure customers can only access their own accounts and card spending summaries.
- Maintains session state and handles token refresh according to security policies.

### 2.4 Monthly Spend Summary Service (MSSL)

- Core domain service responsible for fulfilling dashboard requests.
- Key capabilities:
  - Accepts requests for monthly spend summary for a customer and card account.
  - Coordinates data retrieval from the Card Transactions Adapter Service and Customer Profile Service.
  - Calculates total spend for the month by aggregating transaction amounts.
  - Calculates supporting KPIs (number of transactions, average transaction size, optional high-level aggregates such as share of recurring vs one-off transactions) within scope.
  - Produces a high-level breakdown of spend (e.g., simple grouping such as categories, merchant segments, or time-of-month pattern) but stops short of detailed transaction management or advanced analytics.
  - Writes summarized results into the Spend Summary Store for caching and reuse.
  - Calls the Summary Metrics Service for KPI persistence and analytics enrichment.
- Applies business rules for handling reversals, refunds, and adjustments where relevant to monthly totals.
- Ensures that only credit card products are included in calculations; checks product type metadata from the Core Card Platform API and excludes any non-card products.

### 2.5 Card Transactions Adapter Service

- Provides a normalized interface to the Core Card Platform API for transaction data.
- Responsibilities:
  - Fetches card transactions for the specified account and month.
  - Applies mapping from core platform data structures into internal transaction models.
  - Filters out non-credit-card products based on product type metadata.
  - Applies basic consistency checks (e.g., ensuring transaction dates fall within the requested month).
- Does not expose operations for transaction editing, disputes, or advanced searching; those remain out of scope.

### 2.6 Summary Metrics Service (METRIC_SVC)

- Dedicated service for computing and persisting monthly summary KPIs.
- Responsibilities:
  - Receives aggregated transaction data from the Monthly Spend Summary Service.
  - Computes metrics such as total spend, number of transactions, optional secondary KPIs (e.g., average transaction size, count of days with activity) consistent with the scope.
  - Persists metrics to the Analytics & KPIs Store.
  - Serves metrics back to the Monthly Spend Summary Service via internal APIs for real-time response.

### 2.7 Spend Summary Store (SUM_DB)

- Data store used to persist pre-computed monthly summaries to optimize performance.
- Holds per-customer, per-card, per-month summary records containing:
  - Aggregate monetary totals.
  - Transaction counts.
  - Pre-computed breakdown structures (e.g., category-level totals).
- Stores only derived data necessary for the summary view; does not hold raw transaction-level data or personally identifiable information beyond stable identifiers (e.g., hashed or tokenized customer IDs).

### 2.8 Analytics & KPIs Store (METRIC_DB)

- Data store optimized for storing KPI metrics and simple analytical aggregates.
- Supports querying by customer, card account, and month.
- Designed to be extendable for future epics that might compute more advanced analytics, without changing the core schema for the simple KPIs in this epic.

### 2.9 Core Card Platform API (CORE_CARD_API)

- Existing enterprise API providing authoritative card transaction and account data.
- The Monthly Spend Summary solution uses read-only operations to retrieve transaction data.
- No write-back or transaction management operations are invoked by this epic.

### 2.10 Customer Profile Service (CUST_PROFILE_API)

- Provides customer profile and account linkage information.
- Used by the Monthly Spend Summary Service to ensure that the requesting identity is associated with the card account in question.
- May provide risk or segmentation attributes used for future analytics but these are not surfaced directly in the monthly summary UI.

### 2.11 Cross-Cutting Services

- Centralized Logging (LOG): Collects structured logs, including correlation IDs, request metadata, and performance measurements.
- Audit Log Service (AUDIT): Records access to monthly spend summaries, including customer ID tokens, card identifiers, time, and high-level action (view monthly summary); no detailed transaction content is stored in audit logs.
- Monitoring & Alerts (MON): Captures health metrics and sets alerts on latency, error rates, and throughput.
- Config & Feature Flags (CFG): Controls UI feature toggles (e.g., enabling new KPIs) and backend behavior such as maximum months of history pre-computed.
- Secrets Vault (SEC_VAULT): Securely stores API credentials, database connection strings, and encryption keys.

## 3. Integration Points & Data Flows

### 3.1 Flow 1 – Authentication & Session Establishment

1. Customer navigates to the banking web application and accesses the credit card spending area.
2. Web Dashboard redirects to the Auth & Session Service or the enterprise identity provider for login.
3. Customer completes authentication (e.g., username/password plus MFA as required).
4. Identity provider returns tokens to the Web Dashboard, which uses them to call the API Gateway.
5. API Gateway validates the tokens with the Auth & Session Service and establishes a session context, including customer ID.
6. Successful authentication is logged in Centralized Logging and recorded in the Audit Log Service.

Scope mapping:
- Supports all scoped features by ensuring only authenticated customers can access monthly summaries.

### 3.2 Flow 2 – Fetch Monthly Spend Summary (Primary Request Flow)

1. Customer selects a card account and a month in the Web Dashboard.
2. Web Dashboard performs basic validation of the month (e.g., proper format, allowed range) and calls the API Gateway `GET /spend-summary?cardId=&month=`.
3. API Gateway validates the request, checks authorization with Auth & Session Service, and forwards the request to the Monthly Spend Summary Service.
4. Monthly Spend Summary Service checks if a pre-computed summary exists in the Spend Summary Store for the given card and month.
5. If present and within a configured freshness window, MSSL loads the summary and complementary KPIs from the Analytics & KPIs Store via Summary Metrics Service.
6. If not present or stale, MSSL calls Card Transactions Adapter Service to retrieve raw transactions from the Core Card Platform API.
7. Card Transactions Adapter Service queries Core Card Platform API for the requested account and month (read-only operations).
8. Card Transactions Adapter Service filters out non-credit-card products and normalizes transactions.
9. MSSL aggregates the transactions to compute monthly totals and passes them to Summary Metrics Service.
10. Summary Metrics Service computes KPIs (total spend, number of transactions, etc.) and writes them to Analytics & KPIs Store.
11. MSSL computes high-level breakdowns and writes the summary record to Spend Summary Store.
12. MSSL assembles the summary response payload (totals, KPIs, breakdown) and returns it to API Gateway.
13. API Gateway sends the response to the Web Dashboard.
14. Web Dashboard renders the summary cards and breakdown visualization.

Scope mapping:
- Monthly total credit card spend calculation → Steps 6–11.
- Monthly summary KPIs → Steps 9–10.
- Visual representation of monthly spend → Steps 13–14.
- Month selection → Steps 1–3.
- Basic breakdown suitable as entry point to deeper insights → Steps 10–11 and UI rendering.

Out-of-scope acknowledgments:
- Only read operations on card data; no transaction edits or management.
- Only credit card transactions included; other product lines are excluded.

### 3.3 Flow 3 – Observability & Audit

1. For each request, API Gateway assigns a correlation ID.
2. MSSL, Card Transactions Adapter Service, and Summary Metrics Service propagate the correlation ID in logs.
3. Key events (authentication, summary retrieval, errors) are logged to Centralized Logging.
4. Access to monthly summary views is recorded in Audit Log Service with anonymized customer identifiers and card references.
5. Monitoring & Alerts collect metrics such as response times, error rates, and cache hit ratio from Spend Summary Store.
6. Operations teams use monitoring dashboards and alerts to ensure service health.

Scope mapping:
- Supports reliability and security expectations; indirectly underpins all scoped functional features.

## 4. Security & Compliance Features

### 4.1 Transport Security

- All client-to-server interactions (Web Dashboard → API Gateway) use HTTPS with modern TLS configurations.
- Internal microservice calls also use TLS where mandated by enterprise policy or are placed inside a mutually authenticated service mesh.

### 4.2 Data Encryption

- Sensitive identifiers (customer ID, card ID tokens) are encrypted at rest in Spend Summary Store and Analytics & KPIs Store using enterprise-managed keys.
- Database connections use encrypted channels.
- Secrets Vault holds encryption keys; services access keys via short-lived tokens or secure service identities.

### 4.3 Input Validation

- API Gateway validates request parameters (card ID, month) for format, allowed ranges, and presence.
- Monthly Spend Summary Service enforces business rules (e.g., month not in the distant future, card belongs to authenticated customer via Customer Profile Service).

### 4.4 Output Filtering

- Monthly summary responses include only aggregated, non-sensitive financial metrics (totals, counts, high-level breakdowns), not raw transaction details.
- No personally identifiable information such as full card numbers, names, or addresses appears in the API responses.
- High-level breakdowns are limited to aggregates (e.g., category totals) and avoid exposing specific merchants or transaction narratives.

### 4.5 RBAC / ABAC

- Auth & Session Service enforces that only customers or authorized delegates can view monthly summaries tied to their own card accounts.
- Authorization checks verify customer-to-card relationship via Customer Profile Service.
- Role attributes (e.g., customer vs. support staff) may determine additional access rules but support staff access patterns are out of scope for this epic.

### 4.6 Audit Logging

- Access to monthly summaries is recorded with:
  - Timestamp.
  - Anonymized customer identifier.
  - Card account reference token.
  - Requested month.
  - Result (success/failure).
- Error conditions in fetching or computing summaries are logged with diagnostic metadata but without sensitive payloads.

### 4.7 Secrets Management

- Secrets Vault stores:
  - Credentials for Core Card Platform API.
  - Database credentials for Spend Summary Store and Analytics & KPIs Store.
  - Service credentials used by monitoring, logging, and audit subsystems.
- All services use managed identities or secure service accounts to retrieve secrets.

### 4.8 Compliance Mapping

Based on handling of credit card spending data:

- PCI-DSS: Read-only access to card-related transaction data is involved.
  - Card PANs are never exposed to the dashboard; only tokenized or masked identifiers are used.
  - Access is strongly authenticated and logged.
  - Data in transit and at rest are encrypted.
  - The design aligns with PCI-DSS principles for restricting access and protecting cardholder data, but full compliance requires adherence to enterprise infrastructure and operational controls (Pass-with-conditions).

- Privacy regulations (e.g., GDPR/CCPA where applicable):
  - The solution limits outputs to necessary aggregated financial information.
  - No unnecessary personal data is processed beyond identifiers needed for authorization and aggregation.
  - Data retention of summaries follows enterprise policies and regional regulations (Pass-with-conditions; exact retention parameters must be configured).

## 5. Resiliency & Error Handling

### 5.1 Retry Mechanisms

- API Gateway does not automatically retry external requests to avoid duplicate actions; it relies on idempotent backend behavior.
- Monthly Spend Summary Service uses bounded retries with backoff when calling Card Transactions Adapter Service and Summary Metrics Service.
- Card Transactions Adapter Service uses configured retry policies when accessing Core Card Platform API.

### 5.2 Circuit Breakers & Timeouts

- Timeouts are configured for each inter-service call to prevent request hanging.
- Circuit breakers in MSSL protect against repeated failures from Card Transactions Adapter Service or Summary Metrics Service; when open, MSSL may fall back to serving cached summaries where available.

### 5.3 Graceful Degradation

- If Analytics & KPIs Store is unavailable but raw transaction data can be retrieved, MSSL can compute and return core metrics in-memory without persistence, with a partial-feature flag in the response.
- If Spend Summary Store is unavailable, MSSL bypasses cache and computes summaries directly from transaction data.
- If Core Card Platform API is unavailable, MSSL returns a well-defined error indicating that spending data cannot be retrieved, without exposing internal details.

### 5.4 Error Handling & Status Codes

Representative API Gateway responses:

- `200 OK`: Monthly summary successfully returned.
- `400 Bad Request`: Invalid card ID, month format, or unsupported request parameters; error message kept generic.
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: Authenticated but not authorized to access the requested card account.
- `404 Not Found`: No data available for the requested month/card combination.
- `500 Internal Server Error`: Unexpected backend failure; response does not expose stack traces or internal system details.
- `503 Service Unavailable`: Upstream dependency (Core Card Platform API or data store) unavailable.

Errors are logged with correlation IDs. Only high-level error reasons are returned to clients; internal technical details remain in logs for investigation.

### 5.5 Observability

- Metrics collected:
  - Request counts and latencies per endpoint.
  - Error rates by type (4xx/5xx).
  - Cache hit/miss ratio in Spend Summary Store.
  - Dependency health metrics for Core Card Platform API and data stores.
- Dashboards and alerts:
  - Threshold-based alerts on high error rates or latency spikes.
  - Health checks exposed by MSSL and adapter services for monitoring systems.

## 6. Validation Report

### 6.1 Requirements Coverage

1. Monthly total credit card spend calculation
   - Components: Monthly Spend Summary Service, Card Transactions Adapter Service, Core Card Platform API, Spend Summary Store.
   - Flows: Flow 2 – Fetch Monthly Spend Summary.

2. Monthly summary KPIs (e.g., total spend, number of transactions)
   - Components: Monthly Spend Summary Service, Summary Metrics Service, Analytics & KPIs Store.
   - Flows: Flow 2 – Fetch Monthly Spend Summary.

3. Visual representation of monthly spend (e.g., summary cards or charts)
   - Components: Web Dashboard, API Gateway, Monthly Spend Summary Service.
   - Flows: Flow 2 – Fetch Monthly Spend Summary.

4. Month selection to view a specific month’s summary
   - Components: Web Dashboard, API Gateway, Monthly Spend Summary Service, Spend Summary Store.
   - Flows: Flow 2 – Fetch Monthly Spend Summary.

5. Basic breakdown of spend suitable as an entry point into deeper insights
   - Components: Monthly Spend Summary Service, Summary Metrics Service, Web Dashboard, Analytics & KPIs Store.
   - Flows: Flow 2 – Fetch Monthly Spend Summary.

### 6.2 Compliance Status

- PCI-DSS (cardholder data protection): Pass-with-conditions
  - Justification: Design enforces encryption in transit and at rest, restricts outputs to aggregates, and ensures strong authentication and audit logging. Full compliance depends on underlying infrastructure hardening, key management policies, and regular audits.

- Privacy (e.g., GDPR/CCPA): Pass-with-conditions
  - Justification: Design minimizes personal data exposure and uses aggregated financial information. Compliance depends on configured data retention periods, consent management, and data subject rights processes operated by the organization.

- Internal Security Policies & Logging Standards: Pass
  - Justification: Logging, audit, and secrets management are integrated as cross-cutting services aligned with enterprise standards.

### 6.3 Identified Ambiguities / Risks

1. Ambiguity/Risk: Definition of "basic breakdown of spend"
   - Consequence: Over-implementation could lead to detailed analytics or transaction-level views that overlap with future epics or exceed the intended scope.
   - Mitigation: Establish a clear breakdown specification (e.g., limited to a small number of aggregate dimensions like category totals) and document strict boundaries on what constitutes deeper insight (which will be handled in separate epics).

2. Ambiguity/Risk: Handling refunds, reversals, and adjustments in monthly totals
   - Consequence: Inconsistent totals across channels or confusion for customers if totals diverge from statements.
   - Mitigation: Align calculation rules with statement generation logic from Core Card Platform. Document business rules and implement unit/integration tests to verify alignment.

3. Ambiguity/Risk: Non-credit-card products
   - Consequence: If product type classification is incorrect or inconsistent, non-card transactions might be included inadvertently.
   - Mitigation: Enforce strict product filters in Card Transactions Adapter Service and validate against master product catalogs. Add monitoring for anomalies (e.g., detection of non-card product codes) and fail safe by excluding uncertain records.

4. Ambiguity/Risk: Data freshness vs. caching behavior
   - Consequence: Customers might see outdated summaries for the selected month if caching windows are too long.
   - Mitigation: Configure maximum age for cached summaries and provide indicators of last refresh time in backend responses (for potential UI display in future epics). Implement cache invalidation strategies aligned with statement cycles.

5. Ambiguity/Risk: Support staff or back-office access patterns
   - Consequence: Without clear RBAC rules, internal users could access customer monthly summaries in ways that require additional compliance controls.
   - Mitigation: Restrict internal access for this epic to monitoring and support tools that show only technical metrics; handle back-office views of customer summaries in a separate, clearly scoped epic with dedicated access controls.
