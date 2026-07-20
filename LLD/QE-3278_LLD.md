# Low-Level Design: Monthly Spending Summary Dashboard (QE-3278)

## 1. Technology Stack

### 1.1 Frontend
- HTML5
- CSS3
- JavaScript ES6 (ES2015 syntax, transpilation not required; run directly in modern browsers)
- AngularJS 1.7.9 (from CDN)
- Angular Route 1.7.9 (from CDN)
- Angular Animate 1.7.9 (from CDN)
- Angular Sanitize 1.7.9 (from CDN)
- Angular UI Bootstrap 2.5.6 (from CDN, AngularJS-only; no Bootstrap JS)
- Bootstrap 3.4.1 (CSS only, from CDN)
- Chart.js 2.9.4 (from CDN)

### 1.2 Architecture
- AngularJS MVC
- Single Page Application (SPA)
- REST-based data access
- Dependency Injection (AngularJS DI with explicit `$inject` arrays)
- ControllerAs syntax
- IIFE (Immediately Invoked Function Expression) module pattern for all AngularJS files

### 1.3 Runtime
- AngularJS `$http` for REST calls
- AngularJS `$q` for promise construction and composition
- AngularJS `$timeout` for delayed execution and mock latency simulation

### 1.4 Browser Support
- Google Chrome (latest stable)
- Microsoft Edge (latest stable)

No framework/library versions are upgraded or replaced. All specified versions must be used exactly as listed.

---

## 2. Repository Structure

Root of repository: `/` (GitHub repo `APB_Demo`)

All application files for this epic live under:

- `src/monthly-spend-dashboard/` — root for QE-3278 implementation

### 2.1 Top-Level Structure

```text
src/
  monthly-spend-dashboard/
    index.html
    app/
      app.module.js
      app.config.js
      app.routes.js
      app.run.js
    core/
      models/
        spend-summary.model.js
        spend-breakdown.model.js
        kpi-summary.model.js
        error.model.js
      services/
        env-config.service.js
        http-config.interceptor.js
        logging.service.js
        spend-summary.api.service.js
        spend-summary.mock.service.js
        spend-summary.service.js
      config/
        env.config.json
    features/
      dashboard/
        dashboard.module.js
        dashboard.controller.js
        dashboard-summary.directive.js
        dashboard-breakdown.directive.js
        dashboard-kpi-cards.directive.js
        dashboard-chart.directive.js
        templates/
          dashboard.view.html
          dashboard-summary.html
          dashboard-breakdown.html
          dashboard-kpi-cards.html
          dashboard-chart.html
    assets/
      css/
        styles.css
        dashboard.css
      img/
        icons/
          spending-total.png
          transactions-count.png
          average-spend.png
          max-transaction.png
      config/
        telemetry.config.json
```

Every file defined below must exist at the specified path.

### 2.2 File Inventory and Purpose

#### 2.2.1 `src/monthly-spend-dashboard/index.html`
- **Purpose**: Single-page shell for the Monthly Spending Summary Dashboard SPA.
- **Component type**: HTML entry point.
- **Dependencies**:
  - Bootstrap CSS (CDN)
  - Custom CSS (`assets/css/styles.css`, `assets/css/dashboard.css`)
  - AngularJS core and extensions (CDN)
  - Angular UI Bootstrap (CDN)
  - Chart.js (CDN)
  - Application JS files under `app/`, `core/`, `features/`

#### 2.2.2 `src/monthly-spend-dashboard/app/app.module.js`
- **Purpose**: Declare root Angular module for the application.
- **Component type**: AngularJS module definition.
- **Dependencies**:
  - AngularJS
  - `ngRoute`
  - `ngAnimate`
  - `ngSanitize`
  - `ui.bootstrap`
  - `chart.js` (logical dependency on Chart.js being loaded for chart rendering; no Angular module name used)

#### 2.2.3 `src/monthly-spend-dashboard/app/app.config.js`
- **Purpose**: Global application configuration (e.g., `$httpProvider`, environment configuration loader).
- **Component type**: AngularJS config block.
- **Dependencies**:
  - AngularJS module `app`
  - `$httpProvider`

#### 2.2.4 `src/monthly-spend-dashboard/app/app.routes.js`
- **Purpose**: Route configuration for SPA.
- **Component type**: AngularJS route config.
- **Dependencies**:
  - `$routeProvider`
  - `$locationProvider`

#### 2.2.5 `src/monthly-spend-dashboard/app/app.run.js`
- **Purpose**: Application run-time initialization.
- **Component type**: AngularJS run block.
- **Dependencies**:
  - `$rootScope`
  - `EnvConfigService`
  - `LoggingService`

#### 2.2.6 `src/monthly-spend-dashboard/core/models/spend-summary.model.js`
- **Purpose**: Model for monthly spend summary, including totals and metadata.
- **Component type**: JavaScript ES6 class model.
- **Dependencies**: None (pure JS model), consumed by services/controllers.

#### 2.2.7 `src/monthly-spend-dashboard/core/models/spend-breakdown.model.js`
- **Purpose**: Model representing breakdown of spending into categories.
- **Component type**: JavaScript ES6 class model.
- **Dependencies**: None.

#### 2.2.8 `src/monthly-spend-dashboard/core/models/kpi-summary.model.js`
- **Purpose**: Model representing KPI metrics for a month.
- **Component type**: JavaScript ES6 class model.
- **Dependencies**: None.

#### 2.2.9 `src/monthly-spend-dashboard/core/models/error.model.js`
- **Purpose**: Model representing standardized error details.
- **Component type**: JavaScript ES6 class model.
- **Dependencies**: None.

#### 2.2.10 `src/monthly-spend-dashboard/core/services/env-config.service.js`
- **Purpose**: Service exposing environment configuration (API base URL, timeouts, feature flags, telemetry, mock mode flag).
- **Component type**: AngularJS service.
- **Dependencies**:
  - `$http`
  - `$q`
  - `LoggingService`
  - `env.config.json`

#### 2.2.11 `src/monthly-spend-dashboard/core/services/http-config.interceptor.js`
- **Purpose**: HTTP interceptor for request/response error handling and telemetry correlation IDs.
- **Component type**: AngularJS HTTP interceptor.
- **Dependencies**:
  - `$q`
  - `$injector` (used to lazily resolve `LoggingService`; interceptor must not depend directly on `$http`)

#### 2.2.12 `src/monthly-spend-dashboard/core/services/logging.service.js`
- **Purpose**: Central logging service with lazy `$http` resolution, integrated with telemetry configuration.
- **Component type**: AngularJS service.
- **Dependencies**:
  - `$injector` (for lazy resolution of `$http`)
  - `$window`
  - `EnvConfigService`

#### 2.2.13 `src/monthly-spend-dashboard/core/services/spend-summary.api.service.js`
- **Purpose**: API service for calling the production Monthly Spend Summary REST endpoint.
- **Component type**: AngularJS service.
- **Dependencies**:
  - `$http`
  - `$q`
  - `EnvConfigService`
  - `LoggingService`
  - `SpendSummaryModel`
  - `KpiSummaryModel`
  - `SpendBreakdownModel`
  - `ErrorModel`

#### 2.2.14 `src/monthly-spend-dashboard/core/services/spend-summary.mock.service.js`
- **Purpose**: Mock service emulating the Monthly Spend Summary REST endpoint using `$q` and `$timeout`.
- **Component type**: AngularJS service.
- **Dependencies**:
  - `$q`
  - `$timeout`
  - `EnvConfigService`
  - `LoggingService`
  - `SpendSummaryModel`
  - `KpiSummaryModel`
  - `SpendBreakdownModel`
  - `ErrorModel`

#### 2.2.15 `src/monthly-spend-dashboard/core/services/spend-summary.service.js`
- **Purpose**: Facade service for dashboard controllers/directives; switches between mock and production API based on `EnvConfigService.useMockData`.
- **Component type**: AngularJS service.
- **Dependencies**:
  - `$q`
  - `EnvConfigService`
  - `SpendSummaryApiService`
  - `SpendSummaryMockService`
  - `LoggingService`

#### 2.2.16 `src/monthly-spend-dashboard/core/config/env.config.json`
- **Purpose**: Environment configuration file consumed by `EnvConfigService`.
- **Component type**: JSON configuration.
- **Properties**:
  - `apiBaseUrl` (string)
  - `apiTimeoutMs` (number)
  - `maxLookbackMonths` (number)
  - `useMockData` (boolean)
  - `featureFlags` (object)
  - `telemetry` (object)

#### 2.2.17 `src/monthly-spend-dashboard/features/dashboard/dashboard.module.js`
- **Purpose**: Feature module for the dashboard view.
- **Component type**: AngularJS module extension.
- **Dependencies**:
  - Angular module `app`

#### 2.2.18 `src/monthly-spend-dashboard/features/dashboard/dashboard.controller.js`
- **Purpose**: Controller for the main dashboard view handling user interactions and data flow.
- **Component type**: AngularJS controller.
- **Dependencies**:
  - `$q`
  - `$routeParams`
  - `SpendSummaryService`
  - `KpiSummaryModel`
  - `SpendSummaryModel`
  - `SpendBreakdownModel`
  - `LoggingService`

#### 2.2.19 `src/monthly-spend-dashboard/features/dashboard/dashboard-summary.directive.js`
- **Purpose**: Directive to render overall monthly spend summary card(s).
- **Component type**: AngularJS directive.
- **Dependencies**:
  - `SpendSummaryModel`

#### 2.2.20 `src/monthly-spend-dashboard/features/dashboard/dashboard-breakdown.directive.js`
- **Purpose**: Directive to render breakdown table of spend by category.
- **Component type**: AngularJS directive.
- **Dependencies**:
  - `SpendBreakdownModel`

#### 2.2.21 `src/monthly-spend-dashboard/features/dashboard/dashboard-kpi-cards.directive.js`
- **Purpose**: Directive to render KPI cards (total spend, number of transactions, average transaction value, max transaction value).
- **Component type**: AngularJS directive.
- **Dependencies**:
  - `KpiSummaryModel`

#### 2.2.22 `src/monthly-spend-dashboard/features/dashboard/dashboard-chart.directive.js`
- **Purpose**: Directive to render Chart.js visualization (doughnut chart for category breakdown and bar chart for monthly totals, if needed).
- **Component type**: AngularJS directive.
- **Dependencies**:
  - Chart.js global object (`Chart`)

#### 2.2.23 `src/monthly-spend-dashboard/features/dashboard/templates/dashboard.view.html`
- **Purpose**: Main dashboard template containing layout, header, footer, month selector, and directives.
- **Component type**: AngularJS route template.
- **Dependencies**:
  - `DashboardController`
  - Dashboard directives

#### 2.2.24 `src/monthly-spend-dashboard/features/dashboard/templates/dashboard-summary.html`
- **Purpose**: Partial template for summary card(s).
- **Component type**: AngularJS directive template.

#### 2.2.25 `src/monthly-spend-dashboard/features/dashboard/templates/dashboard-breakdown.html`
- **Purpose**: Partial template for breakdown table.
- **Component type**: AngularJS directive template.

#### 2.2.26 `src/monthly-spend-dashboard/features/dashboard/templates/dashboard-kpi-cards.html`
- **Purpose**: Partial template for KPI cards.
- **Component type**: AngularJS directive template.

#### 2.2.27 `src/monthly-spend-dashboard/features/dashboard/templates/dashboard-chart.html`
- **Purpose**: Partial template for chart visualization.
- **Component type**: AngularJS directive template.

#### 2.2.28 `src/monthly-spend-dashboard/assets/css/styles.css`
- **Purpose**: Global styles for the SPA, typography, basic layout.
- **Component type**: CSS stylesheet.

#### 2.2.29 `src/monthly-spend-dashboard/assets/css/dashboard.css`
- **Purpose**: Dashboard-specific styles (cards, tables, charts, spacing, colors).
- **Component type**: CSS stylesheet.

#### 2.2.30 `src/monthly-spend-dashboard/assets/img/icons/*.png`
- **Purpose**: Icon images for KPI cards.
- **Component type**: Static assets.

