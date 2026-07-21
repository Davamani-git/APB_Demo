# Low Level Design (LLD) – QE-3420: Monthly Spending Summary Dashboard v4

## 1. Application Overview

### 1.1 Purpose

The **Monthly Spending Summary Dashboard v4** provides a **web-based Single Page Application (SPA)** experience that presents an aggregated monthly view of **credit card spending** for authenticated customers. It:

- Shows **monthly total credit card spend** and **summary KPIs** (e.g., total amount, transaction count, optional derived metrics).
- Presents **visual representations** of spending (KPI cards and charts).
- Allows **month selection** to view a specific month’s summary.
- Provides a **basic breakdown of spend** intended as an entry point into deeper insights implemented by other epics.

It explicitly **excludes**:

- Non‑credit‑card products (only credit card accounts are aggregated).
- Detailed transaction-level management (no dispute, edit, tagging, or fine-grained transaction operations).

### 1.2 Scope Alignment to HLD

The LLD strictly follows QE‑3420 HLD:

- **In Scope**
  - Monthly total credit card spend calculation.
  - Monthly summary KPIs (e.g., total spend, transaction count, derived KPIs where defined).
  - Visual representation via summary cards and charts.
  - Month selection for summary views.
  - Basic breakdown of spend at a **coarse granularity** (entry point to deeper insights).

- **Out of Scope**
  - Non‑credit‑card products.
  - Detailed transaction-level management features, including dispute workflows, editing, tagging, and advanced search.

### 1.3 High-Level Behaviour

User flow:

1. User authenticates and navigates to the **Monthly Spending Summary Dashboard**.
2. The dashboard loads the **default month** (current month or previous month per configuration) and retrieves summary data via the **Spending Summary API**.
3. Dashboard displays:
   - KPI cards (Total Spend, Transaction Count, and configured KPIs).
   - Charts (summary spend over the month, basic breakdown view).
4. User may change the selected month, triggering a **new API request** and UI refresh.
5. Failures (validation, network, API errors) surface as **user-friendly error messages** with **retry actions** and appropriate logging.


## 2. Technology Stack

The application complies with **lldgenerationkb** technology standards.

### 2.1 Frontend Technologies

- **HTML5** – Structure of `index.html` and templates.
- **CSS3** – Styles for layouts, KPI cards, charts, responsive behaviour.
- **JavaScript ES6** – Application logic, AngularJS components.
- **AngularJS 1.7.9** – Core framework for SPA.
- **Angular Route 1.7.9** – Client-side routing.
- **Angular Animate 1.7.9** – Animations for loading and transitions (optional but available).
- **Angular Sanitize 1.7.9** – Secure HTML content handling.
- **Angular UI Bootstrap 2.5.6** – Bootstrap widgets implemented in AngularJS (modals, tooltips, etc.).
- **Bootstrap 3.4.1 (CSS only)** – Responsive grid and UI styling.
- **Chart.js 2.9.4** – Charts for spend visualization.

Constraints:

- No Angular 2+ or alternative frameworks.
- No jQuery or `bootstrap.min.js` unless explicitly required (not required by this HLD).

### 2.2 Backend / Edge / Domain (Contract Perspective)

While implementation is out of scope for this LLD, the contracts must be specified:

- **Spending Summary API** – REST endpoint(s) consumed by the SPA.
- **Monthly Summary Service, KPI Engine, Breakdown Engine** – domain services visible via REST contracts.


## 3. Architecture Design

### 3.1 Client-Side Architecture

The web UI is implemented as an **AngularJS 1.7.9 SPA**:

- **Angular Module**: `app` (root module).
- **Architecture style**: AngularJS MVC with:
  - Controllers for **UI orchestration only**.
  - Services for **business logic and REST communication**.
  - Directives for **reusable UI behaviour** (cards, charts, layout elements).
  - Models for **typed data structures** (MonthlySummary, KPI, BreakdownEntry).
- **Routing** via `ngRoute` with a **single main route** for the monthly summary dashboard, plus optional future routes (not implemented here).

### 3.2 Layers (Frontend Focus)

Logical frontend layers:

1. **Presentation Layer**
   - Templates (HTML partials).
   - Directives (KPI card, breakdown chart, loading and error indicators).

2. **Controller Layer**
   - Coordinates user interactions (month selection, retry, navigation triggers).
   - Updates view models based on service results.

3. **Service Layer**
   - Calls the **Spending Summary API**.
   - Manages business rules for mapping API responses to models.
   - Applies validation to responses and configuration.

4. **Model Layer**
   - Defines data models used in controllers, directives and services.

5. **Configuration Layer**
   - Environment configuration (base URLs, timeouts, feature flags, mock mode).

6. **Mock Layer**
   - Mock REST implementations for the Spending Summary API.

### 3.3 Cross-Cutting Concerns (Frontend)

- **Error Handling** – Standardised error flow at controller and service level.
- **Validation** – Input (month) and response validation in services.
- **Logging** – Client-side logging via `LoggingService` for major events and errors.
- **Security** – Input validation, sanitization of server data, avoidance of unsafe HTML.
- **Observability (Client)** – Logging of key UX events (e.g., summary load, failure) for telemetry.


## 4. Repository Structure

Repository structure for the QE‑3420 Monthly Spending Summary Dashboard as per standards:

