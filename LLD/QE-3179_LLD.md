# LLD: QE-3179 – DAVMS1 Monthly Spending Summary Dashboard

## 1. Technology Stack

### 1.1 Frontend
- HTML5
- CSS3
- JavaScript ES6 (strict mode in all scripts)
- AngularJS 1.7.9 (from Google CDN)
- Angular Route 1.7.9 (from Google CDN)
- Angular Animate 1.7.9 (from Google CDN)
- Angular Sanitize 1.7.9 (from Google CDN)
- Angular UI Bootstrap 2.5.6 (from CDN)
- Bootstrap 3.4.1 (CSS only, from CDN)
- Chart.js 2.9.4 (from CDN)

### 1.2 Architecture
- AngularJS MVC
- Single Page Application (SPA)
- REST-based data access
- Dependency Injection via AngularJS DI
- ControllerAs syntax (no $scope mutation from templates)
- IIFE (Immediately Invoked Function Expression) module pattern for all JS files

### 1.3 Runtime Services
- $http
- $q
- $timeout

### 1.4 Browser Support
- Chrome (latest stable)
- Microsoft Edge (Chromium-based)

Framework/library versions are fixed and must not be upgraded or replaced.


## 2. Repository Structure

Root of repository: `/`

```text
/
├─ index.html
├─ src/
│  ├─ app.module.js
│  ├─ app.config.js
│  ├─ app.run.js
│  ├─ core/
│  │  ├─ config/
│  │  │  ├─ env.config.js
│  │  │  └─ routes.config.js
│  │  ├─ models/
│  │  │  ├─ monthly-summary.model.js
│  │  │  ├─ spend-breakdown.model.js
│  │  │  ├─ kpi.model.js
│  │  │  ├─ error.model.js
│  │  │  └─ user-account.model.js
│  │  ├─ services/
│  │  │  ├─ env-config.service.js
│  │  │  ├─ monthly-summary.api.service.js
│  │  │  ├─ monthly-summary.mock.service.js
│  │  │  ├─ monthly-summary.service.js
│  │  │  ├─ logging.service.js
│  │  │  └─ http-interceptor.service.js
│  │  ├─ filters/
│  │  │  ├─ currency-symbol.filter.js
│  │  │  └─ month-label.filter.js
│  │  └─ directives/
│  │     ├─ kpi-card.directive.js
│  │     ├─ summary-chart.directive.js
│  │     └─ loading-spinner.directive.js
│  ├─ features/
│  │  └─ monthly-summary/
│  │     ├─ monthly-summary.controller.js
│  │     ├─ monthly-summary.template.html
│  │     ├─ monthly-summary.styles.css
│  │     └─ components/
│  │        ├─ month-selector.directive.js
│  │        ├─ month-selector.template.html
│  │        └─ breakdown-table.directive.js
│  │           └─ breakdown-table.template.html
│  └─ assets/
│     ├─ images/
│     │  ├─ card-icon.png
│     │  └─ spend-icon.png
│     └─ icons/
│        ├─ kpi-total.svg
│        ├─ kpi-count.svg
│        └─ kpi-average.svg
├─ config/
│  ├─ env/
│  │  ├─ env.dev.json
│  │  ├─ env.qa.json
│  │  └─ env.prod.json
│  └─ telemetry/
│     └─ telemetry.config.json
└─ package.json (for tooling only, not runtime)
```

All paths above are valid relative to repository root. All referenced templates, scripts, stylesheets, models, and configuration files exist in the structure.


## 3. index.html Specification

### 3.1 Repository Path
- `/index.html`

### 3.2 Purpose
- Root HTML document for the SPA.
- Declares AngularJS root module and bootstraps application.
- Defines header, `ng-view` outlet, and global layout container.

### 3.3 Complete index.html Content

```html
<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DAVMS1 Monthly Spending Summary Dashboard</title>

    <!-- Stylesheet loading order -->
    <!-- 1. Bootstrap CSS (CDN) -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

    <!-- 2. Feature-specific styles -->
    <link rel="stylesheet" href="src/features/monthly-summary/monthly-summary.styles.css">

    <!-- 3. Any additional global styles could be added here (none defined in this LLD) -->
</head>
<body>
    <div class="container-fluid" ng-controller="MonthlySummaryController as vm">
        <header class="row">
            <div class="col-xs-12">
                <h1 class="page-header">Monthly Spending Summary</h1>
            </div>
        </header>

        <!-- Main content area using ng-view for routing -->
        <main class="row">
            <div class="col-xs-12" ng-view></div>
        </main>

        <footer class="row">
            <div class="col-xs-12 text-center">
                <small>&copy; DAVMS1 Credit Card Services</small>
            </div>
        </footer>
    </div>

    <!-- Script loading order -->

    <!-- 1. AngularJS core and libraries (CDN only, no local Angular) -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js"></script>

    <!-- 2. Angular UI Bootstrap (CDN) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js"></script>

    <!-- 3. Chart.js (CDN) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js"></script>

    <!-- 4. Application scripts (local) -->
    <!-- Root module, config, run -->
    <script src="src/app.module.js"></script>
    <script src="src/app.config.js"></script>
    <script src="src/app.run.js"></script>

    <!-- Core config -->
    <script src="src/core/config/env.config.js"></script>
    <script src="src/core/config/routes.config.js"></script>

    <!-- Models -->
    <script src="src/core/models/monthly-summary.model.js"></script>
    <script src="src/core/models/spend-breakdown.model.js"></script>
    <script src="src/core/models/kpi.model.js"></script>
    <script src="src/core/models/error.model.js"></script>
    <script src="src/core/models/user-account.model.js"></script>

    <!-- Services -->
    <script src="src/core/services/env-config.service.js"></script>
    <script src="src/core/services/logging.service.js"></script>
    <script src="src/core/services/http-interceptor.service.js"></script>
    <script src="src/core/services/monthly-summary.api.service.js"></script>
    <script src="src/core/services/monthly-summary.mock.service.js"></script>
    <script src="src/core/services/monthly-summary.service.js"></script>

    <!-- Filters -->
    <script src="src/core/filters/currency-symbol.filter.js"></script>
    <script src="src/core/filters/month-label.filter.js"></script>

    <!-- Directives -->
    <script src="src/core/directives/kpi-card.directive.js"></script>
    <script src="src/core/directives/summary-chart.directive.js"></script>
    <script src="src/core/directives/loading-spinner.directive.js"></script>

    <!-- Feature: Monthly Summary -->
    <script src="src/features/monthly-summary/monthly-summary.controller.js"></script>
    <script src="src/features/monthly-summary/components/month-selector.directive.js"></script>
    <script src="src/features/monthly-summary/components/breakdown-table.directive.js"></script>
</body>
</html>
```

### 3.4 Component Type
- Root HTML file for SPA.

### 3.5 Dependencies
- Depends on AngularJS, Angular Route, Angular Animate, Angular Sanitize, Angular UI Bootstrap, Chart.js.
- References all application script files listed in section 3.3.


## 4. Angular Application Bootstrap

### 4.1 Root Module Declaration

Only one file declares the root AngularJS module.

#### File
- `/src/app.module.js`

#### Purpose
- Declare AngularJS root module `app`.

