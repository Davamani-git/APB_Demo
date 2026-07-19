# High-Level Design: Monthly Spending Summary Dashboard (QE-3258)

## 1. Architecture Overview

The Monthly Spending Summary Dashboard is a web-based capability within the banks digital channels that generates an aggregated monthly view of credit card spending for a selected month. The architecture follows a layered, enterprise-ready pattern with a client experience layer, API/edge layer, domain services, data access layer, integration services to card transaction systems, and cross-cutting security and observability.

### 1.1 Logical Architecture

```mermaid
flowchart LR
    subgraph Client_Layer[Client Layer]
        WEB_UI[Banking Web App - Spending Summary UI]
    end

    subgraph Edge_API_Layer[API & Edge Layer]
        APIGW[API Gateway / Edge Router]
        SPEND_API[Spending Summary REST API]
    end

    subgraph Domain_Services[Domain Services]
        MONTHLY_AGG_SVC[Monthly Spend Aggregation Service]
        KPI_SVC[Summary KPI Computation Service]
        BREAKDOWN_SVC[High-Level Spend Breakdown Service]
        MONTH_SELECTOR_SVC[Month Selection & Context Service]
    end

    subgraph Data_Stores[Data Stores]
        ANALYTICS_DB[Spending Analytics Store]
        TXN_READ_DB[Credit Card Transactions Read Replica]
        REF_DATA_DB[Reference Data Store]
    end

    subgraph Integration_Layer[Integration Layer]
        CARD_TXN_API[Credit Card Transactions API]
        CUST_PROFILE_API[Customer Profile Service]
    end

    subgraph Cross_Cutting[Cross-Cutting Concerns]
        AUTH_SVC[Authentication & Session Service]
        AUTHZ_SVC[Authorization (RBAC/ABAC)]
        AUDIT_SVC[Audit Logging Service]
        METRICS_SVC[Observability & Metrics]
        SECRETS_MGR[Secrets Management]
    end

    WEB_UI --> APIGW
    APIGW --> AUTH_SVC
    APIGW --> SPEND_API

    SPEND_API --> MONTHLY_AGG_SVC
    SPEND_API --> KPI_SVC
    SPEND_API --> BREAKDOWN_SVC
    SPEND_API --> MONTH_SELECTOR_SVC

    MONTHLY_AGG_SVC --> TXN_READ_DB
    MONTHLY_AGG_SVC --> CARD_TXN_API

    KPI_SVC --> ANALYTICS_DB
    KPI_SVC --> TXN_READ_DB

    BREAKDOWN_SVC --> ANALYTICS_DB
    BREAKDOWN_SVC --> REF_DATA_DB

    MONTH_SELECTOR_SVC --> ANALYTICS_DB

    SPEND_API --> AUDIT_SVC
    SPEND_API --> METRICS_SVC

    AUTH_SVC --> CUST_PROFILE_API

    SECRETS_MGR --> AUTH_SVC
    SECRETS_MGR --> SPEND_API
    SECRETS_MGR --> Integration_Layer
```

### 1.2 Scope Mapping to Architecture

- Monthly total credit card spend calculation is performed by **Monthly Spend Aggregation Service** using **Credit Card Transactions Read Replica** and **Credit Card Transactions API**.
- Monthly summary KPIs (total spend, number of transactions, etc.) are computed by **Summary KPI Computation Service** and persisted or derived from **Spending Analytics Store**.
- Visual representation of monthly spend is rendered by **Banking Web App Spending Summary UI** consuming data from **Spending Summary REST API**.
- Month selection to view a specific month is handled by **Month Selection & Context Service**, surfaced in the **Web UI**, and applied across all backend computations.
- Basic breakdown of spend suitable as an entry point into deeper insights is provided by **High-Level Spend Breakdown Service** using **Spending Analytics Store** and **Reference Data Store**.