```text
src/
    app/
        app.module.js
        app.config.js
        app.routes.js

        controllers/
            monthlySummary.controller.js

        services/
            monthlySummary.service.js
            config.service.js
            logging.service.js

        factories/
            httpError.factory.js

        directives/
            kpiCard.directive.js
            breakdownChart.directive.js
            loadingState.directive.js
            errorState.directive.js

        filters/
            currencyFormat.filter.js
            dateFormat.filter.js
            percentage.filter.js

        models/
            monthlySummary.model.js
            kpi.model.js
            breakdownEntry.model.js
            errorResponse.model.js

        config/
            env.default.json
            env.dev.json
            env.prod.json
            config.constants.js

        routes/
            monthlySummary.route.js

    templates/
        monthlySummary.view.html
        directives/
            kpiCard.template.html
            breakdownChart.template.html
            loadingState.template.html
            errorState.template.html

    assets/
        css/
            main.css
            monthlySummary.css
        js/
            vendor.js (optional aggregator, references CDNs logically only)
        images/
            emptyState.png
            errorState.png
        fonts/
            (standard Bootstrap-compatible fonts if needed)

    mock/
        monthlySummary.mock.service.js
        data/
            monthlySummary.mock.json

    data/
        (reserved for non-mock static data if needed)

index.html
README.md
```

For each file, detailed specification is provided in later sections.


## 5. Application Bootstrap Design

### 5.1 index.html

**Path**: `index.html`

**Purpose**: Entry document for the SPA; bootstraps AngularJS and loads the Monthly Spending Summary Dashboard.

**Key Elements**:

- `<!DOCTYPE html>` with `<html lang="en" ng-app="app">`.
- `<head>` includes:
  - Bootstrap 3.4.1 CSS (via CDN).
  - Application CSS (`assets/css/main.css`, `assets/css/monthlySummary.css`).
- `<body>` includes:
  - Header region (brand, page title placeholder).
  - `<div class="container">` main layout.
  - `<div ng-view></div>` as the AngularJS view outlet.
  - Footer with version and legal text.

**Script Load Order**:

1. AngularJS and dependencies (CDN references logically):
   - `angular.min.js` (1.7.9)
   - `angular-route.min.js`
   - `angular-animate.min.js`
   - `angular-sanitize.min.js`
   - `ui-bootstrap-tpls.min.js`
   - `Chart.min.js` (2.9.4)
2. Application scripts:
   - `src/app/app.module.js`
   - `src/app/app.config.js`
   - `src/app/app.routes.js`
   - `src/app/routes/monthlySummary.route.js`
   - `src/app/models/*.js`
   - `src/app/services/*.js`
   - `src/app/factories/*.js`
   - `src/app/directives/*.js`
   - `src/app/filters/*.js`
   - `src/mock/monthlySummary.mock.service.js` (included but only active when `useMockData` is true).

No jQuery or `bootstrap.min.js` is referenced.

### 5.2 Angular Bootstrap

- AngularJS bootstrapped via `ng-app="app"` on `<html>` tag.
- The root module **`app`** is declared in `app.module.js`.
- Configuration and routing are set up via `app.config.js` and `app.routes.js`.


## 6. Module Design

### 6.1 Root Module – `app`

**File**: `src/app/app.module.js`

**Component Type**: AngularJS module definition.

**Angular Registration**:

- Declares the root module:

  ```js
  angular.module('app', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap'
  ]);
  ```

**Responsibilities**:

- Define the core AngularJS application module.
- Register required dependency modules.

**Dependencies**:

- AngularJS, `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`.

**Consumed By**:

- All controllers, services, directives, filters, factories, configs and routes via `angular.module('app')`.

### 6.2 Config Module – `app.config`

**File**: `src/app/app.config.js`

**Component Type**: `.config` block on `app`.

**Responsibilities**:

- Configure interpolation symbols (if needed).
- Configure `$httpProvider` (e.g., interceptors for error mapping).
- Configure Chart.js global options (non‑visual specifics for responsiveness).

**Dependencies**:

- `$httpProvider`, `ENV_CONFIG` constant (from `config.constants.js`), `httpErrorFactory`.

### 6.3 Routes Module – `app.routes`

**File**: `src/app/app.routes.js`

**Component Type**: `.config` block for routing.

**Responsibilities**:

- Configure `$routeProvider` default route.
- Route to Monthly Summary Dashboard.

**Dependencies**:

- `$routeProvider`, `$locationProvider`.

**Design**:

- Default route `/summary/monthly`.
- Otherwise, redirect all unknown routes to `/summary/monthly`.


## 7. Routing Design

### 7.1 Route: Monthly Summary Dashboard

**File**: `src/app/routes/monthlySummary.route.js`

**Route Definition**:

- URL: `/summary/monthly`.
- Template: `templates/monthlySummary.view.html`.
- Controller: `MonthlySummaryController`.
- ControllerAs: `vm`.
- Resolve:
  - `initialMonth`: resolves the initial month based on `ENV_CONFIG.defaultMonthSelectionRule` (e.g., current month or previous full month).

**Behaviour**:

- When the route is activated:
  - Fetches `initialMonth` from resolve.
  - Calls `MonthlySummaryService.getMonthlySummary(initialMonth)`.
  - Populates `vm` with summary data.

### 7.2 Route Fallback

- Unknown routes redirect to `/summary/monthly` using `$routeProvider.otherwise({ redirectTo: '/summary/monthly' })`.

There are no additional routes for transaction-level management as per the HLD out-of-scope.


## 8. Component Registry

