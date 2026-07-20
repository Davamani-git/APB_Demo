# Low-Level Design (LLD) – QE-3284 Monthly Spending Summary Dashboard

---

## 1. Application Overview

### 1.1 Epic Identifier
- **Epic ID:** QE-3284
- **Epic Name:** Monthly Spending Summary Dashboard

### 1.2 Purpose
Provide a web-based dashboard for credit card customers to view their monthly spending summary, including:
- Monthly total credit card spend
- Monthly summary KPIs (e.g., total spend, number of transactions, average transaction value)
- Visual representation of monthly spend via summary cards and charts
- Month selection to view a specific month’s summary
- Basic breakdown of spend suitable as an entry point into deeper insights

Scope is strictly limited to **credit card products only**. Non–credit-card products and detailed transaction-level management features (CRUD, disputes, advanced filters, transaction search) are explicitly **out of scope** and must not be implemented or exposed.

### 1.3 Application Type
- **Type:** Single Page Application (SPA)
- **Framework:** AngularJS 1.7.9
- **Pattern:** AngularJS MVC

### 1.4 High-Level Capabilities
- Display a monthly summary dashboard for a selected credit card and month.
- Allow user to change the month and refresh the view.
- Show KPI cards summarizing monthly spend metrics.
- Show charts and a basic breakdown of spending by high-level categories.
- Handle authentication and authorization via existing banking platform.
- Provide robust error handling, logging, and audit for dashboard access.

### 1.5 Out-of-Scope Enforcement
The LLD must ensure implementation **does not**:
- Show non–credit-card products.
- Provide transaction-level CRUD or dispute flows.
- Implement advanced filtering or searching beyond basic month selection.
- Expose transaction-level management features.

---

## 2. Technology Stack

### 2.1 Frontend
- **HTML:** HTML5
- **CSS:** CSS3
- **JavaScript:** ES6-compatible code targeting browsers supported by AngularJS 1.7.9
- **Frameworks/Libraries:**
  - AngularJS 1.7.9
  - Angular Route 1.7.9
  - Angular Animate 1.7.9
  - Angular Sanitize 1.7.9
  - Angular UI Bootstrap 2.5.6
  - Bootstrap 3.4.1 (CSS only)
  - Chart.js 2.9.4

### 2.2 Backend (Contract Only)
The backend implementation is out of scope; however, the frontend will integrate with existing:
- **API Gateway** exposing REST/JSON endpoints.
- **DashboardAPI** – Spending Summary Dashboard API.

### 2.3 Browser Support
- Google Chrome (latest enterprise-supported version)
- Microsoft Edge (latest enterprise-supported version)

### 2.4 Constraints
- No framework upgrades (AngularJS remains 1.7.9).
- No additional JS frameworks may be introduced unless explicitly required by HLD (none are).
- No jQuery or `bootstrap.min.js` usage unless mandated (not required by HLD; must not be included).

---

## 3. Architecture Design

### 3.1 AngularJS MVC & SPA
- **Module:** Single AngularJS application module `app`.
- **Architecture pattern:**
  - Controllers: Coordinate UI behavior, route interactions, and delegate to services.
  - Services: Contain business logic, data aggregation, and REST calls.
  - Factories: Create reusable helper objects.
  - Directives: Encapsulate reusable UI behavior and visualization components.
  - Filters: Provide formatting for dates, currency, percentages.
  - Models: Represent domain data for monthly spend, KPIs, breakdowns, and errors.

### 3.2 Layers in SPA
- **Presentation Layer (Client Layer in HLD):**
  - AngularJS controllers, directives, templates, CSS.
  - Renders monthly summary, KPIs, charts, breakdown.

- **Integration Layer (API / Edge Layer in HLD):**
  - `DashboardApiService` – interacts with `DashboardAPI` via REST.

- **Domain Representation:**
  - Frontend models representing Spending Summary, KPI, Breakdown, Error.

- **Cross-Cutting Frontend Concerns:**
  - `LoggingService` and `NotificationService` for logging and user messages.
  - Configuration-driven environment settings (API base URL, mock mode, timeout, feature flags).

### 3.3 Alignment with HLD Layers
- The SPA interacts only with the **Client Layer** and **API / Edge Layer** as defined in the HLD.
- Domain services (SpendAggService, KPIService, BreakdownService), ETL_Jobs, CC_ReadStore, etc., are represented via REST contract; their internal implementation is **not** coded in this epic.

### 3.4 Constraints from HLD
- Only card-specific, aggregated spending data may be shown.
- Dashboard must act as an **entry point** to deeper insights via navigation links, without implementing deeper analytical features itself.

---

## 4. Repository Structure

```text
src/
  app/
    controllers/
      monthlySummary.controller.js
    services/
      dashboardApi.service.js
      logging.service.js
      notification.service.js
      config.service.js
    factories/
      httpError.factory.js
    directives/
      kpiCard.directive.js
      breakdownChart.directive.js
      breakdownTable.directive.js
      monthSelector.directive.js
    filters/
      currencyFormat.filter.js
      dateFormat.filter.js
      percentageFormat.filter.js
    models/
      monthlySummary.model.js
      kpiSummary.model.js
      breakdownItem.model.js
      error.model.js
    config/
      app.module.js
      app.routes.js
      config.constants.js
      env.config.loader.js
    routes/
      monthlySummary.route.js
  templates/
    monthlySummary/
      monthlySummary.view.html
      _kpiCards.partial.html
      _breakdownChart.partial.html
      _breakdownTable.partial.html
      _monthSelector.partial.html
  assets/
    css/
      app.css
      monthlySummary.css
    js/
      vendor.js
    images/
      breakdown-empty-state.png
      error-state.png
      loading-spinner.gif
    fonts/
      (organization-standard fonts or none if not required)
  mock/
    dashboard/
      monthlySummary.mock.service.js
      monthlySummary.mock.data.json
  data/
    samples/
      monthlySummary.sample.json
index.html
README.md
```

