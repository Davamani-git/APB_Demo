# Low-Level Design (LLD) – QE-3250 – Spending Summary Dashboard

## 1. Solution Overview & Conformance to Standards

This LLD defines an AngularJS 1.7.9 single page application (SPA) implementation of the **Spending Summary Dashboard** for epic **QE-3250** in repository `APB_Demo`, branch `DADashboard`. It is derived directly from the QE-3250 HLD and conforms to all rules in `lldgenerationspecifications`, including:

- Technology stack (AngularJS 1.7.9, Angular Route, Angular Animate, Angular Sanitize, Angular UI Bootstrap 2.5.6, Bootstrap 3.4.1 CSS, Chart.js 2.9.4, HTML5, CSS3, JS ES6).
- AngularJS MVC SPA architecture with ControllerAs, IIFE modules, explicit DI, and REST-based communication.
- Repository structure and per-file documentation requirements.
- UI standards for dashboards (KPI cards, trends chart, layout, states, responsiveness, accessibility).
- REST API contracts and mock implementations.
- Configuration and ENV standards and mock/production switching via `useMockData` only.
- Validation, error handling, logging, security, and quality gates.

The application provides:
- Monthly spending summary with key metrics for credit card customers.
- 6‑month spending trend visualization.
- Summary cards and charts driven by REST APIs.
- Month selection and corresponding summary view.

Non-credit-card products and transaction-level management features are explicitly out of scope.

---

## 2. Technology Stack & Dependencies

### 2.1 Frontend Stack

- **HTML5** – Structure for index and templates.
- **CSS3** – Custom styles under `assets/css`.
- **JavaScript ES6** – Application logic.
- **AngularJS 1.7.9** – Core framework.
- **Angular Route 1.7.9** – Client-side routing.
- **Angular Animate 1.7.9** – Animations (loading transitions, chart/card animations).
- **Angular Sanitize 1.7.9** – Safe HTML and content handling.
- **Angular UI Bootstrap 2.5.6** – Bootstrap components (modals, tooltips, etc.).
- **Bootstrap 3.4.1 CSS** – Responsive grid and components.
- **Chart.js 2.9.4** – Charts for spending trends and monthly breakdown.

### 2.2 Browser Support

- Google Chrome (current enterprise-supported versions).
- Microsoft Edge (current enterprise-supported versions).

No jQuery or `bootstrap.min.js` is used unless mandated by a future HLD change (not present in QE-3250). All components use pure AngularJS and Bootstrap CSS.

---

## 3. Repository Structure & File Inventory

Repository: `Davamani-git/APB_Demo`
Branch: `DADashboard`

The following structure and files are required for QE-3250:

```text
index.html
README.md

src/
  app/
    app.module.js
    app.config.js
    app.routes.js

    controllers/
      spendingSummaryDashboardController.js

    services/
      spendingSummaryService.js
      spendingTrendsService.js
      insightsFormattingService.js
      configService.js
      loggingService.js
      exceptionHandlerService.js

    factories/
      httpClientFactory.js

    directives/
      kpiCardDirective.js
      spendingTrendChartDirective.js
      loadingStateDirective.js
      errorStateDirective.js

    filters/
      currencyFormatFilter.js
      dateFormatFilter.js
      percentageFilter.js

    models/
      monthlySummaryModel.js
      spendingTrendModel.js
      errorModel.js

    config/
      env.default.json
      env.dev.json
      env.prod.json
      config.constants.js

    routes/
      dashboard.route.js

  templates/
    dashboard/
      spending-summary-dashboard.html
    directives/
      kpi-card.html
      spending-trend-chart.html
      loading-state.html
      error-state.html

  assets/
    css/
      app.css
      dashboard.css
    js/
      (optional helper JS modules if needed, referenced here explicitly when added)
    images/
      (icons/assets used by KPI cards and charts)
    fonts/
      (font files if custom fonts are used)

  mock/
    spendingSummary.mock.js
    spendingTrends.mock.js

  data/
    mock/
      monthly-summary.mock.json
      spending-trends.mock.json
```

For each file below, this LLD specifies: path, component type, purpose, dependencies, consumers, referenced resources, and implementation details.

---

## 4. index.html Specification

**Path:** `index.html`
**Purpose:** Root HTML page for the SPA Spending Summary Dashboard.

### 4.1 Structure

- `<!DOCTYPE html>` HTML5 document.
- Root `<html>` element with `<head>` and `<body>`.
- `<body>` includes:
  - `<div class="container-fluid" ng-app="app">` root with AngularJS `ng-app="app"`.
  - Layout:
    - Header section (`<header>`).
    - Main content section containing `<div ng-view></div>`.
    - Footer section (`<footer>`).

### 4.2 Stylesheet Includes (Order)

In `<head>`:

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<link rel="stylesheet" href="assets/css/app.css">
<link rel="stylesheet" href="assets/css/dashboard.css">
```

- Bootstrap CSS first.
- Application CSS (`app.css` then `dashboard.css`).

No external JS from Bootstrap; only CSS.

### 4.3 Script Includes (Order)

Scripts must be loaded in this exact order before closing `</body>` to avoid injector and bootstrap issues:

```html
<!-- Angular Core & Extensions -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js"></script>

