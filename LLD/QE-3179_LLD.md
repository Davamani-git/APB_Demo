# Low-Level Design (LLD) – QE-3179 – DAVMS Monthly Spending Summary Dashboard

> This LLD is the **single source of truth** for generating a complete runnable AngularJS 1.7.9 application for the DAVMS Monthly Spending Summary Dashboard. The Code Generation Agent must implement the application **exactly** as specified here, without adding assumptions.

---
## 1. Application Overview

### 1.1 Epic & Scope Mapping
- **Epic ID**: QE-3179
- **Feature Name**: DAVMS Monthly Spending Summary Dashboard
- **Primary Purpose**: Provide authenticated credit card customers an at-a-glance monthly spending summary, KPIs, and basic breakdown for a selected month.
- **In-scope (must be implemented)**:
  1. Monthly total credit card spend calculation.
  2. Monthly summary KPIs (total spend, number of transactions, average transaction amount).
  3. Visual representation of monthly spend (summary cards + basic chart).
  4. Month selection control to view a specific month’s summary.
  5. Basic breakdown of spend suitable as an entry point into deeper insights (coarse categories only).
- **Explicitly out-of-scope (must NOT be implemented)**:
  - Non-credit-card products.
  - Transaction editing, dispute workflows, tagging, notes, or transaction-level management.
  - Any ability to modify transactions; only read-only dashboards.

### 1.2 Technology Stack (Fixed)
- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript ES6 (transpilation not required; browser support Chrome / Edge)
  - AngularJS 1.7.9
  - Angular Route 1.7.9
  - Angular Animate 1.7.9
  - Angular Sanitize 1.7.9
  - Angular UI Bootstrap 2.5.6
  - Bootstrap 3.4.1
- **Architecture**:
  - AngularJS MVC
  - Single Page Application (SPA)
  - REST APIs
  - Dependency Injection
  - ControllerAs syntax
  - IIFE module pattern
- **Runtime**:
  - $http
  - $q
  - $timeout
  - Promise-based asynchronous programming
- **Browser Support**:
  - Latest Chrome
  - Latest Microsoft Edge

No framework upgrades or replacements are allowed.

### 1.3 External Libraries & CDN URLs (index.html only)
All external libraries are loaded from CDN. **No local copies** are generated unless explicitly defined below.

**Stylesheets (load in this order):**
1. Bootstrap CSS 3.4.1
   - `https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css`
2. Application main CSS
   - `src/css/main.css`
3. Dashboard feature CSS
   - `src/css/monthly-summary.css`

**Scripts (load in this order):**
1. AngularJS core 1.7.9
   - `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js`
2. Angular Route 1.7.9
   - `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js`
3. Angular Animate 1.7.9
   - `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js`
4. Angular Sanitize 1.7.9
   - `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js`
5. Angular UI Bootstrap 2.5.6
   - `https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js`
6. Bootstrap JS 3.4.1
   - `https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js`
7. Application scripts (in strict order):
   1. `src/app/app.module.js` (declares root Angular module using array syntax)
   2. `src/app/app.config.js` (route, HTTP, and ENV config)
   3. `src/app/app.run.js` (run block, startup wiring)
   4. `src/app/core/constants/env-constants.js`
   5. `src/app/core/models/error-model.js`
   6. `src/app/core/models/summary-model.js`
   7. `src/app/core/models/breakdown-model.js`
   8. `src/app/core/models/month-context-model.js`
   9. `src/app/core/services/logging.service.js`
   10. `src/app/core/services/config.service.js`
   11. `src/app/core/services/env-config.service.js`
   12. `src/app/core/services/http-interceptor.service.js`
   13. `src/app/core/services/error-mapping.service.js`
   14. `src/app/core/services/telemetry.service.js`
   15. `src/app/core/services/month-selection.service.js`
   16. `src/app/core/services/kpi.service.js`
   17. `src/app/core/services/breakdown.service.js`
   18. `src/app/core/services/summary-api.service.js`
   19. `src/app/core/services/summary-mock.service.js`
   20. `src/app/features/monthly-summary/monthly-summary.controller.js`
   21. `src/app/features/monthly-summary/monthly-summary.directive.js`
   22. `src/app/features/monthly-summary/monthly-summary-filters.js`

No path such as `assets/js/angular.min.js` or `assets/css/bootstrap.min.css` may be referenced.

---
## 2. Application Structure & Files

### 2.1 Folder Hierarchy
```text
APB_Demo/
  index.html
  src/
    app/
      app.module.js
      app.config.js
      app.run.js
      core/
        constants/
          env-constants.js
        models/
          error-model.js
          summary-model.js
          breakdown-model.js
          month-context-model.js
        services/
          logging.service.js
          config.service.js
          env-config.service.js
          http-interceptor.service.js
          error-mapping.service.js
          telemetry.service.js
          month-selection.service.js
          kpi.service.js
          breakdown.service.js
          summary-api.service.js
          summary-mock.service.js
      features/
        monthly-summary/
          monthly-summary.controller.js
          monthly-summary.directive.js
          monthly-summary-filters.js
          monthly-summary.template.html
          monthly-summary-empty.template.html
          monthly-summary-error.template.html
    css/
      main.css
      monthly-summary.css
```

Every file listed must exist and be generated.

### 2.2 index.html (Bootstrapping & Layout)

**File Path**: `index.html`

**Responsibilities**:
- Bootstrap AngularJS app.
- Define root layout and `ng-view` container.
- Load all stylesheets and scripts in correct order.

**Content Specification (complete HTML):**
```html
<!DOCTYPE html>
<html lang="en" ng-app="davmsApp">
<head>
  <meta charset="UTF-8">
  <title>DAVMS Monthly Spending Summary Dashboard</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <link rel="stylesheet" href="src/css/main.css">
  <link rel="stylesheet" href="src/css/monthly-summary.css">
</head>
<body>
  <div class="container davms-root-container">
    <header class="davms-header">
      <h1 class="davms-title">Monthly Spending Summary</h1>
    </header>

    <!-- Primary view container -->
    <div ng-view class="davms-view-container"></div>
  </div>

  <!-- Scripts: AngularJS core and modules -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

  <!-- Application scripts (order is critical) -->
  <script src="src/app/app.module.js"></script>
  <script src="src/app/app.config.js"></script>
  <script src="src/app/app.run.js"></script>

  <script src="src/app/core/constants/env-constants.js"></script>

  <script src="src/app/core/models/error-model.js"></script>
  <script src="src/app/core/models/summary-model.js"></script>
  <script src="src/app/core/models/breakdown-model.js"></script>
  <script src="src/app/core/models/month-context-model.js"></script>

  <script src="src/app/core/services/logging.service.js"></script>
  <script src="src/app/core/services/config.service.js"></script>
  <script src="src/app/core/services/env-config.service.js"></script>
  <script src="src/app/core/services/http-interceptor.service.js"></script>
  <script src="src/app/core/services/error-mapping.service.js"></script>
  <script src="src/app/core/services/telemetry.service.js"></script>
  <script src="src/app/core/services/month-selection.service.js"></script>
  <script src="src/app/core/services/kpi.service.js"></script>
  <script src="src/app/core/services/breakdown.service.js"></script>
  <script src="src/app/core/services/summary-api.service.js"></script>
  <script src="src/app/core/services/summary-mock.service.js"></script>

  <script src="src/app/features/monthly-summary/monthly-summary.controller.js"></script>
  <script src="src/app/features/monthly-summary/monthly-summary.directive.js"></script>
  <script src="src/app/features/monthly-summary/monthly-summary-filters.js"></script>
</body>
</html>
```