Out-of-scope capabilities are explicitly excluded:
- Non-credit-card products are not modeled in the aggregation, KPI, or breakdown services; these services filter strictly by credit card accounts.
- Detailed transaction-level management features (e.g., dispute workflows, tagging, notes, exports) are not implemented in this design and are left to downstream or separate epics.

---

## 2. Component Descriptions

### 2.1 Client Layer

**Banking Web App - Spending Summary UI**
- Provides the monthly spending summary dashboard view within the existing online banking web application.
- Renders summary cards, charts, and basic breakdown components based on JSON responses from the Spending Summary REST API.
- Offers month selection controls (e.g., dropdown or calendar) constrained to months where transaction data exists for the customers credit card accounts.
- Implements client-side input validation for month selection and prevents users from navigating outside their authenticated session.
- Does not expose transaction-level management features; it only shows aggregated values and high-level breakdowns.

### 2.2 API & Edge Layer

**API Gateway / Edge Router**
- Terminates TLS connections from the web application.
- Routes authenticated requests to the Spending Summary REST API based on resource path and HTTP method.
- Enforces global rate limiting, request quotas, and IP allow/deny rules where configured.
- Performs basic request validation (e.g., required headers, format of month parameter) before forwarding to backend.

**Spending Summary REST API**
- Provides REST endpoints to retrieve monthly credit card spending summaries and breakdown data for a selected month.
- Validates the requesting customer identity and credit card account access via authorization services.
- Coordinates calls to Monthly Spend Aggregation Service, Summary KPI Computation Service, High-Level Spend Breakdown Service, and Month Selection & Context Service.
- Encapsulates business rules around supported date ranges, partial data, and applicable cards.
- Returns only aggregated, non-PII, and non-PHI values (e.g., totals, counts, classification labels) to the client.

### 2.3 Domain Services

**Monthly Spend Aggregation Service**
- Calculates total credit card spend for the selected month across all eligible credit card accounts associated with the authenticated customer.
- Applies card-specific rules for spend inclusion (e.g., posted transactions only, reversals handling, currency conversion) and filters out non-spend transactions (e.g., fees, refunds if excluded by business rules).
- Retrieves transactions from the Credit Card Transactions Read Replica for performance and can fall back to the Credit Card Transactions API if necessary.
- Emits aggregation results (e.g., total amount, number of transactions) and metadata (e.g., completeness of data, data source used).

**Summary KPI Computation Service**
- Computes key performance indicators for the month such as total spend, number of transactions, average transaction amount, max/min transaction, and other configured KPIs.
- Uses both aggregation results and direct queries against Spending Analytics Store and Transactions Read Replica when precomputed KPIs are available.
- Encapsulates business logic for rounding, currency normalization, and threshold-based classification (e.g. High spend indicator).
- Provides a normalized KPI response model to the Spending Summary REST API.

**High-Level Spend Breakdown Service**
- Produces high-level spending breakdowns suitable for entry into deeper insights without exposing full categorization complexity.
- Generates breakdowns such as spend segments by merchant category group, online vs. in-store, or other high-level facets defined by business.
- Operates on aggregated and/or preprocessed analytics data in the Spending Analytics Store, using classification rules held in the Reference Data Store.
- Ensures breakdowns remain at a summary level and do not include detailed transaction-level fields or PII.

**Month Selection & Context Service**
- Manages logic for determining available months for spending summaries for a given customer (e.g., last 12 months, based on account open date).
- Validates the requested month (e.g., format, range, available data) and normalizes to internal representation.
- Ensures that all downstream services receive a consistent month context (start/end timestamps, time zone, settlement vs posting date usage).
- Maintains simple metadata about month availability in the Spending Analytics Store to optimize performance.

### 2.4 Data Stores

**Credit Card Transactions Read Replica**
- Read-optimized database or data mart mirroring posted credit card transactions from the core card system.
- Stores transaction-level data with appropriate anonymization/pseudonymization where required for analytics, but this HLD emphasizes aggregate queries.
- Indexed by customer identifiers and transaction dates to support efficient monthly aggregation queries.
- Accessed only by backend domain services; not directly exposed to client layers.