<!-- Configuration -->
<script src="src/app/config/config.constants.js"></script>
<script src="src/app/config/env.default.json" type="application/json"></script>
<script src="src/app/config/env.dev.json" type="application/json"></script>
<script src="src/app/config/env.prod.json" type="application/json"></script>
<script src="src/app/services/configService.js"></script>

<!-- Application Module & Core -->
<script src="src/app/app.module.js"></script>
<script src="src/app/app.config.js"></script>
<script src="src/app/app.routes.js"></script>

<!-- Factories -->
<script src="src/app/factories/httpClientFactory.js"></script>

<!-- Models -->
<script src="src/app/models/monthlySummaryModel.js"></script>
<script src="src/app/models/spendingTrendModel.js"></script>
<script src="src/app/models/errorModel.js"></script>

<!-- Services -->
<script src="src/app/services/loggingService.js"></script>
<script src="src/app/services/exceptionHandlerService.js"></script>
<script src="src/app/services/insightsFormattingService.js"></script>
<script src="src/app/services/spendingSummaryService.js"></script>
<script src="src/app/services/spendingTrendsService.js"></script>

<!-- Filters -->
<script src="src/app/filters/currencyFormatFilter.js"></script>
<script src="src/app/filters/dateFormatFilter.js"></script>
<script src="src/app/filters/percentageFilter.js"></script>

<!-- Directives -->
<script src="src/app/directives/kpiCardDirective.js"></script>
<script src="src/app/directives/spendingTrendChartDirective.js"></script>
<script src="src/app/directives/loadingStateDirective.js"></script>
<script src="src/app/directives/errorStateDirective.js"></script>

<!-- Controllers & Routes -->
<script src="src/app/controllers/spendingSummaryDashboardController.js"></script>
<script src="src/app/routes/dashboard.route.js"></script>
```

### 4.4 Body Layout

```html
<body>
  <div class="container-fluid" ng-app="app">
    <header class="row">
      <div class="col-xs-12">
        <h1 class="page-title">Spending Summary Dashboard</h1>
      </div>
    </header>

    <main class="row">
      <div class="col-xs-12">
        <div ng-view></div>
      </div>
    </main>

    <footer class="row">
      <div class="col-xs-12 text-muted text-center">
        <small>Data displayed is based on aggregated credit card spending only.</small>
      </div>
    </footer>
  </div>
