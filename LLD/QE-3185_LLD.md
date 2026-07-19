# Low-Level Design (LLD) QE-3185 – Monthly Spending Summary Dashboard

## 1. Technology Stack

### 1.1 Frontend
- HTML5
- CSS3
- JavaScript ES6 (ES2015 syntax, transpilation not required; run directly in modern browsers)
- AngularJS 1.7.9 (core)
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only; via CDN)
- Chart.js 2.9.4

### 1.2 Architecture
- AngularJS MVC pattern
- Single Page Application (SPA)
- REST-based data access (production via HTTP APIs, mock via in-memory services)
- Dependency Injection via AngularJS DI
- ControllerAs syntax for all controllers
- IIFE (Immediately Invoked Function Expression) module pattern for all JS files

### 1.3 Runtime
- AngularJS built-in services:
  - `$http` – REST calls (production mode)
  - `$q` – promise creation and composition
  - `$timeout` – artificial delay for mock mode and UI timing
  - `$routeProvider` – routing configuration
  - `$location`, `$rootScope` – navigation and global event handling
  - `$log` – logging
  - `$window`, `$document` – limited access to browser APIs
  - `$sce` / `ngSanitize` – sanitization

### 1.4 Browser Support
- Desktop Chrome (latest)
- Desktop Microsoft Edge (Chromium-based, latest)

No other browsers are required or supported.


## 2. Repository Structure

Root directory: `/` (repository root)

```text
APB_Demo/
  index.html
  src/
    app/
      app.module.js
      app.config.js
      app.routes.js
      app.run.js
    core/
      config/
        env.config.js
        feature-flags.constant.js
      logging/
        logging.service.js
      models/
        spending-summary.model.js
        spending-breakdown.model.js
        kpi.model.js
        error.model.js
      services/
        env.service.js
        spending-dashboard-api.service.js
        spending-dashboard-mock.service.js
      interceptors/
        http-error.interceptor.js
    spending-dashboard/
      components/
        dashboard/
          spending-dashboard.controller.js
          spending-dashboard.template.html
        kpi-cards/
          kpi-cards.directive.js
          kpi-cards.template.html
        spending-chart/
          spending-chart.directive.js
          spending-chart.template.html
        breakdown-table/
          breakdown-table.directive.js
          breakdown-table.template.html
      styles/
        spending-dashboard.css
  assets/
    images/
      card-icon.png
      spending-chart-placeholder.png
  config/
    env/
      spending-dashboard.env.json
```

All paths are relative to the repository root `APB_Demo/` as hosted in GitHub.

### 2.1 File Catalog

For each file:

#### 2.1.1 `index.html`
- **Repository path**: `index.html`
- **Purpose**: SPA entry point; loads AngularJS app, links CSS and JS, defines root layout and `<ng-view>`.
- **Component type**: HTML document.
- **Dependencies**:
  - External CDNs: Bootstrap CSS, AngularJS core, Angular Route, Angular Animate, Angular Sanitize, Angular UI Bootstrap, Chart.js.
  - Local scripts: all application JS files under `src/` in specified order.
  - Local styles: `src/spending-dashboard/styles/spending-dashboard.css`.

#### 2.1.2 `src/app/app.module.js`
- **Purpose**: Root AngularJS module declaration.
- **Component type**: AngularJS module definition.
- **Dependencies**:
  - AngularJS core.
  - Angular modules: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`.

#### 2.1.3 `src/app/app.config.js`
- **Purpose**: Global configuration for `$httpProvider`, interpolation, and security settings.
- **Component type**: AngularJS config block.
- **Dependencies**:
  - Angular module `app`.
  - `$httpProvider`, `$sceProvider`.

#### 2.1.4 `src/app/app.routes.js`
- **Purpose**: Defines SPA routes and default route.
- **Component type**: AngularJS config block (routing).
- **Dependencies**:
  - Angular module `app`.
  - `$routeProvider`.

#### 2.1.5 `src/app/app.run.js`
- **Purpose**: Run block to initialize global behavior such as route change logging, mock/production mode wiring.
- **Component type**: AngularJS run block.
- **Dependencies**:
  - Angular module `app`.
  - `$rootScope`, `$log`, `EnvService`.

#### 2.1.6 `src/core/config/env.config.js`
- **Purpose**: Environment configuration constants; exposes `ENV_CONFIG`.
- **Component type**: AngularJS constant.
- **Dependencies**:
  - Angular module `app`.

#### 2.1.7 `src/core/config/feature-flags.constant.js`
- **Purpose**: Feature flags for enabling/disabling specific UI capabilities.
- **Component type**: AngularJS constant.
- **Dependencies**:
  - Angular module `app`.

#### 2.1.8 `src/core/logging/logging.service.js`
- **Purpose**: Application-level logging service that wraps `$log` and lazily resolves `$http`.
- **Component type**: AngularJS service.
- **Dependencies**:
  - Angular module `app`.
  - `$log`, `$injector`.

#### 2.1.9 `src/core/models/spending-summary.model.js`
- **Purpose**: Data model representing monthly spending summary (total spend, month, card, etc.).
- **Component type**: Model (implemented as ES6 class wrapped by AngularJS factory).
- **Dependencies**:
  - Angular module `app`.

#### 2.1.10 `src/core/models/spending-breakdown.model.js`
- **Purpose**: Data model representing category-level breakdown of spending.
- **Component type**: Model.
- **Dependencies**:
  - Angular module `app`.

#### 2.1.11 `src/core/models/kpi.model.js`
- **Purpose**: Data model representing individual KPI entries (name, value, units, icon, formatting).
- **Component type**: Model.
- **Dependencies**:
  - Angular module `app`.

#### 2.1.12 `src/core/models/error.model.js`
- **Purpose**: Error model capturing error code, message, HTTP status, retry hints.
- **Component type**: Model.
- **Dependencies**:
  - Angular module `app`.

#### 2.1.13 `src/core/services/env.service.js`
- **Purpose**: Service to expose environment configuration values and computed flags.
- **Component type**: AngularJS service.
- **Dependencies**:
  - Angular module `app`.
  - `ENV_CONFIG`, `$q`, `$timeout`, `$http` (for optional environment probe), `$log`.

#### 2.1.14 `src/core/services/spending-dashboard-api.service.js`
- **Purpose**: Production-mode REST API client for spending dashboard endpoints.
- **Component type**: AngularJS service.
- **Dependencies**:
  - Angular module `app`.
  - `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.

#### 2.1.15 `src/core/services/spending-dashboard-mock.service.js`
- **Purpose**: Mock-mode implementation using `$q` and `$timeout` to simulate REST calls.
- **Component type**: AngularJS service.
- **Dependencies**:
  - Angular module `app`.
  - `$q`, `$timeout`, `ENV_CONFIG`, `LoggingService`.

#### 2.1.16 `src/core/interceptors/http-error.interceptor.js`
- **Purpose**: HTTP interceptor for global error handling and mapping to `ErrorModel`.
- **Component type**: AngularJS factory registered as `$httpProvider` interceptor.
- **Dependencies**:
  - Angular module `app`.
  - `$q`, `LoggingService`.

#### 2.1.17 `src/spending-dashboard/components/dashboard/spending-dashboard.controller.js`
- **Purpose**: Main controller for the Monthly Spending Summary Dashboard view.
- **Component type**: AngularJS controller.
- **Dependencies**:
  - Angular module `app`.
  - `EnvService`, `SpendingDashboardApiService`, `SpendingDashboardMockService`, `SpendingSummaryModel`, `SpendingBreakdownModel`, `KpiModel`, `ErrorModel`, `$log`.

#### 2.1.18 `src/spending-dashboard/components/dashboard/spending-dashboard.template.html`
- **Purpose**: Template containing overall dashboard layout, header, footer, month selector, KPI cards, chart, breakdown table.
- **Component type**: AngularJS HTML template.
- **Dependencies**:
  - `SpendingDashboardController`.
  - Directives: `kpi-cards`, `spending-chart`, `breakdown-table`.

