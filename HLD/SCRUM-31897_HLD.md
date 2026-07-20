# High-Level Design (HLD) – SCRUM-31897 – Application Intake and Dashboard

## 1. Architecture Overview

The "Application Intake and Dashboard" capability provides reviewers and approvers with a unified web interface to view, search, filter, and navigate business financing applications across lifecycle states (New, In Review, Approved, Rejected, etc.). The solution is built as a modular, enterprise-grade system supporting demo/mock data while remaining extensible to real backends.

### 1.1 Logical Architecture Layers

1. **Client Layer (Web UI)**  
   - Single-page application (SPA) or modular web UI providing the dashboard, filters, search, sorting, pagination, and application detail summary views.  
   - Accessible, responsive UI optimized for desktop browsers, with keyboard navigation and clear status indicators.

2. **API / Edge Layer**  
   - API Gateway or Edge Service exposing RESTful or GraphQL endpoints for dashboard data, application listing, search/filter operations, and state transitions.  
   - Handles authentication, authorization, request validation, rate limiting, and routing to domain services.

3. **Domain Services Layer**  
   - **Application Dashboard Service** orchestrates listing, searching, filtering, and sorting applications, and composes business context for each application.  
   - **Application State Service** manages derived state views (New/In Review/Approved/Rejected) for the UI and enforces valid state transitions (for demo, based on mock data).  
   - **Mock Data Service** generates and maintains realistic application data covering all relevant business states.

4. **Data Stores Layer**  
   - **Mock Application Data Store** (e.g., document DB or relational DB populated with synthetic data) backing the dashboard and state navigation for demo environments.  
   - **Configuration Store** for UI configuration (visible columns, default filters, sort orders, feature flags).

5. **Integration Layer**  
   - Abstraction over potential future backend systems (e.g., core loan processing systems, CRM, workflow engines). For this epic, integrations are limited to reading/writing mock data; external production systems are out of scope and represented as stubs.

6. **Cross-Cutting Concerns**  
   - Centralized logging, metrics, tracing, audit events (for state navigation and interactions).  
   - Security (authentication, authorization, input validation, output filtering, secrets management).  
   - Resiliency (timeouts, retries, circuit breakers) and monitoring.

### 1.2 Mermaid Component Diagram

```mermaid
flowchart LR
    subgraph Client_Layer[Client Layer]
        UI_Dashboard[Web UI - Application Dashboard]
        UI_Filters[Web UI - Filters/Search/Sorting]
        UI_StateNav[Web UI - State Navigation]
        UI_AppDetails[Web UI - Application Summary View]
    end

    subgraph Edge_Layer[API / Edge Layer]
        APIGW[API Gateway / Edge Service]
    end

    subgraph Domain_Layer[Domain Services]
        DashSvc[Application Dashboard Service]
        StateSvc[Application State Service]
        MockDataSvc[Mock Data Service]
        ConfigSvc[UI Configuration Service]
    end

    subgraph Data_Stores[Data Stores]
        MockDB[(Mock Application Data Store)]
        ConfigDB[(UI Configuration Store)]
        AuditLog[(Audit & Observability Sink)]
    end

    subgraph Integration_Layer[Integration Layer]
        ExtAdapters[Future External System Adapters (Stubbed)]
    end

    UI_Dashboard --> APIGW
    UI_Filters --> APIGW
    UI_StateNav --> APIGW
    UI_AppDetails --> APIGW

    APIGW --> DashSvc
    APIGW --> StateSvc

    DashSvc --> MockDataSvc
    DashSvc --> ConfigSvc

    StateSvc --> MockDataSvc

    MockDataSvc --> MockDB
    ConfigSvc --> ConfigDB

    DashSvc --> AuditLog
    StateSvc --> AuditLog

    DashSvc -.future integration.-> ExtAdapters
    StateSvc -.future integration.-> ExtAdapters
```

## 2. Component Descriptions

### 2.1 Client Layer

1. **Web UI – Application Dashboard (UI_Dashboard)**  
   - Presents a tabular or card-based view of financing applications.  
   - Displays key business context fields: applicant (non-PII identifier), product type, requested amount category, current lifecycle state, submission timestamp, and any relevant flags.  
   - Supports pagination, dynamic loading of application lists, and visual cues for state and data completeness.  
   - Ensures no inactive or placeholder controls are shown; all visible elements are wired to functional behavior.