</body>
```

---

## 5. AngularJS Module, Configuration & Routing

### 5.1 Root Module Definition – `app.module.js`

**Path:** `src/app/app.module.js`
**Type:** AngularJS module.

Responsibilities:
- Define single root module `app`.
- Register top-level dependencies.

Implementation outline:

```js
(function () {
  'use strict';

  angular.module('app', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap'
  ]);
})();
```

No other file may re-declare `angular.module('app', [...])`; all other components must use `angular.module('app')`.

### 5.2 Global Configuration – `app.config.js`

**Path:** `src/app/app.config.js`
**Type:** AngularJS config block.

Responsibilities:
- Configure exception handler.
- Configure logging if needed.
- Set up any Angular-level providers.

Dependencies:
- `$provide` for exception handler decoration.
- `exceptionHandlerService`.

Sample outline:

```js
(function () {
  'use strict';

  config.$inject = ['$provide'];

  function config($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', 'exceptionHandlerService',
      function ($delegate, exceptionHandlerService) {
        return function (exception, cause) {
          exceptionHandlerService.handleException(exception, cause);
          $delegate(exception, cause);
        };
      }
    ]);
  }

  angular.module('app')
    .config(config);
})();
```

No direct `$http` injection inside exception handler; it relies on loggingService which avoids circular dependencies.

### 5.3 Routing – `app.routes.js` & `dashboard.route.js`

**Path:** `src/app/app.routes.js`
**Type:** AngularJS config block for base routing setup.

Responsibilities:
- Configure default route and route fallback.

Implementation outline:

```js
(function () {
  'use strict';

  routesConfig.$inject = ['$routeProvider'];

  function routesConfig($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/dashboard/spending-summary'
      });
  }

  angular.module('app')
    .config(routesConfig);
})();
```

**Path:** `src/app/routes/dashboard.route.js`
**Type:** Route-specific configuration.

Routes:

- `/dashboard/spending-summary`
  - Template: `templates/dashboard/spending-summary-dashboard.html`
  - Controller: `SpendingSummaryDashboardController`
  - ControllerAs: `vm`

Implementation outline:

```js
(function () {
  'use strict';

  dashboardRouteConfig.$inject = ['$routeProvider'];

  function dashboardRouteConfig($routeProvider) {
    $routeProvider
      .when('/dashboard/spending-summary', {
        templateUrl: 'templates/dashboard/spending-summary-dashboard.html',
        controller: 'SpendingSummaryDashboardController',
        controllerAs: 'vm'
      });
  }

  angular.module('app')
    .config(dashboardRouteConfig);
})();
```

Quality requirements:
- `templateUrl` must match file path.
- Controller must be defined and registered.
- Default route must redirect to `/dashboard/spending-summary`.

---

## 6. Configuration & Environment

### 6.1 Constants – `config.constants.js`

**Path:** `src/app/config/config.constants.js`
**Type:** AngularJS constant definitions.

Responsibilities:
- Define constant keys used for configuration and environment selection.

Example:

```js
(function () {
  'use strict';

  angular.module('app')
    .constant('ENV_CONFIG_KEY', 'env.config')
    .constant('DEFAULT_API_TIMEOUT_MS', 15000)
    .constant('MAX_LOOKBACK_MONTHS', 6);
})();
```

### 6.2 Environment Files – `env.default.json`, `env.dev.json`, `env.prod.json`

**Paths:**
- `src/app/config/env.default.json`
- `src/app/config/env.dev.json`
- `src/app/config/env.prod.json`

**Type:** JSON configuration resources.

Structure:

```json
{
  "apiBaseUrl": "https://api.dev.example.com",  
  "apiTimeoutMs": 15000,
  "maxLookbackMonths": 6,
  "useMockData": true,
  "featureFlags": {
    "enableSixMonthTrend": true,
    "enableMonthlyCategoryBreakdown": true
  },
  "telemetry": {
    "enabled": true,
    "endpoint": "https://telemetry.example.com"
  }
}
```

Notes:
- `env.default.json` defines base configuration.
- `env.dev.json` overrides for development (e.g., mock mode enabled).
- `env.prod.json` overrides for production (e.g., `useMockData: false`, production API URLs).

### 6.3 Config Service – `configService.js`

**Path:** `src/app/services/configService.js`
**Type:** AngularJS service.

Purpose:
- Load environment configuration from JSON resources.
- Expose `getConfig()` and `getFeatureFlag(flagName)`.
- Provide `isMockEnabled()` based on `useMockData`.

Dependencies:
- `$http` (to load JSON config files).
- `$q` (promises).
- `ENV_CONFIG_KEY` constant.

Outline:

```js
(function () {
  'use strict';

  ConfigService.$inject = ['$http', '$q'];

  function ConfigService($http, $q) {
    var configCache = null;

    function loadConfig() {
      if (configCache) {
        return $q.resolve(configCache);
      }
      // Implementation detail: choose env file based on hostname or build-time injection.
      return $http.get('src/app/config/env.default.json')
        .then(function (response) {
          configCache = response.data;
          return configCache;
        });
    }

    function getConfig() {
      return loadConfig();
    }

    function getFeatureFlag(flagName) {
      return loadConfig().then(function (cfg) {
        return !!(cfg.featureFlags && cfg.featureFlags[flagName]);
      });
    }

    function isMockEnabled() {
      return loadConfig().then(function (cfg) {
        return !!cfg.useMockData;
      });
    }

    return {
      getConfig: getConfig,
      getFeatureFlag: getFeatureFlag,
      isMockEnabled: isMockEnabled
    };
  }

  angular.module('app')
    .service('configService', ConfigService);
})();
```

Changing `useMockData` in JSON must toggle between mock and production behaviour without code changes.

---

## 7. Models

### 7.1 MonthlySummaryModel – `monthlySummaryModel.js`

**Path:** `src/app/models/monthlySummaryModel.js`
**Type:** AngularJS factory or plain JS model.

Purpose:
- Represent monthly spending summary metrics for a credit card customer.

Properties:
- `month` (string, format `YYYY-MM`, required).
- `totalSpend` (number, >= 0, required).
- `transactionCount` (number, integer, >= 0, required).
- `averageSpend` (number, >= 0, optional, derived).
- `currency` (string, required, e.g., `"USD"`).
- `categories` (array of category summaries, optional):
  - Each category: `{ name: string, amount: number, percentage: number }`.

Default Values:
- `totalSpend = 0`.
- `transactionCount = 0`.
- `averageSpend = 0`.
- `categories = []`.

Validation Rules:
- `month` must match `^\d{4}-\d{2}$`.
- Numeric fields must be `>= 0`.
- `currency` required.

Sample JSON:

```json
{
  "month": "2026-07",
  "totalSpend": 1250.75,
  "transactionCount": 42,
  "averageSpend": 29.78,
  "currency": "USD",
  "categories": [
    { "name": "Groceries", "amount": 300.00, "percentage": 24.0 },
    { "name": "Dining", "amount": 250.00, "percentage": 20.0 }
  ]
}
```

### 7.2 SpendingTrendModel – `spendingTrendModel.js`

**Path:** `src/app/models/spendingTrendModel.js`

Purpose:
- Represent 6‑month trend data.

Properties:
- `startMonth` (string, `YYYY-MM`, required).
- `endMonth` (string, `YYYY-MM`, required).
- `points` (array of `{ month: string, totalSpend: number, transactionCount: number }`, length up to 6).
- `currency` (string, required).

Validation:
- Each `points[i].month` valid.
- `points.length` <= `maxLookbackMonths` from config.

Sample JSON:

```json
{
  "startMonth": "2026-02",
  "endMonth": "2026-07",
  "currency": "USD",
  "points": [
    { "month": "2026-02", "totalSpend": 900.50, "transactionCount": 30 },
    { "month": "2026-03", "totalSpend": 1000.00, "transactionCount": 32 },
    { "month": "2026-04", "totalSpend": 1100.25, "transactionCount": 35 },
    { "month": "2026-05", "totalSpend": 950.00, "transactionCount": 28 },
    { "month": "2026-06", "totalSpend": 1200.00, "transactionCount": 40 },
    { "month": "2026-07", "totalSpend": 1250.75, "transactionCount": 42 }
  ]
}
```

### 7.3 ErrorModel – `errorModel.js`

**Path:** `src/app/models/errorModel.js`

Purpose:
- Represent standardized error information for UI.

Properties:
- `code` (string, required, e.g., `"ERR_INVALID_MONTH"`).
- `httpStatus` (number, optional, e.g., 400).
- `message` (string, required, end-user friendly message).
- `technicalMessage` (string, optional, not shown to user, used for logging).
- `correlationId` (string, optional).
- `retryable` (boolean, default `false`).

Sample JSON:

```json
{
  "code": "ERR_DATA_UNAVAILABLE",
  "httpStatus": 503,
  "message": "Spending data is temporarily unavailable. Please try again later.",
  "technicalMessage": "Upstream Card Transaction Aggregation Service timeout.",
  "correlationId": "abc123",
  "retryable": true
}
```

---

## 8. Filters

### 8.1 CurrencyFormatFilter – `currencyFormatFilter.js`

**Path:** `src/app/filters/currencyFormatFilter.js`

Purpose:
- Format numeric values as currency using configured currency.

Input:
- Number.

Output:
- String (e.g., `"$1,250.75"`).

Implementation outline:

```js
(function () {
  'use strict';

  currencyFormat.$inject = ['configService'];

  function currencyFormat(configService) {
    return function (amount) {
      if (amount === null || amount === undefined) {
        return '-';
      }
      // Basic formatting; could be enhanced with Intl.NumberFormat using configured locale.
      var value = Number(amount) || 0;
      return value.toFixed(2);
    };
  }

  angular.module('app')
    .filter('currencyFormat', currencyFormat);
})();
```

### 8.2 DateFormatFilter – `dateFormatFilter.js`

**Path:** `src/app/filters/dateFormatFilter.js`

Purpose:
- Present month keys (`YYYY-MM`) as human-readable (e.g., `"Jul 2026"`).

Input:
- String `YYYY-MM`.

Output:
- String.

### 8.3 PercentageFilter – `percentageFilter.js`

**Path:** `src/app/filters/percentageFilter.js`

Purpose:
- Format numeric ratio as percentage (e.g., 24 → `"24%"`).

Input:
- Number.

Output:
- String.

---

## 9. Services

### 9.1 LoggingService – `loggingService.js`

**Path:** `src/app/services/loggingService.js`

Purpose:
- Centralized logging abstraction.

Dependencies:
- `$log`.
- `$injector` (lazy `'$http'` if required for telemetry, not injected directly).

Methods:
- `debug(message, context)`.
- `info(message, context)`.
- `warn(message, context)`.
- `error(message, context)`.
- `audit(event, context)`.

Rules:
- No direct `$http` injection to avoid circular dependencies.
- Must not prevent app bootstrap.

### 9.2 ExceptionHandlerService – `exceptionHandlerService.js`

**Path:** `src/app/services/exceptionHandlerService.js`

Purpose:
- Handle uncaught exceptions.

Dependencies:
- `loggingService`.

Methods:
- `handleException(exception, cause)` – logs error and may show user-friendly error message via `$rootScope` broadcast (avoiding circular dependencies).

### 9.3 InsightsFormattingService – `insightsFormattingService.js`

**Path:** `src/app/services/insightsFormattingService.js`

Purpose:
- Transform domain data (monthly summary and trends) into UI-ready structures (cards, charts).

Dependencies:
- `configService` (for thresholds, chart types).

Public Methods:
- `formatMonthlySummary(rawSummary)` → `{ kpis: [...], charts: [...] }`.
- `formatSpendingTrends(rawTrend)` → chart dataset for Chart.js.

Private Methods:
- `buildKpiCards(rawSummary)` – map metrics to card definitions.
- `buildCharts(rawSummary, rawTrend)` – build Chart.js config objects.

Example KPI mapping:
- Total Spend.
- Transaction Count.
- Average Spend.
- Highest Spending Month (if needed for expansions).

Business Rules:
- Only aggregated metrics used; no PII.
- Feature flags from config used to enable/disable cards.

### 9.4 SpendingSummaryService – `spendingSummaryService.js`

**Path:** `src/app/services/spendingSummaryService.js`

Purpose:
- Retrieve monthly spending summary via REST API or mock.

Dependencies:
- `$http`.
- `$q`.
- `configService`.
- `httpClientFactory`.
- `loggingService`.
- `insightsFormattingService`.

Public Methods:
- `getMonthlySummary(month)` – returns promise resolving with formatted summary for UI.

Flow:
1. Validate `month` parameter (non-empty, `YYYY-MM` format).
2. Read config via `configService.getConfig()`.
3. If `useMockData` is true → delegate to mock.
4. Else → build request URL: `{apiBaseUrl}/spending-summary?month={month}`.
5. Use `httpClientFactory.get(url, { timeout: apiTimeoutMs })`.
6. On success: validate response against `MonthlySummaryModel`.
7. Map response to `MonthlySummaryModel` instance.
8. Call `insightsFormattingService.formatMonthlySummary(model)`.
9. Return formatted data.

Error handling:
- 400: invalid month → `ERR_INVALID_MONTH`.
- 401, 403: auth errors → `ERR_UNAUTHORIZED_ACCESS`.
- 404: no data → `ERR_NO_DATA` with message `"No spending data available for the selected month."`.
- 408/500/502/503: network/server errors → `ERR_DATA_UNAVAILABLE`.
- All errors logged via `loggingService.error` with correlation IDs if available.

### 9.5 SpendingTrendsService – `spendingTrendsService.js`

**Path:** `src/app/services/spendingTrendsService.js`

Purpose:
- Retrieve 6‑month trend data.

Dependencies:
- `$http`.
- `$q`.
- `configService`.
- `httpClientFactory`.
- `loggingService`.
- `insightsFormattingService`.

Public Methods:
- `getSixMonthTrends()` – returns promise with formatted chart dataset.

Flow:
1. Read config via `configService.getConfig()` to get `maxLookbackMonths`.
2. Determine range parameter (always 6 months in QE-3250, but configurable). E.g.: `range=6m`.
3. If `useMockData` → use mock.
4. Else → call `{apiBaseUrl}/spending-trends?range=6m`.
5. Validate response against `SpendingTrendModel`.
6. Pass to `insightsFormattingService.formatSpendingTrends(model)`.

Error handling similar to `SpendingSummaryService`.

---

## 10. Factories

### 10.1 HttpClientFactory – `httpClientFactory.js`

**Path:** `src/app/factories/httpClientFactory.js`

Purpose:
- Wrap `$http` with standard headers, error handling, and timeout.

Dependencies:
- `$http`.
- `configService`.

Methods:
- `get(url, options)`.
- `post(url, data, options)` (for future expansions; primarily `GET` used in QE-3250).

Rules:
- Attach IAM token from browser storage/headers if needed (e.g., `Authorization: Bearer <token>`).
- Apply default timeout from config when not provided.
- Handle error normalization into `ErrorModel`.

---

## 11. Directives & Templates

### 11.1 KPI Card Directive – `kpiCardDirective.js` & `kpi-card.html`

**Directive Path:** `src/app/directives/kpiCardDirective.js`
**Template Path:** `templates/directives/kpi-card.html`

Purpose:
- Encapsulate display of a single KPI card.

Bindings:
- `title` (`@`) – label (e.g., "Total Spend").
- `value` (`@` or `=`) – formatted value.
- `iconClass` (`@`) – CSS class for icon.
- `tooltip` (`@`) – optional tooltip text.
- `onClick` (`&`) – optional click handler.

Definition outline:

```js
(function () {
  'use strict';

  function kpiCard() {
    return {
      restrict: 'E',
      scope: {
        title: '@',
        value: '@',
        iconClass: '@',
        tooltip: '@',
        onClick: '&'
      },
      templateUrl: 'templates/directives/kpi-card.html',
      replace: false
    };
  }

  angular.module('app')
    .directive('kpiCard', kpiCard);
})();
```

Template outline:

```html
<div class="panel panel-default kpi-card" ng-click="onClick()">
  <div class="panel-body">
    <div class="kpi-icon" ng-class="iconClass"></div>
    <div class="kpi-label">{{ title }}</div>
    <div class="kpi-value">{{ value }}</div>
  </div>