---
## 3. Angular Application Bootstrap

### 3.1 Root Module Declaration

**File**: `src/app/app.module.js`

**Module Name**: `davmsApp`

**Responsibilities**:
- Declare the single root Angular module using array syntax (the only module declaration with dependency array).
- Register core Angular dependencies.

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  angular.module('davmsApp', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap'
  ]);
})();
```

- All other files must use `angular.module('davmsApp')` **getter syntax only** (no array).

### 3.2 App Config (Routes, HTTP, Environment)

**File**: `src/app/app.config.js`

**Type**: Config block + HTTP interceptor registration.

**Responsibilities**:
- Configure SPA routes (`$routeProvider`).
- Configure `$httpProvider` to use the custom HTTP interceptor.
- Configure ENV-specific base API URL and `useMockData` behavior via `EnvConfigService` + constant.

**Routes**:
- **Default route** `/monthly-summary`:
  - `templateUrl`: `src/app/features/monthly-summary/monthly-summary.template.html`
  - `controller`: `MonthlySummaryController`
  - `controllerAs`: `vm`

- **Fallback route**: redirect all unknown routes to `/monthly-summary`.

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];

  function config($routeProvider, $locationProvider, $httpProvider) {
    // Route configuration
    $routeProvider
      .when('/monthly-summary', {
        templateUrl: 'src/app/features/monthly-summary/monthly-summary.template.html',
        controller: 'MonthlySummaryController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/monthly-summary'
      });

    // Optional: HTML5 mode disabled to keep URLs simple for SPA
    $locationProvider.html5Mode(false);

    // HTTP interceptor registration
    $httpProvider.interceptors.push('HttpInterceptorService');
  }

  angular.module('davmsApp')
    .config(config);
})();
```

### 3.3 App Run Block

**File**: `src/app/app.run.js`

**Type**: Run block.

**Responsibilities**:
- Initialize telemetry.
- Log application startup.
- Ensure ENV configuration is loaded.

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  run.$inject = ['LoggingService', 'TelemetryService', 'EnvConfigService'];

  function run(LoggingService, TelemetryService, EnvConfigService) {
    EnvConfigService.initialize();
    LoggingService.info('DAVMS Monthly Spending Summary Dashboard application started.');
    TelemetryService.trackEvent('app_start', { feature: 'monthly_summary_dashboard' });
  }

  angular.module('davmsApp')
    .run(run);
})();
```

---
## 4. Configuration & Constants

### 4.1 ENV_CONFIG Constant

**File**: `src/app/core/constants/env-constants.js`

**Name**: `ENV_CONFIG`

**Type**: Angular constant.

**Responsibilities**:
- Define environment configuration for API access and feature flags.
- Support `Mock Mode` and `Production Mode` by toggling only `useMockData`.

**Properties**:
- `apiBaseUrl: string` – Base URL for production Summary API.
- `apiTimeoutMs: number` – Default HTTP timeout in milliseconds.
- `maxLookbackMonths: number` – Maximum allowed months back from current.
- `useMockData: boolean` – Whether to use mock services (default `true`).
- `featureFlags: object`:
  - `enableBreakdownChart: boolean` – Enable breakdown chart component.
  - `enableAvgTransactionKpi: boolean` – Include average transaction value KPI.
- `telemetry: object`:
  - `enabled: boolean` – Turn telemetry on/off.
  - `endpointUrl: string` – Telemetry collection endpoint (mock string).

**Default Values** (Mock Mode by default):
```javascript
(function () {
  'use strict';

  angular.module('davmsApp')
    .constant('ENV_CONFIG', {
      apiBaseUrl: 'https://api.bank.example.com/davms',
      apiTimeoutMs: 8000,
      maxLookbackMonths: 12,
      useMockData: true,
      featureFlags: {
        enableBreakdownChart: true,
        enableAvgTransactionKpi: true
      },
      telemetry: {
        enabled: true,
        endpointUrl: 'https://telemetry.bank.example.com/events'
      }
    });
})();
```

**Mock vs Production Mode Behavior**:
- When `ENV_CONFIG.useMockData === true`:
  - `SummaryApiService` internally delegates to `SummaryMockService` and does **not** call real HTTP endpoints.
- When `ENV_CONFIG.useMockData === false`:
  - `SummaryApiService` uses `$http` to call the REST API at `ENV_CONFIG.apiBaseUrl`.

Switching mode requires **only** changing `ENV_CONFIG.useMockData`.

### 4.2 ConfigService

**File**: `src/app/core/services/config.service.js`

**Type**: Service.

**Responsibilities**:
- Provide a simple interface to `ENV_CONFIG` and derive configuration values.

**Public Methods**:
- `getEnvConfig(): ENV_CONFIG`
- `isMockMode(): boolean`
- `getApiBaseUrl(): string`
- `getApiTimeoutMs(): number`
- `getMaxLookbackMonths(): number`
- `getFeatureFlags(): object`

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  ConfigService.$inject = ['ENV_CONFIG'];

  function ConfigService(ENV_CONFIG) {
    const service = {
      getEnvConfig,
      isMockMode,
      getApiBaseUrl,
      getApiTimeoutMs,
      getMaxLookbackMonths,
      getFeatureFlags
    };
    return service;

    function getEnvConfig() { return ENV_CONFIG; }
    function isMockMode() { return !!ENV_CONFIG.useMockData; }
    function getApiBaseUrl() { return ENV_CONFIG.apiBaseUrl; }
    function getApiTimeoutMs() { return ENV_CONFIG.apiTimeoutMs; }
    function getMaxLookbackMonths() { return ENV_CONFIG.maxLookbackMonths; }
    function getFeatureFlags() { return ENV_CONFIG.featureFlags; }
  }

  angular.module('davmsApp')
    .service('ConfigService', ConfigService);
})();
```

### 4.3 EnvConfigService

**File**: `src/app/core/services/env-config.service.js`

**Type**: Service.

**Responsibilities**:
- Provide environment-level initialization (if needed in future epics).
- For this epic, it simply exposes `ENV_CONFIG` and logs mode.

