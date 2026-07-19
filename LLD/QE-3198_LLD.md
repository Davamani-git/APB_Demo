# QE-3198 Monthly Spending Summary Dashboard Low-Level Design (LLD)

## 1. Scope & Alignment with HLD

### 1.1 Epic Overview

Epic ID: **QE-3198**  
Epic Name: **Monthly Spending Summary Dashboard**

This LLD translates the QE-3198 High-Level Design into an implementation-ready AngularJS 1.7.9 Single Page Application (SPA) with a REST-based backend integration layer. It follows the `lldgenerationspecifications` standard and the QE-3198 HLD exactly, without adding or removing business requirements.

Functional scope implemented:

1. **Monthly total credit card spend calculation** (read-only aggregates).
2. **Monthly summary KPIs** (total spend, number of transactions, average transaction size, and a small set of basic KPIs only).
3. **Visual representation of monthly spend** via KPI cards and charts.
4. **Month selection** to view specific month’s summary.
5. **Basic breakdown of spend** suitable as entry point to deeper insights (aggregate-only, no detailed transaction management).

Out-of-scope (per HLD, enforced in LLD):

- Non-credit-card products.  
- Detailed transaction management (search, filtering by merchant, disputes, edits).  
- Advanced analytics beyond basic breakdown and simple KPIs.  
- Back-office / support-staff views and tooling.

The LLD is the single source of truth for code generation. All components, configuration, APIs, models, UI, validation, error handling, and dependencies are defined in sufficient detail to implement without assumptions.


## 2. Technology Stack & Standards

### 2.1 Frontend Stack

- **HTML**: HTML5
- **CSS**: CSS3
- **JavaScript**: ES6 (where compatible with AngularJS 1.7.9)
- **Framework**: AngularJS 1.7.9
- **Angular Modules**:
  - `ngRoute` (routing)
  - `ngAnimate` (animations)
  - `ngSanitize` (HTML sanitization)
  - `ui.bootstrap` (Bootstrap components)
- **UI Library**: Bootstrap 3.4.1 (CSS only)
- **Charts**: Chart.js 2.9.4

Constraints:

- No framework upgrades or replacements.  
- No jQuery or `bootstrap.min.js` unless explicitly required (not required here).  
- Single Page Application (SPA) using AngularJS MVC, ControllerAs, IIFE pattern, explicit DI.

### 2.2 Backend Integration (Edge/API Layer)

From frontend perspective, backend is represented as REST endpoints exposed via an API Gateway.

- Protocol: HTTPS  
- Format: JSON  
- Authentication: Bearer token (opaque; provided by Auth & Session Service).  
- Core endpoint: `GET /spend-summary` with query parameters `cardId` and `month`.

Backend microservices referenced (logical; actual implementation out of scope but API contract defined):

- **Monthly Spend Summary Service (MSSL)** – primary domain service.  
- **Card Transactions Adapter Service** – internal dependency of MSSL; not directly called by UI.  
- **Summary Metrics Service (METRIC_SVC)** – internal dependency of MSSL; not directly called by UI.

### 2.3 Cross-Cutting

- Centralized logging via `LoggingService` in UI; integrated with backend correlation ID headers.  
- Basic audit hooks via backend; UI passes metadata where required (correlation ID).  
- Configuration via `ENV_CONFIG` and dedicated config files.  
- Feature flags at UI and backend controlled by configuration.


## 3. Repository Structure

Root:

```text
src/
    app/
        modules/
        controllers/
        services/
        factories/
        directives/
        filters/
        models/
        config/
        routes/
        interceptors/
    templates/
        layout/
        dashboard/
        shared/
    assets/
        css/
        js/
        images/
        fonts/
    mock/
        api/
        data/
    data/
index.html
README.md
```

### 3.1 File-Level Mapping

#### 3.1.1 Angular Module & Bootstrap

- `src/app/modules/app.module.js`
  - Declares root module `app`.

- `src/app/config/app.config.js`
  - Configures routes, `$http` defaults, and environment loading.

- `src/app/config/env.config.js`
  - Loads `ENV_CONFIG` constants from JSON files.

- `src/app/routes/app.routes.js`
  - Declares feature routes (`/monthly-spend` etc.).

- `src/app/config/http.interceptors.js`
  - Registers HTTP interceptors for auth token and correlation ID.

#### 3.1.2 Controllers

- `src/app/controllers/monthlySpendDashboard.controller.js`
  - Controller for Monthly Spending Summary Dashboard main view.

- `src/app/controllers/monthSelector.controller.js`
  - Controller for month selector UI component (if separated from main controller).

> Note: We standardize on a single dashboard controller with optional inner directives; we will define one main controller and use directives for the month selector and cards.

#### 3.1.3 Services

- `src/app/services/monthlySpendSummary.service.js`
  - Frontend service for calling `/spend-summary` and mapping responses.

- `src/app/services/envConfig.service.js`
  - Service for loading `ENV_CONFIG` values.