| Name                         | Type        | Module | Path                                      | Depends On                                        | Consumed By                           |
|------------------------------|------------|--------|-------------------------------------------|---------------------------------------------------|----------------------------------------|
| `app`                        | Module      | N/A    | `src/app/app.module.js`                   | AngularJS core, ngRoute, ngAnimate, ngSanitize    | All components                        |
| `MonthlySummaryController`   | Controller  | app    | `src/app/controllers/monthlySummary.controller.js` | `MonthlySummaryService`, `LoggingService`, `$routeParams`, `ENV_CONFIG` | `monthlySummary.view.html` route      |
| `MonthlySummaryService`      | Service     | app    | `src/app/services/monthlySummary.service.js` | `$http`, `ConfigService`, `LoggingService`, `ENV_CONFIG`, `MonthlySummaryModel`, `KpiModel`, `BreakdownEntryModel`, `ErrorResponseModel` | `MonthlySummaryController`, mocks     |
| `ConfigService`              | Service     | app    | `src/app/services/config.service.js`      | `$http`, `ENV_CONFIG`                              | `MonthlySummaryService`, others       |
| `LoggingService`             | Service     | app    | `src/app/services/logging.service.js`     | `$log`, `ENV_CONFIG`                               | Controllers, Services                  |
| `httpErrorFactory`           | Factory     | app    | `src/app/factories/httpError.factory.js`  | None (pure mapping logic)                         | `app.config`, `MonthlySummaryService` |
| `kpiCard`                    | Directive   | app    | `src/app/directives/kpiCard.directive.js` | `KpiModel`                                        | `monthlySummary.view.html`            |
| `breakdownChart`            | Directive   | app    | `src/app/directives/breakdownChart.directive.js` | Chart.js, `BreakdownEntryModel`                   | `monthlySummary.view.html`            |
| `loadingState`               | Directive   | app    | `src/app/directives/loadingState.directive.js` | None                                              | `monthlySummary.view.html`            |
| `errorState`                 | Directive   | app    | `src/app/directives/errorState.directive.js` | `ErrorResponseModel`                             | `monthlySummary.view.html`            |
| `currencyFormat`             | Filter      | app    | `src/app/filters/currencyFormat.filter.js`| `ENV_CONFIG`                                     | Templates                             |
| `dateFormat`                 | Filter      | app    | `src/app/filters/dateFormat.filter.js`    | `ENV_CONFIG`                                     | Templates                             |
| `percentage`                 | Filter      | app    | `src/app/filters/percentage.filter.js`    | None                                              | Templates                             |
| `MonthlySummaryModel`        | Model       | app    | `src/app/models/monthlySummary.model.js`  | None                                              | `MonthlySummaryService`, Controller   |
| `KpiModel`                   | Model       | app    | `src/app/models/kpi.model.js`             | None                                              | `MonthlySummaryService`, Directive    |
| `BreakdownEntryModel`        | Model       | app    | `src/app/models/breakdownEntry.model.js`  | None                                              | `MonthlySummaryService`, Directive    |
| `ErrorResponseModel`         | Model       | app    | `src/app/models/errorResponse.model.js`   | None                                              | `MonthlySummaryService`, `errorState` |
| `ENV_CONFIG`                 | Constant    | app    | `src/app/config/config.constants.js`      | None (defined constant)                           | Config, Services, Filters              |
| `MonthlySummaryMockService`  | Service     | app    | `src/mock/monthlySummary.mock.service.js` | `$q`, `$timeout`, `MonthlySummaryModel` etc.      | `MonthlySummaryService` (when mock)   |

All components are explicitly registered and referenced; no implicit dependencies.


## 9. Controller Design

### 9.1 MonthlySummaryController

**File**: `src/app/controllers/monthlySummary.controller.js`

**Angular Registration**:

```js
angular.module('app').controller('MonthlySummaryController', MonthlySummaryController);
```

**ControllerAs**: `vm`

**Dependencies**:

- `MonthlySummaryService` – Fetches monthly summary data.
- `LoggingService` – Logs user actions and errors.
- `$routeParams` – Accesses route parameters if later extended.
- `ENV_CONFIG` – Reads configuration such as max lookback months.

**Responsibilities**:

- Coordinate UI behaviour for the monthly summary dashboard.
- Manage selected month state.
- Invoke service methods to load data.
- Expose view model properties for templates.
- Handle loading, empty, and error states in the UI.
- Provide retry and navigation actions.

**ViewModel (`vm`) Properties**:

- `vm.selectedMonth` – String `YYYY-MM` representing selected month.
- `vm.summary` – Instance of `MonthlySummaryModel` (or null).
- `vm.kpis` – Array of `KpiModel`.
- `vm.breakdownEntries` – Array of `BreakdownEntryModel`.
- `vm.isLoading` – Boolean.
- `vm.hasError` – Boolean.
- `vm.error` – Instance of `ErrorResponseModel` or `null`.
- `vm.hasData` – Boolean (true if summary data exists and has at least one transaction or nonzero spend).

**Public Methods**:

- `vm.initialize(initialMonth)`
  - **Parameters**: `initialMonth: string` (`YYYY-MM`).
  - **Behaviour**:
    - Validate `initialMonth` using `MonthlySummaryService.validateMonth(initialMonth)`.
    - Set `vm.selectedMonth`.
    - Call `vm.loadMonthlySummary()`.

- `vm.loadMonthlySummary()`
  - **Parameters**: none.
  - **Behaviour**:
    - Set `vm.isLoading = true`, `vm.hasError = false`.
    - Call `MonthlySummaryService.getMonthlySummary(vm.selectedMonth)`.
    - On success:
      - Map response into `vm.summary`, `vm.kpis`, `vm.breakdownEntries`.
      - Set `vm.hasData` based on response.
      - Clear `vm.error`.
      - Set `vm.isLoading = false`.
    - On failure:
      - Set `vm.hasError = true`, `vm.error` with user-friendly message.
      - Set `vm.isLoading = false`.
      - Log via `LoggingService.error`.

- `vm.onMonthChange(newMonth)`
  - **Parameters**: `newMonth: string` (`YYYY-MM`).
  - **Behaviour**:
    - Validate using `MonthlySummaryService.validateMonth(newMonth)`.
    - Update `vm.selectedMonth`.
    - Call `vm.loadMonthlySummary()`.

- `vm.retry()`
  - **Behaviour**:
    - Called from error state directive.
    - Logs retry attempt.
    - Invokes `vm.loadMonthlySummary()`.

