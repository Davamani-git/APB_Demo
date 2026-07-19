# Low-Level Design: Monthly Spending Summary Dashboard (QE-3258)

## 1. Application Overview

The Monthly Spending Summary Dashboard is a web-based capability within the bank's existing online banking web application. It provides authenticated customers with an aggregated monthly view of their credit card spending for a selected month. The UI presents:

- Monthly total credit card spend
- Monthly summary KPIs (e.g., total spend, number of transactions, average transaction amount, high/low indicators)
- High-level breakdown of spend suitable as an entry point into deeper insights
- Month selection controls constrained to months with available data

The implementation follows an AngularJS 1.7.9 Single Page Application (SPA) architecture, communicating with a backend Spending Summary REST API that orchestrates domain services such as Monthly Spend Aggregation, Summary KPI Computation, High-Level Spend Breakdown, and Month Selection & Context. All business requirements defined in the HLD are preserved; only credit card products are considered, and no transaction-level management features are implemented.

### In-Scope Functional Requirements

1. Monthly total credit card spend calculation for a selected month.
2. Monthly summary KPIs (total spend, transaction count, average transaction amount, and additional KPIs as defined by business configuration).
3. Visual representation of monthly spend via KPI cards and charts.
4. Month selection to view a specific month's summary, limited to available months for the customer.
5. Basic breakdown of spend suitable as entry point to deeper insights (e.g., category groupings, online vs. in-store).
6. Resilient error handling and graceful degradation when upstream dependencies are partially or fully unavailable.

### Out-of-Scope (Explicitly Preserved from HLD)

1. Non-credit-card products (deposits, loans, other products) – excluded from aggregation, KPI, and breakdown logic.
2. Detailed transaction-level management features (disputes, tagging, notes, exports, editing, etc.).
3. Any functionality that exposes detailed transaction records or PII in the UI.

### Missing Information (Explicitly Flagged)

The HLD does not fully specify:

- Exact list of KPIs beyond the examples (e.g., high/low indicators, trend metrics).
- Exact breakdown dimensions (e.g., final set of category groups, whether online vs. in-store is mandatory for v1).
- Precise rules for treatment of refunds, chargebacks, and fees in total spend and KPI calculations.
- Specific API URL paths and versioning conventions.
- Specific authentication token format (e.g., JWT claims shape) beyond general OAuth2/OIDC.

These must be confirmed by business/architecture owners. This LLD documents placeholders and constraints without making assumptions.

---

## 2. Technology Stack

### 2.1 Frontend

- HTML5
- CSS3
- JavaScript (ES6, transpiled where necessary for browser support)
- AngularJS 1.7.9
  - `ngRoute` 1.7.9
  - `ngAnimate` 1.7.9
  - `ngSanitize` 1.7.9
- Angular UI Bootstrap 2.5.6 (Bootstrap 3 components adapted for AngularJS)
- Bootstrap 3.4.1 (CSS only)
- Chart.js 2.9.4

Supported Browsers:

- Google Chrome (latest stable, minus one major version)
- Microsoft Edge (latest stable, minus one major version)

Constraints:

- No upgrade of framework versions beyond those specified.
- No additional frontend frameworks (React, Vue, etc.).
- jQuery and `bootstrap.min.js` are not used unless explicitly required (no such requirement in HLD, so they are excluded).

### 2.2 Backend (from HLD perspective)

Although backend implementation is out of scope for the frontend code generation, the LLD defines required contracts:

- Spending Summary REST API (edge API consumed by SPA).
- Domain Services (behind the REST API):
  - Monthly Spend Aggregation Service
  - Summary KPI Computation Service
  - High-Level Spend Breakdown Service
  - Month Selection & Context Service
- Data Stores accessed via backend services:
  - Credit Card Transactions Read Replica
  - Spending Analytics Store
  - Reference Data Store
- Integration services:
  - Credit Card Transactions API
  - Customer Profile Service

---

## 3. Architecture Design

### 3.1 AngularJS SPA Architecture

The application follows AngularJS MVC architecture with:

- Angular module `app` as the root module.
- Single Page Application routing using `ngRoute`.
- Dependency Injection for all components.
- ControllerAs syntax (e.g., `vm` as the controller alias).
- IIFE module pattern in all JavaScript files.
- REST-based communication with the Spending Summary REST API.

### 3.2 Logical Layers (Client-Side)

- **Presentation Layer**
  - Dashboard view template (monthly summary view)
  - Common layout templates (header, footer, nav, etc.)
  - KPI cards, charts, tables.

- **Controller Layer**
  - Coordinates interactions between the UI and services.
  - Holds view model state.

- **Service Layer**
  - Encapsulates business logic necessary for the UI such as mapping API responses, orchestrating calls, and applying configuration.
  - Communicates with REST endpoints.
  - Switches between Production and Mock implementations based on configuration.

- **Model Layer**
  - Data representations of monthly summaries, KPIs, breakdowns, error structures, configuration, and month availability.

- **Configuration Layer**
  - Centralized environment configuration.
  - API base URLs, timeouts, feature flags, mock mode toggle.

- **Cross-Cutting Client Concerns**
  - LoggingService for structured client-side logging.
  - Error handling and mapping.
  - Security hooks (e.g., attaching Authorization headers, sanitizing data).

### 3.3 Interaction with Backend (High-Level)