#### 2.1.19 `src/spending-dashboard/components/kpi-cards/kpi-cards.directive.js`
- **Purpose**: Directive to render KPI cards for monthly summary metrics.
- **Component type**: AngularJS directive.
- **Dependencies**:
  - Angular module `app`.
  - `KpiModel`.

#### 2.1.20 `src/spending-dashboard/components/kpi-cards/kpi-cards.template.html`
- **Purpose**: Template for KPI cards, using Bootstrap 3 grid and card-like styling.
- **Component type**: HTML template.
- **Dependencies**:
  - `kpiCards` directive.

#### 2.1.21 `src/spending-dashboard/components/spending-chart/spending-chart.directive.js`
- **Purpose**: Directive wrapping Chart.js to show monthly spending over categories or days.
- **Component type**: AngularJS directive.
- **Dependencies**:
  - Angular module `app`.
  - Chart.js global (`Chart`).

#### 2.1.22 `src/spending-dashboard/components/spending-chart/spending-chart.template.html`
- **Purpose**: Template containing `<canvas>` for Chart.js, loading and error states.
- **Component type**: HTML template.
- **Dependencies**:
  - `spendingChart` directive.

#### 2.1.23 `src/spending-dashboard/components/breakdown-table/breakdown-table.directive.js`
- **Purpose**: Directive to present basic spend breakdown in tabular format.
- **Component type**: AngularJS directive.
- **Dependencies**:
  - Angular module `app`.

#### 2.1.24 `src/spending-dashboard/components/breakdown-table/breakdown-table.template.html`
- **Purpose**: Template implementing table with category, amount, percentage.
- **Component type**: HTML template.
- **Dependencies**:
  - `breakdownTable` directive.

#### 2.1.25 `src/spending-dashboard/styles/spending-dashboard.css`
- **Purpose**: CSS for dashboard layout, cards, charts, tables, responsive behavior.
- **Component type**: Stylesheet.
- **Dependencies**:
  - Loaded after Bootstrap CSS.

#### 2.1.26 `assets/images/card-icon.png`
- **Purpose**: Icon used in header or KPI cards for credit card visual.
- **Component type**: Image asset.

#### 2.1.27 `assets/images/spending-chart-placeholder.png`
- **Purpose**: Placeholder displayed when chart data is not available.
- **Component type**: Image asset.

#### 2.1.28 `config/env/spending-dashboard.env.json`
- **Purpose**: External JSON environment file for optional environment bootstrapping; may be read by backend or static config tooling, not directly by browser.
- **Component type**: JSON file.
- **Properties**:
  - `apiBaseUrl`: string
  - `apiTimeoutMs`: number
  - `maxLookbackMonths`: number
  - `useMockData`: boolean
  - `featureFlags`: object
  - `telemetry`: object


## 3. index.html Specification

### 3.1 Complete index.html Definition

**Repository path**: `index.html`

```html
<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Monthly Spending Summary Dashboard</title>

  <!-- Stylesheet loading order -->
  <!-- 1. Bootstrap CSS (CDN) -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

  <!-- 2. Application CSS -->
  <link rel="stylesheet" href="src/spending-dashboard/styles/spending-dashboard.css">
</head>
<body>
  <div class="container-fluid" ng-cloak>
    <!-- Header -->
    <header class="row spending-header">
      <div class="col-xs-12 col-sm-8">
        <h1 class="spending-title">Monthly Spending Summary</h1>
        <p class="spending-subtitle">Credit Card Spend Overview</p>
      </div>
      <div class="col-xs-12 col-sm-4 text-right hidden-xs spending-header-icon">
        <img src="assets/images/card-icon.png" alt="Card" class="img-responsive spending-card-icon">
      </div>
    </header>

    <!-- Main content routed via ng-view -->
    <main class="row spending-main">
      <div class="col-xs-12" ng-view></div>
    </main>

    <!-- Footer -->
    <footer class="row spending-footer">
      <div class="col-xs-12 text-center">
        <small>&copy; 2026 Spending Dashboard</small>
      </div>
    </footer>
  </div>

  <!-- Script loading order -->
  <!-- 1. AngularJS core (CDN) -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>

  <!-- 2. Angular Route (CDN) -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js"></script>

  <!-- 3. Angular Animate (CDN) -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js"></script>

  <!-- 4. Angular Sanitize (CDN) -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js"></script>

  <!-- 5. Angular UI Bootstrap (CDN) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js"></script>

  <!-- 6. Chart.js (CDN) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js"></script>

  <!-- 7. Application scripts (local) -->
  <!-- Root module and core app scripts -->
  <script src="src/app/app.module.js"></script>
  <script src="src/app/app.config.js"></script>
  <script src="src/app/app.routes.js"></script>
  <script src="src/app/app.run.js"></script>

  <!-- Core configuration -->
  <script src="src/core/config/env.config.js"></script>
  <script src="src/core/config/feature-flags.constant.js"></script>

  <!-- Core models -->
  <script src="src/core/models/spending-summary.model.js"></script>
  <script src="src/core/models/spending-breakdown.model.js"></script>
  <script src="src/core/models/kpi.model.js"></script>
  <script src="src/core/models/error.model.js"></script>

  <!-- Core services -->
  <script src="src/core/services/env.service.js"></script>
  <script src="src/core/services/spending-dashboard-api.service.js"></script>
  <script src="src/core/services/spending-dashboard-mock.service.js"></script>

  <!-- Interceptors -->
  <script src="src/core/interceptors/http-error.interceptor.js"></script>

  <!-- Spending dashboard components -->
  <script src="src/spending-dashboard/components/dashboard/spending-dashboard.controller.js"></script>
  <script src="src/spending-dashboard/components/kpi-cards/kpi-cards.directive.js"></script>
  <script src="src/spending-dashboard/components/spending-chart/spending-chart.directive.js"></script>
  <script src="src/spending-dashboard/components/breakdown-table/breakdown-table.directive.js"></script>
</body>
</html>
```

- **ng-app**: `app`
- **ng-view**: present in main content region as `<div ng-view></div>`.
- **CDN libraries**: Bootstrap CSS, AngularJS core, Angular Route, Angular Animate, Angular Sanitize, Angular UI Bootstrap, Chart.js.
- **No jQuery or bootstrap.min.js included**.


## 4. Application Bootstrap

### 4.1 Root Module

**File**: `src/app/app.module.js`

```javascript
(function () {
  "use strict";

  angular.module("app", [
    "ngRoute",
    "ngAnimate",
    "ngSanitize",
    "ui.bootstrap"
  ]);
})();
```

- Only one file (`app.module.js`) declares `angular.module("app", [...])`.
- All other AngularJS files use `angular.module("app")` without redeclaration.

### 4.2 Config Blocks

#### 4.2.1 Global Config

**File**: `src/app/app.config.js`

- **Angular registration**: `angular.module("app").config(appConfig);`

```javascript
(function () {
  "use strict";

  appConfig.$inject = ["$httpProvider", "$sceProvider"];

  function appConfig($httpProvider, $sceProvider) {
    // Enable or disable SCE as required (keep enabled for security)
    $sceProvider.enabled(true);

    // Register HTTP interceptor
    $httpProvider.interceptors.push("HttpErrorInterceptor");
  }

  angular.module("app")
    .config(appConfig);
})();
```

- **Dependencies**: `$httpProvider`, `$sceProvider`.
- **Responsibility**: Register HTTP error interceptor; ensure sanitization is enabled.

#### 4.2.2 Routing Config

**File**: `src/app/app.routes.js`

- **Angular registration**: `angular.module("app").config(appRoutes);`

```javascript
(function () {
  "use strict";

  appRoutes.$inject = ["$routeProvider"];

  function appRoutes($routeProvider) {
    $routeProvider
      .when("/spending-dashboard", {
        templateUrl: "src/spending-dashboard/components/dashboard/spending-dashboard.template.html",
        controller: "SpendingDashboardController",
        controllerAs: "vm"
      })
      .otherwise({
        redirectTo: "/spending-dashboard"
      });
  }

  angular.module("app")
    .config(appRoutes);
})();
```

- **Default route**: `/spending-dashboard`.
- **TemplateUrl**: `src/spending-dashboard/components/dashboard/spending-dashboard.template.html`.

