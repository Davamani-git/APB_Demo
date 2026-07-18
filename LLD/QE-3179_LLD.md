# Low-Level Design (LLD) – QE-3179 DAVMS Monthly Spending Summary Dashboard

## 1. Technology Stack & Versions

### 1.1 Frontend
- HTML5
- CSS3
- JavaScript ES6 (transpiled/used in browsers supporting ES6 features; no framework upgrades)
- AngularJS 1.7.9
- Angular Route 1.7.9 (`ngRoute`)
- Angular Animate 1.7.9 (`ngAnimate`)
- Angular Sanitize 1.7.9 (`ngSanitize`)
- Angular UI Bootstrap 2.5.6 (`ui.bootstrap`)
- Bootstrap 3.4.1

### 1.2 Architecture
- AngularJS MVC
- Single Page Application (SPA)
- REST APIs for backend communication
- Dependency Injection via AngularJS DI
- `ControllerAs` syntax for all controllers
- IIFE (Immediately Invoked Function Expression) pattern for all JS modules

### 1.3 Runtime & Async
- AngularJS `$http` for HTTP calls
- AngularJS `$q` for promise creation and composition
- AngularJS `$timeout` for async and delay simulation (mock mode)
- Promise-based asynchronous programming using ES6 `.then().catch()` and `$q`-style promises

### 1.4 Browser Support
- Google Chrome (latest stable)
- Microsoft Edge (latest stable)

### 1.5 Non-functional Constraints
- Do NOT upgrade or replace any framework or library versions unless explicitly specified.
- Only one Angular module declaration using array syntax.
- All remaining Angular files use `angular.module('davmsMonthlySummary')` getter syntax.


## 2. Application Structure

### 2.1 Folder Hierarchy

Root of repository (relevant portion):

```text
APB_Demo/
  ├─ HLD/
  │   └─ QE-3179_HLD.md
  └─ LLD/
      └─ QE-3179_LLD.md        # (this document)
  └─ src/
      ├─ index.html
      ├─ assets/
      │   ├─ css/
      │   │   ├─ bootstrap.min.css
      │   │   ├─ font-awesome.min.css         # optional icon support
      │   │   └─ app.css
      │   ├─ fonts/                           # font files as needed (Bootstrap/FontAwesome)
      │   ├─ img/
      │   │   ├─ logo.png
      │   │   └─ loading-spinner.gif
      │   └─ js/
      │       └─ lib/                         # third-party libraries (if not CDN)
      ├─ app/
      │   ├─ app.module.js
      │   ├─ app.config.js
      │   ├─ app.routes.js
      │   ├─ app.run.js
      │   ├─ core/
      │   │   ├─ config/
      │   │   │   ├─ env.config.json
      │   │   │   ├─ feature-flags.config.json
      │   │   │   └─ telemetry.config.json
      │   │   ├─ models/
      │   │   │   ├─ summary.models.js
      │   │   │   └─ error.models.js
      │   │   ├─ services/
      │   │   │   ├─ http-interceptor.service.js
      │   │   │   ├─ logging.service.js
      │   │   │   ├─ env-config.service.js
      │   │   │   ├─ summary-api.service.js
      │   │   │   ├─ summary-mock.service.js
      │   │   │   ├─ summary-domain.service.js
      │   │   │   ├─ kpi-domain.service.js
      │   │   │   ├─ breakdown-domain.service.js
      │   │   │   └─ month-context.service.js
      │   │   ├─ constants/
      │   │   │   ├─ app.constants.js
      │   │   │   └─ error.constants.js
      │   │   └─ filters/
      │   │       ├─ currency-safe.filter.js
      │   │       └─ month-display.filter.js
      │   ├─ features/
      │   │   └─ monthly-summary/
      │   │       ├─ controllers/
      │   │       │   └─ monthly-summary.controller.js
      │   │       ├─ directives/
      │   │       │   ├─ monthly-summary-cards.directive.js
      │   │       │   ├─ monthly-summary-chart.directive.js
      │   │       │   └─ month-selector.directive.js
      │   │       └─ templates/
      │   │           ├─ monthly-summary.view.html
      │   │           ├─ monthly-summary-cards.template.html
      │   │           ├─ monthly-summary-chart.template.html
      │   │           └─ month-selector.template.html
      │   └─ telemetry/
      │       └─ telemetry.service.js
      └─ config/
          ├─ build.config.json            # optional build-time config (not used at runtime)
          └─ app.settings.json            # optional static settings (may mirror env.config.json)
```

### 2.2 Script Loading Order (index.html)

`src/index.html` is the single entry point and must load scripts in this exact order to avoid dependency errors:

1. Core libraries (from CDN or `assets/js/lib`):
   - AngularJS 1.7.9
   - Angular Route 1.7.9
   - Angular Animate 1.7.9
   - Angular Sanitize 1.7.9
   - Angular UI Bootstrap 2.5.6
   - Bootstrap 3.4.1 JS

2. Application core (Angular module & configuration):
   - `app/app.module.js`
   - `app/app.constants.js` (within core/constants)
   - `app/core/constants/error.constants.js`
   - `app/app.config.js`
   - `app/app.routes.js`
   - `app/app.run.js`

3. Core models:
   - `app/core/models/summary.models.js`
   - `app/core/models/error.models.js`

4. Core services:
   - `app/core/services/env-config.service.js`
   - `app/core/services/logging.service.js`
   - `app/core/services/http-interceptor.service.js`
   - `app/core/services/month-context.service.js`
   - `app/core/services/kpi-domain.service.js`
   - `app/core/services/breakdown-domain.service.js`
   - `app/core/services/summary-domain.service.js`
   - `app/core/services/summary-api.service.js`
   - `app/core/services/summary-mock.service.js`
   - `app/telemetry/telemetry.service.js`

5. Filters:
   - `app/core/filters/currency-safe.filter.js`
   - `app/core/filters/month-display.filter.js`

6. Feature-specific controllers & directives:
   - `app/features/monthly-summary/controllers/monthly-summary.controller.js`
   - `app/features/monthly-summary/directives/monthly-summary-cards.directive.js`
   - `app/features/monthly-summary/directives/monthly-summary-chart.directive.js`
   - `app/features/monthly-summary/directives/month-selector.directive.js`

### 2.3 Stylesheet Loading Order (index.html)

