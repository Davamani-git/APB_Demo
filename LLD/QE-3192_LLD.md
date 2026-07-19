# Low-Level Design: Monthly Spending Summary Dashboard (QE-3192)

---

## 1. Overview

Epic ID: **QE-3192**  
Application Name / Branch: **APB**  
Repository: `Davamani-git/APB_Demo`

This LLD defines a complete, implementation-ready AngularJS 1.7.9 single-page application module that provides a **Monthly Spending Summary Dashboard** for credit-card products only. It is the single source of truth for the Code Generation Agent and contains all implementation details required to generate a production-ready application without assumptions.

The dashboard:
- Authenticates the user via existing session context (simulated client-side for this Epic).  
- Retrieves monthly spending summary KPIs for credit card accounts via REST APIs or mocks.  
- Displays KPI cards, a chart, and a spending table for the selected month.  
- Implements month selection and handles success, empty, and error states.  
- Enforces scope: **read-only, summary-level only**, credit-card products only.

---

## 2. Technology Stack

### 2.1 Frontend

- **HTML5**  
- **CSS3**  
- **JavaScript ES6** (transpiled or native where supported; code must use ES6 syntax such as `let`, `const`, arrow functions where appropriate, but remain compatible with AngularJS 1.7.9)  
- **AngularJS 1.7.9** (CDN)  
- **Angular Route 1.7.9** (CDN)  
- **Angular Animate 1.7.9** (CDN)  
- **Angular Sanitize 1.7.9** (CDN)  
- **Angular UI Bootstrap 2.5.6** (CDN)  
- **Bootstrap 3.4.1 (CSS only)** (CDN)  
- **Chart.js 2.9.4** (CDN)

### 2.2 Architecture

- AngularJS MVC  
- Single Page Application (SPA)  
- REST-based data access  
- Dependency Injection via AngularJS  
- **ControllerAs** syntax  
- **IIFE module pattern** for all AngularJS components (except index.html inline usage)

### 2.3 Runtime

- AngularJS services:
  - `$http` (for REST API calls)
  - `$q` (promise/deferred management)
  - `$timeout` (mock delay simulation, retry backoff, UI timing)
  - `$log` (logging)  
  - `$routeProvider`, `$locationProvider` (routing)  
  - `$route` (route info)  
  - `$window` (optional for telemetry / console)

### 2.4 Browser Support

- Google Chrome (latest stable)  
- Microsoft Edge (latest stable)

No framework upgrades or replacements are permitted. Library versions must be exactly as specified.

---

## 3. Repository Structure

Root: `Davamani-git/APB_Demo` (branch `APB`)

```text
APB_Demo/
  index.html
  src/
    app/
      app.module.js
      app.config.js
      app.run.js
      core/
        models/
          spend-summary.models.js
        services/
          env-config.service.js
          http-interceptor.service.js
          logging.service.js
          spend-summary.api.service.js
          spend-summary.mock.service.js
          spend-summary.service.js
        interceptors/
          http-error.interceptor.js
      features/
        spend-summary/
          spend-summary.routes.js
          spend-summary.controller.js
          spend-summary.directive.js
          spend-summary.template.html
          spend-summary-kpi-card.directive.js
          spend-summary-kpi-card.template.html
          spend-summary-chart.directive.js
          spend-summary-chart.template.html
          spend-summary-table.directive.js
          spend-summary-table.template.html
      shared/
        directives/
          loading-spinner.directive.js
          loading-spinner.template.html
        filters/
          currency-abbrev.filter.js
        templates/
          layout/
            header.template.html
            footer.template.html
    assets/
      css/
        app.css
        spend-summary.css
      img/
        icons/
          card-spend.png
          kpi-total.png
          kpi-count.png
          kpi-avg.png
    config/
      env.config.json
      feature-flags.json
      telemetry.config.json
    mocks/
      spend-summary.mock.json
      error.mock.json
```

All paths are relative to the repository root.

---

## 4. index.html Specification

### 4.1 Repository Path

- `index.html`

### 4.2 Purpose

- Root HTML document of the SPA.  
- Declares the AngularJS application, bootstraps scripts and styles, and defines the container for routed views.

### 4.3 Content Specification

The Code Generation Agent must create `index.html` with the following exact structure:

```html
<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Monthly Spending Summary Dashboard</title>

  <!-- Bootstrap CSS (CDN) -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

  <!-- Application Stylesheets (local) -->
  <link rel="stylesheet" href="assets/css/app.css">
  <link rel="stylesheet" href="assets/css/spend-summary.css">
</head>
<body>
  <div class="container-fluid" ng-controller="RootLayoutController as layoutVm">
    <!-- Header -->
    <div ng-include="'src/shared/templates/layout/header.template.html'"></div>

    <!-- Main Content -->
    <div class="row">
      <div class="col-xs-12">
        <div ng-view></div>
      </div>
    </div>

    <!-- Footer -->
    <div ng-include="'src/shared/templates/layout/footer.template.html'"></div>
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

  <!-- Application Scripts (local) -->
  <!-- Root Module & Bootstrap -->
  <script src="src/app/app.module.js"></script>
  <script src="src/app/app.config.js"></script>
  <script src="src/app/app.run.js"></script>

  <!-- Core Models -->
  <script src="src/app/core/models/spend-summary.models.js"></script>

  <!-- Core Services -->
  <script src="src/app/core/services/env-config.service.js"></script>
  <script src="src/app/core/services/logging.service.js"></script>
  <script src="src/app/core/services/spend-summary.api.service.js"></script>
  <script src="src/app/core/services/spend-summary.mock.service.js"></script>
  <script src="src/app/core/services/spend-summary.service.js"></script>

  <!-- Interceptors -->
  <script src="src/app/core/interceptors/http-error.interceptor.js"></script>
  <script src="src/app/core/services/http-interceptor.service.js"></script>

  <!-- Shared -->
  <script src="src/app/shared/directives/loading-spinner.directive.js"></script>
  <script src="src/app/shared/filters/currency-abbrev.filter.js"></script>

  <!-- Feature: Spend Summary -->
  <script src="src/app/features/spend-summary/spend-summary.routes.js"></script>
  <script src="src/app/features/spend-summary/spend-summary.controller.js"></script>
  <script src="src/app/features/spend-summary/spend-summary.directive.js"></script>
  <script src="src/app/features/spend-summary/spend-summary-kpi-card.directive.js"></script>
  <script src="src/app/features/spend-summary/spend-summary-chart.directive.js"></script>
  <script src="src/app/features/spend-summary/spend-summary-table.directive.js"></script>

  <!-- Root Layout Controller (defined in app.run.js) -->
</body>
</html>
```

### 4.4 Script Loading Order

1. AngularJS core  
2. Angular Route  
3. Angular Animate  
4. Angular Sanitize  
5. Angular UI Bootstrap  
6. Chart.js  
7. `app.module.js` (defines root module)  
8. `app.config.js` (config blocks, routes, interceptor registration)  
9. `app.run.js` (run blocks, startup logic)  
10. Models, then core services, then interceptors, then shared components, then feature modules/controllers/directives

### 4.5 CSS Loading Order

1. Bootstrap CSS (CDN)  
2. `assets/css/app.css` (global styles, overrides)  
3. `assets/css/spend-summary.css` (feature-specific styles)