2. **Web UI – Filters/Search/Sorting (UI_Filters)**  
   - Provides filter controls (by state, product category, date range, risk band, etc.), text search (by non-sensitive reference IDs), and sorting (e.g., by submission time or priority).  
   - Applies filters client-side only after validated by the backend (API returns filtered result, UI may handle local refinement such as column sorting).  
   - Remembers user-selected filters within the session via state management (e.g., Redux, Context, or component-local state), without persisting PII.

3. **Web UI – State Navigation (UI_StateNav)**  
   - Allows switching between logical application states (New, In Review, Approved, Rejected, etc.).  
   - Triggers dashboard refresh via API calls that query the appropriate subset of applications.  
   - Visually distinguishes each state with consistent color coding, icons, and labels, ensuring accessibility (contrast, non-color cues).

4. **Web UI – Application Summary View (UI_AppDetails)**  
   - Displays concise business context for a single application (e.g., application reference ID, product, aggregated risk band, current state, last update timestamp).  
   - May be implemented as a side panel or separate route.  
   - Avoids exposing raw PII/PCI data; only synthetic/mock or masked fields are shown in demo environments.

### 2.2 API / Edge Layer

5. **API Gateway / Edge Service (APIGW)**  
   - Exposes public endpoints such as:
     - `GET /applications` – list with pagination, filters, search, sorting parameters.  
     - `GET /applications/{id}` – summary view of a single application.  
     - `GET /applications/states` – supported application states and UI metadata.  
   - Performs request authentication (e.g., OAuth2/OIDC for internal users), authorization (RBAC), and basic input validation (parameter types, ranges, allowed state values).  
   - Applies rate limiting and request size limits to protect downstream services.  
   - Routes validated requests to the appropriate domain services and normalizes error responses.

### 2.3 Domain Services Layer

6. **Application Dashboard Service (DashSvc)**  
   - Central orchestration component for assembling dashboard data.  
   - Accepts filter/search/sort parameters from APIGW and constructs queries against the Mock Application Data Store.  
   - Enforces business semantics for state filtering (e.g., mapping underlying attributes to high-level states).  
   - Computes derived business context per application: summary risk indicators, state badges, flags for data completeness, etc.  
   - Ensures responses are optimized for performance (e.g., limited columns, paginated results) to meet the dashboard load-time target.  
   - Emits audit/observability events when users perform list views, searches, or state navigation.

7. **Application State Service (StateSvc)**  
   - Maintains the allowed state model for applications (New, In Review, Approved, Rejected, etc.).  
   - For demo purposes, the service derives states from the mock data attributes instead of committing changes to production systems.  
   - Validates any requested transitions (if interactive transitions are part of the UI) against a simple state machine, preventing unrealistic transitions (e.g., directly from New to Rejected without review).  
   - Provides UI-oriented metadata describing state labels, badges, and grouping behavior.

8. **Mock Data Service (MockDataSvc)**  
   - Responsible for generating realistic synthetic data for financing applications, ensuring coverage of all relevant business states.  
   - Configurable templates for product types, risk indicators, amounts, and lifecycle paths.  
   - Periodically refreshes or updates the dataset for demo scenarios (e.g., via scheduled jobs or admin triggers).  
   - Guarantees no real customer data is used; all records are explicitly marked as synthetic.  
   - Provides querying capabilities compatible with the Dashboard and State services.

9. **UI Configuration Service (ConfigSvc)**  
   - Manages UI configuration metadata such as default filters, visible columns, feature flags (e.g., enabling/disabling certain controls), and performance-related options.  
   - Allows different demo profiles (e.g., reviewer vs approver) with tailored default views.  
   - Stores configuration in the Configuration Store and exposes it via APIs consumed by the UI and dashboard service.

### 2.4 Data Stores Layer

10. **Mock Application Data Store (MockDB)**  
    - Stores synthetic financing application records in a structured schema: application reference ID, product category, requested amount bucket, derived risk band, current lifecycle state, timestamps, and operational flags.  
    - Indexed by state, reference ID, and key business attributes to support fast querying.  
    - Enforces synthetic-only data policy; governance controls ensure no import of real PII/PCI/PHI.