**Public Methods**:
- `initialize(): void`
- `isMockMode(): boolean`

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  EnvConfigService.$inject = ['ENV_CONFIG', 'LoggingService'];

  function EnvConfigService(ENV_CONFIG, LoggingService) {
    const service = {
      initialize,
      isMockMode
    };
    return service;

    function initialize() {
      const mode = ENV_CONFIG.useMockData ? 'MOCK' : 'PRODUCTION';
      LoggingService.info('EnvConfigService initialized in ' + mode + ' mode.');
    }

    function isMockMode() {
      return !!ENV_CONFIG.useMockData;
    }
  }

  angular.module('davmsApp')
    .service('EnvConfigService', EnvConfigService);
})();
```

---
## 5. Models

### 5.1 ErrorModel

**File**: `src/app/core/models/error-model.js`

**Type**: Factory returning constructor.

**Purpose**: Represent errors from REST API or client-side failures.

**Properties**:
- `code: string` – Machine-readable error code (e.g., `ERR_BAD_REQUEST`).
- `httpStatus: number|null` – HTTP status code if applicable.
- `message: string` – User-friendly message.
- `details: string|null` – Optional technical details.
- `retryable: boolean` – Indicates whether the error is retryable.

**Default Values**:
- `code = 'ERR_UNKNOWN'`
- `httpStatus = null`
- `message = 'An unexpected error occurred.'`
- `details = null`
- `retryable = false`

**Sample JSON**:
```json
{
  "code": "ERR_FORBIDDEN",
  "httpStatus": 403,
  "message": "You are not authorized to view this credit card summary.",
  "details": null,
  "retryable": false
}
```

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  function ErrorModel(code, httpStatus, message, details, retryable) {
    this.code = code || 'ERR_UNKNOWN';
    this.httpStatus = typeof httpStatus === 'number' ? httpStatus : null;
    this.message = message || 'An unexpected error occurred.';
    this.details = details || null;
    this.retryable = !!retryable;
  }

  angular.module('davmsApp')
    .factory('ErrorModel', function () {
      return ErrorModel;
    });
})();
```

### 5.2 MonthlySummaryModel

**File**: `src/app/core/models/summary-model.js`

**Type**: Factory returning constructor.

**Purpose**: Represent monthly summary KPIs for a given credit card account and month.

**Properties**:
- `accountId: string`
- `month: string` – Format `YYYY-MM`.
- `totalSpend: number` – Total spend for the month (filtered to credit card transactions, excluding reversals). Currency: numeric value, no locale formatting.
- `transactionCount: number` – Number of transactions.
- `averageTransactionAmount: number` – Average spend per transaction.
- `currencyCode: string` – ISO currency (e.g., `USD`).
- `dataFreshness: string` – e.g. `2026-07-01T08:30:00Z`.

**Default Values**:
- `totalSpend = 0`
- `transactionCount = 0`
- `averageTransactionAmount = 0`
- `currencyCode = 'USD'`

**Sample JSON (Response Payload):**
```json
{
  "accountId": "CC-1234567890",
  "month": "2026-06",
  "totalSpend": 2450.75,
  "transactionCount": 42,
  "averageTransactionAmount": 58.59,
  "currencyCode": "USD",
  "dataFreshness": "2026-07-01T08:30:00Z"
}
```

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  function MonthlySummaryModel(data) {
    data = data || {};
    this.accountId = data.accountId || '';
    this.month = data.month || '';
    this.totalSpend = typeof data.totalSpend === 'number' ? data.totalSpend : 0;
    this.transactionCount = typeof data.transactionCount === 'number' ? data.transactionCount : 0;
    this.averageTransactionAmount = typeof data.averageTransactionAmount === 'number' ? data.averageTransactionAmount : 0;
    this.currencyCode = data.currencyCode || 'USD';
    this.dataFreshness = data.dataFreshness || null;
  }

  angular.module('davmsApp')
    .factory('MonthlySummaryModel', function () {
      return MonthlySummaryModel;
    });
})();
```

### 5.3 BreakdownModel

**File**: `src/app/core/models/breakdown-model.js`

**Type**: Factory returning constructor.

**Purpose**: Represent coarse breakdown of monthly spend.

**Properties**:
- `categories: BreakdownCategory[]`

**BreakdownCategory** properties:
- `code: string` – Category code (e.g., `FOOD`, `ONLINE`, `TRAVEL`).
- `label: string` – Display label.
- `amount: number` – Spend in this category.
- `percentage: number` – Percentage of total spend.

**Default Values**:
- `categories = []`

**Sample JSON:**
```json
{
  "categories": [
    { "code": "FOOD", "label": "Food & Dining", "amount": 650.25, "percentage": 26.54 },
    { "code": "ONLINE", "label": "Online Purchases", "amount": 900.00, "percentage": 36.73 },
    { "code": "TRAVEL", "label": "Travel", "amount": 550.50, "percentage": 22.46 },
    { "code": "OTHER", "label": "Other", "amount": 349.99, "percentage": 14.27 }
  ]
}
```

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  function BreakdownCategory(data) {
    data = data || {};
    this.code = data.code || '';
    this.label = data.label || '';
    this.amount = typeof data.amount === 'number' ? data.amount : 0;
    this.percentage = typeof data.percentage === 'number' ? data.percentage : 0;
  }

  function BreakdownModel(data) {
    data = data || {};
    const categories = Array.isArray(data.categories) ? data.categories : [];
    this.categories = categories.map(c => new BreakdownCategory(c));
  }

  angular.module('davmsApp')
    .factory('BreakdownModel', function () {
      return BreakdownModel;
    });
})();
```

### 5.4 MonthContextModel

**File**: `src/app/core/models/month-context-model.js`

**Type**: Factory returning constructor.

**Purpose**: Represent resolved month selection and its canonical date window.

**Properties**:
- `requestedMonth: string` – `YYYY-MM` selected by user.
- `startDate: string` – ISO8601 start date of month window.
- `endDate: string` – ISO8601 end date of month window.
- `type: string` – `"BILLING_CYCLE"` or `"CALENDAR_MONTH"`.

**Default Values**:
- `type = 'BILLING_CYCLE'` (configurable by `MonthSelectionService`).

**Sample JSON:**
```json
{
  "requestedMonth": "2026-06",
  "startDate": "2026-06-01T00:00:00Z",
  "endDate": "2026-06-30T23:59:59Z",
  "type": "BILLING_CYCLE"
}
```

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  function MonthContextModel(data) {
    data = data || {};
    this.requestedMonth = data.requestedMonth || '';
    this.startDate = data.startDate || '';
    this.endDate = data.endDate || '';
    this.type = data.type || 'BILLING_CYCLE';
  }

  angular.module('davmsApp')
    .factory('MonthContextModel', function () {
      return MonthContextModel;
    });
})();
```

---
## 6. Services & Factories

### 6.1 LoggingService

**File**: `src/app/core/services/logging.service.js`

**Type**: Service.

**Constraints**:
- Must **not** eagerly depend on `$http` to avoid circular dependency with HttpInterceptor.
- May lazily resolve `$http` via `$injector` only when needed (e.g., for telemetry or remote logging).

**Responsibilities**:
- Provide unified logging abstraction.
- Log messages to `console` and optionally remote endpoint.

**Injected Services**:
- `$log`
- `$injector`

**Public Methods**:
- `info(message: string, context?: object): void`
- `warn(message: string, context?: object): void`
- `error(message: string, context?: object): void`

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  LoggingService.$inject = ['$log', '$injector'];

  function LoggingService($log, $injector) {
    let httpInstance = null;

    const service = {
      info,
      warn,
      error
    };
    return service;

    function getHttp() {
      if (!httpInstance) {
        httpInstance = $injector.get('$http');
      }
      return httpInstance;
    }

    function info(message, context) {
      $log.info(message, context || {});
      // Remote logging can be added via getHttp() if needed.
    }

    function warn(message, context) {
      $log.warn(message, context || {});
    }

    function error(message, context) {
      $log.error(message, context || {});
    }
  }

  angular.module('davmsApp')
    .service('LoggingService', LoggingService);
})();
```