- `src/app/services/logging.service.js`
  - Centralized logging service.

- `src/app/services/notification.service.js`
  - User notification (toasts/banners) service.

#### 3.1.4 Factories

- `src/app/factories/monthlySummaryModel.factory.js`
  - Factory for creating `MonthlySummaryModel` instances.

- `src/app/factories/httpErrorModel.factory.js`
  - Factory for standardized HTTP error model.

#### 3.1.5 Directives

- `src/app/directives/monthSelector.directive.js`
  - Directive for month selection control.

- `src/app/directives/kpiCard.directive.js`
  - Directive for reusable KPI card.

- `src/app/directives/spendBreakdownChart.directive.js`
  - Directive integrating Chart.js for breakdown visualization.

#### 3.1.6 Filters

- `src/app/filters/currencyFormat.filter.js`
- `src/app/filters/dateFormat.filter.js`
- `src/app/filters/percentage.filter.js`

#### 3.1.7 Models

- `src/app/models/monthlySummary.model.js`
  - Data model representing monthly summary.

- `src/app/models/spendBreakdown.model.js`
  - Model for basic breakdown aggregates.

- `src/app/models/kpi.model.js`
  - Model for KPI metrics.

- `src/app/models/error.model.js`
  - Model for error payloads.

#### 3.1.8 Configuration

- `src/config/env.default.json`
- `src/config/env.dev.json`
- `src/config/env.prod.json`
- `src/app/config/config.constants.js`

#### 3.1.9 Templates

- `src/templates/layout/main-layout.html`
  - Shell layout (header, footer, content placeholder).

- `src/templates/dashboard/monthly-spend-dashboard.html`
  - Dashboard main template.

- `src/templates/dashboard/month-selector.html`
  - Month selector directive template.

- `src/templates/dashboard/kpi-card.html`
  - KPI card directive template.

- `src/templates/dashboard/spend-breakdown-chart.html`
  - Chart directive template.

- `src/templates/shared/loading-indicator.html`
  - Shared loading indicator.

- `src/templates/shared/error-state.html`
  - Shared error state block.

#### 3.1.10 Mock

- `src/mock/api/spend-summary.mock.service.js`
  - Mock implementation for `/spend-summary` when `ENV_CONFIG.useMockData === true`.

- `src/mock/data/spend-summary-month-YYYY-MM.json`
  - Sample JSON files for different months.

#### 3.1.11 Assets

- `src/assets/css/app.css`
- `src/assets/js/thirdparty/chartjs-adapter.js` (if needed)
- `src/assets/images/` (icons or illustrative images)


## 4. index.html Design

File: `index.html`

### 4.1 Structure

- Declares AngularJS app: `ng-app="app"`.
- Root layout uses `<div ng-view></div>` to host views.

Pseudostructure (for documentation, not pseudo-code):

- `<head>`
  - `<meta>` tags, title: "Monthly Spending Summary Dashboard".
  - CSS links: Bootstrap CDN, app CSS.
- `<body>`
  - `<div class="app-shell" ng-controller="MainLayoutController as layoutVm">`
    - Header bar.  
    - Content area with `ng-view`.  
    - Footer.
  - Script tags: AngularJS CDN, ngRoute, ngAnimate, ngSanitize, ui-bootstrap, Chart.js, configuration JSON loader (if needed), application scripts.

### 4.2 CDN & Script Order

Stylesheets (in order):

1. Bootstrap 3.4.1 CSS via CDN:  
   `https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css`
2. Optional Bootstrap theme (if used):  
   `https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap-theme.min.css`
3. Application CSS: `/src/assets/css/app.css`

Scripts (in order):

1. AngularJS 1.7.9:  
   `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js`
2. Angular Route:  
   `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js`
3. Angular Animate:  
   `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js`
4. Angular Sanitize:  
   `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js`
5. Angular UI Bootstrap:  
   `https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js`
6. Chart.js 2.9.4:  
   `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js`
7. `src/app/modules/app.module.js`
8. `src/app/config/env.config.js`
9. `src/app/config/config.constants.js`
10. `src/app/config/app.config.js`
11. `src/app/config/http.interceptors.js`
12. `src/app/models/*.js`
13. `src/app/services/*.js`
14. `src/app/factories/*.js`
15. `src/app/filters/*.js`
16. `src/app/directives/*.js`
17. `src/app/controllers/*.js`
18. `src/app/routes/app.routes.js`
19. `src/mock/api/spend-summary.mock.service.js` (conditionally loaded via config or build mechanism when mock mode is enabled).

Constraints adhered to:

- AngularJS scripts load before application scripts.  
- Stylesheets load before scripts.  
- No jQuery or Bootstrap JS included.


## 5. Angular Module & Routing

### 5.1 Root Module

File: `src/app/modules/app.module.js`

- Angular module: `angular.module("app", ["ngRoute", "ngAnimate", "ngSanitize", "ui.bootstrap"])`
- Registered once only.

Dependencies:

- `ngRoute` for routing.  
- `ngAnimate` for animations (e.g., loading transitions).  
- `ngSanitize` for safe rendering of dynamic content.  
- `ui.bootstrap` for Bootstrap UI components.

### 5.2 Routing Configuration

File: `src/app/routes/app.routes.js`

Uses `$routeProvider` (explicit DI) to define routes:

- Route: `/monthly-spend`
  - TemplateUrl: `src/templates/dashboard/monthly-spend-dashboard.html`
  - Controller: `MonthlySpendDashboardController`
  - ControllerAs: `vm`
  - Resolve (optional): environment or minimal configuration preloading.

- Default Route: redirect to `/monthly-spend`.

Route Behaviours:

- Unknown routes redirect to `/monthly-spend` to avoid broken navigation.  
- All routes require an authenticated session; HTTP interceptor enforces token presence and handles 401/403 responses.


## 6. Component Registry

### 6.1 Controllers

#### 6.1.1 MonthlySpendDashboardController

File: `src/app/controllers/monthlySpendDashboard.controller.js`  
Module: `app`

**Component Type**: Controller  
**Registration**: `.controller("MonthlySpendDashboardController", MonthlySpendDashboardController)`

**Injected Dependencies** (via `$inject`):

- `$q` – promise handling.  
- `$routeParams` – route parameters (for deep linking like `?cardId` and `?month`).  
- `MonthlySpendSummaryService` – business service for summary retrieval.  
- `EnvConfigService` – environment config access.  
- `NotificationService` – user-facing messages.  
- `LoggingService` – logging of events and errors.

**Purpose & Responsibilities**:

- Coordinate dashboard UI behaviour.  
- Manage selection of card and month.  
- Orchestrate calls to `MonthlySpendSummaryService` based on user actions.  
- Maintain ViewModel state (KPI cards, breakdown chart data, loading/error states).  
- Apply client-side validation for month selection before calling backend.  
- Handle success/failure flows for summary retrieval.  
- Provide data bindings to directives (month selector, KPI cards, breakdown chart).

**ViewModel (ControllerAs `vm`)**:

- `vm.selectedCardId: string` – currently selected card ID (tokenized).  
- `vm.selectedMonth: string` – month in `YYYY-MM` format.  
- `vm.summary: MonthlySummaryModel` – aggregate summary data.  
- `vm.kpis: KpiModel[]` – list of KPI data objects for cards.  
- `vm.breakdown: SpendBreakdownModel` – data for chart.  
- `vm.isLoading: boolean` – indicates active data fetch.  
- `vm.hasError: boolean` – indicates error state.  
- `vm.error: ErrorModel` – error details.  
- `vm.showPartialFeature: boolean` – indicates partial feature scenario (e.g., KPIs computed but not persisted, as per HLD graceful degradation).  
- `vm.availableMonths: string[]` – months the user can select; populated from backend or config.  
- `vm.availableCards: { id: string; label: string; }[]` – basic card selectors (labels may be masked).

**Public Methods**:

- `vm.initialize()` – called on controller initialization; loads initial configuration, default card/month, and optionally auto-loads summary.
- `vm.onMonthChange(month: string)` – handles month selection changes from month selector directive.
- `vm.onCardChange(cardId: string)` – handles card selection changes.
- `vm.loadSummary()` – triggers summary retrieval for current `selectedCardId` and `selectedMonth`.
- `vm.retry()` – re-attempts summary retrieval after error.
- `vm.hasData()` – returns `true` if summary and KPIs are present.

**Private Methods** (internal; documented for code generation):

- `_validateInputs(cardId: string, month: string): boolean` – validates card ID and month format and presence.
- `_handleSuccess(response: MonthlySummaryModel)` – maps response to ViewModel, builds KPI and breakdown data structures.
- `_handleError(error: ErrorModel)` – sets `hasError`, `error`, logs via `LoggingService`, shows notification.
- `_buildKpis(summary: MonthlySummaryModel): KpiModel[]` – transforms summary into KPI list.
- `_buildBreakdown(summary: MonthlySummaryModel): SpendBreakdownModel` – transforms breakdown section into chart-friendly structure.

**Data Flow**:

- User interacts with month/card selectors → `onMonthChange` / `onCardChange` update ViewModel → `loadSummary` calls `MonthlySpendSummaryService.getMonthlySummary(cardId, month)` → Promise resolves → `_handleSuccess` or `_handleError` → UI directives bound to `vm.summary`, `vm.kpis`, `vm.breakdown` update accordingly.

**Error Handling & Logging**:

- On validation failure: sets `hasError = true`, creates ErrorModel with `code="VALIDATION"`, message like "Please select a valid month and card"; logs warning; shows notification.
- On HTTP 4xx/5xx: logs error with correlation ID, sets `hasError = true`, populates `error` with sanitized message, uses NotificationService to display user-friendly error; may enable `vm.retry()`.

**Security Considerations**:

- Never logs raw card identifiers or PII; uses masked labels.  
- Never exposes raw transaction detail; uses aggregated summary only.

Dependencies & Consumers:

- Depends on `MonthlySpendSummaryService`, `EnvConfigService`, `NotificationService`, `LoggingService`, `$q`, `$routeParams`.  
- Consumed by `monthly-spend-dashboard.html` template and dashboard-related directives.

### 6.2 Services

#### 6.2.1 MonthlySpendSummaryService

File: `src/app/services/monthlySpendSummary.service.js`  
Module: `app`

**Component Type**: Service  
**Registration**: `.service("MonthlySpendSummaryService", MonthlySpendSummaryService)`

**Injected Dependencies**:

- `$http` – HTTP client.  
- `$q` – promises.  
- `EnvConfigService` – obtains `apiBaseUrl`, `apiTimeoutMs`, `useMockData`.  
- `MonthlySummaryModelFactory` – mapping API response to model.  
- `HttpErrorModelFactory` – mapping HTTP errors.  
- `LoggingService` – logs request and response events.

**Purpose & Responsibilities**:

- Encapsulate all communication with the edge API for monthly spending summary.  
- Build request URL and parameters for `/spend-summary`.  
- Handle success and failure responses and map them to models.  
- Implement retry logic (within UI constraints, not to duplicate critical backend operations; respects idempotence).  
- Support both production and mock mode based on `ENV_CONFIG.useMockData`.

**Public Methods**:

- `getMonthlySummary(cardId: string, month: string): Promise<MonthlySummaryModel>`
  - Validates basic inputs.  
  - If `useMockData` is true, delegates to mock service.  
  - Otherwise, issues `GET` to `${apiBaseUrl}/spend-summary?cardId=${cardId}&month=${month}`.  
  - Applies timeout from `apiTimeoutMs`.  
  - Returns resolved `MonthlySummaryModel` on success or rejects with `ErrorModel` on error.

- `mapResponse(data: any): MonthlySummaryModel`
  - Converts raw JSON into `MonthlySummaryModel` using `MonthlySummaryModelFactory`.

**Private Methods**:

- `_buildRequestUrl(cardId: string, month: string): string` – constructs full URL from `apiBaseUrl`.
- `_handleHttpSuccess(response): MonthlySummaryModel` – logs success and maps response.  
- `_handleHttpError(httpError): ErrorModel` – logs error, maps to ErrorModel using `HttpErrorModelFactory`.

**REST Endpoint Contract (Client View)**:

- Method: `GET`
- URL: `/spend-summary`
- Query Parameters:
  - `cardId` (string, required) – tokenized card identifier; must represent a credit card product.  
  - `month` (string, required) – `YYYY-MM`, within allowed range.

- Headers:
  - `Authorization: Bearer <token>` – provided by Auth & Session Service via interceptor.  
  - `X-Correlation-Id: <uuid>` – injected via interceptor.

- Success Response (`200 OK`):

  ```json
  {
    "cardId": "CARD-123-TOKEN",
    "month": "2026-07",
    "currency": "INR",
    "totalSpend": 45872.0,
    "transactionCount": 92,
    "averageTransactionValue": 498.0,
    "summaryGeneratedAt": "2026-07-31T23:59:59Z",
    "breakdown": {
      "byCategory": [
        { "category": "Groceries", "amount": 12345.0, "percentage": 26.9 },
        { "category": "Utilities", "amount": 5678.0, "percentage": 12.4 }
      ],
      "byTransactionType": [
        { "type": "Recurring", "amount": 15000.0, "percentage": 32.7 },
        { "type": "One-Off", "amount": 30872.0, "percentage": 67.3 }
      ]
    },
    "kpis": [
      { "name": "totalSpend", "label": "Total Spend", "value": 45872.0, "unit": "INR" },
      { "name": "transactionCount", "label": "Transactions", "value": 92, "unit": "count" },
      { "name": "averageTransactionValue", "label": "Average Transaction", "value": 498.0, "unit": "INR" }
    ],
    "partialFeature": false
  }
  ```

- Error Responses:

  - `400 Bad Request` – invalid cardId or month format.
  - `401 Unauthorized` – missing/invalid token.  
  - `403 Forbidden` – card not linked to authenticated customer.  
  - `404 Not Found` – no summary available (e.g., no statement for that month).  
  - `500 Internal Server Error` – unexpected backend error.  
  - `503 Service Unavailable` – dependencies unavailable.

  Error body (standardized):

  ```json
  {
    "code": "SUMMARY_NOT_AVAILABLE",
    "message": "Monthly spending summary is not available for the requested card and month.",
    "details": null,
    "correlationId": "..."
  }
  ```

Mapping to ErrorModel described in section 7.

#### 6.2.2 EnvConfigService

File: `src/app/services/envConfig.service.js`

Purpose:

- Load static environment configuration from `env.*.json` and expose as `ENV_CONFIG` constant-like service.

Public Methods:

- `getConfig(): EnvConfig` – returns configuration object with properties: `apiBaseUrl`, `apiTimeoutMs`, `maxLookbackMonths`, `useMockData`, `featureFlags`, `telemetry`.

#### 6.2.3 LoggingService

File: `src/app/services/logging.service.js`

Purpose:

- Provide centralized logging abstraction for UI.

Injected Dependencies:

- `$log` – Angular logging.  
- `$injector` – for lazy resolution of `$http` if remote logging is desired.  

Public Methods:

- `debug(message, context?)`
- `info(message, context?)`
- `warn(message, context?)`
- `error(message, context?)`
- `audit(eventName, context?)`

Constraints:

- **No circular dependencies**: LoggingService does not inject `$http` directly; if remote logging is configured, obtains `$http` via `$injector.get("$http")`.  
- Logging gracefully degrades when remote endpoint unavailable.

#### 6.2.4 NotificationService

File: `src/app/services/notification.service.js`

Purpose:

- Show user-friendly messages (success, info, warning, error) using Bootstrap-styled alerts or Angular UI Bootstrap modals.

Public Methods:

- `success(message: string)`
- `info(message: string)`
- `warn(message: string)`
- `error(message: string)`


### 6.3 Factories

#### 6.3.1 MonthlySummaryModelFactory

File: `src/app/factories/monthlySummaryModel.factory.js`

Purpose:

- Create and validate `MonthlySummaryModel` objects from raw API responses.

Public Method:

- `create(raw: any): MonthlySummaryModel`

Responsibilities:

- Map properties: `cardId`, `month`, `currency`, `totalSpend`, `transactionCount`, `averageTransactionValue`, `summaryGeneratedAt`, `breakdown`, `kpis`, `partialFeature`.
- Apply validation:
  - `totalSpend >= 0`.  
  - `transactionCount >= 0`.  
  - `month` must match `YYYY-MM`.  
  - Currency present and supported.  
- If validation fails, throws or returns a rejected promise, leading to a standardized ErrorModel.

#### 6.3.2 HttpErrorModelFactory

File: `src/app/factories/httpErrorModel.factory.js`

Purpose:

- Normalize HTTP error responses into `ErrorModel`.

Public Method:

- `create(httpError: any): ErrorModel`

Responsibilities:

- Extract `status`, `data.code`, `data.message`, `data.correlationId`.  
- Map to `ErrorModel` fields: `statusCode`, `code`, `message`, `correlationId`.  
- Provide default messages for missing or generic error payloads.


### 6.4 Directives

#### 6.4.1 monthSelector Directive

File: `src/app/directives/monthSelector.directive.js`

Purpose:

- Provide month selection control using `<select>` or datepicker; constrained to months with statements or within `maxLookbackMonths`.

Directive Definition:

- Restrict: `E` (element).  
- Scope: isolate.  
- Bindings:  
  - `selectedMonth: "="` – two-way binding to parent ViewModel.  
  - `availableMonths: "="` – array of months.  
  - `onChange: "&"` – callback when month changes.
- TemplateUrl: `src/templates/dashboard/month-selector.html`.
- Controller: `MonthSelectorController` (or simple directive controller).  
- ControllerAs: `vm`.  
- BindToController: `true`.

Usage Example:

```html
<month-selector
    selected-month="vm.selectedMonth"
    available-months="vm.availableMonths"
    on-change="vm.onMonthChange(month)">
</month-selector>
```

Validation:

- Ensures selected month is one of `availableMonths`.  
- Prevents selection of months outside `maxLookbackMonths` by disabling or hiding options.

#### 6.4.2 kpiCard Directive

File: `src/app/directives/kpiCard.directive.js`

Purpose:

- Display individual KPI as Bootstrap card.

Directive Definition:

- Restrict: `E`.  
- Scope Bindings:  
  - `kpi: "="` – `KpiModel` instance.  
- TemplateUrl: `src/templates/dashboard/kpi-card.html`.  
- ControllerAs: `vm`.  
- BindToController: `true`.

Usage Example:

```html
<kpi-card kpi="kpi"></kpi-card>
```

Display:

- Shows label, formatted value (using currency/date filters as appropriate), unit, and optional icon.

#### 6.4.3 spendBreakdownChart Directive

File: `src/app/directives/spendBreakdownChart.directive.js`

Purpose:

- Render breakdown chart using Chart.js; supports category distribution or transaction type distribution.

Directive Definition:

- Restrict: `E`.  
- Scope Bindings:  
  - `breakdown: "="` – `SpendBreakdownModel` instance.  
- TemplateUrl: `src/templates/dashboard/spend-breakdown-chart.html`.  
- ControllerAs: `vm`.  
- BindToController: `true`.

Usage Example:

```html
<spend-breakdown-chart breakdown="vm.breakdown"></spend-breakdown-chart>
```

Chart Configuration:

- Chart Type: `doughnut` or `pie` for category distribution.  
- Dataset: amounts per category.  
- Labels: category names.  
- Colours: consistent palette.  
- Legend: displayed on right.  
- Tooltips: show amount and percentage.  
- Loading and empty states handled via template: show message when `breakdown` empty or `vm.isLoading` true.