### 4.3 Run Block

**File**: `src/app/app.run.js`

- **Angular registration**: `angular.module("app").run(appRun);`

```javascript
(function () {
  "use strict";

  appRun.$inject = ["$rootScope", "$log", "EnvService"];

  function appRun($rootScope, $log, EnvService) {
    $rootScope.$on("$routeChangeStart", function (event, next) {
      $log.debug("Route change start", next && next.originalPath);
    });

    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
      $log.error("Route change error", rejection);
    });

    // Initialize environment (preload configuration if needed)
    EnvService.initialize();
  }

  angular.module("app")
    .run(appRun);
})();
```

- **Dependencies**: `$rootScope`, `$log`, `EnvService`.
- **Responsibility**: Global route logging and environment initialization.
- **Startup services rule**: `EnvService` must not depend on API services; conforms.

### 4.4 Script Loading Order

1. AngularJS core and dependencies via CDNs.
2. Chart.js via CDN.
3. `app.module.js` (root module declaration).
4. `app.config.js` (global config and interceptor registration).
5. `app.routes.js` (routing definitions).
6. `app.run.js` (run block).
7. Core config constants (`env.config.js`, `feature-flags.constant.js`).
8. Models (`spending-summary.model.js`, `spending-breakdown.model.js`, `kpi.model.js`, `error.model.js`).
9. Services (`env.service.js`, `spending-dashboard-api.service.js`, `spending-dashboard-mock.service.js`).
10. Interceptor (`http-error.interceptor.js`).
11. Dashboard controller and directives.

All referenced script paths exist in the repository structure defined above.


## 5. Component Registry

Each component is uniquely registered in the `app` module, with no circular dependencies.

### 5.1 Modules

- **Name**: `app`
  - **Type**: AngularJS module
  - **File Path**: `src/app/app.module.js`
  - **Angular Module**: `app`
  - **Registration Method**: `angular.module("app", [...])`
  - **Dependencies**: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`
  - **Injected Services**: N/A
  - **Public Methods**: N/A

### 5.2 Constants and Values

#### 5.2.1 `ENV_CONFIG`
- **Type**: Constant
- **File Path**: `src/core/config/env.config.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").constant("ENV_CONFIG", {...});`
- **Dependencies**: None
- **Injected Services**: N/A
- **Public Methods**: N/A

Definition (see section 7 for values):

```javascript
(function () {
  "use strict";

  angular.module("app")
    .constant("ENV_CONFIG", {
      apiBaseUrl: "https://api.example.com/spending-dashboard",
      apiTimeoutMs: 15000,
      maxLookbackMonths: 12,
      useMockData: true,
      featureFlags: {
        showAverageTransactionAmount: true,
        showMaxTransactionAmount: true
      },
      telemetry: {
        enableLogging: true,
        logLevel: "debug"
      }
    });
})();
```

#### 5.2.2 `FEATURE_FLAGS`
- **Type**: Constant
- **File Path**: `src/core/config/feature-flags.constant.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").constant("FEATURE_FLAGS", {...});`
- **Dependencies**: None
- **Injected Services**: used by controllers/services for feature toggles.
- **Public Methods**: N/A

```javascript
(function () {
  "use strict";

  angular.module("app")
    .constant("FEATURE_FLAGS", {
      enableBreakdownChart: true,
      enableBreakdownTable: true,
      enableDeepInsightsLink: false
    });
})();
```

### 5.3 Services

#### 5.3.1 `LoggingService`
- **Type**: Service
- **File Path**: `src/core/logging/logging.service.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").service("LoggingService", LoggingService);`
- **Dependencies**: `$log`, `$injector`
- **Injected Services**: lazily resolves `$http` via `$injector.get("$http")` when needed.
- **Public Methods**:
  - `debug(message, context)`
  - `info(message, context)`
  - `warn(message, context)`
  - `error(message, context)`

```javascript
(function () {
  "use strict";

  LoggingService.$inject = ["$log", "$injector"];

  function LoggingService($log, $injector) {
    var service = {
      debug: debug,
      info: info,
      warn: warn,
      error: error
    };

    return service;

    function debug(message, context) {
      $log.debug(message, context || {});
    }

    function info(message, context) {
      $log.info(message, context || {});
    }

    function warn(message, context) {
      $log.warn(message, context || {});
    }

    function error(message, context) {
      $log.error(message, context || {});
      // Example: lazy resolution of $http for telemetry (if enabled)
      // var $http = $injector.get("$http");
      // $http.post("/telemetry", { level: "error", message: message, context: context });
    }
  }

  angular.module("app")
    .service("LoggingService", LoggingService);
})();
```

(No circular dependency: `LoggingService` does not depend on any other services that depend on it.)

#### 5.3.2 `EnvService`
- **Type**: Service
- **File Path**: `src/core/services/env.service.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").service("EnvService", EnvService);`
- **Dependencies**: `ENV_CONFIG`, `$q`, `$timeout`, `$http`, `$log`
- **Injected Services**: as above
- **Public Methods**:
  - `initialize()` – returns a promise that resolves when environment is initialized.
  - `getApiBaseUrl()` – returns `ENV_CONFIG.apiBaseUrl`.
  - `getApiTimeoutMs()` – returns `ENV_CONFIG.apiTimeoutMs`.
  - `getMaxLookbackMonths()` – returns `ENV_CONFIG.maxLookbackMonths`.
  - `isMockMode()` – returns boolean based on `ENV_CONFIG.useMockData`.
  - `getFeatureFlags()` – returns `ENV_CONFIG.featureFlags`.
  - `getTelemetryConfig()` – returns `ENV_CONFIG.telemetry`.

```javascript
(function () {
  "use strict";

  EnvService.$inject = ["ENV_CONFIG", "$q", "$timeout", "$http", "$log"];

  function EnvService(ENV_CONFIG, $q, $timeout, $http, $log) {
    var initialized = false;

    var service = {
      initialize: initialize,
      getApiBaseUrl: getApiBaseUrl,
      getApiTimeoutMs: getApiTimeoutMs,
      getMaxLookbackMonths: getMaxLookbackMonths,
      isMockMode: isMockMode,
      getFeatureFlags: getFeatureFlags,
      getTelemetryConfig: getTelemetryConfig
    };

    return service;

    function initialize() {
      if (initialized) {
        return $q.when(true);
      }

      var deferred = $q.defer();

      // Simulate environment loading (can be replaced with real HTTP call if needed)
      $timeout(function () {
        initialized = true;
        $log.debug("Environment initialized", ENV_CONFIG);
        deferred.resolve(true);
      }, 0);

      return deferred.promise;
    }

    function getApiBaseUrl() {
      return ENV_CONFIG.apiBaseUrl;
    }

    function getApiTimeoutMs() {
      return ENV_CONFIG.apiTimeoutMs;
    }

    function getMaxLookbackMonths() {
      return ENV_CONFIG.maxLookbackMonths;
    }

    function isMockMode() {
      return ENV_CONFIG.useMockData === true;
    }

    function getFeatureFlags() {
      return ENV_CONFIG.featureFlags;
    }

    function getTelemetryConfig() {
      return ENV_CONFIG.telemetry;
    }
  }

  angular.module("app")
    .service("EnvService", EnvService);
})();
```

Startup rule: `EnvService` does not depend on API services, only on config and Angular core services.

#### 5.3.3 `SpendingDashboardApiService`
- **Type**: Service (Production REST client)
- **File Path**: `src/core/services/spending-dashboard-api.service.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").service("SpendingDashboardApiService", SpendingDashboardApiService);`
- **Dependencies**: `$http`, `$q`, `ENV_CONFIG`, `LoggingService`
- **Public Methods**:
  - `getMonthlySummary(cardId, month)`
  - `getMonthlyBreakdown(cardId, month)`