- `vm.navigateToDeeperInsights()`
  - **Behaviour**:
    - Trigger navigation action (e.g., `LoggingService.info` and raising event or redirect stub).
    - Actual route for deeper insights is outside the scope; this method simply emits an event or uses a placeholder callback.

**Private Functions (conceptual):**

- `_updateViewModel(summaryResponse)` – internal mapping function inside the controller; uses models to populate view properties.

**Error Handling Behaviour**:

- All errors from the service are transformed into `ErrorResponseModel` and presented via `errorState` directive.
- Controller does not attempt to recover from configuration or validation errors; it exposes them with appropriate messages.


## 10. Service Design

### 10.1 MonthlySummaryService

**File**: `src/app/services/monthlySummary.service.js`

**Angular Registration**:

```js
angular.module('app').service('MonthlySummaryService', MonthlySummaryService);
```

**Dependencies**:

- `$http` – For REST calls to Spending Summary API.
- `ConfigService` – For base URL and environment configuration.
- `LoggingService` – For logging info/warnings/errors.
- `ENV_CONFIG` – For `apiTimeoutMs`, `maxLookbackMonths`, `useMockData`.
- `httpErrorFactory` – Maps HTTP errors to `ErrorResponseModel`.
- `MonthlySummaryModel`, `KpiModel`, `BreakdownEntryModel`, `ErrorResponseModel` – For domain modeling.
- `MonthlySummaryMockService` – Used when `ENV_CONFIG.useMockData === true`.

**Public Methods**:

- `getMonthlySummary(month: string): Promise<MonthlySummaryModel>`
  - **Input**:
    - `month`: string `YYYY-MM`.
  - **Validation**:
    - Calls `validateMonth(month)`.
    - Rejects with `ErrorResponseModel` if invalid.
  - **Behaviour**:
    - If `ENV_CONFIG.useMockData` is true:
      - Delegate to `MonthlySummaryMockService.getMonthlySummary(month)`.
    - Else:
      - Build request URL: `ConfigService.getApiBaseUrl() + '/v4/spending-summary/' + encodeCardId() + '?month=' + month`.
      - Set timeout: `ENV_CONFIG.apiTimeoutMs`.
      - Perform `GET` request.
      - On success:
        - Validate response via `validateResponse(response)`.
        - Map response via `mapResponseToModel(response)`.
        - Resolve with `MonthlySummaryModel`.
      - On error:
        - Convert error using `httpErrorFactory.fromHttpError(error)`.
        - Log via `LoggingService.error`.
        - Reject with `ErrorResponseModel`.

- `validateMonth(month: string): boolean`
  - **Behaviour**:
    - Check format: `YYYY-MM` using regex.
    - Ensure month is not more than `ENV_CONFIG.maxLookbackMonths` in the past.
    - Ensure month is not in the future beyond allowed tolerance (e.g., current month or previous month only, as configured).
    - Returns `true` if valid; `false` otherwise.

- `buildRequest(month: string): { url: string, config: object }`
  - Internal public (used for testability).

**Private Methods (conceptual)**:

- `mapResponseToModel(response)`
  - Maps API JSON fields to `MonthlySummaryModel`, `KpiModel[]`, `BreakdownEntryModel[]`.
  - Ensures all required fields exist.

- `validateResponse(response)`
  - Ensures presence and types of fields:
    - `month` – string.
    - `cardId` – string (masked or hashed, not exposed to UI directly where not needed).
    - `totalSpend` – number >= 0.
    - `transactionCount` – integer >= 0.
    - `currency` – string.
    - `kpis` – array objects with `id`, `label`, `value`, `type`.
    - `breakdown` – array objects with `dimension`, `label`, `amount`, `percentage`.

### 10.2 ConfigService

**File**: `src/app/services/config.service.js`

**Responsibilities**:

- Provide runtime configuration values.

**Public Methods**:

- `getApiBaseUrl(): string` – Returns `ENV_CONFIG.apiBaseUrl`.
- `getFeatureFlags(): object` – Returns `ENV_CONFIG.featureFlags`.
- `getTelemetryConfig(): object` – Returns `ENV_CONFIG.telemetry`.

### 10.3 LoggingService

**File**: `src/app/services/logging.service.js`

**Public Methods**:

- `info(message: string, context?: object)`.
- `warn(message: string, context?: object)`.
- `error(message: string, context?: object)`.

Logs via `$log` or external telemetry but ensures no sensitive data is included.


## 11. Factory Design

### 11.1 httpErrorFactory

**File**: `src/app/factories/httpError.factory.js`

**Responsibilities**:

- Map HTTP errors to `ErrorResponseModel` instances.

**Public Methods**:

- `fromHttpError(httpError: object): ErrorResponseModel`
  - Input fields include `status`, `data`, `config`, `headers`.
  - Map to error categories:
    - Validation error (400).
    - Authentication/authorization error (401/403).
    - Not found (404).
    - Rate limit (429).
    - Server error (5xx).
    - Timeout/Network errors.

Factory is stateless and has no side effects.


## 12. Directive Design

### 12.1 kpiCard Directive

**File**: `src/app/directives/kpiCard.directive.js`

**Angular Registration**:

```js
angular.module('app').directive('kpiCard', kpiCardDirective);
```

**Configuration**:

- `restrict: 'E'` (Element directive).
- `scope` (isolate):
  - `kpi: '<'` – One-way binding to a `KpiModel`.
- `bindToController: true`.
- `controller: 'KpiCardController'` (if internal controller is needed for formatting).
- `controllerAs: 'vm'`.
- `templateUrl: 'templates/directives/kpiCard.template.html'`.

**Purpose**:

- Render a KPI card with label, value, formatted appropriately (currency, percentage, etc.).