1. Third-party styles:
   - `assets/css/bootstrap.min.css`
   - `assets/css/font-awesome.min.css` (if used for icons)

2. Application styles:
   - `assets/css/app.css`


## 3. index.html & Application Bootstrap

### 3.1 index.html Structure

`src/index.html` content (conceptual, ready for code generation):

- `<html>` root with `lang="en"`.
- `<head>` includes:
  - `<meta charset="utf-8">` and viewport meta.
  - Title: `DAVMS Monthly Spending Summary Dashboard`.
  - Stylesheet references in order (see 2.3).
- `<body>` includes:
  - Root element with `ng-app="davmsMonthlySummary"`.
  - Main container `<div class="container" ng-controller="MonthlySummaryController as vm">` optionally, but primary view is controlled via routes.
  - `<div ng-view></div>` as the single SPA view outlet (location of `ng-view`).


### 3.2 Root Angular Module Declaration

- Root module name: `davmsMonthlySummary`
- `ng-app` value: `davmsMonthlySummary`
- Module declaration file: `src/app/app.module.js`
- Declaration must use array syntax:

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary', [
      'ngRoute',
      'ngAnimate',
      'ngSanitize',
      'ui.bootstrap'
    ]);
})();
```

All other files use the getter syntax: `angular.module('davmsMonthlySummary')`.

### 3.3 Module Dependencies

- `ngRoute` – SPA routing
- `ngAnimate` – animated transitions (e.g., loading spinners, card transitions)
- `ngSanitize` – safe rendering of any HTML snippets (e.g., safe message content)
- `ui.bootstrap` – month selection using Bootstrap UI components (dropdown, datepicker)

### 3.4 Route Configuration

File: `src/app/app.routes.js`

- Uses `$routeProvider` to configure a single primary route for monthly summary.

Routes:

1. `'/monthly-summary'` (default route)
   - `templateUrl: 'app/features/monthly-summary/templates/monthly-summary.view.html'`
   - `controller: 'MonthlySummaryController'`
   - `controllerAs: 'vm'`

2. Fallback route:
   - `otherwise({ redirectTo: '/monthly-summary' })`

Implementation outline:

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .config(AppRoutes);

  AppRoutes.$inject = ['$routeProvider'];

  function AppRoutes($routeProvider) {
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

### 3.5 Config Blocks

File: `src/app/app.config.js`

Responsibilities:
- Configure `$httpProvider` to use `HttpInterceptor`.
- Configure global Angular settings as required.

Implementation outline:

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .config(AppConfig);

  AppConfig.$inject = ['$httpProvider'];

  function AppConfig($httpProvider) {
    $httpProvider.interceptors.push('HttpInterceptor');
  }
})();
```

### 3.6 Run Blocks

File: `src/app/app.run.js`

Responsibilities:
- Initialize environment configuration.
- Setup global telemetry hooks if required.

Implementation outline:

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .run(AppRun);

  AppRun.$inject = ['EnvConfigService', 'TelemetryService'];

  function AppRun(EnvConfigService, TelemetryService) {
    EnvConfigService.loadEnvConfig();
    TelemetryService.initialize();
  }
})();
```


## 4. Configuration Files & ENV_CONFIG

### 4.1 env.config.json

File: `src/app/core/config/env.config.json`

Defines environment-specific runtime configuration. Example content:

```json
{
  "ENV_CONFIG": {
    "environmentName": "DEV",
    "apiBaseUrl": "https://api.dev.davms.example.com",
    "apiTimeoutMs": 8000,
    "maxLookbackMonths": 24,
    "useMockData": true,
    "telemetryEnabled": true
  }
}
```

Properties:
- `environmentName` (string): Environment identifier (DEV, QA, PROD).
- `apiBaseUrl` (string): Base URL for the Monthly Spending Summary API.
- `apiTimeoutMs` (number): HTTP timeout in milliseconds.
- `maxLookbackMonths` (number): How many months back the user can select (applied by MonthContextService).
- `useMockData` (boolean): Global flag to switch between Mock Mode and Production Mode.
  - `true` = Mock Mode (API calls are served from `SummaryMockService`).
  - `false` = Production Mode (API calls are made via `SummaryApiService`).
- `telemetryEnabled` (boolean): Enables telemetry events.

### 4.2 feature-flags.config.json

File: `src/app/core/config/feature-flags.config.json`

Defines feature flags for conditional UI or behavior. Example content:

```json
{
  "features": {
    "enableBasicBreakdown": true,
    "enableAverageTransactionValue": true,
    "enableDataFreshnessIndicator": true
  }
}
```

### 4.3 telemetry.config.json

File: `src/app/core/config/telemetry.config.json`

Defines telemetry settings:

```json
{
  "telemetry": {
    "endpoint": "https://telemetry.dev.davms.example.com",
    "batchSize": 20,
    "flushIntervalMs": 30000,
    "logLevel": "info"
  }
}
```

### 4.4 App Settings (optional)

File: `src/config/app.settings.json`

Static duplication of key env config for build tooling (not consumed directly by Angular runtime):

```json
{
  "applicationName": "DAVMS Monthly Spending Summary Dashboard",
  "defaultRoute": "/monthly-summary"
}
```


## 5. Core Constants

### 5.1 App Constants

File: `src/app/core/constants/app.constants.js`

Defines constants for the module:

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .constant('APP_CONFIG', {
      appName: 'DAVMS Monthly Spending Summary Dashboard',
      defaultRoute: '/monthly-summary'
    });
})();
```

### 5.2 Error Constants

File: `src/app/core/constants/error.constants.js`