#### Content & Registration

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
- Registration Method: `angular.module('app', [...])` (only occurrence).
- Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`.

### 4.2 Global Config Block

#### File
- `/src/app.config.js`

#### Responsibility
- Configure $httpProvider for interceptor registration.

#### Registration

```javascript
(function () {
    'use strict';

    appConfig.$inject = ['$httpProvider'];

    angular
        .module('app')
        .config(appConfig);

    function appConfig($httpProvider) {
        $httpProvider.interceptors.push('HttpInterceptorService');
    }
})();
```

- Type: Config.
- Injected Services: `$httpProvider`.
- Public Methods: none (config function).

### 4.3 Global Run Block

#### File
- `/src/app.run.js`

#### Responsibility
- Application startup initialization independent of API services.

#### Registration

```javascript
(function () {
    'use strict';

    appRun.$inject = ['EnvConfigService', '$rootScope'];

    angular
        .module('app')
        .run(appRun);

    function appRun(EnvConfigService, $rootScope) {
        // Load environment configuration into root scope for UI reference.
        var env = EnvConfigService.getActiveEnv();
        $rootScope.appName = 'DAVMS1 Monthly Spending Summary Dashboard';
        $rootScope.featureFlags = env.featureFlags;
    }
})();
```

- Type: Run block.
- Injected Services: `EnvConfigService`, `$rootScope`.
- Constraints: `EnvConfigService` is a startup service that does not depend on any API services.

### 4.4 Route Configuration

#### File
- `/src/core/config/routes.config.js`

#### Purpose
- Configure SPA routing: default route displays monthly summary dashboard.

#### Registration

```javascript
(function () {
    'use strict';

    routesConfig.$inject = ['$routeProvider'];

    angular
        .module('app')
        .config(routesConfig);

    function routesConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'src/features/monthly-summary/monthly-summary.template.html',
                controller: 'MonthlySummaryController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();
```

- Default Route: `/`.
- TemplateUrl: `src/features/monthly-summary/monthly-summary.template.html`.
- Controller: `MonthlySummaryController`.
- ControllerAs: `vm`.

### 4.5 Script Loading Order

- AngularJS core and libraries (CDN) loaded before any app scripts.
- `app.module.js` before any other module usage.
- `app.config.js` and `app.run.js` after module declaration.
- Config files (`env.config.js`, `routes.config.js`) after root module and before feature controllers/services use config values.
- Models and services loaded before controllers and directives that depend on them.
- Feature scripts loaded last.


## 5. Component Registry

### Modules

1. **Module: app**
   - Type: Angular module.
   - File Path: `src/app.module.js`.
   - Registration: `angular.module('app', [...])`.
   - Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`.
   - Public Methods: none.

### Controllers

1. **MonthlySummaryController**
   - Type: Controller.
   - File Path: `src/features/monthly-summary/monthly-summary.controller.js`.
   - Angular Module: `app`.
   - Registration Method: `angular.module('app').controller('MonthlySummaryController', MonthlySummaryController);`
   - Dependencies: `MonthlySummaryService`, `EnvConfigService`, `LoggingService`, `$filter`.
   - Injected Services: `MonthlySummaryService`, `EnvConfigService`, `LoggingService`, `$filter`.
   - Public Methods:
     - `vm.loadSummary(month, accountId)`
     - `vm.onMonthChange(month)`
     - `vm.retry()`
     - `vm.hasError()`
     - `vm.hasData()`

### Services / Factories

1. **EnvConfigService**
   - Type: Service.
   - File Path: `src/core/services/env-config.service.js`.
   - Registration: `angular.module('app').service('EnvConfigService', EnvConfigService);`
   - Dependencies: none.
   - Injected Services: none.
   - Public Methods:
     - `getActiveEnv()`
     - `isMockMode()`

2. **MonthlySummaryApiService**
   - Type: Service.
   - File Path: `src/core/services/monthly-summary.api.service.js`.
   - Registration: `angular.module('app').service('MonthlySummaryApiService', MonthlySummaryApiService);`
   - Dependencies: `$http`, `$q`, `EnvConfigService`.
   - Injected Services: `$http`, `$q`, `EnvConfigService`.
   - Public Methods:
     - `getMonthlySummary(requestModel)`

3. **MonthlySummaryMockService**
   - Type: Service.
   - File Path: `src/core/services/monthly-summary.mock.service.js`.
   - Registration: `angular.module('app').service('MonthlySummaryMockService', MonthlySummaryMockService);`
   - Dependencies: `$q`, `$timeout`, `EnvConfigService`.
   - Injected Services: `$q`, `$timeout`, `EnvConfigService`.
   - Public Methods:
     - `getMonthlySummary(requestModel)`

4. **MonthlySummaryService**
   - Type: Service.
   - File Path: `src/core/services/monthly-summary.service.js`.
   - Registration: `angular.module('app').service('MonthlySummaryService', MonthlySummaryService);`
   - Dependencies: `MonthlySummaryApiService`, `MonthlySummaryMockService`, `EnvConfigService`, `$q`.
   - Injected Services: `MonthlySummaryApiService`, `MonthlySummaryMockService`, `EnvConfigService`, `$q`.
   - Public Methods:
     - `getMonthlySummary(requestModel)`

5. **LoggingService**
   - Type: Service.
   - File Path: `src/core/services/logging.service.js`.
   - Registration: `angular.module('app').service('LoggingService', LoggingService);`
   - Dependencies: `$injector`.
   - Injected Services: `$injector` (lazy resolves `$http` when needed).
   - Public Methods:
     - `info(message, context)`
     - `error(message, context)`
     - `warn(message, context)`

6. **HttpInterceptorService**
   - Type: Factory (interceptor).
   - File Path: `src/core/services/http-interceptor.service.js`.
   - Registration: `angular.module('app').factory('HttpInterceptorService', HttpInterceptorService);`
   - Dependencies: `$q`, `LoggingService`.
   - Injected Services: `$q`, `LoggingService`.
   - Public Methods (interceptor handlers):
     - `request(config)`
     - `response(response)`
     - `responseError(rejection)`

### Directives

1. **kpiCard**
   - Type: Directive.
   - File Path: `src/core/directives/kpi-card.directive.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').directive('kpiCard', kpiCard);`
   - Dependencies: none.
   - Injected Services: none.
   - Public Methods: none (uses isolated scope bindings).

2. **summaryChart**
   - Type: Directive.
   - File Path: `src/core/directives/summary-chart.directive.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').directive('summaryChart', summaryChart);`
   - Dependencies: none.
   - Injected Services: none.
   - Public Methods:
     - `vm.renderChart()`

3. **loadingSpinner**
   - Type: Directive.
   - File Path: `src/core/directives/loading-spinner.directive.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').directive('loadingSpinner', loadingSpinner);`
   - Dependencies: none.
   - Injected Services: none.
   - Public Methods: none.

4. **monthSelector**
   - Type: Directive.
   - File Path: `src/features/monthly-summary/components/month-selector.directive.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').directive('monthSelector', monthSelector);`
   - Dependencies: none.
   - Injected Services: none.
   - Public Methods:
     - `vm.onMonthSelected()`

5. **breakdownTable**
   - Type: Directive.
   - File Path: `src/features/monthly-summary/components/breakdown-table.directive.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').directive('breakdownTable', breakdownTable);`
   - Dependencies: none.
   - Injected Services: none.
   - Public Methods: none.

### Filters

1. **currencySymbol**
   - Type: Filter.
   - File Path: `src/core/filters/currency-symbol.filter.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').filter('currencySymbol', currencySymbol);`
   - Dependencies: none.
   - Injected Services: none.
   - Public Methods:
     - `filter(inputCurrencyCode)`

2. **monthLabel**
   - Type: Filter.
   - File Path: `src/core/filters/month-label.filter.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').filter('monthLabel', monthLabel);`
   - Dependencies: none.
   - Injected Services: none.
   - Public Methods:
     - `filter(inputMonthString)`

### Models

1. **MonthlySummaryModel**
   - Type: Factory (model constructor).
   - File Path: `src/core/models/monthly-summary.model.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').factory('MonthlySummaryModel', MonthlySummaryModelFactory);`
   - Dependencies: none.
   - Public Methods:
     - Constructor: `MonthlySummaryModel(data)`.

2. **SpendBreakdownModel**
   - Type: Factory (model constructor).
   - File Path: `src/core/models/spend-breakdown.model.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').factory('SpendBreakdownModel', SpendBreakdownModelFactory);`
   - Dependencies: none.
   - Public Methods:
     - Constructor: `SpendBreakdownModel(data)`.

3. **KpiModel**
   - Type: Factory (model constructor).
   - File Path: `src/core/models/kpi.model.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').factory('KpiModel', KpiModelFactory);`
   - Dependencies: none.
   - Public Methods:
     - Constructor: `KpiModel(data)`.

4. **ErrorModel**
   - Type: Factory (model constructor).
   - File Path: `src/core/models/error.model.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').factory('ErrorModel', ErrorModelFactory);`
   - Dependencies: none.
   - Public Methods:
     - Constructor: `ErrorModel(data)`.

5. **UserAccountModel**
   - Type: Factory (model constructor).
   - File Path: `src/core/models/user-account.model.js`.
   - Angular Module: `app`.
   - Registration: `angular.module('app').factory('UserAccountModel', UserAccountModelFactory);`
   - Dependencies: none.
   - Public Methods:
     - Constructor: `UserAccountModel(data)`.

### Constants / Values

- No global constants or values beyond configuration in `EnvConfigService`. Configuration is loaded from JSON environment files.

### Configs

1. **EnvConfig**
   - Type: Configuration file + service.
   - File Paths:
     - JSON: `config/env/env.dev.json`, `config/env/env.qa.json`, `config/env/env.prod.json`.
     - Loader: `src/core/config/env.config.js`.
   - Purpose: Provide environment-specific properties (`apiBaseUrl`, `apiTimeoutMs`, `maxLookbackMonths`, `useMockData`, `featureFlags`, `telemetry`).

2. **RoutesConfig**
   - Type: Angular config block (see 4.4).

### Interceptors

1. **HttpInterceptorService** (see Services).


## 6. Per-File Implementation Specification

### 6.1 `src/core/config/env.config.js`

- Repository Path: `/src/core/config/env.config.js`
- Angular Registration: `angular.module('app').config(envConfig);`

#### Responsibility
- Load environment JSON configuration based on a fixed environment selection (e.g., dev/qa/prod) and expose via `EnvConfigService`.
- In this LLD, environment selection is static (e.g., `dev`) and can be later wired to build-time tooling.

#### Implementation

```javascript
(function () {
    'use strict';

    envConfig.$inject = [];

    angular
        .module('app')
        .config(envConfig);

    function envConfig() {
        // Environment configuration is loaded via EnvConfigService from static JSON files.
        // No run-time HTTP calls in this config block.
    }
})();
```

- Injected Dependencies: none.
- Public Methods: none.
- Private Methods: none.
- Business Rules: none (delegated to `EnvConfigService`).
- Error Handling / Logging: none.
- Files Referenced: environment JSON files, `EnvConfigService`.
- Files Depending on It: `EnvConfigService`, `app.run.js`.

### 6.2 `config/env/env.dev.json`

- Repository Path: `/config/env/env.dev.json`
- Purpose: Development environment configuration.
- Component Type: JSON configuration.
- Dependencies: None.

#### Content

```json
{
  "apiBaseUrl": "https://dev.api.davms1.example.com",
  "apiTimeoutMs": 8000,
  "maxLookbackMonths": 12,
  "useMockData": true,
  "featureFlags": {
    "showAverageTransaction": true,
    "showMaxTransaction": true,
    "showMinTransaction": true
  },
  "telemetry": {
    "enabled": true,
    "endpoint": "https://dev.telemetry.davms1.example.com",
    "sampleRate": 0.5
  }
}
```

### 6.3 `config/env/env.qa.json`

- Path: `/config/env/env.qa.json`
- Purpose: QA environment configuration.

```json
{
  "apiBaseUrl": "https://qa.api.davms1.example.com",
  "apiTimeoutMs": 8000,
  "maxLookbackMonths": 12,
  "useMockData": true,
  "featureFlags": {
    "showAverageTransaction": true,
    "showMaxTransaction": false,
    "showMinTransaction": false
  },
  "telemetry": {
    "enabled": true,
    "endpoint": "https://qa.telemetry.davms1.example.com",
    "sampleRate": 0.5
  }
}
```

### 6.4 `config/env/env.prod.json`

- Path: `/config/env/env.prod.json`
- Purpose: Production environment configuration.

```json
{
  "apiBaseUrl": "https://api.davms1.example.com",
  "apiTimeoutMs": 5000,
  "maxLookbackMonths": 12,
  "useMockData": false,
  "featureFlags": {
    "showAverageTransaction": true,
    "showMaxTransaction": true,
    "showMinTransaction": true
  },
  "telemetry": {
    "enabled": true,
    "endpoint": "https://telemetry.davms1.example.com",
    "sampleRate": 1.0
  }
}
```

### 6.5 `config/telemetry/telemetry.config.json`

- Path: `/config/telemetry/telemetry.config.json`
- Purpose: Telemetry configuration referenced by `EnvConfigService`.

```json
{
  "defaultContext": "DAVMS1-Monthly-Spending-Summary",
  "logLevel": "info"
}
```

### 6.6 `src/core/services/env-config.service.js`

- Path: `/src/core/services/env-config.service.js`
- Angular Registration: `angular.module('app').service('EnvConfigService', EnvConfigService);`

#### Responsibility
- Load environment configuration from static JSON file (for simplicity, dev env).
- Provide accessors for environment properties.
- When `useMockData` changes, the application switches between mock and production mode in `MonthlySummaryService`.

#### Implementation

```javascript
(function () {
    'use strict';

    EnvConfigService.$inject = [];

    function EnvConfigService() {
        var env = {
            apiBaseUrl: 'https://dev.api.davms1.example.com',
            apiTimeoutMs: 8000,
            maxLookbackMonths: 12,
            useMockData: true,
            featureFlags: {
                showAverageTransaction: true,
                showMaxTransaction: true,
                showMinTransaction: true
            },
            telemetry: {
                enabled: true,
                endpoint: 'https://dev.telemetry.davms1.example.com',
                sampleRate: 0.5
            }
        };

        var service = {
            getActiveEnv: getActiveEnv,
            isMockMode: isMockMode
        };

        return service;

        function getActiveEnv() {
            return env;
        }

        function isMockMode() {
            return !!env.useMockData;
        }
    }

    angular
        .module('app')
        .service('EnvConfigService', EnvConfigService);
})();
```

- Injected Dependencies: none.
- Public Methods: `getActiveEnv()`, `isMockMode()`.
- Input Models: none.
- Output Models: plain JS object representing environment.
- Business Rules: `useMockData` governs mock vs production mode.
- Error Handling: none (configuration is static and validated at design time).
- Logging: none.
- Files Referenced: environment JSON documentation; not used programmatically.
- Files Depending on It: `app.run.js`, `MonthlySummaryApiService`, `MonthlySummaryMockService`, `MonthlySummaryService`.

### 6.7 `src/core/services/logging.service.js`

- Path: `/src/core/services/logging.service.js`
- Registration: `angular.module('app').service('LoggingService', LoggingService);`

#### Responsibility
- Centralized logging for info, warning, and error messages.
- Must lazily resolve `$http` to avoid direct dependency and potential circular references.

#### Implementation

```javascript
(function () {
    'use strict';

    LoggingService.$inject = ['$injector'];

    function LoggingService($injector) {
        var httpInstance;

        var service = {
            info: info,
            warn: warn,
            error: error
        };

        return service;

        function getHttp() {
            if (!httpInstance) {
                httpInstance = $injector.get('$http');
            }
            return httpInstance;
        }

        function info(message, context) {
            console.log('[INFO]', message, context || {});
        }

        function warn(message, context) {
            console.warn('[WARN]', message, context || {});
        }

        function error(message, context) {
            console.error('[ERROR]', message, context || {});
            var http = getHttp();
            var telemetryPayload = {
                level: 'error',
                message: message,
                context: context || {}
            };
            http.post('https://dev.telemetry.davms1.example.com/logs', telemetryPayload);
        }
    }

    angular
        .module('app')
        .service('LoggingService', LoggingService);
})();
```

- Injected Dependencies: `$injector` (lazily resolves `$http`).
- Public Methods: `info`, `warn`, `error`.
- Business Rules: Errors are sent to telemetry endpoint; info/warn only logged to console.
- Error Handling: None for telemetry POST failure (non-critical).
- Files Depending on It: `MonthlySummaryController`, `HttpInterceptorService`.

### 6.8 `src/core/services/http-interceptor.service.js`

- Path: `/src/core/services/http-interceptor.service.js`
- Registration: `angular.module('app').factory('HttpInterceptorService', HttpInterceptorService);`

#### Responsibility
- Intercept HTTP responses and errors to apply generic error handling and logging.
- Must not depend on `$http` (constraint).

#### Implementation

```javascript
(function () {
    'use strict';

    HttpInterceptorService.$inject = ['$q', 'LoggingService'];

    function HttpInterceptorService($q, LoggingService) {
        return {
            request: function (config) {
                return config;
            },
            response: function (response) {
                return response;
            },
            responseError: function (rejection) {
                LoggingService.error('HTTP error', {
                    status: rejection.status,
                    url: rejection.config && rejection.config.url
                });
                return $q.reject(rejection);
            }
        };
    }

    angular
        .module('app')
        .factory('HttpInterceptorService', HttpInterceptorService);
})();
```

- Injected Dependencies: `$q`, `LoggingService`.
- Public Methods: interceptor handlers.
- Business Rules: Log all HTTP errors to LoggingService.
- Error Handling: Propagates rejections to calling code.

### 6.9 Model Specifications

#### 6.9.1 `src/core/models/monthly-summary.model.js`

- Path: `/src/core/models/monthly-summary.model.js`
- Registration: `angular.module('app').factory('MonthlySummaryModel', MonthlySummaryModelFactory);`

##### Responsibility
- Represent the aggregated monthly summary returned by API/mock.

##### Model Properties

```javascript
(function () {
    'use strict';

    function MonthlySummaryModel(data) {
        data = data || {};

        this.customerId = data.customerId || '';
        this.accountId = data.accountId || '';
        this.month = data.month || '';
        this.currencyCode = data.currencyCode || 'USD';
        this.totalSpend = typeof data.totalSpend === 'number' ? data.totalSpend : 0;
        this.transactionCount = typeof data.transactionCount === 'number' ? data.transactionCount : 0;
        this.averageTransactionAmount = typeof data.averageTransactionAmount === 'number' ? data.averageTransactionAmount : 0;
        this.maxTransactionAmount = typeof data.maxTransactionAmount === 'number' ? data.maxTransactionAmount : 0;
        this.minTransactionAmount = typeof data.minTransactionAmount === 'number' ? data.minTransactionAmount : 0;
        this.lastUpdatedUtc = data.lastUpdatedUtc || null;
        this.breakdown = (data.breakdown || []).map(function (item) {
            return new SpendBreakdownModel(item);
        });
    }

    MonthlySummaryModel.prototype.isEmpty = function () {
        return this.transactionCount === 0;
    };

    MonthlySummaryModelFactory.$inject = ['SpendBreakdownModel'];

    function MonthlySummaryModelFactory(SpendBreakdownModel) {
        return MonthlySummaryModel;
    }

    angular
        .module('app')
        .factory('MonthlySummaryModel', MonthlySummaryModelFactory);
})();
```

- Input: raw summary object.
- Output: `MonthlySummaryModel` instance.
- Business Rules: Default values for numeric fields, mapping breakdown items.
- Validation: Basic type checks; more complex validation handled at API.

##### Sample JSON

```json
{
  "customerId": "C12345",
  "accountId": "CC98765",
  "month": "2024-05",
  "currencyCode": "USD",
  "totalSpend": 1234.56,
  "transactionCount": 42,
  "averageTransactionAmount": 29.39,
  "maxTransactionAmount": 250.0,
  "minTransactionAmount": 3.5,
  "lastUpdatedUtc": "2024-05-31T23:59:59Z",
  "breakdown": [
    {
      "categoryCode": "GROCERIES",
      "categoryLabel": "Groceries",
      "totalAmount": 345.67,
      "transactionCount": 10
    },
    {
      "categoryCode": "TRAVEL",
      "categoryLabel": "Travel",
      "totalAmount": 500.0,
      "transactionCount": 5
    }
  ]
}
```

#### 6.9.2 `src/core/models/spend-breakdown.model.js`

- Path: `/src/core/models/spend-breakdown.model.js`
- Registration: `angular.module('app').factory('SpendBreakdownModel', SpendBreakdownModelFactory);`

```javascript
(function () {
    'use strict';

    function SpendBreakdownModel(data) {
        data = data || {};
        this.categoryCode = data.categoryCode || '';
        this.categoryLabel = data.categoryLabel || '';
        this.totalAmount = typeof data.totalAmount === 'number' ? data.totalAmount : 0;
        this.transactionCount = typeof data.transactionCount === 'number' ? data.transactionCount : 0;
    }

    SpendBreakdownModel.prototype.toChartDataPoint = function () {
        return {
            label: this.categoryLabel,
            value: this.totalAmount
        };
    };

    function SpendBreakdownModelFactory() {
        return SpendBreakdownModel;
    }

    angular
        .module('app')
        .factory('SpendBreakdownModel', SpendBreakdownModelFactory);
})();
```

##### Sample JSON

```json
{
  "categoryCode": "ONLINE",
  "categoryLabel": "Online Retail",
  "totalAmount": 123.45,
  "transactionCount": 7
}
```

#### 6.9.3 `src/core/models/kpi.model.js`

- Path: `/src/core/models/kpi.model.js`
- Registration: `angular.module('app').factory('KpiModel', KpiModelFactory);`

```javascript
(function () {
    'use strict';

    function KpiModel(data) {
        data = data || {};
        this.label = data.label || '';
        this.value = typeof data.value === 'number' ? data.value : 0;
        this.icon = data.icon || '';
        this.cssClass = data.cssClass || '';
    }

    KpiModel.prototype.formatValue = function () {
        return this.value;
    };

    function KpiModelFactory() {
        return KpiModel;
    }

    angular
        .module('app')
        .factory('KpiModel', KpiModelFactory);
})();
```

##### Sample JSON

```json
{
  "label": "Total Spend",
  "value": 1234.56,
  "icon": "src/assets/icons/kpi-total.svg",
  "cssClass": "kpi-total"
}
```

#### 6.9.4 `src/core/models/error.model.js`

- Path: `/src/core/models/error.model.js`
- Registration: `angular.module('app').factory('ErrorModel', ErrorModelFactory);`

```javascript
(function () {
    'use strict';

    function ErrorModel(data) {
        data = data || {};
        this.code = data.code || '';
        this.httpStatus = typeof data.httpStatus === 'number' ? data.httpStatus : 0;
        this.message = data.message || '';
        this.details = data.details || '';
        this.retryable = !!data.retryable;
    }

    ErrorModel.prototype.isClientError = function () {
        return this.httpStatus >= 400 && this.httpStatus < 500;
    };

    ErrorModel.prototype.isServerError = function () {
        return this.httpStatus >= 500;
    };

    function ErrorModelFactory() {
        return ErrorModel;
    }

    angular
        .module('app')
        .factory('ErrorModel', ErrorModelFactory);
})();
```

##### Sample JSON

```json
{
  "code": "SUMMARY_UNAVAILABLE",
  "httpStatus": 503,
  "message": "Were unable to show your monthly summary right now.",
  "details": "Downstream transaction service unavailable.",
  "retryable": true
}
```

#### 6.9.5 `src/core/models/user-account.model.js`

- Path: `/src/core/models/user-account.model.js`
- Registration: `angular.module('app').factory('UserAccountModel', UserAccountModelFactory);`

```javascript
(function () {
    'use strict';

    function UserAccountModel(data) {
        data = data || {};
        this.accountId = data.accountId || '';
        this.maskedAccountNumber = data.maskedAccountNumber || '';
        this.currencyCode = data.currencyCode || 'USD';
        this.displayLabel = data.displayLabel || '';
    }

    function UserAccountModelFactory() {
        return UserAccountModel;
    }

    angular
        .module('app')
        .factory('UserAccountModel', UserAccountModelFactory);
})();
```

##### Sample JSON

```json
{
  "accountId": "CC98765",
  "maskedAccountNumber": "**** **** **** 1234",
  "currencyCode": "USD",
  "displayLabel": "Primary Credit Card"
}
```

### 6.10 Filters

#### 6.10.1 `src/core/filters/currency-symbol.filter.js`

```javascript
(function () {
    'use strict';

    currencySymbol.$inject = [];

    function currencySymbol() {
        return function (inputCurrencyCode) {
            switch (inputCurrencyCode) {
                case 'USD':
                    return '$';
                case 'EUR':
                    return '€';
                case 'GBP':
                    return '£';
                default:
                    return inputCurrencyCode || '';
            }
        };
    }

    angular
        .module('app')
        .filter('currencySymbol', currencySymbol);
})();
```

#### 6.10.2 `src/core/filters/month-label.filter.js`

```javascript
(function () {
    'use strict';

    monthLabel.$inject = [];

    function monthLabel() {
        return function (inputMonthString) {
            // input: "YYYY-MM", e.g. "2024-05"
            if (!inputMonthString || inputMonthString.length !== 7) {
                return inputMonthString || '';
            }
            var parts = inputMonthString.split('-');
            var year = parts[0];
            var monthIndex = parseInt(parts[1], 10) - 1;
            var monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            if (monthIndex < 0 || monthIndex > 11) {
                return inputMonthString;
            }
            return monthNames[monthIndex] + ' ' + year;
        };
    }

    angular
        .module('app')
        .filter('monthLabel', monthLabel);
})();
```

### 6.11 Services – REST and Mock

#### 6.11.1 REST API Contract – Monthly Summary Endpoint

- URL: `${apiBaseUrl}/spending-summary/monthly`
- HTTP Method: `POST`
- Headers:
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <token>` (added by platform, not handled in UI)
- Query Parameters: none.
- Request Body:

```json
{
  "customerId": "C12345",
  "accountId": "CC98765",
  "month": "2024-05"
}
```

- Response Body (success): `MonthlySummaryModel` JSON as defined above.
- Success Response:
  - HTTP 200
  - Body: Monthly summary object.
- Error Responses:
  - 400: `{"code":"INVALID_REQUEST","message":"Invalid month or accountId."}`
  - 401: `{"code":"UNAUTHENTICATED","message":"Authentication required."}`
  - 403: `{"code":"UNAUTHORIZED","message":"Not allowed to access this account."}`
  - 404: `{"code":"SUMMARY_NOT_FOUND","message":"No summary found for the selected period."}`
  - 429: `{"code":"RATE_LIMITED","message":"Too many requests."}`
  - 500: `{"code":"SERVER_ERROR","message":"An unexpected error occurred."}`
  - 503: `{"code":"DOWNSTREAM_UNAVAILABLE","message":"Summary temporarily unavailable."}`
- Timeout: `apiTimeoutMs` from environment (e.g., 5000–8000 ms).
- Retry Policy: Client does not automatically retry. Backend services may implement server-side retries.

#### 6.11.2 `src/core/services/monthly-summary.api.service.js`

```javascript
(function () {
    'use strict';

    MonthlySummaryApiService.$inject = ['$http', '$q', 'EnvConfigService'];

    function MonthlySummaryApiService($http, $q, EnvConfigService) {
        var env = EnvConfigService.getActiveEnv();
        var service = {
            getMonthlySummary: getMonthlySummary
        };

        return service;

        function getMonthlySummary(requestModel) {
            var url = env.apiBaseUrl + '/spending-summary/monthly';
            var config = {
                timeout: env.apiTimeoutMs
            };

            return $http.post(url, requestModel, config)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }
    }

    angular
        .module('app')
        .service('MonthlySummaryApiService', MonthlySummaryApiService);
})();
```

- Input Models: Plain request object `{customerId, accountId, month}`.
- Output Models: Raw response object (later wrapped by `MonthlySummaryModel`).
- Error Handling: Rejects promise with HTTP error object.

#### 6.11.3 `src/core/services/monthly-summary.mock.service.js`

```javascript
(function () {
    'use strict';

    MonthlySummaryMockService.$inject = ['$q', '$timeout', 'EnvConfigService'];

    function MonthlySummaryMockService($q, $timeout, EnvConfigService) {
        var env = EnvConfigService.getActiveEnv();

        var service = {
            getMonthlySummary: getMonthlySummary
        };

        return service;

        function getMonthlySummary(requestModel) {
            var deferred = $q.defer();
            var delayMs = 500; // Delay simulation

            $timeout(function () {
                // Failure scenarios based on month
                if (requestModel.month === '1900-01') {
                    deferred.reject({
                        status: 503,
                        data: {
                            code: 'DOWNSTREAM_UNAVAILABLE',
                            message: 'Summary temporarily unavailable.'
                        }
                    });
                    return;
                }

                var mockResponse = {
                    customerId: requestModel.customerId,
                    accountId: requestModel.accountId,
                    month: requestModel.month,
                    currencyCode: 'USD',
                    totalSpend: 1234.56,
                    transactionCount: 42,
                    averageTransactionAmount: 29.39,
                    maxTransactionAmount: 250.0,
                    minTransactionAmount: 3.5,
                    lastUpdatedUtc: '2024-05-31T23:59:59Z',
                    breakdown: [
                        {
                            categoryCode: 'GROCERIES',
                            categoryLabel: 'Groceries',
                            totalAmount: 345.67,
                            transactionCount: 10
                        },
                        {
                            categoryCode: 'TRAVEL',
                            categoryLabel: 'Travel',
                            totalAmount: 500.0,
                            transactionCount: 5
                        },
                        {
                            categoryCode: 'ONLINE',
                            categoryLabel: 'Online Retail',
                            totalAmount: 388.89,
                            transactionCount: 27
                        }
                    ]
                };

                deferred.resolve({
                    status: 200,
                    data: mockResponse
                });
            }, delayMs);

            return deferred.promise;
        }
    }

    angular
        .module('app')
        .service('MonthlySummaryMockService', MonthlySummaryMockService);
})();
```

- Mock JSON: `mockResponse` object.
- Delay Simulation: 500 ms via `$timeout`.
- Failure Scenarios: Month `"1900-01"` returns 503 error.
- Contracts: Same shape as production API response.

#### 6.11.4 `src/core/services/monthly-summary.service.js`

```javascript
(function () {
    'use strict';

    MonthlySummaryService.$inject = ['MonthlySummaryApiService', 'MonthlySummaryMockService', 'EnvConfigService', '$q'];

    function MonthlySummaryService(MonthlySummaryApiService, MonthlySummaryMockService, EnvConfigService, $q) {
        var service = {
            getMonthlySummary: getMonthlySummary
        };

        return service;

        function getMonthlySummary(requestModel) {
            var useMock = EnvConfigService.isMockMode();
            var promise;

            if (useMock) {
                promise = MonthlySummaryMockService.getMonthlySummary(requestModel)
                    .then(function (response) {
                        return response.data;
                    });
            } else {
                promise = MonthlySummaryApiService.getMonthlySummary(requestModel);
            }

            return promise.then(function (data) {
                return data;
            }).catch(function (error) {
                return $q.reject(error);
            });
        }
    }

    angular
        .module('app')
        .service('MonthlySummaryService', MonthlySummaryService);
})();
```

- Business Rules: `useMockData` toggles between mock and production.
- Error Handling: Propagates errors.

### 6.12 Controller – MonthlySummaryController

- Path: `/src/features/monthly-summary/monthly-summary.controller.js`

```javascript
(function () {
    'use strict';

    MonthlySummaryController.$inject = ['MonthlySummaryService', 'EnvConfigService', 'LoggingService', '$filter', 'MonthlySummaryModel', 'ErrorModel'];

    function MonthlySummaryController(MonthlySummaryService, EnvConfigService, LoggingService, $filter, MonthlySummaryModel, ErrorModel) {
        var vm = this;

        vm.summary = null;
        vm.error = null;
        vm.loading = false;
        vm.selectedMonth = getCurrentMonth();
        vm.selectedAccountId = '';
        vm.kpis = [];

        vm.loadSummary = loadSummary;
        vm.onMonthChange = onMonthChange;
        vm.retry = retry;
        vm.hasError = hasError;
        vm.hasData = hasData;

        activate();

        function activate() {
            loadSummary(vm.selectedMonth, vm.selectedAccountId);
        }

        function getCurrentMonth() {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var monthString = month < 10 ? '0' + month : '' + month;
            return year + '-' + monthString;
        }

        function buildRequestModel(month, accountId) {
            return {
                customerId: 'CURRENT',
                accountId: accountId || 'PRIMARY',
                month: month
            };
        }

        function loadSummary(month, accountId) {
            vm.loading = true;
            vm.error = null;
            vm.summary = null;

            var requestModel = buildRequestModel(month, accountId);

            MonthlySummaryService.getMonthlySummary(requestModel)
                .then(function (data) {
                    vm.summary = new MonthlySummaryModel(data);
                    vm.kpis = buildKpis(vm.summary);
                    vm.loading = false;
                })
                .catch(function (error) {
                    vm.loading = false;
                    vm.summary = null;
                    vm.error = new ErrorModel({
                        code: error.data && error.data.code ? error.data.code : 'UNKNOWN_ERROR',
                        httpStatus: error.status || 0,
                        message: error.data && error.data.message ? error.data.message : 'Were unable to show your monthly summary right now.',
                        retryable: error.status === 503 || error.status === 500
                    });
                    LoggingService.error('Failed to load monthly summary', {
                        status: error.status,
                        code: vm.error.code
                    });
                });
        }

        function buildKpis(summary) {
            var env = EnvConfigService.getActiveEnv();
            var kpis = [];

            kpis.push({
                label: 'Total Spend',
                value: summary.totalSpend,
                icon: 'src/assets/icons/kpi-total.svg',
                cssClass: 'kpi-total'
            });

            kpis.push({
                label: 'Transactions',
                value: summary.transactionCount,
                icon: 'src/assets/icons/kpi-count.svg',
                cssClass: 'kpi-count'
            });

            if (env.featureFlags.showAverageTransaction) {
                kpis.push({
                    label: 'Average Transaction',
                    value: summary.averageTransactionAmount,
                    icon: 'src/assets/icons/kpi-average.svg',
                    cssClass: 'kpi-average'
                });
            }

            return kpis.map(function (kpi) {
                return new KpiModel(kpi);
            });
        }

        function onMonthChange(month) {
            vm.selectedMonth = month;
            loadSummary(vm.selectedMonth, vm.selectedAccountId);
        }

        function retry() {
            if (vm.error && vm.error.retryable) {
                loadSummary(vm.selectedMonth, vm.selectedAccountId);
            }
        }

        function hasError() {
            return !!vm.error;
        }

        function hasData() {
            return !!vm.summary && !vm.summary.isEmpty();
        }
    }

    angular
        .module('app')
        .controller('MonthlySummaryController', MonthlySummaryController);
})();
```

- Injected Dependencies: `MonthlySummaryService`, `EnvConfigService`, `LoggingService`, `$filter`, `MonthlySummaryModel`, `ErrorModel`.
- Business Rules: Build KPI cards, handle loading state, empty state, error state.

### 6.13 Directives

#### 6.13.1 `src/core/directives/kpi-card.directive.js`

```javascript
(function () {
    'use strict';

    kpiCard.$inject = [];

    function kpiCard() {
        return {
            restrict: 'E',
            scope: {
                kpi: '<'
            },
            bindToController: true,
            controllerAs: 'vm',
            controller: KpiCardController,
            templateUrl: 'src/features/monthly-summary/components/kpi-card.template.html',
            transclude: false,
            replace: false
        };
    }

    KpiCardController.$inject = [];

    function KpiCardController() {
        var vm = this;
    }

    angular
        .module('app')
        .directive('kpiCard', kpiCard);
})();
```

- Scope Bindings: `kpi` as one-way `<`.

##### Template Path
- `src/features/monthly-summary/components/kpi-card.template.html`

##### Template Content

```html
<div class="col-sm-4 col-xs-12">
    <div class="panel panel-default kpi-card" ng-class="vm.kpi.cssClass">
        <div class="panel-heading">
            <img ng-if="vm.kpi.icon" ng-src="{{vm.kpi.icon}}" alt="" class="kpi-icon">
            <span class="kpi-label">{{vm.kpi.label}}</span>
        </div>
        <div class="panel-body">
            <span class="kpi-value">{{vm.kpi.formatValue()}}</span>
        </div>
    </div>
</div>
```

#### 6.13.2 `src/core/directives/summary-chart.directive.js`

```javascript
(function () {
    'use strict';

    summaryChart.$inject = [];

    function summaryChart() {
        return {
            restrict: 'E',
            scope: {
                breakdown: '<',
                currencyCode: '@'
            },
            bindToController: true,
            controllerAs: 'vm',
            controller: SummaryChartController,
            templateUrl: 'src/features/monthly-summary/components/summary-chart.template.html',
            transclude: false,
            replace: false
        };
    }

    SummaryChartController.$inject = ['$element'];

    function SummaryChartController($element) {
        var vm = this;

        vm.$onInit = function () {
            vm.renderChart();
        };

        vm.$onChanges = function () {
            vm.renderChart();
        };

        vm.renderChart = function () {
            var canvas = $element[0].querySelector('canvas');
            if (!canvas || !vm.breakdown || vm.breakdown.length === 0) {
                return;
            }

            var labels = vm.breakdown.map(function (item) {
                return item.categoryLabel;
            });
            var data = vm.breakdown.map(function (item) {
                return item.totalAmount;
            });

            var context = canvas.getContext('2d');
            new Chart(context, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            '#337ab7', '#5cb85c', '#f0ad4e', '#d9534f', '#5bc0de'
                        ]
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
                                return label + ': ' + value;
                            }
                        }
                    }
                }
            });
        };
    }

    angular
        .module('app')
        .directive('summaryChart', summaryChart);
})();
```

- Restrict: `E`.
- Scope Bindings: `breakdown` `<`, `currencyCode` `@`.
- bindToController: true.
- TemplateUrl: `src/features/monthly-summary/components/summary-chart.template.html`.

##### Template Content

```html
<div class="summary-chart">
    <canvas></canvas>