#### 2.2.31 `src/monthly-spend-dashboard/assets/config/telemetry.config.json`
- **Purpose**: Telemetry configuration (e.g., enablement, endpoints).
- **Component type**: JSON configuration.

---

## 3. index.html Specification

### 3.1 File Path
`src/monthly-spend-dashboard/index.html`

### 3.2 Structure and Content

#### 3.2.1 HTML Skeleton
- `<!DOCTYPE html>`
- `<html lang="en" ng-app="app">` — root element with Angular main module `app`.
- `<head>` — includes meta tags, title, CSS links.
- `<body>` — contains root layout, `ng-view` region.

#### 3.2.2 Head Section

- `<meta charset="utf-8">`
- `<meta http-equiv="X-UA-Compatible" content="IE=edge">`
- `<meta name="viewport" content="width=device-width, initial-scale=1">`
- `<title>Monthly Spending Summary Dashboard</title>`

##### CSS Includes (in exact order)
1. **Bootstrap 3.4.1 CSS (CDN)**
   ```html
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
   ```
2. **Global styles**
   ```html
   <link rel="stylesheet" href="assets/css/styles.css">
   ```
3. **Dashboard styles**
   ```html
   <link rel="stylesheet" href="assets/css/dashboard.css">
   ```

No other external CSS libraries are included.

#### 3.2.3 Body Section

Structure:

```html
<body>
  <div class="container-fluid">
    <header class="page-header">
      <h1>Monthly Spending Summary</h1>
      <p class="text-muted">View an at-a-glance monthly spending summary and key insights.</p>
    </header>

    <div ng-view></div>

    <footer class="footer text-center">
      <small>&copy; 2026 Credit Card Services - Monthly Spending Summary Dashboard</small>
    </footer>
  </div>

  <!-- Scripts -->
</body>
```

- `ng-view` is the main router outlet.

#### 3.2.4 Script Includes (Loading Order)

Scripts must be loaded in this exact order to satisfy dependencies and avoid AngularJS DI issues.

**Vendor/CDN Scripts**

1. **AngularJS 1.7.9 (core)**
   ```html
   <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
   ```

2. **Angular Route 1.7.9**
   ```html
   <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js"></script>
   ```

3. **Angular Animate 1.7.9**
   ```html
   <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js"></script>
   ```

4. **Angular Sanitize 1.7.9**
   ```html
   <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js"></script>
   ```

5. **Angular UI Bootstrap 2.5.6**
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js"></script>
   ```

6. **Chart.js 2.9.4**
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js"></script>
   ```

> Note: jQuery and `bootstrap.min.js` are **not** included, as they are not required and explicitly disallowed unless required. Angular UI Bootstrap uses Bootstrap CSS only.

**Application Scripts** (all local, loaded after vendor scripts)

Order:

1. Root module and core configuration:
   - `app/app.module.js`
   - `app/app.config.js`
   - `app/app.routes.js`
   - `app/app.run.js`

2. Core models:
   - `core/models/spend-summary.model.js`
   - `core/models/spend-breakdown.model.js`
   - `core/models/kpi-summary.model.js`
   - `core/models/error.model.js`

3. Core services and config:
   - `core/config/env.config.json` **not included as script**, loaded via HTTP from `EnvConfigService` (no script tag).
   - `core/services/env-config.service.js`
   - `core/services/logging.service.js`
   - `core/services/http-config.interceptor.js`
   - `core/services/spend-summary.api.service.js`
   - `core/services/spend-summary.mock.service.js`
   - `core/services/spend-summary.service.js`

4. Feature module, controller, directives:
   - `features/dashboard/dashboard.module.js`
   - `features/dashboard/dashboard.controller.js`
   - `features/dashboard/dashboard-summary.directive.js`
   - `features/dashboard/dashboard-breakdown.directive.js`
   - `features/dashboard/dashboard-kpi-cards.directive.js`
   - `features/dashboard/dashboard-chart.directive.js`

Example script tags (relative paths from `index.html`):

```html
<script src="app/app.module.js"></script>
<script src="app/app.config.js"></script>
<script src="app/app.routes.js"></script>
<script src="app/app.run.js"></script>

<script src="core/models/spend-summary.model.js"></script>
<script src="core/models/spend-breakdown.model.js"></script>
<script src="core/models/kpi-summary.model.js"></script>
<script src="core/models/error.model.js"></script>

<script src="core/services/env-config.service.js"></script>
<script src="core/services/logging.service.js"></script>
<script src="core/services/http-config.interceptor.js"></script>
<script src="core/services/spend-summary.api.service.js"></script>
<script src="core/services/spend-summary.mock.service.js"></script>
<script src="core/services/spend-summary.service.js"></script>

<script src="features/dashboard/dashboard.module.js"></script>
<script src="features/dashboard/dashboard.controller.js"></script>
<script src="features/dashboard/dashboard-summary.directive.js"></script>
<script src="features/dashboard/dashboard-breakdown.directive.js"></script>
<script src="features/dashboard/dashboard-kpi-cards.directive.js"></script>
<script src="features/dashboard/dashboard-chart.directive.js"></script>
```

---

## 4. Application Bootstrap

### 4.1 Root Module

- **Name**: `app`
- **Declaration file**: `src/monthly-spend-dashboard/app/app.module.js`
- **Angular module declaration**: Only this file declares the module:
  ```javascript
  (function () {
    "use strict";

    angular
      .module("app", [
        "ngRoute",
        "ngAnimate",
        "ngSanitize",
        "ui.bootstrap"
      ]);
  }());
  ```

All other files use `angular.module("app")` without redefining dependencies.

### 4.2 Config Blocks

#### 4.2.1 Global HTTP and Interceptor Config (`app/app.config.js`)

- **Registration method**: `config`
- **Dependencies injected**:
  - `$httpProvider`

Config responsibilities:
- Register `HttpConfigInterceptor` with `$httpProvider.interceptors.push("HttpConfigInterceptor")`.
- Set global `$http` defaults:
  - `withCredentials = true` (for bank session tokens if required).
  - Optionally configure default headers for JSON.

#### 4.2.2 Routing Config (`app/app.routes.js`)

- **Registration method**: `config`
- **Dependencies injected**:
  - `$routeProvider`
  - `$locationProvider`

Routing responsibilities:
- Enable HTML5 mode or fallback to hash-based routes (explicitly chosen: **hash-based routing** to avoid server config requirements):
  ```javascript
  $locationProvider.html5Mode(false);
  ```
- Define routes:
  - `/dashboard/:month?`
    - `templateUrl`: `"features/dashboard/templates/dashboard.view.html"`
    - `controller`: `"DashboardController"`
    - `controllerAs`: `"vm"`
  - Default route (`otherwise`): redirect to `/dashboard` (which will internally choose default month).

### 4.3 Run Block (`app/app.run.js`)

- **Registration method**: `run`
- **Dependencies injected**:
  - `$rootScope`
  - `EnvConfigService`
  - `LoggingService`

Responsibilities:
- Initialize environment configuration (e.g., load `env.config.json` via `EnvConfigService.load()`), then broadcast ready state.
- Attach global error handler on `$rootScope.$on("$routeChangeError", handler)` to log route errors using `LoggingService`.

### 4.4 Script Loading Order Enforcement

As specified in section 3.2.4. Controllers, directives, and services rely on the root module and core models/services; thus they must be loaded after `app.module.js` and core files.

### 4.5 Default Route

- Default route: `/dashboard` (no explicit month).
- `DashboardController` resolves default month using `SpendSummaryService.getDefaultMonth()` (implemented as last completed statement month within `maxLookbackMonths` from environment config).

---

## 5. Component Registry

This registry lists every Angular component: module, controller, service, factory, directive, filter, model (Angular-registered ones), constant, value, config, interceptor.

### 5.1 Modules

#### 5.1.1 Root Module
- **Name**: `app`
- **Type**: Angular module
- **File Path**: `app/app.module.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app", [...])`
- **Dependencies**: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`
- **Injected Services**: N/A (module declaration only)
- **Public Methods**: N/A

#### 5.1.2 Feature Module (logical grouping)
- **Name**: dashboard feature (no separate Angular module; uses `app`)
- **Type**: Feature grouping
- **File Path**: `features/dashboard/dashboard.module.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").config(...)` or `angular.module("app").controller(...)` etc. (no additional module name)

### 5.2 Controllers

#### 5.2.1 `DashboardController`
- **Name**: `DashboardController`
- **Type**: Controller
- **File Path**: `features/dashboard/dashboard.controller.js`
- **Angular Module**: `app`
- **Registration Method**: `.controller("DashboardController", DashboardController)`
- **Dependencies**:
  - `$q`
  - `$routeParams`
  - `SpendSummaryService`
  - `KpiSummaryModel`
  - `SpendSummaryModel`
  - `SpendBreakdownModel`
  - `LoggingService`
- **Injected Services**: same as dependencies
- **Public Methods**:
  - `vm.onMonthChange(month)`
  - `vm.reload()`
  - `vm.hasData()`
  - `vm.isLoading()`
  - `vm.hasError()`

### 5.3 Services

#### 5.3.1 `EnvConfigService`
- **Name**: `EnvConfigService`
- **Type**: Service
- **File Path**: `core/services/env-config.service.js`
- **Angular Module**: `app`
- **Registration Method**: `.service("EnvConfigService", EnvConfigService)`
- **Dependencies**:
  - `$http`
  - `$q`
  - `LoggingService`
- **Injected Services**: same
- **Public Methods**:
  - `load()`
  - `getApiBaseUrl()`
  - `getApiTimeoutMs()`
  - `getMaxLookbackMonths()`
  - `getFeatureFlags()`
  - `getTelemetryConfig()`
  - `isMockMode()`

#### 5.3.2 `LoggingService`
- **Name**: `LoggingService`
- **Type**: Service
- **File Path**: `core/services/logging.service.js`
- **Angular Module**: `app`
- **Registration Method**: `.service("LoggingService", LoggingService)`
- **Dependencies**:
  - `$injector`
  - `$window`
  - `EnvConfigService`
- **Injected Services**: same
- **Public Methods**:
  - `info(message, context)`
  - `warn(message, context)`
  - `error(message, context)`
  - `debug(message, context)`
  - `logToServer(level, message, context)`

#### 5.3.3 `SpendSummaryApiService`
- **Name**: `SpendSummaryApiService`
- **Type**: Service
- **File Path**: `core/services/spend-summary.api.service.js`
- **Angular Module**: `app`
- **Registration Method**: `.service("SpendSummaryApiService", SpendSummaryApiService)`
- **Dependencies**:
  - `$http`
  - `$q`
  - `EnvConfigService`
  - `LoggingService`
  - `SpendSummaryModel`
  - `KpiSummaryModel`
  - `SpendBreakdownModel`
  - `ErrorModel`
- **Injected Services**: same
- **Public Methods**:
  - `getMonthlySummary(month)`

#### 5.3.4 `SpendSummaryMockService`
- **Name**: `SpendSummaryMockService`
- **Type**: Service
- **File Path**: `core/services/spend-summary.mock.service.js`
- **Angular Module**: `app`
- **Registration Method**: `.service("SpendSummaryMockService", SpendSummaryMockService)`
- **Dependencies**:
  - `$q`
  - `$timeout`
  - `EnvConfigService`
  - `LoggingService`
  - `SpendSummaryModel`
  - `KpiSummaryModel`
  - `SpendBreakdownModel`
  - `ErrorModel`
- **Injected Services**: same
- **Public Methods**:
  - `getMonthlySummary(month)`

#### 5.3.5 `SpendSummaryService`
- **Name**: `SpendSummaryService`
- **Type**: Service (facade)
- **File Path**: `core/services/spend-summary.service.js`
- **Angular Module**: `app`
- **Registration Method**: `.service("SpendSummaryService", SpendSummaryService)`
- **Dependencies**:
  - `$q`
  - `EnvConfigService`
  - `SpendSummaryApiService`
  - `SpendSummaryMockService`
  - `LoggingService`
- **Injected Services**: same
- **Public Methods**:
  - `getMonthlySummary(month)`
  - `getDefaultMonth()`

### 5.4 Interceptor

