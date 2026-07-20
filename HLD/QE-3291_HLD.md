# High-Level Design (HLD) – QE-3291 Monthly Spending Summary Dashboard

## 1. Architecture Overview

The Monthly Spending Summary Dashboard is a read‑heavy, analytics‑oriented web application that surfaces credit card spending, transactions, utilization, budgeting, and financial insights in a responsive UI. It consumes transactional and account data from enterprise services, applies aggregation and analytics, and exposes the results via secure APIs.

### 1.1 Logical Architecture

The solution is structured into the following layers:

- **Client Layer (Web & Mobile UI)**
  - Responsive single‑page application (SPA) / modular web front‑end.
  - Supports desktop, tablet, and mobile layouts.
  - Renders dashboard summary, card management, transaction views, filters, spending analytics charts, budget tracking, and recent transactions widget.

- **Edge/API Layer**
  - API Gateway / Edge service providing a single entry point for client calls.
  - Handles authentication, authorization, throttling, request validation, response shaping, and routing to domain services.

- **Domain Services Layer**
  - **Dashboard Aggregation Service** – builds monthly summary metrics and utilization percentages.
  - **Credit Card Profile Service** – retrieves and normalizes card‑level attributes for multiple cards.
  - **Transaction Query Service** – supports filtered and paginated transaction retrieval, and drives the recent transactions widget.
  - **Spending Analytics Service** – computes category‑wise spending, trends, card‑wise distribution, and category breakdowns.
  - **Budget Management Service** – manages monthly budgets and computes utilization and progress indicators.

- **Data Stores**
  - **Card & Account Repository** – logical view over enterprise card/account data (may be implemented via read models, views, or dedicated reporting store).
  - **Transaction Repository** – optimized for querying transactions with filters and sort options (e.g., read‑optimized store or data mart).
  - **Analytics & Aggregates Store** – materialized views or cached aggregates for spending analytics and dashboard KPIs.
  - **Budget Repository** – stores user budget configurations and current utilization values.

- **Integration Layer**
  - **Core Banking/Card Platforms Integration** – secure integration to upstream systems for card limits, available credit, outstanding amounts, billing and due dates.
  - **Enterprise Data Warehouse / Streaming Bus** – source of normalized transaction events feeding analytics.

- **Cross‑Cutting Concerns**
  - Centralized authentication and authorization.
  - Transport security, encryption at rest, secrets management.
  - Logging, metrics, tracing for observability.
  - Configuration management and feature flags (for charts, widgets, etc.).

### 1.2 Component Diagram (Mermaid)

```mermaid
flowchart LR
    subgraph ClientLayer[Client Layer]
        UI[Responsive Dashboard UI]
    end

    subgraph EdgeLayer[Edge/API Layer]
        APIGW[API Gateway / Edge Service]
    end

    subgraph DomainLayer[Domain Services Layer]
        DAS[Dashboard Aggregation Service]
        CCPS[Credit Card Profile Service]
        TQS[Transaction Query Service]
        SAS[Spending Analytics Service]
        BMS[Budget Management Service]
    end

    subgraph DataLayer[Data Stores]
        CAR[Card & Account Repository]
        TR[Transaction Repository]
        AAS[Analytics & Aggregates Store]
        BR[Budget Repository]
    end

    subgraph IntegrationLayer[Integration Layer]
        CB[Core Card/Billing Systems]
        EDW[Enterprise Data Warehouse / Event Bus]
    end

    subgraph CrossCutting[Cross-Cutting Services]
        AUTH[Auth Service]
        LOG[Central Logging & Monitoring]
        CFG[Config & Feature Flags]
        SM[Secrets Vault]
    end

    UI -->|HTTPS + JWT| APIGW
    APIGW --> AUTH

    APIGW --> DAS
    APIGW --> CCPS
    APIGW --> TQS
    APIGW --> SAS
    APIGW --> BMS

    DAS --> CAR
    DAS --> AAS

    CCPS --> CAR

    TQS --> TR

    SAS --> TR
    SAS --> AAS

    BMS --> BR

    CAR --> CB
    TR --> EDW
    AAS --> EDW

    LOG <-- APIGW
    LOG <-- DAS
    LOG <-- TQS
    LOG <-- SAS
    LOG <-- BMS

    CFG --> UI
    CFG --> APIGW
    CFG --> DomainLayer

    SM --> APIGW
    SM --> DomainLayer
```

## 2. Component Descriptions

### 2.1 Responsive Dashboard UI

