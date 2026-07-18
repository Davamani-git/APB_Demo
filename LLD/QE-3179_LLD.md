# Low-Level Design (LLD) – QE-3179 DAVMS Monthly Spending Summary Dashboard

> This LLD is the **single source of truth** for implementation and code generation for Epic **QE-3179 – DAVMS Monthly Spending Summary Dashboard**. The Code Generation Agent must be able to build a complete, runnable SPA using only the specifications in this document.

---
## 1. Application Overview

### 1.1 Purpose

Implement a web-based, AngularJS 1.7.9 Single Page Application (SPA) module within the DAVMS banking portal that provides:

1. Monthly total credit card spend calculation.
2. Monthly summary KPIs (total spend, number of transactions, average transaction value, etc.).
3. Visual representation of monthly spend via summary cards and a chart.
4. Month selection to view specific month summaries (limited to past billing cycles / max lookback).
5. Basic breakdown of spend (e.g., category-level) as an entry point to deeper insights.

All functionality is **read-only**, scoped to **credit card products only**, and exposed via REST APIs with support for **mock mode** and **production mode** switched by configuration.

### 1.2 Technology & Framework Versions (Fixed)

Frontend:
- HTML5
- CSS3
- JavaScript ES6 (transpiler not assumed; use ES6 syntax supported by target browsers)
- AngularJS **1.7.9**
- Angular Route **1.7.9**
- Angular Animate **1.7.9**
- Angular Sanitize **1.7.9**
- Angular UI Bootstrap **2.5.6**
- Bootstrap **3.4.1**

Architecture & Patterns:
- AngularJS MVC
- Single Page Application (SPA)
- REST APIs
- Dependency Injection
- ControllerAs syntax
- IIFE module pattern
- Promise-based asynchronous programming

Runtime:
- `$http`
- `$q`
- `$timeout`

Browser Support:
- Chrome (latest)
- Microsoft Edge (latest)

No framework upgrades or replacements are allowed.

### 1.3 External Libraries (CDN URLs)

All external libraries are loaded via CDN in `index.html`:

```html
<!-- Stylesheets -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

<!-- AngularJS Core -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js"></script>

<!-- Angular UI Bootstrap -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js"></script>

<!-- Bootstrap JS -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

<!-- Chart.js (for chart visualization) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js"></script>
```

No local copies of these libraries are generated or referenced.

---
## 2. Application Structure

### 2.1 Folder Hierarchy

Root repository: `APB_Demo`

SPA source is under `src/davms-monthly-summary/`:

```text
src/
  davms-monthly-summary/
    index.html
    app/
      app.module.js
      app.config.js
      app.routes.js
      app.run.js

      core/
        config/
          env.config.json
          env.config.js
        constants/
          app.constants.js
        models/
          monthly-summary.model.js
          breakdown-entry.model.js
          kpi-summary.model.js
          error.model.js
        services/
          api-endpoint.service.js
          env-config.service.js
          logging.service.js
          http-interceptor.factory.js
        mocks/
          mock-data.service.js

      features/
        monthly-summary/
          monthly-summary.controller.js
          monthly-summary.service.js
          month-selection.service.js
          kpi-computation.service.js
          breakdown.service.js
          templates/
            monthly-summary.view.html

      shared/
        directives/
          summary-card.directive.js
          breakdown-chart.directive.js
        filters/
          currency-precise.filter.js
        templates/
          components/
            summary-card.html
            breakdown-chart.html

    assets/
      css/
        styles.css
        monthly-summary.css
      img/
        icons/
          spending-total.png
          transactions-count.png
          avg-transaction.png
          breakdown.png
      fonts/
        (if needed; e.g. standard web-safe fonts assumed, no file required)
```

No `src/src` duplication; all paths are single-level under `src/davms-monthly-summary`.

### 2.2 Script Loading Order in `index.html`

1. External CSS:
   - Bootstrap CSS (CDN)
   - Local `assets/css/styles.css`
   - Local `assets/css/monthly-summary.css`

2. External scripts:
   - AngularJS (core, route, animate, sanitize)
   - Angular UI Bootstrap
   - Bootstrap JS
   - Chart.js

3. Application scripts (in this exact order):

```html
<!-- Core module & config -->
<script src="app/app.module.js"></script>
<script src="app/app.config.js"></script>
<script src="app/app.routes.js"></script>
<script src="app/app.run.js"></script>

<!-- Core config & constants -->
<script src="app/core/config/env.config.js"></script>
<script src="app/core/constants/app.constants.js"></script>

<!-- Core models -->
<script src="app/core/models/monthly-summary.model.js"></script>
<script src="app/core/models/breakdown-entry.model.js"></script>
<script src="app/core/models/kpi-summary.model.js"></script>
<script src="app/core/models/error.model.js"></script>

<!-- Core services -->
<script src="app/core/services/api-endpoint.service.js"></script>
<script src="app/core/services/env-config.service.js"></script>
<script src="app/core/services/logging.service.js"></script>
<script src="app/core/services/http-interceptor.factory.js"></script>

<!-- Mock data service -->
<script src="app/core/mocks/mock-data.service.js"></script>

<!-- Feature services & controllers -->
<script src="app/features/monthly-summary/monthly-summary.service.js"></script>
<script src="app/features/monthly-summary/month-selection.service.js"></script>
<script src="app/features/monthly-summary/kpi-computation.service.js"></script>
<script src="app/features/monthly-summary/breakdown.service.js"></script>
<script src="app/features/monthly-summary/monthly-summary.controller.js"></script>

<!-- Shared directives & filters -->
<script src="app/shared/directives/summary-card.directive.js"></script>
<script src="app/shared/directives/breakdown-chart.directive.js"></script>
<script src="app/shared/filters/currency-precise.filter.js"></script>
```

All script paths exist as defined in section 2.1.

---
## 3. index.html Structure & Bootstrap

### 3.1 Angular Bootstrapping

- Root Angular module name: `davmsMonthlySummaryApp`
- `ng-app` value on `<html>` or `<body>`: `davmsMonthlySummaryApp`
- `ng-view` location: inside main content container.

### 3.2 Complete index.html

```html
<!DOCTYPE html>
<html lang="en" ng-app="davmsMonthlySummaryApp">
<head>
  <meta charset="UTF-8">
  <title>DAVMS Monthly Spending Summary Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

  <!-- Application Styles -->
  <link rel="stylesheet" href="assets/css/styles.css">
  <link rel="stylesheet" href="assets/css/monthly-summary.css">
</head>
<body>
  <div class="container-fluid davms-app-root">
    <!-- Global Header / Navigation (simplified) -->
    <header class="row davms-header">
      <div class="col-xs-12 col-sm-6">
        <h1 class="davms-title">Monthly Spending Summary</h1>
        <p class="davms-subtitle">Credit Card Dashboard</p>
      </div>
      <div class="col-xs-12 col-sm-6 text-right davms-header-actions">
        <span class="davms-env-label" ng-bind="envLabel"></span>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="row davms-main">
      <div class="col-xs-12">
        <div ng-view></div>
      </div>
    </main>

    <!-- Global Footer (simplified) -->
    <footer class="row davms-footer">
      <div class="col-xs-12 text-center">
        <small>DAVMS &copy; 2024 - Monthly Spending Summary</small>
      </div>
    </footer>
  </div>

  <!-- Angular & External Scripts -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js"></script>

  <!-- Application Scripts (ordered) -->
  <script src="app/app.module.js"></script>
  <script src="app/app.config.js"></script>
  <script src="app/app.routes.js"></script>
  <script src="app/app.run.js"></script>

  <script src="app/core/config/env.config.js"></script>
  <script src="app/core/constants/app.constants.js"></script>

  <script src="app/core/models/monthly-summary.model.js"></script>
  <script src="app/core/models/breakdown-entry.model.js"></script>
  <script src="app/core/models/kpi-summary.model.js"></script>
  <script src="app/core/models/error.model.js"></script>

  <script src="app/core/services/api-endpoint.service.js"></script>
  <script src="app/core/services/env-config.service.js"></script>
  <script src="app/core/services/logging.service.js"></script>
  <script src="app/core/services/http-interceptor.factory.js"></script>

  <script src="app/core/mocks/mock-data.service.js"></script>

  <script src="app/features/monthly-summary/monthly-summary.service.js"></script>
  <script src="app/features/monthly-summary/month-selection.service.js"></script>
  <script src="app/features/monthly-summary/kpi-computation.service.js"></script>
  <script src="app/features/monthly-summary/breakdown.service.js"></script>
  <script src="app/features/monthly-summary/monthly-summary.controller.js"></script>

  <script src="app/shared/directives/summary-card.directive.js"></script>
  <script src="app/shared/directives/breakdown-chart.directive.js"></script>
  <script src="app/shared/filters/currency-precise.filter.js"></script>
</body>
</html>
```