**Spending Analytics Store**
- Specialized data store (e.g., data warehouse or analytical DB) containing precomputed aggregates and KPI facts for credit card spend.
- Holds monthly summary facts, breakdown aggregates, and historical metrics for each credit card customer.
- Supports fast query patterns for dashboard retrieval with appropriate partitioning by month and customer.
- Receives data from offline ETL or streaming pipelines (not detailed here if out of scope for this epic).

**Reference Data Store**
- Stores classification rules, mapping tables, and configuration supporting spend breakdowns (e.g., mapping merchant codes into high-level categories).
- Supports versioned rule sets to ensure consistency of breakdowns over time.
- Provides a read-only interface to domain services for real-time classification.

### 2.5 Integration Layer

**Credit Card Transactions API**
- Upstream API provided by the card processing platform supporting retrieval of transaction data for specified accounts and time ranges.
- Used by Monthly Spend Aggregation Service when data is not yet materialized in the Transactions Read Replica or for validation.
- Enforces upstream security controls (mutual TLS, signed tokens) and rate limits.

**Customer Profile Service**
- Provides details about the authenticated customer necessary for authorization and account linking (e.g., customer-to-account relationships, preferences flags).
- Queried by Authentication & Session Service and/or Spending Summary REST API to ensure only permitted credit card accounts are included in spend calculations.

### 2.6 Cross-Cutting Concerns

**Authentication & Session Service**
- Authenticates end users via enterprise identity provider (e.g., SSO, OAuth2/OIDC), issuing secure session tokens.
- Validates tokens on each request reaching the API Gateway before routing to backend APIs.
- Ensures that only authenticated sessions can access the Spending Summary endpoints.

**Authorization (RBAC/ABAC) Service**
- Enforces that users can only see spending summaries for credit card accounts they are authorized to view.
- Uses role-based and attribute-based rules, including account ownership type (primary, joint, authorized user) and regional restrictions.

**Audit Logging Service**
- Captures access events such as monthly summary retrieval, month selection changes, and any failed authorization attempts.
- Logs only necessary identifiers (e.g., hashed customer identifier, account reference IDs, timestamp, action type) without sensitive information.

**Observability & Metrics Service**
- Collects technical telemetry (latency, error rates, throughput, dependency health) for all Spending Summary flows.
- Provides dashboards and alerts for operational teams to monitor reliability and performance.

**Secrets Management Service**
- Stores and rotates secrets required by the Spending Summary system (e.g., API keys, DB credentials, signing keys, encryption keys).
- Provides runtime access via secure, audited APIs.

---

## 3. Integration Points & Data Flows

### 3.1 Flow 1: Authentication & Session Establishment

1. User navigates to the banking web application and attempts to access the Monthly Spending Summary Dashboard.
2. The web application redirects the user to the enterprise identity provider for authentication, if not already signed in.
3. Upon successful authentication, the identity provider issues a secure token (e.g., ID token and access token) to the web app.
4. The web app includes the token in the Authorization header for all subsequent API calls.
5. The API Gateway validates the token with the Authentication & Session Service, checking signature, expiry, and claims.
6. On success, the API Gateway allows the request to continue to the Spending Summary REST API; otherwise, it returns an appropriate HTTP error.

Scope coverage: Establishes secure access for all subsequent monthly spending summary requests.

### 3.2 Flow 2: Month Selection & Availability

1. The user opens the Monthly Spending Summary Dashboard in the web app.
2. The web app calls the Spending Summary REST API endpoint to retrieve available months for the authenticated customer.
3. The Spending Summary REST API delegates to the Month Selection & Context Service.
4. Month Selection & Context Service queries Spending Analytics Store for available months based on analytics availability and account open date.
5. The service validates the availability range (e.g., last N months) and builds a list of selectable months.
6. The REST API returns the list of months to the web UI.
7. The user selects a month, and the web UI sends the selected month to the REST API in a new request for summary data.