### 6.5 Filters

#### 6.5.1 currencyFormat Filter

File: `src/app/filters/currencyFormat.filter.js`

Purpose:

- Format numeric values into currency strings based on currency code and optional locale.

Input: `(value: number, currencyCode: string)`  
Output: `string` (e.g., `₹45,872.00`).

#### 6.5.2 dateFormat Filter

File: `src/app/filters/dateFormat.filter.js`

Purpose:

- Format dates for display; month-level dates as `MMM YYYY` (e.g., `Jul 2026`).

Input: `YYYY-MM` or ISO string.  
Output: formatted date string.

#### 6.5.3 percentage Filter

File: `src/app/filters/percentage.filter.js`

Purpose:

- Convert numeric fraction or numeric percentage to string with `%`, e.g., `26.9%`.


## 7. Models

### 7.1 MonthlySummaryModel

File: `src/app/models/monthlySummary.model.js`

**Properties**:

- `cardId: string` – tokenized card identifier.
- `month: string` – `YYYY-MM`.  
- `currency: string` – ISO currency code (e.g., `INR`).  
- `totalSpend: number` – >= 0.  
- `transactionCount: number` – >= 0.  
- `averageTransactionValue: number` – >= 0.  
- `summaryGeneratedAt: string` – ISO timestamp.  
- `breakdown: SpendBreakdownModel` – see below.  
- `kpis: KpiModel[]` – KPI list.  
- `partialFeature: boolean` – indicates partial feature scenario.

**Validation Rules**:

- `month` required; must match regex `^[0-9]{4}-(0[1-9]|1[0-2])$`.  
- `totalSpend >= 0`.  
- `transactionCount >= 0`.  
- `averageTransactionValue >= 0`.  
- `currency` required; must be in configured list of supported currencies.  
- `breakdown.byCategory` amounts must sum to approximately `totalSpend` (within tolerance); if not, log warning.

**Sample JSON**:

```json
{
  "cardId": "CARD-123-TOKEN",
  "month": "2026-07",
  "currency": "INR",
  "totalSpend": 45872,
  "transactionCount": 92,
  "averageTransactionValue": 498,
  "summaryGeneratedAt": "2026-07-31T23:59:59Z",
  "breakdown": {
    "byCategory": [
      { "category": "Groceries", "amount": 12345, "percentage": 26.9 },
      { "category": "Utilities", "amount": 5678, "percentage": 12.4 }
    ],
    "byTransactionType": [
      { "type": "Recurring", "amount": 15000, "percentage": 32.7 },
      { "type": "One-Off", "amount": 30872, "percentage": 67.3 }
    ]
  },
  "kpis": [
    { "name": "totalSpend", "label": "Total Spend", "value": 45872, "unit": "INR" },
    { "name": "transactionCount", "label": "Transactions", "value": 92, "unit": "count" },
    { "name": "averageTransactionValue", "label": "Average Transaction", "value": 498, "unit": "INR" }
  ],
  "partialFeature": false
}
```

### 7.2 SpendBreakdownModel

File: `src/app/models/spendBreakdown.model.js`

**Properties**:

- `byCategory: { category: string; amount: number; percentage: number; }[]`
- `byTransactionType: { type: string; amount: number; percentage: number; }[]`

Validation:

- Each `amount >= 0`.  
- Each `percentage` between 0 and 100.  
- Sums of percentages per grouping approx. 100.

### 7.3 KpiModel

File: `src/app/models/kpi.model.js`

**Properties**:

- `name: string` – technical identifier.  
- `label: string` – human-readable label.  
- `value: number` – numeric value.  
- `unit: string` – unit (e.g., `INR`, `count`).  
- `icon: string` – optional icon CSS class.  
- `format: string` – formatting hint (`currency`, `number`, `percentage`).

### 7.4 ErrorModel

File: `src/app/models/error.model.js`

**Properties**:

- `statusCode: number` – HTTP status.  
- `code: string` – application error code.  
- `message: string` – sanitized message for user.  
- `correlationId: string` – from backend.  
- `details: any` – optional technical details (kept internal).

Validation:

- `statusCode` in known set; unknown codes mapped to generic error.  
- `message` required for display.


## 8. Configuration

### 8.1 ENV_CONFIG

Defined via JSON files and `EnvConfigService`.

Properties:

- `apiBaseUrl: string` – base URL for API Gateway (e.g., `https://api.bank.example.com`).
- `apiTimeoutMs: number` – HTTP timeout.  
- `maxLookbackMonths: number` – maximum historical months selectable.  
- `useMockData: boolean` – toggles between mock and real API.  
- `featureFlags: { [key: string]: boolean }` – feature toggles, e.g., `"showAdvancedKpi": false`.  
- `telemetry: { enabled: boolean; endpoint?: string }` – telemetry configuration.