Defines error codes and user-friendly mapping keys:

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .constant('ERROR_CODES', {
      BAD_REQUEST: 'ERR_BAD_REQUEST',
      UNAUTHORIZED: 'ERR_UNAUTHORIZED',
      FORBIDDEN: 'ERR_FORBIDDEN',
      NOT_FOUND: 'ERR_NOT_FOUND',
      SERVER_ERROR: 'ERR_SERVER_ERROR',
      NETWORK_ERROR: 'ERR_NETWORK_ERROR',
      VALIDATION_ERROR: 'ERR_VALIDATION_ERROR',
      BREAKDOWN_UNAVAILABLE: 'ERR_BREAKDOWN_UNAVAILABLE'
    });
})();
```


## 6. Data Models

All models are defined in `summary.models.js` and `error.models.js` using ES6 classes but instantiated via Angular services or factory functions where needed.

### 6.1 Summary Models

File: `src/app/core/models/summary.models.js`

#### 6.1.1 MonthlySummaryModel

Represents the complete monthly summary response consumed by the UI.

Properties:
- `accountId` (string, default `''`)
- `month` (string, format `YYYY-MM`, default `''`)
- `totalSpend` (number, default `0`)
- `transactionCount` (number, default `0`)
- `averageTransactionValue` (number, default `0`)
- `currencyCode` (string, default `'USD'`)
- `breakdownItems` (array of `BreakdownItemModel`, default `[]`)
- `dataFreshness` (string, default `''`, e.g., `"2025-01-31T23:59:59Z"`)
- `source` (string, default `'AGG'` or `'TX'` to signal Aggregation vs Transaction Store)

Constructor:

```javascript
class MonthlySummaryModel {
  constructor({
    accountId = '',
    month = '',
    totalSpend = 0,
    transactionCount = 0,
    averageTransactionValue = 0,
    currencyCode = 'USD',
    breakdownItems = [],
    dataFreshness = '',
    source = ''
  } = {}) {
    this.accountId = accountId;
    this.month = month;
    this.totalSpend = totalSpend;
    this.transactionCount = transactionCount;
    this.averageTransactionValue = averageTransactionValue;
    this.currencyCode = currencyCode;
    this.breakdownItems = breakdownItems;
    this.dataFreshness = dataFreshness;
    this.source = source;
  }
}
```

Validation rules:
- `month` must match regex `^\d{4}-\d{2}$`.
- `totalSpend` and `transactionCount` must be `>= 0`.
- `averageTransactionValue` must be `>= 0` and consistent with `totalSpend / transactionCount` (if `transactionCount > 0`).
- `currencyCode` must be a known currency (e.g., `USD`, `EUR`), but the application will not enforce a full ISO-4217 list; it assumes backend validation.

Sample JSON:

```json
{
  "accountId": "1234567890",
  "month": "2025-01",
  "totalSpend": 1345.67,
  "transactionCount": 42,
  "averageTransactionValue": 32.04,
  "currencyCode": "USD",
  "breakdownItems": [
    {
      "categoryCode": "ONLINE",
      "categoryLabel": "Online Purchases",
      "amount": 580.12,
      "percentage": 43.11
    },
    {
      "categoryCode": "IN_STORE",
      "categoryLabel": "In-Store Purchases",
      "amount": 765.55,
      "percentage": 56.89
    }
  ],
  "dataFreshness": "2025-02-01T01:00:00Z",
  "source": "AGG"
}
```

State transitions:
- Initial state: empty model (defaults).
- After successful API call: all properties set from API response.
- On UI month change: new instance created with selected month and data from API.
- On error: the controller may clear or mark the model as invalid (e.g., set `breakdownItems = []`).

#### 6.1.2 BreakdownItemModel

Represents one entry in the basic spending breakdown.

Properties:
- `categoryCode` (string, default `''`) – coarse category identifier.
- `categoryLabel` (string, default `''`) – label for UI (e.g., `"Online Purchases"`).
- `amount` (number, default `0`).
- `percentage` (number, default `0`) – percentage of total spend.

Constructor:

```javascript
class BreakdownItemModel {
  constructor({
    categoryCode = '',
    categoryLabel = '',
    amount = 0,
    percentage = 0
  } = {}) {
    this.categoryCode = categoryCode;
    this.categoryLabel = categoryLabel;
    this.amount = amount;
    this.percentage = percentage;
  }
}
```

Validation rules:
- `amount >= 0`.
- `percentage >= 0` and `percentage <= 100`.

Sample JSON:

```json
{
  "categoryCode": "ONLINE",
  "categoryLabel": "Online Purchases",
  "amount": 580.12,
  "percentage": 43.11
}
```

#### 6.1.3 MonthContextModel

Represents the resolved month context used by domain services.

Properties:
- `month` (string, `YYYY-MM`) – user-selected month.
- `fromDate` (string, ISO date).
- `toDate` (string, ISO date).
- `definitionType` (string, e.g., `"BILLING_CYCLE"` or `"CALENDAR_MONTH"`).

Constructor:

```javascript
class MonthContextModel {
  constructor({ month = '', fromDate = '', toDate = '', definitionType = '' } = {}) {
    this.month = month;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.definitionType = definitionType;
  }
}
```

Validation rules:
- `month` format: `YYYY-MM`.
- `fromDate` <= `toDate`.

Sample JSON:

```json
{
  "month": "2025-01",
  "fromDate": "2025-01-01",
  "toDate": "2025-01-31",
  "definitionType": "CALENDAR_MONTH"
}
```

### 6.2 Error Models

File: `src/app/core/models/error.models.js`

#### 6.2.1 ErrorModel

Represents normalized error information used by controllers and UI.

Properties:
- `code` (string) – matches `ERROR_CODES`.
- `httpStatus` (number | null) – HTTP status where applicable.
- `message` (string) – user-friendly message key or text.
- `details` (string | null) – technical details (not shown to user).
- `retryable` (boolean) – indicates if a retry is appropriate.

Constructor:

```javascript
class ErrorModel {
  constructor({
    code = '',
    httpStatus = null,
    message = '',
    details = null,
    retryable = false
  } = {}) {
    this.code = code;
    this.httpStatus = httpStatus;
    this.message = message;
    this.details = details;
    this.retryable = retryable;
  }
}
```

Sample JSON:

```json
{
  "code": "ERR_NETWORK_ERROR",
  "httpStatus": null,
  "message": "Unable to reach the spending summary service.",
  "details": "Network request timed out after 8000ms.",
  "retryable": true
}
```

State transitions:
- Initial: `null` or empty error.
- On failure: instance populated and bound to UI.
- On success: controller clears error state (e.g., sets `vm.error = null`).


## 7. REST API Contracts

### 7.1 Monthly Spending Summary API – GET Summary

URL (base from env config):
- Base: `${ENV_CONFIG.apiBaseUrl}`
- Endpoint: `/summary`

Full example URL:
- `https://api.dev.davms.example.com/summary?accountId=1234567890&month=2025-01`