Scope coverage: Implements month selection to view a specific months summary and ensures the backend has a consistent month context.

### 3.3 Flow 3: Monthly Total Credit Card Spend Calculation

1. The Web UI sends a request to the Spending Summary REST API with the selected month.
2. The API Gateway validates and forwards the request to the REST API.
3. The REST API validates authorization, ensuring only credit card accounts owned or permitted for the user are considered.
4. The REST API calls Monthly Spend Aggregation Service with the customer identifier and normalized month context.
5. Monthly Spend Aggregation Service queries Credit Card Transactions Read Replica for posted transactions within the month.
6. If data completeness requires validation or if read replica does not yet contain all data, the service calls Credit Card Transactions API for incremental or verification queries.
7. The service applies business filtering rules (e.g., includes purchases, excludes non-spend entries depending on configuration) and calculates total spend and transaction count.
8. The aggregation results are returned to the Spending Summary REST API.

Scope coverage: Satisfies monthly total credit card spend calculation and contributes to monthly summary KPIs.

### 3.4 Flow 4: Summary KPI Computation and Response Assembly

1. Following aggregation, the Spending Summary REST API calls Summary KPI Computation Service with aggregation results and month context.
2. Summary KPI Computation Service checks Spending Analytics Store for precomputed KPIs and merges them with live aggregation where necessary.
3. The service computes KPIs (total spend, number of transactions, average transaction value, high-level trend indicators) consistent with business rules.
4. The REST API concurrently calls High-Level Spend Breakdown Service with month context and customer/account identifiers.
5. High-Level Spend Breakdown Service retrieves summary breakdown data from Spending Analytics Store, applying classification rules from Reference Data Store (e.g., grouping merchant categories).
6. Both KPI and breakdown responses are combined into a unified response model.
7. The REST API writes an access log entry via Audit Logging Service, including hashed customer ID, month, and endpoint accessed.
8. Observability & Metrics Service records latency, outcome (success/failure), and dependency health metrics.
9. The unified response is returned to the Web UI for rendering.

Scope coverage: Satisfies monthly summary KPIs, visual representation of monthly spend (data provision), and basic breakdown of spend.

### 3.5 Flow 5: Dashboard Rendering & User Experience

1. The Web UI receives the unified summary response.
2. Client-side components render summary cards showing total spend, transaction count, and other KPIs.
3. Visual elements (charts/graphs) are built using the breakdown data, showing high-level segments of spend.
4. The UI highlights the selected month context and allows users to change the month, repeating Flows 23.
5. Client-side input validation ensures month changes use valid options from the available month list.

Scope coverage: Delivers the visual representation of monthly spend and supports month selection interaction.

### 3.6 Flow 6: Error Handling & Graceful Degradation

1. If upstream integrations (Credit Card Transactions API, analytics store) experience errors or timeouts, domain services return standardized error codes and partial data flags.
2. Spending Summary REST API maps internal errors into safe, user-facing HTTP status codes and error messages (e.g., 503 for temporary unavailability, 500 for unexpected server errors, 400 for invalid month value).
3. The Web UI displays non-technical messages (e.g., Were unable to display your spending summary right now. Please try again later.) while ensuring no sensitive technical details are exposed.
4. Where partial results are available (e.g., analytics unavailable but core transactions accessible), the UI may show basic totals with a notice that some insights are temporarily unavailable.

Scope coverage: Ensures resilient experience around the main capabilities without expanding into out-of-scope transaction management.

---

## 4. Security & Compliance Features

### 4.1 Transport Security
- All client-to-server traffic uses HTTPS with TLS 1.2+ enforced at the API Gateway and web server.
- Mutual TLS is used between Spending Summary REST API and upstream integration services where supported (e.g., Credit Card Transactions API).