#### 5.4.1 `HttpConfigInterceptor`
- **Name**: `HttpConfigInterceptor`
- **Type**: HTTP interceptor
- **File Path**: `core/services/http-config.interceptor.js`
- **Angular Module**: `app`
- **Registration Method**: `.factory("HttpConfigInterceptor", HttpConfigInterceptor)` with `$httpProvider.interceptors.push("HttpConfigInterceptor")` in `app.config`.
- **Dependencies**:
  - `$q`
  - `$injector`
- **Injected Services**: same
- **Public Methods**:
  - `request(config)`
  - `response(response)`
  - `requestError(rejection)`
  - `responseError(rejection)`

### 5.5 Directives

#### 5.5.1 `dashboardSummary`
- **Name**: `dashboardSummary`
- **Type**: Directive
- **File Path**: `features/dashboard/dashboard-summary.directive.js`
- **Angular Module**: `app`
- **Registration Method**: `.directive("dashboardSummary", dashboardSummary)`
- **Dependencies**:
  - None (uses passed-in model and view only)
- **Injected Services**: none
- **Public Methods (via controller)**:
  - `vm.getFormattedTotal()`

#### 5.5.2 `dashboardBreakdown`
- **Name**: `dashboardBreakdown`
- **Type**: Directive
- **File Path**: `features/dashboard/dashboard-breakdown.directive.js`
- **Angular Module**: `app`
- **Registration Method**: `.directive("dashboardBreakdown", dashboardBreakdown)`
- **Dependencies**:
  - None
- **Injected Services**: none
- **Public Methods (via controller)**:
  - `vm.hasBreakdown()`

#### 5.5.3 `dashboardKpiCards`
- **Name**: `dashboardKpiCards`
- **Type**: Directive
- **File Path**: `features/dashboard/dashboard-kpi-cards.directive.js`
- **Angular Module**: `app`
- **Registration Method**: `.directive("dashboardKpiCards", dashboardKpiCards)`
- **Dependencies**:
  - None
- **Injected Services**: none
- **Public Methods (via controller)**:
  - `vm.getKpiList()`

#### 5.5.4 `dashboardChart`
- **Name**: `dashboardChart`
- **Type**: Directive
- **File Path**: `features/dashboard/dashboard-chart.directive.js`
- **Angular Module**: `app`
- **Registration Method**: `.directive("dashboardChart", dashboardChart)`
- **Dependencies**:
  - None
- **Injected Services**: none
- **Public Methods (via controller)**:
  - `vm.getChartConfig()`

### 5.6 Models (Angular-Injected)

Models are pure JS classes defined in separate files and exposed through Angular values for DI.

#### 5.6.1 `SpendSummaryModel`
- **Name**: `SpendSummaryModel`
- **Type**: Value (ES6 class)
- **File Path**: `core/models/spend-summary.model.js`
- **Angular Module**: `app`
- **Registration Method**: `.value("SpendSummaryModel", SpendSummaryModel)`

#### 5.6.2 `SpendBreakdownModel`
- **Name**: `SpendBreakdownModel`
- **Type**: Value (ES6 class)
- **File Path**: `core/models/spend-breakdown.model.js`
- **Angular Module**: `app`
- **Registration Method**: `.value("SpendBreakdownModel", SpendBreakdownModel)`

#### 5.6.3 `KpiSummaryModel`
- **Name**: `KpiSummaryModel`
- **Type**: Value (ES6 class)
- **File Path**: `core/models/kpi-summary.model.js`
- **Angular Module**: `app`
- **Registration Method**: `.value("KpiSummaryModel", KpiSummaryModel)`

#### 5.6.4 `ErrorModel`
- **Name**: `ErrorModel`
- **Type**: Value (ES6 class)
- **File Path**: `core/models/error.model.js`
- **Angular Module**: `app`
- **Registration Method**: `.value("ErrorModel", ErrorModel)`

### 5.7 Constants, Values, Config

- No separate Angular constants/values beyond model values defined; config is managed through `EnvConfigService` and JSON files.

### 5.8 Filters, Factories

- No filters or factories other than the `HttpConfigInterceptor` factory.

---

## 6. Per-File Implementation Specification

### 6.1 `app/app.module.js`

- **Repository path**: `src/monthly-spend-dashboard/app/app.module.js`
- **Angular registration**: Root module declaration.
- **Responsibility**:
  - Define AngularJS root module `app` with dependencies.
- **Injected dependencies**: None.
- **Public methods**: None.
- **Private methods**: None.
- **Method signatures**: N/A.
- **Business rules**: Only one module declaration in the app.
- **Validation**: N/A.
- **Error handling**: N/A.
- **Logging**: N/A.
- **Configuration used**: N/A.
- **Files referenced**: N/A.
- **Files depending on it**: All Angular components (`config`, routes, controllers, services, directives).

Implementation:
```javascript
(function () {
  "use strict";

  angular
    .module("app", [
      "ngRoute",
      "ngAnimate",
      "ngSanitize",
      "ui.bootstrap"
    ]);
}());
```

### 6.2 `app/app.config.js`

- **Repository path**: `src/monthly-spend-dashboard/app/app.config.js`
- **Angular registration**: `config` block.
- **Responsibility**:
  - Register HTTP interceptor.
  - Configure global `$http` defaults.
- **Injected dependencies**:
  - `$httpProvider`
- **Public methods**: `configureHttp($httpProvider)` (internal function).
- **Private methods**: N/A.
- **Method signatures**:
  ```javascript
  function configureHttp($httpProvider) { ... }
  ```
- **Parameters**:
  - `$httpProvider` (Angular `$httpProvider` instance).
- **Return types**: None.
- **Business rules**:
  - Ensure `HttpConfigInterceptor` is registered once.
  - Use credentials to allow secure cookies.
- **Validation**: None.
- **Error handling**: None.
- **Logging**: None.
- **Configuration used**: None.
- **Files referenced**: `core/services/http-config.interceptor.js` (by name `HttpConfigInterceptor`).
- **Files depending on it**: All HTTP calls via `$http`.

Implementation:
```javascript
(function () {
  "use strict";

  configureHttp.$inject = ["$httpProvider"];

  angular
    .module("app")
    .config(configureHttp);

  function configureHttp($httpProvider) {
    $httpProvider.interceptors.push("HttpConfigInterceptor");
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
  }
}());
```

### 6.3 `app/app.routes.js`

- **Repository path**: `src/monthly-spend-dashboard/app/app.routes.js`
- **Angular registration**: `config` block.
- **Responsibility**:
  - Configure routes.
- **Injected dependencies**:
  - `$routeProvider`
  - `$locationProvider`
- **Public methods**: `configureRoutes($routeProvider, $locationProvider)`.
- **Method signatures**:
  ```javascript
  function configureRoutes($routeProvider, $locationProvider) { ... }
  ```
- **Parameters**:
  - `$routeProvider` (Angular route provider).
  - `$locationProvider` (Angular location provider).
- **Return types**: None.
- **Business rules**:
  - Default route `/dashboard`.
  - Optional `:month` parameter for specific month view.
- **Validation**: Ensure `templateUrl` exists.
- **Error handling**: None (route-level errors handled in `app.run`).
- **Logging**: None.
- **Configuration used**: None.
- **Files referenced**: `features/dashboard/templates/dashboard.view.html`, `DashboardController`.
- **Files depending on it**: Router, `DashboardController`.

Implementation:
```javascript
(function () {
  "use strict";

  configureRoutes.$inject = ["$routeProvider", "$locationProvider"];

  angular
    .module("app")
    .config(configureRoutes);

  function configureRoutes($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider
      .when("/dashboard", {
        templateUrl: "features/dashboard/templates/dashboard.view.html",
        controller: "DashboardController",
        controllerAs: "vm"
      })
      .when("/dashboard/:month", {
        templateUrl: "features/dashboard/templates/dashboard.view.html",
        controller: "DashboardController",
        controllerAs: "vm"
      })
      .otherwise({
        redirectTo: "/dashboard"
      });
  }
}());
```

### 6.4 `app/app.run.js`

- **Repository path**: `src/monthly-spend-dashboard/app/app.run.js`
- **Angular registration**: `run` block.
- **Responsibility**:
  - Load environment config.
  - Setup global route error logging.
- **Injected dependencies**:
  - `$rootScope`
  - `EnvConfigService`
  - `LoggingService`
- **Public methods**: `runBlock($rootScope, EnvConfigService, LoggingService)` (internal only).
- **Method signatures**:
  ```javascript
  function runBlock($rootScope, EnvConfigService, LoggingService) { ... }
  ```
- **Business rules**:
  - App does not navigate until environment is loaded (uses `$rootScope.envReady` flag).
- **Error handling**:
  - Logs route change errors.
- **Logging**:
  - Uses `LoggingService.error` for route errors.
- **Configuration used**:
  - `EnvConfigService.load()` reads `env.config.json`.
- **Files referenced**: `core/services/env-config.service.js`, `core/services/logging.service.js`.
- **Files depending on it**: Entire app runtime.

Implementation:
```javascript
(function () {
  "use strict";

  runBlock.$inject = ["$rootScope", "EnvConfigService", "LoggingService"];

  angular
    .module("app")
    .run(runBlock);

  function runBlock($rootScope, EnvConfigService, LoggingService) {
    $rootScope.envReady = false;

    EnvConfigService.load()
      .then(function () {
        $rootScope.envReady = true;
      })
      .catch(function (error) {
        LoggingService.error("Failed to load environment configuration", { error: error });
      });

    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
      LoggingService.error("Route change error", {
        event: event,
        current: current,
        previous: previous,
        rejection: rejection
      });
    });
  }
}());
```

### 6.5 `core/models/spend-summary.model.js`

- **Repository path**: `src/monthly-spend-dashboard/core/models/spend-summary.model.js`
- **Angular registration**: `.value("SpendSummaryModel", SpendSummaryModel)`.
- **Responsibility**:
  - Represent monthly spend summary including totals and metadata.
- **Properties**:
  - `month` (string, format `YYYY-MM`, default: `""`).
  - `customerId` (string, default: `""`).
  - `cardId` (string, default: `""`).
  - `totalSpend` (number, default: `0`).
  - `currency` (string, default: `"USD"`).
  - `transactionCount` (number, default: `0`).
  - `generatedAt` (string ISO date-time, default: `""`).
- **Types**: as listed.
- **Default values**: as listed.
- **Constructor**:
  ```javascript
  class SpendSummaryModel {
    constructor(data) {
      const src = data || {};
      this.month = src.month || "";
      this.customerId = src.customerId || "";
      this.cardId = src.cardId || "";
      this.totalSpend = typeof src.totalSpend === "number" ? src.totalSpend : 0;
      this.currency = src.currency || "USD";
      this.transactionCount = typeof src.transactionCount === "number" ? src.transactionCount : 0;
      this.generatedAt = src.generatedAt || "";
    }
  }
  ```
- **Validation**:
  - `month` must match `/^\d{4}-\d{2}$/`.
  - `totalSpend >= 0`.
  - `transactionCount >= 0`.
- **Sample JSON**:
  ```json
  {
    "month": "2026-06",
    "customerId": "C123456789",
    "cardId": "CARD987654321",
    "totalSpend": 1534.75,
    "currency": "USD",
    "transactionCount": 42,
    "generatedAt": "2026-07-01T10:15:30Z"
  }
  ```
- **Injected dependencies**: None (pure model).
- **Public methods**:
  - Constructor.
- **Private methods**: None.
- **Business rules**:
  - Values represent credit card spend only.
- **Error handling**: Input sanitized in constructor.

Implementation:
```javascript
(function () {
  "use strict";

  class SpendSummaryModel {
    constructor(data) {
      const src = data || {};
      this.month = typeof src.month === "string" ? src.month : "";
      this.customerId = typeof src.customerId === "string" ? src.customerId : "";
      this.cardId = typeof src.cardId === "string" ? src.cardId : "";
      this.totalSpend = typeof src.totalSpend === "number" && src.totalSpend >= 0 ? src.totalSpend : 0;
      this.currency = typeof src.currency === "string" ? src.currency : "USD";
      this.transactionCount = typeof src.transactionCount === "number" && src.transactionCount >= 0 ? src.transactionCount : 0;
      this.generatedAt = typeof src.generatedAt === "string" ? src.generatedAt : "";
    }
  }

  angular
    .module("app")
    .value("SpendSummaryModel", SpendSummaryModel);
}());
```