### 6.2 TelemetryService

**File**: `src/app/core/services/telemetry.service.js`

**Type**: Service.

**Responsibilities**:
- Track app events (e.g., app_start, summary_loaded, error events).
- Respect `ENV_CONFIG.telemetry.enabled` flag.

**Injected Services**:
- `ConfigService`
- `LoggingService`

**Public Methods**:
- `trackEvent(name: string, payload?: object): void`

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  TelemetryService.$inject = ['ConfigService', 'LoggingService'];

  function TelemetryService(ConfigService, LoggingService) {
    const service = {
      trackEvent
    };
    return service;

    function trackEvent(name, payload) {
      const env = ConfigService.getEnvConfig();
      if (!env.telemetry.enabled) {
        return;
      }
      LoggingService.info('Telemetry event: ' + name, payload || {});
      // External telemetry endpoint integration could be added here without $http circular dependency.
    }
  }

  angular.module('davmsApp')
    .service('TelemetryService', TelemetryService);
})();
```

### 6.3 HttpInterceptorService

**File**: `src/app/core/services/http-interceptor.service.js`

**Type**: Factory (HTTP interceptor).

**Constraint**:
- **Must not depend on `$http`** to avoid circular dependencies.

**Injected Services**:
- `$q`
- `LoggingService`
- `ErrorMappingService`

**Responsibilities**:
- Add common headers if needed.
- Handle HTTP errors and map them into `ErrorModel` via `ErrorMappingService`.

**Public Methods (Interceptor Contract)**:
- `request(config)`
- `response(response)`
- `responseError(rejection)`

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  HttpInterceptorService.$inject = ['$q', 'LoggingService', 'ErrorMappingService'];

  function HttpInterceptorService($q, LoggingService, ErrorMappingService) {
    return {
      request: function (config) {
        // Add common headers if necessary, e.g. trace IDs.
        return config;
      },
      response: function (response) {
        return response;
      },
      responseError: function (rejection) {
        const errorModel = ErrorMappingService.mapHttpError(rejection);
        LoggingService.error('HTTP error intercepted', errorModel);
        return $q.reject(errorModel);
      }
    };
  }

  angular.module('davmsApp')
    .factory('HttpInterceptorService', HttpInterceptorService);
})();
```

### 6.4 ErrorMappingService

**File**: `src/app/core/services/error-mapping.service.js`

**Type**: Service.

**Injected Services**:
- `ErrorModel`

**Responsibilities**:
- Map HTTP error responses into `ErrorModel` instances.

**Public Methods**:
- `mapHttpError(rejection: object): ErrorModel`

**HTTP Error Mapping Rules**:
- 400 -> `ERR_BAD_REQUEST`, retryable=false
- 401 -> `ERR_UNAUTHORIZED`, retryable=false
- 403 -> `ERR_FORBIDDEN`, retryable=false
- 404 -> `ERR_NOT_FOUND`, retryable=false
- 500+ -> `ERR_SERVER_ERROR`, retryable=true

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  ErrorMappingService.$inject = ['ErrorModel'];

  function ErrorMappingService(ErrorModel) {
    const service = {
      mapHttpError
    };
    return service;

    function mapHttpError(rejection) {
      const status = rejection && rejection.status;
      let code = 'ERR_UNKNOWN';
      let message = 'An unexpected error occurred.';
      let retryable = false;

      if (status === 400) {
        code = 'ERR_BAD_REQUEST';
        message = 'The request was invalid. Please check your month selection and try again.';
      } else if (status === 401) {
        code = 'ERR_UNAUTHORIZED';
        message = 'Your session has expired. Please sign in again.';
      } else if (status === 403) {
        code = 'ERR_FORBIDDEN';
        message = 'You are not authorized to view this credit card summary.';
      } else if (status === 404) {
        code = 'ERR_NOT_FOUND';
        message = 'No summary is available for the selected month.';
      } else if (status >= 500) {
        code = 'ERR_SERVER_ERROR';
        message = 'We are unable to retrieve your summary at the moment. Please try again later.';
        retryable = true;
      }

      return new ErrorModel(code, status || null, message, null, retryable);
    }
  }

  angular.module('davmsApp')
    .service('ErrorMappingService', ErrorMappingService);
})();
```

### 6.5 MonthSelectionService

**File**: `src/app/core/services/month-selection.service.js`

**Type**: Service.

**Injected Services**:
- `ConfigService`
- `MonthContextModel`

**Responsibilities**:
- Validate month format (`YYYY-MM`).
- Enforce `maxLookbackMonths` limit.
- Compute canonical date range for the selected month.

**Public Methods**:
- `resolveMonthContext(month: string): MonthContextModel`
- `getAvailableMonths(currentDate?: Date): string[]`

**Business Rules**:
- Month format must match `/^\d{4}-\d{2}$/`.
- Selected month must not be more than `maxLookbackMonths` behind current month.
- Future months are not allowed.
- For this epic, `type` default is `BILLING_CYCLE` but implemented as calendar month boundaries.

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  MonthSelectionService.$inject = ['ConfigService', 'MonthContextModel'];

  function MonthSelectionService(ConfigService, MonthContextModel) {
    const service = {
      resolveMonthContext,
      getAvailableMonths
    };
    return service;

    function resolveMonthContext(month) {
      const env = ConfigService.getEnvConfig();
      const maxLookback = env.maxLookbackMonths;
      const now = new Date();

      if (!/^\d{4}-\d{2}$/.test(month)) {
        throw new Error('Invalid month format. Expected YYYY-MM.');
      }

      const [yearStr, monthStr] = month.split('-');
      const year = parseInt(yearStr, 10);
      const monthIndex = parseInt(monthStr, 10) - 1; // 0-based
      const selected = new Date(Date.UTC(year, monthIndex, 1));

      const diffMonths = (now.getUTCFullYear() - selected.getUTCFullYear()) * 12 + (now.getUTCMonth() - selected.getUTCMonth());
      if (diffMonths < 0 || diffMonths > maxLookback) {
        throw new Error('Selected month is out of allowed range.');
      }

      const startDate = new Date(Date.UTC(year, monthIndex, 1));
      const endDate = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59));

      return new MonthContextModel({
        requestedMonth: month,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        type: 'BILLING_CYCLE'
      });
    }

    function getAvailableMonths(currentDate) {
      const env = ConfigService.getEnvConfig();
      const maxLookback = env.maxLookbackMonths;
      const now = currentDate || new Date();
      const months = [];

      for (let i = 0; i <= maxLookback; i++) {
        const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
        const m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const y = date.getUTCFullYear();
        months.push(y + '-' + m);
      }
      return months;
    }
  }

  angular.module('davmsApp')
    .service('MonthSelectionService', MonthSelectionService);
})();
```

