# Low-Level Design (LLD) – QE-3250 – Spending Summary Dashboard

## 1. Application Overview

### 1.1 Purpose
The Spending Summary Dashboard application provides authenticated credit card customers with:
- Monthly spending summary KPIs (e.g., total spend, transaction count).
- Overall spending trends for the last 6 months.
- Visual insights rendered as summary cards and charts.

It is implemented as a browser-based Single Page Application (SPA) using AngularJS 1.7.9, interacting with backend REST APIs that expose aggregated credit-card spending metrics only, without transaction-level data or PII.

### 1.2 Scope (From HLD QE-3250)
In-scope functionalities:
1. Generate monthly spending summary with key metrics (total spend, number of transactions, and other KPIs where defined).
2. Generate overall spending trends for the last 6 months.
3. Display spending insights using summary cards and charts.
4. Provide month-wise spend visualization for trend analysis.
5. Allow users to select a month and view corresponding spending summary.

Out-of-scope (explicit):
- Non-credit-card products.
- Detailed transaction-level management features (no transaction listing, editing, disputes, or categorization management).

### 1.3 High-Level Behavior
- User authenticates via IAM and obtains an access token (handled outside SPA’s core design but assumed via secure integration).
- AngularJS SPA calls REST endpoints on an API Gateway:
  - `GET /spending-summary?month=YYYY-MM` for monthly summary.
  - `GET /spending-trends?range=6m` for 6-month trends.
  - Optional configuration endpoint (e.g., `GET /spending-config`) for insights/chart metadata.
- Backend services (Spending Summary Service, Spending Trends Service, Insights Formatting Component) aggregate data from Customer Spend Aggregates DB and ConfigDB and respond with UI-ready JSON.
- SPA renders KPI cards, charts, and tables based on these responses.


## 2. Technology Stack

### 2.1 Frontend
- HTML5
- CSS3
- JavaScript ES6 (where compatible with AngularJS 1.7.9)
- AngularJS 1.7.9
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only)
- Chart.js 2.9.4

### 2.2 Browser Support
- Google Chrome (latest stable versions)
- Microsoft Edge (latest stable versions)

### 2.3 Backend (Contract-Only, No Implementation)
The LLD references backend services **only via REST contracts**:
- API Gateway / Edge Service (TLS termination, authentication and authorization, request routing).
- Spending Summary Service.
- Spending Trends Service.
- Insights Formatting Component.

Implementation details (language, frameworks) of backend are out of scope for this LLD and remain per backend standards.


## 3. Architecture Design

### 3.1 Frontend Architecture
- AngularJS 1.7.9 SPA using:
  - Modular structure (`app` module).
  - MVC pattern.
  - ControllerAs syntax.
  - Dependency Injection.
  - Route-based navigation (`ngRoute`).
- All UI behavior coordinated via Controllers; business logic resides in Services.
- Reusable UI elements are implemented as Directives.
- Shared transformation utilities (if any) implemented as Factories.

### 3.2 Logical Components (Frontend)
Mapping to HLD components:
- Spending Summary Web UI → AngularJS SPA.
- API Gateway → REST API endpoints consumed by SPA.
- Spending Summary Service / Spending Trends Service / Insights Formatting Component → external REST APIs defined in section 15.

Frontend logical components:
1. **Root Module**: `app`
2. **Routes**:
   - `/dashboard`: main dashboard view (monthly summary + 6-month trend).
   - `/login` (optional stub route if required by integration), but primary auth is IAM redirect; not fully implemented in this LLD.
   - Default: redirect to `/dashboard`.
3. **Controllers**:
   - `DashboardController`: coordinates dashboard UI, monthly summary, and trends.
4. **Services**:
   - `SummaryService`: handles monthly summary REST interactions.
   - `TrendsService`: handles 6-month trends REST interactions.
   - `ConfigService`: retrieves UI configuration/insights metadata.
   - `LoggingService`: encapsulates client-side logging.
5. **Directives**:
   - `ssKpiCard`: KPI card directive.
   - `ssSummaryChart`: monthly summary chart directive.
   - `ssTrendsChart`: 6-month trend chart directive.
6. **Models**:
   - `MonthlySummaryModel` (JS model definition and JSON schema).
   - `MonthlyTrendPointModel`.
   - `SixMonthTrendModel`.
   - `ErrorModel`.
   - `ConfigModel` (chart & insights config).

### 3.3 Data Flow (High Level)
1. User opens `/dashboard`.
2. SPA initializes `DashboardController`, loads configuration via `ConfigService`.
3. SPA calls `SummaryService.getMonthlySummary(selectedMonth)`.
4. SPA calls `TrendsService.getSixMonthTrends()`.
5. Responses mapped to models; ViewModel updated.
6. Directives (`ssKpiCard`, `ssSummaryChart`, `ssTrendsChart`) render KPIs and charts.
7. Errors and loading states are handled per section 22.


## 4. Repository Structure

### 4.1 Root Layout
```text
src/
  app/
    config/
      env.default.json
      env.dev.json
      env.prod.json
      config.constants.js
      routes.config.js
    modules/
      dashboard/
        controllers/
          dashboard.controller.js
        services/
          summary.service.js
          trends.service.js
          config.service.js
          logging.service.js
        directives/
          kpi-card.directive.js
          summary-chart.directive.js
          trends-chart.directive.js
        models/
          monthly-summary.model.js
          monthly-trend-point.model.js
          six-month-trend.model.js
          error.model.js
          config.model.js
        templates/
          dashboard.html
          kpi-card.html
          summary-chart.html
          trends-chart.html
    app.module.js
  assets/
    css/
      styles.css
    js/
      (optional helpers if needed)
    images/
      (icons, illustrations)
    fonts/
      (if required)
  mock/
    summary.mock.service.js
    trends.mock.service.js
    config.mock.service.js
    data/
      monthly-summary.sample.json
      six-month-trend.sample.json
      config.sample.json
  index.html
  README.md
```