### 4.2 Data Encryption
- Data at rest in Credit Card Transactions Read Replica and Spending Analytics Store is encrypted using industry-standard encryption algorithms.
- Keys are managed by Secrets Management Service or enterprise key management system.

### 4.3 Input Validation
- API Gateway validates basic request shape and required headers.
- Spending Summary REST API validates month parameter format, range, and customer/account associations.
- Web UI validates client-side month selection against the list of available months.

### 4.4 Output Filtering
- Responses contain aggregated amounts, counts, and high-level category labels only.
- No raw card numbers, personally identifiable information, or detailed transaction fields are included.
- Error responses avoid exposing stack traces or internal identifiers.

### 4.5 RBAC/ABAC Authorization
- Authorization service enforces that only the authenticated customer (and allowed delegates per policy) can access their credit card monthly summary.
- Attribute-based rules ensure that only credit card products are included; non-credit-card accounts are excluded by design.

### 4.6 Audit Logging
- Access to monthly summaries, month changes, and failed authorization attempts are captured in audit logs.
- Logs include event type, timestamp, hashed customer identifier, and non-sensitive contextual metadata.
- Audit logs are immutable and stored in a write-once, read-many location per enterprise policy.

### 4.7 Secrets Management
- All secrets (API keys, certificates, DB credentials) are stored in Secrets Management Service.
- Regular rotation schedules and strict access policies are applied.

### 4.8 Compliance Mapping
- **Cardholder data protection**: The design does not expose card numbers or sensitive authentication data; only aggregated spend figures and high-level breakdowns are presented.
- **Privacy and data minimization**: Only data required to compute monthly summaries and breakdowns is accessed and retained; UI responses avoid PII.
- **Logging and monitoring**: Audit and observability logs support compliance with internal security and privacy policies.

---

## 5. Resiliency & Error Handling

### 5.1 Retry Mechanisms
- Domain services use bounded retries with exponential backoff when calling upstream integrations (Credit Card Transactions API, analytics store), avoiding thundering herd effects.
- Retries are applied only for idempotent read operations; no financial posting actions are involved in this epic.

### 5.2 Circuit Breakers & Timeouts
- Circuit breakers are configured around calls to Credit Card Transactions API and Spending Analytics Store to prevent cascading failures.
- Sensible timeouts (e.g., a few seconds) are applied to all external calls; failures are surfaced as partial data or unavailability messages.

### 5.3 Graceful Degradation
- If Spending Analytics Store is unavailable, the system can still return basic totals and transaction counts from the Transactions Read Replica, while breakdown visualizations are disabled with appropriate messaging.
- If both transactions and analytics sources are unavailable, the UI displays a friendly error message without exposing internal error details.

### 5.4 Error Handling & Status Codes
- 200 OK: Successful summary retrieval.
- 400 Bad Request: Invalid month parameters, malformed inputs.
- 401 Unauthorized: Missing or invalid authentication token.
- 403 Forbidden: User not authorized to access requested account data.
- 404 Not Found: Month not available for the given customer.
- 429 Too Many Requests: Rate limit exceeded at API Gateway.
- 500 Internal Server Error: Unexpected unhandled error.
- 503 Service Unavailable: Upstream dependency unavailable or circuit breaker open.

### 5.5 Observability
- Metrics emitted include request latency, error rate, downstream dependency response times, and circuit breaker events.
- Centralized logging captures structured logs for key service operations.
- Tracing (e.g., distributed trace IDs) follows requests across web UI, API Gateway, REST API, and domain services.

---

## 6. Validation Report

### 6.1 Requirements Coverage

1. **Monthly total credit card spend calculation**
   - Components: Monthly Spend Aggregation Service, Spending Summary REST API, Credit Card Transactions Read Replica, Credit Card Transactions API.
   - Flows: Flow 3 (Monthly Total Credit Card Spend Calculation).

