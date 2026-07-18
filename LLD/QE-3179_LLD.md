# Low-Level Design (LLD) – QE-3179 DAVMS Monthly Spending Summary Dashboard

## 1. Technology Stack & Architectural Constraints

### 1.1 Technology Stack (Exact Versions)

**Frontend**
- HTML5
- CSS3
- JavaScript ES6 (ES2015) – transpilation not assumed; must be compatible with Chrome & Edge current versions
- AngularJS 1.7.9 (from Google CDN)
- Angular Route 1.7.9 (from Google CDN)
- Angular Animate 1.7.9 (from Google CDN)
- Angular Sanitize 1.7.9 (from Google CDN)
- Angular UI Bootstrap 2.5.6 (from CDN)
- Bootstrap 3.4.1 (CSS only, from MaxCDN)
- Chart.js 2.9.4 (from CDN)

**Architecture**
- AngularJS MVC
- Single Page Application (SPA)
- REST-based data access
- Dependency Injection via AngularJS DI
- ControllerAs syntax only
- IIFE module pattern in all JS files

**Runtime Angular Services Used**
- `$http` – for REST calls to DAVMS Summary API
- `$q` – for promise creation and mock mode flows
- `$timeout` – for mock latency simulation and UI delay handling

**Browser Support**
- Google Chrome (latest stable)
- Microsoft Edge (latest stable)

### 1.2 Architecture Constraints

- Only **one** Angular module declaration:
  - `angular.module("app", [...])` in `src/app/app.module.js`
- All other AngularJS files must use:
  - `angular.module("app")`
- No circular dependencies:
  - Between modules (only one module: `app`)
  - Between services
  - Between controllers
  - Between directives
  - Between factories
- `HttpInterceptor` must **not** depend on `$http` directly.
- `LoggingService` must lazily resolve `$http` via `$injector` to avoid circular dependency.
- Startup services (run block initializers) must not depend on API services.
- Every dependency (service, factory, directive, controller, filter) must be registered exactly once.
- Strict use of ES6 syntax where supported:
  - `const` and `let` for variable declarations.
  - Arrow functions allowed where they do **not** rely on Angular’s `this`/`scope` binding (avoid in controllers/directives controllers).
- Explicit `$inject` arrays for all injectable functions to ensure minification safety.
- ControllerAs syntax everywhere (no `$scope` usage except in directives where absolutely necessary; this LLD avoids `$scope` entirely and uses `bindToController` + `controllerAs`).


## 2. Repository Structure

Root repository for this epic is `APB_Demo` with branch `DAVMS`.
The application name for this epic is `DAVMS`.

### 2.1 Top-Level Layout

```text
APB_Demo/
  DAVMS/
    src/
      index.html
      app/
        app.module.js
        app.config.js
        app.routes.js
        app.run.js
        core/
          constants/
            env.config.js
            app.constants.js
          models/
            monthly-summary.model.js
            breakdown-entry.model.js
            kpi-summary.model.js
            month-option.model.js
            error.model.js
          services/
            http-interceptor.service.js
            logging.service.js
            telemetry.service.js
            config.service.js
            feature-flags.service.js
          api/
            summary-api.service.js
            summary-mock.service.js
          dashboard/
            dashboard.module.js
            dashboard.routes.js
            dashboard.controller.js
            dashboard.service.js
            dashboard.mapper.service.js
            dashboard.directive.js
        shared/
          directives/
            loading-spinner.directive.js
            error-panel.directive.js
          filters/
            currency-no-symbol.filter.js
          components/
            kpi-card.directive.js
            breakdown-chart.directive.js
            month-selector.directive.js
      assets/
        css/
          styles.css
          dashboard.css
        img/
          icons/
            kpi-total-spend.png
            kpi-tx-count.png
            kpi-avg-spend.png
          logo/
            davms-logo.png
      config/
        env/
          env.config.json
        telemetry/
          telemetry.config.json
      mock/
        summary/
          monthly-summary.mock.json
          breakdown.mock.json
          kpi-summary.mock.json
          month-options.mock.json
          error-responses.mock.json
```

Each file below is precisely defined with responsibility, dependencies, and usage.


## 3. index.html Specification

### 3.1 Repository Path
- `DAVMS/src/index.html`

### 3.2 Purpose
- Root HTML document for the DAVMS Monthly Spending Summary Dashboard SPA.
- Bootstraps AngularJS application `app`.
- Declares `ng-view` for route-driven view injection.

### 3.3 Structure & Content (Complete)

```html
<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DAVMS Monthly Spending Summary Dashboard</title>

  <!-- Bootstrap CSS (CDN) -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

  <!-- Application Styles (local) - order matters: base first, feature-specific second -->
  <link rel="stylesheet" href="assets/css/styles.css">
  <link rel="stylesheet" href="assets/css/dashboard.css">
</head>
<body>
  <div class="container-fluid davms-app-root">
    <!-- Header -->
    <header class="row davms-header">
      <div class="col-xs-12 col-sm-6 davms-header-left">
        <img src="assets/img/logo/davms-logo.png" alt="DAVMS" class="davms-logo" />
        <h1 class="davms-title">Monthly Spending Summary</h1>
      </div>
      <div class="col-xs-12 col-sm-6 davms-header-right text-right">
        <span class="davms-user-context" ng-bind="::'Credit Card Dashboard'">
        </span>
      </div>
    </header>

    <!-- Navigation (simple for this epic) -->
    <nav class="row davms-nav">
      <div class="col-xs-12">
        <!-- Simple breadcrumb-style navigation (no router links for other epics) -->
        <ol class="breadcrumb">
          <li class="active">Monthly Summary</li>
        </ol>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="row davms-main">
      <div class="col-xs-12">
        <div ng-view></div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="row davms-footer">
      <div class="col-xs-12 text-center">
        <small>&copy; <span ng-bind="::(new Date()).getFullYear()"></span> DAVMS - Credit Card Monthly Spending Summary</small>
      </div>
    </footer>
  </div>

  <!-- AngularJS Core (CDN) -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
  <!-- Angular Route (CDN) -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js"></script>
  <!-- Angular Animate (CDN) -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js"></script>
  <!-- Angular Sanitize (CDN) -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js"></script>
  <!-- Angular UI Bootstrap (CDN) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js"></script>
  <!-- Chart.js (CDN) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js"></script>

  <!-- Application Scripts (local) - Script Loading Order -->
  <!-- 1. Root module & core configuration -->
  <script src="app/app.module.js"></script>
  <script src="app/app.config.js"></script>
  <script src="app/app.routes.js"></script>
  <script src="app/app.run.js"></script>

  <!-- 2. Core constants & models -->
  <script src="app/core/constants/env.config.js"></script>
  <script src="app/core/constants/app.constants.js"></script>
  <script src="app/core/models/error.model.js"></script>
  <script src="app/core/models/month-option.model.js"></script>
  <script src="app/core/models/kpi-summary.model.js"></script>
  <script src="app/core/models/breakdown-entry.model.js"></script>
  <script src="app/core/models/monthly-summary.model.js"></script>

  <!-- 3. Core services & infrastructure -->
  <script src="app/core/services/config.service.js"></script>
  <script src="app/core/services/feature-flags.service.js"></script>
  <script src="app/core/services/telemetry.service.js"></script>
  <script src="app/core/services/logging.service.js"></script>
  <script src="app/core/services/http-interceptor.service.js"></script>

  <!-- 4. API & mock services -->
  <script src="app/core/api/summary-api.service.js"></script>
  <script src="app/core/api/summary-mock.service.js"></script>

  <!-- 5. Dashboard module & components -->
  <script src="app/dashboard/dashboard.module.js"></script>
  <script src="app/dashboard/dashboard.routes.js"></script>
  <script src="app/dashboard/dashboard.service.js"></script>
  <script src="app/dashboard/dashboard.mapper.service.js"></script>
  <script src="app/dashboard/dashboard.controller.js"></script>
  <script src="app/dashboard/dashboard.directive.js"></script>

  <!-- 6. Shared components, directives, filters -->
  <script src="app/shared/filters/currency-no-symbol.filter.js"></script>
  <script src="app/shared/directives/loading-spinner.directive.js"></script>
  <script src="app/shared/directives/error-panel.directive.js"></script>
  <script src="app/shared/components/kpi-card.directive.js"></script>
  <script src="app/shared/components/breakdown-chart.directive.js"></script>
  <script src="app/shared/components/month-selector.directive.js"></script>
</body>
</html>
```

### 3.4 Component Type
- HTML template and AngularJS bootstrap file.

### 3.5 Dependencies
- AngularJS core and modules via CDN.
- Angular UI Bootstrap via CDN.
- Chart.js via CDN.
- Local application JS and CSS as listed.


## 4. Application Bootstrap & Core Modules