### 4.2 File Responsibilities
- `index.html`: Root HTML, bootstraps AngularJS app, loads CSS/JS.
- `app.module.js`: Declares root AngularJS module `app` and dependencies.
- `config.constants.js`: Declares environment constants and structured configuration objects (e.g., API base URL, timeout, feature flags).
- `routes.config.js`: Declares AngularJS routing for SPA.
- `env.*.json`: Environment-specific configuration files.
- `dashboard.controller.js`: COordinates dashboard UI; delegates to services.
- `summary.service.js`: REST calls for monthly summary.
- `trends.service.js`: REST calls for 6-month trends.
- `config.service.js`: Fetches configuration and chart metadata.
- `logging.service.js`: Client-side logging abstraction.
- Directive files: Provide reusable UI components.
- Model files: Define model schemas and transformation helpers.
- Mock services and sample JSON: Provide mock implementations matching production contracts.


## 5. Application Bootstrap Design

### 5.1 index.html
**Repository Path**: `index.html`

**Responsibilities**:
- Define HTML `<head>` and `<body>` structure.
- Include:
  - Bootstrap 3.4.1 CSS (CDN).
  - Application CSS.
  - AngularJS 1.7.9 (CDN).
  - Angular Route, Animate, Sanitize (CDN).
  - Angular UI Bootstrap 2.5.6 (CDN).
  - Chart.js 2.9.4 (CDN).
  - Application JS files.
- Declare `ng-app="app"` on `<html>` or `<body>`.
- Provide `<div ng-view></div>` as main view container.

**Loading Order**:
1. CSS:
   - Bootstrap CSS CDN.
   - `assets/css/styles.css`.
2. JS (frameworks):
   - AngularJS CDN.
   - Angular Route.
   - Angular Animate.
   - Angular Sanitize.
   - Angular UI Bootstrap.
   - Chart.js.
3. JS (application):
   - `src/app/app.module.js`.
   - `src/app/config/config.constants.js`.
   - `src/app/config/routes.config.js`.
   - `src/app/modules/dashboard/**/*.js` (controller, services, directives, models).

Constraints per KB:
- Do **not** include jQuery or `bootstrap.min.js` unless specifically required. Not required by QE-3250.
- AngularJS must load before application scripts.

### 5.2 Angular Bootstrapping
- Root module: `app`.
- Bootstrapped via `ng-app="app"` (automatic bootstrap).

Bootstrap responsibilities:
- Register module dependencies (see Module Design).
- Configure routes.
- Initialize environment configuration constants.


## 6. Module Design

### 6.1 Root Module
**Name**: `app`
**File**: `src/app/app.module.js`

**Angular Registration**:
```js
angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'ui.bootstrap'
]);
```

**Responsibilities**:
- Declare base SPA module.
- Wire core AngularJS dependencies.

**Dependencies**:
- External:
  - `ngRoute` for routing.
  - `ngAnimate` for UI animations (e.g., loading spinners, transitions).
  - `ngSanitize` for safe HTML bindings.
  - `ui.bootstrap` for Bootstrap-based Angular components (modals, alerts).
- Internal:
  - Routing config (`routes.config.js`).
  - Constants/config (`config.constants.js`).
  - Dashboard module components.


## 7. Routing Design

**File**: `src/app/config/routes.config.js`

**Angular Registration**:
```js
angular.module('app')
  .config(['$routeProvider', function($routeProvider) {
    // route definitions
  }]);
```

### 7.1 Route Definitions

#### `/dashboard`
- **TemplateUrl**: `src/app/modules/dashboard/templates/dashboard.html`
- **Controller**: `DashboardController`
- **ControllerAs**: `vm`

#### `/login` (Optional placeholder)
- For completeness if integration requires a login route; however, primary IAM flow is external:
- **TemplateUrl**: Simple informational template `login.html` (if needed; out-of-scope for full auth logic).
- **Controller**: none (static view) or `LoginController` (if required by integration; not defined here as HLD focuses on dashboard).

#### Default Route
- Any unmatched route redirects to `/dashboard`.

### 7.2 Route Constraints
- Every TemplateUrl must point to an actual template file.
- Every controller used must be defined.
- Default route must be present.
- Invalid routes must redirect to `/dashboard`.


## 8. Component Registry

Below is the complete registry of AngularJS components defined in this LLD.

### 8.1 Modules
- `app` (root module)

### 8.2 Controllers
1. `DashboardController`
   - Type: Controller
   - Path: `src/app/modules/dashboard/controllers/dashboard.controller.js`
   - Module: `app`
   - Registration: `.controller('DashboardController', DashboardController)`

### 8.3 Services
1. `SummaryService`
   - Type: Service
   - Path: `src/app/modules/dashboard/services/summary.service.js`
   - Module: `app`
   - Registration: `.service('SummaryService', SummaryService)`

2. `TrendsService`
   - Type: Service
   - Path: `src/app/modules/dashboard/services/trends.service.js`
   - Module: `app`
   - Registration: `.service('TrendsService', TrendsService)`

3. `ConfigService`
   - Type: Service
   - Path: `src/app/modules/dashboard/services/config.service.js`
   - Module: `app`
   - Registration: `.service('ConfigService', ConfigService)`

4. `LoggingService`
   - Type: Service
   - Path: `src/app/modules/dashboard/services/logging.service.js`
   - Module: `app`
   - Registration: `.service('LoggingService', LoggingService)`

### 8.4 Factories
- None explicitly required by HLD; any shared transformation logic can be implemented within services or future factories.

### 8.5 Directives
1. `ssKpiCard`
   - Type: Directive
   - Path: `src/app/modules/dashboard/directives/kpi-card.directive.js`
   - Module: `app`
   - Registration: `.directive('ssKpiCard', ssKpiCard)`