2. **Monthly summary KPIs (e.g., total spend, number of transactions)**
   - Components: Summary KPI Computation Service, Spending Analytics Store, Monthly Spend Aggregation Service, Spending Summary REST API.
   - Flows: Flow 3 (Monthly Total Credit Card Spend Calculation), Flow 4 (Summary KPI Computation and Response Assembly).

3. **Visual representation of monthly spend (e.g., summary cards or charts)**
   - Components: Banking Web App Spending Summary UI, Spending Summary REST API.
   - Flows: Flow 4 (Summary KPI Computation and Response Assembly), Flow 5 (Dashboard Rendering & User Experience).

4. **Month selection to view a specific months summary**
   - Components: Month Selection & Context Service, Banking Web App Spending Summary UI, Spending Summary REST API, Spending Analytics Store.
   - Flows: Flow 2 (Month Selection & Availability), Flow 5 (Dashboard Rendering & User Experience).

5. **Basic breakdown of spend suitable as an entry point into deeper insights**
   - Components: High-Level Spend Breakdown Service, Spending Analytics Store, Reference Data Store, Banking Web App Spending Summary UI.
   - Flows: Flow 4 (Summary KPI Computation and Response Assembly), Flow 5 (Dashboard Rendering & User Experience).

### 6.2 Out of Scope Acknowledgement

1. **Non-credit-card products**
   - Explicitly excluded from aggregation and breakdown logic. Domain services filter by credit card account types only.
   - No components compute or display summary data for deposits, loans, or other products.

2. **Detailed transaction-level management features**
   - Design intentionally omits dispute handling, transaction tagging, exporting, or detailed transaction editing features.
   - UI only surfaces aggregated data and high-level breakdowns; any future transaction-level capabilities would be handled by separate services/epics.

### 6.3 Compliance Status

- **Transport Security**: **Pass** 3 TLS enforced and mutual TLS for service-to-service where applicable.
- **Data Encryption at Rest**: **Pass** 3 Encryption mandated for all primary data stores.
- **Access Control (Authn/Authz)**: **Pass** 3 Strong authentication and RBAC/ABAC authorization enforced at API and services.
- **Privacy / Data Minimization**: **Pass-with-conditions** 3 Design minimizes PII exposure but depends on correct configuration of data masking in analytics and logs; requires implementation validation.
- **Audit & Monitoring**: **Pass** 3 Audit logging and observability are designed into all flows.
- **Cardholder Data Protection**: **Pass-with-conditions** 3 Card data is not exposed by the dashboard; depends on upstream data stores enforcing tokenization/masking and secure configuration.

### 6.4 Identified Ambiguities / Risks

1. **Ambiguity: Definition of basic breakdown granularity**
   - Consequence: Overly detailed breakdown may inadvertently reveal sensitive behavioral insights or create performance overhead; overly coarse breakdown may fail to meet business expectations.
   - Mitigation: Establish explicit breakdown design guidelines (e.g., number of categories, aggregation rules) approved by product, risk, and analytics stakeholders before implementation.

2. **Ambiguity: Treatment of refunds, chargebacks, and fees in total spend**
   - Consequence: Different interpretations of total spend could lead to customer confusion and inconsistent KPI reporting.
   - Mitigation: Define and document clear business rules for which transaction types contribute to spend, and implement them consistently in Monthly Spend Aggregation Service.

3. **Risk: Dependency on analytics availability for breakdowns and KPIs**
   - Consequence: If analytics pipelines or stores are frequently unavailable, the dashboard may regularly degrade to basic totals, undermining user value.
   - Mitigation: Ensure SLAs for analytics infrastructure, implement robust degradation logic, and provide clear UI messaging when advanced insights are temporarily unavailable.

4. **Risk: Boundary with future deeper insight features**
   - Consequence: Without clear separation, later epics for detailed analytics could attempt to reuse components designed only for summary purposes, causing scope creep or security risks.
   - Mitigation: Define separate APIs and services for deeper insights, and maintain this summary dashboard as a distinct, read-only, aggregate-only interface.
