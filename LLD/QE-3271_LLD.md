# Low-Level Design (LLD) – QE-3271 Monthly Spending Summary Dashboard

## 1. Application Overview

### 1.1 Purpose
The QE-3271 Monthly Spending Summary Dashboard is a browser-based Single Page Application (SPA) that provides credit card customers with an aggregated monthly view of their spending. It:
- Computes and displays monthly total credit card spend.
- Presents key performance indicators (KPIs) for the selected month (e.g., total spend, transaction count, average transaction value).
- Provides a basic category-level breakdown of spend as an entry point into deeper insights (implemented in other epics).
- Enables month selection constrained to predefined billing cycles.

The application consumes secure REST APIs exposed via an API Gateway. It strictly excludes:
- Non–credit-card products.
- Detailed transaction management features (disputes, tagging, exports, etc.).

### 1.2 Scope Alignment with HLD
This LLD follows the QE-3271 HLD exactly:
- Client Layer: Web front-end monthly spend dashboard.
- API / Edge Layer: API Gateway and Auth Service.
- Domain Services Layer: Monthly Spending Summary Service (MSS), KPIs & Metrics Calculator (KPI), Basic Spend Breakdown Orchestrator (BRK), Month Selection & Context Manager (MONTHSEL).
- Data Stores Layer: Credit Card Transaction Store (TXDB), Monthly Summary & KPI Store (SUMDB), Configuration & Feature Flags store (CFGDB).
- Integration Layer: Credit Card Core Transaction System (CC_SYS), Customer Profile Service (CUST).
- Cross-cutting: Observability Stack (OBS), Audit Logging Service (AUDIT), Secrets Vault (SEC).

The LLD defines only the client-side application and the contracts with back-end APIs, plus the expected behavior of domain services from a consumer perspective, per lldgenerationkb. No implementation source code is produced.

### 1.3 Out-of-Scope
- Detailed transaction-level UI (lists, filters, exports, disputes).
- Non-credit-card products.
- Back-office views or staff dashboards.
- Changes to upstream CC_SYS and CUST beyond read-only integration.

---

## 2. Technology Stack

### 2.1 Frontend Technologies
- HTML5
- CSS3
- JavaScript (ES6)
- AngularJS 1.7.9
  - `angular.js`
  - `angular-route.js`
  - `angular-animate.js`
  - `angular-sanitize.js`
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only)
- Chart.js 2.9.4

### 2.2 Browser Support
- Google Chrome (latest stable)
- Microsoft Edge (latest stable)

### 2.3 Constraints
- AngularJS version fixed to 1.7.9.
- Bootstrap JS and jQuery are **not** used unless future HLDs explicitly require them (not the case here).
- Chart.js fixed to 2.9.4.

---

## 3. Architecture Design

### 3.1 Architectural Style
- Single Page Application (SPA).
- AngularJS MVC architecture.
- ControllerAs syntax.
- IIFE pattern for module components.
- Dependency Injection throughout.
- REST-based communication with back-end APIs.

### 3.2 Logical Layers (Client-Side View)
- **Presentation Layer**: AngularJS controllers, templates, directives, filters.
- **Domain Interaction Layer**: AngularJS services for MSS, KPI, BRK, MONTHSEL integration.
- **Infrastructure Layer**: Configuration service, environment loader, LoggingService, ErrorHandlingService, Mock services (when `useMockData = true`).

### 3.3 Alignment to HLD Components
Client-side components map to HLD components as follows:
- `MonthlySummaryController` + dashboard templates ↔ WEB Monthly Spend Dashboard.
- `MonthContextService` ↔ MONTHSEL Month Selection & Context Manager (consumer-side).
- `MonthlySummaryService` ↔ MSS Monthly Spending Summary Service (consumer-side).
- `KpiService` ↔ KPI KPIs & Metrics Calculator (consumer-side).
- `BreakdownService` ↔ BRK Basic Spend Breakdown Orchestrator (consumer-side).
- `EnvConfigService` + env JSON ↔ CFGDB configuration consumption (client-side subset).
- `LoggingService`, `ErrorHandlingService` ↔ OBS, AUDIT alignment.

Back-end services remain as per HLD; their implementation is out of scope but their contracts and expected behavior are specified for LLD.

---

## 4. Repository Structure

The repository for the SPA shall contain at least the following structure:

```text
src/
  index.html
  app/
    app.module.js
    app.routes.js

    config/
      config.constants.js
      env.config.service.js

    controllers/
      monthly-summary.controller.js

    services/
      monthly-summary.service.js
      kpi.service.js
      breakdown.service.js
      month-context.service.js
      logging.service.js
      error-handling.service.js
      http-interceptor.service.js

    factories/
      model-factory.js

    directives/
      monthly-summary-card.directive.js
      kpi-card.directive.js
      breakdown-chart.directive.js

    filters/
      currency-format.filter.js
      date-format.filter.js
      percentage.filter.js

    models/
      monthly-summary.model.js
      kpi.model.js
      breakdown.model.js
      error.model.js

    routes/
      monthly-summary.routes.js

  templates/
    monthly-summary.view.html
    components/
      monthly-summary-card.html
      kpi-card.html
      breakdown-chart.html

  assets/
    css/
      app.css
    js/
      chart-config.js
    images/
      icons/
        kpi-total-spend.png
        kpi-transaction-count.png
        kpi-average-spend.png
    fonts/

  mock/
    monthly-summary.mock.json
    kpi.mock.json
    breakdown.mock.json

  data/
    sample-monthly-summary.json
    sample-kpi.json
    sample-breakdown.json

config/
  env.default.json
  env.dev.json
  env.prod.json

README.md
```

Each file below is further specified in the per-component design sections.

---

## 5. Application Bootstrap Design

### 5.1 Angular Bootstrapping
- `src/index.html` declares `ng-app="apbDemo"`.
- Only `app.module.js` defines the root module:

```js
angular.module('apbDemo', [
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'ui.bootstrap'
]);
```

- All other components use `angular.module('apbDemo')` without redefining dependencies.

### 5.2 Config and Run Blocks
- `app.module.js` includes:
  - Config block for:
    - Route interceptor registration.
    - HTTP interceptor registration.
  - Run block for:
    - Initial environment configuration load.
    - Global event handlers (route change, error broadcasting).

### 5.3 Application Initialization Responsibilities
On application load:
1. `index.html` loads framework libraries (AngularJS, Angular Route, Angular Animate, Angular Sanitize, Angular UI Bootstrap, Chart.js) via CDN.
2. `app.module.js` initializes the `apbDemo` module.
3. `config.constants.js` loads static constants (e.g., route names, API endpoint suffixes).
4. `env.config.service.js` asynchronously loads `env.default.json` (and environment-specific JSON if applicable).
5. `app.routes.js` configures `$routeProvider` with the monthly summary route as default.
6. `MonthlySummaryController` initializes, requesting month context and default monthly summary.

---

## 6. Module Design

### 6.1 Root Module: `apbDemo`
- **File**: `src/app/app.module.js`
- **Component Type**: Angular Module
- **Dependencies**: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`.
- **Responsibilities**:
  - Declare the root application module.
  - Wire up config and run blocks.
- **Consumers**: All controllers, services, directives, filters, and routes.

### 6.2 Config Module Elements
- **File**: `src/app/config/config.constants.js`
  - Declares:
    - `APP_ROUTES` constant: route names and paths (e.g., `MONTHLY_SUMMARY_ROUTE = '/monthly-summary'`).
    - `API_ENDPOINTS` constant: relative paths (`/spend/summary`, `/spend/kpis`, `/spend/breakdown`, `/spend/month-context`).
- **File**: `src/app/config/env.config.service.js`
  - Declares `EnvConfigService` providing ENV_CONFIG to other services.

---

## 7. Routing Design

### 7.1 Route Configuration
- **File**: `src/app/app.routes.js`
- **Angular Registration**: Config block on `apbDemo`.
- **Dependencies**: `$routeProvider`, `APP_ROUTES`.

```text
Route: /monthly-summary
  - TemplateUrl: templates/monthly-summary.view.html
  - Controller: MonthlySummaryController
  - ControllerAs: vm
  - Resolve: monthContext (via MonthContextService)