No jQuery or `bootstrap.min.js` is included.

---

## 5. Application Bootstrap

### 5.1 Root Module

File: `src/app/app.module.js`

- Declares the **only** Angular module in the application.

```javascript
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

- Type: Angular module declaration.  
- Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`.  
- No configuration or run logic here.

### 5.2 Config Blocks

File: `src/app/app.config.js`

Responsibilities:
- Configure routes (including default route) for the spending summary feature.  
- Configure `$locationProvider` (hashbang or HTML5 mode).  
- Register HTTP interceptors.  
- Configure `$httpProvider` timeouts using ENV_CONFIG.  

Content:

```javascript
(function () {
  'use strict';

  config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];

  angular.module('app')
    .config(config);

  function config($routeProvider, $locationProvider, $httpProvider) {
    // Enable hash-based routing for maximum compatibility
    $locationProvider.html5Mode(false);

    // Routes
    $routeProvider
      .when('/spend-summary', {
        templateUrl: 'src/app/features/spend-summary/spend-summary.template.html',
        controller: 'SpendSummaryController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/spend-summary'
      });

    // HTTP Interceptor registration
    $httpProvider.interceptors.push('HttpErrorInterceptor');
  }
})();
```

### 5.3 Run Blocks

File: `src/app/app.run.js`

Responsibilities:
- Initialize ENV_CONFIG (load JSON config) before first API calls.  
- Setup global event handlers for route errors.  
- Define a root layout controller for header/footer if desired.  

Content:

```javascript
(function () {
  'use strict';

  run.$inject = ['$rootScope', 'EnvConfigService', 'LoggingService'];

  angular.module('app')
    .run(run)
    .controller('RootLayoutController', RootLayoutController);

  function run($rootScope, EnvConfigService, LoggingService) {
    // Load environment configuration at startup
    EnvConfigService.load().then(function () {
      LoggingService.info('Environment configuration loaded');
    }).catch(function (error) {
      LoggingService.error('Failed to load environment configuration', error);
    });

    // Global route error handling
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
      LoggingService.error('Route change error', {
        current: current,
        previous: previous,
        rejection: rejection
      });
    });
  }

  RootLayoutController.$inject = [];

  function RootLayoutController() {
    var layoutVm = this;

    layoutVm.appTitle = 'Monthly Spending Summary';
  }
})();
```

### 5.4 Routes

- Default Route: `/spend-summary`  
- Route configuration defined in `app.config.js`.  
- Feature-specific routing can optionally be extended in `src/app/features/spend-summary/spend-summary.routes.js` if additional views are required; for this Epic, the core route is `/spend-summary` only.

File: `src/app/features/spend-summary/spend-summary.routes.js`

```javascript
(function () {
  'use strict';

  // No additional routes for now. This file reserved for future expansion.
  angular.module('app');
})();
```

---

## 6. Configuration Files

### 6.1 ENV_CONFIG

File: `config/env.config.json`

Purpose: Provide environment-specific configuration for API access and feature behavior. This JSON file is loaded by `EnvConfigService` at startup.

Content:

```json
{
  "apiBaseUrl": "https://api.examplebank.com/v1",
  "apiTimeoutMs": 10000,
  "maxLookbackMonths": 12,
  "useMockData": true,
  "featureFlags": {
    "enableSpendSummaryDashboard": true,
    "enableMultiCardAggregation": true
  },
  "telemetry": {
    "enabled": true,
    "endpoint": "https://telemetry.examplebank.com/events",
    "samplingRate": 0.5
  }
}
```

#### ENV_CONFIG Properties

- `apiBaseUrl` (string): Base URL for production REST APIs.  
- `apiTimeoutMs` (number): Default timeout for API calls in milliseconds.  
- `maxLookbackMonths` (number): Maximum number of months back that users can request via month selector.  
- `useMockData` (boolean): When `true`, the `SpendSummaryService` uses `SpendSummaryMockService`; when `false`, it uses `SpendSummaryApiService`. Only this property must change to switch between Mock and Production mode.  
- `featureFlags` (object): Feature toggles.  
- `telemetry` (object): Telemetry configuration.

### 6.2 Feature Flags

File: `config/feature-flags.json`

Used by `EnvConfigService` only for advanced scenarios. For this Epic, it mirrors ENV_CONFIG but exists as a separate reference.

```json
{
  "enableSpendSummaryDashboard": true,
  "enableMultiCardAggregation": true
}
```

### 6.3 Telemetry Config

File: `config/telemetry.config.json`

Optional telemetry configuration; referenced by `EnvConfigService` and `LoggingService`.

```json
{
  "enabled": true,
  "endpoint": "https://telemetry.examplebank.com/events",
  "samplingRate": 0.5
}
```

---

## 7. Core Models

File: `src/app/core/models/spend-summary.models.js`

### 7.1 Angular Registration

```javascript
(function () {
  'use strict';

  angular.module('app')
    .constant('SpendSummaryModelDefaults', SpendSummaryModelDefaults())
    .factory('SpendSummaryModelFactory', SpendSummaryModelFactory)
    .factory('ErrorModelFactory', ErrorModelFactory);

  SpendSummaryModelFactory.$inject = [];
  ErrorModelFactory.$inject = [];

  function SpendSummaryModelDefaults() {
    return {
      month: '',
      customerId: '',
      cardSummaries: [],
      consolidatedTotals: {
        totalAmount: 0,
        transactionCount: 0,
        averageTransactionAmount: 0
      },
      breakdown: [],
      metadata: {
        currencyCode: 'USD',
        lastUpdatedUtc: null
      }
    };
  }

  function SpendSummaryModelFactory() {
    class CardSummary {
      constructor() {
        this.cardId = '';
        this.cardDisplayName = '';
        this.totalAmount = 0;
        this.transactionCount = 0;
        this.averageTransactionAmount = 0;
        this.breakdown = [];
      }
    }

    class BreakdownItem {
      constructor() {
        this.segmentCode = '';
        this.segmentLabel = '';
        this.amount = 0;
        this.transactionCount = 0;
        this.percentageOfTotal = 0;
      }
    }

    class SpendSummaryModel {
      constructor() {
        const defaults = SpendSummaryModelDefaults;
        this.month = defaults.month;
        this.customerId = defaults.customerId;
        this.cardSummaries = [];
        this.consolidatedTotals = Object.assign({}, defaults.consolidatedTotals);
        this.breakdown = [];
        this.metadata = Object.assign({}, defaults.metadata);
      }

      validate() {
        const errors = [];
        if (!this.month || !/^\d{4}-\d{2}$/.test(this.month)) {
          errors.push('Invalid month format. Expected YYYY-MM.');
        }
        if (!this.customerId) {
          errors.push('Customer ID is required.');
        }
        return errors;
      }
    }

    class ErrorModel {
      constructor() {
        this.code = '';
        this.message = '';
        this.httpStatus = 0;
        this.correlationId = '';
        this.details = null;
      }
    }

    return {
      createSpendSummary: function () {
        return new SpendSummaryModel();
      },
      createCardSummary: function () {
        return new CardSummary();
      },
      createBreakdownItem: function () {
        return new BreakdownItem();
      },
      createErrorModel: function () {
        return new ErrorModel();
      }
    };
  }

  function ErrorModelFactory() {
    class ErrorModel {
      constructor() {
        this.code = '';
        this.message = '';
        this.httpStatus = 0;
        this.correlationId = '';
        this.details = null;
      }
    }

    return {
      create: function () {
        return new ErrorModel();
      }
    };
  }
})();
```