---
## 4. Presentation Layer (UI Specification)

### 4.1 Screen Hierarchy

Single primary view:
- `MonthlySummaryView` (route: `/monthly-summary`)

Sub-components within view:
- Global page header (title, subtitle, environment label)
- Account selector (if multiple credit cards) – dropdown.
- Month selector – dropdown listing available months (billing cycles) within `maxLookbackMonths`.
- KPI summary cards (3–4 cards):
  - Total Spend
  - Number of Transactions
  - Average Transaction Value
  - Optional: Highest Spend Category.
- Breakdown chart (horizontal bar chart via Chart.js).
- Data state indicators:
  - Loading state
  - Empty state
  - Error state
  - Success state

### 4.2 Text Wireframe (ASCII)

```text
+----------------------------------------------------------------------------------+
| DAVMS Monthly Spending Summary Dashboard                                         |
| Credit Card Dashboard                                             [ENV: Mock]    |
+----------------------------------------------------------------------------------+
| Account: [Credit Card ****1234 ▼]   Month: [2024-06 (Jun 2024) ▼]               |
+----------------------------------------------------------------------------------+
| [Loading spinner / message while data loads]                                     |
+----------------------------------------------------------------------------------+
| [ERROR ALERT: Unable to load monthly summary. Please try again later.]          |
| [RETRY BUTTON]                                                                   |
+----------------------------------------------------------------------------------+
| KPIs                                                                             |
| +------------------+  +--------------------+  +---------------------+            |
| | Total Spend      |  | Transactions Count |  | Avg. Transaction    |            |
| | $ 1,234.56       |  | 45                 |  | $ 27.43             |            |
| +------------------+  +--------------------+  +---------------------+            |
|                                                                                |
| Optional fourth card:                                                          |
| +---------------------------+                                                   |
| | Top Category             |                                                   |
| | Groceries ($345.67)      |                                                   |
| +---------------------------+                                                   |
+----------------------------------------------------------------------------------+
| Breakdown (Bar Chart)                                                            |
| [Chart.js horizontal bar chart]                                                  |
|  Category            Amount                                                      |
|  Groceries        ██████████  $345.67                                           |
|  Online Shopping  ██████      $200.00                                           |
|  Dining           ███████████████ $500.00                                       |
|  Other            ███          $188.89                                           |
+----------------------------------------------------------------------------------+
| [Link/Button: View Detailed Insights]                                            |
+----------------------------------------------------------------------------------+
| Footer: DAVMS © 2024                                                             |
+----------------------------------------------------------------------------------+
```

### 4.3 Responsive Grid Layout

Bootstrap 3.4.1 grid usage:

- Root container: `.container-fluid`.
- Header row: `.row` containing:
  - `col-xs-12 col-sm-6` for title and subtitle.
  - `col-xs-12 col-sm-6 text-right` for environment label.

- Selector row: `.row` with two columns:
  - `col-xs-12 col-md-6` for account selector.
  - `col-xs-12 col-md-6` for month selector.

- KPIs row: `.row` with up to 4 KPI cards:
  - Each card: `col-xs-12 col-sm-6 col-md-3` to display 4 cards on desktop, 2 cards per row on tablet, 1 per row on mobile.

- Chart row: `.row` with `col-xs-12` for Chart.js canvas.

- States (loading/error/empty): appear as full-width `.col-xs-12` alert/panel rows.

### 4.4 Bootstrap Components

Use the following components:
- `navbar` or header styled with custom CSS (no full navbar required but header uses similar styles).
- `form-control` for `<select>` elements (account & month selectors).
- `panel` or `well` for KPI card containers (custom card styling overlay).
- `alert` for error messages (`alert-danger`) and informational messages (`alert-info` for empty states).
- `btn` (`btn-primary`, `btn-default`) for reloading / view details actions.
- `glyphicon` for icons (e.g., `glyphicon-credit-card`, `glyphicon-time`, `glyphicon-stats`).

### 4.5 Detailed UI Components

#### 4.5.1 Account & Month Selectors

- Account selector (top-left):
  - Element: `<select class="form-control" ng-model="vm.selectedAccountId" ng-options="acc.id as acc.displayName for acc in vm.accounts" ng-change="vm.onAccountChange()"></select>`
  - Displays masked credit card (e.g., "Credit Card ****1234").

- Month selector (top-right):
  - Element: `<select class="form-control" ng-model="vm.selectedMonth" ng-options="month.value as month.label for month in vm.availableMonths" ng-change="vm.onMonthChange()"></select>`
  - `month.value` format: `YYYY-MM`.

#### 4.5.2 KPI Summary Cards

Implement via `summary-card` directive.

Each card shows:
- Icon
- KPI label
- KPI value
- Optional subtext (e.g., currency or description).

Directive usage:

```html
<div class="row davms-kpi-row" ng-if="vm.hasData">
  <summary-card
      label="Total Spend"
      icon="glyphicon glyphicon-credit-card"
      value="vm.kpiSummary.totalSpend"
      value-format="currency"
      subtext="This month">
  </summary-card>

  <summary-card
      label="Transactions"
      icon="glyphicon glyphicon-list-alt"
      value="vm.kpiSummary.transactionCount"
      value-format="number">
  </summary-card>

  <summary-card
      label="Avg. Transaction"
      icon="glyphicon glyphicon-stats"
      value="vm.kpiSummary.averageTransactionValue"
      value-format="currency"
      subtext="Per transaction">
  </summary-card>

  <summary-card
      label="Top Category"
      icon="glyphicon glyphicon-tags"
      value="vm.kpiSummary.topCategoryLabel"
      value-format="string"
      subtext="vm.kpiSummary.topCategoryAmount">
  </summary-card>
</div>
```

Each `summary-card` occupies appropriate bootstrap columns internally.

#### 4.5.3 Breakdown Chart

Implement via `breakdown-chart` directive using Chart.js horizontal bar chart.

Directive usage:

```html
<div class="row davms-breakdown-row" ng-if="vm.hasData && vm.breakdownEntries.length">
  <breakdown-chart
      entries="vm.breakdownEntries"
      title="Monthly Spend Breakdown">
  </breakdown-chart>
</div>
```

Chart details:
- Chart type: `horizontalBar` (Chart.js 2.9.4)
- Labels: `breakdownEntry.categoryLabel`
- Data: `breakdownEntry.amount`
- Colors: defined in CSS/JS (blue/green palette consistent with enterprise look).

#### 4.5.4 States

- Loading state:

```html
<div class="row" ng-if="vm.isLoading">
  <div class="col-xs-12">
    <div class="davms-loading text-center">
      <span class="glyphicon glyphicon-refresh glyphicon-spin"></span>
      <span>Loading monthly summary...</span>
    </div>
  </div>
</div>
```

- Error state:

```html
<div class="row" ng-if="vm.error">
  <div class="col-xs-12">
    <div class="alert alert-danger">
      <strong>Error:</strong> {{ vm.error.userMessage }}
      <button class="btn btn-default btn-sm pull-right" ng-click="vm.retry()">Retry</button>
    </div>
  </div>
</div>
```

- Empty state:

```html
<div class="row" ng-if="vm.hasData && vm.isEmpty">
  <div class="col-xs-12">
    <div class="alert alert-info">
      No transactions found for the selected month.
    </div>
  </div>
</div>
```

- Success state: KPI cards + chart visible.

#### 4.5.5 Navigation

Within this epic, navigation is limited to:
- Primary route: `/monthly-summary`.
- Secondary navigation: a "View Detailed Insights" button linking to another route or external context (placeholder only, no behavior implemented beyond simple href).

```html
<div class="row davms-actions-row" ng-if="vm.hasData && !vm.isEmpty">
  <div class="col-xs-12 text-right">
    <a class="btn btn-primary" href="#/spend-analytics">View Detailed Insights</a>
  </div>
</div>
```

Route `#/spend-analytics` may not exist in this epic; this is a simple link with no route configuration here.