11. **UI Configuration Store (ConfigDB)**  
    - Small configuration repository (e.g., key-value store or configuration table) storing UI-related metadata.  
    - Supports rollback and versioning of configurations for safe experimentation with demo flows.

12. **Audit & Observability Sink (AuditLog)**  
    - Centralized collection point (e.g., log aggregator, time-series metrics, tracing system) capturing dashboard interactions, filter usage, and state navigation events.  
    - Used to validate success metrics (e.g., load times, navigation responsiveness, error rates) and to support operational troubleshooting.

### 2.5 Integration Layer

13. **Future External System Adapters (ExtAdapters)**  
    - Abstract interfaces designed to connect to external production systems such as loan processing engines or CRM platforms in future epics.  
    - For this epic, implementations are stubbed and do not make external calls; their presence in the design illustrates future extensibility.  
    - Any out-of-scope integration behavior is explicitly disabled or simulated using mock data.

## 3. Integration Points & Data Flows

### Flow 1 – User Authentication & Session Establishment

1. User navigates to the Application Intake and Dashboard web URL.  
2. UI_Dashboard triggers an authentication flow (e.g., redirect to corporate IdP using OIDC).  
3. Upon successful authentication, APIGW issues a session token or uses the IdP’s access token for subsequent API calls.  
4. APIGW validates tokens on each request and derives user roles (reviewer, approver, admin) to enforce RBAC policies.  
5. UI stores only session identifiers in browser storage (e.g., secure cookies) and does not persist sensitive data locally.

**Scope Traceability:** Supports centralized access to applications and secure navigation; relates to goals of reviewers/approvers viewing applications and business context.

### Flow 2 – Dashboard Initial Load (Centralized View)

1. After authentication, UI_Dashboard requests `GET /applications` with default pagination and state filters (e.g., all active states).  
2. APIGW validates query parameters (page size, state list, sort key) and forwards the request to DashSvc.  
3. DashSvc retrieves configuration from ConfigSvc (e.g., default columns and filters) via ConfigDB.  
4. DashSvc constructs a query to MockDataSvc targeting MockDB to fetch a page of synthetic applications matching the default filters.  
5. MockDataSvc executes the query against MockDB using appropriate indexes (by state, date, etc.) and returns application records.  
6. DashSvc derives business context fields (state badges, risk indicators, flags) and composes a compact response payload optimized for UI rendering.  
7. DashSvc emits an audit event to AuditLog noting the dashboard load request and performance metrics.  
8. APIGW returns the normalized response to the client.  
9. UI_Dashboard renders the applications grid with clear state indicators and non-placeholder controls.

**Scope Traceability:** Directly fulfills the requirement for a centralized dashboard listing financing applications with clear status indicators and business context, and supports the load-time performance target.

### Flow 3 – State Navigation (New/In Review/Approved/Rejected)

1. User selects a state tab or filter in UI_StateNav (e.g., "In Review").  
2. UI_StateNav invokes `GET /applications?state=IN_REVIEW` via APIGW.  
3. APIGW validates the state parameter against supported values provided by StateSvc.  
4. APIGW routes the request to DashSvc with state filter parameters.  
5. DashSvc consults StateSvc for mappings between state codes and underlying attributes (e.g., review start timestamp vs approval flag).  
6. DashSvc issues state-aware queries to MockDataSvc/MockDB.  
7. MockDataSvc returns records in the requested state.  
8. DashSvc constructs the response and emits a state navigation event to AuditLog, including counts and latency.  
9. UI_StateNav updates the dashboard view; navigation actions trigger dynamic UI updates and visually distinct state representations.

**Scope Traceability:** Implements navigation between application states with visually distinct presentations and dynamic UI updates.

### Flow 4 – Filtering, Searching, and Sorting

1. User interacts with UI_Filters (e.g., selecting product category, date range, entering a reference ID, choosing sort by submission date).  
2. UI_Filters constructs a query to `GET /applications` with filter, search, and sorting parameters.  
3. APIGW validates query parameters for type, allowed values, and ranges (e.g., page size caps, allowed sort fields).  
4. APIGW forwards the request to DashSvc.  
5. DashSvc translates filter/search/sort parameters into an optimized query against MockDataSvc/MockDB, using composite indexes where necessary.  
6. MockDataSvc executes the query and returns results.  
7. DashSvc orders records according to sort criteria and builds a response payload.  
8. DashSvc emits filter/search audit events to AuditLog (including anonymized filter usage and performance metrics).  
9. UI_Filters updates the dashboard view dynamically without page reload; no controls remain inactive.