- Implements a responsive layout that adapts to desktop, tablet, and mobile resolutions.
- Provides dashboard summary tiles (monthly spend, total credit limit, available credit, outstanding amount, utilization percentage, number of transactions).
- Presents a multi‑card view, showing high‑level attributes for each card (name, issuing bank, masked number, limit, available credit, outstanding, billing and due dates) while ensuring no unmasked card numbers are rendered.
- Renders a transaction table supporting filters (merchant, category, bank, card, date range) and sort (amount, date) with pagination.
- Displays interactive charts for category‑wise spending, monthly trend, card‑wise distribution, and category breakdown using aggregated data from backend services.
- Shows budget tracking indicators: configured monthly budget, current spend, remaining budget, utilization percentage, and progress bar.
- Includes a recent transactions widget displaying the latest five transactions in a condensed view.
- Performs basic client‑side validation of filter inputs and prevents unsafe characters; delegates full validation to the Edge/API layer.

### 2.2 API Gateway / Edge Service

- Serves as the single public interface for the dashboard UI.
- Terminates TLS and enforces HTTPS for all incoming connections.
- Validates access tokens (e.g., JWT, session tokens) with the Auth Service.
- Performs coarse‑grained authorization (e.g., ensuring user can view only their own cards and transactions).
- Normalizes request formats, performs schema validation, and rejects malformed or oversized requests.
- Enforces rate limiting and request throttling to protect downstream services.
- Routes inbound calls to Dashboard Aggregation, Credit Card Profile, Transaction Query, Spending Analytics, and Budget Management services.
- Applies response filtering, removing any data outside the defined scope (e.g., ensuring only masked card identifiers are passed through).

### 2.3 Dashboard Aggregation Service

- Computes monthly summary KPIs:
  - Total monthly spend (sum of transaction amounts for the selected month).
  - Total credit limit (aggregate of credit limits across the user’s cards).
  - Available credit (sum of available credit across cards).
  - Outstanding amount (sum of outstanding balances for the current cycle).
  - Utilization percentage (e.g., total outstanding / total limit).
  - Number of transactions for the specified period.
- Utilizes raw card/account data from Card & Account Repository and transactional aggregates from Analytics & Aggregates Store.
- Maintains pre‑computed aggregates where appropriate to reduce response latency for dashboard rendering.
- Excludes any operations outside the dashboard scope (e.g., payment initiation, card applications, dispute handling are not performed here).

### 2.4 Credit Card Profile Service

- Retrieves and normalizes the list of user cards from Card & Account Repository.
- Provides a unified model of card attributes: card display name, issuing bank, masked card number, credit limit, available credit, current outstanding amount, billing date, and due date.
- Applies masking rules server‑side to ensure card numbers are never exposed in full to the client.
- Refreshes card metadata on demand or via scheduled sync from upstream card systems.
- Does not handle card lifecycle operations (activation, closure, limit changes); those remain out of scope.

### 2.5 Transaction Query Service

- Exposes transaction search and filter capabilities over Transaction Repository.
- Supports filter criteria: merchant name, category, bank, card, date range.
- Supports sorting by amount and date, with pageable responses to avoid large payloads.
- Returns normalized transaction data: transaction date/time, merchant descriptor, category, card used, amount, payment status, and optional remarks.
- Provides a dedicated endpoint used by the recent transactions widget to fetch the latest five transactions.
- Does not implement transaction dispute or modification logic; such workflows are outside the current scope.

### 2.6 Spending Analytics Service

- Computes category‑wise spending based on configured categories (e.g., food & dining, fuel, shopping, travel, entertainment, utilities, healthcare, education, miscellaneous).
- Produces monthly spending trend data (e.g., series of monthly totals for a configured time window).
- Calculates card‑wise spending distribution (e.g., percentage of total spend per card).
- Generates drill‑down category breakdowns where supported by data.
- Reads from Transaction Repository and Analytics & Aggregates Store to ensure performance.
- Supports time‑bound queries (e.g., current month or user‑specified periods) while respecting any boundaries defined by upstream systems.

### 2.7 Budget Management Service

- Stores and retrieves user‑defined monthly budgets in Budget Repository.
- Computes current spend against the configured budget for the active cycle.
- Calculates remaining budget and utilization percentage.
- Produces progress bar parameters for display in the UI.
- May enforce simple rules (e.g., preventing negative budgets) and validate that budgets are associated only with the authenticated user.
- Does not implement automated alerts, notifications, or multi‑currency budgeting unless explicitly extended in future epics.