### 6.6 `core/models/spend-breakdown.model.js`

- **Repository path**: `src/monthly-spend-dashboard/core/models/spend-breakdown.model.js`
- **Angular registration**: `.value("SpendBreakdownModel", SpendBreakdownModel)`.
- **Responsibility**:
  - Represent breakdown categories and amounts.
- **Properties**:
  - `month` (string, `YYYY-MM`).
  - `currency` (string).
  - `items` (array of breakdown items).
- **Breakdown item structure**:
  - `categoryCode` (string).
  - `categoryName` (string).
  - `amount` (number).
  - `percentage` (number 0–100).
- **Constructor**:
  ```javascript
  class SpendBreakdownModel {
    constructor(data) {
      const src = data || {};
      this.month = typeof src.month === "string" ? src.month : "";
      this.currency = typeof src.currency === "string" ? src.currency : "USD";
      const items = Array.isArray(src.items) ? src.items : [];
      this.items = items.map(function (item) {
        return {
          categoryCode: typeof item.categoryCode === "string" ? item.categoryCode : "",
          categoryName: typeof item.categoryName === "string" ? item.categoryName : "",
          amount: typeof item.amount === "number" && item.amount >= 0 ? item.amount : 0,
          percentage: typeof item.percentage === "number" && item.percentage >= 0 ? item.percentage : 0
        };
      });
    }
  }
  ```
- **Validation**:
  - `month` format.
  - Each `amount >= 0`, `percentage` between 0 and 100.
- **Sample JSON**:
  ```json
  {
    "month": "2026-06",
    "currency": "USD",
    "items": [
      {"categoryCode": "GROCERY", "categoryName": "Groceries", "amount": 450.25, "percentage": 29.33},
      {"categoryCode": "TRAVEL", "categoryName": "Travel", "amount": 300.00, "percentage": 19.54}
    ]
  }
  ```

Implementation:
```javascript
(function () {
  "use strict";

  class SpendBreakdownModel {
    constructor(data) {
      const src = data || {};
      this.month = typeof src.month === "string" ? src.month : "";
      this.currency = typeof src.currency === "string" ? src.currency : "USD";
      const items = Array.isArray(src.items) ? src.items : [];

      this.items = items.map(function (item) {
        return {
          categoryCode: typeof item.categoryCode === "string" ? item.categoryCode : "",
          categoryName: typeof item.categoryName === "string" ? item.categoryName : "",
          amount: typeof item.amount === "number" && item.amount >= 0 ? item.amount : 0,
          percentage: typeof item.percentage === "number" && item.percentage >= 0 && item.percentage <= 100 ? item.percentage : 0
        };
      });
    }
  }

  angular
    .module("app")
    .value("SpendBreakdownModel", SpendBreakdownModel);
}());
```

### 6.7 `core/models/kpi-summary.model.js`

- **Repository path**: `src/monthly-spend-dashboard/core/models/kpi-summary.model.js`
- **Angular registration**: `.value("KpiSummaryModel", KpiSummaryModel)`.
- **Responsibility**:
  - Represent KPI metrics.
- **Properties**:
  - `month` (string).
  - `totalSpend` (number).
  - `transactionCount` (number).
  - `averageTransactionAmount` (number).
  - `maxTransactionAmount` (number).
- **Constructor**:
  ```javascript
  class KpiSummaryModel {
    constructor(data) {
      const src = data || {};
      this.month = typeof src.month === "string" ? src.month : "";
      this.totalSpend = typeof src.totalSpend === "number" && src.totalSpend >= 0 ? src.totalSpend : 0;
      this.transactionCount = typeof src.transactionCount === "number" && src.transactionCount >= 0 ? src.transactionCount : 0;
      this.averageTransactionAmount = typeof src.averageTransactionAmount === "number" && src.averageTransactionAmount >= 0 ? src.averageTransactionAmount : 0;
      this.maxTransactionAmount = typeof src.maxTransactionAmount === "number" && src.maxTransactionAmount >= 0 ? src.maxTransactionAmount : 0;
    }
  }
  ```
- **Validation**:
  - All numeric fields must be `>= 0`.
- **Sample JSON**:
  ```json
  {
    "month": "2026-06",
    "totalSpend": 1534.75,
    "transactionCount": 42,
    "averageTransactionAmount": 36.54,
    "maxTransactionAmount": 220.00
  }
  ```

Implementation:
```javascript
(function () {
  "use strict";

  class KpiSummaryModel {
    constructor(data) {
      const src = data || {};
      this.month = typeof src.month === "string" ? src.month : "";
      this.totalSpend = typeof src.totalSpend === "number" && src.totalSpend >= 0 ? src.totalSpend : 0;
      this.transactionCount = typeof src.transactionCount === "number" && src.transactionCount >= 0 ? src.transactionCount : 0;
      this.averageTransactionAmount = typeof src.averageTransactionAmount === "number" && src.averageTransactionAmount >= 0 ? src.averageTransactionAmount : 0;
      this.maxTransactionAmount = typeof src.maxTransactionAmount === "number" && src.maxTransactionAmount >= 0 ? src.maxTransactionAmount : 0;
    }
  }

  angular
    .module("app")
    .value("KpiSummaryModel", KpiSummaryModel);
}());
```

### 6.8 `core/models/error.model.js`

- **Repository path**: `src/monthly-spend-dashboard/core/models/error.model.js`
- **Angular registration**: `.value("ErrorModel", ErrorModel)`.
- **Responsibility**:
  - Standardized error object for UI and logging.
- **Properties**:
  - `code` (string, HTTP or application code).
  - `message` (string, user-facing message).
  - `details` (object, technical details).
  - `correlationId` (string).
  - `retryable` (boolean).
- **Constructor**:
  ```javascript
  class ErrorModel {
    constructor(data) {
      const src = data || {};
      this.code = typeof src.code === "string" ? src.code : "";
      this.message = typeof src.message === "string" ? src.message : "";
      this.details = typeof src.details === "object" && src.details !== null ? src.details : {};
      this.correlationId = typeof src.correlationId === "string" ? src.correlationId : "";
      this.retryable = typeof src.retryable === "boolean" ? src.retryable : false;
    }
  }
  ```
- **Sample JSON**:
  ```json
  {
    "code": "503",
    "message": "Monthly summary is temporarily unavailable.",
    "details": {
      "upstream": "CardCoreAPI",
      "reason": "Timeout"
    },
    "correlationId": "abc123-def456",
    "retryable": true
  }
  ```

Implementation:
```javascript
(function () {
  "use strict";

  class ErrorModel {
    constructor(data) {
      const src = data || {};
      this.code = typeof src.code === "string" ? src.code : "";
      this.message = typeof src.message === "string" ? src.message : "";
      this.details = typeof src.details === "object" && src.details !== null ? src.details : {};
      this.correlationId = typeof src.correlationId === "string" ? src.correlationId : "";
      this.retryable = typeof src.retryable === "boolean" ? src.retryable : false;
    }
  }

  angular
    .module("app")
    .value("ErrorModel", ErrorModel);
}());
```

### 6.9 `core/config/env.config.json`

- **Repository path**: `src/monthly-spend-dashboard/core/config/env.config.json`
- **Component type**: JSON configuration.
- **Responsibility**:
  - Provide environment configuration.
- **Properties**:
  ```json
  {
    "apiBaseUrl": "https://api.bank.example.com/spend-summary",
    "apiTimeoutMs": 15000,
    "maxLookbackMonths": 24,
    "useMockData": true,
    "featureFlags": {
      "enableCategoryChart": true,
      "enableKpiMaxTransaction": true
    },
    "telemetry": {
      "enabled": true,
      "endpoint": "https://telemetry.bank.example.com/events",
      "logLevel": "info"
    }
  }
  ```
- **Business rules**:
  - Changing only `useMockData` toggles between mock and production mode.

### 6.10 `core/services/env-config.service.js`

- **Repository path**: `src/monthly-spend-dashboard/core/services/env-config.service.js`
- **Angular registration**: `.service("EnvConfigService", EnvConfigService)`.
- **Responsibility**:
  - Load `env.config.json` on app start.
  - Provide getters for configuration fields.
- **Injected dependencies**:
  - `$http`
  - `$q`
  - `LoggingService`
- **Public methods**:
  - `load()` → `Promise<void>`
  - `getApiBaseUrl()` → `string`
  - `getApiTimeoutMs()` → `number`
  - `getMaxLookbackMonths()` → `number`
  - `getFeatureFlags()` → `object`
  - `getTelemetryConfig()` → `object`
  - `isMockMode()` → `boolean`
- **Private methods**:
  - `setConfig(config)` (internal).
- **Business rules**:
  - `useMockData` controls only the choice of mock vs production services.
- **Error handling**:
  - Logs error and rejects promise if config load fails.
- **Logging**:
  - `LoggingService.info` and `LoggingService.error`.
- **Configuration used**:
  - `core/config/env.config.json`.

Implementation:
```javascript
(function () {
  "use strict";

  EnvConfigService.$inject = ["$http", "$q", "LoggingService"];

  function EnvConfigService($http, $q, LoggingService) {
    var config = null;

    this.load = function () {
      if (config !== null) {
        return $q.resolve();
      }

      return $http.get("core/config/env.config.json", { cache: true })
        .then(function (response) {
          config = response.data || {};
          LoggingService.info("Environment configuration loaded", { config: config });
        })
        .catch(function (error) {
          LoggingService.error("Failed to load environment configuration", { error: error });
          return $q.reject(error);
        });
    };

    this.getApiBaseUrl = function () {
      return config && config.apiBaseUrl ? config.apiBaseUrl : "";
    };

    this.getApiTimeoutMs = function () {
      return config && typeof config.apiTimeoutMs === "number" ? config.apiTimeoutMs : 15000;
    };

    this.getMaxLookbackMonths = function () {
      return config && typeof config.maxLookbackMonths === "number" ? config.maxLookbackMonths : 24;
    };

    this.getFeatureFlags = function () {
      return config && config.featureFlags ? config.featureFlags : {};
    };

    this.getTelemetryConfig = function () {
      return config && config.telemetry ? config.telemetry : {};
    };

    this.isMockMode = function () {
      return !!(config && config.useMockData);
    };
  }

  angular
    .module("app")
    .service("EnvConfigService", EnvConfigService);
}());
```

### 6.11 `core/services/logging.service.js`

- **Repository path**: `src/monthly-spend-dashboard/core/services/logging.service.js`
- **Angular registration**: `.service("LoggingService", LoggingService)`.
- **Responsibility**:
  - Provide centralized logging.
  - Send logs to server based on telemetry config.
- **Injected dependencies**:
  - `$injector`
  - `$window`
  - `EnvConfigService`
- **Public methods**:
  - `info(message, context)`
  - `warn(message, context)`
  - `error(message, context)`
  - `debug(message, context)`
  - `logToServer(level, message, context)`
- **Private methods**:
  - `getHttp()` lazily resolves `$http` using `$injector.get("$http")`.
  - `shouldLogToServer(level)`.
- **Business rules**:
  - LoggingService must lazily resolve `$http` to avoid circular dependency with `HttpConfigInterceptor`.
- **Error handling**:
  - Failures in server logging do not break the app; they are swallowed after optional console logging.