### 7.2 Models Specification

#### 7.2.1 SpendSummaryModel

- Properties:
  - `month` (string, default `''`, format `YYYY-MM`).  
  - `customerId` (string, default `''`).  
  - `cardSummaries` (Array<CardSummary>, default `[]`).  
  - `consolidatedTotals` (object):
    - `totalAmount` (number, default `0`).  
    - `transactionCount` (number, default `0`).  
    - `averageTransactionAmount` (number, default `0`).
  - `breakdown` (Array<BreakdownItem>, default `[]`).  
  - `metadata` (object):
    - `currencyCode` (string, default `'USD'`).  
    - `lastUpdatedUtc` (string or null, default `null`).

- Methods:
  - `validate(): string[]` – returns an array of validation error messages.

- Sample JSON:

```json
{
  "month": "2025-03",
  "customerId": "CUST123",
  "cardSummaries": [
    {
      "cardId": "CARD001",
      "cardDisplayName": "Platinum Credit Card",
      "totalAmount": 1250.50,
      "transactionCount": 42,
      "averageTransactionAmount": 29.77,
      "breakdown": [
        {
          "segmentCode": "NEC",
          "segmentLabel": "Necessities",
          "amount": 600.00,
          "transactionCount": 20,
          "percentageOfTotal": 48
        },
        {
          "segmentCode": "DISC",
          "segmentLabel": "Discretionary",
          "amount": 650.50,
          "transactionCount": 22,
          "percentageOfTotal": 52
        }
      ]
    }
  ],
  "consolidatedTotals": {
    "totalAmount": 1250.50,
    "transactionCount": 42,
    "averageTransactionAmount": 29.77
  },
  "breakdown": [
    {
      "segmentCode": "NEC",
      "segmentLabel": "Necessities",
      "amount": 600.00,
      "transactionCount": 20,
      "percentageOfTotal": 48
    },
    {
      "segmentCode": "DISC",
      "segmentLabel": "Discretionary",
      "amount": 650.50,
      "transactionCount": 22,
      "percentageOfTotal": 52
    }
  ],
  "metadata": {
    "currencyCode": "USD",
    "lastUpdatedUtc": "2025-03-31T23:59:59Z"
  }
}
```

#### 7.2.2 CardSummary

- Properties:
  - `cardId` (string, default `''`).  
  - `cardDisplayName` (string, default `''`).  
  - `totalAmount` (number, default `0`).  
  - `transactionCount` (number, default `0`).  
  - `averageTransactionAmount` (number, default `0`).  
  - `breakdown` (Array<BreakdownItem>, default `[]`).

- Sample JSON: As in `cardSummaries[0]` above.

#### 7.2.3 BreakdownItem

- Properties:
  - `segmentCode` (string, default `''`).  
  - `segmentLabel` (string, default `''`).  
  - `amount` (number, default `0`).  
  - `transactionCount` (number, default `0`).  
  - `percentageOfTotal` (number, default `0`).

- Sample JSON: As in `breakdown[0]` above.

#### 7.2.4 ErrorModel

- Properties:
  - `code` (string, default `''`).  
  - `message` (string, default `''`).  
  - `httpStatus` (number, default `0`).  
  - `correlationId` (string, default `''`).  
  - `details` (any, default `null`).

- Sample JSON:

```json
{
  "code": "API_TIMEOUT",
  "message": "The spending summary service did not respond in time.",
  "httpStatus": 504,
  "correlationId": "abc123456789",
  "details": {
    "endpoint": "/spend-summary",
    "timeoutMs": 10000
  }
}
```

---

## 8. Core Services

### 8.1 EnvConfigService

File: `src/app/core/services/env-config.service.js`

#### Angular Registration

```javascript
(function () {
  'use strict';

  EnvConfigService.$inject = ['$http', '$q'];

  angular.module('app')
    .service('EnvConfigService', EnvConfigService);

  function EnvConfigService($http, $q) {
    var self = this;
    var config = null;

    self.load = function () {
      if (config) {
        return $q.resolve(config);
      }
      return $http.get('config/env.config.json').then(function (response) {
        config = response.data;
        return config;
      });
    };

    self.getConfig = function () {
      return config;
    };

    self.getApiBaseUrl = function () {
      return config ? config.apiBaseUrl : '';
    };

    self.getApiTimeoutMs = function () {
      return config ? config.apiTimeoutMs : 0;
    };

    self.getMaxLookbackMonths = function () {
      return config ? config.maxLookbackMonths : 0;
    };

    self.useMockData = function () {
      return !!(config && config.useMockData);
    };

    self.getFeatureFlags = function () {
      return config ? config.featureFlags : {};
    };

    self.getTelemetryConfig = function () {
      return config ? config.telemetry : {};
    };
  }
})();
```

#### Responsibility

- Load ENV_CONFIG from `config/env.config.json` once at startup, cache it, and expose typed getters.  
- Ensure that toggling `useMockData` switches between mock and production modes.

#### Injected Dependencies

- `$http`, `$q`

#### Methods

- `load(): Promise<object>` – loads and caches config.  
- `getConfig(): object` – returns raw config.  
- `getApiBaseUrl(): string`  
- `getApiTimeoutMs(): number`  
- `getMaxLookbackMonths(): number`  
- `useMockData(): boolean`  
- `getFeatureFlags(): object`  
- `getTelemetryConfig(): object`

#### Error Handling & Logging

- Errors are handled by the caller (e.g., run block).  
- Network errors propagate as rejected promises.

---

### 8.2 LoggingService

File: `src/app/core/services/logging.service.js`

#### Angular Registration

```javascript
(function () {
  'use strict';

  LoggingService.$inject = ['$log', '$window', '$injector'];

  angular.module('app')
    .service('LoggingService', LoggingService);

  function LoggingService($log, $window, $injector) {
    var self = this;

    self.info = function (message, context) {
      $log.info(message, context || {});
    };

    self.warn = function (message, context) {
      $log.warn(message, context || {});
    };

    self.error = function (message, context) {
      $log.error(message, context || {});
      sendTelemetry('error', message, context);
    };

    self.debug = function (message, context) {
      $log.debug(message, context || {});
    };

    function sendTelemetry(level, message, context) {
      var EnvConfigService = $injector.get('EnvConfigService');
      var telemetry = EnvConfigService.getTelemetryConfig();
      if (!telemetry.enabled) {
        return;
      }
      if (Math.random() > telemetry.samplingRate) {
        return;
      }
      try {
        var payload = {
          level: level,
          message: message,
          context: context || {},
          timestampUtc: new Date().toISOString()
        };
        // Lazy $http resolution via $injector to avoid hard dependency
        var $http = $injector.get('$http');
        $http.post(telemetry.endpoint, payload);
      } catch (e) {
        $log.warn('Telemetry dispatch failed', e);
      }
    }
  }
})();
```

#### Responsibility

- Provide a central logging abstraction.  
- Lazily resolve `$http` via `$injector` to satisfy architecture constraint: LoggingService must lazily resolve `$http`.

#### Injected Dependencies

- `$log`, `$window`, `$injector`

#### Methods