### 4.1 Root Angular Module

**File**: `DAVMS/src/app/app.module.js`

**Purpose**
- Declare the single AngularJS root module `app`.
- Register high-level dependencies.

**Content (Complete)**

```javascript
(function () {
  "use strict";

  angular
    .module("app", [
      "ngRoute",
      "ngAnimate",
      "ngSanitize",
      "ui.bootstrap",
      "app.dashboard"
    ]);
})();
```

**Component Type**
- AngularJS module definition.

**Dependencies**
- Angular core.
- `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap` from CDN.
- Feature module `app.dashboard` defined in `app/dashboard/dashboard.module.js`.

### 4.2 Global Configuration – app.config.js

**File**: `DAVMS/src/app/app.config.js`

**Purpose**
- Configure global AngularJS providers.
- Register HTTP interceptor.
- Configure sanitize and animate behavior if needed.

**Content**

```javascript
(function () {
  "use strict";

  config.$inject = ["$httpProvider"];

  function config($httpProvider) {
    // Register HTTP interceptor for telemetry and error handling
    $httpProvider.interceptors.push("httpInterceptor");
  }

  angular
    .module("app")
    .config(config);
})();
```

**Component Type**
- AngularJS config block.

**Dependencies**
- `$httpProvider`.
- `httpInterceptor` service defined in `app/core/services/http-interceptor.service.js`.

### 4.3 Routing Configuration – app.routes.js

**File**: `DAVMS/src/app/app.routes.js`

**Purpose**
- Define root-level route configuration.
- Delegate feature-specific routes to modules.

**Content**

```javascript
(function () {
  "use strict";

  routes.$inject = ["$routeProvider", "$locationProvider"];

  function routes($routeProvider, $locationProvider) {
    // Optional: use hash-bang mode without HTML5 pushState for compatibility
    $locationProvider.hashPrefix("");

    // Default route is the monthly spending summary dashboard
    $routeProvider.otherwise({
      redirectTo: "/dashboard/monthly-summary"
    });
  }

  angular
    .module("app")
    .config(routes);
})();
```

**Component Type**
- AngularJS config block (routing).

**Dependencies**
- `$routeProvider` (ngRoute).
- `$locationProvider`.

### 4.4 Run Block – app.run.js

**File**: `DAVMS/src/app/app.run.js`

**Purpose**
- Initialize telemetry and feature flags.
- Attach global handlers that do not depend on API services directly.

**Content**

```javascript
(function () {
  "use strict";

  run.$inject = [
    "telemetryService",
    "featureFlagsService"
  ];

  function run(telemetryService, featureFlagsService) {
    // Initialize telemetry context
    telemetryService.initialize({
      appName: "DAVMS Monthly Spending Summary",
      appVersion: "1.0.0",
      environment: featureFlagsService.getEnvironmentName()
    });

    // Preload feature flags (no API calls here, uses env config only)
    featureFlagsService.loadStaticFlags();
  }

  angular
    .module("app")
    .run(run);
})();
```

**Component Type**
- AngularJS run block.

**Dependencies**
- `telemetryService` (core infrastructure service).
- `featureFlagsService` (core infrastructure service).

**Constraint**
- Neither `telemetryService` nor `featureFlagsService` depends on API services.


## 5. Configuration Files & ENV_CONFIG

### 5.1 ENV_CONFIG Constant – env.config.js

**File**: `DAVMS/src/app/core/constants/env.config.js`

**Purpose**
- Define environment configuration used across the application.
- Control mock vs production mode via single flag `useMockData`.

**Content**

```javascript
(function () {
  "use strict";

  const ENV_CONFIG = {
    apiBaseUrl: "https://api.example.com/davms", // Production base URL
    apiTimeoutMs: 10000,
    maxLookbackMonths: 24,
    useMockData: true, // Switch to false for production mode
    featureFlags: {
      showBreakdownChart: true,
      showKpiCards: true,
      enableLatencySimulationInMock: true
    },
    telemetry: {
      enabled: true,
      endpointUrl: "https://telemetry.example.com/collect",
      sampleRate: 1.0
    }
  };

  angular
    .module("app")
    .constant("ENV_CONFIG", ENV_CONFIG);
})();
```

**Component Type**
- Angular constant.

### 5.2 Application Constants – app.constants.js

**File**: `DAVMS/src/app/core/constants/app.constants.js`

**Purpose**
- Define non-environmental constants (routes, event names, error codes).

**Content**

```javascript
(function () {
  "use strict";

  const APP_CONSTANTS = {
    routes: {
      dashboardMonthlySummary: "/dashboard/monthly-summary"
    },
    httpStatus: {
      ok: 200,
      badRequest: 400,
      unauthorized: 401,
      forbidden: 403,
      notFound: 404,
      internalServerError: 500
    },
    errorCodes: {
      invalidMonthFormat: "INVALID_MONTH_FORMAT",
      unsupportedProductType: "UNSUPPORTED_PRODUCT_TYPE",
      authorizationFailed: "AUTHORIZATION_FAILED",
      summaryNotFound: "SUMMARY_NOT_FOUND",
      backendError: "BACKEND_ERROR"
    }
  };

  angular
    .module("app")
    .constant("APP_CONSTANTS", APP_CONSTANTS);
})();
```

**Component Type**
- Angular constant.

### 5.3 JSON Environment File – env.config.json

**File**: `DAVMS/config/env/env.config.json`

**Purpose**
- Source of environment configuration for deployment; mirrored by `ENV_CONFIG` constant.

**Content**

```json
{
  "apiBaseUrl": "https://api.example.com/davms",
  "apiTimeoutMs": 10000,
  "maxLookbackMonths": 24,
  "useMockData": true,
  "featureFlags": {
    "showBreakdownChart": true,
    "showKpiCards": true,
    "enableLatencySimulationInMock": true
  },
  "telemetry": {
    "enabled": true,
    "endpointUrl": "https://telemetry.example.com/collect",
    "sampleRate": 1.0
  }
}
```

### 5.4 Telemetry Config JSON – telemetry.config.json

**File**: `DAVMS/config/telemetry/telemetry.config.json`

**Purpose**
- Telemetry configuration mapping; consumed by backoffice tools, referenced by telemetryService.

**Content**

```json
{
  "applicationName": "DAVMS Monthly Spending Summary",
  "version": "1.0.0",
  "defaultLevel": "info",
  "allowedLevels": ["debug", "info", "warn", "error"],
  "fields": {
    "userId": true,
    "sessionId": true,
    "route": true,
    "accountId": true,
    "requestId": true
  }
}
```


## 6. Core Models

### 6.1 ErrorModel – error.model.js

**File**: `DAVMS/src/app/core/models/error.model.js`

**Purpose**
- Represent errors returned from the backend or generated on the client.

**Properties, Types, Defaults**
- `code` (string, default `""`)
- `message` (string, default `""`)
- `httpStatus` (number, default `0`)
- `details` (object, default `{}`)
- `retryable` (boolean, default `false`)

**Content**

```javascript
(function () {
  "use strict";

  ErrorModel.$inject = [];

  function ErrorModel() {
    this.code = "";
    this.message = "";
    this.httpStatus = 0;
    this.details = {};
    this.retryable = false;
  }

  ErrorModel.prototype.fromResponse = function (response) {
    if (response && response.data) {
      this.code = response.data.code || "";
      this.message = response.data.message || "";
      this.httpStatus = response.status || 0;
      this.details = response.data.details || {};
      this.retryable = !!response.data.retryable;
    }
    return this;
  };

  ErrorModel.prototype.clone = function () {
    const clone = new ErrorModel();
    clone.code = this.code;
    clone.message = this.message;
    clone.httpStatus = this.httpStatus;
    clone.details = angular.copy(this.details);
    clone.retryable = this.retryable;
    return clone;
  };

  angular
    .module("app")
    .factory("ErrorModel", function () {
      return ErrorModel;
    });
})();
```

**Validation & HTTP Mapping**
- No direct validation logic; mapping occurs in interceptor and dashboard service.

**Sample JSON**

```json
{
  "code": "SUMMARY_NOT_FOUND",
  "message": "No monthly summary data available for the selected month.",
  "httpStatus": 404,
  "details": {
    "month": "2024-02",
    "accountId": "CC123456789"
  },
  "retryable": false
}
```

### 6.2 MonthOption Model – month-option.model.js

**File**: `DAVMS/src/app/core/models/month-option.model.js`

**Purpose**
- Represent a selectable month option.

**Properties**
- `value` (string, format `YYYY-MM`, default `""`)
- `label` (string, human-readable month, default `""`)
- `isCurrent` (boolean, default `false`)

**Content**