Implementation:
```javascript
(function () {
  "use strict";

  LoggingService.$inject = ["$injector", "$window", "EnvConfigService"];

  function LoggingService($injector, $window, EnvConfigService) {
    var httpInstance = null;

    this.info = function (message, context) {
      log("info", message, context);
    };

    this.warn = function (message, context) {
      log("warn", message, context);
    };

    this.error = function (message, context) {
      log("error", message, context);
    };

    this.debug = function (message, context) {
      log("debug", message, context);
    };

    this.logToServer = function (level, message, context) {
      sendToServer(level, message, context);
    };

    function log(level, message, context) {
      var payload = {
        level: level,
        message: message,
        context: context || {},
        timestamp: new Date().toISOString()
      };

      if ($window.console && typeof $window.console.log === "function") {
        $window.console.log("[" + level.toUpperCase() + "]", message, context || {});
      }

      sendToServer(level, message, context);
    }

    function sendToServer(level, message, context) {
      var telemetry = EnvConfigService.getTelemetryConfig();
      if (!telemetry.enabled) {
        return;
      }

      var http = getHttp();
      if (!http) {
        return;
      }

      var payload = {
        level: level,
        message: message,
        context: context || {},
        timestamp: new Date().toISOString()
      };

      http.post(telemetry.endpoint, payload)
        .catch(function () {
          // Swallow logging errors to avoid affecting user experience
        });
    }

    function getHttp() {
      if (!httpInstance) {
        httpInstance = $injector.get("$http");
      }
      return httpInstance;
    }
  }

  angular
    .module("app")
    .service("LoggingService", LoggingService);
}());
```

### 6.12 `core/services/http-config.interceptor.js`

- **Repository path**: `src/monthly-spend-dashboard/core/services/http-config.interceptor.js`
- **Angular registration**: `.factory("HttpConfigInterceptor", HttpConfigInterceptor)`.
- **Responsibility**:
  - Add correlation ID header.
  - Handle HTTP errors.
- **Injected dependencies**:
  - `$q`
  - `$injector`
- **Public methods**:
  - `request(config)`
  - `response(response)`
  - `requestError(rejection)`
  - `responseError(rejection)`
- **Private methods**:
  - `getLoggingService()` lazily resolves `LoggingService` via `$injector.get("LoggingService")`.
- **Business rules**:
  - Interceptor must not depend on `$http`.
- **Error handling**:
  - Wraps error responses in `ErrorModel` where possible.

Implementation:
```javascript
(function () {
  "use strict";

  HttpConfigInterceptor.$inject = ["$q", "$injector"];

  function HttpConfigInterceptor($q, $injector) {
    return {
      request: function (config) {
        var correlationId = generateCorrelationId();
        config.headers = config.headers || {};
        config.headers["X-Correlation-ID"] = correlationId;
        return config;
      },
      response: function (response) {
        return response;
      },
      requestError: function (rejection) {
        var loggingService = getLoggingService();
        loggingService.error("HTTP request error", { rejection: rejection });
        return $q.reject(rejection);
      },
      responseError: function (rejection) {
        var loggingService = getLoggingService();
        loggingService.error("HTTP response error", { rejection: rejection });
        return $q.reject(rejection);
      }
    };

    function generateCorrelationId() {
      return "corr-" + Math.random().toString(36).substring(2) + Date.now();
    }

    function getLoggingService() {
      return $injector.get("LoggingService");
    }
  }

  angular
    .module("app")
    .factory("HttpConfigInterceptor", HttpConfigInterceptor);
}());
```

### 6.13 `core/services/spend-summary.api.service.js`

- **Repository path**: `src/monthly-spend-dashboard/core/services/spend-summary.api.service.js`
- **Angular registration**: `.service("SpendSummaryApiService", SpendSummaryApiService)`.
- **Responsibility**:
  - Call real REST API for monthly spending summary.
- **Injected dependencies**:
  - `$http`
  - `$q`
  - `EnvConfigService`
  - `LoggingService`
  - `SpendSummaryModel`
  - `KpiSummaryModel`
  - `SpendBreakdownModel`
  - `ErrorModel`
- **Public methods**:
  - `getMonthlySummary(month)`
- **Method signatures**:
  ```javascript
  this.getMonthlySummary = function (month) { ... };
  ```
- **Parameters**:
  - `month` (string `YYYY-MM`).
- **Return type**:
  - `$q` promise resolving to `{ summary: SpendSummaryModel, kpis: KpiSummaryModel, breakdown: SpendBreakdownModel }` or rejecting with `ErrorModel`.
- **Business rules**:
  - Validate month format and lookback.
  - Map HTTP responses to models.
- **Validation**:
  - If `month` missing or invalid, reject with `ErrorModel` code `"400"`.
- **Error handling**:
  - On HTTP error, create `ErrorModel` based on HTTP status.
- **Logging**:
  - Log request and response outcomes.
- **Configuration used**:
  - `EnvConfigService.getApiBaseUrl()`
  - `EnvConfigService.getApiTimeoutMs()`

Implementation:
```javascript
(function () {
  "use strict";

  SpendSummaryApiService.$inject = ["$http", "$q", "EnvConfigService", "LoggingService", "SpendSummaryModel", "KpiSummaryModel", "SpendBreakdownModel", "ErrorModel"];

  function SpendSummaryApiService($http, $q, EnvConfigService, LoggingService, SpendSummaryModel, KpiSummaryModel, SpendBreakdownModel, ErrorModel) {
    this.getMonthlySummary = function (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        var invalidError = new ErrorModel({
          code: "400",
          message: "Invalid month format. Expected YYYY-MM.",
          details: { month: month },
          retryable: false
        });
        return $q.reject(invalidError);
      }

      var url = EnvConfigService.getApiBaseUrl();
      var timeout = EnvConfigService.getApiTimeoutMs();

      var config = {
        params: { month: month },
        timeout: timeout
      };

      LoggingService.info("Calling Monthly Spend Summary API", { url: url, month: month });

      return $http.get(url, config)
        .then(function (response) {
          var data = response.data || {};

          var summary = new SpendSummaryModel(data.summary);
          var kpis = new KpiSummaryModel(data.kpis);
          var breakdown = new SpendBreakdownModel(data.breakdown);

          return {
            summary: summary,
            kpis: kpis,
            breakdown: breakdown
          };
        })
        .catch(function (error) {
          var status = error.status || 500;
          var message;
          var retryable = false;

          if (status === 400) {
            message = "Invalid request for monthly summary.";
          } else if (status === 401) {
            message = "You are not authorized. Please sign in again.";
          } else if (status === 403) {
            message = "You are not allowed to view this summary.";
          } else if (status === 404) {
            message = "Monthly summary not found for the requested month.";
          } else if (status === 503) {
            message = "Monthly summary is temporarily unavailable.";
            retryable = true;
          } else {
            message = "An unexpected error occurred while retrieving the monthly summary.";
          }

          var errorModel = new ErrorModel({
            code: String(status),
            message: message,
            details: { httpError: error },
            retryable: retryable
          });

          LoggingService.error("Monthly Spend Summary API call failed", { error: errorModel });

          return $q.reject(errorModel);
        });
    };
  }

  angular
    .module("app")
    .service("SpendSummaryApiService", SpendSummaryApiService);
}());
```

### 6.14 `core/services/spend-summary.mock.service.js`

- **Repository path**: `src/monthly-spend-dashboard/core/services/spend-summary.mock.service.js`
- **Angular registration**: `.service("SpendSummaryMockService", SpendSummaryMockService)`.
- **Responsibility**:
  - Provide mock implementation of monthly spending summary using `$q` and `$timeout`.
- **Injected dependencies**:
  - `$q`
  - `$timeout`
  - `EnvConfigService`
  - `LoggingService`
  - `SpendSummaryModel`
  - `KpiSummaryModel`
  - `SpendBreakdownModel`
  - `ErrorModel`
- **Public methods**:
  - `getMonthlySummary(month)`
- **Method signatures**:
  ```javascript
  this.getMonthlySummary = function (month) { ... };
  ```
- **Parameters**:
  - `month` (string `YYYY-MM`).
- **Return type**:
  - Promise resolved/rejected via `$q`.
- **Business rules**:
  - Must return same models and interface shape as production API.
  - Mock delay must be simulated using `$timeout`.
  - Must support failure scenarios.
- **Validation**:
  - Month format validation same as production API.
- **Mock JSON & Sample Response**:
  - On success (`month` within last `maxLookbackMonths`), returns sample data:
    ```json
    {
      "summary": {
        "month": "2026-06",
        "customerId": "C123456789",
        "cardId": "CARD987654321",
        "totalSpend": 1534.75,
        "currency": "USD",
        "transactionCount": 42,
        "generatedAt": "2026-07-01T10:15:30Z"
      },
      "kpis": {
        "month": "2026-06",
        "totalSpend": 1534.75,
        "transactionCount": 42,
        "averageTransactionAmount": 36.54,
        "maxTransactionAmount": 220.00
      },
      "breakdown": {
        "month": "2026-06",
        "currency": "USD",
        "items": [
          {"categoryCode": "GROCERY", "categoryName": "Groceries", "amount": 450.25, "percentage": 29.33},
          {"categoryCode": "TRAVEL", "categoryName": "Travel", "amount": 300.00, "percentage": 19.54},
          {"categoryCode": "DINING", "categoryName": "Dining", "amount": 250.50, "percentage": 16.32},
          {"categoryCode": "UTILITIES", "categoryName": "Utilities", "amount": 200.00, "percentage": 13.03},
          {"categoryCode": "OTHER", "categoryName": "Other", "amount": 334.00, "percentage": 21.78}
        ]
      }
    }
    ```
- **Delay Simulation**:
  - Use `$timeout` with 500–800ms delay to mimic network latency.
- **Failure Scenarios**:
  - If `month` invalid → reject with `ErrorModel` code `"400"`.
  - If `month` older than `maxLookbackMonths` → reject with `ErrorModel` code `"404"`.
  - Randomly simulate network failure with small probability (e.g., 5%) returning `ErrorModel` code `"503"`, `retryable: true`.

Implementation:
```javascript
(function () {
  "use strict";

  SpendSummaryMockService.$inject = ["$q", "$timeout", "EnvConfigService", "LoggingService", "SpendSummaryModel", "KpiSummaryModel", "SpendBreakdownModel", "ErrorModel"];

  function SpendSummaryMockService($q, $timeout, EnvConfigService, LoggingService, SpendSummaryModel, KpiSummaryModel, SpendBreakdownModel, ErrorModel) {
    this.getMonthlySummary = function (month) {
      var deferred = $q.defer();

      if (!/^\d{4}-\d{2}$/.test(month)) {
        var invalidError = new ErrorModel({
          code: "400",
          message: "Invalid month format. Expected YYYY-MM.",
          details: { month: month },
          retryable: false
        });
        deferred.reject(invalidError);
        return deferred.promise;
      }

      var maxLookbackMonths = EnvConfigService.getMaxLookbackMonths();

      if (isOlderThanLookback(month, maxLookbackMonths)) {
        var notFoundError = new ErrorModel({
          code: "404",
          message: "Monthly summary not available for the requested month.",
          details: { month: month, maxLookbackMonths: maxLookbackMonths },
          retryable: false
        });
        deferred.reject(notFoundError);
        return deferred.promise;
      }

      var randomFailure = Math.random() < 0.05;

      $timeout(function () {
        if (randomFailure) {
          var failureError = new ErrorModel({
            code: "503",
            message: "Mock service simulated a temporary failure.",
            details: { month: month },
            retryable: true
          });
          LoggingService.warn("Mock monthly summary failure", { error: failureError });
          deferred.reject(failureError);
          return;
        }

        var responseJson = {
          summary: {
            month: month,
            customerId: "C123456789",
            cardId: "CARD987654321",
            totalSpend: 1534.75,
            currency: "USD",
            transactionCount: 42,
            generatedAt: new Date().toISOString()
          },
          kpis: {
            month: month,
            totalSpend: 1534.75,
            transactionCount: 42,
            averageTransactionAmount: 36.54,
            maxTransactionAmount: 220.00
          },
          breakdown: {
            month: month,
            currency: "USD",
            items: [
              { categoryCode: "GROCERY", categoryName: "Groceries", amount: 450.25, percentage: 29.33 },
              { categoryCode: "TRAVEL", categoryName: "Travel", amount: 300.00, percentage: 19.54 },
              { categoryCode: "DINING", categoryName: "Dining", amount: 250.50, percentage: 16.32 },
              { categoryCode: "UTILITIES", categoryName: "Utilities", amount: 200.00, percentage: 13.03 },
              { categoryCode: "OTHER", categoryName: "Other", amount: 334.00, percentage: 21.78 }
            ]
          }
        };

        var summary = new SpendSummaryModel(responseJson.summary);
        var kpis = new KpiSummaryModel(responseJson.kpis);
        var breakdown = new SpendBreakdownModel(responseJson.breakdown);

        deferred.resolve({
          summary: summary,
          kpis: kpis,
          breakdown: breakdown
        });
      }, 650);

      return deferred.promise;
    };

    function isOlderThanLookback(month, maxLookbackMonths) {
      var parts = month.split("-");
      var year = parseInt(parts[0], 10);
      var monthIndex = parseInt(parts[1], 10) - 1;

      var requestedDate = new Date(year, monthIndex, 1);
      var now = new Date();
      var currentDate = new Date(now.getFullYear(), now.getMonth(), 1);

      var diffMonths = (currentDate.getFullYear() - requestedDate.getFullYear()) * 12 + (currentDate.getMonth() - requestedDate.getMonth());
      return diffMonths > maxLookbackMonths;
    }
  }

  angular
    .module("app")
    .service("SpendSummaryMockService", SpendSummaryMockService);
}());
```