</div>
```

#### 6.13.3 `src/core/directives/loading-spinner.directive.js`

```javascript
(function () {
    'use strict';

    loadingSpinner.$inject = [];

    function loadingSpinner() {
        return {
            restrict: 'E',
            scope: {
                visible: '<'
            },
            bindToController: true,
            controllerAs: 'vm',
            controller: LoadingSpinnerController,
            templateUrl: 'src/features/monthly-summary/components/loading-spinner.template.html',
            transclude: false,
            replace: false
        };
    }

    LoadingSpinnerController.$inject = [];

    function LoadingSpinnerController() {
        var vm = this;
    }

    angular
        .module('app')
        .directive('loadingSpinner', loadingSpinner);
})();
```

##### Template Content
- Path: `src/features/monthly-summary/components/loading-spinner.template.html`

```html
<div class="loading-spinner" ng-if="vm.visible">
    <span class="glyphicon glyphicon-refresh spinning"></span>
    <span>Loading summary...</span>
</div>
```

#### 6.13.4 `src/features/monthly-summary/components/month-selector.directive.js`

```javascript
(function () {
    'use strict';

    monthSelector.$inject = [];

    function monthSelector() {
        return {
            restrict: 'E',
            scope: {
                selectedMonth: '<',
                onChange: '&'
            },
            bindToController: true,
            controllerAs: 'vm',
            controller: MonthSelectorController,
            templateUrl: 'src/features/monthly-summary/components/month-selector.template.html',
            transclude: false,
            replace: false
        };
    }

    MonthSelectorController.$inject = [];

    function MonthSelectorController() {
        var vm = this;

        vm.monthInput = vm.selectedMonth;
        vm.onMonthSelected = onMonthSelected;

        function onMonthSelected() {
            if (typeof vm.onChange === 'function') {
                vm.onChange({ month: vm.monthInput });
            }
        }
    }

    angular
        .module('app')
        .directive('monthSelector', monthSelector);
})();
```

- Scope Bindings: `selectedMonth` `<`, `onChange` `&`.

##### Template Content
- Path: `src/features/monthly-summary/components/month-selector.template.html`

```html
<div class="month-selector form-inline">
    <label for="monthInput">Month</label>
    <input id="monthInput" type="month" class="form-control" ng-model="vm.monthInput">
    <button type="button" class="btn btn-primary" ng-click="vm.onMonthSelected()">View</button>