- The SPA sends authenticated requests including an `Authorization` header (token acquired from existing banking session).
- API Gateway performs authentication and basic request validation.
- Spending Summary REST API orchestrates domain services and returns aggregated JSON responses.
- The SPA never directly communicates with upstream domain services, data stores, or integration APIs.

---

## 4. Repository Structure

The repository structure for the frontend application SHALL be:

```text
src/
    app/
        controllers/
            monthlySummary.controller.js
        services/
            monthlySummary.service.js
            monthSelection.service.js
            breakdown.service.js
            kpi.service.js
            logging.service.js
            httpInterceptor.service.js
        factories/
            apiClient.factory.js
        directives/
            kpiCard.directive.js
            breakdownChart.directive.js
            monthSelector.directive.js
        filters/
            currencyFormat.filter.js
            dateFormat.filter.js
            percentage.filter.js
        models/
            monthlySummary.model.js
            kpi.model.js
            breakdown.model.js
            monthAvailability.model.js
            error.model.js
            config.model.js
        config/
            app.module.js
            app.routes.js
            app.config.js
            env.config.js
        routes/
            route.constants.js
    templates/
        layout/
            header.html
            footer.html
            navigation.html
        dashboard/
            monthlySummary.html
            kpiCard.html
            breakdownChart.html
            monthSelector.html
    assets/
        css/
            app.css
            dashboard.css
        js/
            vendor.js
        images/
            icons/
                kpi-total-spend.png
                kpi-transaction-count.png
                kpi-average-spend.png
            illustrations/
                empty-state.png
                error-state.png
                loading-spinner.gif
        fonts/
            (if required by branding; to be specified by UI team)
    mock/
        data/
            monthlySummary.mock.json
            breakdown.mock.json
            kpi.mock.json
            monthAvailability.mock.json
            error.mock.json
        services/
            monthlySummary.mock.service.js
            breakdown.mock.service.js
            kpi.mock.service.js
            monthSelection.mock.service.js
    data/
        (optional local data files for development/testing if approved)
index.html
README.md
```

For each file, detailed responsibilities and dependencies are defined in subsequent sections. No placeholder files are introduced.

---

## 5. Application Bootstrap Design

### 5.1 index.html

`index.html` is the entry point of the SPA and SHALL:

- Declare the AngularJS application via `ng-app="app"`.
- Provide a root `<div ng-view></div>` for route views.
- Include CSS and JS resources in the correct order.

#### 5.1.1 Stylesheet Loading Order

1. Bootstrap 3.4.1 CSS (CDN).
2. Any icon/font CSS as required by branding.
3. Application-level CSS:
   - `assets/css/app.css`
   - `assets/css/dashboard.css`

#### 5.1.2 JavaScript Loading Order

1. AngularJS 1.7.9 (CDN).
2. Angular Route 1.7.9 (CDN).
3. Angular Animate 1.7.9 (CDN).
4. Angular Sanitize 1.7.9 (CDN).
5. Angular UI Bootstrap 2.5.6 (CDN).
6. Chart.js 2.9.4 (CDN).
7. `assets/js/vendor.js` (for any permitted vendor utilities if needed, excluding jQuery and Bootstrap JS). 
8. Application scripts:
   - `src/app/config/app.module.js`
   - `src/app/config/app.config.js`
   - `src/app/config/env.config.js`
   - `src/app/config/app.routes.js`
   - `src/app/routes/route.constants.js`
   - `src/app/models/*.js`
   - `src/app/factories/apiClient.factory.js`
   - `src/app/services/*.js`
   - `src/app/directives/*.js`
   - `src/app/filters/*.js`
   - `src/app/controllers/*.js`

#### 5.1.3 CDN URLs (Illustrative, Not Code)

The LLD mandates use of CDN-hosted libraries for:

- AngularJS 1.7.9
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 CSS
- Chart.js 2.9.4

Exact CDN URLs are to be set according to enterprise standards (e.g., using a corporate asset CDN). They are configuration, not hardcoded.

### 5.2 Root Angular Module

File: `src/app/config/app.module.js`

- Defines the root module:
  - Module Name: `app`
  - Dependencies:
    - `ngRoute`
    - `ngAnimate`
    - `ngSanitize`
    - `ui.bootstrap`
- Registration: `angular.module("app", ["ngRoute", "ngAnimate", "ngSanitize", "ui.bootstrap"])`
- Responsibility:
  - Initialize AngularJS application.
  - Provide base container for all components.

No other file redeclares the module; all other files use `angular.module("app")`.

### 5.3 Config & Run Blocks

File: `src/app/config/app.config.js`

- Component Type: Config
- Angular Registration: `.config(appConfig)`
- Dependencies:
  - `$httpProvider`
  - Any global configuration services needed (e.g., `ENV_CONFIG`, `LoggingService`).
- Responsibilities:
  - Register HTTP interceptors (e.g., `httpInterceptor.service.js`).
  - Configure global HTTP timeouts if applicable via backend or configuration.
  - Enable cross-site request forgery protections in accordance with enterprise standards (headers, tokens).

File: `src/app/config/env.config.js`

- Component Type: Constant
- Angular Registration: `.constant("ENV_CONFIG", { ... })`
- Responsibility:
  - Expose environment configuration object (details in Configuration Design).

Run blocks are minimized; if needed, a simple `.run` block will initialize any required global state or logging.