**Usage Example**:

```html
<kpi-card kpi="kpi"></kpi-card>
```

### 12.2 breakdownChart Directive

**File**: `src/app/directives/breakdownChart.directive.js`

**Configuration**:

- `restrict: 'E'`.
- `scope`:
  - `entries: '<'` – One-way binding to `BreakdownEntryModel[]`.
  - `chartType: '@'` – String, e.g. `doughnut` or `bar`.
- `bindToController: true`.
- `controllerAs: 'vm'`.
- `templateUrl: 'templates/directives/breakdownChart.template.html'`.

**Behaviour**:

- Uses Chart.js 2.9.4 to render a chart.
- Configures labels from `entries[].label`.
- Configures dataset values from `entries[].amount`.
- Displays percentages and tooltips per entry.
- Responds to resize events for responsive charts.

**Usage Example**:

```html
<breakdown-chart
    entries="vm.breakdownEntries"
    chart-type="doughnut">
</breakdown-chart>
```

### 12.3 loadingState Directive

**File**: `src/app/directives/loadingState.directive.js`

**Configuration**:

- `restrict: 'E'`.
- `scope`:
  - `isLoading: '<'`.
- `templateUrl: 'templates/directives/loadingState.template.html'`.

**Behaviour**:

- When `isLoading` is true, shows a spinner and message: `"Loading monthly summary..."`.
- Disables relevant controls via CSS where embedded.

### 12.4 errorState Directive

**File**: `src/app/directives/errorState.directive.js`

**Configuration**:

- `restrict: 'E'`.
- `scope`:
  - `error: '<'` – `ErrorResponseModel`.
  - `onRetry: '&'` – callback for retry.
- `templateUrl: 'templates/directives/errorState.template.html'`.

**Behaviour**:

- Shows friendly message from `error.userMessage`.
- Provides a **Retry** button that calls `onRetry()`.

**Usage Example**:

```html
<error-state
    error="vm.error"
    on-retry="vm.retry()">
</error-state>
```


## 13. Filter Design

### 13.1 currencyFormat Filter

**File**: `src/app/filters/currencyFormat.filter.js`

**Purpose**:

- Format numeric values as currency with symbol and decimals according to `ENV_CONFIG.currency` and `ENV_CONFIG.currencyFormat`.

**Input**:

- Number (total spend, KPI value).

**Output**:

- String (e.g., `₹45,872.00` or `$45,872.00`).

### 13.2 dateFormat Filter

**File**: `src/app/filters/dateFormat.filter.js`

**Purpose**:

- Format month values (e.g., `2026-07`) to user-friendly representation (e.g., `July 2026`).

### 13.3 percentage Filter

**File**: `src/app/filters/percentage.filter.js`

**Purpose**:

- Convert decimal to percentage string (e.g., `0.25` -> `25%`).


## 14. Model Design

### 14.1 MonthlySummaryModel

**File**: `src/app/models/monthlySummary.model.js`

**Purpose**:

- Represent the monthly summary domain data for one credit card account and month.

**Properties**:

- `month: string` – `YYYY-MM`, required.
- `cardId: string` – masked or hashed ID (may be used for logging and correlation, not necessarily displayed).
- `totalSpend: number` – >= 0, required.
- `transactionCount: number` – integer >= 0, required.
- `currency: string` – e.g., `INR`, `USD`, required.
- `kpis: KpiModel[]` – additional KPIs.
- `breakdownEntries: BreakdownEntryModel[]` – high-level breakdown entries.

**Validation Rules**:

- `month` must match `YYYY-MM` format.
- `totalSpend >= 0`.
- `transactionCount >= 0`.
- `currency` must be a supported currency (from configuration).

**Sample JSON**:

```json
{
  "month": "2026-07",
  "cardId": "CARD-XXXX-1234",
  "totalSpend": 45872,
  "transactionCount": 92,
  "currency": "INR",
  "kpis": [
    {
      "id": "avg_txn_value",
      "label": "Average Transaction Value",
      "value": 498,
      "type": "currency"
    }
  ],
  "breakdownEntries": [
    {
      "dimension": "broadCategory",
      "label": "Dining",
      "amount": 10240,
      "percentage": 0.2232
    },
    {
      "dimension": "broadCategory",
      "label": "Travel",
      "amount": 18900,
      "percentage": 0.4122
    }
  ]
}
```

### 14.2 KpiModel

**File**: `src/app/models/kpi.model.js`

**Properties**:

- `id: string` – identifier (e.g., `total_spend`, `txn_count`, `avg_txn_value`).
- `label: string` – display label.
- `value: number` – numeric value.
- `type: string` – `"currency" | "count" | "percentage" | "generic"`.

### 14.3 BreakdownEntryModel

**File**: `src/app/models/breakdownEntry.model.js`

**Properties**:

- `dimension: string` – e.g., `"broadCategory"`, `"channel"`, `"region"`.
- `label: string` – display label.
- `amount: number` – numeric spend amount.
- `percentage: number` – 0.0–1.0 fraction.

### 14.4 ErrorResponseModel

**File**: `src/app/models/errorResponse.model.js`

**Properties**:

- `code: string` – e.g., `"BAD_REQUEST"`, `"UNAUTHORIZED"`, `"NOT_FOUND"`, `"SERVER_ERROR"`, `"TIMEOUT"`, `"NETWORK_ERROR"`.
- `httpStatus: number` – associated HTTP status if applicable.
- `userMessage: string` – user-facing message.
- `technicalMessage: string` – technical log-level detail (not shown to user).
- `correlationId: string` – optional tracing ID.


## 15. REST API Contract

### 15.1 GET /v4/spending-summary/{cardId}

**Method**: `GET`

**URL**: `/v4/spending-summary/{cardId}?month=YYYY-MM`

**Headers**:

- `Authorization: Bearer <access_token>` – validated via API_GW and AUTH_SVC.
- `Accept: application/json`.

**Authentication & Authorization**:

- Token required; maps to authenticated user.
- API ensures `cardId` belongs to the requesting user.

**Query Parameters**:

- `month: string` – required, `YYYY-MM`.

**Path Parameters**:

- `cardId: string` – required.

**Request Body**:

- None.

**Success Response (200)**:

- Body JSON matching `MonthlySummaryModel` plus server-managed fields:

```json
{
  "month": "2026-07",
  "cardId": "CARD-XXXX-1234",
  "totalSpend": 45872,
  "transactionCount": 92,
  "currency": "INR",
  "kpis": [
    {
      "id": "total_spend",
      "label": "Total Spend",
      "value": 45872,
      "type": "currency"
    },
    {
      "id": "txn_count",
      "label": "Transactions",
      "value": 92,
      "type": "count"
    }
  ],
  "breakdownEntries": [
    {
      "dimension": "broadCategory",
      "label": "Dining",
      "amount": 10240,
      "percentage": 0.2232
    }
  ]
}
```

**Error Responses**:

- 400 – `BAD_REQUEST` (invalid `month`, invalid `cardId` format).
- 401 – `UNAUTHORIZED` (missing/invalid token).
- 403 – `FORBIDDEN` (card not owned by user or product not credit card).
- 404 – `NOT_FOUND` (no summary for cardId/month).
- 429 – `TOO_MANY_REQUESTS` (rate limiting).
- 500 – `SERVER_ERROR` (unexpected backend error).
- 504 – `TIMEOUT` (upstream services timed out).

Error body (abstract):

```json
{
  "code": "BAD_REQUEST",
  "httpStatus": 400,
  "userMessage": "Unable to load monthly summary. Please check your selection.",
  "technicalMessage": "Month parameter out of allowed range",
  "correlationId": "abc123"
}
```

**Timeout & Retry Policy (Client-side)**:

- Timeout (client): `ENV_CONFIG.apiTimeoutMs`.
- Retry: Controller provides `retry()` triggered by user; no automatic retry loops.


## 16. Configuration Design

### 16.1 ENV_CONFIG Constant

**File**: `src/app/config/config.constants.js`

**Definition**:

```js
angular.module('app').constant('ENV_CONFIG', {
  apiBaseUrl: 'https://api.example.com',
  apiTimeoutMs: 8000,
  maxLookbackMonths: 12,
  useMockData: false,
  defaultMonthSelectionRule: 'current', // 'current' or 'previous'
  currency: 'INR',
  currencyFormat: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  },
  featureFlags: {
    showAverageTransactionValue: true,
    showBreakdownChart: true
  },
  telemetry: {
    enabled: true,
    samplingRate: 0.1
  }
});
```

**Consumers**:

- `MonthlySummaryService` – `apiTimeoutMs`, `maxLookbackMonths`, `useMockData`.
- `ConfigService` – `apiBaseUrl`, `featureFlags`, `telemetry`.
- `MonthlySummaryController` – `defaultMonthSelectionRule`.
- Filters – `currency`, `currencyFormat`.
- Logging – `telemetry` settings if integrated.

### 16.2 Environment Files

- `src/app/config/env.default.json`
- `src/app/config/env.dev.json`
- `src/app/config/env.prod.json`

Each file provides environment-specific overrides of `ENV_CONFIG` base values (e.g., `apiBaseUrl`, `useMockData`). Behaviour:

- `env.default.json` – base configuration for local development.
- `env.dev.json` – dev environment configuration, often `useMockData: true`.
- `env.prod.json` – production configuration, `useMockData: false`, real `apiBaseUrl`.

No configuration is hardcoded in controllers/services except via `ENV_CONFIG` and `ConfigService`.


## 17. Mock Implementation Design

### 17.1 MonthlySummaryMockService

**File**: `src/mock/monthlySummary.mock.service.js`

**Angular Registration**:

```js
angular.module('app').service('MonthlySummaryMockService', MonthlySummaryMockService);
```

**Dependencies**:

- `$q` – Promises.
- `$timeout` – Simulated latency.
- `MonthlySummaryModel`, `KpiModel`, `BreakdownEntryModel`, `ErrorResponseModel`.

**Behaviour**:

- Implements the same interface as `MonthlySummaryService.getMonthlySummary(month)` but returns mock data.

**Scenarios**:

1. **Success**:
   - Delay: `500–1500 ms` via `$timeout`.
   - Reads JSON from `mock/data/monthlySummary.mock.json` or constructs sample models.

2. **Timeout Simulation**:
   - When `month` is set to a specific value (e.g., `"9999-99"` for test), simulate delay beyond `ENV_CONFIG.apiTimeoutMs` and reject with timeout error model.

3. **Empty Response**:
   - For months with no transactions, return totalSpend = 0, transactionCount = 0, empty arrays.

4. **Invalid Response Simulation** (for testing validators):
   - Provide a scenario where response lacks `totalSpend`, to test `validateResponse` error handling.

**Mock JSON Sample** (`mock/data/monthlySummary.mock.json`):

```json
{
  "month": "2026-07",
  "cardId": "CARD-MOCK-0001",
  "totalSpend": 25000,
  "transactionCount": 40,
  "currency": "INR",
  "kpis": [
    {
      "id": "total_spend",
      "label": "Total Spend",
      "value": 25000,
      "type": "currency"
    },
    {
      "id": "txn_count",
      "label": "Transactions",
      "value": 40,
      "type": "count"
    }
  ],
  "breakdownEntries": [
    {
      "dimension": "broadCategory",
      "label": "Groceries",
      "amount": 8000,
      "percentage": 0.32
    }
  ]
}
```