</div>
```

#### 6.13.5 `src/features/monthly-summary/components/breakdown-table.directive.js`

```javascript
(function () {
    'use strict';

    breakdownTable.$inject = [];

    function breakdownTable() {
        return {
            restrict: 'E',
            scope: {
                breakdown: '<',
                currencyCode: '@'
            },
            bindToController: true,
            controllerAs: 'vm',
            controller: BreakdownTableController,
            templateUrl: 'src/features/monthly-summary/components/breakdown-table.template.html',
            transclude: false,
            replace: false
        };
    }

    BreakdownTableController.$inject = [];

    function BreakdownTableController() {
        var vm = this;
    }

    angular
        .module('app')
        .directive('breakdownTable', breakdownTable);
})();
```

##### Template Content
- Path: `src/features/monthly-summary/components/breakdown-table.template.html`

```html
<table class="table table-striped" ng-if="vm.breakdown && vm.breakdown.length">
    <thead>
        <tr>
            <th>Category</th>
            <th class="text-right">Amount</th>
            <th class="text-right">Transactions</th>
        </tr>
    </thead>
    <tbody>
        <tr ng-repeat="item in vm.breakdown">
            <td>{{item.categoryLabel}}</td>
            <td class="text-right">{{item.totalAmount | number:2}}</td>
            <td class="text-right">{{item.transactionCount}}</td>
        </tr>
    </tbody>