Default Route: /monthly-summary
Invalid routes: redirect to /monthly-summary
```

### 7.2 Route Resolve Behavior
- `monthContext` resolve:
  - Invokes `MonthContextService.getMonthContext()`.
  - Provides list of months and default month to controller.
  - On failure, passes an error model to controller to render error state.

---

## 8. Component Registry

The registry below enumerates all AngularJS components.

### 8.1 Modules
- `apbDemo` (root module).

### 8.2 Controllers
- `MonthlySummaryController`
  - Path: `src/app/controllers/monthly-summary.controller.js`

### 8.3 Services
- `MonthlySummaryService` – path: `src/app/services/monthly-summary.service.js`
- `KpiService` – path: `src/app/services/kpi.service.js`
- `BreakdownService` – path: `src/app/services/breakdown.service.js`
- `MonthContextService` – path: `src/app/services/month-context.service.js`
- `EnvConfigService` – path: `src/app/config/env.config.service.js`
- `LoggingService` – path: `src/app/services/logging.service.js`
- `ErrorHandlingService` – path: `src/app/services/error-handling.service.js`
- `HttpInterceptorService` – path: `src/app/services/http-interceptor.service.js`

### 8.4 Factories
- `ModelFactory` – path: `src/app/factories/model-factory.js`

### 8.5 Directives
- `monthlySummaryCard` – path: `src/app/directives/monthly-summary-card.directive.js`
- `kpiCard` – path: `src/app/directives/kpi-card.directive.js`
- `breakdownChart` – path: `src/app/directives/breakdown-chart.directive.js`

### 8.6 Filters
- `currencyFormat` – path: `src/app/filters/currency-format.filter.js`
- `dateFormat` – path: `src/app/filters/date-format.filter.js`
- `percentage` – path: `src/app/filters/percentage.filter.js`

### 8.7 Models
- `MonthlySummaryModel` – path: `src/app/models/monthly-summary.model.js`
- `KpiModel` – path: `src/app/models/kpi.model.js`
- `BreakdownModel` – path: `src/app/models/breakdown.model.js`
- `ErrorModel` – path: `src/app/models/error.model.js`

### 8.8 Config / Constants / Values
- `APP_ROUTES` constant – path: `src/app/config/config.constants.js`
- `API_ENDPOINTS` constant – path: `src/app/config/config.constants.js`
- `ENV_CONFIG` value (runtime) – provided by `EnvConfigService`.

### 8.9 Interceptors
- `HttpInterceptorService` registered as `$httpProvider.interceptors` entry.

For each component, detailed design is defined below.

---

## 9. Controller Design

### 9.1 MonthlySummaryController
- **File**: `src/app/controllers/monthly-summary.controller.js`
- **Angular Registration**:
  - `angular.module('apbDemo').controller('MonthlySummaryController', MonthlySummaryController);`
- **Dependencies (Injected)**:
  - `$scope` (minimal usage; view-model via `vm`).
  - `MonthContextService`.
  - `MonthlySummaryService`.
  - `KpiService`.
  - `BreakdownService`.
  - `LoggingService`.
  - `ErrorHandlingService`.
  - `$routeParams` (if needed, though primary source is resolve).

- **ViewModel Variables**:
  - `vm.monthContext`: list of selectable months and default selection metadata.
  - `vm.selectedMonth`: currently selected month (YYYY-MM).
  - `vm.summary`: instance of `MonthlySummaryModel`.
  - `vm.kpis`: array/list of `KpiModel`.
  - `vm.breakdown`: instance of `BreakdownModel`.
  - `vm.isLoadingSummary`: boolean.
  - `vm.isLoadingKpis`: boolean.
  - `vm.isLoadingBreakdown`: boolean.
  - `vm.summaryError`: `ErrorModel` or null.
  - `vm.kpiError`: `ErrorModel` or null.
  - `vm.breakdownError`: `ErrorModel` or null.

- **Initialization Logic**:
  - `initialize()`
    - Consumes `monthContext` resolve from route.
    - Sets `vm.monthContext` and default `vm.selectedMonth`.
    - Invokes `loadMonthlySummary()`, `loadKpis()`, `loadBreakdown()` for default month.

- **Public Methods**:
  - `vm.initialize()` – called from `ng-init` or from controller constructor.
  - `vm.onMonthChange(month)` – triggered by UI when user selects a different month.
    - Validates month format.
    - Updates `vm.selectedMonth`.
    - Calls `loadMonthlySummary()`, `loadKpis()`, `loadBreakdown()`.
  - `vm.refresh()` – manual refresh action.
    - Re-fetches summary, KPIs, breakdown for current month.
  - `vm.retrySummary()` – retry in case of summary error.
  - `vm.retryKpis()` – retry in case of KPI error.
  - `vm.retryBreakdown()` – retry in case of breakdown error.
  - `vm.navigateToAnalytics()` – navigates user to deeper insights page (URL provided by configuration; page implementation out-of-scope).

- **Private Methods**:
  - `loadMonthlySummary()`
    - Sets `vm.isLoadingSummary = true`, clears `vm.summaryError`.
    - Calls `MonthlySummaryService.getSummary(vm.selectedMonth)`.
    - On success: maps response to `MonthlySummaryModel`, updates `vm.summary`, sets `vm.isLoadingSummary = false`.
    - On error: uses `ErrorHandlingService` to create `ErrorModel`, sets `vm.summaryError`, sets `vm.isLoadingSummary = false`, logs via `LoggingService`.
  - `loadKpis()`
    - Similar pattern with `KpiService.getKpis(vm.selectedMonth)`.
  - `loadBreakdown()`
    - Similar pattern with `BreakdownService.getBreakdown(vm.selectedMonth)`.

- **Event Handlers**:
  - Uses `$scope.$on('$routeChangeError', ...)` to handle route resolve failures (e.g., month context failure).

- **Navigation Behaviour**:
  - Maintains current route as `/monthly-summary`.
  - May use `$window.location` or `$location.path` to navigate to analytics route defined in configuration (e.g., `/analytics`), but this feature is strictly an entry point.

- **Error Handling & Logging**:
  - Every failure calls `ErrorHandlingService.handleError(error, context)` and logs via `LoggingService.info/warn/error` with correlation IDs.

Inputs / Outputs:
- Inputs: month selection from UI, month context from resolve, service responses.
- Outputs: updates view-model for KPI cards, summary cards, breakdown chart, triggers navigation to deeper insights.

---

## 10. Service Design

### 10.1 MonthlySummaryService
- **File**: `src/app/services/monthly-summary.service.js`
- **Angular Registration**:
  - `angular.module('apbDemo').service('MonthlySummaryService', MonthlySummaryService);`
- **Dependencies**:
  - `$http`.
  - `EnvConfigService`.
  - `ModelFactory`.
  - `LoggingService`.
  - `ErrorHandlingService`.
  - `API_ENDPOINTS`.

- **Public Methods**:
  - `getSummary(month: string): Promise<MonthlySummaryModel>`
    - **Parameters**: `month` in `YYYY-MM` format.
    - **Validation**:
      - Non-null, non-empty.
      - Format matches regex `^\d{4}-\d{2}$`.
      - Month is within allowed range of `monthContext` (enforced at controller-level, revalidated here for safety).
    - **Behavior**:
      - Builds URL: `${EnvConfigService.getApiBaseUrl()}${API_ENDPOINTS.SPEND_SUMMARY}?month=${month}`.
      - Calls `$http.get` with standard headers (Authorization handled by interceptor).
      - On success: validates response JSON shape, maps to `MonthlySummaryModel` via `ModelFactory.createMonthlySummary(response.data)`.
      - On error: rejects with `ErrorModel` from `ErrorHandlingService`.

- **Private Methods**:
  - `buildRequestUrl(month)` – constructs final URL.
  - `validateResponse(data)` – ensures required fields (month, currency, totalSpend, transactionCount, breakdownPointers) exist and types are correct.

- **REST Endpoints Used**:
  - `GET /spend/summary?month={YYYY-MM}` via APIGW.

- **Error Handling**:
  - Distinguishes HTTP status codes as per HLD:
    - 400 – invalid request: return user-friendly error message.
    - 401/403 – auth/permission issues: instruct UI to show access error.
    - 404 – no data for month: treat as valid, but set summary to empty state and show descriptive message.
    - 429 – rate limited: advise retry later.
    - 500 – generic internal error.

### 10.2 KpiService
- **File**: `src/app/services/kpi.service.js`
- **Public Methods**:
  - `getKpis(month: string): Promise<KpiModel[]>`
    - Builds URL: `${EnvConfigService.getApiBaseUrl()}${API_ENDPOINTS.SPEND_KPIS}?month=${month}`.
    - Validates response fields: totalSpend, transactionCount, avgTransactionValue, optional min/max.
    - Maps to `KpiModel[]` via `ModelFactory.createKpiList()`.

- **REST Endpoint**:
  - `GET /spend/kpis?month={YYYY-MM}`.

### 10.3 BreakdownService
- **File**: `src/app/services/breakdown.service.js`
- **Public Methods**:
  - `getBreakdown(month: string): Promise<BreakdownModel>`
    - URL: `${EnvConfigService.getApiBaseUrl()}${API_ENDPOINTS.SPEND_BREAKDOWN}?month=${month}`.
    - Validation: categories list length capped by configuration (e.g., `maxCategories`), each category with `id`, `label`, `amount`, `percentage`.

- **REST Endpoint**:
  - `GET /spend/breakdown?month={YYYY-MM}`.

### 10.4 MonthContextService
- **File**: `src/app/services/month-context.service.js`
- **Public Methods**:
  - `getMonthContext(): Promise<{ months: MonthContextItem[], defaultMonth: string }>`
    - URL: `${EnvConfigService.getApiBaseUrl()}${API_ENDPOINTS.MONTH_CONTEXT}`.
    - `MonthContextItem` includes: `month`, `label`, `isFinal`, `isCurrent`, `billingCycleId`.

- **REST Endpoint**:
  - `GET /spend/month-context`.

### 10.5 EnvConfigService
- **File**: `src/app/config/env.config.service.js`
- **Public Methods**:
  - `loadConfig(envName?: string): Promise<void>` – loads `env.default.json` and overlay env-specific config (`env.dev.json` or `env.prod.json`).
  - `getApiBaseUrl(): string`.
  - `getApiTimeoutMs(): number`.
  - `getMaxLookbackMonths(): number`.
  - `getUseMockData(): boolean`.
  - `getFeatureFlags(): object`.

### 10.6 LoggingService
- **File**: `src/app/services/logging.service.js`
- **Public Methods**:
  - `info(message: string, context?: object)`.
  - `warn(message: string, context?: object)`.
  - `error(message: string, context?: object)`.
- **Behavior**:
  - Logs to browser console in dev.
  - Optionally posts logs to server-side OBS endpoint if configured.

### 10.7 ErrorHandlingService
- **File**: `src/app/services/error-handling.service.js`
- **Public Methods**:
  - `handleError(httpError: any, context: string): ErrorModel`
    - Maps HTTP error to `ErrorModel`: `code`, `message`, `details`, `correlationId`.
  - `createClientValidationError(message: string): ErrorModel`.

### 10.8 HttpInterceptorService
- **File**: `src/app/services/http-interceptor.service.js`
- **Responsibilities**:
  - Attach Authorization headers (token obtained from external auth integration, made available to SPA via secure mechanism).
  - Enforce timeout settings from `EnvConfigService`.
  - Log request/response metrics.
  - Globally handle HTTP errors and route them through `ErrorHandlingService`.

---

## 11. Factory Design

### 11.1 ModelFactory
- **File**: `src/app/factories/model-factory.js`
- **Responsibilities**:
  - Instantiate models from raw JSON responses.
  - Ensure type safety and default values.
- **Public Methods**:
  - `createMonthlySummary(data: any): MonthlySummaryModel`.
  - `createKpiList(data: any[]): KpiModel[]`.
  - `createBreakdown(data: any): BreakdownModel`.
  - `createErrorModel(data: any): ErrorModel`.
- **Dependencies**:
  - None (stateless).

---

## 12. Directive Design

### 12.1 `monthlySummaryCard` Directive
- **File**: `src/app/directives/monthly-summary-card.directive.js`
- **Attributes**:
  - `summary="vm.summary"` – `MonthlySummaryModel`.
- **Scope Bindings**:
  - Isolated scope, one-way binding `<summary`.
- **TemplateUrl**: `templates/components/monthly-summary-card.html`.
- **Controller**: optional simple controller for formatting.
- **Usage Example**:

```html
<monthly-summary-card summary="vm.summary"></monthly-summary-card>
```

### 12.2 `kpiCard` Directive
- **File**: `src/app/directives/kpi-card.directive.js`
- **Attributes**:
  - `kpi="kpi"` – single `KpiModel`.
- **Bindings**:
  - `<kpi`.
- **TemplateUrl**: `templates/components/kpi-card.html`.
- **Usage**:

```html
<div class="row">
  <div class="col-md-4" ng-repeat="kpi in vm.kpis">
    <kpi-card kpi="kpi"></kpi-card>
  </div>