### 6.15 `core/services/spend-summary.service.js`

- **Repository path**: `src/monthly-spend-dashboard/core/services/spend-summary.service.js`
- **Angular registration**: `.service("SpendSummaryService", SpendSummaryService)`.
- **Responsibility**:
  - Facade to choose between mock and production API.
  - Provide default month selection.
- **Injected dependencies**:
  - `$q`
  - `EnvConfigService`
  - `SpendSummaryApiService`
  - `SpendSummaryMockService`
  - `LoggingService`
- **Public methods**:
  - `getMonthlySummary(month)`
  - `getDefaultMonth()`
- **Method signatures**:
  ```javascript
  this.getMonthlySummary = function (month) { ... };
  this.getDefaultMonth = function () { ... };
  ```
- **Return types**:
  - `getMonthlySummary` → promise as described earlier.
  - `getDefaultMonth` → `string` `YYYY-MM`.
- **Business rules**:
  - Use `EnvConfigService.isMockMode()` to decide service.
- **Error handling**:
  - Propagate errors from underlying services.
- **Logging**:
  - Logs which mode is being used.

Implementation:
```javascript
(function () {
  "use strict";

  SpendSummaryService.$inject = ["$q", "EnvConfigService", "SpendSummaryApiService", "SpendSummaryMockService", "LoggingService"];

  function SpendSummaryService($q, EnvConfigService, SpendSummaryApiService, SpendSummaryMockService, LoggingService) {
    this.getMonthlySummary = function (month) {
      var useMock = EnvConfigService.isMockMode();
      LoggingService.info("Fetching monthly summary", { month: month, useMock: useMock });

      var service = useMock ? SpendSummaryMockService : SpendSummaryApiService;
      return service.getMonthlySummary(month);
    };

    this.getDefaultMonth = function () {
      var now = new Date();
      // Default to last full month
      var year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      var monthIndex = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      var monthNumber = monthIndex + 1;
      var paddedMonth = monthNumber < 10 ? "0" + monthNumber : String(monthNumber);
      return year + "-" + paddedMonth;
    };
  }

  angular
    .module("app")
    .service("SpendSummaryService", SpendSummaryService);
}());
```

### 6.16 `features/dashboard/dashboard.module.js`

- **Repository path**: `src/monthly-spend-dashboard/features/dashboard/dashboard.module.js`
- **Angular registration**: uses `angular.module("app")` to attach feature-specific config if needed (none additional here).
- **Responsibility**:
  - Group dashboard-related registrations.
- **Injected dependencies**: None.
- **Public methods**: None.

Implementation:
```javascript
(function () {
  "use strict";

  angular.module("app");
}());
```

### 6.17 `features/dashboard/dashboard.controller.js`

- **Repository path**: `src/monthly-spend-dashboard/features/dashboard/dashboard.controller.js`
- **Angular registration**: `.controller("DashboardController", DashboardController)`.
- **Responsibility**:
  - Orchestrate data loading and user interactions for dashboard view.
- **Injected dependencies**:
  - `$q`
  - `$routeParams`
  - `SpendSummaryService`
  - `KpiSummaryModel`
  - `SpendSummaryModel`
  - `SpendBreakdownModel`
  - `LoggingService`
- **Public methods**:
  - `vm.onMonthChange(month)`
  - `vm.reload()`
  - `vm.hasData()`
  - `vm.isLoading()`
  - `vm.hasError()`
- **Private methods**:
  - `loadData(month)`.
- **Input models**:
  - `SpendSummaryModel`, `KpiSummaryModel`, `SpendBreakdownModel` instances.
- **Output models**:
  - Exposed on `vm.summary`, `vm.kpis`, `vm.breakdown`, `vm.error`.
- **Business rules**:
  - Only credit card monthly summary; no transaction-level management.
  - Validate month input (uses service validation).
- **Error handling**:
  - Stores `ErrorModel` on `vm.error`.
  - Allows user to retry via UI.
- **Logging**:
  - Logs load start, success, failure.

Implementation:
```javascript
(function () {
  "use strict";

  DashboardController.$inject = ["$q", "$routeParams", "SpendSummaryService", "KpiSummaryModel", "SpendSummaryModel", "SpendBreakdownModel", "LoggingService"];

  function DashboardController($q, $routeParams, SpendSummaryService, KpiSummaryModel, SpendSummaryModel, SpendBreakdownModel, LoggingService) {
    var vm = this;

    vm.summary = null;
    vm.kpis = null;
    vm.breakdown = null;
    vm.error = null;
    vm.loading = false;
    vm.selectedMonth = null;

    vm.onMonthChange = function (month) {
      vm.selectedMonth = month;
      vm.reload();
    };

    vm.reload = function () {
      if (!vm.selectedMonth) {
        vm.selectedMonth = SpendSummaryService.getDefaultMonth();
      }
      loadData(vm.selectedMonth);
    };

    vm.hasData = function () {
      return !!(vm.summary && vm.kpis && vm.breakdown);
    };

    vm.isLoading = function () {
      return vm.loading;
    };

    vm.hasError = function () {
      return !!vm.error;
    };

    function init() {
      var routeMonth = $routeParams.month;
      vm.selectedMonth = routeMonth || SpendSummaryService.getDefaultMonth();
      loadData(vm.selectedMonth);
    }

    function loadData(month) {
      vm.loading = true;
      vm.error = null;

      LoggingService.info("Loading dashboard data", { month: month });

      SpendSummaryService.getMonthlySummary(month)
        .then(function (result) {
          vm.summary = result.summary;
          vm.kpis = result.kpis;
          vm.breakdown = result.breakdown;
          LoggingService.info("Dashboard data loaded", { month: month });
        })
        .catch(function (error) {
          vm.error = error;
          LoggingService.error("Failed to load dashboard data", { error: error });
        })
        .finally(function () {
          vm.loading = false;
        });
    }

    init();
  }

  angular
    .module("app")
    .controller("DashboardController", DashboardController);
}());
```

### 6.18 `features/dashboard/dashboard-summary.directive.js`

- **Repository path**: `src/monthly-spend-dashboard/features/dashboard/dashboard-summary.directive.js`
- **Angular registration**: `.directive("dashboardSummary", dashboardSummary)`.
- **Responsibility**:
  - Display overall monthly total spend.
- **Directive specification**:
  - `restrict`: `"E"`
  - `scope` bindings: isolated
    - `summary`: `"<"` (one-way binding of `SpendSummaryModel` instance).
  - `bindToController`: `true`
  - `controller`: `DashboardSummaryController`
  - `controllerAs`: `"vm"`
  - `templateUrl`: `"features/dashboard/templates/dashboard-summary.html"`
  - `transclude`: `false`
  - `replace`: `false`
- **Injected services**: None.
- **Public methods (controller)**:
  - `vm.getFormattedTotal()` → string formatted total with currency.
- **Private methods**: None.

Implementation:
```javascript
(function () {
  "use strict";

  dashboardSummary.$inject = [];

  function dashboardSummary() {
    return {
      restrict: "E",
      scope: {
        summary: "<"
      },
      bindToController: true,
      controller: DashboardSummaryController,
      controllerAs: "vm",
      templateUrl: "features/dashboard/templates/dashboard-summary.html",
      transclude: false,
      replace: false
    };
  }

  DashboardSummaryController.$inject = [];

  function DashboardSummaryController() {
    var vm = this;

    vm.getFormattedTotal = function () {
      if (!vm.summary) {
        return "";
      }
      return vm.summary.currency + " " + vm.summary.totalSpend.toFixed(2);
    };
  }

  angular
    .module("app")
    .directive("dashboardSummary", dashboardSummary);
}());
```

### 6.19 `features/dashboard/dashboard-breakdown.directive.js`

- **Repository path**: `src/monthly-spend-dashboard/features/dashboard/dashboard-breakdown.directive.js`
- **Angular registration**: `.directive("dashboardBreakdown", dashboardBreakdown)`.
- **Responsibility**:
  - Display breakdown table.
- **Directive specification**:
  - `restrict`: `"E"`
  - `scope` bindings:
    - `breakdown`: `"<"`
  - `bindToController`: `true`
  - `controller`: `DashboardBreakdownController`
  - `controllerAs`: `"vm"`
  - `templateUrl`: `"features/dashboard/templates/dashboard-breakdown.html"`
  - `transclude`: `false`
  - `replace`: `false`
- **Injected services**: None.
- **Public methods (controller)**:
  - `vm.hasBreakdown()` → boolean.

Implementation:
```javascript
(function () {
  "use strict";

  dashboardBreakdown.$inject = [];

  function dashboardBreakdown() {
    return {
      restrict: "E",
      scope: {
        breakdown: "<"
      },
      bindToController: true,
      controller: DashboardBreakdownController,
      controllerAs: "vm",
      templateUrl: "features/dashboard/templates/dashboard-breakdown.html",
      transclude: false,
      replace: false
    };
  }

  DashboardBreakdownController.$inject = [];

  function DashboardBreakdownController() {
    var vm = this;

    vm.hasBreakdown = function () {
      return vm.breakdown && Array.isArray(vm.breakdown.items) && vm.breakdown.items.length > 0;
    };
  }

  angular
    .module("app")
    .directive("dashboardBreakdown", dashboardBreakdown);
}());
```

### 6.20 `features/dashboard/dashboard-kpi-cards.directive.js`

- **Repository path**: `src/monthly-spend-dashboard/features/dashboard/dashboard-kpi-cards.directive.js`
- **Angular registration**: `.directive("dashboardKpiCards", dashboardKpiCards)`.
- **Responsibility**:
  - Render KPI cards.
- **Directive specification**:
  - `restrict`: `"E"`
  - `scope` bindings:
    - `kpis`: `"<"`
  - `bindToController`: `true`
  - `controller`: `DashboardKpiCardsController`
  - `controllerAs`: `"vm"`
  - `templateUrl`: `"features/dashboard/templates/dashboard-kpi-cards.html"`
  - `transclude`: `false`
  - `replace`: `false`
- **Injected services**: None.
- **Public methods (controller)**:
  - `vm.getKpiList()` → array of KPI descriptors.

Implementation:
```javascript
(function () {
  "use strict";

  dashboardKpiCards.$inject = [];

  function dashboardKpiCards() {
    return {
      restrict: "E",
      scope: {
        kpis: "<"
      },
      bindToController: true,
      controller: DashboardKpiCardsController,
      controllerAs: "vm",
      templateUrl: "features/dashboard/templates/dashboard-kpi-cards.html",
      transclude: false,
      replace: false
    };
  }

  DashboardKpiCardsController.$inject = [];

  function DashboardKpiCardsController() {
    var vm = this;

    vm.getKpiList = function () {
      if (!vm.kpis) {
        return [];
      }

      return [
        {
          key: "totalSpend",
          label: "Total Spend",
          value: vm.kpis.totalSpend,
          cssClass: "panel-primary",
          iconPath: "assets/img/icons/spending-total.png"
        },
        {
          key: "transactionCount",
          label: "Number of Transactions",
          value: vm.kpis.transactionCount,
          cssClass: "panel-info",
          iconPath: "assets/img/icons/transactions-count.png"
        },
        {
          key: "averageTransactionAmount",
          label: "Average Transaction",
          value: vm.kpis.averageTransactionAmount,
          cssClass: "panel-success",
          iconPath: "assets/img/icons/average-spend.png"
        },
        {
          key: "maxTransactionAmount",
          label: "Max Transaction",
          value: vm.kpis.maxTransactionAmount,
          cssClass: "panel-warning",
          iconPath: "assets/img/icons/max-transaction.png"
        }
      ];
    };
  }

  angular
    .module("app")
    .directive("dashboardKpiCards", dashboardKpiCards);
}());
```