Mock responses conform exactly to the production contract.


## 18. UI Specification

### 18.1 Page Layout – Monthly Summary Dashboard

**Template File**: `templates/monthlySummary.view.html`

**Structure**:

```text
Header
↓
Filters (Month selector)
↓
Summary KPI Cards
↓
Charts (Monthly trend line or bar + Breakdown chart)
↓
Footer
```

**Bootstrap Layout**:

- `<div class="container">` root.
- Header row: `row` with `col-xs-12`.
- Filters row: `row` with month selector.
- KPI cards row: `row` with `col-sm-3` per card (responsive stacking on small screens).
- Charts row: `row` with two columns:
  - `col-md-8` for main chart (e.g., bar chart showing spend distribution over days or weeks).
  - `col-md-4` for breakdown chart.

### 18.2 Components in Template

- **Month Selector**:
  - UI Bootstrap datepicker or simple dropdown of available months.
  - Bound to `vm.selectedMonth`.
  - On change calls `vm.onMonthChange(newMonth)`.

- **KPI Cards**:
  - `ng-repeat="kpi in vm.kpis"` using `<kpi-card>` directive.

- **Charts**:
  - Main chart: optional directive or inline Chart.js configuration for monthly spend timeline (`vm.summary` data).
  - Breakdown chart: `<breakdown-chart entries="vm.breakdownEntries" chart-type="doughnut">`.

- **States**:
  - `<loading-state is-loading="vm.isLoading"></loading-state>`.
  - `<error-state error="vm.error" on-retry="vm.retry()"></error-state>`.
  - Empty state content if `vm.hasData === false && !vm.isLoading && !vm.hasError`:
    - Shows `"No spending data available for the selected month."` and optional illustration `emptyState.png`.

### 18.3 UI Visual Standards

- **Typography**:
  - Base font: system default or Bootstrap default.
  - Headings: `h1` for page title, `h2` for sections.

- **Colours**:
  - Background: light neutral.
  - Cards: white with subtle shadow.
  - Primary accent: blue or brand colour.

- **Spacing & Alignment**:
  - Use consistent margins and padding.
  - Numeric values right-aligned in tables.

### 18.4 Responsive Design

- On small screens, KPI cards stack vertically (using `col-xs-12`).
- Charts resize to full-width `col-xs-12` as viewport shrinks.
- No horizontal scroll for standard resolutions; charts and cards reflow.

### 18.5 Accessibility

- All interactive controls (month selector, retry button) accessible via keyboard (tab order defined naturally by DOM).
- Filters and buttons have clear labels (`Select month`, `Retry`).
- Sufficient colour contrast between text and background.


## 19. Data Flow

### 19.1 Success Flow – Monthly Summary Retrieval

1. **User Action**: Selects month (or uses default).
2. **Controller**: `MonthlySummaryController.initialize(initialMonth)` or `onMonthChange(newMonth)`.
3. **Service**: `MonthlySummaryService.getMonthlySummary(month)` validates and issues REST call or mock call.
4. **REST API**: `GET /v4/spending-summary/{cardId}?month=YYYY-MM` (via API_GW and SUMMARY_API) returns summary.
5. **Service**: Validates and maps response into models.
6. **Controller**: Updates `vm.summary`, `vm.kpis`, `vm.breakdownEntries`, `vm.hasData`, clears errors.
7. **Directives & Template**: KPI cards and charts update; loading state hides.

### 19.2 Failure Flow – API Error

1. Service receives HTTP error or invalid response.
2. `httpErrorFactory` maps to `ErrorResponseModel`.
3. Service logs error via `LoggingService` and rejects.
4. Controller sets `vm.hasError = true`, `vm.error` with user-facing message; `vm.isLoading = false`.
5. Template shows `<error-state>` with message and `Retry` button.
6. User clicks `Retry` causing `vm.retry()` which re-invokes `loadMonthlySummary()`.

### 19.3 Empty Data Flow

1. Service receives valid response where `totalSpend == 0` and/or `transactionCount == 0`.
2. Controller sets `vm.hasData = false`, `vm.summary` accordingly.
3. UI displays empty state panel.


## 20. Business Rules

### 20.1 Monthly Total Spend – Ambiguity Note

The HLD identifies an ambiguity about inclusion of fees, interest, refunds, and reversals. The LLD **does not assume** a resolution but documents a **placeholder rule** required from the domain:

- **BR1 (to be defined by product/domain)**:
  - Inputs: source transactions from TX_STORE and SUMMARY_VIEW.
  - Outputs: `totalSpend` in `MonthlySummaryModel`.
  - Rule: Must specify whether:
    - Merchant purchases only.
    - Fees/interest are included.
    - Refunds/reversals reduce total or are excluded.

The frontend assumes that the backend domain service returns a `totalSpend` consistent with organizational definitions; no further transformation is done on client.

### 20.2 Valid Month Selection Range

- **BR2**:
  - A user can select months from `current month` back to `ENV_CONFIG.maxLookbackMonths` months.
  - User cannot select months beyond this; UI prevents this via disabled options and service validation.

### 20.3 Credit Card Only

- **BR3**:
  - Only credit card products are aggregated; selection of other product types is not allowed.
  - UI does not show non‑credit‑card product choice within this dashboard.

### 20.4 KPIs Display

- **BR4**:
  - Core KPIs to display: `Total Spend`, `Transactions`.
  - Additional KPIs (e.g., average transaction value) displayed subject to `featureFlags` configuration.

### 20.5 Breakdown Granularity

- **BR5**:
  - Breakdown uses **coarse dimensions** (e.g., broad categories) and is not fully detailed.
  - Data is aggregated; no direct per-transaction view is provided.


## 21. Validation Rules

### 21.1 Input Validation – Month