</div>
```

### 12.3 `breakdownChart` Directive
- **File**: `src/app/directives/breakdown-chart.directive.js`
- **Bindings**:
  - `<data` – `BreakdownModel`.
- **TemplateUrl**: `templates/components/breakdown-chart.html`.
- **Responsibilities**:
  - Configure Chart.js charts for category spend breakdown.
  - Handle loading, empty, and error states via attributes.
- **Usage**:

```html
<breakdown-chart data="vm.breakdown"></breakdown-chart>
```

---

## 13. Filter Design

### 13.1 `currencyFormat` Filter
- **Input Type**: number.
- **Output Type**: formatted currency string.
- **Behavior**:
  - Uses configured currency from `MonthlySummaryModel.currency` or ENV_CONFIG.
  - Enforces two decimal places.

### 13.2 `dateFormat` Filter
- **Input Type**: date string or Date.
- **Output Type**: formatted date string (e.g., `Jul 2026`).

### 13.3 `percentage` Filter
- **Input Type**: number (0–1 or 0–100, depending on model convention).
- **Output Type**: string with `%` suffix.

---

## 14. Model Design

### 14.1 MonthlySummaryModel
- **File**: `src/app/models/monthly-summary.model.js`
- **Purpose**: Represent monthly credit card spend summary for a customer.
- **Properties**:
  - `month: string` – `YYYY-MM`, required.
  - `currency: string` – ISO currency code (e.g., `USD`, `INR`), required.
  - `totalSpend: number` – aggregated spending amount, `>= 0`.
  - `transactionCount: number` – number of transactions, `>= 0`.
  - `isFinal: boolean` – indicates completed billing cycle.
  - `isCurrent: boolean` – indicates current month.
  - `breakdownAvailable: boolean` – whether breakdown data exists.
- **Validation Rules**:
  - `month` must match `^\d{4}-\d{2}$`.
  - `totalSpend >= 0`.
  - `transactionCount >= 0`.
- **Sample JSON**:

```json
{
  "month": "2026-07",
  "currency": "INR",
  "totalSpend": 45872,
  "transactionCount": 92,
  "isFinal": true,
  "isCurrent": false,
  "breakdownAvailable": true
}
```

### 14.2 KpiModel
- **File**: `src/app/models/kpi.model.js`
- **Properties**:
  - `id: string` – identifier (e.g., `totalSpend`, `transactionCount`, `averageTransactionValue`).
  - `label: string`.
  - `value: number`.
  - `unit: string` – e.g., `currency`, `count`, `amount`.
  - `formattedValue: string` – set by formatting logic.

### 14.3 BreakdownModel
- **File**: `src/app/models/breakdown.model.js`
- **Properties**:
  - `month: string`.
  - `categories: CategoryBreakdownItem[]`.
- **CategoryBreakdownItem**:
  - `id: string`.
  - `label: string`.
  - `amount: number`.
  - `percentage: number` (0–100).

### 14.4 ErrorModel
- **File**: `src/app/models/error.model.js`
- **Properties**:
  - `code: string | number`.
  - `message: string`.
  - `details: string`.
  - `correlationId: string`.

---

## 15. REST API Contract

For each endpoint, the LLD defines the contract as consumed by the SPA. The back-end honors HLD semantics.

### 15.1 GET /spend/summary
- **URL**: `/spend/summary`.
- **Method**: GET.
- **Query Parameters**:
  - `month` (required) – `YYYY-MM`.
- **Headers**:
  - `Authorization: Bearer <token>`.
- **Success Response (200)**:
  - Body: `MonthlySummaryModel` JSON as defined above.
- **Error Responses**:
  - 400 – invalid month.
  - 401 – unauthorized.
  - 403 – forbidden.
  - 404 – no data for month.
  - 429 – rate limited.
  - 500 – internal error.

### 15.2 GET /spend/kpis
- **URL**: `/spend/kpis`.
- **Method**: GET.
- **Query Parameters**:
  - `month` (required) – `YYYY-MM`.
- **Success Response (200)**:
  - Body: array of `KpiModel` JSON objects.

### 15.3 GET /spend/breakdown
- **URL**: `/spend/breakdown`.
- **Method**: GET.
- **Query Parameters**:
  - `month` (required) – `YYYY-MM`.
- **Success Response (200)**:
  - Body: `BreakdownModel` JSON.

### 15.4 GET /spend/month-context
- **URL**: `/spend/month-context`.
- **Method**: GET.
- **Success Response (200)**:

```json
{
  "months": [
    {
      "month": "2026-06",
      "label": "June 2026",
      "isFinal": true,
      "isCurrent": false,
      "billingCycleId": "2026-06-01"
    }
  ],
  "defaultMonth": "2026-06"
}
```

---

## 16. Configuration Design

### 16.1 ENV_CONFIG Properties
- **File**: `config/env.default.json` (and overrides in `env.dev.json`, `env.prod.json`).

Required properties:
- `apiBaseUrl`: string – base URL for APIGW (e.g., `https://api.example.com`).
- `apiTimeoutMs`: number – timeout for HTTP requests.
- `maxLookbackMonths`: number – months allowed for selection.
- `useMockData`: boolean – toggles between real REST APIs and mock services.
- `featureFlags`: object – e.g., `{ "enableAdvancedKpis": false }`.
- `telemetry`: object – logging and metrics endpoints.
- `analyticsUrl`: string – URL for deeper insights page.