**Scope Traceability:** Provides filtering, searching, and sorting capabilities while ensuring dynamic UI behavior and no inactive controls.

### Flow 5 – Application Detail & Business Context View

1. User selects an application from the dashboard (row click or card selection) via UI_AppDetails.  
2. UI_AppDetails calls `GET /applications/{id}` through APIGW.  
3. APIGW validates the identifier format and authorization (role-based access to specific states or subsets).  
4. APIGW routes the request to DashSvc.  
5. DashSvc retrieves detailed synthetic data from MockDataSvc/MockDB for the given application.  
6. DashSvc aggregates business context (e.g., state history summary, risk band, product metadata) into a compact DTO.  
7. DashSvc emits an audit event to AuditLog for application detail access.  
8. APIGW returns the detail response to the UI.  
9. UI_AppDetails renders the summary view with clear status and business context, using synthetic or masked values only.

**Scope Traceability:** Ensures each application has clear status indicators and business context accessible from the dashboard, supporting review and approval workflows.

### Flow 6 – Mock Data Generation and Refresh

1. Administrative user or scheduled job invokes MockDataSvc (internally or via protected admin API) to generate or refresh synthetic financing applications.  
2. MockDataSvc uses parameterized templates for product types, risk profiles, and lifecycle paths to produce synthetic records for all relevant states.  
3. MockDataSvc writes generated records into MockDB in batches, ensuring consistent indexing and state distribution.  
4. MockDataSvc may emit generation metrics (record counts, generation time) to AuditLog.  
5. Subsequent dashboard queries via DashSvc automatically reflect the refreshed synthetic dataset.

**Scope Traceability:** Ensures mock data is realistic, covers all business states, and supports 100% demo workflows.

## 4. Security & Compliance Features

### 4.1 Transport Security

- All client-to-APIGW and service-to-service communication uses TLS (HTTPS for web, mTLS for internal calls where supported).  
- TLS configurations follow organizational standards (strong cipher suites, certificate rotation, HSTS for web endpoints).

### 4.2 Data Encryption

- **At Rest:** MockDB and ConfigDB use platform-native encryption-at-rest (e.g., encrypted volumes or managed database encryption).  
- **In Transit:** All connections between APIGW, DashSvc, StateSvc, MockDataSvc, and data stores are encrypted using TLS.  
- Sensitive configuration values (e.g., DB credentials) are not stored in plain text; see Secrets Management.

### 4.3 Input Validation & Output Filtering

- APIGW enforces strict validation on request parameters (types, allowed ranges, enumerations for state values, max page size) to mitigate injection and resource abuse.  
- DashSvc and StateSvc perform additional semantic validations (e.g., invalid states, malformed identifiers).  
- Output payloads from DashSvc are shaped to avoid exposing unnecessary data fields; only non-sensitive synthetic attributes required for dashboard use are returned.  
- Error responses are normalized and do not leak internal implementation details.

### 4.4 RBAC / ABAC

- Access to the dashboard is restricted to authenticated users (e.g., reviewers, approvers, admins) via enterprise identity provider.  
- Role-based access controls enforced in APIGW determine which endpoints and operations a user can perform (e.g., state transitions vs read-only).  
- If attribute-based access control is needed (e.g., limiting visibility by region or portfolio), attributes are derived from tokens and enforced in DashSvc queries.

### 4.5 Audit Logging & Observability

- Dashboard loads, state navigation events, filter/search usage, and application detail views are logged to AuditLog with anonymized identifiers.  
- Metrics collected include response times, error rates, and dashboard load latency to validate success metrics.  
- Tracing is enabled between APIGW and domain services to support performance debugging.

### 4.6 Secrets Management

- All secrets (DB credentials, API keys, TLS private keys) are stored in a centralized, hardened secret store (e.g., cloud key vault or HSM-backed service).  
- Services retrieve secrets via secure channels at startup; secrets are not written to logs or configuration files.  
- Secret rotation is supported via configuration reload or rolling deployment.

### 4.7 Compliance Mapping