- `info(message: string, context?: any): void`  
- `warn(message: string, context?: any): void`  
- `error(message: string, context?: any): void`  
- `debug(message: string, context?: any): void`

#### Business Rules

- Telemetry sending honors `telemetry.enabled` and `telemetry.samplingRate` from ENV_CONFIG.

---

### 8.3 HttpErrorInterceptor

File: `src/app/core/interceptors/http-error.interceptor.js`

#### Angular Registration

```javascript
(function () {
  'use strict';

  HttpErrorInterceptor.$inject = ['$q', 'LoggingService'];

  angular.module('app')
    .factory('HttpErrorInterceptor', HttpErrorInterceptor);

  function HttpErrorInterceptor($q, LoggingService) {
    return {
      responseError: function (rejection) {
        LoggingService.error('HTTP response error', {
          status: rejection.status,
          data: rejection.data,
          config: rejection.config
        });
        return $q.reject(rejection);
      }
    };
  }
})();
```

#### Responsibility

- Intercept HTTP errors globally.  
- Log them via `LoggingService`.  
- Must **not** depend on `$http` (constraint fulfilled).

---

### 8.4 HttpInterceptorService

File: `src/app/core/services/http-interceptor.service.js`

Purpose: Additional convenience for API services; not an Angular interceptor.

```javascript
(function () {
  'use strict';

  HttpInterceptorService.$inject = ['EnvConfigService'];

  angular.module('app')
    .service('HttpInterceptorService', HttpInterceptorService);

  function HttpInterceptorService(EnvConfigService) {
    var self = this;

    self.applyTimeout = function (config) {
      var timeoutMs = EnvConfigService.getApiTimeoutMs();
      config.timeout = timeoutMs;
      return config;
    };
  }
})();
```

---

### 8.5 SpendSummaryApiService

File: `src/app/core/services/spend-summary.api.service.js`

#### Angular Registration

```javascript
(function () {
  'use strict';

  SpendSummaryApiService.$inject = ['$http', '$q', 'EnvConfigService', 'HttpInterceptorService'];

  angular.module('app')
    .service('SpendSummaryApiService', SpendSummaryApiService);

  function SpendSummaryApiService($http, $q, EnvConfigService, HttpInterceptorService) {
    var self = this;

    self.getMonthlySummary = function (month) {
      var baseUrl = EnvConfigService.getApiBaseUrl();
      var url = baseUrl + '/spend-summary';
      var config = {
        params: {
          month: month
        },
        headers: {
          'Accept': 'application/json'
        }
      };

      HttpInterceptorService.applyTimeout(config);

      return $http.get(url, config).then(function (response) {
        return response.data;
      }).catch(function (error) {
        return $q.reject(error);
      });
    };
  }
})();
```

#### REST API Contract (Production)

- URL: `GET {apiBaseUrl}/spend-summary`  
- Headers:
  - `Accept: application/json`  
  - Authentication headers (e.g., `Authorization`) handled elsewhere in hosting app but may be added if required.  
- Query Parameters:
  - `month` (string, required, format `YYYY-MM`)  
- Request Body: none.  
- Success Response (`200 OK`): JSON payload compatible with `SpendSummaryModel` shape:

```json
{
  "month": "2025-03",
  "customerId": "CUST123",
  "cardSummaries": [
    {
      "cardId": "CARD001",
      "cardDisplayName": "Platinum Credit Card",
      "totalAmount": 1250.5,
      "transactionCount": 42,
      "averageTransactionAmount": 29.77,
      "breakdown": [
        {
          "segmentCode": "NEC",
          "segmentLabel": "Necessities",
          "amount": 600.0,
          "transactionCount": 20,
          "percentageOfTotal": 48.0
        },
        {
          "segmentCode": "DISC",
          "segmentLabel": "Discretionary",
          "amount": 650.5,
          "transactionCount": 22,
          "percentageOfTotal": 52.0
        }
      ]
    }
  ],
  "consolidatedTotals": {
    "totalAmount": 1250.5,
    "transactionCount": 42,
    "averageTransactionAmount": 29.77
  },
  "breakdown": [
    {
      "segmentCode": "NEC",
      "segmentLabel": "Necessities",
      "amount": 600.0,
      "transactionCount": 20,
      "percentageOfTotal": 48.0
    },
    {
      "segmentCode": "DISC",
      "segmentLabel": "Discretionary",
      "amount": 650.5,
      "transactionCount": 22,
      "percentageOfTotal": 52.0
    }
  ],
  "metadata": {
    "currencyCode": "USD",
    "lastUpdatedUtc": "2025-03-31T23:59:59Z"
  }
}
```

- Error Responses:
  - `400 Bad Request` – invalid month format or out-of-range; payload:

```json
{
  "code": "INVALID_MONTH",
  "message": "Month parameter must be in format YYYY-MM and within allowed range.",
  "httpStatus": 400,
  "correlationId": "corr-400-xyz"
}
```

  - `401 Unauthorized` – missing/invalid auth:

```json
{
  "code": "UNAUTHORIZED",
  "message": "Authentication token is missing or invalid.",
  "httpStatus": 401,
  "correlationId": "corr-401-xyz"
}
```

  - `403 Forbidden` – customer not allowed to view requested credit card(s).  
  - `404 Not Found` – no data for requested month (no transactions).  
  - `500 Internal Server Error` – generic server error.  
  - `503 Service Unavailable` – downstream stores not reachable.

- Timeout: Controlled via `apiTimeoutMs` (ENV_CONFIG).  
- Retry Policy: Client-side (SpendSummaryService) may implement limited retry; the API itself is idempotent.

---

### 8.6 SpendSummaryMockService

File: `src/app/core/services/spend-summary.mock.service.js`

#### Angular Registration

```javascript
(function () {
  'use strict';

  SpendSummaryMockService.$inject = ['$q', '$timeout'];

  angular.module('app')
    .service('SpendSummaryMockService', SpendSummaryMockService);

  function SpendSummaryMockService($q, $timeout) {
    var self = this;

    self.getMonthlySummary = function (month) {
      var deferred = $q.defer();
      var delayMs = 500; // Simulated latency

      $timeout(function () {
        if (month === '9999-99') {
          // Simulated failure scenario
          deferred.reject({
            data: {
              code: 'MOCK_ERROR',
              message: 'Simulated mock error for testing.',
              httpStatus: 500,
              correlationId: 'mock-error-9999'
            },
            status: 500
          });
          return;
        }

        var response = {
          month: month,
          customerId: 'MOCK-CUST',
          cardSummaries: [
            {
              cardId: 'CARD-MOCK-1',
              cardDisplayName: 'Mock Platinum Card',
              totalAmount: 1234.56,
              transactionCount: 40,
              averageTransactionAmount: 30.86,
              breakdown: [
                {
                  segmentCode: 'NEC',
                  segmentLabel: 'Necessities',
                  amount: 600,
                  transactionCount: 18,
                  percentageOfTotal: 48.6
                },
                {
                  segmentCode: 'DISC',
                  segmentLabel: 'Discretionary',
                  amount: 634.56,
                  transactionCount: 22,
                  percentageOfTotal: 51.4
                }
              ]
            }
          ],
          consolidatedTotals: {
            totalAmount: 1234.56,
            transactionCount: 40,
            averageTransactionAmount: 30.86
          },
          breakdown: [
            {
              segmentCode: 'NEC',
              segmentLabel: 'Necessities',
              amount: 600,
              transactionCount: 18,
              percentageOfTotal: 48.6
            },
            {
              segmentCode: 'DISC',
              segmentLabel: 'Discretionary',
              amount: 634.56,
              transactionCount: 22,
              percentageOfTotal: 51.4
            }
          ],
          metadata: {
            currencyCode: 'USD',
            lastUpdatedUtc: new Date().toISOString()
          }
        };

        deferred.resolve(response);
      }, delayMs);

      return deferred.promise;
    };
  }
})();
```