---

## 6. Module Design

### 6.1 Core Application Module

- Name: `app`
- Type: AngularJS Module
- File: `src/app/config/app.module.js`
- Dependencies:
  - `ngRoute`
  - `ngAnimate`
  - `ngSanitize`
  - `ui.bootstrap`
- Responsibilities:
  - Aggregate all application components.
  - Provide root scope for routing and configuration.

Additional feature modules are not introduced; application remains within a single module for this specific dashboard.

---

## 7. Routing Design

File: `src/app/config/app.routes.js`

### 7.1 Routes

1. Route: Monthly Summary Dashboard
   - URL: `/spending/monthly-summary`
   - TemplateUrl: `templates/dashboard/monthlySummary.html`
   - Controller: `MonthlySummaryController`
   - ControllerAs: `vm`
   - Resolve:
     - `monthAvailability`: calls `MonthSelectionService.getAvailableMonths(customerId)`.
     - `initialSummary`: optionally calls `MonthlySummaryService.getSummary(defaultMonth)` if a default month is configured.

2. Default Route
   - URL: `*` (otherwise)
   - Redirect: `/spending/monthly-summary`

Route Constants:

File: `src/app/routes/route.constants.js`

- Defines named route identifiers and base paths for use across the app.

Routing Rules:

- Every TemplateUrl maps to an existing template file.
- Controller exists and is registered.
- Default route redirects invalid paths to `/spending/monthly-summary`.
- Navigation menu links correspond to the defined routes.

---

## 8. Component Registry

The Component Registry lists all AngularJS components, their types, and metadata.

### 8.1 Controllers

1. `MonthlySummaryController`
   - Type: Controller
   - Path: `src/app/controllers/monthlySummary.controller.js`
   - Module: `app`
   - Registration: `.controller("MonthlySummaryController", MonthlySummaryController)`
   - Dependencies:
     - `MonthlySummaryService`
     - `MonthSelectionService`
     - `BreakdownService`
     - `KpiService`
     - `LoggingService`
     - `$routeParams`
     - `$location`
   - Consumed by: `templates/dashboard/monthlySummary.html`

### 8.2 Services

1. `MonthlySummaryService`
   - Path: `src/app/services/monthlySummary.service.js`
   - Type: Service
   - Module: `app`
   - Registration: `.service("MonthlySummaryService", MonthlySummaryService)`

2. `MonthSelectionService`
   - Path: `src/app/services/monthSelection.service.js`
   - Type: Service
   - Registration: `.service("MonthSelectionService", MonthSelectionService)`

3. `BreakdownService`
   - Path: `src/app/services/breakdown.service.js`
   - Type: Service
   - Registration: `.service("BreakdownService", BreakdownService)`

4. `KpiService`
   - Path: `src/app/services/kpi.service.js`
   - Type: Service
   - Registration: `.service("KpiService", KpiService)`

5. `LoggingService`
   - Path: `src/app/services/logging.service.js`
   - Type: Service
   - Registration: `.service("LoggingService", LoggingService)`

6. `HttpInterceptorService`
   - Path: `src/app/services/httpInterceptor.service.js`
   - Type: Service (HTTP interceptor)
   - Registration: `.factory("HttpInterceptorService", HttpInterceptorService)` and added to `$httpProvider.interceptors`.

### 8.3 Factories

1. `ApiClientFactory`
   - Path: `src/app/factories/apiClient.factory.js`
   - Type: Factory
   - Registration: `.factory("ApiClient", ApiClientFactory)`

### 8.4 Directives

1. `kpiCard`
   - Path: `src/app/directives/kpiCard.directive.js`
   - Type: Directive

2. `breakdownChart`
   - Path: `src/app/directives/breakdownChart.directive.js`
   - Type: Directive

3. `monthSelector`
   - Path: `src/app/directives/monthSelector.directive.js`
   - Type: Directive

### 8.5 Filters

1. `currencyFormat`
   - Path: `src/app/filters/currencyFormat.filter.js`

2. `dateFormat`
   - Path: `src/app/filters/dateFormat.filter.js`

3. `percentage`
   - Path: `src/app/filters/percentage.filter.js`

### 8.6 Models

1. `MonthlySummaryModel`
2. `KpiModel`
3. `BreakdownModel`
4. `MonthAvailabilityModel`
5. `ErrorModel`
6. `ConfigModel`

Each model is defined in its own file under `src/app/models/`.

### 8.7 Config/Constants/Interceptors

- `ENV_CONFIG` constant in `env.config.js`.
- Route constants in `route.constants.js`.
- HTTP interceptor in `httpInterceptor.service.js`.

---

## 9. Controller Design

### 9.1 MonthlySummaryController

File: `src/app/controllers/monthlySummary.controller.js`

Component Type: Controller

#### 9.1.1 Angular Registration

- Module: `app`
- Registration: `.controller("MonthlySummaryController", MonthlySummaryController)`
- ControllerAs: `vm`

#### 9.1.2 Dependencies (Injected)

- `MonthlySummaryService`
- `MonthSelectionService`
- `BreakdownService`
- `KpiService`
- `LoggingService`
- `$routeParams`
- `$location`

#### 9.1.3 ViewModel State