### 6.6 KpiService

**File**: `src/app/core/services/kpi.service.js`

**Type**: Service.

**Injected Services**:
- `MonthlySummaryModel`

**Responsibilities**:
- Compute `totalSpend`, `transactionCount`, and `averageTransactionAmount` from transaction aggregates or raw transaction list.
- Ensure numeric precision consistent with billing: two decimal places.

**Input**:
- `summaryInput` – object `{ accountId, month, totalSpend, transactionCount }` or `{ transactions: Transaction[] }`.

**Public Methods**:
- `computeKpisFromAggregates(accountId: string, month: string, totals: { totalAmount: number, transactionCount: number }, currencyCode: string): MonthlySummaryModel`

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  KpiService.$inject = ['MonthlySummaryModel'];

  function KpiService(MonthlySummaryModel) {
    const service = {
      computeKpisFromAggregates
    };
    return service;

    function computeKpisFromAggregates(accountId, month, totals, currencyCode) {
      const totalSpend = typeof totals.totalAmount === 'number' ? totals.totalAmount : 0;
      const transactionCount = typeof totals.transactionCount === 'number' ? totals.transactionCount : 0;
      const average = transactionCount > 0 ? parseFloat((totalSpend / transactionCount).toFixed(2)) : 0;

      return new MonthlySummaryModel({
        accountId: accountId,
        month: month,
        totalSpend: parseFloat(totalSpend.toFixed(2)),
        transactionCount: transactionCount,
        averageTransactionAmount: average,
        currencyCode: currencyCode || 'USD',
        dataFreshness: new Date().toISOString()
      });
    }
  }

  angular.module('davmsApp')
    .service('KpiService', KpiService);
})();
```

### 6.7 BreakdownService

**File**: `src/app/core/services/breakdown.service.js`

**Type**: Service.

**Injected Services**:
- `BreakdownModel`

**Responsibilities**:
- Compute coarse breakdown categories from aggregate data or transaction list.
- Restrict to credit-card transactions only (no modification of transactions).

**Input**:
- `aggregates` – object containing category totals: `{ FOOD: 650.25, ONLINE: 900, TRAVEL: 550.50, OTHER: 349.99 }`.

**Public Methods**:
- `computeBreakdownFromAggregates(aggregates: object): BreakdownModel`

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  BreakdownService.$inject = ['BreakdownModel'];

  function BreakdownService(BreakdownModel) {
    const service = {
      computeBreakdownFromAggregates
    };
    return service;

    function computeBreakdownFromAggregates(aggregates) {
      const agg = aggregates || {};
      const categories = [];
      const keys = Object.keys(agg);
      const total = keys.reduce((sum, key) => sum + (typeof agg[key] === 'number' ? agg[key] : 0), 0);

      keys.forEach(key => {
        const amount = typeof agg[key] === 'number' ? agg[key] : 0;
        const percentage = total > 0 ? parseFloat(((amount / total) * 100).toFixed(2)) : 0;
        const label = mapCategoryLabel(key);
        categories.push({
          code: key,
          label: label,
          amount: parseFloat(amount.toFixed(2)),
          percentage: percentage
        });
      });

      return new BreakdownModel({ categories: categories });
    }

    function mapCategoryLabel(code) {
      switch (code) {
        case 'FOOD': return 'Food & Dining';
        case 'ONLINE': return 'Online Purchases';
        case 'TRAVEL': return 'Travel';
        case 'OTHER': return 'Other';
        default: return code;
      }
    }
  }

  angular.module('davmsApp')
    .service('BreakdownService', BreakdownService);
})();
```

### 6.8 SummaryApiService

**File**: `src/app/core/services/summary-api.service.js`

**Type**: Service.

**Injected Services**:
- `$http`
- `$q`
- `ConfigService`
- `MonthSelectionService`
- `KpiService`
- `BreakdownService`
- `SummaryMockService`

**Responsibilities**:
- Orchestrate retrieval of monthly summary from either production API or mock service.
- Delegate month resolution to `MonthSelectionService`.
- In production mode: call REST API and adapt payload to models.

**REST API Contracts (Production Mode)**:

1. **Get Monthly Summary**
   - **URL**: `${apiBaseUrl}/summary`
   - **Method**: `GET`
   - **Headers**:
     - `Content-Type: application/json`
     - `Accept: application/json`
   - **Query Parameters**:
     - `accountId: string` (required, credit card account only)
     - `month: string` (required, `YYYY-MM`)
   - **Path Parameters**: None.
   - **Request Payload**: None (GET).
   - **Success Response (200)** payload structure:
     ```json
     {
       "accountId": "CC-1234567890",
       "month": "2026-06",
       "currencyCode": "USD",
       "totals": {
         "totalAmount": 2450.75,
         "transactionCount": 42
       },
       "breakdown": {
         "FOOD": 650.25,
         "ONLINE": 900.0,
         "TRAVEL": 550.5,
         "OTHER": 349.99
       },
       "dataFreshness": "2026-07-01T08:30:00Z"
     }
     ```
   - **Error Responses**:
     - `400` – invalid parameters.
     - `401` – unauthorized.
     - `403` – forbidden.
     - `404` – not found (no data for month).
     - `500` – server error.
   - **Timeout**: `apiTimeoutMs` from ENV_CONFIG.
   - **Retry Behavior**: The client does not automatically retry; retries handled by backend. Client may allow manual user retry.