### 2.8 Card & Account Repository

- Represents a read‑optimized view of card and account attributes sourced from core card and billing systems.
- Stores card metadata necessary for dashboard operations: masked card identifiers, limits, available credit, outstanding amounts, billing cycles, and due dates.
- May be implemented as a dedicated reporting database, materialized views, or API cache depending on enterprise constraints.
- Synchronizes data via secure integration with core systems on a scheduled or event‑driven basis.

### 2.9 Transaction Repository

- Stores normalized transactional data used by the dashboard.
- Optimized for read/query workloads, supporting indexed access by merchant, category, card, bank, and date.
- Populated from enterprise data warehouse feeds or streaming event bus.
- Excludes sensitive cardholder data beyond what’s necessary for display (e.g., no full PAN; uses masked identifiers or tokenized references only).

### 2.10 Analytics & Aggregates Store

- Holds pre‑computed aggregates (totals, distributions, trends) to improve response times for analytics queries.
- Contains materialized views for category spending, monthly totals, and card‑level statistics.
- Can be backed by OLAP engines or specialized analytics databases.

### 2.11 Budget Repository

- Persists user budget configurations and the derived utilization metrics needed for the dashboard.
- Supports versioning of budget changes if required by downstream compliance processes.

### 2.12 Core Card/Billing Systems Integration

- Provides secure connectivity to enterprise card management and billing platforms.
- Supplies canonical data for card limits, outstanding balances, billing cycles, and due dates.
- Uses asynchronous updates (e.g., events, batch feeds) to populate the Card & Account Repository; synchronous calls are used only where real‑time data is required by the dashboard.

### 2.13 Enterprise Data Warehouse / Event Bus Integration

- Receives transaction events from upstream systems and publishes them to the Transaction Repository and Analytics Store.
- Enforces schema validation and transformation rules to align transactions with the dashboard data model.

### 2.14 Auth Service

- Issues and validates authentication tokens.
- Integrates with enterprise identity provider for user sign‑in.
- Supports session management and token revocation flows.

### 2.15 Central Logging & Monitoring

- Collects logs, metrics, and traces from the API Gateway and all domain services.
- Enables dashboards and alerts for latency, error rates, throughput, and data quality checks.

### 2.16 Config & Feature Flags

- Stores environment‑specific configuration (e.g., analytics time windows, enabled chart types).
- Provides feature flagging capabilities to roll out or roll back UI modules such as additional widgets.

### 2.17 Secrets Vault

- Securely stores credentials, API keys, and certificates used for integration with core systems and data platforms.
- Exposes access via audited mechanisms only, with least‑privilege policies.

## 3. Integration Points & Data Flow

### 3.1 Flow 1 – Authentication & Session Establishment

1. User navigates to the dashboard UI over HTTPS.
2. UI redirects unauthenticated users to the enterprise login page.
3. User submits credentials to the identity provider (outside this epic’s scope for implementation details).
4. Upon successful authentication, the Auth Service issues an access token.
5. UI stores the token in a secure mechanism (e.g., HTTP‑only cookie or secure storage) and attaches it to subsequent API calls.
6. API Gateway validates the token for each request and enforces user identity.

### 3.2 Flow 2 – Dashboard Summary Retrieval (Monthly Spend & KPIs)

1. UI requests the dashboard summary endpoint via the API Gateway, specifying the target month.
2. API Gateway validates the request schema, token, and authorization.
3. Gateway forwards the request to the Dashboard Aggregation Service.
4. Dashboard Aggregation Service queries Analytics & Aggregates Store for monthly spending totals and transaction counts.
5. Service retrieves card limits, available credit, and outstanding amounts from Card & Account Repository.
6. Service computes utilization percentage and composes the summary response.
7. Response is returned through the API Gateway to the UI.
8. UI renders tiles for total monthly spend, total credit limit, available credit, outstanding amount, utilization percentage, and number of transactions.

### 3.3 Flow 3 – Credit Card Management View

1. UI invokes the card list endpoint via API Gateway.
2. API Gateway validates token and authorizes access to the user’s card portfolio.
3. Gateway calls Credit Card Profile Service.
4. Service queries Card & Account Repository for cards linked to the user.
5. Service applies masking rules and normalizes fields (card name, issuing bank, masked number, limit, available credit, outstanding, billing date, due date).
6. Service returns the normalized card list to API Gateway.
7. Gateway forwards the response to UI.
8. UI displays the multi‑card view with one card row/tile per card.