2. `ssSummaryChart`
   - Type: Directive
   - Path: `src/app/modules/dashboard/directives/summary-chart.directive.js`
   - Module: `app`
   - Registration: `.directive('ssSummaryChart', ssSummaryChart)`

3. `ssTrendsChart`
   - Type: Directive
   - Path: `src/app/modules/dashboard/directives/trends-chart.directive.js`
   - Module: `app`
   - Registration: `.directive('ssTrendsChart', ssTrendsChart)`

### 8.6 Filters
- Standard formatting filters (can be included as needed):
  - `currencyFormat`
  - `dateFormat`
  - `percentage`

**Paths** (if implemented):
- `src/app/modules/dashboard/filters/currency-format.filter.js`
- `src/app/modules/dashboard/filters/date-format.filter.js`
- `src/app/modules/dashboard/filters/percentage.filter.js`

### 8.7 Models (as AngularJS services/factories or plain JS modules)
1. `MonthlySummaryModel`
   - Path: `src/app/modules/dashboard/models/monthly-summary.model.js`

2. `MonthlyTrendPointModel`
   - Path: `src/app/modules/dashboard/models/monthly-trend-point.model.js`

3. `SixMonthTrendModel`
   - Path: `src/app/modules/dashboard/models/six-month-trend.model.js`

4. `ErrorModel`
   - Path: `src/app/modules/dashboard/models/error.model.js`

5. `ConfigModel`
   - Path: `src/app/modules/dashboard/models/config.model.js`

### 8.8 Constants / Config
- `ENV_CONFIG`
  - Path: `src/app/config/config.constants.js`
  - Registration: `.constant('ENV_CONFIG', { ... })`


## 9. Controller Design

### 9.1 DashboardController

**File**: `src/app/modules/dashboard/controllers/dashboard.controller.js`

**Registration**:
```js
angular.module('app')
  .controller('DashboardController', DashboardController);
```

**Injected Dependencies**:
- `$scope` (minimal use; main pattern via `this` alias `vm`).
- `$routeParams` (if month is passed via route).
- `SummaryService`.
- `TrendsService`.
- `ConfigService`.
- `LoggingService`.

**ViewModel alias**: `vm`

**Responsibilities**:
- Initialize dashboard state.
- Manage selected month.
- Trigger monthly summary and trend retrieval.
- Coordinate loading, success, empty, and error states.
- Provide data to directives.
- Handle retry actions.

**ViewModel State**:
- `vm.selectedMonth`: string `YYYY-MM`.
- `vm.summary`: `MonthlySummaryModel` instance.
- `vm.trends`: `SixMonthTrendModel` instance.
- `vm.config`: `ConfigModel` instance.
- `vm.isLoadingSummary`: boolean.
- `vm.isLoadingTrends`: boolean.
- `vm.summaryError`: `ErrorModel` or null.
- `vm.trendsError`: `ErrorModel` or null.

**Public Methods**:
1. `vm.initialize()`
   - Purpose: initialize controller; load configuration, set default month, fetch data.
   - Inputs: none (uses current date as default month; if HLD requires statement-cycle alignment, backend will enforce; SPA only passes `YYYY-MM`).
   - Behavior:
     - Set `vm.selectedMonth` to default month.
     - Call `loadConfig()`.
     - Call `loadMonthlySummary(vm.selectedMonth)`.
     - Call `loadSixMonthTrends()`.

2. `vm.onMonthChange(month)`
   - Purpose: handle user month selection.
   - Inputs: `month` (string `YYYY-MM`).
   - Behavior:
     - Validate format client-side (regex `^\d{4}-\d{2}$`).
     - Update `vm.selectedMonth`.
     - Call `loadMonthlySummary(vm.selectedMonth)`.

3. `vm.retrySummary()`
   - Purpose: retry monthly summary retrieval after error.
   - Behavior:
     - Clear `vm.summaryError`.
     - Call `loadMonthlySummary(vm.selectedMonth)`.

4. `vm.retryTrends()`
   - Purpose: retry trend retrieval after error.
   - Behavior:
     - Clear `vm.trendsError`.
     - Call `loadSixMonthTrends()`.

5. `vm.refreshAll()`
   - Purpose: refresh both monthly summary and trends.
   - Behavior:
     - Call `loadMonthlySummary(vm.selectedMonth)`.
     - Call `loadSixMonthTrends()`.

**Private Methods** (internal helper functions):
1. `loadConfig()`
   - Uses `ConfigService.getConfig()`.
   - On success: sets `vm.config` and configures charts/cards.
   - On failure: logs error via `LoggingService`; uses default config.

2. `loadMonthlySummary(month)`
   - Sets `vm.isLoadingSummary = true`, `vm.summaryError = null`.
   - Calls `SummaryService.getMonthlySummary(month)`.
   - On success:
     - Updates `vm.summary`.
     - Handles empty data case (month with zero activity) via `summary.isEmpty`.
   - On error:
     - Constructs `ErrorModel` via response.
     - Sets `vm.summaryError`.
     - Logs via `LoggingService`.
   - Finally: `vm.isLoadingSummary = false`.

3. `loadSixMonthTrends()`
   - Sets `vm.isLoadingTrends = true`, `vm.trendsError = null`.
   - Calls `TrendsService.getSixMonthTrends()`.
   - On success:
     - Updates `vm.trends`.
     - Handles zero-data for multiple months.
   - On error:
     - Sets `vm.trendsError`.
     - Logs via `LoggingService`.
   - Finally: `vm.isLoadingTrends = false`.

**Error Handling**:
- Uses `ErrorModel` to represent errors.
- For 401/403, may trigger redirect to login or display generic message.
- For 404, shows empty state message.
- For 500/timeout, shows generic error with Retry button.