```javascript
(function () {
  "use strict";

  SpendingDashboardApiService.$inject = ["$http", "$q", "ENV_CONFIG", "LoggingService"];

  function SpendingDashboardApiService($http, $q, ENV_CONFIG, LoggingService) {
    var service = {
      getMonthlySummary: getMonthlySummary,
      getMonthlyBreakdown: getMonthlyBreakdown
    };

    return service;

    function getMonthlySummary(cardId, month) {
      var url = ENV_CONFIG.apiBaseUrl + "/summary";
      var config = {
        params: {
          cardId: cardId,
          month: month
        },
        timeout: ENV_CONFIG.apiTimeoutMs,
        headers: {
          "Accept": "application/json"
        }
      };

      LoggingService.debug("Requesting monthly summary", { url: url, params: config.params });

      return $http.get(url, config)
        .then(function (response) {
          LoggingService.info("Monthly summary received", { status: response.status });
          return response.data;
        })
        .catch(function (error) {
          LoggingService.error("Monthly summary request failed", error);
          return $q.reject(error);
        });
    }

    function getMonthlyBreakdown(cardId, month) {
      var url = ENV_CONFIG.apiBaseUrl + "/breakdown";
      var config = {
        params: {
          cardId: cardId,
          month: month
        },
        timeout: ENV_CONFIG.apiTimeoutMs,
        headers: {
          "Accept": "application/json"
        }
      };

      LoggingService.debug("Requesting monthly breakdown", { url: url, params: config.params });

      return $http.get(url, config)
        .then(function (response) {
          LoggingService.info("Monthly breakdown received", { status: response.status });
          return response.data;
        })
        .catch(function (error) {
          LoggingService.error("Monthly breakdown request failed", error);
          return $q.reject(error);
        });
    }
  }

  angular.module("app")
    .service("SpendingDashboardApiService", SpendingDashboardApiService);
})();
```

#### 5.3.4 `SpendingDashboardMockService`
- **Type**: Service (Mock implementation)
- **File Path**: `src/core/services/spending-dashboard-mock.service.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").service("SpendingDashboardMockService", SpendingDashboardMockService);`
- **Dependencies**: `$q`, `$timeout`, `ENV_CONFIG`, `LoggingService`
- **Public Methods**:
  - `getMonthlySummary(cardId, month)`
  - `getMonthlyBreakdown(cardId, month)`

```javascript
(function () {
  "use strict";

  SpendingDashboardMockService.$inject = ["$q", "$timeout", "ENV_CONFIG", "LoggingService"];

  function SpendingDashboardMockService($q, $timeout, ENV_CONFIG, LoggingService) {
    var service = {
      getMonthlySummary: getMonthlySummary,
      getMonthlyBreakdown: getMonthlyBreakdown
    };

    return service;

    function getMonthlySummary(cardId, month) {
      var deferred = $q.defer();
      var delayMs = 300;

      LoggingService.debug("Mock monthly summary request", { cardId: cardId, month: month });

      $timeout(function () {
        if (!cardId || !month) {
          var error = {
            status: 400,
            data: {
              code: "INVALID_REQUEST",
              message: "cardId and month are required"
            }
          };
          LoggingService.warn("Mock monthly summary invalid request", error);
          deferred.reject(error);
          return;
        }

        var response = {
          cardId: cardId,
          month: month,
          totalSpend: 1250.75,
          currency: "USD",
          transactionCount: 42,
          averageTransactionAmount: 29.78,
          maxTransactionAmount: 210.50
        };

        LoggingService.info("Mock monthly summary response", response);
        deferred.resolve(response);
      }, delayMs);

      return deferred.promise;
    }

    function getMonthlyBreakdown(cardId, month) {
      var deferred = $q.defer();
      var delayMs = 350;

      LoggingService.debug("Mock monthly breakdown request", { cardId: cardId, month: month });

      $timeout(function () {
        if (!cardId || !month) {
          var error = {
            status: 400,
            data: {
              code: "INVALID_REQUEST",
              message: "cardId and month are required"
            }
          };
          LoggingService.warn("Mock monthly breakdown invalid request", error);
          deferred.reject(error);
          return;
        }

        var response = {
          cardId: cardId,
          month: month,
          currency: "USD",
          categories: [
            { name: "Groceries", amount: 350.00 },
            { name: "Dining", amount: 275.50 },
            { name: "Travel", amount: 400.25 },
            { name: "Utilities", amount: 125.00 },
            { name: "Other", amount: 100.00 }
          ]
        };

        LoggingService.info("Mock monthly breakdown response", response);
        deferred.resolve(response);
      }, delayMs);

      return deferred.promise;
    }
  }

  angular.module("app")
    .service("SpendingDashboardMockService", SpendingDashboardMockService);
})();
```

Mock mode uses `$q` and `$timeout` only, no `$http`, and returns same model shape as production endpoints.

### 5.4 Factories

#### 5.4.1 `SpendingSummaryModel`
- **Type**: Factory returning ES6 class
- **File Path**: `src/core/models/spending-summary.model.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").factory("SpendingSummaryModel", SpendingSummaryModelFactory);`
- **Dependencies**: None
- **Public Methods** (class methods):
  - Constructor: `constructor(data)`
  - `isEmpty()` – boolean
  - `toJson()` – plain object

```javascript
(function () {
  "use strict";

  function SpendingSummaryModelFactory() {
    class SpendingSummaryModel {
      constructor(data) {
        var source = data || {};
        this.cardId = source.cardId || "";
        this.month = source.month || ""; // format YYYY-MM
        this.currency = source.currency || "USD";
        this.totalSpend = typeof source.totalSpend === "number" ? source.totalSpend : 0;
        this.transactionCount = typeof source.transactionCount === "number" ? source.transactionCount : 0;
        this.averageTransactionAmount = typeof source.averageTransactionAmount === "number" ? source.averageTransactionAmount : 0;
        this.maxTransactionAmount = typeof source.maxTransactionAmount === "number" ? source.maxTransactionAmount : 0;
      }

      isEmpty() {
        return !this.cardId || !this.month;
      }

      toJson() {
        return {
          cardId: this.cardId,
          month: this.month,
          currency: this.currency,
          totalSpend: this.totalSpend,
          transactionCount: this.transactionCount,
          averageTransactionAmount: this.averageTransactionAmount,
          maxTransactionAmount: this.maxTransactionAmount
        };
      }
    }

    return SpendingSummaryModel;
  }

  angular.module("app")
    .factory("SpendingSummaryModel", SpendingSummaryModelFactory);
})();
```

#### 5.4.2 `SpendingBreakdownModel`
- **Type**: Factory returning ES6 class
- **File Path**: `src/core/models/spending-breakdown.model.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").factory("SpendingBreakdownModel", SpendingBreakdownModelFactory);`
- **Dependencies**: None
- **Public Methods**:
  - Constructor: `constructor(data)`
  - `getTotal()` – sum of category amounts
  - `getCategoriesWithPercentage()` – categories with percentage
  - `toJson()` – plain object

```javascript
(function () {
  "use strict";

  function SpendingBreakdownModelFactory() {
    class SpendingBreakdownModel {
      constructor(data) {
        var source = data || {};
        this.cardId = source.cardId || "";
        this.month = source.month || "";
        this.currency = source.currency || "USD";
        this.categories = Array.isArray(source.categories) ? source.categories.slice() : [];
      }

      getTotal() {
        return this.categories.reduce(function (acc, category) {
          var amount = typeof category.amount === "number" ? category.amount : 0;
          return acc + amount;
        }, 0);
      }

      getCategoriesWithPercentage() {
        var total = this.getTotal();
        if (total <= 0) {
          return this.categories.map(function (category) {
            return {
              name: category.name,
              amount: category.amount,
              percentage: 0
            };
          });
        }
        return this.categories.map(function (category) {
          var amount = typeof category.amount === "number" ? category.amount : 0;
          var percentage = (amount / total) * 100;
          return {
            name: category.name,
            amount: amount,
            percentage: percentage
          };
        });
      }

      toJson() {
        return {
          cardId: this.cardId,
          month: this.month,
          currency: this.currency,
          categories: this.categories.slice()
        };
      }
    }

    return SpendingBreakdownModel;
  }

  angular.module("app")
    .factory("SpendingBreakdownModel", SpendingBreakdownModelFactory);
})();
```