### 3.4 Flow 4 – Transaction Management, Filters & Search

1. User applies filters or sorting (merchant, category, bank, card, date range, sort by amount/date) in the UI.
2. UI sends a transaction search request to API Gateway with filter parameters.
3. API Gateway validates inputs (e.g., acceptable ranges, allowed categories) and rate limits if necessary.
4. Gateway routes the request to Transaction Query Service.
5. Transaction Query Service translates filter criteria into queries against Transaction Repository.
6. Repository returns a paginated set of transactions with fields: transaction date, merchant name, category, card used (masked or tokenized), amount, payment status, and remarks.
7. Service sends this data to API Gateway.
8. Gateway returns the data to UI.
9. UI renders the responsive transaction table and applies client‑side pagination where needed.

### 3.5 Flow 5 – Spending Analytics Charts

1. UI initiates chart data requests (category‑wise spending, monthly trend, card‑wise distribution, category breakdown) via API Gateway.
2. API Gateway authenticates and authorizes the user.
3. Gateway forwards requests to Spending Analytics Service.
4. Spending Analytics Service reads data from Transaction Repository and aggregates from Analytics & Aggregates Store.
5. Service computes per‑category totals, monthly series, and per‑card distribution metrics for the requested period.
6. Service returns analytics datasets to API Gateway.
7. Gateway relays responses to UI.
8. UI renders charts for each requested analytics view using the provided datasets.

### 3.6 Flow 6 – Budget Tracking & Progress Bar

1. User navigates to budget tracking section or dashboard area showing budget metrics.
2. UI calls Budget Management Service via API Gateway to retrieve monthly budget details.
3. API Gateway validates token and request parameters.
4. Budget Management Service queries Budget Repository for the user’s configured monthly budget and any relevant metadata.
5. Service pulls current spend metrics from Analytics & Aggregates Store or Transaction Repository.
6. Service calculates remaining budget and budget utilization percentage.
7. Service returns calculated values and progress parameters to API Gateway.
8. API Gateway passes the response to UI.
9. UI displays monthly budget, current spend, remaining budget, utilization percentage, and a progress bar.

### 3.7 Flow 7 – Recent Transactions Widget

1. UI invokes a dedicated endpoint for recent transactions via API Gateway.
2. API Gateway authenticates and validates the request.
3. Gateway calls Transaction Query Service with parameters to fetch the latest five transactions.
4. Service queries Transaction Repository with a time‑ordered index and limits the result to five records.
5. Service returns the five most recent transactions.
6. API Gateway forwards the response to UI.
7. UI renders the recent transactions widget with concise transaction details.

## 4. Security & Compliance Features

### 4.1 Transport Security

- All client‑to‑server communication occurs over HTTPS using modern TLS configurations.
- Strict transport security headers are enforced for browser‑based clients.

### 4.2 Data Encryption

- Sensitive data at rest in Card & Account Repository, Transaction Repository, Analytics Store, and Budget Repository is encrypted using enterprise‑approved encryption mechanisms.
- Encryption keys are managed via Secrets Vault with appropriate rotation policies.

### 4.3 Input Validation & Output Filtering

- API Gateway validates request payloads against schemas, ensuring type correctness, length limits, and allowed values for filters (e.g., categories, date ranges).
- Server‑side validation prevents injection attacks by sanitizing and rejecting unsafe characters in text fields (e.g., merchant names, remarks).
- Response filtering ensures only required fields for dashboard features are returned to the UI; full card numbers, personally identifying user information beyond what is necessary for financial insights, and any extraneous sensitive attributes are excluded.

### 4.4 Authentication & Authorization (RBAC/ABAC)

- Authentication is delegated to the enterprise identity provider and Auth Service; tokens assert user identity.
- API Gateway enforces fine‑grained authorization such that users can view only their own card and transaction data.
- Role‑based logic can restrict access to certain analytics or budgeting features for administrative roles if required.

### 4.5 Audit Logging

- Central Logging & Monitoring records access to card and transaction data endpoints, including user identifier, time, and operation type.
- Critical administrative configuration changes (e.g., budget configuration updates) are logged for traceability.

### 4.6 Secrets Management

- Secrets Vault stores credentials for integrating with core card systems and data warehouse platforms.
- Access to secrets is governed by least‑privilege principles and monitored via audit logs.

### 4.7 Compliance Mapping