## 10. Service Design

### 10.1 SummaryService

**File**: `src/app/modules/dashboard/services/summary.service.js`

**Registration**:
```js
angular.module('app')
  .service('SummaryService', SummaryService);
```

**Injected Dependencies**:
- `$http`
- `$q`
- `ENV_CONFIG`
- `LoggingService`

**Purpose**:
- Retrieve monthly spending summary from backend REST API.
- Map response JSON to `MonthlySummaryModel`.
- Handle retry (client-side logic should be minimal; main retry is user-driven via Retry button, not automatic loops).

**Public Methods**:
1. `getMonthlySummary(month)`
   - Inputs:
     - `month`: string `YYYY-MM`.
   - Behavior:
     - Build URL: `ENV_CONFIG.apiBaseUrl + '/spending-summary?month=' + encodeURIComponent(month)`.
     - Set headers: `Authorization: Bearer <token>` (token handling outside this LLD; assume presence in `$http` defaults or interceptor).
     - Set timeout: `ENV_CONFIG.apiTimeoutMs`.
     - Perform `GET` request.
     - On success:
       - Validate response structure.
       - Map to `MonthlySummaryModel`.
     - On error:
       - Map error to `ErrorModel`.
       - Reject promise.

**Private Methods**:
1. `mapSummaryResponse(data)`
   - Input: raw JSON from backend (must conform to REST API Contract section 15).
   - Output: `MonthlySummaryModel`.
   - Behavior:
     - Copy numeric fields: `totalSpend`, `transactionCount`, etc.
     - Ensure `totalSpend >= 0`, `transactionCount >= 0`.
     - Determine `isEmpty` based on `transactionCount === 0` or no data.

2. `validateSummaryResponse(data)`
   - Validate presence of fields: `month`, `totalSpend`, `transactionCount`.
   - If validation fails, log via `LoggingService` and throw `ErrorModel`.

### 10.2 TrendsService

**File**: `src/app/modules/dashboard/services/trends.service.js`

**Registration**:
```js
angular.module('app')
  .service('TrendsService', TrendsService);
```

**Injected Dependencies**:
- `$http`
- `$q`
- `ENV_CONFIG`
- `LoggingService`

**Purpose**:
- Retrieve six-month trend data from backend REST API.
- Map response JSON to `SixMonthTrendModel` including `MonthlyTrendPointModel` entries.

**Public Methods**:
1. `getSixMonthTrends()`
   - Inputs: none (range fixed at 6 months as per HLD, backend may accept `range=6m`).
   - Behavior:
     - URL: `ENV_CONFIG.apiBaseUrl + '/spending-trends?range=6m'`.
     - Headers: `Authorization` per SummaryService.
     - Timeout: `ENV_CONFIG.apiTimeoutMs`.
     - `GET` request.
     - On success:
       - Validate response.
       - Map to `SixMonthTrendModel`.
     - On error:
       - Map error to `ErrorModel`.
       - Reject promise.

**Private Methods**:
1. `mapTrendsResponse(data)`
   - Input: raw JSON containing list of monthly points.
   - Output: `SixMonthTrendModel`.
   - Behavior:
     - Ensure exactly up to 6 entries (some months may be zero activity).
     - Each entry mapped to `MonthlyTrendPointModel` with `month`, `totalSpend`, `transactionCount`.

2. `validateTrendsResponse(data)`
   - Validate that months are in correct format and chronological order.
   - Validate numeric fields are non-negative.

### 10.3 ConfigService

**File**: `src/app/modules/dashboard/services/config.service.js`

**Registration**:
```js
angular.module('app')
  .service('ConfigService', ConfigService);
```

**Injected Dependencies**:
- `$http`
- `$q`
- `ENV_CONFIG`
- `LoggingService`

**Purpose**:
- Retrieve chart and insights configuration from backend or local config.

**Public Methods**:
1. `getConfig()`
   - Inputs: none.
   - Behavior:
     - If `ENV_CONFIG.useMockData` is true, read from mock JSON `config.sample.json`.
     - Else, call backend: `GET ENV_CONFIG.apiBaseUrl + '/spending-config'` (endpoint name aligned to HLD "Insights & Visualization Configuration" flow).
     - Map to `ConfigModel`.

### 10.4 LoggingService

**File**: `src/app/modules/dashboard/services/logging.service.js`

**Registration**:
```js
angular.module('app')
  .service('LoggingService', LoggingService);
```

**Injected Dependencies**:
- `$log`

**Purpose**:
- Provide centralized logging mechanism.

**Public Methods**:
1. `info(message, context)`
2. `warn(message, context)`
3. `error(message, context)`

**Notes**:
- Must not introduce circular dependencies.
- Must not log PII or tokens.


## 11. Factory Design

No explicit factories are mandated by QE-3250. If implementation requires object construction helpers beyond services, they must:
- Be stateless (unless explicitly needed).
- Not perform REST communication.
- Focus on reusable object creation.

Example potential factory (not required by HLD): `SummaryMapperFactory` to encapsulate mapping logic; if created, it must be documented similarly.


## 12. Directive Design

### 12.1 ssKpiCard Directive

**File**: `src/app/modules/dashboard/directives/kpi-card.directive.js`

**Registration**:
```js
angular.module('app')
  .directive('ssKpiCard', ssKpiCard);
```

**Purpose**:
- Render a KPI card (e.g., total spend, transaction count).

**Directive Definition**:
- `restrict`: `'E'` (element).
- `scope`: isolated.
- `bindToController`: true.
- `controller`: `KpiCardController` (internal; minimal logic).
- `controllerAs`: `vm`.
- `templateUrl`: `src/app/modules/dashboard/templates/kpi-card.html`.