</div>
```

### 11.2 Spending Trend Chart Directive – `spendingTrendChartDirective.js` & `spending-trend-chart.html`

**Directive Path:** `src/app/directives/spendingTrendChartDirective.js`
**Template Path:** `templates/directives/spending-trend-chart.html`

Purpose:
- Render 6‑month trend chart using Chart.js.

Bindings:
- `chartData` (`=`) – dataset, labels, options formatted by `insightsFormattingService`.
- `loading` (`=`) – loading state.
- `error` (`=`) – `ErrorModel` or boolean.

Definition outline:

```js
(function () {
  'use strict';

  function spendingTrendChart() {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        loading: '=',
        error: '='
      },
      templateUrl: 'templates/directives/spending-trend-chart.html',
      controller: SpendingTrendChartController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  SpendingTrendChartController.$inject = ['$element'];

  function SpendingTrendChartController($element) {
    var vm = this;
    var chartInstance = null;

    vm.$onInit = function () {
      renderChart();
    };

    vm.$onChanges = function (changes) {
      if (changes.chartData) {
        renderChart();
      }
    };

    function renderChart() {
      if (!vm.chartData || vm.loading || vm.error) {
        return;
      }
      var ctx = $element.find('canvas')[0].getContext('2d');
      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = new Chart(ctx, vm.chartData);
    }
  }

  angular.module('app')
    .directive('spendingTrendChart', spendingTrendChart);
})();
```

Template outline:

```html
<div class="trend-chart-container">
  <canvas aria-label="Six month spending trend" role="img"></canvas>