- The epic is centered on a demo/dashboard capability using synthetic financing application data; no real customer PII/PHI/PCI data is ingested or processed.  
- **Compliance Status:**  
  - **Privacy (e.g., GDPR/CCPA)** – Pass: design uses synthetic data only; if extended to real data in future, PII handling controls (data minimization, subject rights) must be added.  
  - **PCI-DSS** – Not applicable / Pass-with-conditions: no cardholder data is stored or processed; if card data is introduced later, additional controls (segmentation, stricter logging, etc.) will be required.  
  - **Information Security Baseline** – Pass: encryption, authentication, authorization, logging, and secrets management are addressed at a high level.

## 5. Resiliency & Error Handling

### 5.1 Resiliency Mechanisms

- **Timeouts:** APIGW enforces reasonable timeouts on calls to DashSvc and StateSvc; domain services enforce timeouts on DB calls to prevent hung requests.  
- **Retries:** Idempotent read operations (e.g., list, detail) may use limited retries on transient errors when accessing MockDB, with exponential backoff.  
- **Circuit Breakers:** Implemented between APIGW and DashSvc/StateSvc to prevent cascading failures if domain services or MockDB become unhealthy.  
- **Graceful Degradation:** In case of partial failure:
  - If ConfigSvc or ConfigDB is unavailable, DashSvc uses safe defaults for columns and filters.  
  - If MockDataSvc or MockDB is partially degraded, APIGW may return simplified views or informative empty results, with clear status messages to users.

### 5.2 Error Handling Strategy

- **HTTP Status Codes:**  
  - `200/206` – Successful responses (list and detail).  
  - `400` – Invalid query parameters (e.g., unsupported state, page size too large); user sees non-technical validation messages.  
  - `401/403` – Unauthenticated or unauthorized access; UI redirects to login or shows access-denied messaging.  
  - `404` – Application not found; UI displays a friendly message (no raw identifiers are leaked).  
  - `429` – Rate limit exceeded; UI suggests reducing request frequency.  
  - `5xx` – Internal errors; UI shows generic error messaging and encourages retry; internal logs capture stack traces for support.

- **Exposure Control:**  
  - Error payloads omit implementation details (stack traces, SQL queries, internal hostnames).  
  - Correlation IDs are included to link user-reported issues to logs without exposing sensitive data.

### 5.3 Observability

- Centralized logging of requests, errors, and performance metrics via AuditLog.  
- Dashboards in the monitoring system track key indicators: dashboard load times, error rates per endpoint, and state navigation latency.  
- Alerts configured on thresholds (e.g., load times consistently above target, spike in error rates).

## 6. Validation Report

### 6.1 Requirements Coverage

The following coverage table maps inferred high-level scope items from the epic description to components and flows:

1. **Centralized dashboard listing all financing applications**  
   - **Components:** UI_Dashboard, APIGW, DashSvc, MockDataSvc, MockDB.  
   - **Flows:** Flow 2 (Dashboard Initial Load), Flow 5 (Application Detail & Business Context View).

2. **Navigation between application states (New, In Review, Approved, Rejected)**  
   - **Components:** UI_StateNav, APIGW, DashSvc, StateSvc, MockDataSvc, MockDB.  
   - **Flows:** Flow 3 (State Navigation), Flow 2 (Dashboard Initial Load).

3. **Filtering, searching, and sorting of applications**  
   - **Components:** UI_Filters, UI_Dashboard, APIGW, DashSvc, MockDataSvc, MockDB.  
   - **Flows:** Flow 4 (Filtering, Searching, and Sorting), Flow 2 (Dashboard Initial Load).

4. **Clear status indicators and business context for each application**  
   - **Components:** UI_Dashboard, UI_AppDetails, DashSvc, StateSvc, MockDataSvc, MockDB.  
   - **Flows:** Flow 2 (Dashboard Initial Load), Flow 5 (Application Detail & Business Context View).

5. **Realistic mock data covering all business states and enabling full demo workflows**  
   - **Components:** MockDataSvc, MockDB, DashSvc, StateSvc.  
   - **Flows:** Flow 6 (Mock Data Generation and Refresh), Flow 2 (Dashboard Initial Load), Flow 3 (State Navigation), Flow 4 (Filtering, Searching, and Sorting).