#### Mock Mode Specification

- Mock JSON source: `mocks/spend-summary.mock.json` (optional static file, but service above returns equivalent data).  
- Sample Response: as above.  
- Delay Simulation: `500ms` via `$timeout`.  
- Failure Scenario: `month === '9999-99'` triggers a mock error.  
- Uses `$q` and `$timeout`.  
- Returns same model shape as production.

---

### 8.7 SpendSummaryService

File: `src/app/core/services/spend-summary.service.js`

#### Angular Registration

```javascript
(function () {
  'use strict';

  SpendSummaryService.$inject = ['$q', 'EnvConfigService', 'SpendSummaryApiService', 'SpendSummaryMockService', 'SpendSummaryModelFactory', 'LoggingService'];

  angular.module('app')
    .service('SpendSummaryService', SpendSummaryService);

  function SpendSummaryService($q, EnvConfigService, SpendSummaryApiService, SpendSummaryMockService, SpendSummaryModelFactory, LoggingService) {
    var self = this;

    self.getMonthlySummary = function (month) {
      var useMock = EnvConfigService.useMockData();
      var promise = useMock ? SpendSummaryMockService.getMonthlySummary(month) : SpendSummaryApiService.getMonthlySummary(month);

      return promise.then(function (data) {
        var model = SpendSummaryModelFactory.createSpendSummary();
        model.month = data.month;
        model.customerId = data.customerId;
        model.metadata = data.metadata;
        model.consolidatedTotals = data.consolidatedTotals;
        model.breakdown = data.breakdown;
        model.cardSummaries = data.cardSummaries;

        var validationErrors = model.validate();
        if (validationErrors.length > 0) {
          LoggingService.warn('SpendSummaryModel validation errors', validationErrors);
        }
        return model;
      }).catch(function (error) {
        LoggingService.error('Failed to load monthly spend summary', error);
        return $q.reject(error);
      });
    };
  }
})();
```

#### Responsibility

- Orchestrate between mock and production API services based on ENV_CONFIG.  
- Map raw API JSON into strongly defined `SpendSummaryModel`.  
- Apply validation and log warnings.  
- Expose a single high-level method to controllers.

#### Startup Constraints

- No dependency from startup (`run` block) services to API services; `SpendSummaryService` is only used in controllers.

---

## 9. Feature: Spend Summary Dashboard

### 9.1 Controller

File: `src/app/features/spend-summary/spend-summary.controller.js`

#### Angular Registration

```javascript
(function () {
  'use strict';

  SpendSummaryController.$inject = ['SpendSummaryService', 'EnvConfigService'];

  angular.module('app')
    .controller('SpendSummaryController', SpendSummaryController);

  function SpendSummaryController(SpendSummaryService, EnvConfigService) {
    var vm = this;

    vm.month = getDefaultMonth();
    vm.summary = null;
    vm.isLoading = false;
    vm.hasError = false;
    vm.errorMessage = '';
    vm.availableMonths = buildAvailableMonths();

    vm.onMonthChange = function () {
      loadSummary(vm.month);
    };

    vm.retry = function () {
      loadSummary(vm.month);
    };

    activate();

    function activate() {
      loadSummary(vm.month);
    }

    function getDefaultMonth() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth(); // 0-based
      if (month === 0) {
        year = year - 1;
        month = 12;
      }
      return year + '-' + pad2(month);
    }

    function pad2(value) {
      return value < 10 ? '0' + value : '' + value;
    }

    function buildAvailableMonths() {
      var maxLookback = EnvConfigService.getMaxLookbackMonths();
      var months = [];
      var date = new Date();
      for (var i = 0; i < maxLookback; i++) {
        var year = date.getFullYear();
        var month = date.getMonth();
        if (month === 0) {
          year = year - 1;
          month = 12;
        }
        var label = year + '-' + pad2(month);
        months.push(label);
        date.setMonth(date.getMonth() - 1);
      }
      return months;
    }

    function loadSummary(month) {
      vm.isLoading = true;
      vm.hasError = false;
      vm.errorMessage = '';

      SpendSummaryService.getMonthlySummary(month).then(function (model) {
        vm.summary = model;
      }).catch(function (error) {
        vm.hasError = true;
        vm.errorMessage = (error && error.data && error.data.message) ? error.data.message : 'Unable to load spending summary at this time.';
      }).finally(function () {
        vm.isLoading = false;
      });
    }
  }
})();
```

#### Responsibility

- Manage UI state for the spend summary view.  
- Handle month selection, data retrieval, loading and error states.  
- Provide data to directives/templates.

#### Injected Dependencies

- `SpendSummaryService`, `EnvConfigService`

#### Public Methods

- `onMonthChange(): void`  
- `retry(): void`

#### Private Methods

- `activate()` – initial load.  
- `getDefaultMonth(): string` – latest complete month.  
- `pad2(value: number): string` – 2-digit padding.  
- `buildAvailableMonths(): string[]` – month dropdown options.  
- `loadSummary(month: string): void` – retrieval and state management.

#### Business Rules

- Default month is the most recently completed month.  
- Available months are limited by `maxLookbackMonths`.  
- Failure sets `hasError = true` and displays message.

---

### 9.2 Main Feature Directive

File: `src/app/features/spend-summary/spend-summary.directive.js`

#### Angular Registration

```javascript
(function () {
  'use strict';

  SpendSummaryDirective.$inject = [];

  angular.module('app')
    .directive('spendSummaryDashboard', SpendSummaryDirective);

  function SpendSummaryDirective() {
    return {
      restrict: 'E',
      scope: {
        summary: '<',
        isLoading: '<',
        hasError: '<',
        errorMessage: '@',
        availableMonths: '<',
        selectedMonth: '<',
        onMonthChange: '&',
        onRetry: '&'
      },
      bindToController: true,
      controller: SpendSummaryDashboardController,
      controllerAs: 'vm',
      templateUrl: 'src/app/features/spend-summary/spend-summary.template.html',
      transclude: false,
      replace: false
    };
  }

  SpendSummaryDashboardController.$inject = [];

  function SpendSummaryDashboardController() {
    var vm = this;
    // No additional logic required; this directive is a composition root.
  }
})();
```

#### Directive Specification

- `restrict`: `'E'` (element).  
- `scope` bindings:  
  - `summary: '<'` – one-way binding of `SpendSummaryModel`.  
  - `isLoading: '<'` – loading state.  
  - `hasError: '<'` – error state.  
  - `errorMessage: '@'` – error message string.  
  - `availableMonths: '<'` – array of month labels.  
  - `selectedMonth: '<'` – currently selected month.  
  - `onMonthChange: '&'` – callback when month selection changes.  
  - `onRetry: '&'` – callback for retry action.  