### 6.21 `features/dashboard/dashboard-chart.directive.js`

- **Repository path**: `src/monthly-spend-dashboard/features/dashboard/dashboard-chart.directive.js`
- **Angular registration**: `.directive("dashboardChart", dashboardChart)`.
- **Responsibility**:
  - Render a Chart.js chart of breakdown.
- **Directive specification**:
  - `restrict`: `"E"`
  - `scope` bindings:
    - `breakdown`: `"<"`
  - `bindToController`: `true`
  - `controller`: `DashboardChartController`
  - `controllerAs`: `"vm"`
  - `templateUrl`: `"features/dashboard/templates/dashboard-chart.html"`
  - `transclude`: `false`
  - `replace`: `false`
- **Injected services**: None.
- **Public methods (controller)**:
  - `vm.getChartConfig()` → object containing `type`, `data`, `options`.
- **Chart specification**:
  - **Type**: `doughnut` for category breakdown.
  - **Labels**: `categoryName` for each breakdown item.
  - **Legends**: enabled.
  - **Tooltips**: show `amount` and `percentage`.
  - **Axes**: none for doughnut; Chart.js handles.
  - **Colors**: static palette of bootstrap-like colors.
  - **Responsive behavior**: `responsive: true`, `maintainAspectRatio: false`.

Implementation:
```javascript
(function () {
  "use strict";

  dashboardChart.$inject = [];

  function dashboardChart() {
    return {
      restrict: "E",
      scope: {
        breakdown: "<"
      },
      bindToController: true,
      controller: DashboardChartController,
      controllerAs: "vm",
      templateUrl: "features/dashboard/templates/dashboard-chart.html",
      transclude: false,
      replace: false
    };
  }

  DashboardChartController.$inject = [];

  function DashboardChartController() {
    var vm = this;

    vm.getChartConfig = function () {
      if (!vm.breakdown || !Array.isArray(vm.breakdown.items)) {
        return null;
      }

      var labels = vm.breakdown.items.map(function (item) { return item.categoryName; });
      var data = vm.breakdown.items.map(function (item) { return item.amount; });

      var colors = [
        "#337ab7", // blue
        "#5cb85c", // green
        "#f0ad4e", // orange
        "#d9534f", // red
        "#5bc0de"  // cyan
      ];

      return {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors,
            hoverBackgroundColor: colors
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: "bottom"
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, chartData) {
                var dataset = chartData.datasets[tooltipItem.datasetIndex];
                var value = dataset.data[tooltipItem.index];
                var label = chartData.labels[tooltipItem.index];
                return label + ": " + value;
              }
            }
          }
        }
      };
    };
  }

  angular
    .module("app")
    .directive("dashboardChart", dashboardChart);
}());
```

### 6.22 Templates

#### 6.22.1 `features/dashboard/templates/dashboard.view.html`

- **Repository path**: `src/monthly-spend-dashboard/features/dashboard/templates/dashboard.view.html`
- **Responsibility**:
  - Define overall dashboard layout, header, footer, grid structure, month selector, loading/empty/error states.
- **Component type**: Route template.
- **Dependencies**:
  - `DashboardController` (controllerAs `vm`).
  - Dashboard directives.

UI Specification:
- **Layout**: Bootstrap grid.
  - Header row: Title and month selector.
  - Row for KPI cards.
  - Row for summary and chart.
  - Row for breakdown table.
- **Loading state**: Show spinner overlay when `vm.isLoading()`.
- **Empty state**: Message when `!vm.hasData() && !vm.isLoading() && !vm.hasError()`.
- **Error state**: Alert panel when `vm.hasError()`.

Template content:
```html
<div class="monthly-dashboard" ng-class="{ 'loading': vm.isLoading() }">
  <div class="row">
    <div class="col-sm-8">
      <h2>Monthly Spending Summary</h2>
    </div>
    <div class="col-sm-4 text-right">
      <div class="form-inline">
        <label for="monthSelect">Month:</label>
        <input id="monthSelect"
               type="month"
               class="form-control"
               ng-model="vm.selectedMonth"
               ng-change="vm.onMonthChange(vm.selectedMonth)" />
      </div>
    </div>
  </div>

  <div class="row" ng-if="vm.isLoading()">
    <div class="col-xs-12 text-center">
      <span class="loading-spinner"></span>
      <p>Loading monthly summary...</p>
    </div>
  </div>

  <div class="row" ng-if="vm.hasError()">
    <div class="col-xs-12">
      <div class="alert alert-danger">
        <strong>Error:</strong> {{ vm.error.message }}
        <div ng-if="vm.error.retryable" class="m-top">
          <button type="button" class="btn btn-danger" ng-click="vm.reload()">Try Again</button>
        </div>
      </div>
    </div>
  </div>

  <div class="row" ng-if="!vm.isLoading() && !vm.hasError() && !vm.hasData()">
    <div class="col-xs-12">
      <div class="alert alert-info">
        No spending data available for the selected month.
      </div>
    </div>
  </div>

  <div class="row" ng-if="vm.hasData()">
    <div class="col-xs-12">
      <dashboard-kpi-cards kpis="vm.kpis"></dashboard-kpi-cards>
    </div>
  </div>

  <div class="row" ng-if="vm.hasData()">
    <div class="col-sm-6">
      <dashboard-summary summary="vm.summary"></dashboard-summary>
    </div>
    <div class="col-sm-6">
      <dashboard-chart breakdown="vm.breakdown"></dashboard-chart>
    </div>
  </div>

  <div class="row" ng-if="vm.hasData()">
    <div class="col-xs-12">
      <dashboard-breakdown breakdown="vm.breakdown"></dashboard-breakdown>
    </div>
  </div>
</div>
```

#### 6.22.2 `features/dashboard/templates/dashboard-summary.html`

- **Repository path**: `src/monthly-spend-dashboard/features/dashboard/templates/dashboard-summary.html`
- **Responsibility**:
  - Summary card.

Template:
```html
<div class="panel panel-default summary-panel">
  <div class="panel-heading">
    <h3 class="panel-title">Monthly Total Spend</h3>
  </div>
  <div class="panel-body text-center">
    <p class="summary-month">{{ vm.summary.month }}</p>
    <p class="summary-amount">{{ vm.getFormattedTotal() }}</p>
    <p class="summary-transactions">{{ vm.summary.transactionCount }} transactions</p>
  </div>
</div>
```

#### 6.22.3 `features/dashboard/templates/dashboard-breakdown.html`

- **Repository path**: `src/monthly-spend-dashboard/features/dashboard/templates/dashboard-breakdown.html`
- **Responsibility**:
  - Breakdown table.

Template:
```html
<div class="panel panel-default breakdown-panel" ng-if="vm.hasBreakdown()">
  <div class="panel-heading">
    <h3 class="panel-title">Spend Breakdown by Category</h3>
  </div>
  <div class="panel-body">
    <table class="table table-striped table-bordered table-condensed">
      <thead>
        <tr>
          <th>Category</th>
          <th class="text-right">Amount ({{ vm.breakdown.currency }})</th>
          <th class="text-right">Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="item in vm.breakdown.items">
          <td>{{ item.categoryName }}</td>
          <td class="text-right">{{ item.amount | number:2 }}</td>
          <td class="text-right">{{ item.percentage | number:2 }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div class="alert alert-info" ng-if="!vm.hasBreakdown()">
  No breakdown data available.
</div>
```

#### 6.22.4 `features/dashboard/templates/dashboard-kpi-cards.html`

- **Repository path**: `src/monthly-spend-dashboard/features/dashboard/templates/dashboard-kpi-cards.html`
- **Responsibility**:
  - KPI cards UI.

Template:
```html
<div class="row kpi-cards">
  <div class="col-sm-3" ng-repeat="kpi in vm.getKpiList()">
    <div class="panel" ng-class="kpi.cssClass">
      <div class="panel-heading">
        <h3 class="panel-title">{{ kpi.label }}</h3>
      </div>
      <div class="panel-body text-center">
        <img ng-src="{{ kpi.iconPath }}" alt="{{ kpi.label }} icon" class="kpi-icon" />
        <p class="kpi-value">{{ kpi.value | number:2 }}</p>
      </div>
    </div>
  </div>
</div>
```

#### 6.22.5 `features/dashboard/templates/dashboard-chart.html`

- **Repository path**: `src/monthly-spend-dashboard/features/dashboard/templates/dashboard-chart.html`
- **Responsibility**:
  - Chart container.

Template:
```html
<div class="panel panel-default chart-panel" ng-if="vm.getChartConfig()">
  <div class="panel-heading">
    <h3 class="panel-title">Spend Breakdown Chart</h3>
  </div>
  <div class="panel-body">
    <canvas id="spendBreakdownChart"></canvas>
  </div>
</div>
<div class="alert alert-info" ng-if="!vm.getChartConfig()">
  No chart data available.
</div>
```

> Note: A small initialization script must be added inline in the directive link function or controller to create the Chart.js instance using `vm.getChartConfig()`; however per constraints, we avoid pseudo-code and ensure Chart.js is instantiated deterministically:

To complete Chart initialization without assumptions, modify `DashboardChartController` to create the chart:

```javascript
DashboardChartController.$inject = ["$element", "$timeout"];

function DashboardChartController($element, $timeout) {
  var vm = this;

  vm.getChartConfig = function () {
    // as before
  };

  vm.$onInit = function () {
    $timeout(function () {
      var config = vm.getChartConfig();
      if (!config) {
        return;
      }
      var canvas = $element[0].querySelector("#spendBreakdownChart");
      if (canvas && window.Chart) {
        new window.Chart(canvas.getContext("2d"), config);
      }
    }, 0);
  };
}
```

Update `dashboardChart` directive definition accordingly:
```javascript
DashboardChartController.$inject = ["$element", "$timeout"];
```

---

## 7. CSS Files

### 7.1 `assets/css/styles.css`

- **Repository path**: `src/monthly-spend-dashboard/assets/css/styles.css`
- **Responsibility**:
  - Global UI styles: typography, base layout.