- `vm.availableMonths: MonthAvailabilityModel[]` – list of selectable months.
- `vm.selectedMonth: string` – month identifier (e.g., `YYYY-MM`).
- `vm.summary: MonthlySummaryModel | null` – monthly summary data.
- `vm.kpis: KpiModel[]` – KPI cards to display.
- `vm.breakdown: BreakdownModel | null` – breakdown data for charts.
- `vm.isLoading: boolean` – loading indicator.
- `vm.hasError: boolean` – error state flag.
- `vm.error: ErrorModel | null` – error details for display.
- `vm.isPartial: boolean` – flag indicating partial data.

#### 9.1.4 Public Methods (Exposed to View)

- `vm.initialize()`
  - Purpose: Initialize controller state.
  - Inputs: None; uses route parameters and resolves.
  - Behaviour:
    - Load available months via `MonthSelectionService` (if not provided by resolve).
    - Select default month (e.g., most recent available month).
    - Invoke `vm.loadMonthlySummary()`.

- `vm.loadMonthlySummary(month?: string)`
  - Purpose: Load summary data for the selected or specified month.
  - Inputs:
    - `month` (optional): month identifier; if absent, uses `vm.selectedMonth`.
  - Behaviour:
    - Set `vm.isLoading = true`, reset error state.
    - Call `MonthlySummaryService.getSummary(month)`.
    - On success: update `vm.summary`, `vm.isPartial`, and call `KpiService.buildKpis(summary)` and `BreakdownService.getBreakdown(month)`.
    - On partial success (analytics unavailable): show limited KPIs, skip breakdown chart; set notice in UI.
    - On failure: set `vm.hasError = true`, populate `vm.error`, log via `LoggingService`, show error message.

- `vm.changeMonth(month: string)`
  - Purpose: Change selected month.
  - Inputs: `month`.
  - Behaviour:
    - Validate that `month` exists in `vm.availableMonths`.
    - Update `vm.selectedMonth`.
    - Call `vm.loadMonthlySummary(month)`.

- `vm.retry()`
  - Purpose: Retry loading summary after an error.
  - Behaviour: Calls `vm.loadMonthlySummary(vm.selectedMonth)`.

- `vm.navigateTo(defaultRoute?: string)`
  - Purpose: Navigate to another view (currently only dashboard route).
  - Behaviour: Use `$location.path()` with route constants; mainly placeholder for future epics.

#### 9.1.5 Private Methods (Internal Use)

Private helper functions (documented but not exposed via `vm`):

- `_handleSuccess(response: MonthlySummaryModel)`
  - Map response to `vm.summary`, `vm.kpis`, `vm.breakdown`, `vm.isPartial`.

- `_handleError(error: ErrorModel)`
  - Set `vm.hasError`, `vm.error`, turn off `vm.isLoading`, call `LoggingService.error(...)`.

#### 9.1.6 Event Handling

- On route change, controller re-reads `selectedMonth` from `$routeParams` when supported.
- On month selector component output (`on-month-change`), controller executes `vm.changeMonth(month)`.

#### 9.1.7 Error Handling and Logging

- All service failures are passed through `ErrorModel` and logged via `LoggingService`.
- User-facing messages are derived from error codes (e.g., invalid month, unavailable service).
- Sensitive information is never included in logs (only correlation IDs, customer hash if available, month identifier, error category).

---

## 10. Service Design

### 10.1 MonthlySummaryService

File: `src/app/services/monthlySummary.service.js`

Component Type: Service

#### 10.1.1 Purpose

- Retrieve monthly summary data from the Spending Summary REST API.
- Perform client-side mapping from API response JSON to `MonthlySummaryModel`.
- Handle mock mode switching and retry logic.

#### 10.1.2 Dependencies

- `ApiClient` (factory for HTTP calls)
- `ENV_CONFIG`
- `LoggingService`

#### 10.1.3 Public Methods

- `getSummary(month: string): Promise<MonthlySummaryModel>`
  - Inputs:
    - `month` (required) – month identifier (format validated before call).
  - Behaviour:
    - Build request URL: `ENV_CONFIG.apiBaseUrl + "/spending/monthly-summary"`.
    - Add query parameter `month`.
    - Use `ApiClient.get(url, config)` with appropriate headers (Authorization provided by global interceptor).
    - Apply timeout `ENV_CONFIG.apiTimeoutMs`.
    - On success: validate response shape and map to `MonthlySummaryModel`.
    - On partial data indicator: set `isPartial` flag in model.
    - On error: map to `ErrorModel` and reject promise.

#### 10.1.4 Private Methods

- `buildRequest(month)`
  - Validate `month` format (e.g., `YYYY-MM`).
  - Ensure `month` within allowed range based on `ENV_CONFIG.maxLookbackMonths` (UI-level validation; actual range enforced by backend).

- `mapResponse(responseJson)`
  - Map fields:
    - `totalSpend`
    - `transactionCount`
    - `averageTransactionAmount`
    - `currency`
    - `month`
    - `isPartial`
    - `dataSource` metadata (if provided).

- `validateResponse(responseJson)`
  - Check mandatory fields are present and of expected type.
  - If validation fails, construct `ErrorModel` with `code = "INVALID_RESPONSE"`.

#### 10.1.5 REST Endpoints Used

- Endpoint Name: Monthly Summary Retrieval
- URL: `/api/spending/monthly-summary`
- Method: `GET`