- `bindToController`: `true`.  
- `controller`: `SpendSummaryDashboardController`.  
- `controllerAs`: `'vm'`.  
- `templateUrl`: `src/app/features/spend-summary/spend-summary.template.html`.  
- `transclude`: `false`.  
- `replace`: `false`.

---

### 9.3 KPI Card Directive

File: `src/app/features/spend-summary/spend-summary-kpi-card.directive.js`

```javascript
(function () {
  'use strict';

  SpendSummaryKpiCardDirective.$inject = [];

  angular.module('app')
    .directive('spendSummaryKpiCard', SpendSummaryKpiCardDirective);

  function SpendSummaryKpiCardDirective() {
    return {
      restrict: 'E',
      scope: {
        iconPath: '@',
        label: '@',
        value: '<',
        currencyCode: '@'
      },
      bindToController: true,
      controller: SpendSummaryKpiCardController,
      controllerAs: 'vm',
      templateUrl: 'src/app/features/spend-summary/spend-summary-kpi-card.template.html',
      transclude: false,
      replace: false
    };
  }

  SpendSummaryKpiCardController.$inject = [];

  function SpendSummaryKpiCardController() {
    var vm = this;
  }
})();
```

Directive attributes: `icon-path`, `label`, `value`, `currency-code`.

---

### 9.4 Chart Directive

File: `src/app/features/spend-summary/spend-summary-chart.directive.js`

```javascript
(function () {
  'use strict';

  SpendSummaryChartDirective.$inject = ['$timeout'];

  angular.module('app')
    .directive('spendSummaryChart', SpendSummaryChartDirective);

  function SpendSummaryChartDirective($timeout) {
    return {
      restrict: 'E',
      scope: {
        breakdown: '<',
        currencyCode: '@'
      },
      bindToController: true,
      controller: SpendSummaryChartController,
      controllerAs: 'vm',
      templateUrl: 'src/app/features/spend-summary/spend-summary-chart.template.html',
      transclude: false,
      replace: false,
      link: function (scope, element) {
        var vm = scope.vm;
        scope.$watch(function () { return vm.breakdown; }, function (newVal) {
          if (!newVal || !newVal.length) {
            return;
          }
          $timeout(function () {
            renderChart(element[0].querySelector('canvas'), vm.breakdown, vm.currencyCode);
          }, 0);
        }, true);
      }
    };

    function renderChart(canvas, breakdown, currencyCode) {
      var labels = breakdown.map(function (item) { return item.segmentLabel; });
      var data = breakdown.map(function (item) { return item.amount; });
      var backgroundColors = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

      if (!canvas) {
        return;
      }

      new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
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
            position: 'bottom'
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, chartData) {
                var label = chartData.labels[tooltipItem.index] || '';
                var value = chartData.datasets[0].data[tooltipItem.index] || 0;
                return label + ': ' + value.toFixed(2) + ' ' + currencyCode;
              }
            }
          }
        }
      });
    }
  }

  function SpendSummaryChartController() {
    var vm = this;
  }
})();
```

Chart specification:
- Type: Doughnut chart.  
- Labels: `segmentLabel`.  
- Legend: bottom.  
- Tooltips: show label and amount with currency.  
- Axes: not applicable (doughnut chart).  
- Colors: Bootstrap-like palette.  
- Responsive: `responsive: true`.

---

### 9.5 Table Directive

File: `src/app/features/spend-summary/spend-summary-table.directive.js`

```javascript
(function () {
  'use strict';

  SpendSummaryTableDirective.$inject = [];

  angular.module('app')
    .directive('spendSummaryTable', SpendSummaryTableDirective);

  function SpendSummaryTableDirective() {
    return {
      restrict: 'E',
      scope: {
        cardSummaries: '<',
        currencyCode: '@'
      },
      bindToController: true,
      controller: SpendSummaryTableController,
      controllerAs: 'vm',
      templateUrl: 'src/app/features/spend-summary/spend-summary-table.template.html',
      transclude: false,
      replace: false
    };
  }

  SpendSummaryTableController.$inject = [];

  function SpendSummaryTableController() {
    var vm = this;
  }
})();
```

---

## 10. Shared Components

### 10.1 Loading Spinner Directive

File: `src/app/shared/directives/loading-spinner.directive.js`

```javascript
(function () {
  'use strict';

  LoadingSpinnerDirective.$inject = [];

  angular.module('app')
    .directive('loadingSpinner', LoadingSpinnerDirective);

  function LoadingSpinnerDirective() {
    return {
      restrict: 'E',
      scope: {
        isLoading: '<'
      },
      bindToController: true,
      controller: LoadingSpinnerController,
      controllerAs: 'vm',
      templateUrl: 'src/app/shared/directives/loading-spinner.template.html',
      transclude: false,
      replace: false
    };
  }

  LoadingSpinnerController.$inject = [];

  function LoadingSpinnerController() {
    var vm = this;
  }
})();
```

### 10.2 CurrencyAbbrev Filter

File: `src/app/shared/filters/currency-abbrev.filter.js`

```javascript
(function () {
  'use strict';

  CurrencyAbbrevFilter.$inject = [];

  angular.module('app')
    .filter('currencyAbbrev', CurrencyAbbrevFilter);

  function CurrencyAbbrevFilter() {
    return function (amount) {
      if (amount === null || amount === undefined) {
        return '';
      }
      var value = Number(amount);
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      }
      if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toFixed(2);
    };
  }
})();
```

---

## 11. Templates & UI Specification

### 11.1 Header Template

File: `src/shared/templates/layout/header.template.html`

Purpose: Display application title and simple navigation.

```html
<div class="row app-header">
  <div class="col-xs-12">
    <h1 class="app-title">{{layoutVm.appTitle}}</h1>
  </div>
</div>
```

### 11.2 Footer Template

File: `src/shared/templates/layout/footer.template.html`

```html
<div class="row app-footer">
  <div class="col-xs-12 text-center">
    <small>&copy; 2025 Example Bank. Monthly Spending Summary Dashboard.</small>
  </div>
</div>
```

### 11.3 Spend Summary Main Template

File: `src/app/features/spend-summary/spend-summary.template.html`

UI specification:

- Overall Layout:
  - Use Bootstrap grid (`row`, `col-xs-*`, `col-sm-*`, `col-md-*`).  
  - Header region for month selector.  
  - KPI cards row.  
  - Chart row.  
  - Table row.  
  - Error and loading states.