HTTP Method:
- `GET`

Headers:
- `Authorization: Bearer <token>` – required.
- `Content-Type: application/json` – although GET generally has no body, we maintain JSON accept semantics.
- `Accept: application/json`

Query Parameters:
- `accountId` (string, required): Must be a credit card account ID.
- `month` (string, required): Format `YYYY-MM`; within `maxLookbackMonths` and not future.

Path Parameters:
- None.

Request Payload:
- None (GET only query params).

Response Payload (success):

```json
{
  "accountId": "1234567890",
  "month": "2025-01",
  "totalSpend": 1345.67,
  "transactionCount": 42,
  "averageTransactionValue": 32.04,
  "currencyCode": "USD",
  "breakdown": [
    {
      "categoryCode": "ONLINE",
      "categoryLabel": "Online Purchases",
      "amount": 580.12,
      "percentage": 43.11
    },
    {
      "categoryCode": "IN_STORE",
      "categoryLabel": "In-Store Purchases",
      "amount": 765.55,
      "percentage": 56.89
    }
  ],
  "dataFreshness": "2025-02-01T01:00:00Z",
  "source": "AGG"
}
```

Success Responses:
- `200 OK` – valid monthly summary.

Error Responses:

`400 Bad Request`:
```json
{
  "code": "ERR_BAD_REQUEST",
  "message": "Invalid month format or unsupported product type."
}
```

`401 Unauthorized`:
```json
{
  "code": "ERR_UNAUTHORIZED",
  "message": "Authentication required to view this summary."
}
```

`403 Forbidden`:
```json
{
  "code": "ERR_FORBIDDEN",
  "message": "You are not authorized to view this credit card summary."
}
```

`404 Not Found`:
```json
{
  "code": "ERR_NOT_FOUND",
  "message": "No spending summary available for the selected month."
}
```

`500 Internal Server Error`:
```json
{
  "code": "ERR_SERVER_ERROR",
  "message": "An unexpected error occurred while retrieving your monthly summary."
}
```

Timeout:
- Configured via `ENV_CONFIG.apiTimeoutMs` (e.g., 8000ms). `$http` calls set `timeout` accordingly.

Retry Behavior:
- UI-level retry: the controller may expose a "Retry" action; automatic retries are not performed at the client.


## 8. Mock Data Design & Mock Mode

### 8.1 Mock Mode Behavior

- Controlled solely by `ENV_CONFIG.useMockData`.
- If `useMockData === true`, `SummaryDomainService` routes requests to `SummaryMockService` instead of `SummaryApiService`.
- All mock responses conform to the same JSON shape and data models as production.

### 8.2 SummaryMockService

File: `src/app/core/services/summary-mock.service.js`

Responsibilities:
- Provide mock responses for the monthly summary API.
- Simulate network delays and errors using `$timeout` and `$q`.

Public Methods:
- `getMonthlySummary(accountId, month)` – returns a promise resolving to `MonthlySummaryModel`.

Parameters:
- `accountId` (string)
- `month` (string)

Return Type:
- `$q` promise resolving to `MonthlySummaryModel` or rejecting with `ErrorModel`.

Async Behavior:
- Uses `$timeout` with a delay between 300–1000ms to simulate API latency.

Sample Mock JSON (success):

```json
{
  "accountId": "MOCK-1234",
  "month": "2025-01",
  "totalSpend": 1000.0,
  "transactionCount": 20,
  "averageTransactionValue": 50.0,
  "currencyCode": "USD",
  "breakdown": [
    {
      "categoryCode": "ONLINE",
      "categoryLabel": "Online Purchases",
      "amount": 400.0,
      "percentage": 40.0
    },
    {
      "categoryCode": "IN_STORE",
      "categoryLabel": "In-Store Purchases",
      "amount": 600.0,
      "percentage": 60.0
    }
  ],
  "dataFreshness": "2025-02-01T00:00:00Z",
  "source": "MOCK"
}
```

Error Simulation:
- If `month` is future relative to today or beyond `maxLookbackMonths`, returns `ErrorModel` with `VALIDATION_ERROR`.
- For random transient failures, may reject with `NETWORK_ERROR`.

Implementation outline:

```javascript
(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .service('SummaryMockService', SummaryMockService);

  SummaryMockService.$inject = ['$q', '$timeout', 'ERROR_CODES'];

  function SummaryMockService($q, $timeout, ERROR_CODES) {
    this.getMonthlySummary = function(accountId, month) {
      var deferred = $q.defer();

      $timeout(function() {
        // Simple validation
        if (!month || !/^\d{4}-\d{2}$/.test(month)) {
          deferred.reject(new ErrorModel({
            code: ERROR_CODES.VALIDATION_ERROR,
            httpStatus: null,
            message: 'Invalid month format.',
            retryable: false
          }));
          return;
        }

        // Simulate success
        var responseJson = { /* mock payload as above */ };
        var model = new MonthlySummaryModel({
          accountId: responseJson.accountId,
          month: responseJson.month,
          totalSpend: responseJson.totalSpend,
          transactionCount: responseJson.transactionCount,
          averageTransactionValue: responseJson.averageTransactionValue,
          currencyCode: responseJson.currencyCode,
          breakdownItems: responseJson.breakdown.map(function(item) {
            return new BreakdownItemModel(item);
          }),
          dataFreshness: responseJson.dataFreshness,
          source: responseJson.source
        });

        deferred.resolve(model);
      }, 500);

      return deferred.promise;
    };
  }
})();
```


## 9. Core Services & Business Logic

### 9.1 EnvConfigService

File: `src/app/core/services/env-config.service.js`

Type: Service

Registered Module: `davmsMonthlySummary`
Registration Method: `.service('EnvConfigService', EnvConfigService)`

Responsibilities:
- Load environment configuration from `env.config.json` at startup.
- Provide accessors for `ENV_CONFIG` properties.

Injected Services:
- `$http` (for loading JSON config once at startup)
- `$q` (for promises)

Public Methods:
- `loadEnvConfig()` – loads config and caches it.
- `getEnvConfig()` – returns cached `ENV_CONFIG` object.

Error Handling:
- On failure to load, sets defaults: `useMockData = true`, `apiTimeoutMs = 8000`, etc., and logs via LoggingService.

### 9.2 LoggingService

File: `src/app/core/services/logging.service.js`