- The dashboard exposes financial information that may be associated with card‑based transactions.
- Design avoids direct handling of payment authorization and sensitive cardholder data; upstream systems manage those responsibilities.
- Compliance alignment focuses on secure data access and privacy controls. Any formal PCI‑DSS, privacy, or regulatory certification requirements are assumed to be handled at the enterprise platform level and are not implemented explicitly in this epic.

## 5. Resiliency & Error Handling

### 5.1 Retry Mechanisms

- Domain services performing reads from Card & Account Repository, Transaction Repository, and Analytics Store employ bounded retries on transient failures with exponential backoff.
- Integration with upstream systems (core card platforms, data warehouse) uses retry patterns aligned with enterprise standards and avoids retry storms.

### 5.2 Circuit Breakers & Timeouts

- Circuit breakers are implemented in the API Gateway or service mesh to stop calling unstable downstream services after error thresholds are reached.
- Timeouts are enforced for all inter‑service calls to prevent resource exhaustion; UI surfaces appropriate error messages when timeouts occur.

### 5.3 Graceful Degradation

- If analytics services become unavailable, dashboard summary tiles may still show basic card and transaction counts from primary repositories.
- If budget services fail, the dashboard continues to function but hides budget‑specific components, optionally showing informational messages to the user.
- If recent transactions retrieval fails, the main transaction view remains available while the widget shows a fallback state.

### 5.4 Error Handling & Exposure

- Errors are categorized (client validation error, unauthorized access, forbidden, not found, server error).
- API Gateway returns standardized status codes and generic error messages without exposing internal implementation details.
- Detailed error information is logged internally for diagnostic purposes only and is never included in client responses.

### 5.5 Observability

- Metrics capture request latency, throughput, and error rates per endpoint.
- Traces (e.g., distributed tracing) follow flows across API Gateway and domain services to facilitate troubleshooting.
- Logs record filter usage patterns and data access to support audit and optimization.

## 6. Validation Report

### 6.1 Requirements Coverage

Each scope item is mapped to components and flows as follows:

- **Dashboard Summary (Monthly KPIs)**
  - Components: Responsive Dashboard UI, API Gateway, Dashboard Aggregation Service, Card & Account Repository, Analytics & Aggregates Store.
  - Flows: Flow 2 – Dashboard Summary Retrieval.

- **Total Monthly Spend**
  - Components: Dashboard Aggregation Service, Analytics & Aggregates Store, Transaction Repository.
  - Flows: Flow 2 – Dashboard Summary Retrieval.

- **Total Credit Limit**
  - Components: Dashboard Aggregation Service, Card & Account Repository.
  - Flows: Flow 2 – Dashboard Summary Retrieval.

- **Available Credit**
  - Components: Dashboard Aggregation Service, Card & Account Repository.
  - Flows: Flow 2 – Dashboard Summary Retrieval.

- **Outstanding Amount**
  - Components: Dashboard Aggregation Service, Card & Account Repository.
  - Flows: Flow 2 – Dashboard Summary Retrieval.

- **Utilization Percentage**
  - Components: Dashboard Aggregation Service, Card & Account Repository, Analytics & Aggregates Store.
  - Flows: Flow 2 – Dashboard Summary Retrieval.

- **Number of Transactions**
  - Components: Dashboard Aggregation Service, Transaction Repository.
  - Flows: Flow 2 – Dashboard Summary Retrieval.

- **Credit Card Management – Display Multiple Cards (Card Name, Issuing Bank, Masked Number, Credit Limit, Available Credit, Outstanding, Billing Date, Due Date)**
  - Components: Responsive Dashboard UI, API Gateway, Credit Card Profile Service, Card & Account Repository.
  - Flows: Flow 3 – Credit Card Management View.

- **Transaction Management – Responsive Table (Transaction Date, Merchant Name, Category, Card Used, Amount, Payment Status, Remarks)**
  - Components: Responsive Dashboard UI, API Gateway, Transaction Query Service, Transaction Repository.
  - Flows: Flow 4 – Transaction Management, Filters & Search.

- **Filters and Search (Merchant, Category, Bank, Card, Date Range; Sort by Amount, Date)**
  - Components: Responsive Dashboard UI, API Gateway, Transaction Query Service, Transaction Repository.
  - Flows: Flow 4 – Transaction Management, Filters & Search.

- **Spending Analytics – Category‑wise Spending**
  - Components: Responsive Dashboard UI, API Gateway, Spending Analytics Service, Transaction Repository, Analytics & Aggregates Store.
  - Flows: Flow 5 – Spending Analytics Charts.