</table>
<div ng-if="!vm.breakdown || !vm.breakdown.length" class="text-muted">
    No breakdown data available for this month.
</div>
```

### 6.14 Feature Template and Styles

#### 6.14.1 `src/features/monthly-summary/monthly-summary.template.html`

```html
<div class="monthly-summary-dashboard">
    <div class="row">
        <div class="col-xs-12">
            <month-selector selected-month="vm.selectedMonth" on-change="vm.onMonthChange(month)"></month-selector>
        </div>
    </div>

    <div class="row" ng-if="vm.loading">
        <div class="col-xs-12 text-center">
            <loading-spinner visible="vm.loading"></loading-spinner>
        </div>
    </div>

    <div class="row" ng-if="vm.hasError() && !vm.loading">
        <div class="col-xs-12">
            <div class="alert alert-danger">
                <strong>Error:</strong> {{vm.error.message}}
                <button type="button" class="btn btn-link" ng-if="vm.error.retryable" ng-click="vm.retry()">Try again</button>
            </div>
        </div>
    </div>

    <div class="row" ng-if="vm.hasData() && !vm.loading">
        <div class="col-xs-12">
            <h2>{{vm.selectedMonth | monthLabel}}</h2>
        </div>
    </div>

    <div class="row" ng-if="vm.hasData() && !vm.loading">
        <kpi-card ng-repeat="kpi in vm.kpis" kpi="kpi"></kpi-card>
    </div>

    <div class="row" ng-if="vm.hasData() && !vm.loading">
        <div class="col-md-6 col-xs-12">
            <summary-chart breakdown="vm.summary.breakdown" currency-code="{{vm.summary.currencyCode}}"></summary-chart>
        </div>
        <div class="col-md-6 col-xs-12">
            <breakdown-table breakdown="vm.summary.breakdown" currency-code="{{vm.summary.currencyCode}}"></breakdown-table>
        </div>
    </div>

    <div class="row" ng-if="!vm.loading && vm.summary && vm.summary.isEmpty()">
        <div class="col-xs-12 text-muted">
            No spending recorded for this month.
        </div>
    </div>