### 16.2 Config.constants.js
- `APP_ROUTES`:
  - `MONTHLY_SUMMARY_ROUTE = '/monthly-summary'`.
- `API_ENDPOINTS`:
  - `SPEND_SUMMARY = '/spend/summary'`.
  - `SPEND_KPIS = '/spend/kpis'`.
  - `SPEND_BREAKDOWN = '/spend/breakdown'`.
  - `MONTH_CONTEXT = '/spend/month-context'`.

No configuration property is hard-coded inside controllers or services; they all consume `EnvConfigService`.

---

## 17. Mock Implementation Design

### 17.1 Mock Mode Behavior
When `ENV_CONFIG.useMockData = true`:
- `MonthlySummaryService`, `KpiService`, `BreakdownService`, `MonthContextService` use mock data instead of calling real REST endpoints.
- Mock data resides in `src/mock/*.json`.
- Mock services simulate latency, errors, and success responses using `$q` and `$timeout`.

### 17.2 Mock Files
- `src/mock/monthly-summary.mock.json`
  - Contains sample `MonthlySummaryModel` payload.
- `src/mock/kpi.mock.json`
  - Contains array of `KpiModel` payloads.
- `src/mock/breakdown.mock.json`
  - Contains `BreakdownModel` payload.

Each mock file mirrors the production contract exactly.