### 4.6 Responsive Behavior

- Desktop:
  - Account and month selectors on a single row (two columns).
  - Four KPI cards on one row.
  - Chart full-width below.

- Tablet:
  - Account & month selectors stacking but still side-by-side where possible.
  - KPI cards two per row.

- Mobile:
  - Selectors stacked vertically.
  - KPI cards one per row.
  - Chart full-width.
  - Font sizes optimized for readability.

Media queries and Bootstrap grid classes are used to ensure responsiveness.

### 4.7 CSS File Structure & Theme

#### 4.7.1 `assets/css/styles.css`

Global styles:
- Body base font: `"Helvetica Neue", Arial, sans-serif`.
- Background color: `#f5f7fa`.
- Text color: `#333`.
- Global header & footer styling.

Key selectors:
- `.davms-app-root`
- `.davms-header`
- `.davms-footer`
- `.davms-title`
- `.davms-subtitle`
- `.davms-env-label`

#### 4.7.2 `assets/css/monthly-summary.css`

Feature-specific styles:
- `.davms-main`
- `.davms-kpi-row` & `.davms-kpi-card`
- `.davms-kpi-label`, `.davms-kpi-value`, `.davms-kpi-subtext`
- `.davms-loading`
- `.davms-breakdown-row`
- Chart container styles.

Theme:
- Primary color: `#0066b3` (corporate blue).
- Accent color: `#00a86b` (green for positive metrics).
- Card background: `#ffffff` with subtle shadow `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`.
- Spacing: 15–30px margins/paddings consistent with bootstrap.

Icons:
- Use Bootstrap glyphicons (no custom icon font required).
- Optional PNG icons stored under `assets/img/icons` for non-glyphicon uses; referenced only if used.

---
## 5. Angular Module & Bootstrap Details

### 5.1 Root Angular Module Declaration

Only one module is declared with array syntax in `app/app.module.js`:

```javascript
// app/app.module.js
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp', [
      'ngRoute',
      'ngAnimate',
      'ngSanitize',
      'ui.bootstrap'
    ]);
})();
```

All other files use the getter syntax: `angular.module('davmsMonthlySummaryApp')`.

### 5.2 Config & Run Blocks

#### 5.2.1 `app/app.config.js`

Responsibilities:
- Configure `$httpProvider` to use the custom interceptor.
- Configure global `$qProvider` settings as needed.

```javascript
// app/app.config.js
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .config(appConfig);

  appConfig.$inject = ['$httpProvider'];

  function appConfig($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
  }
})();
```

#### 5.2.2 `app/app.routes.js`

Defines route configuration.

```javascript
// app/app.routes.js
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .config(routeConfig);

  routeConfig.$inject = ['$routeProvider'];

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/monthly-summary', {
        templateUrl: 'app/features/monthly-summary/templates/monthly-summary.view.html',
        controller: 'MonthlySummaryController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/monthly-summary'
      });
  }
})();
```

Default route: `/monthly-summary`.

#### 5.2.3 `app/app.run.js`

Provides runtime initialization (e.g., environment label binding).

```javascript
// app/app.run.js
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .run(appRun);

  appRun.$inject = ['$rootScope', 'EnvConfigService'];

  function appRun($rootScope, EnvConfigService) {
    var envConfig = EnvConfigService.getConfig();
    $rootScope.envLabel = envConfig.useMockData ? 'Mock' : 'Production';
  }
})();
```

Startup services (`EnvConfigService`) do not depend on API services, complying with constraints.

---
## 6. Component Registry

Each component is uniquely registered with the root module `davmsMonthlySummaryApp`.

| Name                     | Type        | File Path                                                       | Module                      | Registration Method        | Dependencies                                                                 |
|--------------------------|------------|-----------------------------------------------------------------|-----------------------------|----------------------------|------------------------------------------------------------------------------|
| davmsMonthlySummaryApp   | Module      | app/app.module.js                                               | N/A                         | `angular.module([...])`   | `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`                         |
| appConfig                | Config      | app/app.config.js                                               | davmsMonthlySummaryApp      | `.config(appConfig)`      | `$httpProvider`                                                               |
| routeConfig              | Config      | app/app.routes.js                                               | davmsMonthlySummaryApp      | `.config(routeConfig)`    | `$routeProvider`                                                              |
| appRun                   | Run         | app/app.run.js                                                  | davmsMonthlySummaryApp      | `.run(appRun)`            | `$rootScope`, `EnvConfigService`                                             |
| ENV_CONFIG               | Constant    | app/core/config/env.config.js                                   | davmsMonthlySummaryApp      | `.constant('ENV_CONFIG')` | (none)                                                                       |
| APP_CONSTANTS            | Constant    | app/core/constants/app.constants.js                             | davmsMonthlySummaryApp      | `.constant('APP_CONSTANTS')`| (none)                                                                       |
| MonthlySummaryModel      | Model (Factory) | app/core/models/monthly-summary.model.js                    | davmsMonthlySummaryApp      | `.factory('MonthlySummaryModel')` | (none)                                                        |
| BreakdownEntryModel      | Model (Factory) | app/core/models/breakdown-entry.model.js                   | davmsMonthlySummaryApp      | `.factory('BreakdownEntryModel')` | (none)                                                        |
| KpiSummaryModel          | Model (Factory) | app/core/models/kpi-summary.model.js                       | davmsMonthlySummaryApp      | `.factory('KpiSummaryModel')` | (none)                                                       |
| ErrorModel               | Model (Factory) | app/core/models/error.model.js                            | davmsMonthlySummaryApp      | `.factory('ErrorModel')`  | (none)                                                                       |
| ApiEndpointService       | Service     | app/core/services/api-endpoint.service.js                    | davmsMonthlySummaryApp      | `.service('ApiEndpointService')` | `ENV_CONFIG`                                                  |
| EnvConfigService         | Service     | app/core/services/env-config.service.js                      | davmsMonthlySummaryApp      | `.service('EnvConfigService')` | `ENV_CONFIG`                                                  |
| LoggingService           | Service     | app/core/services/logging.service.js                         | davmsMonthlySummaryApp      | `.service('LoggingService')` | `$injector` (lazy `$http`), `$log`                            |
| httpInterceptor          | Factory     | app/core/services/http-interceptor.factory.js                | davmsMonthlySummaryApp      | `.factory('httpInterceptor')` | `$q`, `LoggingService`, `ErrorModel`                           |
| MockDataService          | Service     | app/core/mocks/mock-data.service.js                          | davmsMonthlySummaryApp      | `.service('MockDataService')` | `$q`, `$timeout`                                              |
| MonthlySummaryService    | Service     | app/features/monthly-summary/monthly-summary.service.js      | davmsMonthlySummaryApp      | `.service('MonthlySummaryService')` | `$http`, `$q`, `ApiEndpointService`, `EnvConfigService`, `MockDataService`, `KpiComputationService`, `BreakdownService`, `MonthSelectionService`, `MonthlySummaryModel`, `ErrorModel` |
| MonthSelectionService    | Service     | app/features/monthly-summary/month-selection.service.js      | davmsMonthlySummaryApp      | `.service('MonthSelectionService')` | `APP_CONSTANTS`                                  |
| KpiComputationService    | Service     | app/features/monthly-summary/kpi-computation.service.js      | davmsMonthlySummaryApp      | `.service('KpiComputationService')` | `KpiSummaryModel`                               |
| BreakdownService         | Service     | app/features/monthly-summary/breakdown.service.js            | davmsMonthlySummaryApp      | `.service('BreakdownService')` | `BreakdownEntryModel`                                      |
| MonthlySummaryController | Controller  | app/features/monthly-summary/monthly-summary.controller.js   | davmsMonthlySummaryApp      | `.controller('MonthlySummaryController')` | `$scope`, `MonthlySummaryService`, `MonthSelectionService`, `APP_CONSTANTS` |
| summaryCard              | Directive   | app/shared/directives/summary-card.directive.js              | davmsMonthlySummaryApp      | `.directive('summaryCard')` | (none, but uses isolated scope)                                              |
| breakdownChart           | Directive   | app/shared/directives/breakdown-chart.directive.js           | davmsMonthlySummaryApp      | `.directive('breakdownChart')` | `$timeout`                                                  |
| currencyPrecise          | Filter      | app/shared/filters/currency-precise.filter.js                | davmsMonthlySummaryApp      | `.filter('currencyPrecise')` | `$filter`                                                     |