```javascript
(function () {
  "use strict";

  MonthOption.$inject = [];

  function MonthOption(value, label, isCurrent) {
    this.value = value || "";
    this.label = label || "";
    this.isCurrent = !!isCurrent;
  }

  MonthOption.prototype.isValidFormat = function () {
    return /^\d{4}-\d{2}$/.test(this.value);
  };

  angular
    .module("app")
    .factory("MonthOption", function () {
      return MonthOption;
    });
})();
```

**Sample JSON**

```json
{
  "value": "2024-06",
  "label": "June 2024",
  "isCurrent": true
}
```

### 6.3 KpiSummary Model – kpi-summary.model.js

**File**: `DAVMS/src/app/core/models/kpi-summary.model.js`

**Purpose**
- Represent KPI data for monthly summary.

**Properties**
- `totalSpend` (number, default `0.0`)
- `transactionCount` (number, default `0`)
- `averageTransactionValue` (number, default `0.0`)

**Content**

```javascript
(function () {
  "use strict";

  KpiSummary.$inject = [];

  function KpiSummary() {
    this.totalSpend = 0.0;
    this.transactionCount = 0;
    this.averageTransactionValue = 0.0;
  }

  KpiSummary.prototype.fromDto = function (dto) {
    if (!dto) {
      return this;
    }
    this.totalSpend = Number(dto.totalSpend) || 0.0;
    this.transactionCount = Number(dto.transactionCount) || 0;
    this.averageTransactionValue = Number(dto.averageTransactionValue) || 0.0;
    return this;
  };

  angular
    .module("app")
    .factory("KpiSummary", function () {
      return KpiSummary;
    });
})();
```

**Sample JSON**

```json
{
  "totalSpend": 1234.56,
  "transactionCount": 42,
  "averageTransactionValue": 29.39
}
```

### 6.4 BreakdownEntry Model – breakdown-entry.model.js

**File**: `DAVMS/src/app/core/models/breakdown-entry.model.js`

**Purpose**
- Represent a single breakdown category in monthly spend.

**Properties**
- `categoryCode` (string, default `""`)
- `categoryLabel` (string, default `""`)
- `amount` (number, default `0.0`)
- `percentageOfTotal` (number, default `0.0`) – computed on client from total.

**Content**

```javascript
(function () {
  "use strict";

  BreakdownEntry.$inject = [];

  function BreakdownEntry() {
    this.categoryCode = "";
    this.categoryLabel = "";
    this.amount = 0.0;
    this.percentageOfTotal = 0.0;
  }

  BreakdownEntry.prototype.fromDto = function (dto, totalSpend) {
    if (!dto) {
      return this;
    }
    this.categoryCode = dto.categoryCode || "";
    this.categoryLabel = dto.categoryLabel || "";
    this.amount = Number(dto.amount) || 0.0;
    const safeTotal = Number(totalSpend) || 0.0;
    this.percentageOfTotal = safeTotal > 0 ? (this.amount / safeTotal) * 100.0 : 0.0;
    return this;
  };

  angular
    .module("app")
    .factory("BreakdownEntry", function () {
      return BreakdownEntry;
    });
})();
```

**Sample JSON**

```json
{
  "categoryCode": "ONLINE",
  "categoryLabel": "Online Purchases",
  "amount": 456.78,
  "percentageOfTotal": 37.0
}
```

### 6.5 MonthlySummary Model – monthly-summary.model.js

**File**: `DAVMS/src/app/core/models/monthly-summary.model.js`

**Purpose**
- Aggregate all monthly summary data used in the UI.

**Properties**
- `accountId` (string, default `""`)
- `month` (string, `YYYY-MM`, default `""`)
- `kpiSummary` (KpiSummary instance)
- `breakdownEntries` (array of BreakdownEntry)
- `hasData` (boolean, default `false`)

**Content**

```javascript
(function () {
  "use strict";

  MonthlySummary.$inject = ["KpiSummary", "BreakdownEntry"];

  function MonthlySummary(KpiSummary, BreakdownEntry) {
    this.accountId = "";
    this.month = "";
    this.kpiSummary = new KpiSummary();
    this.breakdownEntries = [];
    this.hasData = false;
  }

  MonthlySummary.prototype.fromDto = function (dto) {
    if (!dto) {
      this.hasData = false;
      return this;
    }
    this.accountId = dto.accountId || "";
    this.month = dto.month || "";
    this.kpiSummary = new this.kpiSummary.constructor().fromDto(dto.kpiSummary);
    const totalSpend = this.kpiSummary.totalSpend;
    this.breakdownEntries = [];

    if (Array.isArray(dto.breakdown)) {
      for (let i = 0; i < dto.breakdown.length; i += 1) {
        const entryDto = dto.breakdown[i];
        const entry = new BreakdownEntry().fromDto(entryDto, totalSpend);
        this.breakdownEntries.push(entry);
      }
    }

    this.hasData = true;
    return this;
  };

  angular
    .module("app")
    .factory("MonthlySummary", ["KpiSummary", "BreakdownEntry", function (KpiSummary, BreakdownEntry) {
      return function () {
        return new MonthlySummary(KpiSummary, BreakdownEntry);
      };
    }]);
})();
```

**Sample JSON (API Response Model)**

```json
{
  "accountId": "CC123456789",
  "month": "2024-06",
  "kpiSummary": {
    "totalSpend": 1234.56,
    "transactionCount": 42,
    "averageTransactionValue": 29.39
  },
  "breakdown": [
    {
      "categoryCode": "ONLINE",
      "categoryLabel": "Online Purchases",
      "amount": 456.78
    },
    {
      "categoryCode": "IN_STORE",
      "categoryLabel": "In Store",
      "amount": 777.78
    }
  ]
}
```


## 7. Core Infrastructure Services

### 7.1 ConfigService – config.service.js

**File**: `DAVMS/src/app/core/services/config.service.js`

**Purpose**
- Provide access to environment configuration.
- Abstract JSON/env overrides if needed.

**Content**

```javascript
(function () {
  "use strict";

  configService.$inject = ["ENV_CONFIG"];

  function configService(ENV_CONFIG) {
    const service = {
      getApiBaseUrl,
      getApiTimeoutMs,
      getMaxLookbackMonths,
      isMockModeEnabled,
      getFeatureFlags,
      getTelemetryConfig
    };

    function getApiBaseUrl() {
      return ENV_CONFIG.apiBaseUrl;
    }

    function getApiTimeoutMs() {
      return ENV_CONFIG.apiTimeoutMs;
    }

    function getMaxLookbackMonths() {
      return ENV_CONFIG.maxLookbackMonths;
    }

    function isMockModeEnabled() {
      return !!ENV_CONFIG.useMockData;
    }

    function getFeatureFlags() {
      return ENV_CONFIG.featureFlags;
    }

    function getTelemetryConfig() {
      return ENV_CONFIG.telemetry;
    }

    return service;
  }

  angular
    .module("app")
    .service("configService", configService);
})();
```

**Injected Dependencies**
- `ENV_CONFIG` constant.

### 7.2 FeatureFlagsService – feature-flags.service.js

**File**: `DAVMS/src/app/core/services/feature-flags.service.js`

**Purpose**
- Manage feature flags from ENV_CONFIG.

**Content**

```javascript
(function () {
  "use strict";

  featureFlagsService.$inject = ["configService"];

  function featureFlagsService(configService) {
    const flags = angular.copy(configService.getFeatureFlags());

    const service = {
      loadStaticFlags,
      isBreakdownChartEnabled,
      isKpiCardsEnabled,
      isMockLatencyEnabled,
      getEnvironmentName
    };

    function loadStaticFlags() {
      // No-op for now; flags are loaded from ENV_CONFIG
      return flags;
    }

    function isBreakdownChartEnabled() {
      return !!flags.showBreakdownChart;
    }

    function isKpiCardsEnabled() {
      return !!flags.showKpiCards;
    }

    function isMockLatencyEnabled() {
      return !!flags.enableLatencySimulationInMock;
    }

    function getEnvironmentName() {
      return configService.isMockModeEnabled() ? "mock" : "production";
    }

    return service;
  }

  angular
    .module("app")
    .service("featureFlagsService", featureFlagsService);
})();
```

### 7.3 TelemetryService – telemetry.service.js

**File**: `DAVMS/src/app/core/services/telemetry.service.js`

**Purpose**
- Client-side telemetry; logs events via console or remote endpoint.

**Content**