---

## 18. UI Specification

### 18.1 Layout Overview
- Use Bootstrap 3.4.1 responsive grid.
- Page structure (`monthly-summary.view.html`):
  - Header (title: "Monthly Spending Summary").
  - Month selector bar.
  - KPI cards row.
  - Spend summary section.
  - Breakdown chart section.
  - Footer (link to deeper analytics).

### 18.2 Navigation Structure
- Single main route: `/monthly-summary`.
- Link/button: "View detailed analytics" that navigates to `ENV_CONFIG.analyticsUrl`.

### 18.3 Header
- Contains application title and optional customer-friendly subtitle.

### 18.4 Month Selector
- Component: `<select>` or `uib-datepicker` configured for months.
- Binds to `vm.selectedMonth` with `ng-model`.
- Options derived from `vm.monthContext.months`.

### 18.5 KPI Cards
- Layout:
  - Row with columns: `col-md-4` for each KPI.
- Cards:
  - Total Spend (currency formatted).
  - Transaction Count.
  - Average Transaction Value.
- Each KPI rendered via `kpiCard` directive.

### 18.6 Spend Summary Card
- Uses `monthlySummaryCard` directive.
- Displays:
  - Month label.
  - Total spend.
  - Transaction count.
  - Flags: `isFinal`, `isCurrent`.