No circular dependencies across modules, controllers, services, directives, or factories.

---
## 7. Component Specifications

### 7.1 Config & Run Components

#### 7.1.1 `appConfig` (Config)

- **Responsibility**: Attach `httpInterceptor` to `$httpProvider.interceptors`.
- **Injected Services**: `$httpProvider`.
- **Public Methods**: N/A (config block).
- **Private Methods**: `appConfig` function.
- **Business Rules**: All HTTP requests and responses go through `httpInterceptor`.
- **Error Handling**: Delegated to `httpInterceptor`.

#### 7.1.2 `routeConfig` (Config)

- **Responsibility**: Configure routing for `/monthly-summary`.
- **Injected Services**: `$routeProvider`.
- **Routes**:
  - `/monthly-summary`: uses `MonthlySummaryController` and template `app/features/monthly-summary/templates/monthly-summary.view.html`.
  - `otherwise`: redirects to `/monthly-summary`.
- **Error Handling**: Default Angular routing; misconfigured routes would cause blank view but config is consistent.

#### 7.1.3 `appRun` (Run)

- **Responsibility**: Initialize environment label based on `EnvConfigService`.
- **Injected Services**: `$rootScope`, `EnvConfigService`.
- **Public Methods**: N/A.
- **Behavior**:
  - On app run, retrieve config via `EnvConfigService.getConfig()` and set `$rootScope.envLabel`.

### 7.2 Constants & Config Services

#### 7.2.1 `ENV_CONFIG` (Constant) – `app/core/config/env.config.js`

Content (JSON-like object):

```javascript
// app/core/config/env.config.js
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .constant('ENV_CONFIG', {
      apiBaseUrl: 'https://api.davms.example.com',
      apiTimeoutMs: 10000,
      maxLookbackMonths: 12,
      useMockData: true, // default: mock mode
      featureFlags: {
        enableBreakdownChart: true,
        enableTopCategoryCard: true
      },
      telemetry: {
        enableLogging: true,
        logLevel: 'info'
      }
    });
})();
```

Configuration semantics:
- `useMockData` toggle switches between mock and production (only flag changed to modify mode).

#### 7.2.2 `APP_CONSTANTS` (Constant) – `app/core/constants/app.constants.js`

```javascript
// app/core/constants/app.constants.js
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .constant('APP_CONSTANTS', {
      DATE_FORMAT_MONTH: 'YYYY-MM',
      ERROR_CODES: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
      },
      PRODUCT_TYPES: {
        CREDIT_CARD: 'CREDIT_CARD'
      }
    });
})();
```

### 7.3 Models

#### 7.3.1 `MonthlySummaryModel` – `app/core/models/monthly-summary.model.js`

- **Properties**:
  - `accountId` (string) – credit card account identifier (masked for UI).
  - `month` (string, `YYYY-MM`).
  - `totalSpend` (number, currency value). Default `0`.
  - `transactionCount` (number). Default `0`.
  - `averageTransactionValue` (number). Default `0`.
  - `topCategoryLabel` (string). Default `''`.
  - `topCategoryAmount` (number). Default `0`.
  - `breakdownEntries` (Array<BreakdownEntryModel>). Default `[]`.

- **Constructor**: `MonthlySummaryModel(data)` where `data` is JSON response.

```javascript
// app/core/models/monthly-summary.model.js
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .factory('MonthlySummaryModel', MonthlySummaryModel);

  MonthlySummaryModel.$inject = ['BreakdownEntryModel'];

  function MonthlySummaryModel(BreakdownEntryModel) {
    function MonthlySummary(data) {
      data = data || {};
      this.accountId = data.accountId || '';
      this.month = data.month || '';
      this.totalSpend = Number(data.totalSpend || 0);
      this.transactionCount = Number(data.transactionCount || 0);
      this.averageTransactionValue = Number(data.averageTransactionValue || 0);
      this.topCategoryLabel = data.topCategoryLabel || '';
      this.topCategoryAmount = Number(data.topCategoryAmount || 0);
      this.breakdownEntries = Array.isArray(data.breakdownEntries)
        ? data.breakdownEntries.map(function(entry) { return new BreakdownEntryModel(entry); })
        : [];
    }

    MonthlySummary.prototype.isEmpty = function() {
      return this.transactionCount === 0;
    };

    return MonthlySummary;
  }
})();
```

- **Validation Rules**:
  - `month` must match `YYYY-MM` format (validated in services).
  - Numeric fields must be `>= 0` (enforced in computation services).

- **Sample JSON**:

```json
{
  "accountId": "CC-****1234",
  "month": "2024-06",
  "totalSpend": 1234.56,
  "transactionCount": 45,
  "averageTransactionValue": 27.43,
  "topCategoryLabel": "Groceries",
  "topCategoryAmount": 345.67,
  "breakdownEntries": [
    { "categoryCode": "GROCERY", "categoryLabel": "Groceries", "amount": 345.67 },
    { "categoryCode": "ONLINE", "categoryLabel": "Online Shopping", "amount": 200.00 },
    { "categoryCode": "DINING", "categoryLabel": "Dining", "amount": 500.00 },
    { "categoryCode": "OTHER", "categoryLabel": "Other", "amount": 188.89 }
  ]
}
```

- **State Transitions**:
  - `MonthlySummaryModel` instances created when API or mock responses are received.
  - UI updates bound to properties and `isEmpty()`.

#### 7.3.2 `BreakdownEntryModel` – `app/core/models/breakdown-entry.model.js`

- **Properties**:
  - `categoryCode` (string) – coarse category identifier.
  - `categoryLabel` (string) – user-friendly category label.
  - `amount` (number) – total spend in category.

- **Constructor**:

```javascript
// app/core/models/breakdown-entry.model.js
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .factory('BreakdownEntryModel', BreakdownEntryModel);

  function BreakdownEntryModel() {
    function BreakdownEntry(data) {
      data = data || {};
      this.categoryCode = data.categoryCode || '';
      this.categoryLabel = data.categoryLabel || '';
      this.amount = Number(data.amount || 0);
    }
    return BreakdownEntry;
  }
})();
```

- **Validation**:
  - `amount >= 0`.

- **Sample JSON**: as shown in `MonthlySummaryModel`.

#### 7.3.3 `KpiSummaryModel` – `app/core/models/kpi-summary.model.js`

- **Properties**:
  - `totalSpend` (number).
  - `transactionCount` (number).
  - `averageTransactionValue` (number).
  - `topCategoryLabel` (string).
  - `topCategoryAmount` (number).

- **Constructor**:

```javascript
// app/core/models/kpi-summary.model.js
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .factory('KpiSummaryModel', KpiSummaryModel);

  function KpiSummaryModel() {
    function KpiSummary(data) {
      data = data || {};
      this.totalSpend = Number(data.totalSpend || 0);
      this.transactionCount = Number(data.transactionCount || 0);
      this.averageTransactionValue = Number(data.averageTransactionValue || 0);
      this.topCategoryLabel = data.topCategoryLabel || '';
      this.topCategoryAmount = Number(data.topCategoryAmount || 0);
    }

    return KpiSummary;
  }
})();
```

#### 7.3.4 `ErrorModel` – `app/core/models/error.model.js`

- **Properties**:
  - `statusCode` (number).
  - `technicalMessage` (string).
  - `userMessage` (string).
  - `retryable` (boolean).

- **Constructor**:

```javascript
// app/core/models/error.model.js
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .factory('ErrorModel', ErrorModel);

  ErrorModel.$inject = ['APP_CONSTANTS'];

  function ErrorModel(APP_CONSTANTS) {
    function Error(data) {
      data = data || {};
      this.statusCode = data.statusCode || 0;
      this.technicalMessage = data.technicalMessage || '';
      this.userMessage = data.userMessage || 'An unexpected error occurred.';
      this.retryable = data.retryable !== undefined ? data.retryable : isRetryable(this.statusCode);
    }

    function isRetryable(statusCode) {
      return statusCode === APP_CONSTANTS.ERROR_CODES.SERVER_ERROR ||
             statusCode === APP_CONSTANTS.ERROR_CODES.BAD_REQUEST;
    }

    return Error;
  }
})();
```

- **Sample JSON**:

```json
{
  "statusCode": 500,
  "technicalMessage": "Aggregation store unavailable",
  "userMessage": "We are temporarily unable to load your monthly summary.",
  "retryable": true
}
```