**Public Methods**:
- `getMonthlySummary(accountId: string, month: string): Promise<{summary: MonthlySummaryModel, breakdown: BreakdownModel}>`

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  SummaryApiService.$inject = ['$http', '$q', 'ConfigService', 'MonthSelectionService', 'KpiService', 'BreakdownService', 'SummaryMockService'];

  function SummaryApiService($http, $q, ConfigService, MonthSelectionService, KpiService, BreakdownService, SummaryMockService) {
    const service = {
      getMonthlySummary
    };
    return service;

    function getMonthlySummary(accountId, month) {
      const deferred = $q.defer();

      let monthContext;
      try {
        monthContext = MonthSelectionService.resolveMonthContext(month);
      } catch (e) {
        deferred.reject(e);
        return deferred.promise;
      }

      if (ConfigService.isMockMode()) {
        SummaryMockService.getMonthlySummary(accountId, monthContext)
          .then(result => deferred.resolve(result))
          .catch(err => deferred.reject(err));
      } else {
        const env = ConfigService.getEnvConfig();
        const url = env.apiBaseUrl + '/summary';

        $http({
          method: 'GET',
          url: url,
          params: {
            accountId: accountId,
            month: month
          },
          timeout: env.apiTimeoutMs
        }).then(response => {
          const data = response.data || {};
          const totals = data.totals || {};
          const summary = KpiService.computeKpisFromAggregates(
            data.accountId,
            data.month,
            {
              totalAmount: totals.totalAmount,
              transactionCount: totals.transactionCount
            },
            data.currencyCode
          );

          // Override freshness if provided by API
          summary.dataFreshness = data.dataFreshness || summary.dataFreshness;

          const breakdown = BreakdownService.computeBreakdownFromAggregates(data.breakdown || {});
          deferred.resolve({ summary: summary, breakdown: breakdown });
        }).catch(err => {
          deferred.reject(err);
        });
      }

      return deferred.promise;
    }
  }

  angular.module('davmsApp')
    .service('SummaryApiService', SummaryApiService);
})();
```

### 6.9 SummaryMockService (Mock Data Design)

**File**: `src/app/core/services/summary-mock.service.js`

**Type**: Service.

**Injected Services**:
- `$q`
- `$timeout`
- `KpiService`
- `BreakdownService`

**Responsibilities**:
- Provide mock implementation of `getMonthlySummary` used when `useMockData === true`.
- Simulate async behavior and network delay.
- Support error simulation for robustness.

**Public Methods**:
- `getMonthlySummary(accountId: string, monthContext: MonthContextModel): Promise<{summary: MonthlySummaryModel, breakdown: BreakdownModel}>`

**Mock Behavior**:
- Uses `$timeout` with delay `500ms` to simulate network.
- Always returns fixed deterministic mock data for this epic.
- For error simulation, if `accountId` equals `"ERROR"`, it returns a rejected promise with `ErrorModel` (server error).

**Mock Response Sample JSON:**
```json
{
  "accountId": "CC-1234567890",
  "month": "2026-06",
  "currencyCode": "USD",
  "totals": {
    "totalAmount": 2450.75,
    "transactionCount": 42
  },
  "breakdown": {
    "FOOD": 650.25,
    "ONLINE": 900.0,
    "TRAVEL": 550.5,
    "OTHER": 349.99
  },
  "dataFreshness": "2026-07-01T08:30:00Z"
}
```

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  SummaryMockService.$inject = ['$q', '$timeout', 'KpiService', 'BreakdownService', 'ErrorModel'];

  function SummaryMockService($q, $timeout, KpiService, BreakdownService, ErrorModel) {
    const service = {
      getMonthlySummary
    };
    return service;

    function getMonthlySummary(accountId, monthContext) {
      const deferred = $q.defer();

      $timeout(function () {
        if (accountId === 'ERROR') {
          deferred.reject(new ErrorModel('ERR_SERVER_ERROR', 500, 'Mock server error', null, true));
          return;
        }

        const mockApiResponse = {
          accountId: accountId,
          month: monthContext.requestedMonth,
          currencyCode: 'USD',
          totals: {
            totalAmount: 2450.75,
            transactionCount: 42
          },
          breakdown: {
            FOOD: 650.25,
            ONLINE: 900.0,
            TRAVEL: 550.5,
            OTHER: 349.99
          },
          dataFreshness: new Date().toISOString()
        };

        const summary = KpiService.computeKpisFromAggregates(
          mockApiResponse.accountId,
          mockApiResponse.month,
          mockApiResponse.totals,
          mockApiResponse.currencyCode
        );
        summary.dataFreshness = mockApiResponse.dataFreshness;

        const breakdown = BreakdownService.computeBreakdownFromAggregates(mockApiResponse.breakdown);

        deferred.resolve({ summary: summary, breakdown: breakdown });
      }, 500);

      return deferred.promise;
    }
  }

  angular.module('davmsApp')
    .service('SummaryMockService', SummaryMockService);
})();
```

---
## 7. Monthly Summary Feature Components

### 7.1 MonthlySummaryController

**File**: `src/app/features/monthly-summary/monthly-summary.controller.js`

**Type**: Controller.

**Registered Module**: `davmsApp`.

**Injected Services**:
- `SummaryApiService`
- `MonthSelectionService`
- `ConfigService`
- `LoggingService`
- `TelemetryService`
- `ErrorMappingService`
- `$q`

**Responsibilities**:
- Coordinate month selection and retrieval of monthly summary data.
- Handle success and error flows.
- Expose view model for directive/template.

**View Model Properties (vm):**
- `vm.accountId: string` – Bound to selected credit card account (for this epic, a static placeholder).
- `vm.availableMonths: string[]`
- `vm.selectedMonth: string`
- `vm.summary: MonthlySummaryModel|null`
- `vm.breakdown: BreakdownModel|null`
- `vm.isLoading: boolean`
- `vm.error: ErrorModel|null`

**Public Methods (vm):**
- `vm.onMonthChange(): void` – Triggered when user selects a month.
- `vm.reload(): void` – Manual retry.
- `vm.hasSummary(): boolean`

**Data Flow – Success**:
1. User opens `/monthly-summary` route.
2. Controller initializes `availableMonths` via `MonthSelectionService.getAvailableMonths()`.
3. Controller selects the most recent month as `selectedMonth` and calls `loadSummary()`.
4. `loadSummary()` calls `SummaryApiService.getMonthlySummary(accountId, selectedMonth)`.
5. On success, sets `vm.summary` and `vm.breakdown`, `vm.isLoading = false`, clears `vm.error`.
6. Telemetry event `summary_loaded` is sent.
7. Directive and view update to show KPIs and breakdown.

**Data Flow – Failure**:
1. Same steps to call `SummaryApiService`.
2. If promise rejects with `ErrorModel` or Error:
   - If raw Error (e.g. month validation), map to `ErrorModel` with `ERR_BAD_REQUEST`.
   - Set `vm.error`, clear `vm.summary` and `vm.breakdown`, `vm.isLoading = false`.