**Scope Bindings**:
- `title`: `@` (card label, e.g., "Total Spend").
- `value`: `<` (numeric or formatted value).
- `iconClass`: `@` (CSS class for icon).
- `trendIndicator`: `<` (object representing increase/decrease, optional).

**Usage Example**:
```html
<ss-kpi-card
  title="Total Spend"
  value="vm.summary.totalSpendFormatted"
  icon-class="fa fa-credit-card"
  trend-indicator="vm.summary.trend">
</ss-kpi-card>
```

### 12.2 ssSummaryChart Directive

**File**: `src/app/modules/dashboard/directives/summary-chart.directive.js`

**Registration**:
```js
angular.module('app')
  .directive('ssSummaryChart', ssSummaryChart);
```

**Purpose**:
- Render monthly summary chart (e.g., category breakdown or single-month bar chart as per backend response).

**Directive Definition**:
- `restrict`: `'E'`.
- `scope`: isolated.
- `bindToController`: true.
- `controller`: `SummaryChartController`.
- `controllerAs`: `vm`.
- `templateUrl`: `src/app/modules/dashboard/templates/summary-chart.html`.

**Scope Bindings**:
- `chartData`: `<` (Chart.js data object).
- `chartOptions`: `<` (Chart.js options object).

**Usage Example**:
```html
<ss-summary-chart
  chart-data="vm.summary.chartData"
  chart-options="vm.summary.chartOptions">
</ss-summary-chart>
```

### 12.3 ssTrendsChart Directive

**File**: `src/app/modules/dashboard/directives/trends-chart.directive.js`

**Registration**:
```js
angular.module('app')
  .directive('ssTrendsChart', ssTrendsChart);
```

**Purpose**:
- Render 6-month spending trend chart.

**Directive Definition**:
- `restrict`: `'E'`.
- `scope`: isolated.
- `bindToController`: true.
- `controller`: `TrendsChartController`.
- `controllerAs`: `vm`.
- `templateUrl`: `src/app/modules/dashboard/templates/trends-chart.html`.

**Scope Bindings**:
- `chartData`: `<`.
- `chartOptions`: `<`.

**Usage Example**:
```html
<ss-trends-chart
  chart-data="vm.trends.chartData"
  chart-options="vm.trends.chartOptions">
</ss-trends-chart>
```


## 13. Filter Design

If formatting filters are implemented, they must follow:

### 13.1 currencyFormat Filter

**File**: `src/app/modules/dashboard/filters/currency-format.filter.js`

**Registration**:
```js
angular.module('app')
  .filter('currencyFormat', currencyFormat);
```

**Purpose**:
- Format numeric value as currency using configured currency code.

**Input**:
- Number.

**Output**:
- String formatted currency.

### 13.2 dateFormat Filter

**File**: `src/app/modules/dashboard/filters/date-format.filter.js`

**Purpose**:
- Format date strings (`YYYY-MM`) into user-friendly month labels (e.g., "Jul 2026").

### 13.3 percentage Filter

**File**: `src/app/modules/dashboard/filters/percentage.filter.js`

**Purpose**:
- Format numeric ratios as percentages (e.g., 0.25 → "25%"), used in charts or insights.


## 14. Model Design

### 14.1 MonthlySummaryModel

**File**: `src/app/modules/dashboard/models/monthly-summary.model.js`

**Purpose**:
- Represent monthly spending summary.

**Properties**:
- `month`: string `YYYY-MM` (required).
- `totalSpend`: number (>= 0, required).
- `transactionCount`: number (>= 0, required).
- `currency`: string (e.g., "INR", optional but recommended).
- `averageSpend`: number (>= 0, optional; can be derived: `totalSpend / transactionCount` if transactionCount > 0).
- `kpiMetrics`: object (optional; placeholder for additional KPIs defined by product owners).
- `chartData`: object (Chart.js dataset for monthly view, optional).
- `chartOptions`: object (Chart.js options for monthly view).
- `isEmpty`: boolean (true if no transactions or totals are zero and backend indicates no activity).

**Validation Rules**:
- `month` required; format `YYYY-MM`.
- `totalSpend >= 0`.
- `transactionCount >= 0`.
- If `transactionCount === 0`, `averageSpend` should be 0 or null.

**Sample JSON**:
```json
{
  "month": "2026-07",
  "totalSpend": 45872,
  "transactionCount": 92,
  "averageSpend": 498,
  "currency": "INR",
  "kpiMetrics": {},
  "chartData": {},
  "chartOptions": {},
  "isEmpty": false
}
```

### 14.2 MonthlyTrendPointModel

**File**: `src/app/modules/dashboard/models/monthly-trend-point.model.js`

**Purpose**:
- Represent a single month in the trend.

**Properties**:
- `month`: string `YYYY-MM`.
- `totalSpend`: number.
- `transactionCount`: number.
- `isEmpty`: boolean.

**Validation Rules**:
- Same as `MonthlySummaryModel` for each point.

### 14.3 SixMonthTrendModel

**File**: `src/app/modules/dashboard/models/six-month-trend.model.js`

**Purpose**:
- Represent overall 6-month trend data.

**Properties**:
- `points`: array of `MonthlyTrendPointModel` (length ≤ 6).
- `chartData`: Chart.js dataset.
- `chartOptions`: Chart.js options.

**Validation Rules**:
- `points.length` must be <= 6.
- Months should be ordered chronologically.

### 14.4 ErrorModel

**File**: `src/app/modules/dashboard/models/error.model.js`

**Purpose**:
- Represent errors for UI.

**Properties**:
- `code`: string (e.g., `"400"`, `"401"`, `"500"`).
- `message`: string (end-user-friendly message).
- `details`: string (optional technical info, not shown to user).
- `correlationId`: string (optional, from backend).

### 14.5 ConfigModel

**File**: `src/app/modules/dashboard/models/config.model.js`