- **Spending Analytics – Monthly Spending Trend**
  - Components: Responsive Dashboard UI, API Gateway, Spending Analytics Service, Analytics & Aggregates Store.
  - Flows: Flow 5 – Spending Analytics Charts.

- **Spending Analytics – Card‑wise Spending Distribution**
  - Components: Responsive Dashboard UI, API Gateway, Spending Analytics Service, Transaction Repository, Analytics & Aggregates Store.
  - Flows: Flow 5 – Spending Analytics Charts.

- **Spending Analytics – Category Breakdown with Named Categories (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous)**
  - Components: Responsive Dashboard UI, API Gateway, Spending Analytics Service, Transaction Repository, Analytics & Aggregates Store.
  - Flows: Flow 5 – Spending Analytics Charts.

- **Budget Tracking – Monthly Budget, Current Spend, Remaining Budget, Budget Utilization %, Progress Bar**
  - Components: Responsive Dashboard UI, API Gateway, Budget Management Service, Budget Repository, Analytics & Aggregates Store or Transaction Repository.
  - Flows: Flow 6 – Budget Tracking & Progress Bar.

- **Recent Transactions Widget – Latest 5 Transactions**
  - Components: Responsive Dashboard UI, API Gateway, Transaction Query Service, Transaction Repository.
  - Flows: Flow 7 – Recent Transactions Widget.

- **Responsive Design – Mobile, Tablet, Desktop Friendly**
  - Components: Responsive Dashboard UI, Config & Feature Flags.
  - Flows: Flow 1 – Authentication & Session Establishment (for initial load) plus UI‑only responsiveness behavior.

### 6.2 Compliance Status

- **Transport Security** – Pass.
  - HTTPS/TLS enforced at API Gateway; HSTS headers configured.

- **Data Encryption at Rest** – Pass‑with‑conditions.
  - Design requires encryption for all relevant repositories; implementation depends on underlying infrastructure configuration.

- **Access Control (RBAC/ABAC)** – Pass.
  - Users restricted to their own data; support for role‑based control of advanced features.

- **Audit Logging** – Pass‑with‑conditions.
  - Logging patterns are defined; actual compliance depends on log retention, protection, and review processes.

- **Secrets Management** – Pass.
  - All secrets managed via centralized vault with audit capabilities.

- **Privacy & Cardholder Data Protection** – Pass‑with‑conditions.
  - Full card numbers and sensitive identifiers are excluded by design; compliance with specific regulatory frameworks (e.g., PCI‑DSS or privacy regulations) relies on enterprise policies and is not fully implemented in this epic.

### 6.3 Identified Ambiguities/Risks

- **Ambiguity: Exact Time Window for “Monthly” Metrics**
  - Consequence: Inconsistent reporting of totals and trends across systems, user confusion when dashboard totals do not match statements.
  - Mitigation: Define standard period (e.g., calendar month vs. billing cycle) and implement configuration in Config & Feature Flags with clear UI labels.

- **Ambiguity: Handling of Multi‑Currency Transactions**
  - Consequence: Aggregated totals may be misleading if transactions in multiple currencies are simply added without conversion.
  - Mitigation: Define currency handling strategy (e.g., convert to a base currency using enterprise FX rates) and incorporate into Analytics & Aggregates Store computations.

- **Risk: Performance Under High Transaction Volume**
  - Consequence: Slow UI response times, potential timeouts for transaction queries and analytics.
  - Mitigation: Ensure Transaction Repository and Analytics Store are properly indexed and support pagination; introduce caching for frequently accessed aggregates.

- **Risk: Data Freshness for Dashboard KPIs and Analytics**
  - Consequence: Users may see slightly outdated spend data, leading to discrepancies with real‑time balance views in other systems.
  - Mitigation: Document data latency expectations; leverage event‑driven updates where possible and use timestamps to indicate data as‑of time.

- **Risk: Budget Configuration Edge Cases**
  - Consequence: Invalid budget values or missing configurations could break budget calculations or present confusing UI states.
  - Mitigation: Implement strict validation in Budget Management Service; define defaults when no budget is configured and surface clear messaging.

- **Out of Scope Boundaries**
  - Payment initiation, card servicing workflows (e.g., disputes, limit changes), notification engines, statement generation, and detailed identity provider implementation are not part of this epic.
  - Consequence: Users may expect these capabilities when seeing spending data.
  - Mitigation: Clearly delineate dashboard functionality in UI copy and, where needed, provide navigation links to existing systems that handle those responsibilities.