3. Telemetry event `summary_load_failed` recorded.
4. View displays error template.

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  MonthlySummaryController.$inject = ['SummaryApiService', 'MonthSelectionService', 'ConfigService', 'LoggingService', 'TelemetryService', 'ErrorMappingService', '$q'];

  function MonthlySummaryController(SummaryApiService, MonthSelectionService, ConfigService, LoggingService, TelemetryService, ErrorMappingService, $q) {
    const vm = this;

    vm.accountId = 'CC-1234567890'; // For this epic, a placeholder credit card account.
    vm.availableMonths = [];
    vm.selectedMonth = null;
    vm.summary = null;
    vm.breakdown = null;
    vm.isLoading = false;
    vm.error = null;

    vm.onMonthChange = onMonthChange;
    vm.reload = reload;
    vm.hasSummary = hasSummary;

    initialize();

    function initialize() {
      vm.availableMonths = MonthSelectionService.getAvailableMonths();
      vm.selectedMonth = vm.availableMonths[0] || null;
      if (vm.selectedMonth) {
        loadSummary();
      }
    }

    function onMonthChange() {
      loadSummary();
    }

    function reload() {
      loadSummary();
    }

    function hasSummary() {
      return !!vm.summary;
    }

    function loadSummary() {
      if (!vm.selectedMonth) {
        return;
      }
      vm.isLoading = true;
      vm.error = null;
      vm.summary = null;
      vm.breakdown = null;

      SummaryApiService.getMonthlySummary(vm.accountId, vm.selectedMonth)
        .then(result => {
          vm.summary = result.summary;
          vm.breakdown = result.breakdown;
          vm.isLoading = false;
          TelemetryService.trackEvent('summary_loaded', {
            accountId: vm.accountId,
            month: vm.selectedMonth
          });
        })
        .catch(err => {
          vm.isLoading = false;
          let errorModel;
          if (err && err.code) {
            errorModel = err;
          } else {
            errorModel = ErrorMappingService.mapHttpError({ status: err && err.status });
          }
          vm.error = errorModel;
          LoggingService.error('Failed to load monthly summary', errorModel);
          TelemetryService.trackEvent('summary_load_failed', {
            accountId: vm.accountId,
            month: vm.selectedMonth,
            errorCode: errorModel.code
          });
        });
    }
  }

  angular.module('davmsApp')
    .controller('MonthlySummaryController', MonthlySummaryController);
})();
```

### 7.2 MonthlySummaryDirective

**File**: `src/app/features/monthly-summary/monthly-summary.directive.js`

**Type**: Directive.

**Restrict**: `'E'` (element).

**Scope Bindings**:
- Isolate scope with `bindToController: true`.
- Bindings:
  - `summary: '<'` – One-way binding of `MonthlySummaryModel`.
  - `breakdown: '<'` – One-way binding of `BreakdownModel`.
  - `availableMonths: '<'` – One-way binding of month list.
  - `selectedMonth: '='` – Two-way binding for selected month.
  - `isLoading: '<'` – One-way.
  - `error: '<'` – One-way `ErrorModel`.
  - `onMonthChange: '&'` – Callback invoked when month changes.

**bindToController**: `true`

**controller**: `MonthlySummaryDirectiveController`

**controllerAs**: `'vm'`

**templateUrl**: `src/app/features/monthly-summary/monthly-summary.template.html`

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  MonthlySummaryDirective.$inject = [];

  function MonthlySummaryDirective() {
    return {
      restrict: 'E',
      scope: {
        summary: '<',
        breakdown: '<',
        availableMonths: '<',
        selectedMonth: '=',
        isLoading: '<',
        error: '<',
        onMonthChange: '&'
      },
      bindToController: true,
      controller: MonthlySummaryDirectiveController,
      controllerAs: 'vm',
      templateUrl: 'src/app/features/monthly-summary/monthly-summary.template.html'
    };
  }

  MonthlySummaryDirectiveController.$inject = [];

  function MonthlySummaryDirectiveController() {
    const vm = this;

    vm.handleMonthChange = function () {
      if (typeof vm.onMonthChange === 'function') {
        vm.onMonthChange();
      }
    };
  }

  angular.module('davmsApp')
    .directive('monthlySummaryDashboard', MonthlySummaryDirective);
})();
```

### 7.3 Monthly Summary Filters

**File**: `src/app/features/monthly-summary/monthly-summary-filters.js`

**Type**: Filter(s).

**Filters**:
- `currencyNoSymbol`: formats number with 2 decimal places but without currency symbol.

**Implementation Specification:**
```javascript
(function () {
  'use strict';

  function currencyNoSymbol() {
    return function (input) {
      const value = typeof input === 'number' ? input : parseFloat(input) || 0;
      return value.toFixed(2);
    };
  }

  angular.module('davmsApp')
    .filter('currencyNoSymbol', currencyNoSymbol);
})();
```

---
## 8. Templates & Views

### 8.1 Main Monthly Summary Template

**File**: `src/app/features/monthly-summary/monthly-summary.template.html`

**Purpose**:
- Render month selector, summary KPIs, and breakdown chart/tiles.

**Structure**:
- Month selection (dropdown using `ui-bootstrap` styles only; standard `<select>` for simplicity).
- Loading indicator.
- Error message area.
- Main content when summary present.

**Template Content:**
```html
<div class="monthly-summary-dashboard" ng-class="{ 'loading': vm.isLoading }">
  <div class="row">
    <div class="col-sm-4">
      <label for="monthSelect">Select Month</label>
      <select id="monthSelect" class="form-control" ng-model="vm.selectedMonth" ng-options="month for month in vm.availableMonths" ng-change="vm.handleMonthChange()">
      </select>
    </div>
  </div>

  <div class="row" ng-if="vm.isLoading">
    <div class="col-sm-12 text-center monthly-summary-loading">
      <span class="glyphicon glyphicon-refresh spinning"></span>
      <span>Loading monthly summary...</span>
    </div>
  </div>

  <div ng-if="vm.error && !vm.isLoading" class="row">
    <div class="col-sm-12">
      <div class="alert alert-danger">
        <strong>Error:</strong> {{ vm.error.message }}
      </div>
    </div>
  </div>

  <div ng-if="!vm.isLoading && !vm.error && vm.summary" class="monthly-summary-content">
    <div class="row monthly-summary-kpi-row">
      <div class="col-sm-4">
        <div class="panel panel-default kpi-card">
          <div class="panel-heading">Total Spend</div>
          <div class="panel-body">
            <span class="kpi-value">{{ vm.summary.totalSpend | currencyNoSymbol }}</span>
            <span class="kpi-currency">{{ vm.summary.currencyCode }}</span>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="panel panel-default kpi-card">
          <div class="panel-heading">Transactions</div>
          <div class="panel-body">
            <span class="kpi-value">{{ vm.summary.transactionCount }}</span>
          </div>
        </div>
      </div>
      <div class="col-sm-4" ng-if="vm.summary.averageTransactionAmount">
        <div class="panel panel-default kpi-card">
          <div class="panel-heading">Average Transaction</div>
          <div class="panel-body">
            <span class="kpi-value">{{ vm.summary.averageTransactionAmount | currencyNoSymbol }}</span>
            <span class="kpi-currency">{{ vm.summary.currencyCode }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row monthly-summary-breakdown-row" ng-if="vm.breakdown && vm.breakdown.categories.length">
      <div class="col-sm-12">
        <h3>Spend Breakdown</h3>
        <div class="row">
          <div class="col-sm-3" ng-repeat="cat in vm.breakdown.categories">
            <div class="panel panel-default breakdown-card">
              <div class="panel-heading">{{ cat.label }}</div>
              <div class="panel-body">
                <div class="breakdown-amount">{{ cat.amount | currencyNoSymbol }} {{ vm.summary.currencyCode }}</div>
                <div class="breakdown-percentage">{{ cat.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row monthly-summary-meta-row">
      <div class="col-sm-12 text-right">
        <small>Data as of {{ vm.summary.dataFreshness }}</small>
      </div>
    </div>
  </div>
</div>
```

### 8.2 Empty State Template (Optional Usage)

**File**: `src/app/features/monthly-summary/monthly-summary-empty.template.html`

**Purpose**: Provide an empty state when no summary is present.

**Content:**
```html
<div class="alert alert-info">
  No monthly summary is available for the selected month.
</div>
```

### 8.3 Error Template (Optional Usage)

**File**: `src/app/features/monthly-summary/monthly-summary-error.template.html`

**Purpose**: Provide reusable error block.

**Content:**
```html
<div class="alert alert-danger">
  <strong>Error:</strong> {{ vm.error.message }}
</div>
```

---
## 9. Stylesheets

### 9.1 main.css

**File**: `src/css/main.css`

**Purpose**: Global styles.