**Purpose**:
- Represent chart and insights configuration.

**Properties**:
- `currencyCode`: string.
- `trendChartType`: string (e.g., `"line"` or `"bar"`).
- `summaryChartType`: string.
- `colorPalette`: array of strings (hex colors).
- `highSpendThreshold`: number.
- `featureFlags`: object.


## 15. REST API Contract

Backend endpoints are consumed by SPA; they must conform to the following contracts (aligned with HLD flows and KB standards).

### 15.1 GET /spending-summary

**Purpose**:
- Retrieve monthly spending summary with key metrics.

**URL**:
- `GET /spending-summary?month=YYYY-MM`

**Headers**:
- `Authorization: Bearer <token>`.
- `Content-Type: application/json`.

**Query Parameters**:
- `month` (required): string `YYYY-MM`.

**Request Body**:
- None.

**Success Response (200)**:
- Body JSON (UI-ready):
```json
{
  "month": "2026-07",
  "totalSpend": 45872,
  "transactionCount": 92,
  "averageSpend": 498,
  "currency": "INR",
  "kpiMetrics": {
    "highestCategory": "Dining",
    "lowestCategory": "Fuel"
  },
  "chartData": {
    "labels": ["Dining", "Groceries", "Fuel"],
    "datasets": [
      {
        "label": "Spend by Category",
        "data": [20500, 18000, 7372],
        "backgroundColor": ["#4CAF50", "#2196F3", "#FFC107"]
      }
    ]
  },
  "chartOptions": {
    "responsive": true,
    "legend": {"position": "bottom"}
  }
}
```

**Error Responses**:
- `400 Bad Request`: invalid `month` format.
- `401 Unauthorized`: invalid/missing token.
- `403 Forbidden`: authorization failure.
- `404 Not Found`: no spend data for given month.
- `429 Too Many Requests`: rate limiting.
- `500` / `502` / `503`: server error.

**Error Body** (generic structure):
```json
{
  "code": "404",
  "message": "No spending data available for the selected month.",
  "correlationId": "abc123"
}
```

### 15.2 GET /spending-trends

**Purpose**:
- Retrieve spending trend over the last 6 months.

**URL**:
- `GET /spending-trends?range=6m`

**Headers**:
- Same as summary.

**Query Parameters**:
- `range` (optional, default `6m`).

**Success Response (200)**:
```json
{
  "range": "6m",
  "points": [
    {
      "month": "2026-02",
      "totalSpend": 38000,
      "transactionCount": 80
    },
    {
      "month": "2026-03",
      "totalSpend": 41000,
      "transactionCount": 85
    }
    // up to 6 points
  ],
  "chartData": {
    "labels": ["2026-02", "2026-03"],
    "datasets": [
      {
        "label": "Monthly Spend",
        "data": [38000, 41000],
        "borderColor": "#2196F3",
        "fill": false
      }
    ]
  },
  "chartOptions": {
    "responsive": true,
    "legend": {"position": "bottom"},
    "scales": {
      "yAxes": [{"ticks": {"beginAtZero": true}}]
    }
  }
}
```

**Error Responses**:
- Same structure as Summary endpoint; message may indicate trends unavailable.

### 15.3 GET /spending-config

**Purpose**:
- Retrieve configuration and metadata for insights and charts.

**URL**:
- `GET /spending-config`

**Success Response (200)**:
```json
{
  "currencyCode": "INR",
  "trendChartType": "line",
  "summaryChartType": "bar",
  "colorPalette": ["#4CAF50", "#2196F3", "#FFC107"],
  "highSpendThreshold": 50000,
  "featureFlags": {
    "showCategoryBreakdown": true,
    "showAverageSpend": true
  }
}
```


## 16. Configuration Design

### 16.1 ENV_CONFIG Constant

**File**: `src/app/config/config.constants.js`

**Registration**:
```js
angular.module('app')
  .constant('ENV_CONFIG', {
    apiBaseUrl: 'https://api.example.com',
    apiTimeoutMs: 15000,
    maxLookbackMonths: 6,
    useMockData: false,
    featureFlags: {
      showCategoryBreakdown: true,
      showAverageSpend: true
    },
    telemetry: {
      enabled: true
    }
  });
```

**Properties**:
- `apiBaseUrl`: base URL for API Gateway.
- `apiTimeoutMs`: request timeout.
- `maxLookbackMonths`: maximum months for trends.
- `useMockData`: toggle between Production and Mock mode.
- `featureFlags`: UI-level feature toggles.
- `telemetry`: flags for client-side telemetry (if implemented).

Changing only `useMockData` switches between real and mock endpoints without code changes.

### 16.2 env.*.json Files

Paths:
- `src/app/config/env.default.json`
- `src/app/config/env.dev.json`
- `src/app/config/env.prod.json`

Each file contains environment-specific overrides e.g.:
```json
{
  "apiBaseUrl": "https://dev-api.example.com",
  "apiTimeoutMs": 15000,
  "useMockData": true
}
```

**Usage**:
- Loaded during build or runtime to set `ENV_CONFIG` values.


## 17. Mock Implementation Design

Mock implementations must exactly match production APIs’ request/response contracts.

### 17.1 Mock Summary Service

**File**: `mock/summary.mock.service.js`

**Purpose**:
- Provide `getMonthlySummary(month)` returning `$q` promise with sample JSON.

**Behavior**:
- Use `$timeout` to simulate delay (e.g., 500ms).
- Return data from `mock/data/monthly-summary.sample.json`.
- Simulate error scenarios via controlled flags in config (e.g., `ENV_CONFIG.featureFlags.simulateSummaryError`).

### 17.2 Mock Trends Service

**File**: `mock/trends.mock.service.js`

**Purpose**:
- Provide `getSixMonthTrends()` with sample trend data.