---
## 8. Core Services & Interceptor

### 8.1 `ApiEndpointService` – `app/core/services/api-endpoint.service.js`

- **Responsibility**: Build API URLs based on `ENV_CONFIG`.

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('ApiEndpointService', ApiEndpointService);

  ApiEndpointService.$inject = ['ENV_CONFIG'];

  function ApiEndpointService(ENV_CONFIG) {
    this.getMonthlySummaryUrl = function(accountId, month) {
      return ENV_CONFIG.apiBaseUrl + '/summary?accountId=' + encodeURIComponent(accountId) + '&month=' + encodeURIComponent(month);
    };

    this.getAvailableMonthsUrl = function(accountId) {
      return ENV_CONFIG.apiBaseUrl + '/summary/months?accountId=' + encodeURIComponent(accountId);
    };
  }
})();
```

### 8.2 `EnvConfigService` – `app/core/services/env-config.service.js`

- **Responsibility**: Expose configuration and mode switching.

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('EnvConfigService', EnvConfigService);

  EnvConfigService.$inject = ['ENV_CONFIG'];

  function EnvConfigService(ENV_CONFIG) {
    this.getConfig = function() {
      return ENV_CONFIG;
    };

    this.isMockMode = function() {
      return !!ENV_CONFIG.useMockData;
    };
  }
})();
```

### 8.3 `LoggingService` – `app/core/services/logging.service.js`

- **Responsibility**: Log events, errors, and interactions; lazy resolve `$http`.

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('LoggingService', LoggingService);

  LoggingService.$inject = ['$injector', '$log', 'ENV_CONFIG'];

  function LoggingService($injector, $log, ENV_CONFIG) {
    var http; // lazy

    function getHttp() {
      if (!http) {
        http = $injector.get('$http');
      }
      return http;
    }

    this.info = function(message, meta) {
      if (ENV_CONFIG.telemetry.enableLogging) {
        $log.info(message, meta || {});
      }
    };

    this.error = function(message, meta) {
      if (ENV_CONFIG.telemetry.enableLogging) {
        $log.error(message, meta || {});
      }
    };

    this.audit = function(eventName, payload) {
      // Optionally send to backend audit endpoint if required in future.
      // Currently just logs to console.
      if (ENV_CONFIG.telemetry.enableLogging && ENV_CONFIG.telemetry.logLevel === 'info') {
        this.info('AUDIT: ' + eventName, payload);
      }
      // If backend logging is needed, use getHttp() to avoid eager $http injection.
    };
  }
})();
```

### 8.4 `httpInterceptor` – `app/core/services/http-interceptor.factory.js`

- **Responsibility**: Intercept HTTP responses and errors, convert them into `ErrorModel` where needed.
- **Constraint**: Must not depend directly on `$http` (it does not).

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .factory('httpInterceptor', httpInterceptor);

  httpInterceptor.$inject = ['$q', 'LoggingService', 'ErrorModel'];

  function httpInterceptor($q, LoggingService, ErrorModel) {
    return {
      response: function(response) {
        // Successful response
        return response;
      },
      responseError: function(rejection) {
        var error = new ErrorModel({
          statusCode: rejection.status,
          technicalMessage: rejection.statusText || 'HTTP error',
          userMessage: 'Unable to load data at this time. Please try again.',
          retryable: true
        });

        LoggingService.error('HTTP error', {
          status: rejection.status,
          url: rejection.config && rejection.config.url
        });

        return $q.reject(error);
      }
    };
  }
})();
```

---
## 9. Feature Services & Controller

### 9.1 `MonthSelectionService` – `app/features/monthly-summary/month-selection.service.js`

- **Responsibility**: Convert user-selected `YYYY-MM` into a canonical date range; enforce lookback and future constraints.

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('MonthSelectionService', MonthSelectionService);

  MonthSelectionService.$inject = ['APP_CONSTANTS'];

  function MonthSelectionService(APP_CONSTANTS) {
    this.resolveDateRange = function(monthValue) {
      // monthValue format: YYYY-MM
      // Assumption: calendar month; business rules can be adjusted later.
      var parts = monthValue.split('-');
      var year = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10) - 1; // JS Date month index
      var start = new Date(year, month, 1);
      var end = new Date(year, month + 1, 0); // last day of month
      return { startDate: start, endDate: end };
    };

    this.isValidMonth = function(monthValue, maxLookbackMonths) {
      // Validate format YYYY-MM and lookback
      var regex = /^\d{4}-\d{2}$/;
      if (!regex.test(monthValue)) {
        return false;
      }
      var parts = monthValue.split('-');
      var year = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10) - 1;
      var selected = new Date(year, month, 1);
      var now = new Date();
      var lookback = new Date(now.getFullYear(), now.getMonth() - maxLookbackMonths, 1);
      return selected >= lookback && selected <= now;
    };
  }
})();
```

### 9.2 `KpiComputationService` – `app/features/monthly-summary/kpi-computation.service.js`

- **Responsibility**: Derive KPIs from raw transaction/aggregate data.

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('KpiComputationService', KpiComputationService);

  KpiComputationService.$inject = ['KpiSummaryModel'];

  function KpiComputationService(KpiSummaryModel) {
    this.computeKpis = function(transactionsOrAggregates, breakdownEntries) {
      var totalSpend = 0;
      var transactionCount = 0;

      // Expect aggregates with amount and count
      transactionsOrAggregates.forEach(function(item) {
        totalSpend += Number(item.amount || 0);
        transactionCount += Number(item.count || 0);
      });

      var averageTransactionValue = transactionCount > 0 ? (totalSpend / transactionCount) : 0;

      // Determine top category from breakdown entries
      var topCategoryLabel = '';
      var topCategoryAmount = 0;

      if (Array.isArray(breakdownEntries)) {
        breakdownEntries.forEach(function(entry) {
          if (Number(entry.amount) > topCategoryAmount) {
            topCategoryAmount = Number(entry.amount);
            topCategoryLabel = entry.categoryLabel;
          }
        });
      }

      return new KpiSummaryModel({
        totalSpend: totalSpend,
        transactionCount: transactionCount,
        averageTransactionValue: averageTransactionValue,
        topCategoryLabel: topCategoryLabel,
        topCategoryAmount: topCategoryAmount
      });
    };
  }
})();
```

### 9.3 `BreakdownService` – `app/features/monthly-summary/breakdown.service.js`

- **Responsibility**: Convert raw breakdown data into `BreakdownEntryModel` instances, enforce coarse categories.

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('BreakdownService', BreakdownService);

  BreakdownService.$inject = ['BreakdownEntryModel'];

  function BreakdownService(BreakdownEntryModel) {
    this.buildBreakdownEntries = function(rawEntries) {
      rawEntries = rawEntries || [];
      return rawEntries.map(function(entry) {
        return new BreakdownEntryModel({
          categoryCode: entry.categoryCode,
          categoryLabel: entry.categoryLabel,
          amount: entry.amount
        });
      });
    };
  }
})();
```

### 9.4 `MockDataService` – `app/core/mocks/mock-data.service.js`

- **Responsibility**: Provide mock asynchronous responses using `$q` and `$timeout`.

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('MockDataService', MockDataService);

  MockDataService.$inject = ['$q', '$timeout'];

  function MockDataService($q, $timeout) {
    this.getMonthlySummary = function(accountId, month) {
      var deferred = $q.defer();
      $timeout(function() {
        // Simulate successful response
        var response = {
          accountId: accountId,
          month: month,
          aggregates: [
            { amount: 345.67, count: 10 },
            { amount: 200.00, count: 5 },
            { amount: 500.00, count: 20 },
            { amount: 188.89, count: 10 }
          ],
          breakdownEntries: [
            { categoryCode: 'GROCERY', categoryLabel: 'Groceries', amount: 345.67 },
            { categoryCode: 'ONLINE', categoryLabel: 'Online Shopping', amount: 200.00 },
            { categoryCode: 'DINING', categoryLabel: 'Dining', amount: 500.00 },
            { categoryCode: 'OTHER', categoryLabel: 'Other', amount: 188.89 }
          ]
        };
        deferred.resolve({ data: response });
      }, 500); // 500ms simulated delay
      return deferred.promise;
    };

    this.getAvailableMonths = function(accountId) {
      var deferred = $q.defer();
      $timeout(function() {
        var response = [
          { value: '2024-06', label: 'Jun 2024' },
          { value: '2024-05', label: 'May 2024' },
          { value: '2024-04', label: 'Apr 2024' }
        ];
        deferred.resolve({ data: response });
      }, 300);
      return deferred.promise;
    };
  }
})();
```