Type: Service

Implementation Rule: Must lazily resolve `$http` (cannot directly depend on `$http` to avoid circular dependency risks with HttpInterceptor).

Registered Module: `davmsMonthlySummary`
Registration Method: `.service('LoggingService', LoggingService)`

Injected Services:
- `$injector` – used to lazily obtain `$http` if needed.
- `$log` – Angular logging.

Responsibilities:
- Log client-side events to console via `$log`.
- Optionally send logs to backend logging endpoint using `$http` resolved via `$injector.get('$http')`.

Public Methods:
- `info(message, data)`
- `warn(message, data)`
- `error(message, data)`

Error Handling:
- Swallows backend logging failures (no user impact).

### 9.3 HttpInterceptor

File: `src/app/core/services/http-interceptor.service.js`

Type: Factory (Angular interceptor)

Constraint: HttpInterceptor must not depend on `$http`.

Registered Module: `davmsMonthlySummary`
Registration Method: `.factory('HttpInterceptor', HttpInterceptor)`

Injected Services:
- `$q`
- `$injector` – for lazy resolution of `EnvConfigService`, `LoggingService`, `TelemetryService` (no `$http`).

Responsibilities:
- Attach `Authorization` header if a token is available.
- Apply timeout from `ENV_CONFIG.apiTimeoutMs` (via per-request config).
- Capture HTTP errors, transform them to `ErrorModel`, and log telemetry.

Public Methods:
- Interceptor methods: `request`, `response`, `responseError`.

Error Handling:
- Maps HTTP statuses to `ERROR_CODES`.

### 9.4 MonthContextService

File: `src/app/core/services/month-context.service.js`

Type: Service

Injected Services:
- `EnvConfigService`
- `$q`

Responsibilities:
- Validate and convert `month` string to `MonthContextModel`.
- Check `month` against `maxLookbackMonths` and ensure not in the future.

Public Methods:
- `resolveMonthContext(month)` – returns promise resolving to `MonthContextModel` or rejecting with `ErrorModel`.

Business Rules:
- `month` must be valid format and allowed by `maxLookbackMonths`.
- `definitionType` is configured (e.g., `'CALENDAR_MONTH'`); for LLD we assume calendar month.

Error Handling:
- On invalid month, return `ErrorModel` with `VALIDATION_ERROR`.

### 9.5 KpiDomainService

File: `src/app/core/services/kpi-domain.service.js`

Type: Service

Injected Services:
- None (pure computation service; may use `$log` for debug but not required).

Responsibilities:
- Compute `totalSpend`, `transactionCount`, `averageTransactionValue` from aggregated transaction data.

Public Methods:
- `computeKpis(aggregates)` – returns object with `totalSpend`, `transactionCount`, `averageTransactionValue`.

Parameters:
- `aggregates` (array of numeric values or objects representing aggregated transactions).

Error Handling:
- If no aggregates, returns zeros.

### 9.6 BreakdownDomainService

File: `src/app/core/services/breakdown-domain.service.js`

Type: Service

Injected Services:
- None (pure computation based on transaction/category aggregates).

Responsibilities:
- Generate high-level breakdown items (instances of `BreakdownItemModel`) from aggregated category data.

Public Methods:
- `computeBreakdown(aggregates)` – returns array of `BreakdownItemModel`.

Error Handling:
- If breakdown cannot be computed (e.g., missing data), returns empty array and may set `BREAKDOWN_UNAVAILABLE` error at SummaryDomainService level.

### 9.7 SummaryDomainService

File: `src/app/core/services/summary-domain.service.js`

Type: Service

Injected Services:
- `EnvConfigService`
- `SummaryApiService`
- `SummaryMockService`
- `MonthContextService`
- `KpiDomainService`
- `BreakdownDomainService`
- `$q`

Responsibilities:
- Orchestrate the end-to-end flow: month validation, API call (real or mock), KPI computation, breakdown computation when necessary.

Public Methods:
- `getMonthlySummary(accountId, month)` – returns promise resolving to `MonthlySummaryModel` or rejecting with `ErrorModel`.

Business Rules:
- Use `MonthContextService` to validate month.
- If `useMockData` is `true`, delegate to `SummaryMockService`.
- If `useMockData` is `false`, call `SummaryApiService`.
- If backend returns breakdown but `enableBasicBreakdown` feature flag is `false`, drop breakdown items.

Error Handling:
- If breakdown fails but KPIs succeed, return partial `MonthlySummaryModel` and attach `BREAKDOWN_UNAVAILABLE` as a secondary error (exposed to UI via message banner).

### 9.8 SummaryApiService

File: `src/app/core/services/summary-api.service.js`

Type: Service

Injected Services:
- `$http`
- `$q`
- `EnvConfigService`

Responsibilities:
- Make HTTP GET requests to Monthly Spending Summary API.
- Map JSON response to `MonthlySummaryModel` and `BreakdownItemModel` instances.

Public Methods:
- `getMonthlySummary(accountId, month)` – returns `$q` promise.

Parameters:
- `accountId` (string)
- `month` (string)

Error Handling:
- Relies on `HttpInterceptor.responseError` for unified error mapping.

### 9.9 TelemetryService

File: `src/app/telemetry/telemetry.service.js`

Type: Service

Injected Services:
- `$http` (lazy via `$injector` if necessary)
- `$injector`
- `EnvConfigService`

Responsibilities:
- Initialize telemetry from `telemetry.config.json`.
- Track events like `MONTHLY_SUMMARY_REQUEST`, `MONTHLY_SUMMARY_SUCCESS`, `MONTHLY_SUMMARY_FAILURE`.


## 10. Feature Components (Monthly Summary)

### 10.1 MonthlySummaryController

File: `src/app/features/monthly-summary/controllers/monthly-summary.controller.js`

Type: Controller

Registered Module: `davmsMonthlySummary`
Registration Method: `.controller('MonthlySummaryController', MonthlySummaryController)`

Injected Services:
- `SummaryDomainService`
- `EnvConfigService`
- `LoggingService`

ControllerAs: `vm`

Responsibilities:
- Bind monthly summary data to the view.
- Handle user interactions: month selection, refresh.
- Manage success and error states for UI.