</div>
```

### 11.3 LoadingState Directive – `loadingStateDirective.js` & `loading-state.html`

**Purpose:** Display a consistent loading indicator.

Bindings:
- `loading` (`=`).
- `message` (`@`).

Template:

```html
<div class="loading-state" ng-if="loading">
  <span class="spinner"></span>
  <span class="loading-message">{{ message }}</span>
</div>
```

### 11.4 ErrorState Directive – `errorStateDirective.js` & `error-state.html`

**Purpose:** Display errors with retry/cancel controls.

Bindings:
- `error` (`=`) – `ErrorModel`.
- `onRetry` (`&`).

Template:

```html
<div class="error-state" ng-if="error">
  <div class="alert alert-danger">
    <strong>Error:</strong> {{ error.message }}
  </div>
  <button type="button" class="btn btn-default" ng-if="error.retryable" ng-click="onRetry()">Retry</button>
</div>
```

---

## 12. Controller – SpendingSummaryDashboardController

**Path:** `src/app/controllers/spendingSummaryDashboardController.js`
**Type:** AngularJS controller.

Purpose:
- Coordinate UI behaviour for the Spending Summary Dashboard.
- Orchestrate month selection, data loading, and state management.

Angular Registration:

```js
(function () {
  'use strict';

  SpendingSummaryDashboardController.$inject = [
    'spendingSummaryService',
    'spendingTrendsService',
    'configService',
    'loggingService'
  ];

  function SpendingSummaryDashboardController(
    spendingSummaryService,
    spendingTrendsService,
    configService,
    loggingService
  ) {
    var vm = this;

    // ViewModel properties
    vm.selectedMonth = null;
    vm.monthOptions = [];
    vm.monthlySummary = null;
    vm.trendChartData = null;

    vm.summaryLoading = false;
    vm.trendLoading = false;

    vm.summaryError = null; // ErrorModel
    vm.trendError = null;   // ErrorModel

    // Public methods
    vm.initialize = initialize;
    vm.onMonthChange = onMonthChange;
    vm.retrySummary = retrySummary;
    vm.retryTrend = retryTrend;

    // Initialization
    initialize();

    function initialize() {
      // Build month options (e.g., last 6 months) based on current date; for simplicity, month list is derived client-side.
      buildMonthOptions();
      vm.selectedMonth = vm.monthOptions[0];
      loadSummary(vm.selectedMonth);
      loadTrend();
    }

    function buildMonthOptions() {
      // Implementation detail: compute current month and last N months.
    }

    function onMonthChange() {
      loadSummary(vm.selectedMonth);
    }

    function loadSummary(month) {
      vm.summaryLoading = true;
      vm.summaryError = null;

      spendingSummaryService.getMonthlySummary(month)
        .then(function (data) {
          vm.monthlySummary = data;
        })
        .catch(function (error) {
          vm.summaryError = error;
          loggingService.error('Failed to load monthly summary', { error: error, month: month });
        })
        .finally(function () {
          vm.summaryLoading = false;
        });
    }

    function loadTrend() {
      vm.trendLoading = true;
      vm.trendError = null;

      spendingTrendsService.getSixMonthTrends()
        .then(function (data) {
          vm.trendChartData = data;
        })
        .catch(function (error) {
          vm.trendError = error;
          loggingService.error('Failed to load spending trends', { error: error });
        })
        .finally(function () {
          vm.trendLoading = false;
        });
    }

    function retrySummary() {
      loadSummary(vm.selectedMonth);
    }

    function retryTrend() {
      loadTrend();
    }
  }

  angular.module('app')
    .controller('SpendingSummaryDashboardController', SpendingSummaryDashboardController);
})();
```

Controller Responsibilities (no business logic):
- Manage view state: loading, error, selected month.
- Initiate service calls.
- Handle user events (month change, retry).
- Bind data to directives.

Inputs:
- User month selection.

Outputs:
- Updated `vm.monthlySummary` and `vm.trendChartData`.
- Triggered directives for KPI cards and chart.

---

## 13. Dashboard Template – `spending-summary-dashboard.html`

**Path:** `src/templates/dashboard/spending-summary-dashboard.html`

Purpose:
- Present the Spending Summary Dashboard layout.

Layout:

```html
<div class="spending-summary-dashboard" aria-label="Spending Summary Dashboard">

  <!-- Filters: Month selection -->
  <div class="row">
    <div class="col-sm-4 col-xs-12">
      <label for="monthSelect" class="control-label">Select Month</label>
      <select
        id="monthSelect"
        class="form-control"
        ng-model="vm.selectedMonth"
        ng-options="month for month in vm.monthOptions"
        ng-change="vm.onMonthChange()">
      </select>
    </div>
  </div>

  <!-- Summary Section: KPI Cards -->
  <div class="row kpi-section" ng-if="vm.monthlySummary">
    <div class="col-sm-3 col-xs-12">
      <kpi-card
        title="Total Spend"
        value="{{ vm.monthlySummary.totalSpend | currencyFormat }}"
        icon-class="icon-total-spend">
      </kpi-card>
    </div>
    <div class="col-sm-3 col-xs-12">
      <kpi-card
        title="Transactions"
        value="{{ vm.monthlySummary.transactionCount }}"
        icon-class="icon-transaction-count">
      </kpi-card>
    </div>
    <div class="col-sm-3 col-xs-12">
      <kpi-card
        title="Average Spend"
        value="{{ vm.monthlySummary.averageSpend | currencyFormat }}"
        icon-class="icon-average-spend">
      </kpi-card>
    </div>
    <div class="col-sm-3 col-xs-12" ng-if="vm.monthlySummary.categories && vm.monthlySummary.categories.length">
      <kpi-card
        title="Top Category"
        value="{{ vm.monthlySummary.categories[0].name }}"
        icon-class="icon-top-category">
      </kpi-card>
    </div>
  </div>

  <!-- Loading / Error states for summary -->
  <loading-state loading="vm.summaryLoading" message="Loading monthly summary..."></loading-state>
  <error-state error="vm.summaryError" on-retry="vm.retrySummary()"></error-state>

  <!-- Trend Section -->
  <div class="row trend-section">
    <div class="col-xs-12">
      <h2>6-Month Spending Trend</h2>
    </div>
    <div class="col-xs-12">
      <spending-trend-chart
        chart-data="vm.trendChartData"
        loading="vm.trendLoading"
        error="vm.trendError">
      </spending-trend-chart>
    </div>
  </div>

  <!-- Loading / Error states for trend -->
  <loading-state loading="vm.trendLoading" message="Loading 6-month trend..."></loading-state>
  <error-state error="vm.trendError" on-retry="vm.retryTrend()"></error-state>