### 18.7 Breakdown Chart
- Uses `breakdownChart` directive with Chart.js.
- Chart type: Pie chart or Doughnut chart for category distribution.
- Displays "No data" state if `breakdown.categories` is empty.

### 18.8 States
- **Loading State**:
  - Show spinner overlay in each section when `isLoadingSummary`, `isLoadingKpis`, or `isLoadingBreakdown` is true.
- **Empty State**:
  - Summary: "No spending data available for the selected month." when 404 or empty summary.
  - Breakdown: "No breakdown data available." when categories empty.
- **Error State**:
  - Show error banner with `ErrorModel.message` and "Retry" buttons bound to retry methods.

### 18.9 Responsive Behavior
- For smaller screens:
  - KPI cards stack vertically (`col-xs-12`).
  - Chart resizes responsively via Chart.js.
  - Month selector remains accessible at top.

### 18.10 Accessibility
- All interactive elements (selectors, buttons) have accessible labels.
- Keyboard navigation supported via standard HTML controls.

---

## 19. Data Flow

### 19.1 Success Flow (Selected Month)
1. User opens `/monthly-summary`.
2. Route resolve `monthContext` obtains context from `MonthContextService`.
3. `MonthlySummaryController.initialize()` sets `vm.selectedMonth` from `defaultMonth`.
4. `loadMonthlySummary()` calls `MonthlySummaryService.getSummary(month)`.
5. Service calls REST API `/spend/summary` via APIGW.
6. MSS reads SUMDB (and TXDB if needed) and returns summary.
7. Response mapped to `MonthlySummaryModel`, assigned to `vm.summary`.
8. Similar flows for KPIs and breakdown via `KpiService` and `BreakdownService`.
9. UI renders KPI cards, summary card, breakdown chart.