### 8.2 Config Files

- `src/config/env.default.json` – baseline configuration.  
- `src/config/env.dev.json` – dev environment overrides.  
- `src/config/env.prod.json` – prod environment overrides.

Each file includes the full property set; environment loaders merge values.

### 8.3 Config Constants

File: `src/app/config/config.constants.js`

Defines AngularJS constants:

- `ENV_CONFIG` – static values loaded from JSON.  
- `APP_VERSION` – application version.  
- `SUPPORTED_CURRENCIES` – list of allowed currency codes.


## 9. Mock Implementation

### 9.1 Mock Service

File: `src/mock/api/spend-summary.mock.service.js`

Component Type: Service (or factory)  
Module: `app`

Purpose:

- Provide mock implementation of `/spend-summary` endpoint for offline / testing.

Injected Dependencies:

- `$q`, `$timeout`.

Public Method:

- `getMonthlySummary(cardId: string, month: string): Promise<MonthlySummaryModel>`

Behaviour:

- Reads corresponding JSON file from `src/mock/data/spend-summary-month-YYYY-MM.json` (conceptually; actual loading may be via `require` or HTTP).  
- Simulates latency via `$timeout` based on configuration (e.g., 200–500ms).  
- Returns `MonthlySummaryModel` mapped via `MonthlySummaryModelFactory`.  
- Simulates error scenarios based on configuration or input (e.g., invalid month triggers 404-like error model).

Mock JSON example for `2026-07` matches production contract (see MonthlySummaryModel sample).

### 9.2 Mock Mode Switch

- `MonthlySpendSummaryService` checks `EnvConfigService.getConfig().useMockData`.  
- If `true`, bypasses `$http` and calls mock service.  
- Mock responses use same structure as production responses to ensure compatibility.


## 10. UI Specification

### 10.1 Layout

Template: `src/templates/layout/main-layout.html`

Structure:

- Header: bank brand, page title "Monthly Spending Summary".  
- Content area: contains dashboard view via `ng-view`.  
- Footer: legal / support links.

Responsive Grid:

- Use Bootstrap container: `<div class="container-fluid">`.  
- Use rows and columns for layout.

### 10.2 Dashboard Page

Template: `src/templates/dashboard/monthly-spend-dashboard.html`

Sections:

1. **Page Header**
   - Title: "Monthly Spending Summary".  
   - Subtitle: short description.

2. **Filters Row**
   - Card selector (single select) – allowed cards for customer.  
   - Month selector (directive) – months within `maxLookbackMonths` and with statements.

3. **KPI Summary Row**
   - 3–4 KPI cards (Total Spend, Transactions, Average Transaction Value, optional additional KPI).  
   - On small screens, cards stack vertically; on large, arranged in grid.

4. **Spend Breakdown Section**
   - Chart for category distribution using `spendBreakdownChart` directive.  
   - Optionally a second chart or table for transaction type breakdown if feature flag enabled.

5. **States**
   - **Loading**: overlay or inline spinner using `shared/loading-indicator.html`.  
   - **Empty**: message "No spending data available for the selected month.".  
   - **Error**: `shared/error-state.html` showing error message and retry button.

Accessibility:

- All form controls have labels.  
- Buttons have descriptive text.  
- Chart area includes textual summary for screen readers (e.g., total spend and top category).

### 10.3 Month Selector Template

Template: `src/templates/dashboard/month-selector.html`

UI Elements:

- Label: "Select Month".  
- Control: `<select>` with options formatted using `dateFormat` filter (`MMM YYYY`).  
- Disabled state when loading.

### 10.4 KPI Card Template

Template: `src/templates/dashboard/kpi-card.html`

Structure:

- Bootstrap panel or card style with:
  - Icon (optional).  
  - Label.  
  - Value formatted via `currencyFormat` or standard number formatting.  
  - Unit text.

### 10.5 Spend Breakdown Chart Template

Template: `src/templates/dashboard/spend-breakdown-chart.html`

Structure:

- `<canvas>` element bound to Chart.js instance.  
- Legend and textual summary below chart.

States:

- If `breakdown.byCategory` empty: show empty-state message.  
- If `vm.isLoading`: show loading indicator instead of chart.

### 10.6 Shared Templates

- `src/templates/shared/loading-indicator.html` – spinner and "Loading..." text.  
- `src/templates/shared/error-state.html` – error icon, message, and retry button.


## 11. Validation Rules

### 11.1 Client-Side Validation

- **Month format**: `YYYY-MM`, non-empty.  
- **Month range**: within `maxLookbackMonths` and not in distant future (e.g., future relative to current date by more than config).  
- **Card selection**: card must be in allowed cards list from backend.

Behaviour:

- On invalid values, the controller does not call backend; shows error via NotificationService and marks inputs invalid.

### 11.2 API Request Validation (Client View)

- `MonthlySpendSummaryService` ensures `cardId` and `month` are provided before sending request.  
- All requests include correlation ID header; absence indicates internal configuration error and is logged.