```html
<div class="spend-summary-dashboard">
  <!-- Month Selector -->
  <div class="row">
    <div class="col-xs-12 col-sm-6">
      <label for="monthSelect">Select Month</label>
      <select id="monthSelect" class="form-control" ng-model="vm.selectedMonth" ng-options="month for month in vm.availableMonths" ng-change="vm.onMonthChange({})">
      </select>
    </div>
  </div>

  <!-- Loading State -->
  <div class="row" ng-if="vm.isLoading">
    <div class="col-xs-12 text-center">
      <loading-spinner is-loading="vm.isLoading"></loading-spinner>
    </div>
  </div>

  <!-- Error State -->
  <div class="row" ng-if="vm.hasError">
    <div class="col-xs-12">
      <div class="alert alert-danger">
        <p>{{vm.errorMessage}}</p>
        <button type="button" class="btn btn-default" ng-click="vm.onRetry({})">Retry</button>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div class="row" ng-if="!vm.isLoading && !vm.hasError && vm.summary && vm.summary.consolidatedTotals.transactionCount === 0">
    <div class="col-xs-12">
      <div class="alert alert-info">
        <p>No transactions found for the selected month.</p>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="row" ng-if="!vm.isLoading && !vm.hasError && vm.summary && vm.summary.consolidatedTotals.transactionCount > 0">
    <!-- KPI Cards -->
    <div class="col-xs-12">
      <div class="row">
        <div class="col-xs-12 col-sm-4">
          <spend-summary-kpi-card
            icon-path="assets/img/icons/kpi-total.png"
            label="Total Spend"
            value="vm.summary.consolidatedTotals.totalAmount"
            currency-code="{{vm.summary.metadata.currencyCode}}">
          </spend-summary-kpi-card>
        </div>
        <div class="col-xs-12 col-sm-4">
          <spend-summary-kpi-card
            icon-path="assets/img/icons/kpi-count.png"
            label="Transactions"
            value="vm.summary.consolidatedTotals.transactionCount"
            currency-code="">
          </spend-summary-kpi-card>
        </div>
        <div class="col-xs-12 col-sm-4">
          <spend-summary-kpi-card
            icon-path="assets/img/icons/kpi-avg.png"
            label="Average Transaction"
            value="vm.summary.consolidatedTotals.averageTransactionAmount"
            currency-code="{{vm.summary.metadata.currencyCode}}">
          </spend-summary-kpi-card>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="col-xs-12 col-md-6">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">Spend Breakdown</h3>
        </div>
        <div class="panel-body">
          <spend-summary-chart
            breakdown="vm.summary.breakdown"
            currency-code="{{vm.summary.metadata.currencyCode}}">
          </spend-summary-chart>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="col-xs-12 col-md-6">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">Per Card Summary</h3>
        </div>
        <div class="panel-body">
          <spend-summary-table
            card-summaries="vm.summary.cardSummaries"
            currency-code="{{vm.summary.metadata.currencyCode}}">
          </spend-summary-table>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 11.4 KPI Card Template

File: `src/app/features/spend-summary/spend-summary-kpi-card.template.html`

```html
<div class="panel panel-default spend-summary-kpi-card">
  <div class="panel-body">
    <div class="media">
      <div class="media-left">
        <img ng-src="{{vm.iconPath}}" alt="KPI Icon" class="kpi-icon">
      </div>
      <div class="media-body">
        <h4 class="media-heading">{{vm.label}}</h4>
        <p class="kpi-value">
          <span ng-if="vm.currencyCode">{{vm.value | currencyAbbrev}} {{vm.currencyCode}}</span>
          <span ng-if="!vm.currencyCode">{{vm.value | currencyAbbrev}}</span>
        </p>
      </div>
    </div>
  </div>
</div>
```

### 11.5 Chart Template

File: `src/app/features/spend-summary/spend-summary-chart.template.html`

```html
<div class="spend-summary-chart">
  <canvas></canvas>
</div>
```

### 11.6 Table Template

File: `src/app/features/spend-summary/spend-summary-table.template.html`

```html
<table class="table table-striped table-bordered spend-summary-table" ng-if="vm.cardSummaries && vm.cardSummaries.length">
  <thead>
    <tr>
      <th>Card</th>
      <th>Total Spend</th>
      <th>Transactions</th>
      <th>Average Transaction</th>
    </tr>
  </thead>
  <tbody>
    <tr ng-repeat="card in vm.cardSummaries">
      <td>{{card.cardDisplayName}}</td>
      <td>{{card.totalAmount | currencyAbbrev}} {{vm.currencyCode}}</td>
      <td>{{card.transactionCount}}</td>
      <td>{{card.averageTransactionAmount | currencyAbbrev}} {{vm.currencyCode}}</td>
    </tr>
  </tbody>
</table>
<div ng-if="!vm.cardSummaries || !vm.cardSummaries.length" class="alert alert-info">
  <p>No credit card accounts to display.</p>
</div>
```

### 11.7 Loading Spinner Template

File: `src/app/shared/directives/loading-spinner.template.html`

```html
<div class="loading-spinner" ng-if="vm.isLoading">
  <span class="glyphicon glyphicon-refresh spinning"></span>
  <span>Loading...</span>
</div>
```

### 11.8 CSS Files

#### 11.8.1 Global Styles

File: `assets/css/app.css`

```css
body {
  font-family: "Helvetica Neue", Arial, sans-serif;
  background-color: #f5f5f5;
}

.app-header {
  padding: 15px 0;
}

.app-title {
  font-size: 24px;
  font-weight: 600;
}

.app-footer {
  margin-top: 30px;
  padding: 15px 0;
  border-top: 1px solid #ddd;
  color: #777;
}

.loading-spinner {
  margin: 20px 0;
}