Mock responses adhere to the same models as production responses.

### 9.5 `MonthlySummaryService` – `app/features/monthly-summary/monthly-summary.service.js`

- **Responsibility**: Orchestrate calls to REST API or mock mode, compute KPIs, build models.

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('MonthlySummaryService', MonthlySummaryService);

  MonthlySummaryService.$inject = ['$http', '$q', 'ApiEndpointService', 'EnvConfigService', 'MockDataService', 'KpiComputationService', 'BreakdownService', 'MonthSelectionService', 'MonthlySummaryModel', 'ErrorModel'];

  function MonthlySummaryService($http, $q, ApiEndpointService, EnvConfigService, MockDataService, KpiComputationService, BreakdownService, MonthSelectionService, MonthlySummaryModel, ErrorModel) {

    this.getAvailableMonths = function(accountId) {
      if (EnvConfigService.isMockMode()) {
        return MockDataService.getAvailableMonths(accountId).then(function(response) {
          return response.data;
        });
      }
      var url = ApiEndpointService.getAvailableMonthsUrl(accountId);
      return $http.get(url, { timeout: EnvConfigService.getConfig().apiTimeoutMs })
        .then(function(response) {
          return response.data;
        });
    };

    this.getMonthlySummary = function(accountId, month) {
      var config = EnvConfigService.getConfig();

      if (!MonthSelectionService.isValidMonth(month, config.maxLookbackMonths)) {
        return $q.reject(new ErrorModel({
          statusCode: 400,
          technicalMessage: 'Invalid month selection',
          userMessage: 'Selected month is out of allowed range.',
          retryable: false
        }));
      }

      var promise;

      if (EnvConfigService.isMockMode()) {
        promise = MockDataService.getMonthlySummary(accountId, month);
      } else {
        var url = ApiEndpointService.getMonthlySummaryUrl(accountId, month);
        promise = $http.get(url, { timeout: config.apiTimeoutMs });
      }

      return promise.then(function(response) {
        var data = response.data;
        var aggregates = data.aggregates || [];
        var breakdownEntries = BreakdownService.buildBreakdownEntries(data.breakdownEntries);
        var kpiSummary = KpiComputationService.computeKpis(aggregates, breakdownEntries);

        var summary = new MonthlySummaryModel({
          accountId: data.accountId,
          month: data.month,
          totalSpend: kpiSummary.totalSpend,
          transactionCount: kpiSummary.transactionCount,
          averageTransactionValue: kpiSummary.averageTransactionValue,
          topCategoryLabel: kpiSummary.topCategoryLabel,
          topCategoryAmount: kpiSummary.topCategoryAmount,
          breakdownEntries: breakdownEntries
        });

        return summary;
      });
    };
  }
})();
```

### 9.6 `MonthlySummaryController` – `app/features/monthly-summary/monthly-summary.controller.js`

- **Responsibility**: Bind data/state to view, handle user interactions (month/account selection, retry).

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .controller('MonthlySummaryController', MonthlySummaryController);

  MonthlySummaryController.$inject = ['$scope', 'MonthlySummaryService', 'MonthSelectionService', 'APP_CONSTANTS'];

  function MonthlySummaryController($scope, MonthlySummaryService, MonthSelectionService, APP_CONSTANTS) {
    var vm = this;

    vm.accounts = [
      { id: 'CC-****1234', displayName: 'Credit Card ****1234' }
      // In production, this would come from a separate profile API.
    ];

    vm.availableMonths = [];
    vm.selectedAccountId = vm.accounts[0].id;
    vm.selectedMonth = null;
    vm.summary = null;
    vm.kpiSummary = null;
    vm.breakdownEntries = [];
    vm.isLoading = false;
    vm.error = null;
    vm.hasData = false;
    vm.isEmpty = false;

    vm.onAccountChange = onAccountChange;
    vm.onMonthChange = onMonthChange;
    vm.retry = retry;

    activate();

    function activate() {
      loadAvailableMonths(vm.selectedAccountId);
    }

    function loadAvailableMonths(accountId) {
      vm.isLoading = true;
      vm.error = null;

      MonthlySummaryService.getAvailableMonths(accountId)
        .then(function(months) {
          vm.availableMonths = months;
          if (months && months.length) {
            vm.selectedMonth = months[0].value;
            return loadMonthlySummary(accountId, vm.selectedMonth);
          } else {
            vm.isLoading = false;
            vm.hasData = false;
            vm.isEmpty = true;
          }
        })
        .catch(function(error) {
          vm.isLoading = false;
          vm.error = error;
        });
    }

    function loadMonthlySummary(accountId, month) {
      vm.isLoading = true;
      vm.error = null;

      MonthlySummaryService.getMonthlySummary(accountId, month)
        .then(function(summary) {
          vm.summary = summary;
          vm.breakdownEntries = summary.breakdownEntries;
          vm.kpiSummary = {
            totalSpend: summary.totalSpend,
            transactionCount: summary.transactionCount,
            averageTransactionValue: summary.averageTransactionValue,
            topCategoryLabel: summary.topCategoryLabel,
            topCategoryAmount: summary.topCategoryAmount
          };
          vm.isEmpty = summary.isEmpty();
          vm.hasData = !vm.isEmpty;
          vm.isLoading = false;
        })
        .catch(function(error) {
          vm.error = error;
          vm.isLoading = false;
          vm.hasData = false;
        });
    }

    function onAccountChange() {
      loadAvailableMonths(vm.selectedAccountId);
    }

    function onMonthChange() {
      if (vm.selectedMonth) {
        loadMonthlySummary(vm.selectedAccountId, vm.selectedMonth);
      }
    }

    function retry() {
      if (vm.selectedAccountId && vm.selectedMonth) {
        loadMonthlySummary(vm.selectedAccountId, vm.selectedMonth);
      } else if (vm.selectedAccountId) {
        loadAvailableMonths(vm.selectedAccountId);
      }
    }
  }
})();
```

---
## 10. Directives & Filters

### 10.1 `summaryCard` Directive – `app/shared/directives/summary-card.directive.js`

- **restrict**: `'E'`
- **scope**:
  - `label: '@'`
  - `icon: '@'`
  - `value: '<'`
  - `valueFormat: '@'` (e.g., `currency`, `number`, `string`)
  - `subtext: '@'` (optional)
- **bindToController**: `true`
- **controller**: inline or named controller `SummaryCardController`.
- **controllerAs**: `'vmCard'`
- **templateUrl**: `'app/shared/templates/components/summary-card.html'`

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .directive('summaryCard', summaryCard);

  function summaryCard() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        icon: '@',
        value: '<',
        valueFormat: '@',
        subtext: '@'
      },
      bindToController: true,
      controller: SummaryCardController,
      controllerAs: 'vmCard',
      templateUrl: 'app/shared/templates/components/summary-card.html'
    };
  }

  SummaryCardController.$inject = ['$filter'];

  function SummaryCardController($filter) {
    var vm = this;

    vm.getFormattedValue = function() {
      if (vm.valueFormat === 'currency') {
        return $filter('currencyPrecise')(vm.value);
      }
      if (vm.valueFormat === 'number') {
        return $filter('number')(vm.value);
      }
      return vm.value;
    };
  }
})();
```

#### 10.1.1 `summary-card.html` Template

```html
<div class="col-xs-12 col-sm-6 col-md-3">
  <div class="panel panel-default davms-kpi-card">
    <div class="panel-body">
      <div class="davms-kpi-icon">
        <span ng-class="vmCard.icon"></span>
      </div>
      <div class="davms-kpi-content">
        <div class="davms-kpi-label">{{ vmCard.label }}</div>
        <div class="davms-kpi-value">{{ vmCard.getFormattedValue() }}</div>
        <div class="davms-kpi-subtext" ng-if="vmCard.subtext">{{ vmCard.subtext }}</div>
      </div>
    </div>
  </div>