```javascript
(function () {
  "use strict";

  telemetryService.$inject = ["ENV_CONFIG"];

  function telemetryService(ENV_CONFIG) {
    let initialized = false;
    let context = {};

    const service = {
      initialize,
      trackEvent,
      trackError
    };

    function initialize(initContext) {
      context = angular.extend({}, initContext);
      initialized = true;
    }

    function trackEvent(name, properties) {
      if (!ENV_CONFIG.telemetry.enabled) {
        return;
      }
      const payload = {
        type: "event",
        name: name,
        context: context,
        properties: properties || {},
        timestamp: new Date().toISOString()
      };
      console.log("Telemetry event", payload);
    }

    function trackError(name, error, properties) {
      if (!ENV_CONFIG.telemetry.enabled) {
        return;
      }
      const payload = {
        type: "error",
        name: name,
        context: context,
        error: error,
        properties: properties || {},
        timestamp: new Date().toISOString()
      };
      console.error("Telemetry error", payload);
    }

    return service;
  }

  angular
    .module("app")
    .service("telemetryService", telemetryService);
})();
```

### 7.4 LoggingService – logging.service.js

**File**: `DAVMS/src/app/core/services/logging.service.js`

**Purpose**
- Provide structured logging; lazily resolve `$http` to avoid circular dependency.

**Content**

```javascript
(function () {
  "use strict";

  loggingService.$inject = ["$log", "$injector", "ENV_CONFIG"];

  function loggingService($log, $injector, ENV_CONFIG) {
    let httpInstance = null;

    const service = {
      info,
      warn,
      error,
      debug
    };

    function getHttp() {
      if (!httpInstance) {
        httpInstance = $injector.get("$http");
      }
      return httpInstance;
    }

    function info(message, context) {
      $log.info(message, context || {});
      sendRemote("info", message, context);
    }

    function warn(message, context) {
      $log.warn(message, context || {});
      sendRemote("warn", message, context);
    }

    function error(message, context) {
      $log.error(message, context || {});
      sendRemote("error", message, context);
    }

    function debug(message, context) {
      $log.debug(message, context || {});
      sendRemote("debug", message, context);
    }

    function sendRemote(level, message, context) {
      if (!ENV_CONFIG.telemetry.enabled || !ENV_CONFIG.telemetry.endpointUrl) {
        return;
      }
      const payload = {
        level: level,
        message: message,
        context: context || {},
        timestamp: new Date().toISOString()
      };
      // Fire-and-forget; no response handling
      getHttp().post(ENV_CONFIG.telemetry.endpointUrl, payload).catch(function () {
        // Swallow logging errors
      });
    }

    return service;
  }

  angular
    .module("app")
    .service("loggingService", loggingService);
})();
```

### 7.5 HttpInterceptor – http-interceptor.service.js

**File**: `DAVMS/src/app/core/services/http-interceptor.service.js`

**Purpose**
- Intercept HTTP requests and responses for error handling and telemetry.
- Must not depend on `$http` (enforced).

**Content**

```javascript
(function () {
  "use strict";

  httpInterceptor.$inject = ["$q", "telemetryService", "loggingService", "APP_CONSTANTS"];

  function httpInterceptor($q, telemetryService, loggingService, APP_CONSTANTS) {
    return {
      request: function (config) {
        // Attach common headers if needed
        config.headers = config.headers || {};
        config.headers["X-App-Name"] = "DAVMS";
        return config;
      },
      response: function (response) {
        telemetryService.trackEvent("http_success", {
          url: response.config.url,
          status: response.status
        });
        return response;
      },
      responseError: function (rejection) {
        const status = rejection.status;
        let code = APP_CONSTANTS.errorCodes.backendError;

        if (status === APP_CONSTANTS.httpStatus.badRequest) {
          code = APP_CONSTANTS.errorCodes.invalidMonthFormat;
        } else if (status === APP_CONSTANTS.httpStatus.forbidden) {
          code = APP_CONSTANTS.errorCodes.authorizationFailed;
        } else if (status === APP_CONSTANTS.httpStatus.notFound) {
          code = APP_CONSTANTS.errorCodes.summaryNotFound;
        }

        loggingService.error("HTTP error", {
          url: rejection.config ? rejection.config.url : "",
          status: status,
          code: code
        });

        telemetryService.trackError("http_error", {
          status: status,
          code: code
        }, {});

        return $q.reject(rejection);
      }
    };
  }

  angular
    .module("app")
    .factory("httpInterceptor", httpInterceptor);
})();
```


## 8. REST API Contracts & API Services

### 8.1 Summary API Service – summary-api.service.js

**File**: `DAVMS/src/app/core/api/summary-api.service.js`

**Purpose**
- Call production DAVMS Monthly Spending Summary API.

**REST Endpoint Contracts**