**Behavior**:
- Use `$timeout` for delay.
- Return data from `mock/data/six-month-trend.sample.json`.

### 17.3 Mock Config Service

**File**: `mock/config.mock.service.js`

**Purpose**:
- Provide `getConfig()` reading from `mock/data/config.sample.json`.

### 17.4 Sample JSONs

**monthly-summary.sample.json**:
- Conforms to REST summary response.

**six-month-trend.sample.json**:
- Conforms to trend response.

**config.sample.json**:
- Conforms to config response.

Mock services toggled by `ENV_CONFIG.useMockData`.


## 18. UI Specification

### 18.1 Overall Layout

**Template**: `src/app/modules/dashboard/templates/dashboard.html`

**Structure**:
- Header:
  - Application title: "Spending Summary Dashboard".
  - Optional user greeting (non-PII, e.g., "Welcome" without name).
- Main content:
  - Filter bar with month selection control.
  - KPI cards row.
  - Charts row (monthly summary, 6-month trends).
  - Optional table for monthly breakdown.
- Footer:
  - Generic info such as last data refresh timestamp.

### 18.2 Month Selection Control
- Use Bootstrap form controls.
- Input type: `<input>` with month picker or drop-down list of last N months.
- Bound to `vm.selectedMonth`.
- Validation: `YYYY-MM` format.

### 18.3 KPI Cards

- Layout: Bootstrap grid `row` with columns `col-md-3 col-sm-6` per card.
- Cards:
  - Total Spend.
  - Transaction Count.
  - Average Spend (if enabled).
- Each card uses `ssKpiCard` directive.

Visual styles:
- Background: light color.
- Border: subtle.
- Icon on left/top.
- Value prominently displayed.

### 18.4 Charts

#### Monthly Summary Chart
- Type: bar or doughnut (based on `ConfigModel.summaryChartType`).
- Data: `vm.summary.chartData`.
- Options: `vm.summary.chartOptions`.

#### 6-Month Trend Chart
- Type: line or bar (`ConfigModel.trendChartType`).
- Data: `vm.trends.chartData`.
- Options: `vm.trends.chartOptions`.

### 18.5 Table (Optional)
- Display monthly breakdown details if provided (e.g., categories).
- Columns: Category, Total Spend, Transaction Count.
- Sorting: by spend or category.
- Pagination: if many categories.

### 18.6 Responsive Behavior
- Bootstrap grid ensures layout adapts to desktop, laptop, tablet.
- KPI cards wrap to multiple rows on narrow screens.
- Charts shrink with container width (Chart.js responsive mode).
- No horizontal scrolling under normal conditions.

### 18.7 Accessibility
- Keyboard navigation:
  - Month selection accessible via Tab.
  - Buttons (Refresh, Retry) accessible via keyboard.
- Labels:
  - All form fields have `<label>`.
- Color contrast:
  - Colors chosen to ensure sufficient contrast.

### 18.8 Loading / Empty / Error States
- Loading:
  - Show spinner overlay on charts and cards while `vm.isLoadingSummary` or `vm.isLoadingTrends` is true.
- Empty:
  - If `vm.summary.isEmpty`, show message: "No spending data available for the selected month." and hide charts.
- Error:
  - Use alert components (e.g., `ui.bootstrap` alerts) to show `ErrorModel.message`.
  - Provide Retry buttons bound to `vm.retrySummary()` and `vm.retryTrends()`.


## 19. Data Flow

### 19.1 Authentication & Session (Flow 1)

While detailed IAM interaction is primarily backend concern, the SPA obeys:
- On initial load, SPA expects a valid access token (e.g., stored by IAM flow or cookie).
- If any call receives 401/403, SPA may redirect user to login page or show generic "Session expired" message.

### 19.2 Monthly Spending Summary Retrieval (Flow 2)

Steps (SPA perspective):
1. User selects month or default month is used.
2. `DashboardController.onMonthChange(month)` validates and triggers `SummaryService.getMonthlySummary(month)`.
3. `SummaryService` calls API Gateway.
4. Backend returns formatted summary JSON.
5. `SummaryService` maps to `MonthlySummaryModel`.
6. `DashboardController` updates `vm.summary`.
7. UI updates KPI cards and summary chart.

### 19.3 6-Month Spending Trends Retrieval (Flow 3)

Steps:
1. `DashboardController.initialize()` triggers `TrendsService.getSixMonthTrends()`.
2. `TrendsService` calls API Gateway.
3. Backend returns trend JSON.
4. `TrendsService` maps to `SixMonthTrendModel`.
5. `DashboardController` updates `vm.trends`.
6. `ssTrendsChart` directive renders chart.

### 19.4 Insights & Configuration (Flow 4)

Steps:
1. On dashboard initialization, `ConfigService.getConfig()` is called.
2. Data from ConfigDB or mock files is returned.
3. `ConfigModel` used to configure chart types and feature flags.
4. UI hides or shows components accordingly.

### 19.5 Observability & Audit (Flow 5)

SPA responsibilities:
- Include correlation IDs from backend in any client-side logging.
- Optionally send telemetry events (non-PII) such as dashboard load timings to backend telemetry endpoint (if configured).


## 20. Business Rules

### 20.1 Monthly Summary Business Rules

- Only credit card products are included in totals.
- `totalSpend` and `transactionCount` represent aggregated values from Customer Spend Aggregates DB.
- For months with no data:
  - `totalSpend = 0`, `transactionCount = 0`, `isEmpty = true`.
- Average spend calculation (if provided):
  - `averageSpend = totalSpend / transactionCount` when `transactionCount > 0`, else 0 or null.

### 20.2 Six-Month Trend Business Rules

- Range is last 6 months relative to backend-defined reference (calendar or statement cycle; not decided in HLD; SPA passes `range=6m`).
- Each month’s totals aggregated as per summary rules.
- Missing months are represented explicitly, with zero totals.

