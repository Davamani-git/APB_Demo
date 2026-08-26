#### 1. High-Level Design
- Summary: Deliver a modern, responsive dashboard that consolidates all user credit cards and key KPIs (monthly spend, total credit limit, available credit, outstanding amounts) into a single, intuitive view, using internal/mock data sources rather than real bank integrations.
- Component Flow:
  ```mermaid
  flowchart TD
    U["User (Web/Mobile Client)"]
    UI["Dashboard UI Layer"]
    SVC["Dashboard Service & Aggregation"]
    DS["Card & Transaction Data Store (Mock/Internal)"]
    VIS["KPI & Charting Library"]

    U --> UI
    UI --> SVC
    SVC --> DS
    SVC --> VIS
    VIS --> UI
  ```
- Integration Points:
  - Internal card data store or mock data services for card details, balances, limits, and transactions.
  - Front-end charting/UI component libraries to render KPIs, summary tiles, and visualizations.
- Key Assumptions:
  - Card and transaction data are exposed via internal APIs or services with stable schemas (e.g., JSON over HTTPS).
  - KPI refresh is invoked on user navigation/load, with near real-time calculations based on the latest available internal/mock data.
- NFR Highlights: Dashboard must be responsive across modern web and mobile browsers; KPI calculations should update within acceptable UI latency while avoiding exposure of sensitive information beyond what is necessary for card-level analytics.
- Data Flow:
  - Inputs: The user accesses the dashboard via a web or mobile client, which calls dashboard APIs to retrieve card and transaction data from internal/mock data stores.
  - Processing: The dashboard service aggregates per-card limits, available credit, outstanding amounts, and monthly spend into portfolio-level KPIs and prepares view models for UI consumption; charting/KPI libraries render these metrics.
  - Outputs: The UI presents consolidated KPIs, per-card details, and summary views in a responsive layout, updating values within acceptable latency while redacting or omitting any data not required for analytics display.

#### 2. Validation Report
- Requirements Coverage: The high-level design covers the epic’s stated scope by providing a consolidated, responsive dashboard, computing and displaying the required KPIs from internal/mock data sources, integrating with charting/UI libraries, and aligning with the specified non-functional constraints on responsiveness, KPI update latency, and data sensitivity.