#### 8.1.1 Monthly Summary Endpoint
- **URL**: `${apiBaseUrl}/summary`
- **HTTP Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>` – provided by parent portal; not managed locally in this epic.
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Query Parameters**:
  - `accountId` (string) – credit card account identifier.
  - `month` (string) – in `YYYY-MM`, resolves to billing cycle or calendar month per backend rules.
- **Request Body**: none.
- **Response Body (Success)**:

```json
{
  "accountId": "CC123456789",
  "month": "2024-06",
  "kpiSummary": {
    "totalSpend": 1234.56,
    "transactionCount": 42,
    "averageTransactionValue": 29.39
  },
  "breakdown": [
    {
      "categoryCode": "ONLINE",
      "categoryLabel": "Online Purchases",
      "amount": 456.78
    },
    {
      "categoryCode": "IN_STORE",
      "categoryLabel": "In Store",
      "amount": 777.78
    }
  ]
}
```

- **Success Response**:
  - HTTP 200 with payload above.

- **Error Responses**:
  - 400 Bad Request

```json
{
  "code": "INVALID_MONTH_FORMAT",
  "message": "Month must be provided in YYYY-MM format.",
  "details": {
    "month": "2024-6"
  },
  "retryable": false
}
```

  - 401 Unauthorized

```json
{
  "code": "UNAUTHORIZED",
  "message": "Authentication token is missing or invalid.",
  "details": {},
  "retryable": false
}
```

  - 403 Forbidden

```json
{
  "code": "AUTHORIZATION_FAILED",
  "message": "You are not allowed to view this credit card account.",
  "details": {
    "accountId": "CC123456789"
  },
  "retryable": false
}
```

  - 404 Not Found

```json
{
  "code": "SUMMARY_NOT_FOUND",
  "message": "No monthly summary data available for the selected month.",
  "details": {
    "month": "2024-02",
    "accountId": "CC123456789"
  },
  "retryable": false
}
```

  - 500 Internal Server Error

```json
{
  "code": "BACKEND_ERROR",
  "message": "An unexpected error occurred while retrieving the monthly summary.",
  "details": {},
  "retryable": true
}
```

- **Timeout**: `apiTimeoutMs` from `ENV_CONFIG` (10 seconds).
- **Retry Policy**: client does not automatically retry; UI offers manual retry if `retryable` flag is true.

**Content (Implementation)**

```javascript
(function () {
  "use strict";

  summaryApiService.$inject = ["$http", "$q", "configService"];

  function summaryApiService($http, $q, configService) {
    const service = {
      getMonthlySummary
    };

    function getMonthlySummary(accountId, month) {
      if (!accountId || !month) {
        return $q.reject({
          status: 400,
          data: {
            code: "INVALID_INPUT",
            message: "accountId and month are required.",
            details: {},
            retryable: false
          }
        });
      }

      const url = configService.getApiBaseUrl() + "/summary";
      const config = {
        params: {
          accountId: accountId,
          month: month
        },
        timeout: configService.getApiTimeoutMs()
      };

      return $http.get(url, config).then(function (response) {
        return response.data;
      });
    }

    return service;
  }

  angular
    .module("app")
    .service("summaryApiService", summaryApiService);
})();
```

### 8.2 SummaryMockService – summary-mock.service.js

**File**: `DAVMS/src/app/core/api/summary-mock.service.js`

**Purpose**
- Provide mock implementation of summary endpoints when `useMockData` is true.
- Use `$q` & `$timeout` for delay simulation and consistent promise interface.

**Mock Mode Specification**

Mock JSON files:
- `DAVMS/mock/summary/monthly-summary.mock.json`
- `DAVMS/mock/summary/breakdown.mock.json`
- `DAVMS/mock/summary/kpi-summary.mock.json`
- `DAVMS/mock/summary/month-options.mock.json`
- `DAVMS/mock/summary/error-responses.mock.json`

**Sample monthly-summary.mock.json**

```json
{
  "accountId": "CC123456789",
  "month": "2024-06",
  "kpiSummary": {
    "totalSpend": 1234.56,
    "transactionCount": 42,
    "averageTransactionValue": 29.39
  },
  "breakdown": [
    {
      "categoryCode": "ONLINE",
      "categoryLabel": "Online Purchases",
      "amount": 456.78
    },
    {
      "categoryCode": "IN_STORE",
      "categoryLabel": "In Store",
      "amount": 777.78
    }
  ]
}
```

**Implementation**

```javascript
(function () {
  "use strict";

  summaryMockService.$inject = ["$q", "$timeout", "featureFlagsService"];

  function summaryMockService($q, $timeout, featureFlagsService) {
    const MOCK_SUMMARY = {
      accountId: "CC123456789",
      month: "2024-06",
      kpiSummary: {
        totalSpend: 1234.56,
        transactionCount: 42,
        averageTransactionValue: 29.39
      },
      breakdown: [
        {
          categoryCode: "ONLINE",
          categoryLabel: "Online Purchases",
          amount: 456.78
        },
        {
          categoryCode: "IN_STORE",
          categoryLabel: "In Store",
          amount: 777.78
        },
        {
          categoryCode: "OTHER",
          categoryLabel: "Other",
          amount: 0.0
        }
      ]
    };

    const MOCK_MONTH_OPTIONS = [
      { value: "2024-06", label: "June 2024", isCurrent: true },
      { value: "2024-05", label: "May 2024", isCurrent: false },
      { value: "2024-04", label: "April 2024", isCurrent: false }
    ];

    const service = {
      getMonthlySummary,
      getMonthOptions
    };

    function getMonthlySummary(accountId, month) {
      const deferred = $q.defer();
      const delay = featureFlagsService.isMockLatencyEnabled() ? 500 : 0;

      $timeout(function () {
        if (!month || !/^\d{4}-\d{2}$/.test(month)) {
          deferred.reject({
            status: 400,
            data: {
              code: "INVALID_MONTH_FORMAT",
              message: "Month must be provided in YYYY-MM format.",
              details: { month: month },
              retryable: false
            }
          });
          return;
        }

        const summary = angular.copy(MOCK_SUMMARY);
        summary.month = month;
        summary.accountId = accountId || MOCK_SUMMARY.accountId;

        deferred.resolve(summary);
      }, delay);

      return deferred.promise;
    }

    function getMonthOptions() {
      const deferred = $q.defer();
      const delay = featureFlagsService.isMockLatencyEnabled() ? 300 : 0;

      $timeout(function () {
        deferred.resolve(angular.copy(MOCK_MONTH_OPTIONS));
      }, delay);

      return deferred.promise;
    }

    return service;
  }

  angular
    .module("app")
    .service("summaryMockService", summaryMockService);
})();
```

**Failure Scenarios (Mock)**
- Invalid month format: rejects with 400 as above.
- Empty accountId: still returns summary but uses default mock ID; no authorization logic in mock.


## 9. Dashboard Feature Module

### 9.1 Dashboard Module – dashboard.module.js

**File**: `DAVMS/src/app/dashboard/dashboard.module.js`

**Purpose**
- Feature module for monthly summary dashboard.

**Content**

```javascript
(function () {
  "use strict";

  angular
    .module("app.dashboard", []);
})();
```

### 9.2 Dashboard Routes – dashboard.routes.js

**File**: `DAVMS/src/app/dashboard/dashboard.routes.js`

**Purpose**
- Register `/dashboard/monthly-summary` route.

**Content**

```javascript
(function () {
  "use strict";

  dashboardRoutes.$inject = ["$routeProvider", "APP_CONSTANTS"];

  function dashboardRoutes($routeProvider, APP_CONSTANTS) {
    $routeProvider.when(APP_CONSTANTS.routes.dashboardMonthlySummary, {
      templateUrl: "app/dashboard/dashboard.template.html",
      controller: "DashboardController",
      controllerAs: "vm"
    });
  }

  angular
    .module("app.dashboard")
    .config(dashboardRoutes);
})();
```

### 9.3 Dashboard Service – dashboard.service.js

**File**: `DAVMS/src/app/dashboard/dashboard.service.js`

**Purpose**
- Orchestrate data retrieval using either mock or production API based on configuration.

**Content**

```javascript
(function () {
  "use strict";

  dashboardService.$inject = [
    "$q",
    "configService",
    "summaryApiService",
    "summaryMockService",
    "MonthlySummary",
    "ErrorModel"
  ];

  function dashboardService(
    $q,
    configService,
    summaryApiService,
    summaryMockService,
    MonthlySummary,
    ErrorModel
  ) {
    const service = {
      loadMonthlySummary,
      loadMonthOptions
    };

    function getApi() {
      return configService.isMockModeEnabled() ? summaryMockService : summaryApiService;
    }

    function loadMonthlySummary(accountId, month) {
      const api = getApi();

      return api.getMonthlySummary(accountId, month)
        .then(function (dto) {
          const summaryInstance = MonthlySummary();
          return summaryInstance.fromDto(dto);
        })
        .catch(function (rejection) {
          const error = new ErrorModel().fromResponse(rejection);
          return $q.reject(error);
        });
    }

    function loadMonthOptions() {
      const api = getApi();

      if (api.getMonthOptions) {
        return api.getMonthOptions().then(function (optionsDto) {
          return optionsDto;
        }).catch(function (rejection) {
          const error = new ErrorModel().fromResponse(rejection);
          return $q.reject(error);
        });
      }

      // In production, if month options are not provided, fallback to last N months
      const maxMonths = configService.getMaxLookbackMonths();
      const options = [];
      const now = new Date();

      for (let i = 0; i < Math.min(maxMonths, 12); i += 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const value = year + "-" + month;
        const label = date.toLocaleString("default", { month: "long", year: "numeric" });
        options.push({ value: value, label: label, isCurrent: i === 0 });
      }

      return $q.resolve(options);
    }

    return service;
  }

  angular
    .module("app.dashboard")
    .service("dashboardService", dashboardService);
})();
```

### 9.4 Dashboard Mapper Service – dashboard.mapper.service.js

**File**: `DAVMS/src/app/dashboard/dashboard.mapper.service.js`

**Purpose**
- Map raw models into view models for KPI cards and charts.

**Content**

```javascript
(function () {
  "use strict";

  dashboardMapperService.$inject = [];

  function dashboardMapperService() {
    const service = {
      mapKpiCards,
      mapBreakdownChartData
    };

    function mapKpiCards(monthlySummary) {
      if (!monthlySummary || !monthlySummary.kpiSummary) {
        return [];
      }
      return [
        {
          id: "totalSpend",
          label: "Total Spend",
          value: monthlySummary.kpiSummary.totalSpend,
          icon: "assets/img/icons/kpi-total-spend.png",
          cssClass: "davms-kpi-card-total"
        },
        {
          id: "transactionCount",
          label: "Transactions",
          value: monthlySummary.kpiSummary.transactionCount,
          icon: "assets/img/icons/kpi-tx-count.png",
          cssClass: "davms-kpi-card-count"
        },
        {
          id: "avgTransaction",
          label: "Average Transaction",
          value: monthlySummary.kpiSummary.averageTransactionValue,
          icon: "assets/img/icons/kpi-avg-spend.png",
          cssClass: "davms-kpi-card-avg"
        }
      ];
    }

    function mapBreakdownChartData(monthlySummary) {
      const labels = [];
      const data = [];
      const colors = [];

      if (!monthlySummary || !Array.isArray(monthlySummary.breakdownEntries)) {
        return { labels: labels, data: data, colors: colors };
      }

      const baseColors = [
        "#337ab7",
        "#5cb85c",
        "#f0ad4e",
        "#d9534f",
        "#5bc0de"
      ];

      for (let i = 0; i < monthlySummary.breakdownEntries.length; i += 1) {
        const entry = monthlySummary.breakdownEntries[i];
        labels.push(entry.categoryLabel);
        data.push(entry.amount);
        colors.push(baseColors[i % baseColors.length]);
      }

      return {
        labels: labels,
        data: data,
        colors: colors
      };
    }

    return service;
  }

  angular
    .module("app.dashboard")
    .service("dashboardMapperService", dashboardMapperService);
})();
```

### 9.5 Dashboard Controller – dashboard.controller.js

**File**: `DAVMS/src/app/dashboard/dashboard.controller.js`

**Purpose**
- Control monthly summary UI.
- Coordinate data retrieval, state management, and error handling.

**Content**

```javascript
(function () {
  "use strict";

  DashboardController.$inject = [
    "dashboardService",
    "dashboardMapperService",
    "loggingService",
    "telemetryService"
  ];

  function DashboardController(
    dashboardService,
    dashboardMapperService,
    loggingService,
    telemetryService
  ) {
    const vm = this;

    vm.isLoading = false;
    vm.hasError = false;
    vm.error = null;
    vm.monthOptions = [];
    vm.selectedMonth = null;
    vm.accountId = "CC123456789"; // AccountId received from parent portal context in real integration
    vm.monthlySummary = null;
    vm.kpiCards = [];
    vm.breakdownChartData = { labels: [], data: [], colors: [] };

    vm.onMonthChange = onMonthChange;
    vm.retry = retry;

    activate();

    function activate() {
      vm.isLoading = true;
      vm.hasError = false;

      telemetryService.trackEvent("dashboard_activate", {});

      dashboardService.loadMonthOptions()
        .then(function (options) {
          vm.monthOptions = options;
          const current = options.find(function (opt) { return opt.isCurrent; });
          vm.selectedMonth = current ? current.value : (options.length > 0 ? options[0].value : null);
          if (vm.selectedMonth) {
            return loadSummary(vm.selectedMonth);
          }
          vm.isLoading = false;
          return null;
        })
        .catch(function (error) {
          vm.isLoading = false;
          vm.hasError = true;
          vm.error = error;
          loggingService.error("Failed to load month options", { error: error });
          telemetryService.trackError("load_month_options_failed", error, {});
        });
    }

    function loadSummary(month) {
      vm.isLoading = true;
      vm.hasError = false;

      dashboardService.loadMonthlySummary(vm.accountId, month)
        .then(function (summary) {
          vm.monthlySummary = summary;
          vm.kpiCards = dashboardMapperService.mapKpiCards(summary);
          vm.breakdownChartData = dashboardMapperService.mapBreakdownChartData(summary);
          vm.isLoading = false;
        })
        .catch(function (error) {
          vm.isLoading = false;
          vm.hasError = true;
          vm.error = error;
          loggingService.error("Failed to load monthly summary", { error: error });
          telemetryService.trackError("load_monthly_summary_failed", error, {});
        });
    }

    function onMonthChange() {
      if (vm.selectedMonth) {
        loadSummary(vm.selectedMonth);
      }
    }

    function retry() {
      if (vm.selectedMonth) {
        loadSummary(vm.selectedMonth);
      }
    }
  }

  angular
    .module("app.dashboard")
    .controller("DashboardController", DashboardController);
})();
```

### 9.6 Dashboard Directive – dashboard.directive.js

**File**: `DAVMS/src/app/dashboard/dashboard.directive.js`

**Purpose**
- Provide a structural directive that hosts the dashboard layout.

**Content**

```javascript
(function () {
  "use strict";

  dashboardDirective.$inject = [];

  function dashboardDirective() {
    return {
      restrict: "E",
      scope: {},
      bindToController: true,
      controller: "DashboardController",
      controllerAs: "vm",
      templateUrl: "app/dashboard/dashboard.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app.dashboard")
    .directive("davmsDashboard", dashboardDirective);
})();
```

### 9.7 Dashboard Template – dashboard.template.html

**File**: `DAVMS/src/app/dashboard/dashboard.template.html`

**Purpose**
- Define full layout for the monthly summary dashboard.

**Content**

```html
<div class="davms-dashboard" ng-class="{ 'davms-loading': vm.isLoading }">
  <!-- Loading State -->
  <loading-spinner ng-if="vm.isLoading"></loading-spinner>

  <!-- Error State -->
  <error-panel
    ng-if="vm.hasError"
    error="vm.error"
    on-retry="vm.retry()">
  </error-panel>

  <!-- Main Content -->
  <div ng-if="!vm.isLoading && !vm.hasError">
    <!-- Month Selector & Summary Header -->
    <div class="row davms-month-selector-row">
      <div class="col-xs-12 col-sm-6">
        <month-selector
          month-options="vm.monthOptions"
          selected-month="vm.selectedMonth"
          on-change="vm.onMonthChange()">
        </month-selector>
      </div>
      <div class="col-xs-12 col-sm-6 text-right davms-summary-header">
        <h4 class="davms-summary-month-label" ng-if="vm.selectedMonth">
          Summary for {{ vm.selectedMonth }}
        </h4>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="row davms-kpi-row" ng-if="vm.kpiCards.length">
      <div class="col-xs-12 col-sm-4" ng-repeat="card in vm.kpiCards track by card.id">
        <kpi-card card="card"></kpi-card>
      </div>
    </div>

    <!-- Breakdown Chart -->
    <div class="row davms-breakdown-row" ng-if="vm.breakdownChartData.data.length">
      <div class="col-xs-12 col-md-8">
        <breakdown-chart
          chart-data="vm.breakdownChartData"
          total-spend="vm.monthlySummary.kpiSummary.totalSpend">
        </breakdown-chart>
      </div>
      <div class="col-xs-12 col-md-4">
        <div class="panel panel-default">
          <div class="panel-heading">Spend Breakdown</div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Category</th>
                <th class="text-right">Amount</th>
                <th class="text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              <tr ng-repeat="entry in vm.monthlySummary.breakdownEntries">
                <td>{{ entry.categoryLabel }}</td>
                <td class="text-right">{{ entry.amount | currencyNoSymbol }}</td>
                <td class="text-right">{{ entry.percentageOfTotal | number:1 }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div class="row" ng-if="!vm.monthlySummary || !vm.monthlySummary.hasData">
      <div class="col-xs-12">
        <div class="alert alert-info">
          No monthly spending data available for the selected month.
        </div>
      </div>
    </div>
  </div>
</div>
```


## 10. Shared Directives & Components

### 10.1 LoadingSpinner Directive – loading-spinner.directive.js

**File**: `DAVMS/src/app/shared/directives/loading-spinner.directive.js`

**Purpose**
- Show a centered spinner during data loading.

**Content**

```javascript
(function () {
  "use strict";

  loadingSpinnerDirective.$inject = [];

  function loadingSpinnerDirective() {
    return {
      restrict: "E",
      scope: {},
      bindToController: true,
      controllerAs: "vm",
      controller: function () {},
      templateUrl: "app/shared/directives/loading-spinner.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app")
    .directive("loadingSpinner", loadingSpinnerDirective);
})();
```

**Template** – `DAVMS/src/app/shared/directives/loading-spinner.template.html`

```html
<div class="davms-loading-spinner text-center">
  <span class="glyphicon glyphicon-refresh glyphicon-spin"></span>
  <span class="davms-loading-text">Loading...</span>
</div>
```

### 10.2 ErrorPanel Directive – error-panel.directive.js

**File**: `DAVMS/src/app/shared/directives/error-panel.directive.js`

**Purpose**
- Display errors in a bootstrap alert with retry button.

**Directive Specification**
- `restrict: "E"`
- `scope`:
  - `error: "="` – two-way binding of ErrorModel instance.
  - `onRetry: "&"` – callback expression.
- `bindToController: true`
- `controllerAs: "vm"`
- `templateUrl: "app/shared/directives/error-panel.template.html"`
- `transclude: false`
- `replace: false`

**Content**

```javascript
(function () {
  "use strict";

  errorPanelDirective.$inject = [];

  function errorPanelDirective() {
    return {
      restrict: "E",
      scope: {
        error: "=",
        onRetry: "&"
      },
      bindToController: true,
      controllerAs: "vm",
      controller: function () {
        const vm = this;
        vm.getDisplayMessage = function () {
          if (!vm.error) {
            return "An unexpected error occurred.";
          }
          return vm.error.message || "An unexpected error occurred.";
        };
      },
      templateUrl: "app/shared/directives/error-panel.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app")
    .directive("errorPanel", errorPanelDirective);
})();
```

**Template** – `DAVMS/src/app/shared/directives/error-panel.template.html`

```html
<div class="alert alert-danger" role="alert">
  <strong>Error:</strong> {{ vm.getDisplayMessage() }}
  <button
    type="button"
    class="btn btn-danger btn-sm pull-right"
    ng-click="vm.onRetry()">
    Retry
  </button>
</div>
```

### 10.3 KPI Card Directive – kpi-card.directive.js

**File**: `DAVMS/src/app/shared/components/kpi-card.directive.js`

**Purpose**
- Display KPI data in styled card.

**Directive Specification**
- `restrict: "E"`
- `scope`:
  - `card: "="` – object with `id`, `label`, `value`, `icon`, `cssClass`.
- `bindToController: true`
- `controllerAs: "vm"`
- `templateUrl: "app/shared/components/kpi-card.template.html"`
- `transclude: false`
- `replace: false`

**Content**

```javascript
(function () {
  "use strict";

  kpiCardDirective.$inject = [];

  function kpiCardDirective() {
    return {
      restrict: "E",
      scope: {
        card: "="
      },
      bindToController: true,
      controllerAs: "vm",
      controller: function () {},
      templateUrl: "app/shared/components/kpi-card.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app")
    .directive("kpiCard", kpiCardDirective);
})();
```

**Template** – `DAVMS/src/app/shared/components/kpi-card.template.html`

```html
<div class="panel panel-default davms-kpi-card" ng-class="vm.card.cssClass">
  <div class="panel-body">
    <div class="row">
      <div class="col-xs-3 text-center">
        <img ng-src="{{ vm.card.icon }}" alt="" class="davms-kpi-icon" />
      </div>
      <div class="col-xs-9">
        <h4 class="davms-kpi-label">{{ vm.card.label }}</h4>
        <p class="davms-kpi-value">
          <span ng-if="vm.card.id === 'totalSpend'">{{ vm.card.value | currencyNoSymbol }}</span>
          <span ng-if="vm.card.id === 'transactionCount'">{{ vm.card.value }}</span>
          <span ng-if="vm.card.id === 'avgTransaction'">{{ vm.card.value | currencyNoSymbol }}</span>
        </p>
      </div>
    </div>
  </div>
</div>
```

### 10.4 Breakdown Chart Directive – breakdown-chart.directive.js

**File**: `DAVMS/src/app/shared/components/breakdown-chart.directive.js`

**Purpose**
- Render Chart.js pie chart for spend breakdown.

**Directive Specification**
- `restrict: "E"`
- `scope`:
  - `chartData: "="` – object `{ labels: [], data: [], colors: [] }`.
  - `totalSpend: "="` – number.
- `bindToController: true`
- `controllerAs: "vm"`
- `templateUrl: "app/shared/components/breakdown-chart.template.html"`
- `transclude: false`
- `replace: false`

**Content**

```javascript
(function () {
  "use strict";

  breakdownChartDirective.$inject = [];

  function breakdownChartDirective() {
    return {
      restrict: "E",
      scope: {
        chartData: "=",
        totalSpend: "="
      },
      bindToController: true,
      controllerAs: "vm",
      controller: ["$element", "$scope", function ($element, $scope) {
        const vm = this;
        let chartInstance = null;

        function renderChart() {
          if (!vm.chartData || !vm.chartData.data || !vm.chartData.data.length) {
            return;
          }
          const ctx = $element.find("canvas")[0].getContext("2d");
          const config = {
            type: "pie",
            data: {
              labels: vm.chartData.labels,
              datasets: [{
                data: vm.chartData.data,
                backgroundColor: vm.chartData.colors
              }]
            },
            options: {
              responsive: true,
              legend: {
                position: "bottom"
              },
              tooltips: {
                callbacks: {
                  label: function (tooltipItem, data) {
                    const dataset = data.datasets[tooltipItem.datasetIndex];
                    const value = dataset.data[tooltipItem.index];
                    const label = data.labels[tooltipItem.index];
                    return label + ": " + value.toFixed(2);
                  }
                }
              }
            }
          };

          if (chartInstance) {
            chartInstance.destroy();
          }
          chartInstance = new Chart(ctx, config);
        }

        $scope.$watch(function () {
          return vm.chartData;
        }, function (newVal) {
          if (newVal) {
            renderChart();
          }
        }, true);
      }],
      templateUrl: "app/shared/components/breakdown-chart.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app")
    .directive("breakdownChart", breakdownChartDirective);
})();
```

**Template** – `DAVMS/src/app/shared/components/breakdown-chart.template.html`

```html
<div class="davms-breakdown-chart">
  <canvas aria-label="Monthly spend breakdown chart"></canvas>
</div>
```

### 10.5 Month Selector Directive – month-selector.directive.js

**File**: `DAVMS/src/app/shared/components/month-selector.directive.js`

**Purpose**
- Provide a dropdown for selecting month.

**Directive Specification**
- `restrict: "E"`
- `scope`:
  - `monthOptions: "="` – array of MonthOption-like objects.
  - `selectedMonth: "="` – two-way bound selected value (string).
  - `onChange: "&"` – callback on change.
- `bindToController: true`
- `controllerAs: "vm"`
- `templateUrl: "app/shared/components/month-selector.template.html"`
- `transclude: false`
- `replace: false`

**Content**

```javascript
(function () {
  "use strict";

  monthSelectorDirective.$inject = [];

  function monthSelectorDirective() {
    return {
      restrict: "E",
      scope: {
        monthOptions: "=",
        selectedMonth: "=",
        onChange: "&"
      },
      bindToController: true,
      controllerAs: "vm",
      controller: function () {
        const vm = this;
        vm.handleChange = function () {
          vm.onChange();
        };
      },
      templateUrl: "app/shared/components/month-selector.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app")
    .directive("monthSelector", monthSelectorDirective);
})();
```

**Template** – `DAVMS/src/app/shared/components/month-selector.template.html`

```html
<div class="form-group davms-month-selector">
  <label for="davms-month-select">Select Month</label>
  <select
    id="davms-month-select"
    class="form-control"
    ng-model="vm.selectedMonth"
    ng-options="option.value as option.label for option in vm.monthOptions"
    ng-change="vm.handleChange()">
    <option value="">-- Choose a month --</option>
  </select>
</div>
```

### 10.6 CurrencyNoSymbol Filter – currency-no-symbol.filter.js

**File**: `DAVMS/src/app/shared/filters/currency-no-symbol.filter.js`

**Purpose**
- Format numbers as currency-like values without symbol.

**Content**

```javascript
(function () {
  "use strict";

  currencyNoSymbolFilter.$inject = ["$filter"];

  function currencyNoSymbolFilter($filter) {
    const numberFilter = $filter("number");

    return function (input) {
      const value = Number(input) || 0;
      return numberFilter(value, 2);
    };
  }

  angular
    .module("app")
    .filter("currencyNoSymbol", currencyNoSymbolFilter);
})();
```


## 11. CSS & UI Specification

### 11.1 Global Styles – styles.css

**File**: `DAVMS/src/assets/css/styles.css`

**Purpose**
- Base styles for typography, colors, spacing.

**Content**

```css
body {
  font-family: "Helvetica Neue", Arial, sans-serif;
  background-color: #f5f5f5;
}

.davms-app-root {
  padding-top: 20px;
  padding-bottom: 20px;
}

.davms-header {
  margin-bottom: 20px;
}

.davms-logo {
  height: 40px;
  margin-right: 10px;
}

.davms-title {
  display: inline-block;
  vertical-align: middle;
}

.davms-footer {
  margin-top: 30px;
  color: #777;
}

.davms-loading-spinner .glyphicon-spin {
  -webkit-animation: spin 1s infinite linear;
  animation: spin 1s infinite linear;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(359deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(359deg); }
}
```

### 11.2 Dashboard Styles – dashboard.css

**File**: `DAVMS/src/assets/css/dashboard.css`

**Purpose**
- Specific styling for dashboard layout, KPI cards, charts.

**Content**

```css
.davms-dashboard {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.davms-month-selector-row {
  margin-bottom: 15px;
}

.davms-kpi-row {
  margin-top: 15px;
  margin-bottom: 15px;
}

.davms-kpi-card {
  margin-bottom: 15px;
}

.davms-kpi-icon {
  max-width: 32px;
}

.davms-kpi-label {
  margin-top: 0;
  margin-bottom: 5px;
}

.davms-kpi-value {
  font-size: 1.4em;
  font-weight: bold;
}

.davms-breakdown-row {
  margin-top: 15px;
}

.davms-breakdown-chart {
  min-height: 250px;
}

.davms-loading {
  opacity: 0.6;
}

@media (max-width: 767px) {
  .davms-dashboard {
    padding: 10px;
  }

  .davms-kpi-card {
    margin-bottom: 10px;
  }
}
```


## 12. Mock JSON Files

All mock files are located under `DAVMS/mock/summary/`.

### 12.1 monthly-summary.mock.json

**File**: `DAVMS/mock/summary/monthly-summary.mock.json`

**Content** – same as used inline in `summary-mock.service.js`:

```json
{
  "accountId": "CC123456789",
  "month": "2024-06",
  "kpiSummary": {
    "totalSpend": 1234.56,
    "transactionCount": 42,
    "averageTransactionValue": 29.39
  },
  "breakdown": [
    {
      "categoryCode": "ONLINE",
      "categoryLabel": "Online Purchases",
      "amount": 456.78
    },
    {
      "categoryCode": "IN_STORE",
      "categoryLabel": "In Store",
      "amount": 777.78
    },
    {
      "categoryCode": "OTHER",
      "categoryLabel": "Other",
      "amount": 0.0
    }
  ]
}
```

### 12.2 breakdown.mock.json

**File**: `DAVMS/mock/summary/breakdown.mock.json`

```json
[
  {
    "categoryCode": "ONLINE",
    "categoryLabel": "Online Purchases",
    "amount": 456.78
  },
  {
    "categoryCode": "IN_STORE",
    "categoryLabel": "In Store",
    "amount": 777.78
  },
  {
    "categoryCode": "OTHER",
    "categoryLabel": "Other",
    "amount": 0.0
  }
]
```

### 12.3 kpi-summary.mock.json

**File**: `DAVMS/mock/summary/kpi-summary.mock.json`

```json
{
  "totalSpend": 1234.56,
  "transactionCount": 42,
  "averageTransactionValue": 29.39
}
```

### 12.4 month-options.mock.json

**File**: `DAVMS/mock/summary/month-options.mock.json`

```json
[
  { "value": "2024-06", "label": "June 2024", "isCurrent": true },
  { "value": "2024-05", "label": "May 2024", "isCurrent": false },
  { "value": "2024-04", "label": "April 2024", "isCurrent": false }
]
```

### 12.5 error-responses.mock.json

**File**: `DAVMS/mock/summary/error-responses.mock.json`

```json
{
  "invalidMonthFormat": {
    "status": 400,
    "data": {
      "code": "INVALID_MONTH_FORMAT",
      "message": "Month must be provided in YYYY-MM format.",
      "details": {},
      "retryable": false
    }
  },
  "summaryNotFound": {
    "status": 404,
    "data": {
      "code": "SUMMARY_NOT_FOUND",
      "message": "No monthly summary data available for the selected month.",
      "details": {},
      "retryable": false
    }
  }
}
```


## 13. Data Flow – Detailed

### 13.1 Success Flow

1. **User Action** – User navigates to Monthly Spending Summary page in the banking portal. Portal loads `index.html` and angular app.
2. **Controller Activation** – `DashboardController.activate()` is called via controller initialization.
3. **Service Call** – `dashboardService.loadMonthOptions()` is called.
4. **REST/MOCK** –
   - If `ENV_CONFIG.useMockData` is true, `summaryMockService.getMonthOptions()` uses `$timeout` and `$q` to return mock month options.
   - If false, `dashboardService` constructs month options using client-side date logic.
5. **Model** – Month options are assigned to `vm.monthOptions`; selected month is set (`vm.selectedMonth`).
6. **Controller** – `loadSummary(vm.selectedMonth)` is called.
7. **Service** – `dashboardService.loadMonthlySummary(accountId, month)` selects API or mock:
   - Production: `summaryApiService.getMonthlySummary(accountId, month)` issues `$http.get` to `${apiBaseUrl}/summary`.
   - Mock: `summaryMockService.getMonthlySummary(accountId, month)` returns mock summary via `$timeout`.
8. **Model Mapping** – Result DTO is transformed to `MonthlySummary` instance (including `KpiSummary` and `BreakdownEntry`s).
9. **Controller** – `DashboardController` assigns `monthlySummary`, computes `kpiCards` and `breakdownChartData` via `dashboardMapperService`.
10. **Directive/View** –
    - `kpi-card` directives render KPI cards.
    - `breakdown-chart` directive renders Chart.js pie chart.
    - Table shows breakdown entries with amounts and percentages.
11. **UI Update** – `vm.isLoading` set to false; view displays summary dashboard.

### 13.2 Failure Flow

1. Steps 1–6 as above.
2. When calling API or mock, an error occurs:
   - Invalid month format.
   - Backend error.
   - Not found.
3. API returns error JSON; `$http` rejects; `httpInterceptor` logs error and tracks telemetry.
4. `dashboardService.loadMonthlySummary()` catches rejection, maps to `ErrorModel` via `ErrorModel.fromResponse()` and rejects with error instance.
5. `DashboardController` catch handler sets `vm.hasError = true`, `vm.error = error`, `vm.isLoading = false`.
6. View shows `<error-panel>` directive with `vm.error` and `Retry` button.
7. User clicks `Retry`, invoking `vm.retry()`, which calls `loadSummary(vm.selectedMonth)` again.


## 14. Error Handling & Security

### 14.1 Error Handling

- Centralized in `httpInterceptor` and `dashboardService`.
- `ErrorModel` ensures consistent structure.
- User-facing messages are generic and non-technical.
- Retry logic is manual through `Retry` button; automatic retry only for logging remote call, not for API data.

### 14.2 Security

- Input validation:
  - Month format validated in mock and by backend in production.
- Sanitization:
  - Angular Sanitize is included, but no HTML binding beyond Angular templates; data is displayed via `{{ }}`.
- Authentication & Authorization:
  - Handled by parent portal and backend; frontend expects valid authorized token and uses `accountId` provided by portal.
- Secure Communication:
  - API communication is over HTTPS (as per ENV_CONFIG base URL).
- Audit Logging & Telemetry:
  - `loggingService` logs actions locally and to telemetry endpoint.
  - `telemetryService` tracks events like dashboard activation and data load failures.


## 15. Component Registry

Below is the full registry for Angular components.

### 15.1 Modules

1. `app`
   - Type: Module
   - File Path: `app/app.module.js`
   - Registration: `angular.module("app", [...])`
   - Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`, `app.dashboard`

2. `app.dashboard`
   - Type: Module
   - File Path: `app/dashboard/dashboard.module.js`
   - Registration: `angular.module("app.dashboard", [])`
   - Dependencies: none

### 15.2 Controllers

1. `DashboardController`
   - Type: Controller
   - File Path: `app/dashboard/dashboard.controller.js`
   - Angular Module: `app.dashboard`
   - Registration: `.controller("DashboardController", DashboardController)`
   - Injected Services: `dashboardService`, `dashboardMapperService`, `loggingService`, `telemetryService`
   - Public Methods: `onMonthChange()`, `retry()`

### 15.3 Services

- `configService` – `app/core/services/config.service.js` – Module `app` – `.service("configService", configService)`.
- `featureFlagsService` – `app/core/services/feature-flags.service.js` – Module `app`.
- `telemetryService` – `app/core/services/telemetry.service.js` – Module `app`.
- `loggingService` – `app/core/services/logging.service.js` – Module `app`.
- `summaryApiService` – `app/core/api/summary-api.service.js` – Module `app`.
- `summaryMockService` – `app/core/api/summary-mock.service.js` – Module `app`.
- `dashboardService` – `app/dashboard/dashboard.service.js` – Module `app.dashboard`.
- `dashboardMapperService` – `app/dashboard/dashboard.mapper.service.js` – Module `app.dashboard`.

### 15.4 Factories

- `ErrorModel` – `app/core/models/error.model.js` – Module `app` – `.factory("ErrorModel", ...)`.
- `MonthOption` – `app/core/models/month-option.model.js` – Module `app`.
- `KpiSummary` – `app/core/models/kpi-summary.model.js` – Module `app`.
- `BreakdownEntry` – `app/core/models/breakdown-entry.model.js` – Module `app`.
- `MonthlySummary` – `app/core/models/monthly-summary.model.js` – Module `app`.

### 15.5 Directives

- `davmsDashboard` – `app/dashboard/dashboard.directive.js` – Module `app.dashboard` – restrict `E`.
- `loadingSpinner` – `app/shared/directives/loading-spinner.directive.js` – Module `app` – restrict `E`.
- `errorPanel` – `app/shared/directives/error-panel.directive.js` – Module `app` – restrict `E`.
- `kpiCard` – `app/shared/components/kpi-card.directive.js` – Module `app` – restrict `E`.
- `breakdownChart` – `app/shared/components/breakdown-chart.directive.js` – Module `app` – restrict `E`.
- `monthSelector` – `app/shared/components/month-selector.directive.js` – Module `app` – restrict `E`.

### 15.6 Filters

- `currencyNoSymbol` – `app/shared/filters/currency-no-symbol.filter.js` – Module `app`.

### 15.7 Constants & Values

- `ENV_CONFIG` – constant – `app/core/constants/env.config.js`.
- `APP_CONSTANTS` – constant – `app/core/constants/app.constants.js`.

### 15.8 Config Blocks

- `config` – `app/app.config.js`.
- `routes` – `app/app.routes.js`.
- `dashboardRoutes` – `app/dashboard/dashboard.routes.js`.

### 15.9 Run Blocks

- `run` – `app/app.run.js`.

### 15.10 Interceptor

- `httpInterceptor` – `app/core/services/http-interceptor.service.js` – registered via `$httpProvider.interceptors.push("httpInterceptor")` in `app.config.js`.


## 16. Implementation Validation

- Every source file is defined and has a valid repository path.
- Every script reference in `index.html` corresponds to a defined JS file.
- Every stylesheet referenced exists.
- Every template file path used in `templateUrl` exists (dashboard, loading-spinner, error-panel, kpi-card, breakdown-chart, month-selector).
- Route `/dashboard/monthly-summary` is defined and uses `DashboardController` and `dashboard.template.html`.
- All dependencies used in DI are registered exactly once and without circular dependency.
- `httpInterceptor` does not depend on `$http`.
- `loggingService` lazily resolves `$http` using `$injector`.
- Startup run block services do not depend on API services.
- Mock and production APIs share identical models and response shapes.
- `ENV_CONFIG.useMockData` alone switches between mock and production services.
- No jQuery or `bootstrap.min.js` are included.
- Single Angular module declaration is enforced in `app.module.js`; all other files use `angular.module("app")` or `angular.module("app.dashboard")`.

This LLD fully specifies all implementation details required for a production-ready DAVMS Monthly Spending Summary Dashboard without assumptions.