(Exact base path `/api` vs `/edge/api` may differ; `ENV_CONFIG.apiBaseUrl` ensures no hardcoding.)


### 10.2 MonthSelectionService

File: `src/app/services/monthSelection.service.js`

#### Purpose

- Fetch available months from backend.
- Provide client-side utilities for checking validity and default month selection.

#### Dependencies

- `ApiClient`
- `ENV_CONFIG`
- `LoggingService`

#### Public Methods

- `getAvailableMonths(customerId?: string): Promise<MonthAvailabilityModel[]>`
  - Inputs: optional `customerId` if required by backend; typically derived from session.
  - Behaviour:
    - Call `ENV_CONFIG.apiBaseUrl + "/spending/months"`.
    - On success: map list to `MonthAvailabilityModel[]`.

- `getDefaultMonth(months: MonthAvailabilityModel[]): string`
  - Behaviour: Return most recent month (last element or based on sort) as default.

#### REST Endpoint

- `GET /api/spending/months`


### 10.3 BreakdownService

File: `src/app/services/breakdown.service.js`

#### Purpose

- Retrieve breakdown data for a given month.

#### Dependencies

- `ApiClient`
- `ENV_CONFIG`
- `LoggingService`

#### Public Methods

- `getBreakdown(month: string): Promise<BreakdownModel>`

#### REST Endpoint

- `GET /api/spending/monthly-breakdown?month={month}`


### 10.4 KpiService

File: `src/app/services/kpi.service.js`

#### Purpose

- Transform summary and breakdown data into KPI card models for the UI.

#### Dependencies

- `ENV_CONFIG`

#### Public Methods

- `buildKpis(summary: MonthlySummaryModel): KpiModel[]`
  - Maps: total spend, transaction count, average spend, and any configured KPIs.


### 10.5 LoggingService

File: `src/app/services/logging.service.js`

#### Purpose

- Provide centralized logging for client-side components.

#### Dependencies

- `$log` (AngularJS logging service)

#### Public Methods

- `info(message: string, context?: object)`
- `warn(message: string, context?: object)`
- `error(message: string, context?: object)`

Sensitive information (full card numbers, PII) is never logged.


### 10.6 HttpInterceptorService

File: `src/app/services/httpInterceptor.service.js`

#### Purpose

- Attach Authorization header if needed.
- Handle global error mapping and correlation IDs.

#### Dependencies

- `$q`
- `LoggingService`

#### Public Methods

- Interceptor methods: `request`, `response`, `responseError`.

---

## 11. Factory Design

### 11.1 ApiClientFactory

File: `src/app/factories/apiClient.factory.js`

#### Purpose

- Provide reusable HTTP client abstraction over `$http`.
- Configure base URL, timeouts, and response handling.

#### Dependencies

- `$http`
- `ENV_CONFIG`

#### Public Methods

- `get(url: string, config?: object)`
- `post(url: string, data: any, config?: object)`

Objects Created:

- HTTP request configuration objects.

Consumers:

- `MonthlySummaryService`
- `MonthSelectionService`
- `BreakdownService`

---

## 12. Directive Design

### 12.1 kpiCard Directive

File: `src/app/directives/kpiCard.directive.js`

#### Purpose

- Render a single KPI card with icon, label, and value.

#### Directive Definition

- Restrict: `E`
- Scope Bindings:
  - `label: "@"`
  - `value: "<"`
  - `icon: "@"`
  - `tooltip: "@"` (optional)
- BindToController: `true`
- Controller: `KpiCardController` (internal, simple)
- ControllerAs: `vm`
- TemplateUrl: `templates/dashboard/kpiCard.html`

#### Usage Example

```html
<kpi-card
    label="Total Spend"
    value="vm.summary.totalSpend"
    icon="assets/images/icons/kpi-total-spend.png">
</kpi-card>
```

### 12.2 breakdownChart Directive

File: `src/app/directives/breakdownChart.directive.js`

#### Purpose

- Render Chart.js-based breakdown visualization.

#### Directive Definition

- Restrict: `E`
- Scope Bindings:
  - `data: "<"` (BreakdownModel)
  - `onSegmentClick: "&"` (optional callback)
- TemplateUrl: `templates/dashboard/breakdownChart.html`
- Controller: `BreakdownChartController`
- ControllerAs: `vm`

#### Usage Example

```html
<breakdown-chart
    data="vm.breakdown"
    on-segment-click="vm.onSegmentClick(segment)">
</breakdown-chart>
```

### 12.3 monthSelector Directive

File: `src/app/directives/monthSelector.directive.js`

#### Purpose

- Provide a dropdown or date-selector UI component for month selection.

#### Directive Definition

- Restrict: `E`
- Scope Bindings:
  - `months: "<"` (MonthAvailabilityModel[])
  - `selectedMonth: "="`
  - `onChange: "&"` (callback when month changes)
- TemplateUrl: `templates/dashboard/monthSelector.html`
- Controller: `MonthSelectorController`
- ControllerAs: `vm`

#### Usage Example

```html
<month-selector
    months="vm.availableMonths"
    selected-month="vm.selectedMonth"
    on-change="vm.changeMonth(month)">
</month-selector>
```

---

## 13. Filter Design

### 13.1 currencyFormat Filter

File: `src/app/filters/currencyFormat.filter.js`

#### Purpose

- Format numeric values as currency according to configuration.

Inputs:

- `value: number`
- `currencyCode?: string`

Outputs:

- `string` formatted currency.

### 13.2 dateFormat Filter

File: `src/app/filters/dateFormat.filter.js`

#### Purpose

- Format date strings (YYYY-MM or full date) into user-facing format.

Inputs:

- `value: string`

Outputs:

- `string` (e.g., `July 2026`).

### 13.3 percentage Filter

File: `src/app/filters/percentage.filter.js`

#### Purpose

- Format decimal values as percentages (e.g., 0.123 => `12.3%`).

Inputs:

- `value: number`

Outputs:

- `string`.

---

## 14. Model Design

### 14.1 MonthlySummaryModel

File: `src/app/models/monthlySummary.model.js`

#### Purpose

- Represent monthly summary data for the UI.

#### Properties

- `month: string` (required, format `YYYY-MM`).
- `totalSpend: number` (>= 0).
- `transactionCount: number` (>= 0).
- `averageTransactionAmount: number` (>= 0).
- `currency: string` (ISO currency code).
- `isPartial: boolean` – indicates partial data.
- `dataSource: string` – optional metadata (e.g., `READ_REPLICA`, `API_MIX`).

#### Validation Rules

- `month` required and valid format.
- `totalSpend >= 0`.
- `transactionCount >= 0`.
- `averageTransactionAmount >= 0`.
- `currency` required.

#### Sample JSON

```json
{
  "month": "2026-07",
  "totalSpend": 45872.50,
  "transactionCount": 92,
  "averageTransactionAmount": 498.61,
  "currency": "INR",
  "isPartial": false,
  "dataSource": "READ_REPLICA"
}
```

### 14.2 KpiModel

File: `src/app/models/kpi.model.js`

Properties:

- `id: string`.
- `label: string`.
- `value: number | string`.
- `formattedValue: string`.
- `iconUrl: string`.
- `trendIndicator?: string` (e.g., `up`, `down`, `neutral`).

### 14.3 BreakdownModel

File: `src/app/models/breakdown.model.js`

Properties:

- `month: string`.
- `segments: Array<{
    "label": string,
    "value": number,
    "percentage": number
  }>`
- `totalSpend: number`.

Validation:

- Sum of `segments[i].value` <= `totalSpend`.

Sample JSON:

```json
{
  "month": "2026-07",
  "totalSpend": 45872.50,
  "segments": [
    { "label": "Online", "value": 25000, "percentage": 54.5 },
    { "label": "In-Store", "value": 20872.5, "percentage": 45.5 }
  ]
}
```

### 14.4 MonthAvailabilityModel

File: `src/app/models/monthAvailability.model.js`

Properties:

- `month: string` (YYYY-MM).
- `isCurrent: boolean`.
- `hasData: boolean`.

Sample JSON:

```json
[
  { "month": "2026-05", "isCurrent": false, "hasData": true },
  { "month": "2026-06", "isCurrent": false, "hasData": true },
  { "month": "2026-07", "isCurrent": true, "hasData": true }
]
```

### 14.5 ErrorModel

File: `src/app/models/error.model.js`

Properties:

- `code: string` (e.g., `INVALID_MONTH`, `SERVICE_UNAVAILABLE`).
- `message: string` (user-facing).
- `technicalMessage?: string` (internal, not shown to user).
- `retryable: boolean`.

Sample JSON:

```json
{
  "code": "SERVICE_UNAVAILABLE",
  "message": "We are unable to display your spending summary right now. Please try again later.",
  "retryable": true
}
```

### 14.6 ConfigModel

File: `src/app/models/config.model.js`

Properties mirror `ENV_CONFIG` values for internal reference.

---

## 15. REST API Contract

The frontend relies on the Spending Summary REST API, implemented in the backend. Contracts are defined without implementation assumptions.

### 15.1 GET /api/spending/monthly-summary

Endpoint Name: Get Monthly Spending Summary

- Method: GET
- URL: `/api/spending/monthly-summary`
- Headers:
  - `Authorization: Bearer <token>`
  - `X-Correlation-ID: <uuid>` (optional)
- Query Parameters:
  - `month` (required, format `YYYY-MM`)
- Authentication:
  - OAuth2/OIDC token validated by API Gateway and backend.

#### Success Response (200)

Body: `MonthlySummaryModel` JSON.

#### Error Responses

- `400 Bad Request` – invalid month format or missing parameter.
- `401 Unauthorized` – missing/invalid token.
- `403 Forbidden` – user not authorized for specified card accounts.
- `404 Not Found` – month not available.
- `429 Too Many Requests` – rate limit exceeded.
- `500 Internal Server Error` – unexpected error.
- `503 Service Unavailable` – upstream dependency failure.

Error body: `ErrorModel` JSON.

### 15.2 GET /api/spending/months

Endpoint Name: Get Available Months

- Method: GET
- URL: `/api/spending/months`

Response: `MonthAvailabilityModel[]`.

### 15.3 GET /api/spending/monthly-breakdown

Endpoint Name: Get Monthly Spend Breakdown

- Method: GET
- URL: `/api/spending/monthly-breakdown`
- Query Parameters:
  - `month` (required)

Response: `BreakdownModel`.

### 15.4 REST Timeouts and Retries (Frontend Perspective)