### 4.1 File Responsibilities (Summary)
- `app.module.js`: Angular module declaration and dependency registration.
- `app.routes.js`: Common routing configuration (default route and fallback).
- `monthlySummary.route.js`: Feature-specific route definition for QE-3284.
- `monthlySummary.controller.js`: View coordination logic for the Monthly Spending Summary Dashboard.
- `dashboardApi.service.js`: REST communication with DashboardAPI.
- `monthlySummary.model.js`, `kpiSummary.model.js`, `breakdownItem.model.js`, `error.model.js`: Domain models used by controllers, services, and directives.
- Directives: Render KPI cards, charts, breakdown tables, and month selection control.
- `monthlySummary.view.html` & partials: The visual layout and binding of the dashboard.
- `config.constants.js` & environment loader: Configuration of API base URL, timeout, mock mode, etc.
- `monthlySummary.mock.service.js`: Mock implementation conforming to REST API contract for use when `useMockData=true`.
- `logging.service.js` and `notification.service.js`: Cross-cutting logging and user notification mechanisms.

---

## 5. Application Bootstrap Design

### 5.1 index.html Structure

**Path:** `index.html`

**Purpose:** Host the AngularJS SPA and bootstrap the Monthly Spending Summary Dashboard.

**Key Elements:**
- `<html>` with language attribute (e.g., `lang="en"`).
- `<head>` includes:
  - Meta tags for viewport and charset.
  - CSS links:
    - Bootstrap 3.4.1 CSS (via CDN).
    - Application CSS (`assets/css/app.css`, `assets/css/monthlySummary.css`).
- `<body>` includes:
  - Root element with `ng-app="app"`.
  - `div` container with `ng-view` for routing.

**Script Order:**
1. AngularJS core and libraries (CDN):
   - `angular.min.js` (1.7.9)
   - `angular-route.min.js` (1.7.9)
   - `angular-animate.min.js` (1.7.9)
   - `angular-sanitize.min.js` (1.7.9)
   - `ui-bootstrap-tpls.min.js` (2.5.6)
   - `Chart.min.js` (2.9.4)
2. Application scripts:
   - `assets/js/vendor.js` (if used for bundling library references)
   - `src/app/config/app.module.js`
   - `src/app/config/config.constants.js`
   - `src/app/config/env.config.loader.js`
   - `src/app/config/app.routes.js`
   - `src/app/routes/monthlySummary.route.js`
   - `src/app/models/*.js`
   - `src/app/factories/*.js`
   - `src/app/services/*.js`
   - `src/app/directives/*.js`
   - `src/app/controllers/*.js`

**Angular Bootstrap Requirements:**
- Exactly one module definition: `angular.module("app", ["ngRoute", "ngAnimate", "ngSanitize", "ui.bootstrap"])` in `app.module.js`.
- All other files use `angular.module("app")` to register components.

---

## 6. Module Design

### 6.1 Main Application Module

**File:** `src/app/config/app.module.js`

**Angular Registration:**
- `angular.module("app", ["ngRoute", "ngAnimate", "ngSanitize", "ui.bootstrap"])`

**Responsibilities:**
- Configure the primary AngularJS module dependencies.
- Register any global `run` or `config` blocks if required (e.g., route change logging, mock toggle initialization).

**Dependencies:**
- AngularJS core and ngRoute, ngAnimate, ngSanitize.
- Angular UI Bootstrap.

**Consumers:**
- All controllers, services, directives, filters, models referenced via `angular.module("app")`.

### 6.2 Run/Config Blocks

**Run Block (optional but recommended):**
- Initialize logging context (e.g., correlation IDs for the session).
- Register route change events to log page views.

**Config Block:**
- Configure `$routeProvider` in `app.routes.js`.
- Configure `$httpProvider` interceptors (e.g., for error handling, correlation ID propagation).

---

## 7. Routing Design

### 7.1 Route Definitions

**File:** `src/app/config/app.routes.js`

**Responsibilities:**
- Define default and fallback routes.

**Routes:**
- Default Route: `/monthly-summary` (maps to QE-3284 feature route).
- Fallback: Any unknown route redirects to `/monthly-summary`.

**Angular Registration:**
- Use `$routeProvider` in a config block of the `app` module.

### 7.2 Feature Route – Monthly Summary

**File:** `src/app/routes/monthlySummary.route.js`

**Route Configuration:**
- **Path:** `/monthly-summary`
- **Controller:** `MonthlySummaryController`
- **Controller Alias:** `vm`
- **Template URL:** `templates/monthlySummary/monthlySummary.view.html`

**Optional Route Parameters:**
- `cardId` (if passed via route or querystring from outer shell).
- `month` (if initial month is provided externally).

**Resolve:**
- `initialSummary`: Optionally resolve initial monthly summary using `DashboardApiService`.