</div>
```

### 10.2 `breakdownChart` Directive – `app/shared/directives/breakdown-chart.directive.js`

- **restrict**: `'E'`
- **scope**:
  - `entries: '<'`
  - `title: '@'`
- **bindToController**: `true`
- **controller**: `BreakdownChartController`
- **controllerAs**: `'vmChart'`
- **templateUrl**: `'app/shared/templates/components/breakdown-chart.html'`

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .directive('breakdownChart', breakdownChart);

  breakdownChart.$inject = [];

  function breakdownChart() {
    return {
      restrict: 'E',
      scope: {
        entries: '<',
        title: '@'
      },
      bindToController: true,
      controller: BreakdownChartController,
      controllerAs: 'vmChart',
      templateUrl: 'app/shared/templates/components/breakdown-chart.html'
    };
  }

  BreakdownChartController.$inject = ['$timeout'];

  function BreakdownChartController($timeout) {
    var vm = this;
    var chartInstance;

    vm.$onInit = function() {
      $timeout(renderChart, 0); // ensure DOM ready
    };

    vm.$onChanges = function() {
      $timeout(renderChart, 0);
    };

    function renderChart() {
      if (!vm.entries || !vm.entries.length) {
        return;
      }

      var labels = vm.entries.map(function(e) { return e.categoryLabel; });
      var data = vm.entries.map(function(e) { return e.amount; });

      var ctx = document.getElementById('davmsBreakdownChartCanvas');
      if (!ctx) {
        return;
      }

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Amount',
            data: data,
            backgroundColor: '#0066b3'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }
  }
})();
```

#### 10.2.1 `breakdown-chart.html` Template

```html
<div class="col-xs-12">
  <div class="panel panel-default davms-breakdown-chart">
    <div class="panel-heading">
      <h3 class="panel-title">{{ vmChart.title }}</h3>
    </div>
    <div class="panel-body">
      <div class="davms-chart-container">
        <canvas id="davmsBreakdownChartCanvas"></canvas>
      </div>
    </div>
  </div>
</div>
```

### 10.3 `currencyPrecise` Filter – `app/shared/filters/currency-precise.filter.js`

- **Responsibility**: Format currency with 2 decimal places.

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .filter('currencyPrecise', currencyPrecise);

  currencyPrecise.$inject = ['$filter'];

  function currencyPrecise($filter) {
    return function(amount) {
      return $filter('currency')(amount, '$', 2);
    };
  }
})();
```

---
## 11. Templates

### 11.1 `monthly-summary.view.html`

```html
<div class="davms-monthly-summary">
  <!-- Selectors Row -->
  <div class="row davms-selector-row">
    <div class="col-xs-12 col-md-6">
      <label>Account</label>
      <select class="form-control" ng-model="vm.selectedAccountId" ng-options="acc.id as acc.displayName for acc in vm.accounts" ng-change="vm.onAccountChange()"></select>
    </div>
    <div class="col-xs-12 col-md-6">
      <label>Month</label>
      <select class="form-control" ng-model="vm.selectedMonth" ng-options="month.value as month.label for month in vm.availableMonths" ng-change="vm.onMonthChange()"></select>
    </div>
  </div>

  <!-- Loading State -->
  <div class="row" ng-if="vm.isLoading">
    <div class="col-xs-12">
      <div class="davms-loading text-center">
        <span class="glyphicon glyphicon-refresh glyphicon-spin"></span>
        <span>Loading monthly summary...</span>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div class="row" ng-if="vm.error">
    <div class="col-xs-12">
      <div class="alert alert-danger">
        <strong>Error:</strong> {{ vm.error.userMessage }}
        <button class="btn btn-default btn-sm pull-right" ng-click="vm.retry()">Retry</button>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div class="row" ng-if="vm.hasData && vm.isEmpty">
    <div class="col-xs-12">
      <div class="alert alert-info">
        No transactions found for the selected month.
      </div>
    </div>
  </div>

  <!-- KPI & Breakdown Content -->
  <div ng-if="vm.hasData && !vm.isEmpty">
    <!-- KPI Cards -->
    <div class="row davms-kpi-row">
      <summary-card
        label="Total Spend"
        icon="glyphicon glyphicon-credit-card"
        value="vm.kpiSummary.totalSpend"
        value-format="currency"
        subtext="This month">
      </summary-card>

      <summary-card
        label="Transactions"
        icon="glyphicon glyphicon-list-alt"
        value="vm.kpiSummary.transactionCount"
        value-format="number">
      </summary-card>

      <summary-card
        label="Avg. Transaction"
        icon="glyphicon glyphicon-stats"
        value="vm.kpiSummary.averageTransactionValue"
        value-format="currency"
        subtext="Per transaction">
      </summary-card>

      <summary-card
        ng-if="vm.kpiSummary.topCategoryLabel"
        label="Top Category"
        icon="glyphicon glyphicon-tags"
        value="vm.kpiSummary.topCategoryLabel"
        value-format="string"
        subtext="{{ vm.kpiSummary.topCategoryAmount | currencyPrecise }}">
      </summary-card>
    </div>

    <!-- Breakdown Chart -->
    <div class="row davms-breakdown-row" ng-if="vm.breakdownEntries.length">
      <breakdown-chart entries="vm.breakdownEntries" title="Monthly Spend Breakdown"></breakdown-chart>
    </div>

    <!-- Actions -->
    <div class="row davms-actions-row">
      <div class="col-xs-12 text-right">
        <a class="btn btn-primary" href="#/spend-analytics">View Detailed Insights</a>
      </div>
    </div>
  </div>