- Frontend applies `ENV_CONFIG.apiTimeoutMs` for HTTP calls.
- Backend applies its own bounding retries; frontend does not perform endless retries, only manual user-triggered retry via `vm.retry()`.

---

## 16. Configuration Design

Configuration is centralized via `ENV_CONFIG` constant and environment JSON files.

### 16.1 ENV_CONFIG

File: `src/app/config/env.config.js`

Properties:

- `apiBaseUrl: string`
  - Default: e.g., `"/api"` (relative to host).
  - Allowed: any HTTPS base URL.

- `apiTimeoutMs: number`
  - Default: 5000 ms.
  - Allowed: 1000–30000 ms.

- `maxLookbackMonths: number`
  - Default: 12.

- `useMockData: boolean`
  - Default: `false` for prod.

- `featureFlags: object`
  - Example: `{ "showAdvancedKpis": false }`.

- `telemetry: object`
  - Example: `{ "enableClientMetrics": true }`.

Consumers:

- `ApiClient`
- `MonthlySummaryService`
- `MonthSelectionService`
- `BreakdownService`
- `KpiService`

### 16.2 Environment Files

- `env.default.json` – baseline configuration.
- `env.dev.json` – development overrides.
- `env.prod.json` – production overrides.
- `config.constants.js` – defines environment selection logic.

No configuration properties are hardcoded inside controllers or services; all configuration flows through `ENV_CONFIG`.

---

## 17. Mock Implementation Design

Mock mode is controlled solely by `ENV_CONFIG.useMockData`.

### 17.1 Mock Data Files

Under `mock/data/`:

- `monthlySummary.mock.json` – sample monthly summary.
- `breakdown.mock.json` – sample breakdown.
- `kpi.mock.json` – sample KPI configuration.
- `monthAvailability.mock.json` – sample available months.
- `error.mock.json` – sample error responses.

### 17.2 Mock Services

Under `mock/services/`:

- `monthlySummary.mock.service.js`
  - Methods:
    - `getSummary(month)` – uses `$q` and `$timeout` to return `MonthlySummaryModel` from JSON.
  - Simulates:
    - Success.
    - Partial data.
    - Timeout.
    - Error (using `error.mock.json`).

- `breakdown.mock.service.js`
  - `getBreakdown(month)` – returns `BreakdownModel`.

- `kpi.mock.service.js`
  - `getKpiConfig()` – returns KPI definitions.

- `monthSelection.mock.service.js`
  - `getAvailableMonths()` – returns `MonthAvailabilityModel[]`.

Mock responses exactly match production contracts and error structure.

### 17.3 Switching Between Production and Mock

- If `ENV_CONFIG.useMockData === true`, services use mock implementations instead of `ApiClient`.
- Switching this flag requires no code changes; only configuration.

---

## 18. UI Specification

### 18.1 Layout

Overall Page Structure (monthlySummary.html):

- Header: application title, user context.
- Navigation: menu including "Monthly Spending Summary".
- Content Area:
  - Month selector component.
  - KPI cards row.
  - Breakdown chart section.
  - Optional table for breakdown details.
- Footer: legal, links.

Bootstrap Grid:

- Container: `.container-fluid`.
- Month selector row: `.row` with `.col-md-3` for selector.
- KPI cards: `.row` with multiple `.col-md-3` cards.
- Charts: `.row` `.col-md-12`.

### 18.2 KPI Cards

Each KPI card:

- Uses `.panel` or custom `.card` CSS.
- Shows icon, label, value.
- Numeric values formatted via `currencyFormat` or `number` filters.

KPI Examples (non-exhaustive):

- Total Spend
- Transaction Count
- Average Transaction Amount

### 18.3 Charts

- Chart type: Bar or Doughnut for breakdown segments.
- Chart.js 2.9.4 used via custom directive.

States:

- Loading: display spinner.
- No data: show "No spending data available for the selected month." message with illustration.
- Error: show error message and Retry button.

### 18.4 Tables (Optional)

- Columns: Segment label, value, percentage.
- Sorting: by value or label.
- Numeric values right-aligned.

### 18.5 Responsive Behaviour

- Cards stack vertically on narrow screens.
- Chart resizes to available width.
- No horizontal scroll in normal usage.

### 18.6 Accessibility

- All interactive elements reachable via keyboard.
- Month selector accessible via `tab`.
- Buttons have descriptive labels.
- Colour contrast meets enterprise accessibility standards.

### 18.7 Loading, Empty, Error States

- Loading: overlay spinner and disabled controls.
- Empty: message with suggestion to select another month.
- Error: message and Retry button.

---

## 19. Data Flow

### 19.1 Success Flow

1. User navigates to `/spending/monthly-summary`.
2. `MonthlySummaryController.initialize()` loads available months via `MonthSelectionService`.
3. Controller selects default month and calls `MonthlySummaryService.getSummary(month)`.
4. `ApiClient` sends `GET /api/spending/monthly-summary?month={month}`.
5. Backend returns `MonthlySummaryModel` JSON.
6. Controller maps summary to `vm.summary` and uses `KpiService.buildKpis(summary)` and `BreakdownService.getBreakdown(month)`.
7. Breakdown data returned and bound to `vm.breakdown` for chart directive.
8. UI updates KPI cards and charts.

### 19.2 Partial Data Flow