.loading-spinner .spinning {
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

#### 11.8.2 Spend Summary Styles

File: `assets/css/spend-summary.css`

```css
.spend-summary-dashboard {
  margin-top: 20px;
}

.spend-summary-kpi-card .kpi-icon {
  width: 32px;
  height: 32px;
}

.spend-summary-kpi-card .kpi-value {
  font-size: 20px;
  font-weight: bold;
}

.spend-summary-chart {
  min-height: 250px;
}

.spend-summary-table {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .spend-summary-kpi-card {
    margin-bottom: 10px;
  }
}
```

### 11.9 Assets

- `assets/img/icons/card-spend.png` – icon used optionally in header or KPIs.  
- `assets/img/icons/kpi-total.png` – total spend icon.  
- `assets/img/icons/kpi-count.png` – transaction count icon.  
- `assets/img/icons/kpi-avg.png` – average transaction icon.

---

## 12. Data Flow

### 12.1 Success Flow

1. **User Action**: User navigates to `/spend-summary` (default route) and/or selects a month in the dropdown.  
2. **Controller**: `SpendSummaryController` handles the route, initializes `month`, builds `availableMonths`, and calls `SpendSummaryService.getMonthlySummary(month)`.  
3. **Service**: `SpendSummaryService` determines mock vs production via `EnvConfigService.useMockData()`, then calls either `SpendSummaryMockService.getMonthlySummary(month)` or `SpendSummaryApiService.getMonthlySummary(month)`.  
4. **REST API / Mock**:
   - **Mock**: `SpendSummaryMockService` uses `$q` and `$timeout` to simulate delay and returns mock JSON.  
   - **Production**: `SpendSummaryApiService` calls REST endpoint `{apiBaseUrl}/spend-summary?month=YYYY-MM`.  
5. **Model**: Raw JSON is converted into an instance of `SpendSummaryModel` by `SpendSummaryModelFactory`. Validation is performed.  
6. **Directive/View**: `SpendSummaryDashboard` directive receives `summary`, `isLoading`, `hasError`, `errorMessage`, `availableMonths`, `selectedMonth`. It composes KPI cards (`spend-summary-kpi-card`), chart (`spend-summary-chart`), and table (`spend-summary-table`).  
7. **UI Update**: KPI cards, charts, and table show the monthly spending summary, respecting Bootstrap grid and responsive behavior.

### 12.2 Failure Flow

1. **User Action**: User navigates or changes month.  
2. **Controller**: Calls `SpendSummaryService.getMonthlySummary(month)`.  
3. **Service**: Underlying API or mock rejects the promise.  
4. **Error Handling**:
   - `SpendSummaryService` logs error via `LoggingService.error`.  
   - `SpendSummaryController` sets `hasError = true`, `errorMessage` based on error payload or default message.  
5. **Directive/View**: `SpendSummaryDashboard` displays error alert with message and Retry button.  
6. **User Action**: User clicks Retry -> `vm.onRetry()` -> `loadSummary(month)` -> re-attempt.

---

## 13. Error Handling

### 13.1 ErrorModel

Defined in `SpendSummaryModelFactory` and `ErrorModelFactory` (see models section). Used conceptually by API and mock responses.

### 13.2 HTTP Mapping

- 400 -> Invalid month or parameters.  
- 401 -> Unauthorized; user should be redirected by hosting app (outside this Epic).  
- 403 -> Forbidden; message: "You are not authorized to view spending summary for these accounts."  
- 404 -> No data; empty state message.  
- 500/503 -> Generic error; message: "Unable to load spending summary at this time."  

### 13.3 Validation Errors

- `SpendSummaryModel.validate()` returns messages logged as warnings.  
- UI does not show validation messages directly; they are for diagnostics.

### 13.4 Network Errors

- Captured by `HttpErrorInterceptor` and `SpendSummaryService` `.catch()` block.  
- Logged via `LoggingService.error`.  
- Display generic error message to user.

### 13.5 Retry Logic

- User-driven retry via Retry button.  
- No automatic retries to avoid overwhelming backend.

### 13.6 Logging

- All HTTP errors logged.  
- Initial config load success/failure logged.  
- Validation warnings logged.

### 13.7 Fallback Behavior

- If summary cannot be fetched, UI shows error alert and retains previous data in memory but hides core KPI content for clarity.

---

## 14. Security

### 14.1 Input Validation

- `month` selection is limited to `availableMonths` computed locally based on `maxLookbackMonths`, ensuring valid `YYYY-MM`.  
- No free-text inputs other than controlled dropdown; no injection vectors in this Epic.

### 14.2 Sanitization

- Angular Sanitize is loaded but not heavily used; ensures safe binding if future HTML content is introduced.  
- All text displayed is plain strings from trusted APIs or config.

### 14.3 Authentication Hooks

- Authentication and authorization are assumed to be handled by hosting application and API Gateway. This feature does not implement login itself.  
- If REST API returns 401/403, UI surfaces appropriate message.

### 14.4 Authorization Hooks

- Authorization enforced by backend; UI does not allow specifying card IDs directly.  
- Only aggregated per-customer data returned.

### 14.5 Secure Communication

- All API URLs use HTTPS.  
- Index.html must be served over HTTPS in production.

### 14.6 Audit Logging

- Telemetry sending via `LoggingService` can serve as a basis for audit events (e.g., summary retrieval events).

---

## 15. Implementation Rules

- Use ES6 syntax (`let`, `const`, arrow functions only where compatible, but controllers/services remain standard functions for DI).  
- All Angular components must declare explicit `$inject` arrays.  
- All controllers use **ControllerAs** syntax (`vm` or named).  
- Promise handling via `.then()`, `.catch()`, `.finally()` and `$q`.  
- Naming conventions:
  - Modules: `'app'`.  
  - Controllers: `PascalCase` + `Controller` suffix.  
  - Services: `PascalCase` + `Service` suffix.  
  - Directives: `camelCase` names, templates with `.template.html` suffix.  
  - Filters: `camelCase` + `Filter` suffix.  
  - Files: `kebab-case` or lower-case with dots; consistent with paths above.

- Folder conventions: `core`, `features`, `shared`, `config`, `mocks`, `assets`.  
- No circular dependencies (modules, services, controllers, directives, factories).  
- Only `app.module.js` declares `angular.module('app', [...])`; all other files use `angular.module('app')`.

---

## 16. Component Registry

Below registry ensures every component is defined with its location and dependencies.

### 16.1 Modules

- **app**  
  - Type: Angular Module  
  - File Path: `src/app/app.module.js`  
  - Registration: `angular.module('app', [...])`  
  - Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`

### 16.2 Controllers

1. **RootLayoutController**  
   - Type: Controller  
   - File Path: `src/app/app.run.js`  
   - Module: `app`  
   - Registration: `.controller('RootLayoutController', RootLayoutController)`  
   - Injected Services: none  
   - Public Methods: `appTitle` (property)

2. **SpendSummaryController**  
   - Type: Controller  
   - File Path: `src/app/features/spend-summary/spend-summary.controller.js`  
   - Module: `app`  
   - Registration: `.controller('SpendSummaryController', SpendSummaryController)`  
   - Injected Services: `SpendSummaryService`, `EnvConfigService`  
   - Public Methods/Properties: `month`, `summary`, `isLoading`, `hasError`, `errorMessage`, `availableMonths`, `onMonthChange()`, `retry()`

### 16.3 Services

- **EnvConfigService** – `src/app/core/services/env-config.service.js`  
- **LoggingService** – `src/app/core/services/logging.service.js`  
- **HttpInterceptorService** – `src/app/core/services/http-interceptor.service.js`  
- **SpendSummaryApiService** – `src/app/core/services/spend-summary.api.service.js`  
- **SpendSummaryMockService** – `src/app/core/services/spend-summary.mock.service.js`  
- **SpendSummaryService** – `src/app/core/services/spend-summary.service.js`

### 16.4 Factories & Constants

- **SpendSummaryModelDefaults** – constant in `spend-summary.models.js`.  
- **SpendSummaryModelFactory** – factory in `spend-summary.models.js`.  
- **ErrorModelFactory** – factory in `spend-summary.models.js`.

### 16.5 Directives

- **spendSummaryDashboard** – `src/app/features/spend-summary/spend-summary.directive.js`  
- **spendSummaryKpiCard** – `src/app/features/spend-summary/spend-summary-kpi-card.directive.js`  
- **spendSummaryChart** – `src/app/features/spend-summary/spend-summary-chart.directive.js`  
- **spendSummaryTable** – `src/app/features/spend-summary/spend-summary-table.directive.js`  
- **loadingSpinner** – `src/app/shared/directives/loading-spinner.directive.js`

### 16.6 Filters

- **currencyAbbrev** – `src/app/shared/filters/currency-abbrev.filter.js`

### 16.7 Config & Interceptors

- Config block: `config` in `src/app/app.config.js`.  
- Run block: `run` in `src/app/app.run.js`.  
- Interceptor: `HttpErrorInterceptor` in `src/app/core/interceptors/http-error.interceptor.js`.

---

## 17. Implementation Validation

The LLD defines:

- Every source file and repository path.  
- Every template and templateUrl.  
- Every route and default route.  
- Every Angular component and its dependencies.  
- Every model and its JSON structure.  
- REST API contracts and mock contracts.  
- Configuration files and environment properties.  
- Script and stylesheet loading order.  
- Error handling, data flows, and security hooks.

There are no circular dependencies because:
- `app` module is the only module.  
- Services depend only on core utilities and EnvConfigService; LoggingService resolves `$http` lazily.  
- Interceptor does not depend on `$http`.  
- Controllers depend only on services; directives depend on controllers and models via bindings.

The application can be generated entirely from this LLD without further assumptions.