#### 5.4.3 `KpiModel`
- **Type**: Factory returning ES6 class
- **File Path**: `src/core/models/kpi.model.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").factory("KpiModel", KpiModelFactory);`
- **Dependencies**: None
- **Public Methods**:
  - Constructor: `constructor(label, value, icon, format, unit)`
  - `formatValue()` – string

```javascript
(function () {
  "use strict";

  function KpiModelFactory() {
    class KpiModel {
      constructor(label, value, icon, format, unit) {
        this.label = label || "";
        this.value = typeof value === "number" ? value : 0;
        this.icon = icon || "";
        this.format = format || "number"; // "currency" | "number" | "integer"
        this.unit = unit || ""; // e.g., "USD", "txns"
      }

      formatValue() {
        var value = this.value;
        if (this.format === "currency") {
          return value.toFixed(2);
        }
        if (this.format === "integer") {
          return Math.round(value).toString();
        }
        return value.toString();
      }
    }

    return KpiModel;
  }

  angular.module("app")
    .factory("KpiModel", KpiModelFactory);
})();
```

#### 5.4.4 `ErrorModel`
- **Type**: Factory returning ES6 class
- **File Path**: `src/core/models/error.model.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").factory("ErrorModel", ErrorModelFactory);`
- **Dependencies**: None
- **Public Methods**:
  - Constructor: `constructor(httpError)`
  - `getUserMessage()` – string

```javascript
(function () {
  "use strict";

  function ErrorModelFactory() {
    class ErrorModel {
      constructor(httpError) {
        var source = httpError || {};
        this.status = source.status || 0;
        this.code = source.data && source.data.code ? source.data.code : "UNKNOWN_ERROR";
        this.message = source.data && source.data.message ? source.data.message : "An unexpected error occurred.";
        this.retryable = this.status >= 500;
      }

      getUserMessage() {
        if (this.status === 0) {
          return "Network error. Please check your connection and try again.";
        }
        if (this.status === 400) {
          return "The requested data could not be retrieved due to invalid input.";
        }
        if (this.status === 401 || this.status === 403) {
          return "You are not authorized to view this information.";
        }
        if (this.status === 404) {
          return "No spending data found for the selected month.";
        }
        if (this.status >= 500) {
          return "We are experiencing technical difficulties. Please try again later.";
        }
        return this.message;
      }
    }

    return ErrorModel;
  }

  angular.module("app")
    .factory("ErrorModel", ErrorModelFactory);
})();
```

### 5.5 Controllers

#### 5.5.1 `SpendingDashboardController`
- **Type**: Controller
- **File Path**: `src/spending-dashboard/components/dashboard/spending-dashboard.controller.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").controller("SpendingDashboardController", SpendingDashboardController);`
- **Dependencies**: `EnvService`, `SpendingDashboardApiService`, `SpendingDashboardMockService`, `SpendingSummaryModel`, `SpendingBreakdownModel`, `KpiModel`, `ErrorModel`, `$log`.
- **Injected Services**: as above
- **ControllerAs**: `vm`
- **Public Methods**:
  - `vm.onMonthChange()` – triggered when user selects month.
  - `vm.retry()` – retry current load on failure.
- **Private Methods**:
  - `loadDashboardData()` – orchestrates summary and breakdown calls.
  - `buildKpis(summary)` – constructs KPI models.

```javascript
(function () {
  "use strict";

  SpendingDashboardController.$inject = [
    "EnvService",
    "SpendingDashboardApiService",
    "SpendingDashboardMockService",
    "SpendingSummaryModel",
    "SpendingBreakdownModel",
    "KpiModel",
    "ErrorModel",
    "$log"
  ];

  function SpendingDashboardController(
    EnvService,
    SpendingDashboardApiService,
    SpendingDashboardMockService,
    SpendingSummaryModel,
    SpendingBreakdownModel,
    KpiModel,
    ErrorModel,
    $log
  ) {
    var vm = this;

    vm.availableMonths = [];
    vm.selectedMonth = "";
    vm.cardId = "CARD-1234"; // in real app, provided by surrounding context/auth; here fixed for demo
    vm.summary = null;
    vm.breakdown = null;
    vm.kpis = [];
    vm.isLoading = false;
    vm.hasError = false;
    vm.error = null;

    vm.onMonthChange = onMonthChange;
    vm.retry = retry;

    initialize();

    function initialize() {
      buildAvailableMonths();
      if (vm.availableMonths.length > 0) {
        vm.selectedMonth = vm.availableMonths[0];
        loadDashboardData();
      }
    }

    function buildAvailableMonths() {
      var maxMonths = EnvService.getMaxLookbackMonths();
      var now = new Date();
      var months = [];

      for (var i = 0; i < maxMonths; i++) {
        var date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var monthStr = month < 10 ? "0" + month : month.toString();
        months.push(year + "-" + monthStr);
      }

      vm.availableMonths = months;
    }

    function onMonthChange() {
      loadDashboardData();
    }

    function retry() {
      loadDashboardData();
    }

    function loadDashboardData() {
      if (!vm.selectedMonth) {
        return;
      }

      vm.isLoading = true;
      vm.hasError = false;
      vm.error = null;

      var service = EnvService.isMockMode() ? SpendingDashboardMockService : SpendingDashboardApiService;

      var summaryPromise = service.getMonthlySummary(vm.cardId, vm.selectedMonth);
      var breakdownPromise = service.getMonthlyBreakdown(vm.cardId, vm.selectedMonth);

      summaryPromise
        .then(function (summaryData) {
          vm.summary = new SpendingSummaryModel(summaryData);
          vm.kpis = buildKpis(vm.summary);
        })
        .catch(function (error) {
          $log.error("Error loading summary", error);
          vm.hasError = true;
          vm.error = new ErrorModel(error);
        })
        .finally(function () {
          vm.isLoading = false;
        });

      breakdownPromise
        .then(function (breakdownData) {
          vm.breakdown = new SpendingBreakdownModel(breakdownData);
        })
        .catch(function (error) {
          // If breakdown fails but summary succeeds, show partial data
          $log.error("Error loading breakdown", error);
          if (!vm.hasError) {
            vm.hasError = true;
            vm.error = new ErrorModel(error);
          }
        });
    }

    function buildKpis(summary) {
      var kpis = [];
      var currencyUnit = summary.currency;

      var totalSpendKpi = new KpiModel(
        "Total Spend",
        summary.totalSpend,
        "glyphicon glyphicon-stats",
        "currency",
        currencyUnit
      );

      var transactionCountKpi = new KpiModel(
        "Transactions",
        summary.transactionCount,
        "glyphicon glyphicon-list-alt",
        "integer",
        "txns"
      );

      var averageSpendKpi = new KpiModel(
        "Average per Transaction",
        summary.averageTransactionAmount,
        "glyphicon glyphicon-scale",
        "currency",
        currencyUnit
      );

      var maxTransactionKpi = new KpiModel(
        "Max Transaction",
        summary.maxTransactionAmount,
        "glyphicon glyphicon-arrow-up",
        "currency",
        currencyUnit
      );

      kpis.push(totalSpendKpi);
      kpis.push(transactionCountKpi);
      kpis.push(averageSpendKpi);
      kpis.push(maxTransactionKpi);

      return kpis;
    }
  }

  angular.module("app")
    .controller("SpendingDashboardController", SpendingDashboardController);
})();
```

### 5.6 Directives

#### 5.6.1 `kpiCards`
- **Type**: Directive
- **File Path**: `src/spending-dashboard/components/kpi-cards/kpi-cards.directive.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").directive("kpiCards", kpiCardsDirective);`
- **Dependencies**: None
- **Injected Services**: None
- **Public Methods**: exposed via controller (none required beyond bindings)

```javascript
(function () {
  "use strict";

  function kpiCardsDirective() {
    return {
      restrict: "E",
      scope: {
        kpis: "="
      },
      bindToController: true,
      controllerAs: "vm",
      controller: [function () {
        // No additional logic beyond data binding
      }],
      templateUrl: "src/spending-dashboard/components/kpi-cards/kpi-cards.template.html",
      transclude: false,
      replace: false
    };
  }

  angular.module("app")
    .directive("kpiCards", kpiCardsDirective);
})();
```