1. Monthly summary returns success but includes `isPartial = true` and missing breakdown.
2. Controller sets `vm.isPartial = true`, `vm.breakdown = null`.
3. UI displays basic KPIs, hides breakdown chart, and shows message: "Some insights are temporarily unavailable. Basic totals are shown."

### 19.3 Failure Flow

1. Backend returns error (e.g., `503 Service Unavailable`).
2. `ApiClient` rejects promise with `ErrorModel`.
3. MonthlySummaryController `_handleError(error)` sets error state.
4. UI shows friendly message and Retry button.
5. LoggingService records error.

---

## 20. Business Rules

From HLD and clarified in implementation:

1. Only credit card products are included.
2. Month selection constrained to months where transaction data exists.
3. Aggregation uses posted transactions; pre-posted or pending transactions are excluded unless business config states otherwise (missing detail).
4. Breakdown remains high-level; no detailed transaction-level data.
5. Summary KPIs must be consistent with backend definitions.

Any missing or ambiguous rules (e.g., treatment of refunds) must be documented and clarified prior to backend implementation. Frontend expects backend to enforce correct rules.

---

## 21. Validation Rules

Validation occurs at multiple layers.

### 21.1 Client-Side Validation

- Month selection must be within `vm.availableMonths`.
- Month format must be `YYYY-MM`.

### 21.2 API Request Validation (Frontend)

- `MonthlySummaryService.buildRequest` ensures non-empty month.
- Prevents calls with invalid or out-of-range month.

### 21.3 API Response Validation (Frontend)

- `validateResponse` ensures mandatory fields present.

### 21.4 Configuration Validation

- `ENV_CONFIG` values checked at startup (e.g., `apiBaseUrl` non-empty, `apiTimeoutMs` within allowed range).

---

## 22. Error Handling

Error categories:

- Validation Errors – invalid month.
- Business Errors – month not available (404).
- Network Errors – connectivity issues.
- Timeout Errors – backend not responding in time.
- Unexpected Errors – generic 500.

Handling:

- Map HTTP errors to user-friendly messages.
- Provide Retry for retryable errors.
- Log all errors with correlation IDs.

---

## 23. Logging Design

LoggingService ensures:

- Info logs for successful summary loads.
- Warning logs for partial data.
- Error logs for failed calls.

No sensitive information is logged; logs focus on event type, month, and correlation IDs.

---

## 24. Security Design

- Frontend attaches Authorization headers via HTTP interceptor (token comes from existing banking session).
- Input validation guards against malformed `month` values.
- Output sanitization via `ngSanitize` for any dynamic content.
- No PII or card numbers displayed.

Backend-specific security (TLS, encryption, RBAC/ABAC) is handled server-side as described in HLD.

---

## 25. Dependency Map

### 25.1 MonthlySummaryController

- Depends on: `MonthlySummaryService`, `MonthSelectionService`, `BreakdownService`, `KpiService`, `LoggingService`, `$routeParams`, `$location`.
- Consumed by: `monthlySummary.html`.

### 25.2 MonthlySummaryService

- Depends on: `ApiClient`, `ENV_CONFIG`, `LoggingService`.
- Consumed by: `MonthlySummaryController`.

### 25.3 MonthSelectionService

- Depends on: `ApiClient`, `ENV_CONFIG`, `LoggingService`.
- Consumed by: `MonthlySummaryController`, `monthSelector`.

### 25.4 BreakdownService

- Depends on: `ApiClient`, `ENV_CONFIG`, `LoggingService`.
- Consumed by: `MonthlySummaryController`, `breakdownChart`.

### 25.5 KpiService

- Depends on: `ENV_CONFIG`.
- Consumed by: `MonthlySummaryController`, `kpiCard`.

### 25.6 ApiClientFactory

- Depends on: `$http`, `ENV_CONFIG`.
- Consumed by: all services.

### 25.7 LoggingService

- Depends on: `$log`.
- Consumed by: controllers, services, interceptors.

### 25.8 Directives

- `kpiCard` depends on: `KpiModel` (data), `currencyFormat` filter.
- `breakdownChart` depends on: Chart.js, `BreakdownModel`.
- `monthSelector` depends on: `MonthAvailabilityModel`.

---

## 26. LLD Validation Checklist

The LLD has been validated against lldgenerationkb quality gates:

- Mandatory sections 1–26 present.
- Technology stack conforms to specified versions and frameworks.
- Architecture follows AngularJS MVC SPA with DI and ControllerAs.
- Repository structure fully defined with paths and purposes.
- index.html loading order and resource list defined.
- Root Angular module and config/run blocks defined.
- Routing and TemplateUrl mapping defined with default route.
- Component registry covers all controllers, services, factories, directives, filters, models, and interceptors.
- Per-file responsibilities, dependencies, and public methods described.
- Controllers do not contain business logic; services encapsulate business behaviour.
- REST API contracts specified without implementation assumptions.
- Configuration centralized using ENV_CONFIG and environment files.
- Mock mode fully defined and switchable via configuration.
- UI specification covers layout, responsiveness, accessibility, and state handling.
- Data flows (success, partial, failure) documented end-to-end.
- Business and validation rules documented without unresolved assumptions (ambiguous areas explicitly flagged).
- Error handling, logging, and security concerns documented.
- Dependency map defined with no implicit dependencies.

This LLD is implementation-ready for the Code Generation Agent while remaining within the constraints of the HLD and lldgenerationkb.