### 19.2 Failure Flow (API Error)
1. User performs same steps, but API returns error (e.g., 500).
2. `MonthlySummaryService` passes error to `ErrorHandlingService`.
3. `ErrorHandlingService` creates `ErrorModel`.
4. `MonthlySummaryController` sets `vm.summaryError`.
5. UI shows error banner and "Retry" button.
6. On retry, `loadMonthlySummary()` is called again.

### 19.3 Mock Flow
1. `ENV_CONFIG.useMockData = true`.
2. Services call mock providers that load JSON files.
3. UI behaves identically from consumer perspective.

---

## 20. Business Rules

### 20.1 Definition of "Spend"
- The summary and KPIs only consider credit card transactions classified as spending.
- Reversals and refunds may be excluded or represented as negative amounts depending on core rules; the HLD flags this as a central rule but does not fully specify, so this LLD notes dependency on core MSS configuration.

### 20.2 Month Selection Rules
- MONTHSEL enforces available months:
  - Typically last N billing cycles, where N is `maxLookbackMonths`.
  - Months can be marked `isFinal` or `isCurrent`.
- UI restricts selection to these months only.

### 20.3 Breakdown Granularity
- Breakdown limited to high-level categories only.
- The number of categories displayed is capped via configuration (e.g., 5–10 top categories).

---

## 21. Validation Rules

### 21.1 Client-Side Validation
- Month input:
  - Required.
  - Format `YYYY-MM`.
  - Must exist in `monthContext.months`.
- Error handling ensures invalid month selection does not trigger API calls.

### 21.2 API Response Validation
- All models validated for required fields and type correctness.
- Missing required fields trigger error handling and show error state.

---

## 22. Error Handling

### 22.1 Categories of Errors
- Validation errors (invalid month).
- Business errors (no data available).
- Network errors (timeout, connectivity).
- Server errors (HTTP 5xx).

### 22.2 Handling Strategy
- Map each error to `ErrorModel` with code and message.
- Show user-friendly message (no stack traces).
- Provide retry options where meaningful.

---

## 23. Logging Design

- `LoggingService` captures:
  - Route transitions.
  - Requests to summary/kpi/breakdown APIs.
  - Errors with correlation IDs.
- In production, logs can be forwarded to back-end OBS endpoint.

---

## 24. Security Design

- All REST calls use HTTPS.
- Auth tokens handled outside SPA (e.g., via secure cookies or JavaScript API); HttpInterceptor attaches tokens when available.
- Input validation for month, configuration, and avoiding injection.
- No PII or card numbers shown in UI.

---

## 25. Dependency Map

### 25.1 Depends On
- Controllers depend on services and directives.
- Services depend on `$http`, `EnvConfigService`, `ModelFactory`, `LoggingService`, `ErrorHandlingService`.
- Directives depend on models and Chart.js.

### 25.2 Consumed By
- Models consumed by services, controllers, directives.
- Filters consumed by templates.

---

## 26. LLD Validation Checklist

- Application Overview: defined.
- Technology Stack: defined.
- Architecture Design: defined.
- Repository Structure: defined.
- Application Bootstrap Design: defined.
- Module Design: defined.
- Routing Design: defined.
- Component Registry: defined.
- Controller Design: defined.
- Service Design: defined.
- Factory Design: defined.
- Directive Design: defined.
- Filter Design: defined.
- Model Design: defined.
- REST API Contract: defined.
- Configuration Design: defined.
- Mock Implementation Design: defined.
- UI Specification: defined.
- Data Flow: defined.
- Business Rules: partially defined, aligned with HLD; note that deep business rules around spend definition remain in backend MSS config.
- Validation Rules: defined.
- Error Handling: defined.
- Logging Design: defined.
- Security Design: defined.
- Dependency Map: defined.

This LLD passes the mandatory structural quality gate defined in lldgenerationkb and provides sufficient detail for a Code Generation Agent to implement the SPA without additional assumptions, while deferring backend business rules to MSS as per HLD.