Public Properties:
- `vm.summary` (`MonthlySummaryModel` | null)
- `vm.availableMonths` (array of strings `YYYY-MM`)
- `vm.selectedMonth` (string)
- `vm.isLoading` (boolean)
- `vm.error` (`ErrorModel` | null)

Public Methods:
- `vm.init()` – initialize controller, load default month and summary.
- `vm.onMonthChange(month)` – called from `month-selector` directive.
- `vm.refresh()` – re-fetch summary for current `selectedMonth`.

Private Methods:
- `_loadSummary(month)` – internal helper; not exposed on `vm`.

Error Handling:
- When `SummaryDomainService` rejects, set `vm.error` and clear `vm.summary`.

### 10.2 monthly-summary.view.html

File: `src/app/features/monthly-summary/templates/monthly-summary.view.html`

Contains layout:
- Header: `Monthly Spending Summary`.
- `month-selector` directive.
- Loading indicator when `vm.isLoading`.
- Error banner when `vm.error`.
- `monthly-summary-cards` directive for summary KPIs.
- `monthly-summary-chart` directive for breakdown visualization.

Template Outline:

```html
<div class="monthly-summary" ng-cloak>
  <h1>Monthly Spending Summary</h1>

  <month-selector
    selected-month="vm.selectedMonth"
    available-months="vm.availableMonths"
    on-month-change="vm.onMonthChange(month)">
  </month-selector>

  <div ng-if="vm.isLoading" class="loading">
    <img ng-src="assets/img/loading-spinner.gif" alt="Loading" />
  </div>

  <div ng-if="vm.error" class="alert alert-danger">
    {{ vm.error.message }}
  </div>

  <div ng-if="!vm.isLoading && vm.summary">
    <monthly-summary-cards summary="vm.summary"></monthly-summary-cards>

    <monthly-summary-chart
      summary="vm.summary"
      ng-if="vm.summary.breakdownItems && vm.summary.breakdownItems.length">
    </monthly-summary-chart>
  </div>
</div>
```

### 10.3 month-selector Directive

File: `src/app/features/monthly-summary/directives/month-selector.directive.js`

Type: Directive

Registered Module: `davmsMonthlySummary`
Registration Method: `.directive('monthSelector', monthSelector)`

Directive Definition:
- `restrict: 'E'`
- `scope`:
  - `selectedMonth: '='` – two-way binding of currently selected month.
  - `availableMonths: '<'` – one-way input list of selectable months.
  - `onMonthChange: '&'` – output callback executed when month changes.
- `bindToController: true`
- `controller: 'MonthSelectorController'`
- `controllerAs: 'vm'`
- `templateUrl: 'app/features/monthly-summary/templates/month-selector.template.html'`

Controller: `MonthSelectorController` (defined in same file or separate; for simplicity defined in same).

Injected Services:
- None (simple UI logic).

Responsibilities:
- Render dropdown or UI-Bootstrap datepicker for month selection.
- Invoke `onMonthChange({ month: vm.selectedMonth })` when user selects new month.

Template (`month-selector.template.html`):

```html
<div class="month-selector">
  <label for="monthSelect">Select month:</label>
  <select id="monthSelect"
          class="form-control"
          ng-model="vm.selectedMonth"
          ng-options="month for month in vm.availableMonths"
          ng-change="vm.handleChange()">
  </select>
</div>
```

Directive Controller Methods:
- `vm.handleChange()` – calls `vm.onMonthChange({ month: vm.selectedMonth })`.

### 10.4 monthly-summary-cards Directive

File: `src/app/features/monthly-summary/directives/monthly-summary-cards.directive.js`

Type: Directive

Directive Definition:
- `restrict: 'E'`
- `scope`:
  - `summary: '<'` – one-way bound `MonthlySummaryModel`.
- `bindToController: true`
- `controller: 'MonthlySummaryCardsController'`
- `controllerAs: 'vm'`
- `templateUrl: 'app/features/monthly-summary/templates/monthly-summary-cards.template.html'`

Injected Services:
- None.

Responsibilities:
- Display KPI summary cards: total spend, transaction count, average transaction value.

Template Outline (`monthly-summary-cards.template.html`):

```html
<div class="summary-cards">
  <div class="row">
    <div class="col-sm-4">
      <div class="panel panel-default">
        <div class="panel-heading">Total Spend</div>
        <div class="panel-body">
          {{ vm.summary.totalSpend | currencySafe:vm.summary.currencyCode }}
        </div>
      </div>
    </div>
    <div class="col-sm-4">
      <div class="panel panel-default">
        <div class="panel-heading">Transactions</div>
        <div class="panel-body">
          {{ vm.summary.transactionCount }}
        </div>
      </div>
    </div>
    <div class="col-sm-4" ng-if="vm.summary.transactionCount > 0">
      <div class="panel panel-default">
        <div class="panel-heading">Average Transaction Value</div>
        <div class="panel-body">
          {{ vm.summary.averageTransactionValue | currencySafe:vm.summary.currencyCode }}
        </div>
      </div>
    </div>
  </div>
</div>
```

### 10.5 monthly-summary-chart Directive

File: `src/app/features/monthly-summary/directives/monthly-summary-chart.directive.js`

Type: Directive

Directive Definition:
- `restrict: 'E'`
- `scope`:
  - `summary: '<'` – one-way bound `MonthlySummaryModel`.
- `bindToController: true`
- `controller: 'MonthlySummaryChartController'`
- `controllerAs: 'vm'`
- `templateUrl: 'app/features/monthly-summary/templates/monthly-summary-chart.template.html'`

Injected Services:
- None (chart rendered using plain HTML/CSS or optional simple JS; no external charting library specified in stack, so must be simple representation such as bar chart via CSS).

Responsibilities:
- Visual representation of monthly spend breakdown (e.g., bar chart or horizontal bars representing percentages).

Template Outline (`monthly-summary-chart.template.html`):

```html
<div class="summary-chart">
  <h2>Spending Breakdown</h2>
  <div class="breakdown-bar" ng-repeat="item in vm.summary.breakdownItems">
    <div class="label">{{ item.categoryLabel }}</div>
    <div class="bar">
      <div class="fill" ng-style="{ width: item.percentage + '%' }"></div>
    </div>
    <div class="amount">
      {{ item.amount | currencySafe:vm.summary.currencyCode }} ({{ item.percentage | number:1 }}%)
    </div>
  </div>
</div>
```