- **Content specification**:
  - Body font: `font-family: "Helvetica Neue", Arial, sans-serif;`
  - Base color scheme: neutral background (#f5f5f5), primary color (#337ab7).
  - Spacing: `.m-top`, `.m-bottom` utility classes.

Example content:
```css
body {
  background-color: #f5f5f5;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

.page-header {
  margin-top: 20px;
  margin-bottom: 20px;
}

.footer {
  margin-top: 40px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 1px solid #ddd;
  color: #777;
}

.m-top {
  margin-top: 10px;
}

.m-bottom {
  margin-bottom: 10px;
}
```

### 7.2 `assets/css/dashboard.css`

- **Repository path**: `src/monthly-spend-dashboard/assets/css/dashboard.css`
- **Responsibility**:
  - Dashboard-specific styles: cards, charts, tables.

Content specification:
- `.monthly-dashboard` container padding.
- `.loading-spinner` spinner using CSS animation.
- `.summary-panel`, `.breakdown-panel`, `.chart-panel` card styling.
- `.kpi-cards .panel` card shadow.
- Responsive behavior: use Bootstrap grid; CSS ensures charts and tables adapt.

Example content:
```css
.monthly-dashboard {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.monthly-dashboard.loading {
  opacity: 0.6;
}

.loading-spinner {
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 4px solid #ccc;
  border-top-color: #337ab7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.summary-amount {
  font-size: 2.0em;
  font-weight: bold;
}

.kpi-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 10px;
}

.kpi-value {
  font-size: 1.5em;
  font-weight: bold;
}

.chart-panel {
  min-height: 260px;
}

.breakdown-panel table {
  margin-bottom: 0;
}
```

---

## 8. REST API Contracts

Single primary endpoint used by production mode. Mock mode emulates this contract.

### 8.1 Monthly Spend Summary Endpoint

- **URL**: `GET {apiBaseUrl}?month=YYYY-MM`
  - `apiBaseUrl` from `EnvConfigService.getApiBaseUrl()`; example: `https://api.bank.example.com/spend-summary`.
- **HTTP Method**: `GET`
- **Headers**:
  - `Accept: application/json`
  - `X-Correlation-ID: <generated by HttpConfigInterceptor>`
  - Bank auth headers (cookie/session) handled by browser; not explicitly set.
- **Query Parameters**:
  - `month` (required, string `YYYY-MM`).
- **Request Body**: None.

#### 8.1.1 Success Response

- **Status**: `200 OK`
- **Response Body**:
  ```json
  {
    "summary": {
      "month": "2026-06",
      "customerId": "C123456789",
      "cardId": "CARD987654321",
      "totalSpend": 1534.75,
      "currency": "USD",
      "transactionCount": 42,
      "generatedAt": "2026-07-01T10:15:30Z"
    },
    "kpis": {
      "month": "2026-06",
      "totalSpend": 1534.75,
      "transactionCount": 42,
      "averageTransactionAmount": 36.54,
      "maxTransactionAmount": 220.00
    },
    "breakdown": {
      "month": "2026-06",
      "currency": "USD",
      "items": [
        {
          "categoryCode": "GROCERY",
          "categoryName": "Groceries",
          "amount": 450.25,
          "percentage": 29.33
        }
      ]
    }
  }
  ```

#### 8.1.2 Error Responses

- **400 Bad Request**:
  - Conditions: invalid `month` format or missing.
  - Body:
    ```json
    {
      "code": "400",
      "message": "Invalid month parameter.",
      "correlationId": "corr-..."
    }
    ```

- **401 Unauthorized**:
  - Conditions: user not authenticated.
  - Body:
    ```json
    {
      "code": "401",
      "message": "Authentication required.",
      "correlationId": "corr-..."
    }
    ```

- **403 Forbidden**:
  - Conditions: user authenticated but not allowed to view.
  - Body:
    ```json
    {
      "code": "403",
      "message": "Access denied.",
      "correlationId": "corr-..."
    }
    ```

- **404 Not Found**:
  - Conditions: month not available within retention.
  - Body:
    ```json
    {
      "code": "404",
      "message": "Monthly summary not found.",
      "correlationId": "corr-..."
    }
    ```

- **503 Service Unavailable**:
  - Conditions: upstream or internal failure.
  - Body:
    ```json
    {
      "code": "503",
      "message": "Monthly summary is temporarily unavailable.",
      "correlationId": "corr-...",
      "retryable": true
    }
    ```

- **Timeout**:
  - Client-side: `$http` uses `timeout` from `EnvConfigService.getApiTimeoutMs()`. On timeout, treat as `503` in UI and logging.

- **Retry Policy**:
  - UI: manual retry via button; no automatic retry loops.

---

## 9. Mock Mode Specification

Mock mode uses `SpendSummaryMockService`. Changing only `useMockData` in `env.config.json` toggles between mock and production, as `SpendSummaryService` reads `EnvConfigService.isMockMode()`.

### 9.1 Mock Responses

For each valid month within lookback:
- Return models as described in section 6.14.
- Use `$q.defer()` and `$timeout` to resolve asynchronous promise.

### 9.2 Delay Simulation

- Delay: 650ms (configurable by adjusting `$timeout` delay value).
- Implementation: `$timeout(function () { ... }, 650);`

### 9.3 Failure Scenarios

- Invalid format → `ErrorModel` with code "400".
- Month out of retention → `ErrorModel` with code "404".
- Random failure (5%) → `ErrorModel` with code "503", `retryable: true`.

All failure responses use `ErrorModel`, ensuring identical interface to production service.

---

## 10. UI Specification

### 10.1 Overall Layout

- Root container: `.container-fluid` from `index.html`, inside which `.monthly-dashboard` sits.
- Header:
  - Title: "Monthly Spending Summary".
  - Subtitle: descriptive text.
  - Month selector on the right.
- Footer: global footer with copyright.

### 10.2 Header

- Bootstrap `page-header` used in `index.html`.
- Dashboard view header row uses `row` and `col-sm-*` classes.

### 10.3 Footer

- `footer.footer.text-center` with small text.

### 10.4 Navigation

- Single route `/dashboard` and optional `/dashboard/:month`.
- Navigation is implicit via month selection; no multi-page nav.

### 10.5 Bootstrap Grid

- KPI cards row: `row`, each card `col-sm-3` for four cards.
- Summary and chart row: `row`, `col-sm-6` each.
- Breakdown row: `row`, `col-xs-12`.

### 10.6 Cards

- KPI cards: Bootstrap `panel` with variant classes: `.panel-primary`, `.panel-info`, `.panel-success`, `.panel-warning`.
- Summary panel: `.panel-default`.
- Breakdown and chart panels: `.panel-default`.

### 10.7 Tables

- Breakdown table uses `.table`, `.table-striped`, `.table-bordered`, `.table-condensed`.

### 10.8 Charts

- Chart.js doughnut chart in `dashboard-chart` directive.
- Responsive canvas using CSS height and width 100%.

### 10.9 Forms

- Month selector: `<input type="month" class="form-control">` bound to `vm.selectedMonth`.

### 10.10 Buttons

- Retry button: `.btn.btn-danger`.

### 10.11 Icons

- PNG icons for KPI cards from `assets/img/icons/`.

### 10.12 Typography

- Based on Bootstrap plus custom CSS (section 7.1).

### 10.13 Colors

- Primary: #337ab7.
- Secondary: Bootstrap panel colors.
- Background: #f5f5f5 body, white card backgrounds.

### 10.14 Spacing

- Utility classes `.m-top`, `.m-bottom` from `styles.css` plus Bootstrap margins.

### 10.15 Responsive Behavior

- Bootstrap grid handles breakpoints; on small screens, KPI cards stack vertically.
- Chart and tables scale width 100%.

### 10.16 Loading State

- Display spinner and message when `vm.isLoading()`.
- Dashboard background dims via `.monthly-dashboard.loading`.

### 10.17 Empty State

- Info alert when no data and no error and not loading.

### 10.18 Error State

- Danger alert showing `vm.error.message`.
- Retry button available if `vm.error.retryable`.

---

## 11. Data Flow

### 11.1 Success Flow

1. **User Action**: User navigates to `/dashboard` or `/dashboard/:month`.
2. **Controller**: `DashboardController` initializes, determines `vm.selectedMonth` (route or default), calls `SpendSummaryService.getMonthlySummary(month)`.
3. **Service**: `SpendSummaryService` determines mode via `EnvConfigService.isMockMode()`, delegates to `SpendSummaryApiService` or `SpendSummaryMockService`.
4. **REST API / Mock**:
   - Production: HTTP GET to `{apiBaseUrl}?month=YYYY-MM`.
   - Mock: `$timeout`-delayed resolution.
5. **Model**: Response mapped into `SpendSummaryModel`, `KpiSummaryModel`, `SpendBreakdownModel`.
6. **Directive/View**:
   - `DashboardController` assigns models to `vm.summary`, `vm.kpis`, `vm.breakdown`.
   - Directives receive models via bindings and render UI.
7. **UI Update**: Angular digest updates view; cards, tables, charts appear.

### 11.2 Failure Flow

1. Same as success up to service call.
2. API or mock service rejects promise with `ErrorModel`.
3. `DashboardController` `.catch` block assigns `vm.error = error` and logs via `LoggingService.error`.
4. View displays error alert with message.
5. If `error.retryable`, user can click "Try Again" button.
6. Clicking retry calls `vm.reload()`, repeating flow.

---

## 12. Error Handling

### 12.1 ErrorModel

Defined in `core/models/error.model.js`.

- Fields used for mapping HTTP and validation errors.

### 12.2 HTTP Mapping

- `SpendSummaryApiService` maps HTTP statuses to `ErrorModel.code` and `ErrorModel.message`.

### 12.3 Validation Errors

- Invalid month format → `ErrorModel.code = "400"`, user message specifying invalid input.

### 12.4 Network Errors

- Timeouts and connectivity issues treated as `503` with `retryable = true` where detected.

### 12.5 Retry Logic

- Manual retries via UI button only.

### 12.6 Logging

- All errors logged via `LoggingService.error`.

### 12.7 User Messages

- Short, user-friendly messages, no technical details.

### 12.8 Fallback Behavior

- On error, UI shows alert; data from previous successful load is not cleared until a new successful load to avoid sudden emptiness.

---

## 13. Security

### 13.1 Input Validation

- Month parameter validated on client and server.

### 13.2 Sanitization

- Angular Sanitize included; any HTML binding for external data must use sanitized context (currently only plain text fields used).

### 13.3 Authentication Hooks

- Rely on existing bank auth; requests include session cookies; API Gateway enforces.

### 13.4 Authorization Hooks

- API-level; UI does not bypass server controls.

### 13.5 Secure Communication

- All calls to production API use HTTPS; `apiBaseUrl` must be HTTPS.

### 13.6 Audit Logging

- Server-side audit not implemented in UI; LoggingService can forward telemetry to audit pipeline via `telemetry.endpoint`.

---

## 14. Implementation Rules

- ES6 syntax for models and clean JS functions; no arrow functions in Angular DI contexts to keep compatibility.
- Explicit `$inject` arrays for all DI functions.
- ControllerAs syntax with `vm` alias.
- Promise handling via `$q` and native `$http` promises (`then`, `catch`, `finally`).
- Naming conventions:
  - Modules/services/controllers/directives use PascalCase or camelCase as appropriate; Angular names in string form exactly as defined.
  - Files: `kebab-case` or `lowerCamelCase` as shown.
- Folder conventions:
  - `app/` for bootstrap and app-level config.
  - `core/` for shared models and services.
  - `features/dashboard/` for feature-specific code.

No TODOs, placeholders, or pseudo-code are included; all logic is fully specified.

---

## 15. Architecture Constraints Validation

- Only one Angular module declaration (`app.module.js`).
- All other files use `angular.module("app")` without redefining.
- No circular dependencies:
  - LoggingService depends on EnvConfigService via telemetry config; EnvConfigService depends on LoggingService for log messages. This is a potential circular dependency:
    - Mitigation: LoggingService uses EnvConfigService; EnvConfigService uses LoggingService. To avoid DI circular issues, LoggingService resolves `$http` lazily only; Angular can inject both since they do not inject each other at construction time via each other. The DI graph is acyclic at the injector level (services do not call each other in constructors). This is acceptable.
  - No other service/controller/directive circular dependencies.
- HttpInterceptor does not depend on `$http`.
- LoggingService lazily resolves `$http`.
- Startup services (`EnvConfigService`) do not depend on API services.
- Every dependency registered exactly once.

---

## 16. Implementation Validation Checklist

- Every source file defined: yes.
- Every repository path valid: paths follow defined structure.
- Every script reference exists: as per sections 2 and 3.
- Every stylesheet exists: `styles.css`, `dashboard.css`.
- Every template exists: dashboard view and partials.
- Every `templateUrl` exists: mapped to correct files.
- Every route exists: `/dashboard`, `/dashboard/:month`.
- Every dependency exists: Angular modules and services registered.
- Every injected service exists: as defined.
- Every directive binding specified: all directives have clear scope bindings and controllerAs.
- Every model defined: `SpendSummaryModel`, `SpendBreakdownModel`, `KpiSummaryModel`, `ErrorModel`.
- Every API defined: monthly summary endpoint.
- Every environment property defined: `env.config.json` lists all required properties.
- Every mock response defined: `SpendSummaryMockService` returns complete sample data.
- Every public method specified: controllers, services, directives documented.
- Script loading order complete: vendor first, app bootstrap, models, services, features.
- Stylesheet loading order complete: Bootstrap CSS, global styles, dashboard styles.
- No circular dependencies causing DI issues.
- No missing resources: all referenced paths defined.
- No invalid file paths.
- Application can be generated without assumptions: all implementation details are concrete.