</div>
```

UI Rules:
- Uses Bootstrap grid.
- Responsive: on small screens KPI cards stack vertically.
- Accessibility: labels for controls, descriptive headings.
- Loading and error states are visible and actionable.

---

## 14. REST API Contracts

All endpoints are consumed via `httpClientFactory` and must follow these contracts.

### 14.1 Monthly Spending Summary API

- **Method:** `GET`
- **URL:** `{apiBaseUrl}/spending-summary`
- **Query Parameters:**
  - `month` (required, string, `YYYY-MM`).
- **Headers:**
  - `Authorization: Bearer <token>` (IAM-issued token).
  - `Content-Type: application/json` (responses).
- **Request Body:** None.

#### Successful Response

- **HTTP Status:** `200 OK`
- **Body:** `MonthlySummaryModel` JSON as defined above.

#### Error Responses

- `400 Bad Request` – invalid `month` parameter.
- `401 Unauthorized` – missing/invalid token.
- `403 Forbidden` – valid token but unauthorized for requested data.
- `404 Not Found` – no spending data for requested month.
- `429 Too Many Requests` – rate limiting at API Gateway.
- `500/502/503` – server/internal error.

Error body:

```json
{
  "code": "ERR_INVALID_MONTH",  
  "message": "The selected month is invalid.",
  "correlationId": "..."
}
```

Actual `code` will reflect specific error conditions (`ERR_INVALID_MONTH`, `ERR_NO_DATA`, `ERR_DATA_UNAVAILABLE`, etc.).

### 14.2 Six-Month Spending Trends API

- **Method:** `GET`
- **URL:** `{apiBaseUrl}/spending-trends`
- **Query Parameters:**
  - `range` (required, string, `"6m"` for QE-3250).
- **Headers:** same as monthly summary.
- **Request Body:** None.

#### Successful Response

- **HTTP Status:** `200 OK`
- **Body:** `SpendingTrendModel` JSON.

#### Error Responses

Same semantics as monthly summary API.

---

## 15. Mock Implementations

### 15.1 Mock Files

- `src/mock/spendingSummary.mock.js`
- `src/mock/spendingTrends.mock.js`
- `src/data/mock/monthly-summary.mock.json`
- `src/data/mock/spending-trends.mock.json`

### 15.2 Mock Behaviour

Mock services must:
- Use `$q` and `$timeout`.
- Simulate network delay (configurable, e.g., 500–1500ms).
- Return same models and HTTP status semantics as production.

#### spendingSummary.mock.js

Outline:

```js
(function () {
  'use strict';

  SpendingSummaryMockService.$inject = ['$q', '$timeout'];

  function SpendingSummaryMockService($q, $timeout) {
    function getMonthlySummary(month) {
      var deferred = $q.defer();

      $timeout(function () {
        // Load static JSON from src/data/mock/monthly-summary.mock.json via $http or embed sample data.
        // For LLD, define that it returns a valid MonthlySummaryModel instance.
        deferred.resolve({ /* MonthlySummaryModel data */ });
      }, 800);

      return deferred.promise;
    }

    return {
      getMonthlySummary: getMonthlySummary
    };
  }

  angular.module('app')
    .service('spendingSummaryMockService', SpendingSummaryMockService);
})();
```

#### spendingTrends.mock.js

Similar pattern returning `SpendingTrendModel`.

SpendingSummaryService and SpendingTrendsService must select appropriate mock services when `configService.isMockEnabled()` returns true.

---

## 16. Validation, Error Handling & Security

### 16.1 Input Validation

- Month selection:
  - Client-side: ensure selection is from `vm.monthOptions`.
  - Service-side: validate `YYYY-MM` pattern before calling API.
- Range parameter:
  - Fixed at `6m` in QE-3250; validated by service.

### 16.2 Business Validation

- Monthly summary must:
  - Only reflect credit card products.
  - Handle months with no data by returning `totalSpend = 0`, `transactionCount = 0` and categories empty.

- 6‑month trend must:
  - Include zero-activity months explicitly.

Domain enforcement is upstream; UI/service-level enforcement is limited to representation and error handling consistent with HLD.

### 16.3 Error Handling

- All service errors produce `ErrorModel` instances.
- Controller sets `summaryError` and `trendError` and uses `error-state` directive to display messages.
- Retry logic triggered via `Retry` button or automatic re-attempts when appropriate.

### 16.4 Logging

- `loggingService` logs:
  - Summary and trend retrieval attempts and outcomes.
  - Errors with context and correlation IDs.

### 16.5 Security

- No PII or PCI card numbers in UI.
- Only aggregated metrics shown.
- IAM integration handled by upstream UI/edge; HTTP requests include tokens via `httpClientFactory`.
- Angular Sanitize used where HTML content might appear.

---

## 17. UI/UX & Responsive Behaviour

### 17.1 Layout & Navigation

- Single route `/dashboard/spending-summary` is the default landing page.
- Header, main content, footer consistent across viewport sizes.

### 17.2 KPI Cards

- Each card uses Bootstrap panels and custom CSS.
- Numeric values right-aligned within card.

### 17.3 Charts

- Chart.js bar or line chart displays 6 points.
- Axes: X – month; Y – totalSpend.
- Tooltip: display month and totalSpend.
- Legend: optional (single dataset labelled "Total Spend").

### 17.4 States

- Loading: spinner (`loading-state` directive) with messages.
- Empty: if no data, `ErrorModel` with `ERR_NO_DATA` and message `"No spending data available for the selected month."`.
- Error: `ErrorModel` with appropriate message and retry option.

### 17.5 Accessibility

- Labels for form controls.
- Headings describe sections (Summary, Trend).
- Chart canvas has ARIA attributes.
- Keyboard navigation via standard HTML controls.

---

## 18. Dependency Graph & Circular Dependency Avoidance

Key components and dependencies:

- `SpendingSummaryDashboardController` → `spendingSummaryService`, `spendingTrendsService`, `configService`, `loggingService`.
- `spendingSummaryService` → `$http`, `$q`, `configService`, `httpClientFactory`, `loggingService`, `insightsFormattingService`.
- `spendingTrendsService` → `$http`, `$q`, `configService`, `httpClientFactory`, `loggingService`, `insightsFormattingService`.
- `insightsFormattingService` → `configService`.
- `configService` → `$http`, `$q`.
- `loggingService` → `$log`, `$injector` (lazy optional HTTP).
- `exceptionHandlerService` → `loggingService`.
- `$exceptionHandler` decorator → `exceptionHandlerService`.

No cycles:
- Logging does not depend on HTTP directly.
- Exception handler uses logging only.
- Services depend on logging, not vice versa.

---

## 19. Quality Gate Checklist

This LLD satisfies all quality gates:

- Technology stack defined with specific versions.
- Repository structure and file inventory fully specified.
- Index.html structure, `ng-app`, `ng-view`, CSS/JS loading order defined.
- Single root Angular module defined; no duplicate modules.
- Routes defined with controllers, templates, ControllerAs syntax.
- All controllers, services, factories, directives, filters, models identified with responsibilities and dependencies.
- REST API contracts for monthly summary and trends defined with request/response semantics.
- Configuration (ENV JSON, constants, configService) defined; `useMockData` toggles mock vs production.
- Mock implementations specified with use of `$q` and `$timeout`, matching production models.
- UI specification (layout, KPI cards, charts, states, responsiveness, accessibility) defined.
- Data flows from user actions through controller, services, APIs/mocks, models, and UI documented.
- Error handling, logging, and security requirements covered.
- Dependency graph documented; no circular dependencies.
- All resources (templates, CSS, JS) paths specified; `templateUrl` values match paths.
- Application can be implemented without additional design decisions beyond values configured in ENV JSON.