## 11. Filters

### 11.1 currency-safe Filter

File: `src/app/core/filters/currency-safe.filter.js`

Type: Filter

Injected Services:
- `$filter('currency')` – underlying Angular currency filter.

Responsibilities:
- Safely format currency values using the given currency code, defaulting to `$`.

Signature:
- Input: `amount` (number), `currencyCode` (string)
- Output: formatted string.

### 11.2 month-display Filter

File: `src/app/core/filters/month-display.filter.js`

Responsibilities:
- Display `YYYY-MM` as `MMM YYYY` (e.g., `2025-01` -> `Jan 2025`).

Signature:
- Input: `month` string.
- Output: user-friendly month string.


## 12. Error Handling & Mapping

### 12.1 HTTP Error Mapping

Handled centrally in `HttpInterceptor.responseError`:
- `400` -> `ERROR_CODES.BAD_REQUEST`
- `401` -> `ERROR_CODES.UNAUTHORIZED`
- `403` -> `ERROR_CODES.FORBIDDEN`
- `404` -> `ERROR_CODES.NOT_FOUND`
- `500` -> `ERROR_CODES.SERVER_ERROR`
- Network/timeout -> `ERROR_CODES.NETWORK_ERROR`

The interceptor constructs `ErrorModel` instances and rejects the `$http` promise with the model; controllers handle it.

### 12.2 Validation Failures

Validation occurs in:
- `MonthContextService` for month format and range.
- `MonthSelector` directive for UI-level validation.

On validation failure, `SummaryDomainService` rejects with `ErrorModel` code `VALIDATION_ERROR`.
UI displays the message from `ErrorModel.message`.

### 12.3 Retry Logic

- No automatic client retries.
- `MonthlySummaryController` may provide a button that calls `vm.refresh()` to repeat the request.

### 12.4 Logging & Telemetry

- Logging via `LoggingService` for errors.
- Telemetry events for request start/end and failure.

### 12.5 Fallback Behavior

- If breakdown fails but KPIs are available, show cards and hide chart; display non-blocking info message.


## 13. Security

### 13.1 Input Validation

- Month selection validated by `MonthContextService` and backend.
- UI components ensure only valid months from `availableMonths` list can be selected.

### 13.2 Sanitization

- Angular `ngSanitize` enabled.
- No raw HTML from backend is directly inserted; any HTML messages use trusted patterns.

### 13.3 Authentication Hooks

- HttpInterceptor attaches `Authorization` header if token present in session (retrieved from a simple `AuthTokenProvider` if needed; for this epic, we assume token presence without implementing the provider).

### 13.4 Authorization Hooks

- Authorization enforced server-side; client does not bypass restrictions.
- Client shows generic error message on `403`.

### 13.5 Secure Communication

- All API calls use `https://` endpoints; base URL from `env.config.json` must be HTTPS.

### 13.6 Audit Logging

- Client may send telemetry events; primary compliance audit occurs at server.


## 14. Implementation Rules & Coding Standards

- Use ES6 syntax (classes, `let`, `const`, arrow functions where appropriate) inside AngularJS code, transpiled or supported by target browsers.
- Use explicit `$inject` syntax for all injectable functions:
  - `Controller.$inject = ['Dep1', 'Dep2'];`
- Use `ControllerAs` syntax (`vm` alias) for all controllers.
- All AngularJS modules, controllers, services, directives, filters follow IIFE pattern.
- Naming conventions:
  - Modules: `davmsMonthlySummary`
  - Controllers: `PascalCase` + `Controller` suffix (e.g., `MonthlySummaryController`).
  - Services: `CamelCase` + `Service` suffix (e.g., `SummaryDomainService`).
  - Directives: `kebab-case` element names (e.g., `<month-selector>`), JS names `camelCase` (e.g., `monthSelector`).
  - Files: `feature.component-type.name.js` (as per structure defined above).

- Folder conventions:
  - `core` for cross-cutting models/services.
  - `features` for feature-specific components.


## 15. Component Registry

Each component is listed with name, type, file path, registered module, registration method, dependencies.

### 15.1 Modules