### 20.3 Insights Rules

- High-spend months may be visually highlighted if `totalSpend >= highSpendThreshold`.
- Additional insights (category breakdown) rely on `kpiMetrics` and configuration.

### 20.4 Out-of-Scope Rules

- No transaction-level details.
- No non-credit-card products.


## 21. Validation Rules

### 21.1 Client-Side Validation

- Month input:
  - Required.
  - Format regex `^\d{4}-\d{2}$`.
- Range for trends:
  - `maxLookbackMonths` not exceeded (6).

### 21.2 API Request Validation (SPA responsibilities)

- Ensure only valid month strings are sent.
- Ensure only integer values for range (if configurable) are used.

### 21.3 Response Validation

- For summary and trends, validate required fields and data types before mapping to models.
- If validation fails, treat as error and use `ErrorModel`.

### 21.4 Configuration Validation

- Ensure required config fields are present (e.g., `currencyCode`, chart types).
- If missing, fallback to defaults.


## 22. Error Handling

### 22.1 Error Types

- Validation errors (client-side: invalid month).
- API errors (network, timeout, server errors).
- Authorization errors (401/403).
- No data errors (404).

### 22.2 Handling Strategy

- Validation errors:
  - Prevent API call.
  - Show inline message near month input.

- 400/404:
  - Show user-friendly message.
  - Optionally highlight empty state.

- 401/403:
  - Show message like: "Your session has expired. Please sign in again.".
  - Trigger redirect flow (if integrated) or link to login.

- 500/timeout:
  - Show message: "Unable to retrieve spending information at the moment.".
  - Provide Retry button.

### 22.3 ErrorModel Usage

- Map backend error body to `ErrorModel`.
- Display `ErrorModel.message` in UI.
- Use `correlationId` only in logs.


## 23. Logging Design

### 23.1 LoggingService

As described, LoggingService centralizes logging.

### 23.2 Logged Events

- Dashboard initialized.
- Monthly summary load success/failure.
- Trend load success/failure.
- Validation failures (without sensitive input values).

### 23.3 Log Levels

- `info`: successful operations.
- `warn`: validation issues.
- `error`: API failures or unexpected exceptions.

### 23.4 Sensitive Data Handling

- No PII, card numbers, or tokens in logs.
- Use correlation IDs from backend.


## 24. Security Design

### 24.1 Input Validation & Sanitization

- Month parameter validated client-side.
- No direct user input is sent unvalidated.
- Angular Sanitize used for safe HTML binding.

### 24.2 Authentication & Authorization

- SPA relies on IAM and API Gateway for authz.
- All API calls include access token.
- SPA respects 401/403 responses and takes appropriate UX action.

### 24.3 Secure Communication

- All API URLs are HTTPS.

### 24.4 Sensitive Data Handling

- SPA does not process card numbers or PII.
- Only aggregated spend metrics and non-PII identifiers.


## 25. Dependency Map

### 25.1 File-Level Dependencies

- `index.html`:
  - Depends on: AngularJS CDN, Angular modules, CSS.
  - Consumed by: Browser.

- `app.module.js`:
  - Depends on: AngularJS.
  - Consumed by: All Angular components.

- `config.constants.js`:
  - Depends on: `app` module.
  - Consumed by: `SummaryService`, `TrendsService`, `ConfigService`, `DashboardController`.

- `routes.config.js`:
  - Depends on: `app` module, `$routeProvider`.
  - Consumed by: AngularJS routing.

- `dashboard.controller.js`:
  - Depends on: `SummaryService`, `TrendsService`, `ConfigService`, `LoggingService`.
  - Consumed by: `dashboard.html`.

- `summary.service.js`:
  - Depends on: `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.
  - Consumed by: `DashboardController`.

- `trends.service.js`:
  - Same pattern as `summary.service.js`.

- `config.service.js`:
  - Depends on: `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.
  - Consumed by: `DashboardController`.

- `logging.service.js`:
  - Depends on: `$log`.
  - Consumed by: all other services and controller.

- Directive files:
  - Depend on: `app` module, Chart.js (for chart directives).
  - Consumed by: `dashboard.html`.

- Model files:
  - Depend on: nothing external; may be plain JS or Angular factories.
  - Consumed by: `SummaryService`, `TrendsService`, `DashboardController`.

### 25.2 External Dependencies

- AngularJS, Angular Route, Animate, Sanitize, UI Bootstrap, Chart.js (framework libraries).
- API Gateway endpoints per REST contracts.


## 26. LLD Validation Checklist

This section validates the LLD against lldgenerationkb quality gates.

1. **Mandatory Sections Present**: Sections 1–26 included.
2. **Technology Stack**: Uses required versions; no unauthorized frameworks.
3. **Architecture**: SPA, AngularJS MVC, ControllerAs, DI.
4. **Repository Structure**: Fully defined with paths and responsibilities.
5. **Components**: All controllers, services, directives, models, constants defined.
6. **REST Contracts**: Endpoints fully specified with request/response schemas.
7. **Configuration**: ENV_CONFIG and env.*.json defined; mock toggle supported.
8. **Mocks**: Mock services and sample JSON defined; contracts match production.
9. **UI Specification**: Layout, components, responsive behavior, accessibility, states described.
10. **Data Flow**: Success and failure flows documented.
11. **Business Rules**: Documented for monthly summary and trends; no new business scope introduced beyond HLD.
12. **Validation Rules**: For inputs, responses, config.
13. **Error Handling & Logging**: Strategies defined per KB.
14. **Security**: Input validation, secure communication, non-PII handling documented.
15. **No Code Generation**: LLD defines specifications only, no implementation code provided.

All applicable lldgenerationkb rules are satisfied; no missing critical information is identified for QE-3250 based on provided HLD.