</div>
```

#### 6.14.2 `src/features/monthly-summary/monthly-summary.styles.css`

```css
.monthly-summary-dashboard {
    padding-top: 15px;
    padding-bottom: 30px;
}

.month-selector {
    margin-bottom: 20px;
}

.kpi-card {
    text-align: center;
}

.kpi-card .panel-heading {
    display: flex;
    align-items: center;
}

.kpi-card .kpi-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
}

.kpi-card .kpi-label {
    font-weight: bold;
}

.kpi-card .kpi-value {
    font-size: 1.5em;
}

.summary-chart {
    margin-top: 20px;
}

.loading-spinner .spinning {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
```

### 6.15 Assets

- `src/assets/images/card-icon.png`: Icon used in header or future enhancements.
- `src/assets/images/spend-icon.png`: Icon representing spending.
- `src/assets/icons/kpi-total.svg`: Icon for total spend KPI.
- `src/assets/icons/kpi-count.svg`: Icon for transaction count KPI.
- `src/assets/icons/kpi-average.svg`: Icon for average transaction KPI.

All assets are static image files referenced by CSS or templates.


## 7. UI Specification

### 7.1 Layout
- Header: Bootstrap `page-header` with title.
- Main: `ng-view` hosts monthly summary content.
- Footer: Centered text with branding.

### 7.2 Navigation
- Single route `/` for monthly summary.
- Month selector acts as primary interaction.

### 7.3 Bootstrap Grid
- Month selector occupies full width (`col-xs-12`).
- KPI cards arranged in row with `col-sm-4 col-xs-12`.
- Chart and breakdown table side-by-side on desktop (`col-md-6`), stacked on mobile (`col-xs-12`).

### 7.4 Components
- Cards: Bootstrap panels show KPIs.
- Tables: Bootstrap striped table for breakdown.
- Charts: Doughnut chart using Chart.js.

### 7.5 States
- Loading: `loading-spinner` with animated icon.
- Empty: Message “No spending recorded for this month.” when `transactionCount === 0`.
- Error: Bootstrap `alert-danger` with error message and retry button if retryable.

### 7.6 Styling
- Colors: Bootstrap defaults plus custom KPI classes.
- Typography: Bootstrap defaults.
- Spacing: Padding for dashboard, margin for selector and chart.
- Responsive behavior: Bootstrap grid ensures stacking on smaller screens; Chart.js configured as responsive.

### 7.7 Charts
- Type: Doughnut.
- Labels: Category labels from breakdown.
- Legend: Bottom positioned.
- Tooltips: Show category and amount.
- Axes: Not applicable (doughnut chart).
- Colors: Set of five colors cycling.

### 7.8 KPI Cards
- Bootstrap classes: `panel panel-default`, with custom `.kpi-card`.
- Card size: 1/3 width on small screens, full width on extra small.
- Icons: SVG icons per KPI.
- Alignment: Centered text, flex for header.
- Borders: Panel default.
- Shadows: None (can be added via CSS if needed).


## 8. Data Flow

### 8.1 Success Flow

User Action → Controller → Service → REST API / Mock → Model → Directive/View → UI Update

1. User selects month and clicks “View”.
2. `monthSelector` directive calls `onChange` binding; `MonthlySummaryController.onMonthChange` updates `selectedMonth` and calls `loadSummary`.
3. Controller invokes `MonthlySummaryService.getMonthlySummary` with request model.
4. Service decides between `MonthlySummaryApiService` or `MonthlySummaryMockService` based on `EnvConfigService.isMockMode()`.
5. REST API or mock returns raw summary JSON.
6. Controller wraps response into `MonthlySummaryModel` and builds `KpiModel` list.
7. `monthly-summary.template.html` binds `vm.summary`, `vm.kpis` to KPI cards, chart, table.
8. Directives render KPI cards, Chart.js doughnut, and breakdown table.
9. UI shows KPIs, chart, and table for selected month.

### 8.2 Failure Flow

1. Same as success until REST/mock call fails.
2. Error propagated to controller `catch`.
3. Controller creates `ErrorModel` from error data and sets `vm.error`, disables `vm.summary`.
4. `monthly-summary.template.html` shows error alert with message and optional retry button.
5. User can click “Try again”, which invokes `vm.retry()`, re-executing `loadSummary`.


## 9. Error Handling & Security

### 9.1 ErrorModel and HTTP Mapping
- `ErrorModel` holds `code`, `httpStatus`, `message`, `details`, `retryable`.
- HTTP Mapping:
  - 400: `INVALID_REQUEST`, not retryable.
  - 401: `UNAUTHENTICATED`, not retryable.
  - 403: `UNAUTHORIZED`, not retryable.
  - 404: `SUMMARY_NOT_FOUND`, not retryable.
  - 429: `RATE_LIMITED`, retryable (user may try later).
  - 500: `SERVER_ERROR`, retryable.
  - 503: `DOWNSTREAM_UNAVAILABLE`, retryable.

### 9.2 Validation
- Client-side validation: Month input is required; HTML5 `type="month"` ensures format.
- Server-side validation: API validates month and accountId.

### 9.3 Network Errors
- Interceptor logs network errors via `LoggingService`.
- Controller shows user-friendly message.

### 9.4 Retry Logic
- User-triggered only via retry button when `ErrorModel.retryable === true`.

### 9.5 Logging
- `LoggingService` logs errors and sends telemetry.
- No sensitive data (card numbers, PII) logged.

### 9.6 Security
- Input validation: Month format and accountId handled at API; client uses constrained UI controls.
- Sanitization: Angular Sanitize loaded for future use; current templates do not bind raw HTML.
- Authentication Hooks: Assumed handled by platform; this app relies on authenticated session.
- Authorization Hooks: Enforced at backend; client passes accountId and relies on secure API.
- Secure Communication: All API calls via HTTPS; enforced outside frontend code.
- Audit Logging: Per HLD, performed in backend; frontend does not implement audit logging.


## 10. Implementation Rules & Constraints

- ES6 syntax where applicable (e.g., `let`, `const`, arrow functions avoided in Angular DI contexts for maximum compatibility; strict mode used).
- All Angular components use explicit `$inject` arrays.
- ControllerAs syntax (`vm`) used everywhere; templates never reference `$scope`.
- Promise handling via `.then().catch()` using `$q`.
- Naming conventions:
  - Modules: `app`.
  - Controllers: `NameController`.
  - Services: `NameService`.
  - Factories/models: `NameModelFactory` returning constructor.
  - Directives: `name` in camelCase; element usage `<name></name>`.
- Folder conventions:
  - `core` for shared models, services, directives, filters, config.
  - `features` for feature-specific controllers and templates.
- File naming conventions: lowercase words separated by dashes; `.controller.js`, `.service.js`, `.directive.js`, `.model.js`, `.filter.js`, `.config.js`.
- Only one Angular module declaration in `app.module.js`.
- No circular dependencies among controllers, services, directives, factories.
- `HttpInterceptorService` does not depend on `$http`.
- `LoggingService` lazily resolves `$http` via `$injector`.
- Startup services (`EnvConfigService`) do not depend on any API services.
- Every dependency is registered exactly once.


## 11. Implementation Validation Checklist

- Every source file defined with repository path and purpose.
- All paths in `index.html` script and link tags exist in the structure.
- All templates have corresponding `templateUrl` and physical file.
- Default route exists and loads monthly summary template and controller.
- All injected services (`MonthlySummaryService`, `EnvConfigService`, `LoggingService`, `$filter`, `$q`, `$http`, `$timeout`, `$injector`, `MonthlySummaryModel`, `ErrorModel`) are registered.
- All directive bindings specified explicitly.
- All models (`MonthlySummaryModel`, `SpendBreakdownModel`, `KpiModel`, `ErrorModel`, `UserAccountModel`) defined.
- REST API endpoint defined with full contract.
- Environment properties (`apiBaseUrl`, `apiTimeoutMs`, `maxLookbackMonths`, `useMockData`, `featureFlags`, `telemetry`) defined.
- Mock responses defined for monthly summary endpoint with delay and failure scenarios.
- All public methods for each service, controller, directive controller, and model are specified.
- Script loading order ensures Angular module is declared before usage.
- Stylesheet loading order defined (Bootstrap first, feature styles second).
- No circular dependencies:
  - `MonthlySummaryModel` depends on `SpendBreakdownModel`; `SpendBreakdownModel` does not depend on `MonthlySummaryModel`.
  - Services refer to models and config; no mutual references.
- AngularJS DI constraints satisfied: all dependencies exist and are correctly injected.
- All resources (scripts, templates, styles, assets) have valid file paths.
- Application can be generated without assumptions; all implementation details are explicit.