- **restrict**: `E` (element)
- **scope bindings**: `kpis` two-way (`=`)
- **bindToController**: `true`
- **controller**: inline array with IIFE (no dependencies)
- **controllerAs**: `vm`
- **templateUrl**: `src/spending-dashboard/components/kpi-cards/kpi-cards.template.html`
- **transclude**: `false`
- **replace**: `false`

#### 5.6.2 `spendingChart`
- **Type**: Directive
- **File Path**: `src/spending-dashboard/components/spending-chart/spending-chart.directive.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").directive("spendingChart", spendingChartDirective);`
- **Dependencies**: `$timeout`
- **Injected Services**: `$timeout`
- **Public Methods**: `renderChart()` via controller

```javascript
(function () {
  "use strict";

  spendingChartDirective.$inject = ["$timeout"];

  function spendingChartDirective($timeout) {
    return {
      restrict: "E",
      scope: {
        breakdown: "="
      },
      bindToController: true,
      controllerAs: "vm",
      controller: ["$element", function ($element) {
        var vm = this;

        vm.$onInit = function () {
          $timeout(renderChart, 0);
        };

        vm.$onChanges = function () {
          $timeout(renderChart, 0);
        };

        function renderChart() {
          if (!vm.breakdown || !Array.isArray(vm.breakdown.categories)) {
            return;
          }

          var canvas = $element.find("canvas")[0];
          if (!canvas) {
            return;
          }

          var labels = vm.breakdown.categories.map(function (category) {
            return category.name;
          });
          var data = vm.breakdown.categories.map(function (category) {
            return category.amount;
          });

          var backgroundColors = [
            "#4CAF50",
            "#2196F3",
            "#FFC107",
            "#FF5722",
            "#9C27B0"
          ];

          new Chart(canvas.getContext("2d"), {
            type: "doughnut",
            data: {
              labels: labels,
              datasets: [{
                data: data,
                backgroundColor: backgroundColors
              }]
            },
            options: {
              responsive: true,
              legend: {
                position: "right"
              },
              tooltips: {
                callbacks: {
                  label: function (tooltipItem, chartData) {
                    var label = chartData.labels[tooltipItem.index] || "";
                    var value = chartData.datasets[0].data[tooltipItem.index] || 0;
                    return label + ": " + value.toFixed(2);
                  }
                }
              }
            }
          });
        }
      }],
      templateUrl: "src/spending-dashboard/components/spending-chart/spending-chart.template.html",
      transclude: false,
      replace: false
    };
  }

  angular.module("app")
    .directive("spendingChart", spendingChartDirective);
})();
```

- **restrict**: `E`
- **scope bindings**: `breakdown` two-way (`=`)
- **bindToController**: `true`
- **controllerAs**: `vm`
- **templateUrl**: `src/spending-dashboard/components/spending-chart/spending-chart.template.html`
- **transclude**: `false`
- **replace**: `false`

#### 5.6.3 `breakdownTable`
- **Type**: Directive
- **File Path**: `src/spending-dashboard/components/breakdown-table/breakdown-table.directive.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").directive("breakdownTable", breakdownTableDirective);`
- **Dependencies**: None
- **Injected Services**: None

```javascript
(function () {
  "use strict";

  function breakdownTableDirective() {
    return {
      restrict: "E",
      scope: {
        breakdown: "="
      },
      bindToController: true,
      controllerAs: "vm",
      controller: [function () {
        var vm = this;

        vm.getCategoriesWithPercentage = function () {
          if (!vm.breakdown || typeof vm.breakdown.getCategoriesWithPercentage !== "function") {
            return [];
          }
          return vm.breakdown.getCategoriesWithPercentage();
        };
      }],
      templateUrl: "src/spending-dashboard/components/breakdown-table/breakdown-table.template.html",
      transclude: false,
      replace: false
    };
  }

  angular.module("app")
    .directive("breakdownTable", breakdownTableDirective);
})();
```

- **restrict**: `E`
- **scope bindings**: `breakdown` two-way (`=`)
- **bindToController**: `true`
- **controllerAs**: `vm`
- **templateUrl**: `src/spending-dashboard/components/breakdown-table/breakdown-table.template.html`
- **transclude**: `false`
- **replace**: `false`

### 5.7 Interceptors

#### 5.7.1 `HttpErrorInterceptor`
- **Type**: Factory
- **File Path**: `src/core/interceptors/http-error.interceptor.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module("app").factory("HttpErrorInterceptor", HttpErrorInterceptor);`
- **Dependencies**: `$q`, `LoggingService`
- **Injected Services**: `$q`, `LoggingService`

```javascript
(function () {
  "use strict";

  HttpErrorInterceptor.$inject = ["$q", "LoggingService"];

  function HttpErrorInterceptor($q, LoggingService) {
    return {
      responseError: function (rejection) {
        LoggingService.error("HTTP error", rejection);
        return $q.reject(rejection);
      }
    };
  }

  angular.module("app")
    .factory("HttpErrorInterceptor", HttpErrorInterceptor);
})();
```

- Constraint: Interceptor does not depend on `$http`, satisfying architecture rules.


## 6. Templates and UI Specification

### 6.1 `spending-dashboard.template.html`

**File Path**: `src/spending-dashboard/components/dashboard/spending-dashboard.template.html`

```html
<div class="spending-dashboard" ng-class="{ 'is-loading': vm.isLoading }">
  <!-- Month selection -->
  <div class="row spending-month-row">
    <div class="col-xs-12 col-sm-4">
      <label for="monthSelect" class="control-label">Select Month</label>
      <select id="monthSelect"
              class="form-control"
              ng-model="vm.selectedMonth"
              ng-options="month for month in vm.availableMonths"
              ng-change="vm.onMonthChange()">
      </select>
    </div>
  </div>

  <!-- Loading state -->
  <div class="row" ng-if="vm.isLoading">
    <div class="col-xs-12">
      <div class="alert alert-info spending-loading">Loading monthly spending summary...</div>
    </div>
  </div>

  <!-- Error state -->
  <div class="row" ng-if="vm.hasError && !vm.isLoading">
    <div class="col-xs-12">
      <div class="alert alert-danger spending-error">
        {{ vm.error.getUserMessage() }}
        <button type="button" class="btn btn-danger btn-sm" ng-if="vm.error.retryable" ng-click="vm.retry()">
          Retry
        </button>
      </div>
    </div>
  </div>

  <!-- Empty state -->
  <div class="row" ng-if="!vm.isLoading && !vm.hasError && vm.summary && vm.summary.isEmpty()">
    <div class="col-xs-12">
      <div class="alert alert-warning spending-empty">
        No spending data available for the selected month.
      </div>
    </div>
  </div>

  <!-- Main content -->
  <div class="row" ng-if="!vm.isLoading && !vm.hasError && vm.summary && !vm.summary.isEmpty()">
    <!-- KPI cards -->
    <div class="col-xs-12 spending-kpi-section">
      <kpi-cards kpis="vm.kpis"></kpi-cards>
    </div>

    <!-- Chart and breakdown -->
    <div class="col-xs-12 col-md-6 spending-chart-section">
      <spending-chart breakdown="vm.breakdown"></spending-chart>
    </div>
    <div class="col-xs-12 col-md-6 spending-breakdown-section">
      <breakdown-table breakdown="vm.breakdown"></breakdown-table>
    </div>
  </div>
</div>
```

- **Layout**:
  - Bootstrap grid with month selector row, loading/error/empty states, KPI cards row, chart + breakdown columns.
- **Responsive behavior**:
  - On small screens: chart and breakdown stack vertically.
  - On medium+ screens: chart and breakdown side-by-side (`col-md-6`).

### 6.2 `kpi-cards.template.html`

**File Path**: `src/spending-dashboard/components/kpi-cards/kpi-cards.template.html`