1. Module: `davmsMonthlySummary`
   - Type: Angular Module
   - File Path: `src/app/app.module.js`
   - Registration: `angular.module('davmsMonthlySummary', [...])`
   - Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`

### 15.2 Controllers

1. `MonthlySummaryController`
   - Type: Controller
   - File Path: `src/app/features/monthly-summary/controllers/monthly-summary.controller.js`
   - Registered Module: `davmsMonthlySummary`
   - Registration Method: `.controller('MonthlySummaryController', MonthlySummaryController)`
   - Dependencies: `SummaryDomainService`, `EnvConfigService`, `LoggingService`

2. `MonthSelectorController`
   - Type: Directive Controller
   - File Path: `src/app/features/monthly-summary/directives/month-selector.directive.js`
   - Registered Module: `davmsMonthlySummary`
   - Registration Method: `.controller('MonthSelectorController', MonthSelectorController)` (inside directive file)
   - Dependencies: None

3. `MonthlySummaryCardsController`
   - Type: Directive Controller
   - File Path: `src/app/features/monthly-summary/directives/monthly-summary-cards.directive.js`
   - Registered Module: `davmsMonthlySummary`
   - Registration Method: `.controller('MonthlySummaryCardsController', MonthlySummaryCardsController)`
   - Dependencies: None

4. `MonthlySummaryChartController`
   - Type: Directive Controller
   - File Path: `src/app/features/monthly-summary/directives/monthly-summary-chart.directive.js`
   - Registered Module: `davmsMonthlySummary`
   - Registration Method: `.controller('MonthlySummaryChartController', MonthlySummaryChartController)`
   - Dependencies: None

### 15.3 Services

1. `EnvConfigService`
   - Type: Service
   - File Path: `src/app/core/services/env-config.service.js`
   - Dependencies: `$http`, `$q`

2. `LoggingService`
   - Type: Service
   - File Path: `src/app/core/services/logging.service.js`
   - Dependencies: `$injector`, `$log`

3. `SummaryDomainService`
   - Type: Service
   - File Path: `src/app/core/services/summary-domain.service.js`
   - Dependencies: `EnvConfigService`, `SummaryApiService`, `SummaryMockService`, `MonthContextService`, `KpiDomainService`, `BreakdownDomainService`, `$q`

4. `SummaryApiService`
   - Type: Service
   - File Path: `src/app/core/services/summary-api.service.js`
   - Dependencies: `$http`, `$q`, `EnvConfigService`

5. `SummaryMockService`
   - Type: Service
   - File Path: `src/app/core/services/summary-mock.service.js`
   - Dependencies: `$q`, `$timeout`, `ERROR_CODES`

6. `MonthContextService`
   - Type: Service
   - File Path: `src/app/core/services/month-context.service.js`
   - Dependencies: `EnvConfigService`, `$q`

7. `KpiDomainService`
   - Type: Service
   - File Path: `src/app/core/services/kpi-domain.service.js`
   - Dependencies: None

8. `BreakdownDomainService`
   - Type: Service
   - File Path: `src/app/core/services/breakdown-domain.service.js`
   - Dependencies: None

9. `TelemetryService`
   - Type: Service
   - File Path: `src/app/telemetry/telemetry.service.js`
   - Dependencies: `$injector`, `EnvConfigService`

### 15.4 Factories

1. `HttpInterceptor`
   - Type: Factory (HTTP interceptor)
   - File Path: `src/app/core/services/http-interceptor.service.js`
   - Dependencies: `$q`, `$injector`

### 15.5 Directives

1. `monthSelector`
   - Type: Directive
   - File Path: `src/app/features/monthly-summary/directives/month-selector.directive.js`
   - Registered Module: `davmsMonthlySummary`
   - Dependencies: None

2. `monthlySummaryCards`
   - Type: Directive
   - File Path: `src/app/features/monthly-summary/directives/monthly-summary-cards.directive.js`
   - Registered Module: `davmsMonthlySummary`
   - Dependencies: None

3. `monthlySummaryChart`
   - Type: Directive
   - File Path: `src/app/features/monthly-summary/directives/monthly-summary-chart.directive.js`
   - Registered Module: `davmsMonthlySummary`
   - Dependencies: None

### 15.6 Filters

1. `currencySafe`
   - Type: Filter
   - File Path: `src/app/core/filters/currency-safe.filter.js`
   - Dependencies: `$filter`

2. `monthDisplay`
   - Type: Filter
   - File Path: `src/app/core/filters/month-display.filter.js`
   - Dependencies: None

### 15.7 Models

1. `MonthlySummaryModel`
   - Type: Model (ES6 class)
   - File Path: `src/app/core/models/summary.models.js`

2. `BreakdownItemModel`
   - Type: Model
   - File Path: `src/app/core/models/summary.models.js`

3. `MonthContextModel`
   - Type: Model
   - File Path: `src/app/core/models/summary.models.js`

4. `ErrorModel`
   - Type: Model
   - File Path: `src/app/core/models/error.models.js`

### 15.8 Constants

1. `APP_CONFIG`
   - Type: Constant
   - File Path: `src/app/core/constants/app.constants.js`

2. `ERROR_CODES`
   - Type: Constant
   - File Path: `src/app/core/constants/error.constants.js`

### 15.9 Config / Run Blocks

1. `AppConfig`
   - Type: Config block
   - File Path: `src/app/app.config.js`
   - Dependencies: `$httpProvider`

2. `AppRoutes`
   - Type: Config block
   - File Path: `src/app/app.routes.js`
   - Dependencies: `$routeProvider`

3. `AppRun`
   - Type: Run block
   - File Path: `src/app/app.run.js`
   - Dependencies: `EnvConfigService`, `TelemetryService`

### 15.10 Interceptors

- `HttpInterceptor` (see 15.4).


## 16. Data Flow (End-to-End)

### 16.1 Success Flow

1. **User Action**: User navigates to `/monthly-summary` route.
2. **Controller**: `MonthlySummaryController` `vm.init()` is invoked.
3. **Service**: Controller calls `SummaryDomainService.getMonthlySummary(accountId, selectedMonth)`.
4. **Model**: `SummaryDomainService` uses `MonthContextService` to create `MonthContextModel`; then either `SummaryMockService` or `SummaryApiService` returns JSON which is mapped to `MonthlySummaryModel` and `BreakdownItemModel` instances.
5. **Directive/View**:
   - `month-selector` allows user to change month.
   - `monthly-summary-cards` displays KPIs from `MonthlySummaryModel`.
   - `monthly-summary-chart` displays breakdown.
6. **UI Update**: `vm.summary` is bound to view; Angular digest updates UI with new data.

### 16.2 Failure Flow

1. **User Action**: Same as success flow.
2. **Controller**: Calls `SummaryDomainService.getMonthlySummary(...)`.
3. **Service**: A validation or HTTP error occurs.
4. **Model**: `ErrorModel` instance is produced by `MonthContextService` or `HttpInterceptor` and propagated.
5. **Directive/View**: `MonthlySummaryController` sets `vm.error` and clears `vm.summary`; `monthly-summary-cards` and `chart` are hidden; error banner is displayed.
6. **UI Update**: Angular updates view accordingly.


## 17. Architecture Constraints Satisfaction

- Only one Angular module declaration (`app.module.js`).
- All other Angular files use `angular.module('davmsMonthlySummary')` getter syntax.
- No circular dependencies:
  - Services are layered (EnvConfigService, domain services, API/mocks, logging). HttpInterceptor does not depend on `$http`.
  - LoggingService lazily resolves `$http` via `$injector` to avoid direct circular dependency.
  - Startup services (EnvConfigService, TelemetryService) do not depend on API services.
- Every dependency is registered exactly once.


## 18. Implementation Validation

This LLD defines:
- Folder structure and every source file.
- Every component (controllers, services, directives, filters, models, constants).
- Every dependency and injected service.
- Route (`/monthly-summary`) and its controller/template.
- Every `templateUrl` used by directives and route.
- Script references and their loading order.
- Stylesheets and their loading order.
- Models and their properties, types, and sample JSON.
- REST API contract for monthly summary.
- Environment variables and configuration properties (`ENV_CONFIG`, feature flags, telemetry settings).
- Mock responses and behavior via `SummaryMockService`.
- Public methods of components and their responsibilities.
- Bootstrap sequence via `index.html`, `app.module.js`, config, routes, run.

The Code Generation Agent can generate the complete application using ONLY this LLD without making architectural decisions.