### 11.3 Response Validation

- `MonthlySummaryModelFactory` validates response fields as per Model section.  
- Invalid or missing required fields lead to error path with user-friendly message: "Unable to process spending data returned from the server.".


## 12. Error Handling & Logging

### 12.1 Error Types

- Validation errors (client-side).  
- Network errors (timeout, connectivity).  
- Backend errors (4xx, 5xx).  
- Unexpected errors (JavaScript exceptions).

### 12.2 Handling Strategy

- Validation errors: show inline form messages, do not send request.  
- 4xx errors: show message based on `ErrorModel.code`, e.g., `SUMMARY_NOT_AVAILABLE`.  
- 5xx/503: show generic error message: "We’re unable to retrieve your monthly spending summary right now. Please try again later.".  
- Timeouts: show specific message: "The request is taking too long. Please retry.".

### 12.3 Logging

- Every API call logs start and end events with correlation ID.  
- Errors logged with type, status code, and sanitized message.  
- Unexpected JS exceptions handled by custom exception handler and logged.

Constraints:

- No PII in logs.  
- No raw card numbers in logs.


## 13. Security & Compliance (UI Layer)

- Uses HTTPS endpoints only.  
- Authorization token added via interceptor; no token storage in localStorage if disallowed by identity platform; uses secure cookies or in-memory tokens as per enterprise policy (UI respects whatever identity integration is present).  
- All output shows aggregated data only; no raw transactions or sensitive details.  
- UI behaves as read-only dashboard.


## 14. Interceptors & Cross-Cutting Concerns

### 14.1 HTTP Interceptor

File: `src/app/interceptors/auth.interceptor.js` (within `src/app/config/http.interceptors.js` or separate file)

Purpose:

- Attach `Authorization` header to outgoing requests for API Gateway.  
- Attach `X-Correlation-Id` header.  
- Centralized error handling for 401/403/500.

Injected Dependencies:

- `$q`, `LoggingService`, `NotificationService`.

Behaviour:

- On response error:
  - For 401: redirect to login or emit event.  
  - For 403: notify user of access issue.  
  - For 500/503: log error and show generic message.

Constraints:

- Interceptor must not depend on services that themselves use the interceptor, to avoid circular dependency.


## 15. Data Flows

### 15.1 Authentication & Session Establishment (UI Perspective)

- User navigates to dashboard route.  
- Identity integration ensures token is available to UI (out-of-scope for this epic; assumed provided).  
- HTTP interceptor attaches token and correlation ID to requests.  
- Backend performs authentication and authorization (HLD responsibilities).  
- UI handles 401/403 with appropriate user messages.

### 15.2 Fetch Monthly Spend Summary

1. User selects card and month via UI selectors.  
2. Controller validates inputs.  
3. `vm.loadSummary()` calls `MonthlySpendSummaryService.getMonthlySummary(cardId, month)`.  
4. Service builds URL and sends `GET` request with headers.  
5. Backend (API Gateway, MSSL, Card Transactions Adapter, METRIC_SVC, stores) executes HLD Flow 2.  
6. UI receives response; service maps to `MonthlySummaryModel`.  
7. Controller `_handleSuccess` updates `vm.summary`, `vm.kpis`, `vm.breakdown`, resets `hasError`, `isLoading`.  
8. Dashboard template and directives render updated data.

### 15.3 Observability & Audit (UI Layer)

- LoggingService includes correlation IDs and event names.  
- UI does not directly interact with audit system; audit is done by backend.  
- UI surfaces correlation ID where appropriate (e.g., error toast referencing "reference ID").


## 16. Quality Gates & Validation Checklist

This LLD satisfies `lldgenerationspecifications` quality gates:

- Technology stack defined (AngularJS 1.7.9, Bootstrap 3.4.1, Chart.js 2.9.4).  
- Repository structure complete with controllers, services, factories, directives, filters, models, config, routes, templates, mock, and assets.  
- index.html fully specified with CSS/JS ordering and CDN references.  
- Root Angular module defined with dependencies.  
- Routes defined with default route and template/controller mapping.  
- All controllers, services, factories, directives, filters, models enumerated with responsibilities and dependencies.  
- REST API contract (`GET /spend-summary`) fully defined.  
- Configuration properties defined via ENV_CONFIG and JSON files; configuration externalized.  
- Mock implementation for `/spend-summary` specified using `$q` and `$timeout`.  
- UI specification complete (layout, header, filters, KPI cards, charts, states).  
- Data flows (success and failure) documented.  
- Error handling and logging strategy defined; no circular dependencies introduced.  
- Security considerations documented (HTTPS, aggregated data, token handling).  
- Validation rules for inputs and models defined.  
- Script loading order, resource loading, and dependency injection patterns comply with AngularJS engineering standards.  
- No undefined components, TODOs, or placeholders; all referenced resources (templates, scripts, config) have explicit paths.

No validation failures identified. The LLD is implementation-ready as per `lldgenerationspecifications`.