```html
<div class="row spending-kpi-cards">
  <div class="col-xs-12 col-sm-3" ng-repeat="kpi in vm.kpis" ng-class="'kpi-card-' + $index">
    <div class="panel panel-default spending-kpi-card">
      <div class="panel-body">
        <div class="spending-kpi-icon">
          <span class="glyphicon" ng-class="kpi.icon"></span>
        </div>
        <div class="spending-kpi-content">
          <div class="spending-kpi-label">{{ kpi.label }}</div>
          <div class="spending-kpi-value">
            {{ kpi.formatValue() }}
            <span class="spending-kpi-unit" ng-if="kpi.unit">{{ kpi.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

- **KPI cards spec**:
  - Bootstrap classes: `row`, `col-xs-12`, `col-sm-3`, `panel panel-default`.
  - Card size: quarter width on small+ screens, full width on extra small.
  - Icons: Bootstrap Glyphicons.
  - Labels: `kpi.label` text.
  - Values: `kpi.formatValue()` with `kpi.unit`.
  - Alignment: icon left, text right.
  - Borders: default panel border.
  - Shadows: optional via CSS.

### 6.3 `spending-chart.template.html`

**File Path**: `src/spending-dashboard/components/spending-chart/spending-chart.template.html`

```html
<div class="panel panel-default spending-chart-card">
  <div class="panel-heading">Spend Breakdown</div>
  <div class="panel-body">
    <div ng-if="!vm.breakdown || !vm.breakdown.categories || !vm.breakdown.categories.length">
      <img src="assets/images/spending-chart-placeholder.png" alt="No data" class="img-responsive spending-chart-placeholder">
      <p class="text-muted">No breakdown data available for the selected month.</p>
    </div>
    <div ng-if="vm.breakdown && vm.breakdown.categories && vm.breakdown.categories.length">
      <canvas width="300" height="300"></canvas>
    </div>
  </div>
</div>
```

- **Chart spec**:
  - Chart type: `doughnut` (Chart.js).
  - Labels: category names.
  - Legends: positioned right.
  - Tooltips: label + value to 2 decimal places.
  - Axes: not applicable (doughnut chart).
  - Colors: 5 defined hex colors.
  - Responsive behavior: Chart options set to responsive; canvas contained in Bootstrap panel.

### 6.4 `breakdown-table.template.html`

**File Path**: `src/spending-dashboard/components/breakdown-table/breakdown-table.template.html`

```html
<div class="panel panel-default spending-breakdown-card">
  <div class="panel-heading">Spend Breakdown Details</div>
  <div class="panel-body">
    <table class="table table-striped table-bordered" ng-if="vm.getCategoriesWithPercentage().length">
      <thead>
        <tr>
          <th>Category</th>
          <th class="text-right">Amount</th>
          <th class="text-right">Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="category in vm.getCategoriesWithPercentage()">
          <td>{{ category.name }}</td>
          <td class="text-right">{{ category.amount | number:2 }}</td>
          <td class="text-right">{{ category.percentage | number:1 }}%</td>
        </tr>
      </tbody>
    </table>
    <div ng-if="!vm.getCategoriesWithPercentage().length" class="text-muted">
      No breakdown data available.
    </div>
  </div>
</div>
```

- **Table spec**:
  - Columns: Category, Amount, Percentage.
  - Formatting: numeric with Angular `number` filter.

### 6.5 CSS – `spending-dashboard.css`

**File Path**: `src/spending-dashboard/styles/spending-dashboard.css`

Key rules:

```css
.spending-header {
  margin-top: 20px;
  margin-bottom: 20px;
}

.spending-title {
  font-size: 24px;
  font-weight: 600;
}

.spending-subtitle {
  color: #777;
}

.spending-card-icon {
  max-height: 48px;
}

.spending-main {
  margin-bottom: 40px;
}

.spending-footer {
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 1px solid #eee;
  margin-top: 20px;
}