### 7.3 Routing Behavior
- On load, navigate to `/monthly-summary`.
- When route is entered, `MonthlySummaryController` initializes month selection and loads data.
- Invalid paths redirect to `/monthly-summary`.

---

## 8. Component Registry

### 8.1 Overview

Each AngularJS component must be documented with:
- Name
- Type
- File path
- Module
- Dependencies
- Consumers

#### Components

1. **Module**
   - Name: `app`
   - Type: Module
   - File: `src/app/config/app.module.js`
   - Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`
   - Consumers: All other Angular components.

2. **Controller**
   - Name: `MonthlySummaryController`
   - Type: Controller
   - File: `src/app/controllers/monthlySummary.controller.js`
   - Module: `app`
   - Dependencies: `$routeParams`, `DashboardApiService`, `NotificationService`, `LoggingService`, `ENV_CONFIG`, `$scope` (only for events if necessary).
   - Consumers: `monthlySummary.view.html`, directives.

3. **Services**
   - `DashboardApiService`
     - File: `src/app/services/dashboardApi.service.js`
     - Dependencies: `$http`, `ENV_CONFIG`, `HttpErrorFactory`, `LoggingService`.
     - Consumers: `MonthlySummaryController`, potentially other controllers.
   - `LoggingService`
     - File: `src/app/services/logging.service.js`
     - Dependencies: `$log`.
     - Consumers: All components that log.
   - `NotificationService`
     - File: `src/app/services/notification.service.js`
     - Dependencies: `ui.bootstrap` (modals/toasts), `$rootScope`.
     - Consumers: Controllers and directives needing user notifications.
   - `ConfigService`
     - File: `src/app/services/config.service.js`
     - Dependencies: `$http`, `config.constants.js`.
     - Consumers: `env.config.loader.js`, possibly `DashboardApiService`.

4. **Factory**
   - Name: `HttpErrorFactory`
   - File: `src/app/factories/httpError.factory.js`
   - Dependencies: None or minimal (can use `ENV_CONFIG` for mapping).
   - Consumers: `DashboardApiService` for translating HTTP errors into `ErrorModel` instances.

5. **Directives**
   - `kpiCard`
     - File: `src/app/directives/kpiCard.directive.js`
     - Purpose: Render a single KPI card with label, value, trend indicator (if any).
   - `breakdownChart`
     - File: `src/app/directives/breakdownChart.directive.js`
     - Purpose: Render a Chart.js visual for category breakdown.
   - `breakdownTable`
     - File: `src/app/directives/breakdownTable.directive.js`
     - Purpose: Render a tabular breakdown of categories.
   - `monthSelector`
     - File: `src/app/directives/monthSelector.directive.js`
     - Purpose: Provide month selection UI and propagate selected month to controller.

6. **Filters**
   - `currencyFormat`
     - File: `src/app/filters/currencyFormat.filter.js`
   - `dateFormat`
     - File: `src/app/filters/dateFormat.filter.js`
   - `percentageFormat`
     - File: `src/app/filters/percentageFormat.filter.js`

7. **Models**
   - `MonthlySummaryModel`
     - File: `src/app/models/monthlySummary.model.js`
   - `KpiSummaryModel`
     - File: `src/app/models/kpiSummary.model.js`
   - `BreakdownItemModel`
     - File: `src/app/models/breakdownItem.model.js`
   - `ErrorModel`
     - File: `src/app/models/error.model.js`

8. **Configuration**
   - `ENV_CONFIG` constant
     - File: `src/app/config/config.constants.js`
   - Environment loader
     - File: `src/app/config/env.config.loader.js`

9. **Mock Service**
   - `MonthlySummaryMockService`
     - File: `src/mock/dashboard/monthlySummary.mock.service.js`
     - Consumers: `MonthlySummaryController` (via injection when `useMockData=true`) or `DashboardApiService` via internal switching.

---

## 9. Controller Design

### 9.1 MonthlySummaryController

**File:** `src/app/controllers/monthlySummary.controller.js`

**Registration:**
- `angular.module("app").controller("MonthlySummaryController", MonthlySummaryController);`

**Dependencies:**
- `$routeParams` – to get `cardId` and initial `month` if provided.
- `DashboardApiService` – for REST calls.
- `NotificationService` – for user messages.
- `LoggingService` – for logging.
- `ENV_CONFIG` – for configuration (e.g., default month, max lookback).
- `$scope` (optional for events; primary usage should be via `vm`).

**ViewModel (`vm`):**
- Properties:
  - `vm.cardId: string` – currently selected card.
  - `vm.month: string` – currently selected month (e.g., `YYYY-MM`).
  - `vm.summary: MonthlySummaryModel` – overall summary.
  - `vm.kpis: KpiSummaryModel[]` – list of KPI cards.
  - `vm.breakdownItems: BreakdownItemModel[]` – list of breakdown entries.
  - `vm.isLoading: boolean` – flag for loading state.
  - `vm.hasError: boolean` – error flag.
  - `vm.error: ErrorModel | null` – error details.
  - `vm.isEmpty: boolean` – flag for empty data state.

**Public Methods:**
- `vm.initialize(): void`
  - Reads `cardId` and `month` from `$routeParams` or defaults from `ENV_CONFIG`.
  - Validates initial month.
  - Calls `vm.loadMonthlySummary()`.
- `vm.onMonthSelected(month: string): void`
  - Validates user-selected month.
  - Updates `vm.month`.
  - Calls `vm.loadMonthlySummary()`.
- `vm.loadMonthlySummary(): void`
  - Sets `vm.isLoading=true`, `vm.hasError=false`.
  - Calls `DashboardApiService.getMonthlySummary(vm.cardId, vm.month)`.
  - Handles promise resolution:
    - On success: maps response to `MonthlySummaryModel`, `KpiSummaryModel[]`, `BreakdownItemModel[]`. Sets `vm.isEmpty` if no data.
    - On error: sets `vm.hasError=true`, `vm.error`, logs via `LoggingService`, and notifies user via `NotificationService`.
  - Ensures `vm.isLoading=false` after response.
- `vm.retry(): void`
  - Retry handler for error state; simply calls `vm.loadMonthlySummary()`.

**Private/Helper Methods:**
- `_mapResponseToViewModel(responseDto): void`
  - Transforms REST response into models used by view.
- `_validateMonth(month: string): boolean`
  - Validates month format and allowed range (e.g., using `ENV_CONFIG.maxLookbackMonths`).

**Inputs:**
- Route params: `cardId`, `month` (optional).
- User interactions: Month selection via `monthSelector` directive.

**Outputs:**
- UI state: KPI cards, charts, breakdown table.
- Error and empty state indicators.
- Logs and metrics via services.

**Business Logic Location:**
- No business logic in controller; all domain logic delegated to `DashboardApiService` and backend. Controller only orchestrates calls and maps DTOs to models.

---

## 10. Service Design

### 10.1 DashboardApiService

**File:** `src/app/services/dashboardApi.service.js`

**Registration:**
- `angular.module("app").service("DashboardApiService", DashboardApiService);`

**Dependencies:**
- `$http` – for HTTP requests.
- `ENV_CONFIG` – contains `apiBaseUrl`, `apiTimeoutMs`, `useMockData`.
- `HttpErrorFactory` – for constructing `ErrorModel` from HTTP errors.
- `LoggingService` – for logging request/response metadata.

**Public Methods:**
- `getMonthlySummary(cardId: string, month: string): Promise<{ summary: MonthlySummaryModel, kpis: KpiSummaryModel[], breakdown: BreakdownItemModel[] }>`
  - Constructs URL: `ENV_CONFIG.apiBaseUrl + "/spend-dashboard/" + cardId + "/months/" + month`.
  - Sets timeout: `ENV_CONFIG.apiTimeoutMs`.
  - Adds auth headers from current session (e.g., token retrieval is performed by an outer integration; this service assumes headers are already configured globally via interceptor).
  - Returns a promise resolving to structured data or rejecting with `ErrorModel`.

**Internal Behavior:**
- If `ENV_CONFIG.useMockData` is true, delegates to `MonthlySummaryMockService.getMonthlySummary(cardId, month)`.
- Validates basic input before making HTTP call (non-empty `cardId`, valid `month` format).
- On successful HTTP response:
  - Maps response JSON to `MonthlySummaryModel`, `KpiSummaryModel[]`, `BreakdownItemModel[]`.
- On error HTTP response:
  - Uses `HttpErrorFactory` to convert HTTP status and payload into `ErrorModel`.
  - Logs error with `LoggingService`.

**REST Endpoints Used:**
- `GET /spend-dashboard/{cardId}/months/{month}`

**Error Handling:**
- Distinguishes between:
  - 400 (Bad Request): invalid parameters.
  - 401 (Unauthorized): missing/invalid auth.
  - 403 (Forbidden): not allowed to view card.
  - 404 (Not Found): no data for card/month.
  - 429 (Too Many Requests): rate limit exceeded.
  - 500 (Internal Server Error): unexpected backend error.
  - 503 (Service Unavailable): downstream unavailable.

### 10.2 LoggingService

**File:** `src/app/services/logging.service.js`

**Registration:**
- `angular.module("app").service("LoggingService", LoggingService);`

**Dependencies:**
- `$log`.

**Public Methods:**
- `info(message: string, context?: object): void`
- `warn(message: string, context?: object): void`
- `error(message: string, context?: object): void`
- `audit(event: string, data?: object): void` (used to log audit-like events in the client; not a replacement for backend audit.)

### 10.3 NotificationService

**File:** `src/app/services/notification.service.js`

**Registration:**
- `angular.module("app").service("NotificationService", NotificationService);`

**Dependencies:**
- `$rootScope`
- UI Bootstrap (for modals/toasts if implemented).

**Public Methods:**
- `showSuccess(message: string): void`
- `showError(message: string): void`
- `showWarning(message: string): void`
- `showInfo(message: string): void`

**Behavior:**
- Emits events on `$rootScope` consumed by a notification directive or component.

### 10.4 ConfigService (Environment Loader)

**File:** `src/app/services/config.service.js`

**Public Methods:**
- `loadEnvConfig(envName: string): Promise<ENV_CONFIG>`

**Consumers:**
- `env.config.loader.js` during bootstrap.

---

## 11. Factory Design

### 11.1 HttpErrorFactory

**File:** `src/app/factories/httpError.factory.js`

**Registration:**
- `angular.module("app").factory("HttpErrorFactory", HttpErrorFactory);`

**Purpose:**
- Convert `$http` error responses into standardized `ErrorModel` instances.

**Dependencies:**
- None (pure factory) or may use `ENV_CONFIG` for messaging.

**Public Methods:**
- `fromHttpResponse(response): ErrorModel`
  - Uses `response.status`, `response.data`, `response.headers()` to populate:
    - `code` (HTTP status or backend error code).
    - `message` (user-friendly message).
    - `correlationId` (from headers or payload).
    - `details` (optional technical details; not displayed to user).

---

## 12. Directive Design

### 12.1 kpiCard Directive

**File:** `src/app/directives/kpiCard.directive.js`

**Registration:**
- `angular.module("app").directive("kpiCard", kpiCard);`

**Scope & Bindings:**
- Isolated scope with bindings:
  - `kpi: "<"` – bound to `KpiSummaryModel` instance.

**Configuration:**
- `restrict: "E"`
- `templateUrl: "templates/monthlySummary/_kpiCards.partial.html"`
- `bindToController: true`
- `controllerAs: "vm"`

**Controller Responsibilities:**
- Expose `kpi` properties (label, value, formatted value, icon).

### 12.2 breakdownChart Directive

**File:** `src/app/directives/breakdownChart.directive.js`

**Scope & Bindings:**
- `items: "<"` – `BreakdownItemModel[]`.

**Configuration:**
- `restrict: "E"`
- `templateUrl: "templates/monthlySummary/_breakdownChart.partial.html"`
- Uses Chart.js 2.9.4 to render chart.

**Behavior:**
- Construct chart datasets from breakdown items.
- Display loading, empty, and error states.

### 12.3 breakdownTable Directive

**File:** `src/app/directives/breakdownTable.directive.js`

**Scope & Bindings:**
- `items: "<"` – `BreakdownItemModel[]`.

**Configuration:**
- `restrict: "E"`
- `templateUrl: "templates/monthlySummary/_breakdownTable.partial.html"`

**Behavior:**
- Render table with category name, total spend, and percentage of total.

### 12.4 monthSelector Directive

**File:** `src/app/directives/monthSelector.directive.js`

**Scope & Bindings:**
- `selectedMonth: "="` – two-way bound to `vm.month`.
- `onChange: "&"` – callback when month is changed.

**Configuration:**
- `restrict: "E"`
- `templateUrl: "templates/monthlySummary/_monthSelector.partial.html"`

**Behavior:**
- Use UI Bootstrap datepicker or custom control to select month (e.g., year-month).
- Perform basic client-side validation of month format.

---

## 13. Filter Design

### 13.1 currencyFormat Filter

**File:** `src/app/filters/currencyFormat.filter.js`

**Purpose:**
- Format numeric values as currency for display in KPI cards and tables.

**Input:**
- `number` or numeric string.

**Output:**
- Formatted string, e.g., `$1,234.56` or locale-specific from `ENV_CONFIG`.

### 13.2 dateFormat Filter

**File:** `src/app/filters/dateFormat.filter.js`

**Purpose:**
- Format month or date values for display.

**Input:**
- ISO date string or `YYYY-MM` month.

**Output:**
- Display string such as `July 2026`.

### 13.3 percentageFormat Filter

**File:** `src/app/filters/percentageFormat.filter.js`

**Purpose:**
- Format ratio values as percentages.

**Input:**
- `number` (0–1 or 0–100, depending on configuration).

**Output:**
- `string` such as `45%`.

---

## 14. Model Design

### 14.1 MonthlySummaryModel

**File:** `src/app/models/monthlySummary.model.js`

**Purpose:**
- Represent overall monthly spending summary for a card and month.

**Properties:**
- `cardId: string` – card identifier (non-sensitive representation).
- `month: string` – month key, `YYYY-MM`.
- `totalSpend: number` – monthly total spend.
- `currency: string` – ISO currency code.
- `statementType: string` – *Ambiguity flagged*: indicates whether month is statement or calendar; requires clarification by backend/HLD.
- `dataFreshness: string` – description of ETL latency or last refresh timestamp.

**Validation Rules:**
- `cardId` required, non-empty.
- `month` required, matches `YYYY-MM` format.
- `totalSpend >= 0`.
- `currency` required, must be valid ISO code.

### 14.2 KpiSummaryModel

**File:** `src/app/models/kpiSummary.model.js`

**Purpose:**
- Represent a single KPI card.

**Properties:**
- `id: string` – unique identifier.
- `label: string` – e.g., `Total Spend`, `Number of Transactions`.
- `value: number` – raw numeric value.
- `formattedValue: string` – preformatted display value (optional; may be derived via filters).
- `icon: string` – icon class.

**Validation Rules:**
- `label` required.
- `value` required; may be `0` or greater.

### 14.3 BreakdownItemModel

**File:** `src/app/models/breakdownItem.model.js`

**Purpose:**
- Represent a breakdown entry in the monthly summary.

**Properties:**
- `categoryId: string` – internal category identifier.
- `categoryName: string` – user-visible category, e.g., `Groceries`, `Travel`.
- `amount: number` – total spend in category.
- `percentageOfTotal: number` – ratio (0–1 or 0–100 as configured).

**Validation Rules:**
- `categoryName` required.
- `amount >= 0`.
- `percentageOfTotal >= 0`.

### 14.4 ErrorModel

**File:** `src/app/models/error.model.js`

**Purpose:**
- Standard representation of an error for client-side handling.

**Properties:**
- `code: string | number` – error code or HTTP status.
- `message: string` – user-readable message.
- `correlationId: string` – correlation identifier from backend.
- `details: string` – optional technical details; not shown to users.

**Validation Rules:**
- `code` required.
- `message` required.

---

## 15. REST API Contract

### 15.1 Endpoint – Get Monthly Summary

**Name:** GetMonthlySummary

**Method:** `GET`

**URL Template:** `/spend-dashboard/{cardId}/months/{month}`

**Path Parameters:**
- `cardId: string` – credit card identifier.
- `month: string` – month key in `YYYY-MM` format.

**Headers:**
- `Authorization: Bearer <token>` – existing banking platform token.
- `X-Correlation-ID: <uuid>` – generated at client or API gateway.

**Query Parameters (optional):**
- None in this epic; advanced filters are out of scope.

**Request Body:**
- None.

**Success Response (200):**
- Content-Type: `application/json`
- Payload shape (logical):
  ```json
  {
    "cardId": "<string>",
    "month": "YYYY-MM",
    "currency": "<ISO currency code>",
    "totalSpend": <number>,
    "dataFreshness": "<string>",
    "kpis": [
      {
        "id": "totalSpend",
        "label": "Total Spend",
        "value": <number>
      },
      {
        "id": "numTransactions",
        "label": "Number of Transactions",
        "value": <integer>
      },
      {
        "id": "avgTransactionValue",
        "label": "Average Transaction Value",
        "value": <number>
      }
    ],
    "breakdown": [
      {
        "categoryId": "groceries",
        "categoryName": "Groceries",
        "amount": <number>,
        "percentageOfTotal": <number>
      }
    ]
  }
  ```

**Error Responses:**
- 400: Invalid month format, invalid cardId.
- 401: Unauthorized.
- 403: Forbidden.
- 404: No data for card/month.
- 429: Rate limit exceeded.
- 500: Internal server error.
- 503: Service unavailable.

**Error Payload (generic):**
```json
{
  "code": "<string>",
  "message": "<user-friendly message>",
  "correlationId": "<uuid>"
}
```

**Timeout & Retry Policy (Client-Side):**
- Timeout is set via `ENV_CONFIG.apiTimeoutMs`.
- No automatic retry from the client; user can trigger retry via the UI button.

---

## 16. Configuration Design

### 16.1 ENV_CONFIG Constant

**File:** `src/app/config/config.constants.js`

**Registration:**
- `angular.module("app").constant("ENV_CONFIG", ENV_CONFIG);`

**Properties:**
- `apiBaseUrl: string` – e.g., `"/api"` or environment-specific base.
- `apiTimeoutMs: number` – e.g., `15000`.
- `useMockData: boolean` – toggles between backend and mock services.
- `maxLookbackMonths: number` – maximum number of months allowed for selection.
- `defaultMonthOffset: number` – e.g., `0` for current month, `-1` for last statement; requires alignment with HLD decision (statement vs calendar).
- `featureFlags: object` – for UI feature toggles.

### 16.2 Environment Files

**Files:**
- `env.default.json`
- `env.dev.json`
- `env.prod.json`

**Path:** `src/app/config/`

**Purpose:**
- Provide environment-specific values for `ENV_CONFIG`.

**Consumers:**
- `env.config.loader.js` and `ConfigService`.

### 16.3 env.config.loader.js

**File:** `src/app/config/env.config.loader.js`

**Responsibility:**
- Load appropriate `env.*.json` based on environment.
- Merge into `ENV_CONFIG` constant before app run.

---

## 17. Mock Implementation Design

### 17.1 MonthlySummaryMockService

**File:** `src/mock/dashboard/monthlySummary.mock.service.js`

**Registration:**
- `angular.module("app").service("MonthlySummaryMockService", MonthlySummaryMockService);`

**Dependencies:**
- `$q`
- `$timeout`
- `ENV_CONFIG`

**Public Methods:**
- `getMonthlySummary(cardId: string, month: string): Promise<{ summary: MonthlySummaryModel, kpis: KpiSummaryModel[], breakdown: BreakdownItemModel[] }>`

**Behavior:**
- Uses `$timeout` to simulate network latency (e.g., 300–1000 ms).
- Loads mock data from `monthlySummary.mock.data.json`.
- Simulates different scenarios based on configuration flags or input:
  - Success: Returns full summary, KPIs, breakdown.
  - Empty: No data for given card/month.
  - Error: Simulated 500 or 503 with `ErrorModel`.
  - Timeout: Delay exceeding `ENV_CONFIG.apiTimeoutMs` (if configured for testing).

**Mock Data File:**

**File:** `src/mock/dashboard/monthlySummary.mock.data.json`

**Sample JSON:**
```json
{
  "cardId": "CARD123",
  "month": "2026-07",
  "currency": "USD",
  "totalSpend": 1234.56,
  "dataFreshness": "ETL completed 2026-07-31T23:00Z",
  "kpis": [
    {"id": "totalSpend", "label": "Total Spend", "value": 1234.56},
    {"id": "numTransactions", "label": "Number of Transactions", "value": 42},
    {"id": "avgTransactionValue", "label": "Average Transaction Value", "value": 29.39}
  ],
  "breakdown": [
    {"categoryId": "groceries", "categoryName": "Groceries", "amount": 345.67, "percentageOfTotal": 28.0},
    {"categoryId": "travel", "categoryName": "Travel", "amount": 456.78, "percentageOfTotal": 37.0},
    {"categoryId": "entertainment", "categoryName": "Entertainment", "amount": 123.45, "percentageOfTotal": 10.0}
  ]
}
```

**Contract Alignment:**
- Mock data must mirror the actual REST payload structure, including field names and types.

### 17.2 Mock Switching

- `DashboardApiService` checks `ENV_CONFIG.useMockData` and routes calls to `MonthlySummaryMockService` when true.
- No changes to controllers are required when switching between production and mock.

---

## 18. UI Specification

### 18.1 Layout Overview

**Template:** `templates/monthlySummary/monthlySummary.view.html`

**Structure:**
- **Header:**
  - Page title: `Monthly Spending Summary`.
  - Subtitle: `Credit Card`.
- **Filter Bar:**
  - Month selector component (`monthSelector` directive).
  - Display of selected card and month.
- **Summary Section:**
  - KPI cards row (3–4 cards).
- **Breakdown Section:**
  - Chart (breakdownChart directive) for visual category breakdown.
  - Table (breakdownTable directive) below chart.
- **States:**
  - Loading: overlay spinner on summary/breakdown sections.
  - Empty: message `No spending data available for the selected month.` with illustration.
  - Error: message and retry button.

**Bootstrap Grid:**
- Container: `.container-fluid` or `.container`.
- Row for header.
- Row for month selector.
- Row for KPI cards (e.g., `.row` with four `.col-md-3` columns).
- Row for chart (`.col-md-12`).
- Row for table (`.col-md-12`).

### 18.2 KPI Cards

- Each card uses `kpiCard` directive.
- Visual style:
  - Background: light panel (e.g., `.panel.panel-default`).
  - Border radius, slight shadow.
  - Icon on left, label and value on right.
- Content:
  - KPIs: Total Spend (currency format), Number of Transactions, Average Transaction Value.

### 18.3 Breakdown Chart

- Uses Chart.js 2.9.4.
- Chart type: Pie or Doughnut chart.
- Data from `BreakdownItemModel[]`.
- Colors chosen from accessible palette (contrast-aware).

### 18.4 Breakdown Table

- Columns:
  - Category
  - Amount
  - Percentage of Total
- Alignment:
  - Category: left-aligned.
  - Amount: right-aligned, currency-formatted.
  - Percentage: right-aligned, percentage-formatted.

### 18.5 Month Selector

- UI Bootstrap dropdown or datepicker adapted for month selection.
- Acceptable format: `YYYY-MM`.
- Validation messages when invalid month selected or out of range.

### 18.6 Responsive Behavior

- On smaller screens:
  - KPI cards stack (e.g., `.col-xs-12` each).
  - Chart resizes fluidly.
  - Table horizontally scrollable if needed.

### 18.7 Accessibility

- All interactive elements are keyboard accessible.
- Focus states visible.
- Text has adequate color contrast.
- ARIA labels on chart and month selector.

### 18.8 Loading, Empty, and Error States

- **Loading:**
  - Show spinner over main content area.
  - Disable month selector to avoid overlapping requests.
- **Empty:**
  - Text: `No spending data available for the selected month.`
  - Card and chart areas show empty illustration.
- **Error:**
  - Text: `Unable to retrieve spending information.`
  - Show correlation ID (masked) in advanced view or logging only.
  - Display Retry button (calls `vm.retry()`).

---

## 19. Data Flow

### 19.1 Primary Dashboard Load (Flow 2)

1. User navigates to `/monthly-summary`.
2. `MonthlySummaryController.initialize()` obtains `cardId` and `month` and validates them.
3. Controller calls `DashboardApiService.getMonthlySummary(cardId, month)`.
4. `DashboardApiService` chooses backend or mock based on `ENV_CONFIG.useMockData`.
5. Service performs HTTP GET or mock call.
6. Response is mapped to `MonthlySummaryModel`, `KpiSummaryModel[]`, `BreakdownItemModel[]`.
7. Controller updates `vm.summary`, `vm.kpis`, `vm.breakdownItems`, `vm.isEmpty`.
8. View renders KPI cards, chart, and table.

### 19.2 Month Selection & Refresh (Flow 3)

1. User selects a new month in `monthSelector` directive.
2. Directive calls `onChange({ month: selectedMonth })`.
3. `MonthlySummaryController.onMonthSelected(selectedMonth)` validates month.
4. If valid, `vm.month` is updated and `vm.loadMonthlySummary()` is called.
5. Steps in primary flow repeat.

### 19.3 Error Flow

1. REST call fails (e.g., 500 or network timeout).
2. `DashboardApiService` constructs `ErrorModel` via `HttpErrorFactory`.
3. Promise rejects; controller sets `vm.hasError=true` and `vm.error`.
4. Controller logs error via `LoggingService.error`.
5. Controller calls `NotificationService.showError()` with a user-friendly message.
6. View shows error panel and Retry button.

---

## 20. Business Rules

### 20.1 In-Scope Business Rules (Frontend Representation)

The actual aggregation logic lives in backend services. Frontend must not override or reinterpret it, but must respect HLD constraints and reflect the results.

1. **Card Scope**
   - Only credit card products are shown.
   - UI and API integration must not query non-card accounts.

2. **Month Selection**
   - Month is represented as `YYYY-MM`.
   - User may select months within `ENV_CONFIG.maxLookbackMonths`.
   - Ambiguity in statement vs calendar month is flagged; frontend must rely on backend and display explanatory text once clarified.

3. **Breakdown Granularity**
   - Only high-level categories are rendered.
   - No transaction-level controls or advanced filters.

4. **Entry Point to Deeper Insights**
   - Links to other analytics modules may be provided (e.g., `View Details`), but no detailed view is implemented in this epic.

---

## 21. Validation Rules

### 21.1 Client-Side Validation

1. **Month Input Validation**
   - Regex for `YYYY-MM`:
     - `^\d{4}-(0[1-9]|1[0-2])$`.
   - If invalid:
     - Do not call API.
     - Show error message: `Please select a valid month.`

2. **Month Range Validation**
   - Ensure selected month is within `ENV_CONFIG.maxLookbackMonths` backward from current month or configured reference.
   - If out of range:
     - Show message: `Selected month is outside the allowed range.`

3. **CardId Presence**
   - Ensure `cardId` is provided by outer shell or route.
   - If missing:
     - Show `No card selected.` and prevent API calls.

### 21.2 Response Validation

- Validate that response JSON includes required fields:
  - `cardId`, `month`, `currency`, `totalSpend`, `kpis`, `breakdown`.
- If missing fields or unexpected types:
  - Construct `ErrorModel` with code `"INVALID_RESPONSE"`.
  - Log error.
  - Show generic error message.

---

## 22. Error Handling

### 22.1 Error Types

- Validation errors (client-side).
- Business errors (e.g., 404 for no data).
- Network/errors from backend (e.g., 500, 503).
- Rate-limits (429).

### 22.2 UI Behavior per Error Type

- **Validation errors:**
  - Show inline messages near month selector.
- **Business errors (404):**
  - Show empty state with appropriate message.
- **Network/server errors:**
  - Show error banner + Retry button.

### 22.3 Logging & Audit

- Use `LoggingService.error` for client-side logging.
- Backend AuditService handles server-side audit.

---

## 23. Logging Design

### 23.1 Client Logging

- On each dashboard load:
  - Log `info` with `cardId` (masked) and `month`.
- On errors:
  - Log `error` with message and correlation ID.

### 23.2 Log Structure

- JSON-like context with keys:
  - `event`, `cardId`, `month`, `correlationId`, `errorCode`.

### 23.3 Privacy

- No PAN or PII values logged.
- Card IDs used are non-sensitive identifiers.

---

## 24. Security Design

### 24.1 Input Sanitization and Output Encoding

- Sanitize user input from month selector (ensure numeric and hyphen only).
- Avoid injecting user input directly into HTML; use Angular bindings.

### 24.2 Authentication & Authorization

- Rely on existing banking SSO and token; SPA never handles credentials directly.
- Authorization enforced by backend; frontend does not attempt to override.

### 24.3 Secure Communication

- All calls to backend use HTTPS.

### 24.4 Sensitive Data Handling

- No card numbers or sensitive PII appear in the UI.
- Card references are masked or use short IDs.

---

## 25. Dependency Map

### 25.1 File-Level Dependencies

- `index.html` → AngularJS libs, Chart.js, `app.module.js`, `config.constants.js`, `env.config.loader.js`, `app.routes.js`, `monthlySummary.route.js`, models, factories, services, directives, controllers.
- `app.routes.js` → `MonthlySummaryController`, `monthlySummary.view.html`.
- `monthlySummary.route.js` → `MonthlySummaryController`, templates.
- `MonthlySummaryController` → `DashboardApiService`, `NotificationService`, `LoggingService`, `ENV_CONFIG`, models.
- `DashboardApiService` → `$http`, `ENV_CONFIG`, `HttpErrorFactory`, `LoggingService`, `MonthlySummaryMockService`.
- `MonthlySummaryMockService` → `$q`, `$timeout`, `ENV_CONFIG`, mock JSON data.
- `kpiCard` directive → `KpiSummaryModel`, `_kpiCards.partial.html`.
- `breakdownChart` directive → `BreakdownItemModel`, `_breakdownChart.partial.html`, Chart.js.
- `breakdownTable` directive → `BreakdownItemModel`, `_breakdownTable.partial.html`.
- `monthSelector` directive → `ENV_CONFIG`, `_monthSelector.partial.html`.

---

## 26. LLD Validation Checklist

### 26.1 Alignment with HLD

- All in-scope items (monthly total spend, KPIs, visual representation, month selection, basic breakdown) have corresponding components and flows.
- Non–credit-card products and transaction-level management functionality are **not** specified.

### 26.2 Compliance with lldgenerationkb Standards

- Document structure follows required sections.
- Technology stack complies with AngularJS 1.7.9 SPA standards.
- Repository structure, component registry, configuration, mock behavior, validation, error handling, logging, and security are fully specified.

### 26.3 Missing / Ambiguous Areas

The following items are flagged but do not prevent LLD generation; they require confirmation by backend/HLD owners and are surfaced as configuration/business-rule sensitivities:

1. **Statement vs Calendar Month**
   - Represented by `statementType` in `MonthlySummaryModel` and `defaultMonthOffset` in `ENV_CONFIG`.
   - Frontend must not assume; behavior is aligned with backend configuration.

2. **Category Taxonomy for Breakdown**
   - Frontend uses category identifiers and names provided by backend; does not derive categories itself.

No quality gate violations identified that would block LLD generation.