**Content Specification (minimum):**
```css
.davms-root-container {
  margin-top: 20px;
}

.davms-header {
  margin-bottom: 20px;
}

.davms-title {
  font-size: 24px;
  font-weight: 600;
}

.davms-view-container {
  min-height: 200px;
}
```

### 9.2 monthly-summary.css

**File**: `src/css/monthly-summary.css`

**Purpose**: Feature-specific styles.

**Content Specification:**
```css
.monthly-summary-dashboard.loading {
  opacity: 0.7;
}

.monthly-summary-loading .spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.kpi-card {
  text-align: center;
}

.kpi-card .kpi-value {
  font-size: 24px;
  font-weight: 600;
}

.kpi-card .kpi-currency {
  margin-left: 5px;
  font-size: 14px;
}

.breakdown-card {
  text-align: center;
}

.breakdown-amount {
  font-size: 18px;
  font-weight: 500;
}

.breakdown-percentage {
  font-size: 14px;
}
```

---
## 10. Security & Validation Details

### 10.1 Input Validation & Sanitization

- Month selection:
  - Validated in `MonthSelectionService.resolveMonthContext` via regex and range checks.
- Account ID:
  - For this epic, static string; in future integration, must be validated on server side.
- No user free-text inputs in this feature; thus sanitization is limited to Angular’s built-in protections.

### 10.2 Authentication & Authorization Hooks

- Client-side assumes user is already authenticated by hosting banking portal.
- All sensitive authorization is enforced on server via REST API (out of scope for this Angular app but implied by API contract).

### 10.3 Secure Communication

- All API URLs use `https://`.
- No plain `http` endpoints.

### 10.4 Audit Logging

- Client-side telemetry logs events (e.g., `summary_loaded`, `summary_load_failed`).
- Server-side audit logging is not implemented in this SPA but assumed in backend.

---
## 11. Data Flow Summary

### 11.1 Success Flow

1. **User Action**: User navigates to `/monthly-summary` and optionally changes month via dropdown.
2. **Controller**: `MonthlySummaryController.initialize()` populates months and calls `loadSummary()`.
3. **Service**: `SummaryApiService.getMonthlySummary(accountId, month)`
   - Calls `MonthSelectionService.resolveMonthContext(month)`.
   - If mock mode: `SummaryMockService.getMonthlySummary()`.
   - Else: `$http GET` to `${apiBaseUrl}/summary`.
4. **Models**:
   - `KpiService.computeKpisFromAggregates()` builds `MonthlySummaryModel`.
   - `BreakdownService.computeBreakdownFromAggregates()` builds `BreakdownModel`.
5. **Directive/View**:
   - `monthlySummaryDashboard` directive receives bound models.
   - Template renders KPIs and breakdown tiles.
6. **UI Update**: KPIs, chart/tiles, and meta info visible to the user.

### 11.2 Failure Flow

1. Same as success up to service call.
2. Failure occurs via:
   - Mock error (accountId=`"ERROR"`) or HTTP error.
   - Month validation error thrown by `MonthSelectionService`.
3. `SummaryApiService` rejects promise.
4. `MonthlySummaryController` catches error and maps to `ErrorModel` via `ErrorMappingService` if needed.
5. `vm.error` is set; telemetry event `summary_load_failed` logged.
6. Directive/template shows error alert; summary/breakdown cleared.

---
## 12. Component Registry

The following table lists **all** components. Every dependency is registered once; no circular dependencies.

### 12.1 Modules
- **Module**: `davmsApp`
  - **Type**: Angular module
  - **File**: `src/app/app.module.js`
  - **Dependencies**: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`

### 12.2 Controllers
1. `MonthlySummaryController`
   - **Type**: Controller
   - **File**: `src/app/features/monthly-summary/monthly-summary.controller.js`
   - **Registered Module**: `davmsApp`
   - **Registration Method**: `.controller('MonthlySummaryController', MonthlySummaryController)`
   - **Dependencies**: `SummaryApiService`, `MonthSelectionService`, `ConfigService`, `LoggingService`, `TelemetryService`, `ErrorMappingService`, `$q`

### 12.3 Services
1. `ConfigService`
2. `EnvConfigService`
3. `LoggingService`
4. `ErrorMappingService`
5. `TelemetryService`
6. `MonthSelectionService`
7. `KpiService`
8. `BreakdownService`
9. `SummaryApiService`
10. `SummaryMockService`

All of the above:
- **Registered Module**: `davmsApp`
- **Registration Method**: `.service('Name', Impl)` or `.service('SummaryApiService', SummaryApiService)` etc.

### 12.4 Factories
1. `ErrorModel`
2. `MonthlySummaryModel`
3. `BreakdownModel`
4. `MonthContextModel`
5. `HttpInterceptorService` (factory used as interceptor)

- **Registered Module**: `davmsApp`
- **Registration Method**: `.factory('Name', Impl)`

### 12.5 Directives
1. `monthlySummaryDashboard`
   - **Type**: Directive
   - **File**: `src/app/features/monthly-summary/monthly-summary.directive.js`
   - **Registered Module**: `davmsApp`
   - **Registration Method**: `.directive('monthlySummaryDashboard', MonthlySummaryDirective)`

### 12.6 Filters
1. `currencyNoSymbol`
   - **Type**: Filter
   - **File**: `src/app/features/monthly-summary/monthly-summary-filters.js`
   - **Registered Module**: `davmsApp`
   - **Registration Method**: `.filter('currencyNoSymbol', currencyNoSymbol)`

### 12.7 Constants
1. `ENV_CONFIG`
   - **Type**: Constant
   - **File**: `src/app/core/constants/env-constants.js`
   - **Registered Module**: `davmsApp`
   - **Registration Method**: `.constant('ENV_CONFIG', {...})`

### 12.8 Config Blocks
1. `config` in `app.config.js`
   - Registers routes and HTTP interceptor.

### 12.9 Run Blocks
1. `run` in `app.run.js`
   - Initializes environment and telemetry.

---
## 13. Implementation Validation Checklist

- **Parsed HLDs**: 1 (`QE-3179_HLD.md`).
- **Generated LLDs**: 1 (`QE-3179_LLD.md`).
- **Every component has specification**: Yes (controllers, services, factories, directive, filters, models, constants).
- **Every component exists in registry**: Yes.
- **Every dependency is registered**: Yes; no hidden/unregistered dependencies.
- **Routes reference existing controller and template**:
  - Route `/monthly-summary` -> `MonthlySummaryController`, `src/app/features/monthly-summary/monthly-summary.template.html` (exists).
- **Every templateUrl exists**: Yes.
- **Every script reference exists**: Yes (all files listed in structure section).
- **Every stylesheet reference exists**: Yes (`main.css`, `monthly-summary.css`).
- **No circular dependencies**:
  - Module: single root module only.
  - Services: HttpInterceptor does not depend on `$http`; logging lazily resolves `$http`; no service depends on SummaryApiService in a way that forms a cycle.
- **Mock mode fully specified**: Yes; `SummaryMockService` provides deterministic mock responses, error simulation, and uses same models/interfaces as production.
- **LLD internally consistent and implementation-ready**: Yes; app can be generated and run from `index.html` with specified CDNs and file structure.
``