.spending-kpi-card {
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.spending-kpi-icon {
  float: left;
  font-size: 24px;
  margin-right: 10px;
}

.spending-kpi-content {
  overflow: hidden;
}

.spending-kpi-label {
  font-size: 14px;
  color: #888;
}

.spending-kpi-value {
  font-size: 20px;
  font-weight: 600;
}

.spending-kpi-unit {
  font-size: 12px;
  margin-left: 4px;
  color: #999;
}

.spending-loading,
.spending-error,
.spending-empty {
  margin-top: 15px;
}

.spending-chart-card,
.spending-breakdown-card {
  margin-top: 15px;
}

.spending-chart-placeholder {
  max-width: 100%;
  margin-bottom: 10px;
}

@media (max-width: 767px) {
  .spending-header-icon {
    display: none;
  }
}
```

- **Typography**: Uses Bootstrap defaults; custom sizes for titles and KPI values.
- **Colors**: Muted grays for subtitles, units; default panel colors.
- **Spacing**: Margins and padding around header, main, footer, cards.
- **Responsive behavior**: Hides header icon on small screens; grid classes handle stacking.


## 7. REST API Contracts

Although production endpoints are not directly called in mock mode, contracts are defined to ensure alignment.

### 7.1 Endpoint: Monthly Summary

- **URL**: `ENV_CONFIG.apiBaseUrl + "/summary"` (e.g., `https://api.example.com/spending-dashboard/summary`)
- **HTTP Method**: `GET`
- **Headers**:
  - `Accept: application/json`
  - Authentication headers handled by API gateway (e.g., `Authorization: Bearer <token>`), not managed by frontend.
- **Query Parameters**:
  - `cardId` (string, required; credit card identifier mapped to authenticated user)
  - `month` (string, required; format `YYYY-MM`, must be within `ENV_CONFIG.maxLookbackMonths`)
- **Request Body**: none
- **Response Body (Success)**:

```json
{
  "cardId": "CARD-1234",
  "month": "2026-07",
  "currency": "USD",
  "totalSpend": 1250.75,
  "transactionCount": 42,
  "averageTransactionAmount": 29.78,
  "maxTransactionAmount": 210.5
}
```

- **Success Response**: `200 OK`
- **Error Responses**:
  - `400 Bad Request` – invalid `cardId` or `month` format:

```json
{
  "code": "INVALID_REQUEST",
  "message": "cardId and month are required."
}
```

  - `401 Unauthorized` – missing/invalid token.
  - `403 Forbidden` – user not authorized for card.
  - `404 Not Found` – no data for month.
  - `500 Internal Server Error` – unexpected server error.

- **Timeout**: `ENV_CONFIG.apiTimeoutMs`
- **Retry Policy**: Client does not automatically retry; user uses Retry button. backend may implement retries; not specified here.

### 7.2 Endpoint: Monthly Breakdown

- **URL**: `ENV_CONFIG.apiBaseUrl + "/breakdown"`
- **HTTP Method**: `GET`
- **Headers**:
  - `Accept: application/json`
- **Query Parameters**:
  - `cardId` (string, required)
  - `month` (string, required; `YYYY-MM`)
- **Request Body**: none
- **Response Body (Success)**:

```json
{
  "cardId": "CARD-1234",
  "month": "2026-07",
  "currency": "USD",
  "categories": [
    { "name": "Groceries", "amount": 350.0 },
    { "name": "Dining", "amount": 275.5 },
    { "name": "Travel", "amount": 400.25 },
    { "name": "Utilities", "amount": 125.0 },
    { "name": "Other", "amount": 100.0 }
  ]
}
```

- **Success Response**: `200 OK`
- **Error Responses**: same shape as summary endpoint.
- **Timeout**: `ENV_CONFIG.apiTimeoutMs`
- **Retry Policy**: same as summary.


## 8. Configuration

### 8.1 ENV_CONFIG

**File**: `src/core/config/env.config.js`

- **Properties**:
  - `apiBaseUrl`: base URL for production REST API.
  - `apiTimeoutMs`: GET request timeout in milliseconds.
  - `maxLookbackMonths`: maximum months back user can select.
  - `useMockData`: boolean controlling mock vs production mode.
  - `featureFlags`: feature flags object.
  - `telemetry`: telemetry logging configuration.

Changing only `useMockData` switches between mock and production mode without code changes.

### 8.2 External JSON Config

**File**: `config/env/spending-dashboard.env.json`

Sample JSON:

```json
{
  "apiBaseUrl": "https://api.example.com/spending-dashboard",
  "apiTimeoutMs": 15000,
  "maxLookbackMonths": 12,
  "useMockData": true,
  "featureFlags": {
    "showAverageTransactionAmount": true,
    "showMaxTransactionAmount": true
  },
  "telemetry": {
    "enableLogging": true,
    "logLevel": "debug"
  }
}
```

This file can be used by deployment tooling to generate `ENV_CONFIG` in `env.config.js`.


## 9. Mock Mode Specification

Mock mode is active when `ENV_CONFIG.useMockData === true`.

### 9.1 Summary Endpoint Mock

- **Implementation**: `SpendingDashboardMockService.getMonthlySummary(cardId, month)`.
- **Mock JSON**: see method implementation.
- **Sample Response**: same shape as production success response with fixed numeric values.
- **Delay Simulation**: `300ms` via `$timeout`.
- **Failure Scenarios**:
  - Missing `cardId` or `month` → rejects with `status: 400`, data containing `code` and `message`.

### 9.2 Breakdown Endpoint Mock

- **Implementation**: `SpendingDashboardMockService.getMonthlyBreakdown(cardId, month)`.
- **Mock JSON**: see method implementation.
- **Sample Response**: same shape as production success response.
- **Delay Simulation**: `350ms` via `$timeout`.
- **Failure Scenarios**: same as summary.

Mock responses exactly match model interfaces used by `SpendingSummaryModel` and `SpendingBreakdownModel`.


## 10. Data Flow

### 10.1 Success Flow

1. **User Action**: User opens dashboard URL (`#/spending-dashboard`) and selects month from dropdown.
2. **Controller**: `SpendingDashboardController.onMonthChange()` sets `vm.selectedMonth` and calls `loadDashboardData()`.
3. **Service Selection**: `EnvService.isMockMode()` determines whether to use `SpendingDashboardMockService` or `SpendingDashboardApiService`.
4. **Service Calls**:
   - Summary: `service.getMonthlySummary(vm.cardId, vm.selectedMonth)`.
   - Breakdown: `service.getMonthlyBreakdown(vm.cardId, vm.selectedMonth)`.
5. **REST API / Mock**:
   - Production: `$http.get` to `/summary` and `/breakdown` endpoints.
   - Mock: `$timeout`-delayed `$q` promise resolutions.
6. **Model Construction**:
   - `vm.summary = new SpendingSummaryModel(summaryData)`.
   - `vm.breakdown = new SpendingBreakdownModel(breakdownData)`.
   - KPI list via `buildKpis(vm.summary)` (array of `KpiModel`).
7. **Directive/View**:
   - `<kpi-cards kpis="vm.kpis"></kpi-cards>` renders KPI cards.
   - `<spending-chart breakdown="vm.breakdown"></spending-chart>` renders doughnut chart.
   - `<breakdown-table breakdown="vm.breakdown"></breakdown-table>` renders table.
8. **UI Update**:
   - Loading flags cleared; dashboard sections visible.

### 10.2 Failure Flow

1. **User Action**: As above.
2. **Controller**: Same `loadDashboardData()` invocation.
3. **Service**: returns rejected promise due to HTTP error or mock validation.
4. **REST API / Mock**: rejection object with `status` and `data`.
5. **Model**: `vm.error = new ErrorModel(error)`.
6. **Directive/View**:
   - Dashboard template conditionally shows error alert with `vm.error.getUserMessage()` and optional Retry button.
7. **UI Update**:
   - Loading state cleared; error state visible.

### 10.3 Partial Failure Flow

- Summary succeeds but breakdown fails: KPI cards and summary display; breakdown chart/table show error or empty messages.


## 11. Error Handling

### 11.1 ErrorModel

See `ErrorModel` definition. It maps HTTP errors to user-friendly messages.

### 11.2 HTTP Mapping

- `status === 0`: network error.
- `400`: validation error.
- `401/403`: authorization error.
- `404`: no data.
- `5xx`: server error.

### 11.3 Validation Errors

- Frontend ensures month selection is from `availableMonths` list only.
- Backend (production) validates credit card product and month range.

### 11.4 Network Errors

- Captured by `$http` error; `ErrorModel` maps to network message.

### 11.5 Retry Logic

- UI exposes `Retry` button when `error.retryable` is true (typically `status >= 500`).
- On click, `vm.retry()` re-invokes `loadDashboardData()`.

### 11.6 Logging

- `LoggingService` logs errors in interceptor and services.
- `$log` used in controller for console logging.

### 11.7 User Messages and Fallback Behavior

- User-friendly messages in `ErrorModel.getUserMessage()`.
- Fallback when breakdown fails but summary exists – show summary only.


## 12. Security

### 12.1 Input Validation

- Month select uses predefined options; invalid inputs cannot be chosen.
- CardId is fixed in controller (in real integration, supplied from authenticated context, not user input).

### 12.2 Sanitization

- Angular Sanitize (`ngSanitize`) module included.
- `$sceProvider` with default enabling; templates do not use unsafe HTML.

### 12.3 Authentication Hooks

- Frontend assumes user is authenticated via hosting banking platform; no login logic in this module.
- All API endpoints use secure `ENV_CONFIG.apiBaseUrl` (HTTPS).

### 12.4 Authorization Hooks

- Backend enforces card-level authorization.
- Frontend does not expose card selection inputs that could bypass backend authorization; cardId comes from context.

### 12.5 Secure Communication

- API base URL must be `https://`.

### 12.6 Audit Logging

- Not implemented in frontend; assumed at backend.


## 13. Implementation Rules

- ES6 syntax used for models (classes) and controller/service functions (`let`/`const` may be used where supported; here `var` used for Angular compatibility but ES6 features like classes used).
- Explicit `$inject` arrays for all DI functions.
- ControllerAs syntax (`vm` alias) used in routes and templates.
- Promise handling via `.then`, `.catch`, `.finally` and `$q` when needed.
- Naming conventions:
  - Modules: `app`.
  - Controllers: `SpendingDashboardController`.
  - Services: `SpendingDashboardApiService`, `SpendingDashboardMockService`, `EnvService`, `LoggingService`.
  - Directives: `kpiCards`, `spendingChart`, `breakdownTable`.
  - Models: `SpendingSummaryModel`, `SpendingBreakdownModel`, `KpiModel`, `ErrorModel`.
  - Interceptors: `HttpErrorInterceptor`.
- Folder conventions: `src/app` for core app, `src/core` for shared utilities, `src/spending-dashboard/components` for feature components.
- File naming conventions: kebab-case for file names (`spending-dashboard.controller.js`), matching component names.


## 14. Architecture Constraints Validation

- Only one Angular module declaration (`app.module.js`).
- All other files use `angular.module("app")`.
- No circular module dependencies (only one module).
- No circular service/controller/directive/factory dependencies (services reference core dependencies only; controllers reference services/models; directives reference models/controllers via bindings only).
- HttpInterceptor does not depend on `$http`.
- LoggingService lazily resolves `$http` only if required, avoiding hard dependency.
- Startup services (`EnvService`) do not depend on API services.
- Every dependency is registered exactly once in module `app`.


## 15. Implementation Validation Checklist

- Every source file is defined with path and content.
- Every repository path is valid within defined structure.
- Every script reference in `index.html` corresponds to an existing file.
- Every stylesheet reference exists.
- Every template file referenced by `templateUrl` exists at specified paths.
- Route `/spending-dashboard` exists and maps to template and controller.
- All dependencies used in DI (`EnvService`, `SpendingDashboardApiService`, etc.) are registered.
- All directive bindings (`kpis`, `breakdown`) are explicitly specified.
- All models (`SpendingSummaryModel`, `SpendingBreakdownModel`, `KpiModel`, `ErrorModel`) are defined.
- REST APIs are defined (`/summary`, `/breakdown`) with contracts.
- All environment properties (`apiBaseUrl`, `apiTimeoutMs`, `maxLookbackMonths`, `useMockData`, `featureFlags`, `telemetry`) are defined.
- Mock responses are defined and match production shape.
- All public methods for services/controllers/directives are specified.
- Script loading order is complete and correct.
- Stylesheet loading order is defined.
- No circular dependencies.
- AngularJS DI is explicit and valid.
- No missing resources or invalid file paths.
- Application can be generated end-to-end without assumptions beyond values provided in ENV_CONFIG.