- Format check: regex `^\d{4}-(0[1-9]|1[0-2])$`.
- Range check: month within `maxLookbackMonths` and not beyond current month (+1 if allowed for partially completed months).
- Invalid input results in **client-side feedback** and prevents API call.

### 21.2 Response Validation

- Mandatory fields present (`month`, `totalSpend`, `transactionCount`, `currency`).
- Types match expectations.
- Optional arrays for `kpis`, `breakdownEntries` default to empty when absent.

### 21.3 Configuration Validation

- On bootstrap, `ConfigService` validates `ENV_CONFIG`:
  - `apiBaseUrl` non-empty string.
  - `apiTimeoutMs` positive integer.
  - `maxLookbackMonths` positive integer.
  - `currency` non-empty string.

If configuration fails validation, the app logs an error and may show a global error state.


## 22. Error Handling

### 22.1 Error Types

- **Validation errors** – invalid month selection.
- **Business errors** – invalid card or product not allowed.
- **Network errors** – connectivity problems.
- **Timeout errors** – API not responding within configured timeout.
- **Unexpected errors** – unhandled exceptions.

### 22.2 Handling Strategy

- Service translates errors into `ErrorResponseModel`.
- Controller uses `errorState` directive.
- Messages are user-friendly, e.g., `"Unable to retrieve spending information for the selected month."`.
- Technical details present only in logs.


## 23. Logging Design

- Use `LoggingService` for client-side logs.
- Log events:
  - Dashboard load success/failure.
  - Month change selections.
  - API failures with mapped error codes.
- Logging must skip PII or sensitive data (e.g., no full card numbers, no raw tokens).


## 24. Security Design

- **Input Validation**: on month selection.
- **Output Encoding/Sanitization**: use Angular binding to avoid script injection; `ngSanitize` for any rich text.
- **Authentication Hooks**: assume token is stored as secure cookie; SPA does not manage tokens directly beyond relying on session; all requests include required headers.
- **Authorization**: enforced by backend; frontend does not attempt to infer authorization decisions.
- **Sensitive Data Handling**: no card PAN, CVV, or detailed PII shown; aggregated data only.


## 25. Dependency Map

### 25.1 Per File Dependencies

- `app.module.js`
  - Depends on AngularJS, `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`.
  - Consumed by all components.

- `app.config.js`
  - Depends on `ENV_CONFIG`, `$httpProvider`, `httpErrorFactory`.
  - Consumed during app bootstrap.

- `app.routes.js`
  - Depends on `$routeProvider`, `$locationProvider`.
  - Provides route fallback.

- `routes/monthlySummary.route.js`
  - Depends on `$routeProvider`.
  - Registers monthly summary route.

- `controllers/monthlySummary.controller.js`
  - Depends on `MonthlySummaryService`, `LoggingService`, `$routeParams`, `ENV_CONFIG`.
  - Consumed by route `/summary/monthly`.

- `services/monthlySummary.service.js`
  - Depends on `$http`, `ConfigService`, `LoggingService`, `ENV_CONFIG`, `httpErrorFactory`, models.
  - Consumed by controller and mock service.

- `services/config.service.js`
  - Depends on `ENV_CONFIG`.
  - Consumed by `MonthlySummaryService` and potentially others.

- `services/logging.service.js`
  - Depends on `$log`, `ENV_CONFIG` (telemetry flags).
  - Consumed by controllers and services.

- `factories/httpError.factory.js`
  - Has no external dependencies; consumed by `MonthlySummaryService`, `app.config`.

- `directives/kpiCard.directive.js`
  - Depends on `KpiModel` (via typings and usage); consumed by `monthlySummary.view.html`.

- `directives/breakdownChart.directive.js`
  - Depends on Chart.js, `BreakdownEntryModel`; consumed by `monthlySummary.view.html`.

- `directives/loadingState.directive.js`
  - No dependencies; consumed by monthly summary template.

- `directives/errorState.directive.js`
  - Depends on `ErrorResponseModel`; consumed by monthly summary template.

- `filters/*.js`
  - Depend on `ENV_CONFIG` as needed; consumed by templates.

- `models/*.js`
  - No dependencies; consumed by services, controller, directives.

- `config/*.json`, `config.constants.js`
  - Consumed by `ConfigService`, other components via `ENV_CONFIG`.

- `mock/monthlySummary.mock.service.js`
  - Depends on `$q`, `$timeout`, models; consumed by `MonthlySummaryService` when `useMockData` is true.


## 26. LLD Validation Checklist

1. **Mandatory Sections Present** – All required sections from lldgenerationkb are included.
2. **Technology Stack Compliance** – AngularJS 1.7.9 SPA; no unauthorized frameworks.
3. **Architecture Alignment** – Follows AngularJS MVC; controllers without business logic; services encapsulate business rules and API calls.
4. **Repository Structure** – All relevant files and paths defined.
5. **Routing** – Single route for monthly summary with default fallback; reachable and mapped to existing controller and template.
6. **Component Registry** – All controllers, services, factories, directives, filters, models, constants are registered and documented.
7. **REST Contracts** – Spending Summary API defined with request/response, error models.
8. **Configuration** – ENV_CONFIG and environment files; behaviour toggled via `useMockData`.
9. **Mock Implementations** – MonthlySummaryMockService designed; mirrors production contract.
10. **UI Specification** – Layout, components, states, responsive behaviour, accessibility documented.
11. **Validation Rules** – Input, response, configuration validation defined.
12. **Error Handling** – Clear strategies and models specified.
13. **Logging & Security** – Logging service, security boundaries documented.
14. **No Code Implementation** – Only specifications; no actual code provided, per standards.

This LLD meets the quality gates defined in the knowledge base and aligns strictly with the HLD requirements without introducing new business features or assumptions beyond those explicitly identified as needing domain clarification.