6. **Dashboard performance (load in <2 seconds locally) and dynamic UI updates with no inactive controls**  
   - **Components:** UI_Dashboard, UI_Filters, UI_StateNav, APIGW, DashSvc, MockDataSvc, MockDB, AuditLog.  
   - **Flows:** Flow 2 (Dashboard Initial Load), Flow 3 (State Navigation), Flow 4 (Filtering, Searching, and Sorting), Flow 1 (Authentication & Session), Flow 5 (Application Detail & Business Context View).

7. **Accessibility and distinct visual representation of states** (inferred from "visually distinct and accessible" success metrics)  
   - **Components:** UI_Dashboard, UI_StateNav, UI_AppDetails, ConfigSvc, ConfigDB.  
   - **Flows:** Flow 2 (Dashboard Initial Load), Flow 3 (State Navigation).

### 6.2 Compliance Status

- **Transport Security:** Pass – TLS mandated between all components.  
- **Data Encryption at Rest:** Pass – MockDB and ConfigDB employ encryption-at-rest.  
- **Authentication & Authorization (RBAC/ABAC):** Pass – APIGW backed by IdP, roles enforced.  
- **Input Validation & Output Filtering:** Pass – APIGW and domain services validate and sanitize inputs; outputs are minimal and synthetic.  
- **Audit Logging & Observability:** Pass – AuditLog captures key events, performance metrics, and state navigation.  
- **Secrets Management:** Pass – Central secret store and rotation strategy defined.  
- **Privacy/PII Compliance (e.g., GDPR):** Pass – synthetic data only; future introduction of real data requires additional controls.  
- **PCI-DSS / Cardholder Data:** Not Applicable / Pass-with-conditions – no payment card data in scope; design is ready to add controls if future epics introduce such data.

### 6.3 Identified Ambiguities / Risks

1. **Ambiguity:** Exact schema and volume of synthetic applications.  
   - **Consequence:** Insufficient mock data diversity may fail to cover edge-case workflows and state transitions, undermining demo credibility.  
   - **Mitigation:** Define a minimum dataset profile (number of records per state, product mix, risk tiers) and automated quality checks for mock data coverage.

2. **Ambiguity:** Detailed business rules for valid state transitions.  
   - **Consequence:** Demo may show unrealistic or inconsistent transitions, confusing reviewers/approvers.  
   - **Mitigation:** Collaborate with business stakeholders to define a simple but coherent state machine; codify it in StateSvc and expose metadata to UI.

3. **Ambiguity:** Future integration with real backend systems.  
   - **Consequence:** When future epics introduce real data or external systems, the current mock-based APIs might require refactoring, affecting downstream consumers.  
   - **Mitigation:** Maintain clear adapter interfaces in ExtAdapters and avoid coupling UI directly to mock-specific fields; plan migration paths from mock to real backends.

4. **Risk:** Performance in non-local environments (e.g., cloud-hosted demo) vs local performance target.  
   - **Consequence:** Dashboard load times could exceed the <2 second target in certain deployments due to network latency or resource constraints.  
   - **Mitigation:** Implement performance monitoring, optimize queries and payload sizes, support caching at APIGW or DashSvc, and size infrastructure appropriately.

5. **Risk:** Accessibility compliance not fully defined.  
   - **Consequence:** Users with accessibility needs may face barriers in using the dashboard (e.g., screen reader issues, insufficient contrast).  
   - **Mitigation:** Adopt organization’s accessibility guidelines (e.g., WCAG 2.1 AA), perform accessibility testing, and encode accessibility requirements into UI design standards.

6. **Risk:** Over-reliance on synthetic data masking operational issues.  
   - **Consequence:** Performance and usability validated on small synthetic datasets may not reflect production-scale scenarios.  
   - **Mitigation:** Consider performance testing with scaled synthetic datasets approximating production volumes; design services to be horizontally scalable.

## 7. Out of Scope Acknowledgements

While the epic description focuses on demo workflows and mock data, the following items are explicitly treated as out of scope for this HLD (or future epics):

- Integration with live financing decision engines, payment systems, or core banking platforms (represented only via ExtAdapters stubs).  
- Complex workflow orchestration, case management, or task assignment features beyond simple state views.  
- Detailed customer-facing portals or self-service application intake; this HLD focuses on reviewer/approver dashboards in an internal/demo context.  
- Full regulatory compliance implementation for production scenarios; only high-level controls are specified, assuming synthetic data in this epic.