</div>
```

All `templateUrl` paths exist and are correctly referenced in directives and routes.

---
## 12. Stylesheets

### 12.1 `assets/css/styles.css`

High-level content (implementation-ready):

```css
body {
  font-family: "Helvetica Neue", Arial, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

.davms-app-root {
  min-height: 100vh;
}

.davms-header {
  padding: 15px 15px 5px 15px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
}

.davms-title {
  margin: 0;
  font-size: 24px;
  color: #0066b3;
}

.davms-subtitle {
  margin: 0;
  font-size: 14px;
  color: #777;
}

.davms-env-label {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

.davms-footer {
  padding: 10px;
  border-top: 1px solid #e0e0e0;
  background-color: #ffffff;
  margin-top: 20px;
}
```

### 12.2 `assets/css/monthly-summary.css`

Feature-specific content:

```css
.davms-main {
  padding: 15px;
}

.davms-selector-row {
  margin-bottom: 20px;
}

.davms-loading {
  padding: 20px;
  font-size: 14px;
}

.glyphicon-spin {
  -webkit-animation: spin 1s infinite linear;
  animation: spin 1s infinite linear;
}

@-webkit-keyframes spin {
  from { -webkit-transform: rotate(0deg); }
  to { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.davms-kpi-row {
  margin-top: 20px;
}

.davms-kpi-card {
  margin-bottom: 15px;
}

.davms-kpi-icon {
  float: left;
  font-size: 28px;
  color: #0066b3;
}

.davms-kpi-content {
  margin-left: 40px;
}

.davms-kpi-label {
  font-size: 13px;
  text-transform: uppercase;
  color: #777;
}

.davms-kpi-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.davms-kpi-subtext {
  font-size: 12px;
  color: #999;
}

.davms-breakdown-chart .panel-body {
  height: 300px;
}

.davms-chart-container {
  position: relative;
  height: 100%;
}

@media (max-width: 767px) {
  .davms-kpi-icon {
    font-size: 24px;
  }

  .davms-kpi-value {
    font-size: 18px;
  }
}
```

---
## 13. REST API Contracts

The frontend interacts with a backend Monthly Spending Summary API when `useMockData = false`.

### 13.1 Available Months API

- **URL**: `/summary/months`
- **HTTP Method**: `GET`
- **Full Request Example**:
  - `GET https://api.davms.example.com/summary/months?accountId=CC-****1234`

- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Query Parameters**:
  - `accountId` (string, required) – credit card account identifier.

- **Path Parameters**: None.
- **Request Payload**: None.

- **Response Payload (Success)**:

```json
[
  { "value": "2024-06", "label": "Jun 2024" },
  { "value": "2024-05", "label": "May 2024" },
  { "value": "2024-04", "label": "Apr 2024" }
]
```

- **Success Responses**:
  - `200 OK` – array of month objects.

- **Error Responses**:
  - `400 Bad Request` – invalid `accountId`.
  - `401 Unauthorized` – missing/invalid token.
  - `403 Forbidden` – user not permitted to access account.
  - `500 Internal Server Error` – generic backend failure.

- **Timeout**: `apiTimeoutMs` (10,000 ms).
- **Retry Behavior**: Client does not automatically retry; user may click `Retry`.

### 13.2 Monthly Summary API

- **URL**: `/summary`
- **HTTP Method**: `GET`
- **Full Request Example**:
  - `GET https://api.davms.example.com/summary?accountId=CC-****1234&month=2024-06`

- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Query Parameters**:
  - `accountId` (string, required) – must be credit card account.
  - `month` (string, `YYYY-MM`, required).

- **Response Payload (Success)**:

```json
{
  "accountId": "CC-****1234",
  "month": "2024-06",
  "aggregates": [
    { "amount": 345.67, "count": 10 },
    { "amount": 200.00, "count": 5 },
    { "amount": 500.00, "count": 20 },
    { "amount": 188.89, "count": 10 }
  ],
  "breakdownEntries": [
    { "categoryCode": "GROCERY", "categoryLabel": "Groceries", "amount": 345.67 },
    { "categoryCode": "ONLINE", "categoryLabel": "Online Shopping", "amount": 200.00 },
    { "categoryCode": "DINING", "categoryLabel": "Dining", "amount": 500.00 },
    { "categoryCode": "OTHER", "categoryLabel": "Other", "amount": 188.89 }
  ]
}
```

- **Success Responses**:
  - `200 OK` – summary data available.

- **Error Responses**:
  - `400 Bad Request` – invalid month format or non-credit card product.
  - `401 Unauthorized` – missing/invalid token.
  - `403 Forbidden` – unauthorized account access.
  - `404 Not Found` – no transactions for given month.
  - `500 Internal Server Error` – backend failure.

- **Timeout**: `apiTimeoutMs` (10,000 ms).
- **Retry Behavior**: No automatic retries; user may manually retry.

---
## 14. Mock Data Design

Mock mode is enabled by `ENV_CONFIG.useMockData = true`.

### 14.1 Behavior

- All API calls in `MonthlySummaryService` use `MockDataService` instead of `$http` when mock mode is enabled.
- Async behavior: both `getMonthlySummary` and `getAvailableMonths` return promises resolved via `$timeout`.
- Delay simulation: `300–500ms` delays simulate network latency.
- Error simulation: can be added by introducing alternate mock methods or conditions (e.g., invalid accountId causes `deferred.reject(new ErrorModel(...))`).

Mock responses strictly follow the production REST contracts defined in section 13.

---
## 15. Data Flow

### 15.1 Success Flow

User Action → Controller → Service → Model → Directive/View → UI Update

1. User opens `/monthly-summary` → Angular route loads `MonthlySummaryController` and view.
2. Controller `activate()` calls `MonthlySummaryService.getAvailableMonths(accountId)`.
3. In mock mode, `MockDataService.getAvailableMonths(accountId)` returns available months.
4. Controller sets `vm.selectedMonth` and calls `MonthlySummaryService.getMonthlySummary(accountId, month)`.
5. Service validates month via `MonthSelectionService.isValidMonth()`.
6. Service (mock or production) retrieves summary data.
7. Service uses `BreakdownService.buildBreakdownEntries()` and `KpiComputationService.computeKpis()` to derive KPIs and breakdown entries.
8. Service constructs `MonthlySummaryModel` instance.
9. Controller receives `summary` and updates `vm.summary`, `vm.kpiSummary`, `vm.breakdownEntries`, `vm.hasData`, `vm.isEmpty`.
10. View displays KPI cards via `summary-card` directive and chart via `breakdown-chart` directive.

### 15.2 Failure Flow

1. Service call fails (HTTP error or validation failure).
2. `httpInterceptor` converts rejection into `ErrorModel` (HTTP errors) or service returns `ErrorModel` (validation errors).
3. Controller `catch` receives `error` (`ErrorModel`) and sets `vm.error`.
4. View displays error alert with `vm.error.userMessage` and `Retry` button.
5. User clicks `Retry` → `vm.retry()` re-invokes service.

---
## 16. Error Handling

### 16.1 ErrorModel Usage

- All errors surfaced to the controller use `ErrorModel`.
- HTTP errors: created in `httpInterceptor`.
- Validation errors: created directly in `MonthlySummaryService`.

### 16.2 HTTP Error Mapping

Status codes map to user messages:
- `400`: "Selected month is out of allowed range." or generic bad request.
- `401`: "Your session has expired. Please sign in again." (could be implemented in interceptor).
- `403`: "You are not authorized to view this account.".
- `404`: "No data found for the selected month.".
- `500`: "We are temporarily unable to load your monthly summary.".

### 16.3 Validation Failures

- Invalid month format or beyond `maxLookbackMonths` returns an `ErrorModel` with `retryable = false`.
- Controller can hide `Retry` button based on `error.retryable` if desired.

### 16.4 Network Failures

- Captured by `httpInterceptor` → `ErrorModel` with `retryable = true`.

### 16.5 Retry Logic

- User-driven via `Retry` button.
- No automatic client-side retries to avoid loops.

### 16.6 Logging

- `LoggingService.error` logs HTTP errors and other technical failures.
- `LoggingService.audit` may be used to log summary view accesses.

### 16.7 Fallback Behavior

- If breakdown entries fail (future expansion), service could still compute KPIs from aggregates only and set `breakdownEntries = []`; UI will show KPI cards without chart.

---
## 17. Security

### 17.1 Input Validation

- Month validation via `MonthSelectionService.isValidMonth`.
- Account ID assumed valid credit card account (in real implementation would be validated with backend).

### 17.2 Sanitization

- AngularJS binding auto-escapes values (no `ng-bind-html` used except where sanitized).
- No direct user-provided HTML.

### 17.3 Authentication Hooks

- Frontend expects `Authorization` header to be injected by hosting app; this epic does not manage tokens.

### 17.4 Authorization Hooks

- Backend summary API responsible for enforcing RBAC/ABAC; frontend handles HTTP `403` gracefully.

### 17.5 Secure Communication

- All URLs use `https://`.

### 17.6 Audit Logging

- `LoggingService.audit` can be extended to send events to backend.

---
## 18. Implementation Rules & Standards

### 18.1 ES6 Syntax

- Use ES6 features supported by Chrome and Edge (e.g., `let`, `const`, arrow functions where appropriate inside services). For clarity, this LLD uses mostly ES5-style functions but code generation may adopt ES6 where safe.

### 18.2 Explicit `$inject` Syntax

- All Angular components declare `$inject` arrays, ensuring safe minification.

### 18.3 ControllerAs Syntax

- All controllers use `controllerAs` (`vm` / `vmCard` / `vmChart`).

### 18.4 Promise Handling

- Use `.then().catch()` chains with `$q` where necessary.

### 18.5 Naming Conventions

- Files: `kebab-case` with `.js` or `.html` suffix.
- Services: `PascalCaseService` naming inside JS.
- Directives: `camelCase` names with `summaryCard`, `breakdownChart` element tags.

### 18.6 Folder Conventions

- `core` for shared infrastructure (config, models, services, mocks).
- `features` for feature-specific files.
- `shared` for reusable directives, filters, and templates.

---
## 19. Architecture Constraints Validation

- Single Angular module declaration with array syntax (`app.module.js` only).
- All other files use `angular.module('davmsMonthlySummaryApp')`.
- No circular module dependencies (only root module exists).
- No circular service/controller/directive/factory dependencies (dependencies are acyclic and straightforward).
- `httpInterceptor` does not depend on `$http`.
- `LoggingService` lazily resolves `$http` via `$injector` and does not cause circular dependency.
- Startup bootstrap (`app.run.js`) depends only on `EnvConfigService` (no API services).
- Every dependency is registered exactly once.

---
## 20. Consistency & Completeness Checks

- Every source file and folder listed has a specification.
- Every component is in the registry.
- Every injected service is declared and registered.
- Route `/monthly-summary` references `MonthlySummaryController` and `monthly-summary.view.html` which exist.
- All `templateUrl` paths exist: `monthly-summary.view.html`, `summary-card.html`, `breakdown-chart.html`.
- All script references in `index.html` are defined and paths are valid.
- All stylesheet references exist.
- No circular dependencies.
- Mock mode fully specified with `MockDataService`, `useMockData` flag, and integration in `MonthlySummaryService`.
- Application can execute directly from `index.html` without missing JS/CSS dependencies (given backend or mock mode).

This LLD is implementation-ready and provides a complete specification for code generation of the DAVMS Monthly Spending Summary Dashboard SPA for Epic QE-3179.