# QE-3198 Monthly Spending Summary Dashboard – Low-Level Design (LLD)

## 0. Document Purpose & Scope

This Low-Level Design (LLD) translates the QE-3198 Monthly Spending Summary Dashboard HLD into a complete, implementation-ready specification for a production-grade Single Page Application (SPA) built with AngularJS 1.7.9 and a REST backend.

This LLD is the single source of truth for the Code Generation Agent. It specifies:
- Exact technology stack (frontend only, as required by this task).
- Full repository structure and file-level responsibilities.
- AngularJS module configuration, components, and registrations.
- REST API contracts (production and mock).
- Models and data contracts.
- UI layout and behavior.
- Data flow, error handling, security aspects from the frontend perspective.
- Implementation rules to avoid assumptions.

The backend services (API Gateway, Monthly Spend Summary Service, Card Transactions Adapter, Summary Metrics Service, etc.) are modeled here via REST contracts; their internal implementation is outside the frontend scope.


## 1. Technology Stack Specification

### 1.1 Frontend Technologies

- **HTML**: HTML5
- **CSS**: CSS3
- **JavaScript**: ECMAScript 6 (ES6) syntax compiled/transpiled to ES5-compatible code where necessary, but source code written in ES6 (let/const, arrow functions permitted except in Angular DI annotations).
- **Framework**: AngularJS **1.7.9** (do not upgrade or replace).
- **Angular Modules**:
  - `ngRoute` **1.7.9**
  - `ngAnimate` **1.7.9**
  - `ngSanitize` **1.7.9**
  - `ui.bootstrap` **2.5.6** (Angular UI Bootstrap)
- **CSS Framework**: Bootstrap **3.4.1** (CSS only; no Bootstrap JS).
- **Charts**: Chart.js **2.9.4**.

### 1.2 Architecture Style

- AngularJS MVC.
- Single Page Application (SPA).
- REST-based data access.
- Dependency Injection.
- ControllerAs syntax.
- IIFE (Immediately Invoked Function Expression) module pattern.

### 1.3 AngularJS Runtime Services Used

- `$http` for REST calls.
- `$q` for promise handling and mock-mode deferreds.
- `$timeout` for mock response delay and UI timers.

### 1.4 Browser Support

- Google Chrome (latest stable).
- Microsoft Edge (Chromium-based).

No additional polyfills are required beyond AngularJS 1.7.9 standard compatibility.


## 2. Repository Structure

Root of repository: `/` (GitHub repo `APB_Demo`).

All application source resides under `src/`.

```text
APB_Demo/
  src/
    index.html

    assets/
      css/
        app.css
        theme.css
      fonts/
        README.md           (doc file, no runtime usage)
      img/
        logo.svg
        loading-spinner.svg
        empty-state.svg
        error-state.svg
        kpi-spend.svg
        kpi-tx-count.svg
        kpi-avg-tx.svg

    app/
      app.module.js
      app.config.js
      app.routes.js
      app.run.js

      core/
        models/
          spend-summary.model.js
          transaction.model.js
          metrics.model.js
          error.model.js
          env-config.model.js
        services/
          env-config.service.js
          http-interceptor.service.js
          logging.service.js
        config/
          feature-flags.constant.js
          telemetry.constant.js

      spending/
        spending.module.js

        controllers/
          monthly-summary.controller.js

        services/
          spending-api.service.js
          spending-mock.service.js

        directives/
          monthly-summary-card.directive.js
          monthly-breakdown-chart.directive.js

        templates/
          monthly-summary.view.html
          components/
            monthly-summary-card.template.html
            monthly-breakdown-chart.template.html

    config/
      env/
        env.config.json
        env.mock.config.json

    mocks/
      api/
        spend-summary.mock.json

    README.md
```

### 2.1 File-Level Metadata

Below, each file is described with: repository path, purpose, component type, and dependencies.

#### 2.1.1 `src/index.html`
- **Purpose**: Main HTML entry point for SPA; bootstraps AngularJS app and defines the main layout container with `ng-view`.
- **Component type**: HTML document.
- **Dependencies**:
  - CDN CSS: Bootstrap 3.4.1.
  - Local CSS: `assets/css/app.css`, `assets/css/theme.css`.
  - CDN JS: AngularJS 1.7.9, `angular-route` 1.7.9, `angular-animate` 1.7.9, `angular-sanitize` 1.7.9, Angular UI Bootstrap 2.5.6, Chart.js 2.9.4.
  - Local JS: All `app/**/*.js` files loaded in specified order.

#### 2.1.2 CSS

- `src/assets/css/app.css`
  - **Purpose**: Base application styles (layout, grids, typography, reusable utility classes).
  - **Component type**: Stylesheet.
  - **Dependencies**: Loaded after Bootstrap CSS (overrides/extends). No JS dependencies.

- `src/assets/css/theme.css`
  - **Purpose**: Theming for Monthly Spending Summary Dashboard (colors, card styles, charts colors, header/footer styling).
  - **Component type**: Stylesheet.
  - **Dependencies**: Loaded after `app.css` (more specific theme rules).

#### 2.1.3 Root Angular Files

- `src/app/app.module.js`
  - **Purpose**: Declares the single root AngularJS module `app` and specifies framework dependencies.
  - **Component type**: AngularJS module declaration.
  - **Dependencies**:
    - Angular modules: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`.

- `src/app/app.config.js`
  - **Purpose**: Global configuration block for the `app` module; registers `$httpProvider` interceptor and configures routes base behavior.
  - **Component type**: AngularJS config block.
  - **Dependencies**:
    - Module: `app`.
    - Services: `$httpProvider`, `$routeProvider` (indirectly via routes file).

- `src/app/app.routes.js`
  - **Purpose**: Defines SPA routes for monthly spending summary view using `ngRoute`.
  - **Component type**: AngularJS config block.
  - **Dependencies**:
    - Module: `app`.
    - Services: `$routeProvider`.

- `src/app/app.run.js`
  - **Purpose**: Run block for app; sets up global event handlers, route change logging, and initial environment configuration loading.
  - **Component type**: AngularJS run block.
  - **Dependencies**:
    - Module: `app`.
    - Injected services: `$rootScope`, `LoggingService`, `EnvConfigService`.

#### 2.1.4 Core Models

- `src/app/core/models/spend-summary.model.js`
  - **Purpose**: Defines `SpendSummaryModel` with full structure of monthly summary.
  - **Component type**: AngularJS factory (model constructor).
  - **Dependencies**:
    - Module: `app`.

- `src/app/core/models/transaction.model.js`
  - **Purpose**: Defines `TransactionModel` representing normalized transaction data used in calculations and UI.
  - **Component type**: AngularJS factory.
  - **Dependencies**:
    - Module: `app`.

- `src/app/core/models/metrics.model.js`
  - **Purpose**: Defines `MetricsModel` for KPI metrics (total spend, transaction count, etc.).
  - **Component type**: AngularJS factory.
  - **Dependencies**:
    - Module: `app`.

- `src/app/core/models/error.model.js`
  - **Purpose**: Defines `ErrorModel` capturing standard error info (code, message, HTTP status, type, retryable, correlationId).
  - **Component type**: AngularJS factory.
  - **Dependencies**:
    - Module: `app`.

- `src/app/core/models/env-config.model.js`
  - **Purpose**: Defines `EnvConfig` model representing environment configuration values.
  - **Component type**: AngularJS factory.
  - **Dependencies**:
    - Module: `app`.

#### 2.1.5 Core Services & Config

- `src/app/core/services/env-config.service.js`
  - **Purpose**: Loads environment configuration from JSON files and exposes it to rest of app. Controls mock vs production mode.
  - **Component type**: AngularJS service.
  - **Dependencies**:
    - Module: `app`.
    - Injected: `$http`, `$q`.

- `src/app/core/services/http-interceptor.service.js`
  - **Purpose**: Global HTTP interceptor for logging, error mapping to `ErrorModel`, and correlation IDs. Must not depend directly on `$http`.
  - **Component type**: AngularJS factory registered as `$httpProvider.interceptors` entry.
  - **Dependencies**:
    - Module: `app`.
    - Injected: `$q`, `$injector`, `LoggingService`.

- `src/app/core/services/logging.service.js`
  - **Purpose**: Logging service that lazily resolves `$http` via `$injector` for audit logging without circular dependency.
  - **Component type**: AngularJS service.
  - **Dependencies**:
    - Module: `app`.
    - Injected: `$log`, `$injector`.

- `src/app/core/config/feature-flags.constant.js`
  - **Purpose**: Application-wide feature flags constant (e.g., enableBreakdownChart).
  - **Component type**: AngularJS constant.
  - **Dependencies**:
    - Module: `app`.

- `src/app/core/config/telemetry.constant.js`
  - **Purpose**: Telemetry configuration constant (e.g., enableClientMetrics, logLevel).
  - **Component type**: AngularJS constant.
  - **Dependencies**:
    - Module: `app`.

#### 2.1.6 Spending Feature Module

- `src/app/spending/spending.module.js`
  - **Purpose**: Logical grouping for spending-related components; uses root `app` module reference for namespacing only.
  - **Component type**: AngularJS module usage (no new module declaration).
  - **Dependencies**:
    - Module: `app`.

##### Controllers

- `src/app/spending/controllers/monthly-summary.controller.js`
  - **Purpose**: Main controller for Monthly Spending Summary view; coordinates user actions, data loading from services, and view models for templates.
  - **Component type**: AngularJS controller.
  - **Dependencies**:
    - Module: `app`.
    - Injected: `SpendingApiService`, `SpendingMockService`, `EnvConfigService`, `LoggingService`, `$q`, `$timeout`.

##### Services

- `src/app/spending/services/spending-api.service.js`
  - **Purpose**: Production-mode API service for fetching monthly spend summaries from REST backend.
  - **Component type**: AngularJS service.
  - **Dependencies**:
    - Module: `app`.
    - Injected: `$http`, `$q`, `EnvConfigService`, `LoggingService`.

- `src/app/spending/services/spending-mock.service.js`
  - **Purpose**: Mock-mode service returning simulated monthly spend summaries using local JSON and `$timeout`.
  - **Component type**: AngularJS service.
  - **Dependencies**:
    - Module: `app`.
    - Injected: `$http`, `$q`, `$timeout`, `EnvConfigService`, `LoggingService`.

##### Directives

- `src/app/spending/directives/monthly-summary-card.directive.js`
  - **Purpose**: Directive rendering KPI cards for monthly spending summary (total spend, transaction count, average transaction value).
  - **Component type**: AngularJS directive.
  - **Dependencies**:
    - Module: `app`.
    - Injected (controller): none external besides `$scope` via binding; uses ControllerAs.

- `src/app/spending/directives/monthly-breakdown-chart.directive.js`
  - **Purpose**: Directive rendering Chart.js-based breakdown of monthly spending (e.g., categories) with tooltips and legend.
  - **Component type**: AngularJS directive.
  - **Dependencies**:
    - Module: `app`.
    - Injected (controller): `$timeout` (for chart init after DOM ready).

##### Templates

- `src/app/spending/templates/monthly-summary.view.html`
  - **Purpose**: Main route view template for Monthly Spending Summary Dashboard.
  - **Component type**: HTML template.
  - **Dependencies**:
    - Used by route `/spending/monthly`.
    - Requires `MonthlySummaryController` as `vm`.
    - Uses directives: `monthly-summary-card`, `monthly-breakdown-chart`.

- `src/app/spending/templates/components/monthly-summary-card.template.html`
  - **Purpose**: Template for KPI card directive.
  - **Component type**: HTML partial.
  - **Dependencies**:
    - Used by `monthlySummaryCard` directive.

- `src/app/spending/templates/components/monthly-breakdown-chart.template.html`
  - **Purpose**: Template for breakdown chart directive.
  - **Component type**: HTML partial.
  - **Dependencies**:
    - Used by `monthlyBreakdownChart` directive.

#### 2.1.7 Configuration & Mocks

- `src/config/env/env.config.json`
  - **Purpose**: Production environment config for REST API.
  - **Component type**: JSON config.
  - **Dependencies**:
    - Used by `EnvConfigService`.

- `src/config/env/env.mock.config.json`
  - **Purpose**: Mock environment config with `useMockData=true`.
  - **Component type**: JSON config.
  - **Dependencies**:
    - Used by `EnvConfigService`.

- `src/mocks/api/spend-summary.mock.json`
  - **Purpose**: Mock monthly spending summary responses for one or more cards/months.
  - **Component type**: JSON data.
  - **Dependencies**:
    - Used by `SpendingMockService`.

- `src/README.md`
  - **Purpose**: High-level documentation of frontend module; no runtime impact.
  - **Component type**: Markdown.
  - **Dependencies**: None.


## 3. `index.html` Specification

### 3.1 Document Structure

**Repository path**: `src/index.html`

**Key elements**:
- `<!DOCTYPE html>` with `<html lang="en">`.
- `<head>` includes meta tags, CSS links.
- `<body>` includes header, main content area with `ng-view`, footer.
- Root element uses `ng-app="app"`.

### 3.2 Angular Bootstrapping

- `ng-app="app"` applied to `<html>` element.
- `ng-view` placeholder inside a `div` with Bootstrap container class, e.g.:
  ```html
  <div class="container" ng-view></div>
  ```

### 3.3 Stylesheet Loading Order

1. **Bootstrap CSS (CDN)**:
   ```html
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
   ```
2. **App base CSS (local)**:
   ```html
   <link rel="stylesheet" href="assets/css/app.css">
   ```
3. **Theme CSS (local)**:
   ```html
   <link rel="stylesheet" href="assets/css/theme.css">
   ```

No other external CSS frameworks are used.

### 3.4 Script Loading Order

**CDN Scripts (in this exact order):**

1. AngularJS core 1.7.9
   ```html
   <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
   ```
2. Angular Route 1.7.9
   ```html
   <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js"></script>
   ```
3. Angular Animate 1.7.9
   ```html
   <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js"></script>
   ```
4. Angular Sanitize 1.7.9
   ```html
   <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js"></script>
   ```
5. Angular UI Bootstrap 2.5.6
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js"></script>
   ```
6. Chart.js 2.9.4
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js"></script>
   ```

**Local Application Scripts (in this exact order):**

1. Root app module
   ```html
   <script src="app/app.module.js"></script>
   ```
2. Core config/constants/services/models
   ```html
   <script src="app/core/config/feature-flags.constant.js"></script>
   <script src="app/core/config/telemetry.constant.js"></script>

   <script src="app/core/models/env-config.model.js"></script>
   <script src="app/core/models/error.model.js"></script>
   <script src="app/core/models/transaction.model.js"></script>
   <script src="app/core/models/metrics.model.js"></script>
   <script src="app/core/models/spend-summary.model.js"></script>

   <script src="app/core/services/logging.service.js"></script>
   <script src="app/core/services/env-config.service.js"></script>
   <script src="app/core/services/http-interceptor.service.js"></script>
   ```
3. Feature module and its components
   ```html
   <script src="app/spending/spending.module.js"></script>

   <script src="app/spending/services/spending-api.service.js"></script>
   <script src="app/spending/services/spending-mock.service.js"></script>

   <script src="app/spending/controllers/monthly-summary.controller.js"></script>

   <script src="app/spending/directives/monthly-summary-card.directive.js"></script>
   <script src="app/spending/directives/monthly-breakdown-chart.directive.js"></script>
   ```
4. App config, routes, and run
   ```html
   <script src="app/app.config.js"></script>
   <script src="app/app.routes.js"></script>
   <script src="app/app.run.js"></script>
   ```

### 3.5 Libraries Not Included

- jQuery is **not** included.
- `bootstrap.min.js` (Bootstrap JavaScript) is **not** included.

Neither will be added unless future requirements explicitly require them.


## 4. Application Bootstrap & Routing

### 4.1 Root Module Declaration

**File**: `src/app/app.module.js`

```js
(function () {
  'use strict';

  angular
    .module('app', [
      'ngRoute',
      'ngAnimate',
      'ngSanitize',
      'ui.bootstrap'
    ]);
})();
```

- Only this file declares `angular.module('app', [...])`.
- All other Angular files use `angular.module('app')` without dependency array.

### 4.2 Config Blocks

#### 4.2.1 Global Config – HTTP Interceptor Registration

**File**: `src/app/app.config.js`

**Angular registration**:
```js
(function () {
  'use strict';

  config.$inject = ['$httpProvider'];

  angular
    .module('app')
    .config(config);

  function config($httpProvider) {
    $httpProvider.interceptors.push('HttpInterceptor');
  }
})();
```

- Registers `HttpInterceptor` factory as a global HTTP interceptor.

#### 4.2.2 Routing Config

**File**: `src/app/app.routes.js`

**Angular registration**:
```js
(function () {
  'use strict';

  routes.$inject = ['$routeProvider', '$locationProvider'];

  angular
    .module('app')
    .config(routes);

  function routes($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider
      .when('/spending/monthly', {
        templateUrl: 'app/spending/templates/monthly-summary.view.html',
        controller: 'MonthlySummaryController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/spending/monthly'
      });
  }
})();
```

- **Default route**: `/spending/monthly`.
- **TemplateUrl**: `app/spending/templates/monthly-summary.view.html`.

### 4.3 Run Block

**File**: `src/app/app.run.js`

```js
(function () {
  'use strict';

  run.$inject = ['$rootScope', 'LoggingService', 'EnvConfigService'];

  angular
    .module('app')
    .run(run);

  function run($rootScope, LoggingService, EnvConfigService) {
    EnvConfigService.initialize();

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      LoggingService.debug('Route change start', {
        next: next,
        current: current
      });
    });
  }
})();
```

- Initializes environment configuration at startup.
- Logs route changes for telemetry.


## 5. Component Registry

This registry enumerates all Angular components: modules, controllers, services, factories, directives, filters, models, constants, values, config blocks, interceptors.

### 5.1 Modules

#### 5.1.1 Root Module

- **Name**: `app`
- **Type**: Angular module
- **File Path**: `src/app/app.module.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module('app', [...])`
- **Dependencies**:
  - `ngRoute`
  - `ngAnimate`
  - `ngSanitize`
  - `ui.bootstrap`
- **Injected Services**: N/A (module declaration only).
- **Public Methods**: N/A.

#### 5.1.2 Spending Feature Namespace

No separate Angular module; `spending.module.js` simply references `angular.module('app')` to group feature components logically.

- **Name**: `app` (usage in spending feature)
- **Type**: Module usage
- **File Path**: `src/app/spending/spending.module.js`
- **Angular Module**: `app`
- **Registration Method**: `angular.module('app')`
- **Dependencies**: None additional.

### 5.2 Controllers

#### 5.2.1 `MonthlySummaryController`

- **Name**: `MonthlySummaryController`
- **Type**: Controller
- **File Path**: `src/app/spending/controllers/monthly-summary.controller.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').controller('MonthlySummaryController', MonthlySummaryController);
  ```
- **Dependencies (constructor parameters)**:
  - `SpendingApiService`
  - `SpendingMockService`
  - `EnvConfigService`
  - `LoggingService`
  - `$q`
  - `$timeout`
- **Injected Services ($inject)**:
  ```js
  MonthlySummaryController.$inject = [
    'SpendingApiService',
    'SpendingMockService',
    'EnvConfigService',
    'LoggingService',
    '$q',
    '$timeout'
  ];
  ```
- **Public Methods (exposed via `vm`):**
  - `vm.initialize()` – loads initial month options and default summary.
  - `vm.onMonthChange(selectedMonth)` – handles month selection changes.
  - `vm.reloadSummary()` – refreshes summary for currently selected month.
  - `vm.retry()` – retrigger data load after recoverable error.
- **Private Methods:**
  - `_loadSummary(month)` – internal orchestrator calling API or mock.
  - `_handleSuccess(summaryModel)` – sets view models for success state.
  - `_handleError(errorModel)` – sets error state and logs.
  - `_buildViewModels(spendSummaryModel)` – maps models to UI structures.

### 5.3 Services

#### 5.3.1 `EnvConfigService`

- **Name**: `EnvConfigService`
- **Type**: Service
- **File Path**: `src/app/core/services/env-config.service.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').service('EnvConfigService', EnvConfigService);
  ```
- **Dependencies**:
  - `$http`
  - `$q`
- **Injected Services ($inject)**:
  ```js
  EnvConfigService.$inject = ['$http', '$q'];
  ```
- **Public Methods:**
  - `initialize()` – loads environment JSON and caches environment settings.
  - `getConfig()` – returns `EnvConfig` instance.
  - `isMockMode()` – returns boolean based on `useMockData` property.
- **Private Methods:**
  - `_loadEnvConfig()` – reads appropriate JSON file.

#### 5.3.2 `LoggingService`

- **Name**: `LoggingService`
- **Type**: Service
- **File Path**: `src/app/core/services/logging.service.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').service('LoggingService', LoggingService);
  ```
- **Dependencies**:
  - `$log`
  - `$injector`
- **Injected Services ($inject)**:
  ```js
  LoggingService.$inject = ['$log', '$injector'];
  ```
- **Public Methods:**
  - `debug(message, context)` – console debug.
  - `info(message, context)` – console info.
  - `warn(message, context)` – console warn.
  - `error(message, context)` – console error.
  - `audit(eventName, metadata)` – sends audit event via lazily resolved `$http` to backend (non-blocking, failure-ignored or logged).
- **Private Methods:**
  - `_getHttp()` – obtains `$http` from `$injector` on demand to avoid circular dependency.

#### 5.3.3 `SpendingApiService`

- **Name**: `SpendingApiService`
- **Type**: Service
- **File Path**: `src/app/spending/services/spending-api.service.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').service('SpendingApiService', SpendingApiService);
  ```
- **Dependencies**:
  - `$http`
  - `$q`
  - `EnvConfigService`
  - `LoggingService`
- **Injected Services ($inject)**:
  ```js
  SpendingApiService.$inject = ['$http', '$q', 'EnvConfigService', 'LoggingService'];
  ```
- **Public Methods:**
  - `getMonthlySummary(cardId, month)` – returns a promise resolving to `SpendSummaryModel`.
- **Private Methods:**
  - `_buildUrl(cardId, month)` – constructs REST URL using `EnvConfig`.
  - `_mapResponseToModel(rawResponse)` – maps API JSON to `SpendSummaryModel`.

#### 5.3.4 `SpendingMockService`

- **Name**: `SpendingMockService`
- **Type**: Service
- **File Path**: `src/app/spending/services/spending-mock.service.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').service('SpendingMockService', SpendingMockService);
  ```
- **Dependencies**:
  - `$http`
  - `$q`
  - `$timeout`
  - `EnvConfigService`
  - `LoggingService`
- **Injected Services ($inject)**:
  ```js
  SpendingMockService.$inject = ['$http', '$q', '$timeout', 'EnvConfigService', 'LoggingService'];
  ```
- **Public Methods:**
  - `getMonthlySummary(cardId, month)` – returns a promise resolving to `SpendSummaryModel` based on mock JSON.
- **Private Methods:**
  - `_loadMockJson()` – reads `spend-summary.mock.json`.
  - `_simulateDelay()` – uses `$timeout` to introduce configured delay.
  - `_mapMockToModel(rawMock)` – maps JSON to `SpendSummaryModel`.

#### 5.3.5 `HttpInterceptor`

- **Name**: `HttpInterceptor`
- **Type**: HTTP interceptor factory
- **File Path**: `src/app/core/services/http-interceptor.service.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').factory('HttpInterceptor', HttpInterceptor);
  ```
- **Dependencies**:
  - `$q`
  - `$injector`
  - `LoggingService`
- **Injected Services ($inject)**:
  ```js
  HttpInterceptor.$inject = ['$q', '$injector', 'LoggingService'];
  ```
- **Public Methods (interceptor hooks returned object):**
  - `request(config)` – attach correlation ID and log outgoing requests.
  - `response(response)` – log successful responses.
  - `responseError(rejection)` – map to `ErrorModel` and log errors; returns rejected promise.

### 5.4 Models (Factories)

#### 5.4.1 `EnvConfig`

- **Name**: `EnvConfig`
- **Type**: Factory returning constructor function
- **File Path**: `src/app/core/models/env-config.model.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').factory('EnvConfig', EnvConfigFactory);
  ```
- **Dependencies**: None injected.
- **Public API (constructor)**:
  - `new EnvConfig(options)` – where `options` is JSON.
- **Properties**:
  - `apiBaseUrl: string`
  - `apiTimeoutMs: number`
  - `maxLookbackMonths: number`
  - `useMockData: boolean`
  - `featureFlags: object`
  - `telemetry: object`

#### 5.4.2 `ErrorModel`

- **Name**: `ErrorModel`
- **Type**: Factory
- **File Path**: `src/app/core/models/error.model.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').factory('ErrorModel', ErrorModelFactory);
  ```
- **Properties**:
  - `code: string`
  - `message: string`
  - `httpStatus: number`
  - `type: string` (e.g., `validation`, `network`, `server`)
  - `retryable: boolean`
  - `correlationId: string`

#### 5.4.3 `TransactionModel`

- **Name**: `TransactionModel`
- **Type**: Factory
- **File Path**: `src/app/core/models/transaction.model.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').factory('TransactionModel', TransactionModelFactory);
  ```
- **Properties**:
  - `id: string`
  - `cardId: string`
  - `amount: number`
  - `currency: string`
  - `transactionDate: string` (ISO-8601 date)
  - `category: string` (normalized category for breakdown)
  - `isRefund: boolean`
  - `isReversal: boolean`
  - `isAdjustment: boolean`

#### 5.4.4 `MetricsModel`

- **Name**: `MetricsModel`
- **Type**: Factory
- **File Path**: `src/app/core/models/metrics.model.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').factory('MetricsModel', MetricsModelFactory);
  ```
- **Properties**:
  - `totalSpend: number`
  - `transactionCount: number`
  - `averageTransactionAmount: number`
  - `activeDaysCount: number`

#### 5.4.5 `SpendSummaryModel`

- **Name**: `SpendSummaryModel`
- **Type**: Factory
- **File Path**: `src/app/core/models/spend-summary.model.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').factory('SpendSummaryModel', SpendSummaryModelFactory);
  ```
- **Properties**:
  - `cardId: string`
  - `month: string` (YYYY-MM)
  - `currency: string`
  - `metrics: MetricsModel`
  - `breakdown: { [category: string]: number }` (amount per category)
  - `lastUpdated: string` (ISO-8601 timestamp)

### 5.5 Constants

#### 5.5.1 `FEATURE_FLAGS`

- **Name**: `FEATURE_FLAGS`
- **Type**: Constant
- **File Path**: `src/app/core/config/feature-flags.constant.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').constant('FEATURE_FLAGS', {
    enableBreakdownChart: true,
    showActiveDaysCount: true
  });
  ```
- **Public Properties**:
  - `enableBreakdownChart: boolean`
  - `showActiveDaysCount: boolean`

#### 5.5.2 `TELEMETRY_CONFIG`

- **Name**: `TELEMETRY_CONFIG`
- **Type**: Constant
- **File Path**: `src/app/core/config/telemetry.constant.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').constant('TELEMETRY_CONFIG', {
    logLevel: 'info',
    enableClientMetrics: true
  });
  ```
- **Public Properties**:
  - `logLevel: string`
  - `enableClientMetrics: boolean`

### 5.6 Directives

#### 5.6.1 `monthlySummaryCard`

- **Name**: `monthlySummaryCard`
- **Type**: Directive
- **File Path**: `src/app/spending/directives/monthly-summary-card.directive.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').directive('monthlySummaryCard', monthlySummaryCard);
  ```
- **Directive Definition**:
  - `restrict: 'E'`
  - `scope`: isolate scope with explicit bindings:
    - `title: '@'` – card title.
    - `icon: '@'` – icon class (for CSS-based icon).
    - `value: '<'` – numeric or string KPI value.
    - `subtitle: '@'` – descriptive subtitle.
  - `bindToController: true`
  - `controller: MonthlySummaryCardController`
  - `controllerAs: 'vm'`
  - `templateUrl: 'app/spending/templates/components/monthly-summary-card.template.html'`
  - `transclude: false`
  - `replace: false`
- **Dependencies (controller)**: None external.

#### 5.6.2 `monthlyBreakdownChart`

- **Name**: `monthlyBreakdownChart`
- **Type**: Directive
- **File Path**: `src/app/spending/directives/monthly-breakdown-chart.directive.js`
- **Angular Module**: `app`
- **Registration Method**:
  ```js
  angular.module('app').directive('monthlyBreakdownChart', monthlyBreakdownChart);
  ```
- **Directive Definition**:
  - `restrict: 'E'`
  - `scope`: isolate scope with explicit bindings:
    - `data: '<'` – breakdown data object `{ category: amount }`.
    - `currency: '@'` – currency code for labels.
  - `bindToController: true`
  - `controller: MonthlyBreakdownChartController`
  - `controllerAs: 'vm'`
  - `templateUrl: 'app/spending/templates/components/monthly-breakdown-chart.template.html'`
  - `transclude: false`
  - `replace: false`
- **Dependencies (controller)**:
  - `$timeout` for Chart.js initialization.

### 5.7 Filters, Values

No custom filters or values are defined in this LLD; none are required for the specified scope.


## 6. Per-File Implementation Specification

This section defines implementation details per source file so the Code Generation Agent can generate actual code without assumptions.

### 6.1 `src/app/app.module.js`

- **Angular registration**: Root module declaration.
- **Responsibility**: Define AngularJS application module `app` with its framework dependencies.
- **Injected dependencies**: None.
- **Public methods**: None.
- **Private methods**: None.
- **Business rules**: Ensure only one Angular module declaration exists.
- **Error handling**: Not applicable.
- **Logging**: Not applicable.
- **Configuration used**: Not applicable.
- **Files referenced**: None.
- **Files depending on it**: All other Angular files using `angular.module('app')`.

### 6.2 `src/app/app.config.js`

- **Angular registration**:
  - `.config(config)` on `app` module.
- **Responsibility**:
  - Register HTTP interceptor `HttpInterceptor` with `$httpProvider`.
- **Injected dependencies**:
  - `$httpProvider`.
- **Public methods**: `config($httpProvider)` – configuration function; not called directly.
- **Private methods**: None.
- **Method signature**:
  - `function config($httpProvider)` – no return value.
- **Parameters**:
  - `$httpProvider: ng.IHttpProvider`.
- **Return types**:
  - `void`.
- **Business rules**:
  - Always ensure `HttpInterceptor` is present at the end of interceptors array.
- **Error handling**: Not applicable.
- **Logging**: Not applicable.
- **Configuration used**: None.
- **Files referenced**:
  - `src/app/core/services/http-interceptor.service.js` (by name only).
- **Files depending on it**:
  - All services using `$http`; they rely on interceptor for errors.

### 6.3 `src/app/app.routes.js`

- **Angular registration**:
  - `.config(routes)` on `app` module.
- **Responsibility**:
  - Define SPA routes and default route.
- **Injected dependencies**:
  - `$routeProvider`
  - `$locationProvider`
- **Public methods**: `routes($routeProvider, $locationProvider)`.
- **Private methods**: None.
- **Method signature**:
  - `function routes($routeProvider, $locationProvider)`.
- **Parameters**:
  - `$routeProvider: ng.route.IRouteProvider`
  - `$locationProvider: ng.ILocationProvider`
- **Return types**:
  - `void`.
- **Business rules**:
  - All unmatched routes redirect to `/spending/monthly`.
  - Template URLs must match file paths.
- **Error handling**: None; relies on Angular router.
- **Logging**: None directly.
- **Configuration used**: None.
- **Files referenced**:
  - `src/app/spending/templates/monthly-summary.view.html`.
  - `MonthlySummaryController`.
- **Files depending on it**:
  - `index.html` via `ng-view`.

### 6.4 `src/app/app.run.js`

- **Angular registration**:
  - `.run(run)` on `app` module.
- **Responsibility**:
  - Initialize environment configuration.
  - Setup route change logging.
- **Injected dependencies**:
  - `$rootScope`
  - `LoggingService`
  - `EnvConfigService`
- **Public methods**: `run($rootScope, LoggingService, EnvConfigService)`.
- **Private methods**: None.
- **Method signature**:
  - `function run($rootScope, LoggingService, EnvConfigService)`.
- **Parameters**:
  - `$rootScope: ng.IRootScopeService`
  - `LoggingService: LoggingService`
  - `EnvConfigService: EnvConfigService`
- **Return types**:
  - `void`.
- **Business rules**:
  - `EnvConfigService.initialize()` must be called once at startup.
- **Error handling**:
  - Any error thrown during `initialize()` is logged via `LoggingService.error`.
- **Logging**:
  - Listens to `$routeChangeStart` and logs event.
- **Files referenced**:
  - `env-config.service.js`
  - `logging.service.js`
- **Files depending on it**:
  - Controllers expecting environment loaded.

### 6.5 `src/app/core/models/env-config.model.js`

- **Responsibility**:
  - Encapsulate environment configuration data.
- **Injected dependencies**: None.
- **Public methods**:
  - Constructor `EnvConfig(options)`.
- **Private methods**: None.
- **Method signature**:
  - `function EnvConfig(options)`.
- **Parameters**:
  - `options: Object` containing env keys.
- **Return types**:
  - `EnvConfig` instance.
- **Business rules**:
  - All properties must be present; default values used if missing.
- **Validation**:
  - `apiBaseUrl` must be non-empty string.
  - `apiTimeoutMs` must be positive integer.
  - `maxLookbackMonths` must be positive integer.
- **Error handling**:
  - Throws or logs error if mandatory properties missing; Code Generation Agent should implement simple checks and fallback defaults.
- **Logging**: None.
- **Files referenced**: None.
- **Files depending on it**:
  - `EnvConfigService`.

### 6.6 `src/app/core/models/error.model.js`

- **Responsibility**:
  - Represent standard error structure.
- **Injected dependencies**: None.
- **Public methods**:
  - Constructor `ErrorModel(props)`.
- **Method signature**:
  - `function ErrorModel(props)`.
- **Parameters**:
  - `props: Object` with keys matching properties.
- **Return types**:
  - `ErrorModel` instance.
- **Business rules**:
  - `httpStatus` must be number; default `0`.
  - `retryable` default `false`.
- **Error handling**:
  - None; used as DTO.
- **Logging**: None.
- **Files depending on it**:
  - `HttpInterceptor`.
  - `MonthlySummaryController` (for displaying error state).

### 6.7 `src/app/core/models/transaction.model.js`

- **Responsibility**:
  - Represent normalized transaction; used by backend but here mostly for completeness and type clarity.
- **Injected dependencies**: None.
- **Public methods**:
  - Constructor `TransactionModel(props)`.
- **Method signature**:
  - `function TransactionModel(props)`.
- **Business rules**:
  - `amount` must be numeric.
  - `transactionDate` must be valid date string.
- **Validation**:
  - Basic type checks.
- **Error handling**: None in frontend; backend ensures correctness.

### 6.8 `src/app/core/models/metrics.model.js`

- Similar pattern to other models; ensures numerical KPI values.

### 6.9 `src/app/core/models/spend-summary.model.js`

- **Responsibility**:
  - Represent monthly spend summary used by UI.
- **Injected dependencies**: None.
- **Public methods**:
  - Constructor `SpendSummaryModel(props)`.
- **Business rules**:
  - `month` must match `YYYY-MM`.
  - `currency` non-empty.

### 6.10 `src/app/core/services/env-config.service.js`

- See Component Registry above. Additional details:
- **Method signatures**:
  - `initialize(): ng.IPromise<EnvConfig>`.
  - `getConfig(): EnvConfig`.
  - `isMockMode(): boolean`.
- **Input models**:
  - `env.config.json` or `env.mock.config.json` JSON.
- **Output models**:
  - `EnvConfig`.
- **Business rules**:
  - Determine which env JSON to read based on build-time or runtime flag; in this LLD, always read `env.config.json`, which itself contains `useMockData` flag.
- **Validation**:
  - Validate mandatory fields as above.
- **Error handling**:
  - On failure to load config, return rejected promise with `ErrorModel` and log error.

### 6.11 `src/app/core/services/logging.service.js`

- **Method signatures**:
  - `debug(message: string, context?: Object): void`.
  - `info(message: string, context?: Object): void`.
  - `warn(message: string, context?: Object): void`.
  - `error(message: string, context?: Object): void`.
  - `audit(eventName: string, metadata?: Object): void`.
- **Business rules**:
  - Logging should not throw errors; any error in sending audit request must be swallowed after optionally logging locally.

### 6.12 `src/app/core/services/http-interceptor.service.js`

- **Method signatures** (interceptor object):
  - `request(config: ng.IRequestConfig): ng.IRequestConfig | ng.IPromise<ng.IRequestConfig>`.
  - `response(response: ng.IHttpResponse<any>): ng.IHttpResponse<any> | ng.IPromise<ng.IHttpResponse<any>>`.
  - `responseError(rejection: any): ng.IPromise<any>`.
- **Input models**:
  - Raw `$http` config and responses.
- **Output models**:
  - `ErrorModel` in rejection path.
- **Business rules**:
  - Attach `X-Correlation-ID` header if not present.
  - Map HTTP error statuses to `ErrorModel.type`:
    - 400: `validation`
    - 401, 403: `authorization`
    - 404: `not_found`
    - 500: `server`
    - 0 or network failure: `network`
- **Error handling**:
  - Always return `$q.reject(errorModel)` on `responseError`.

### 6.13 `src/app/spending/controllers/monthly-summary.controller.js`

- **Responsibility**:
  - Orchestrate UI for monthly spend summary.
- **Method signatures**:
  - `initialize(): void`.
  - `onMonthChange(selectedMonth: string): void`.
  - `reloadSummary(): void`.
  - `retry(): void`.
  - `_loadSummary(month: string): ng.IPromise<SpendSummaryModel>`.
  - `_handleSuccess(summaryModel: SpendSummaryModel): void`.
  - `_handleError(errorModel: ErrorModel): void`.
  - `_buildViewModels(summaryModel: SpendSummaryModel): void`.
- **Input models**:
  - `SpendSummaryModel` from services.
  - `ErrorModel` for errors.
- **Output models**:
  - View model properties:
    - `vm.selectedMonth: string`
    - `vm.availableMonths: string[]`
    - `vm.isLoading: boolean`
    - `vm.error: ErrorModel | null`
    - `vm.summary: SpendSummaryModel | null`
    - `vm.kpiCards: Array<{ title, icon, value, subtitle }>`
- **Business rules**:
  - If `EnvConfigService.isMockMode()` returns true, use `SpendingMockService`; otherwise use `SpendingApiService`.
  - Only allow months within `maxLookbackMonths` from current month.
- **Validation**:
  - Validate incoming `selectedMonth` against available months list.
- **Error handling**:
  - On service error, set `vm.error` and `vm.isLoading=false`, log error.
  - `retry()` clears error and re-calls `_loadSummary`.

### 6.14 `src/app/spending/services/spending-api.service.js`

- **REST API Contract Usage**:
  - See section 7 below for API details.
- **Method signature**:
  - `getMonthlySummary(cardId: string, month: string): ng.IPromise<SpendSummaryModel>`.
- **Business rules**:
  - Use `EnvConfigService.getConfig().apiBaseUrl` as prefix.
  - Use `EnvConfigService.getConfig().apiTimeoutMs` to configure `$http` timeout.
- **Error handling**:
  - Let `HttpInterceptor` transform errors into `ErrorModel`.

### 6.15 `src/app/spending/services/spending-mock.service.js`

- **Method signature**:
  - `getMonthlySummary(cardId: string, month: string): ng.IPromise<SpendSummaryModel>`.
- **Business rules**:
  - Load mock JSON from `/mocks/api/spend-summary.mock.json` once and cache.
  - Simulate delay using `$timeout` (e.g., 500ms) before resolving.
- **Error handling**:
  - If requested cardId/month missing from mock data, return rejected promise with `ErrorModel` type `not_found`.

### 6.16 `src/app/spending/directives/monthly-summary-card.directive.js`

- **Responsibility**:
  - Render KPI card UI.
- **Method signatures**:
  - Directive factory `monthlySummaryCard()` returns DDO.
  - `MonthlySummaryCardController()` – empty or minimal logic.
- **Business rules**:
  - Accept any numeric or string value; formatting handled in template.

### 6.17 `src/app/spending/directives/monthly-breakdown-chart.directive.js`

- **Responsibility**:
  - Render breakdown chart using Chart.js.
- **Method signatures**:
  - Directive factory `monthlyBreakdownChart()`.
  - `MonthlyBreakdownChartController($timeout)`.
- **Business rules**:
  - When `data` changes, re-draw chart.
  - Use `category` names as labels and amounts as values.

### 6.18 Templates & CSS

- Templates contain only markup and Angular expressions; no business logic.
- CSS implements layout, colors, responsiveness according to UI specification.


## 7. Models Specification

### 7.1 SpendSummaryModel

**Properties & Types**:
- `cardId: string` – tokenized card ID.
- `month: string` – format `YYYY-MM`, e.g. `2025-01`.
- `currency: string` – ISO currency code, e.g. `USD`.
- `metrics: MetricsModel`:
  - `totalSpend: number` – sum of transaction amounts, net of refunds/reversals/adjustments.
  - `transactionCount: number` – number of transactions included.
  - `averageTransactionAmount: number` – `totalSpend / transactionCount` if `transactionCount>0`, else 0.
  - `activeDaysCount: number` – count of distinct days containing at least one transaction.
- `breakdown: { [category: string]: number }` – keyed by category, values numeric amounts.
- `lastUpdated: string` – ISO timestamp when summary was computed.

**Default values**:
- `currency` defaults to `USD` if not provided.
- `metrics` defaults to zeros.
- `breakdown` defaults to empty object.

**Validation**:
- `month` pattern: regex `^\d{4}-\d{2}$`.
- `totalSpend` non-negative.

**Sample JSON**:
```json
{
  "cardId": "CARD-12345",
  "month": "2025-01",
  "currency": "USD",
  "metrics": {
    "totalSpend": 1234.56,
    "transactionCount": 42,
    "averageTransactionAmount": 29.39,
    "activeDaysCount": 18
  },
  "breakdown": {
    "Groceries": 300.00,
    "Restaurants": 250.50,
    "Online Shopping": 400.00,
    "Utilities": 284.06
  },
  "lastUpdated": "2025-02-01T12:00:00Z"
}
```

### 7.2 MetricsModel

**Properties & Types**:
- `totalSpend: number` (>=0).
- `transactionCount: number` (>=0 integer).
- `averageTransactionAmount: number` (>=0).
- `activeDaysCount: number` (>=0 integer).

**Sample JSON**:
```json
{
  "totalSpend": 1234.56,
  "transactionCount": 42,
  "averageTransactionAmount": 29.39,
  "activeDaysCount": 18
}
```

### 7.3 TransactionModel

**Properties & Types**:
- `id: string`
- `cardId: string`
- `amount: number`
- `currency: string`
- `transactionDate: string` (ISO date `YYYY-MM-DD`)
- `category: string`
- `isRefund: boolean`
- `isReversal: boolean`
- `isAdjustment: boolean`

**Sample JSON**:
```json
{
  "id": "TX-98765",
  "cardId": "CARD-12345",
  "amount": 25.50,
  "currency": "USD",
  "transactionDate": "2025-01-15",
  "category": "Groceries",
  "isRefund": false,
  "isReversal": false,
  "isAdjustment": false
}
```

### 7.4 ErrorModel

**Properties & Types**:
- `code: string`
- `message: string`
- `httpStatus: number`
- `type: string`
- `retryable: boolean`
- `correlationId: string`

**Sample JSON**:
```json
{
  "code": "API_UNAVAILABLE",
  "message": "We are unable to retrieve your spending summary right now.",
  "httpStatus": 503,
  "type": "network",
  "retryable": true,
  "correlationId": "abc123-xyz789"
}
```

### 7.5 EnvConfig

**Properties & Types**:
- `apiBaseUrl: string`
- `apiTimeoutMs: number`
- `maxLookbackMonths: number`
- `useMockData: boolean`
- `featureFlags: { [key: string]: boolean }`
- `telemetry: { [key: string]: any }`

**Sample JSON (`env.config.json`)**:
```json
{
  "apiBaseUrl": "https://api.example.com/v1",
  "apiTimeoutMs": 10000,
  "maxLookbackMonths": 12,
  "useMockData": false,
  "featureFlags": {
    "enableBreakdownChart": true,
    "showActiveDaysCount": true
  },
  "telemetry": {
    "logLevel": "info",
    "enableClientMetrics": true
  }
}
```

**Sample JSON (`env.mock.config.json`)**:
```json
{
  "apiBaseUrl": "",
  "apiTimeoutMs": 5000,
  "maxLookbackMonths": 6,
  "useMockData": true,
  "featureFlags": {
    "enableBreakdownChart": true,
    "showActiveDaysCount": true
  },
  "telemetry": {
    "logLevel": "debug",
    "enableClientMetrics": false
  }
}
```


## 8. REST API Contracts

### 8.1 Production Endpoint – Fetch Monthly Spend Summary

- **URL**: `${apiBaseUrl}/spend-summary`
- **HTTP Method**: `GET`

#### 8.1.1 Headers

Required headers:
- `Authorization: Bearer <token>` – auth token from Auth & Session Service.
- `Content-Type: application/json` (for response; request has no body).
- `Accept: application/json`
- `X-Correlation-ID: <uuid>` – set by `HttpInterceptor` if not provided.

#### 8.1.2 Query Parameters

- `cardId: string` (required) – tokenized card identifier.
- `month: string` (required) – month in `YYYY-MM` format.

Example:
`GET https://api.example.com/v1/spend-summary?cardId=CARD-12345&month=2025-01`

#### 8.1.3 Request Body

- None.

#### 8.1.4 Response Body (Success)

HTTP `200 OK`:
```json
{
  "cardId": "CARD-12345",
  "month": "2025-01",
  "currency": "USD",
  "metrics": {
    "totalSpend": 1234.56,
    "transactionCount": 42,
    "averageTransactionAmount": 29.39,
    "activeDaysCount": 18
  },
  "breakdown": {
    "Groceries": 300.00,
    "Restaurants": 250.50,
    "Online Shopping": 400.00,
    "Utilities": 284.06
  },
  "lastUpdated": "2025-02-01T12:00:00Z"
}
```

The frontend maps this directly to `SpendSummaryModel` using `SpendingApiService._mapResponseToModel`.

#### 8.1.5 Error Responses

All error responses return `ErrorModel`-compatible JSON.

Examples:

- `400 Bad Request` (validation):
```json
{
  "code": "INVALID_MONTH",
  "message": "The requested month format is invalid.",
  "httpStatus": 400,
  "type": "validation",
  "retryable": false
}
```

- `401 Unauthorized`:
```json
{
  "code": "UNAUTHORIZED",
  "message": "Authentication is required to access this resource.",
  "httpStatus": 401,
  "type": "authorization",
  "retryable": false
}
```

- `403 Forbidden`:
```json
{
  "code": "FORBIDDEN",
  "message": "You are not allowed to view this card account.",
  "httpStatus": 403,
  "type": "authorization",
  "retryable": false
}
```

- `404 Not Found`:
```json
{
  "code": "SUMMARY_NOT_FOUND",
  "message": "No spending summary is available for the requested month.",
  "httpStatus": 404,
  "type": "not_found",
  "retryable": false
}
```

- `500 Internal Server Error`:
```json
{
  "code": "SERVER_ERROR",
  "message": "An unexpected error occurred.",
  "httpStatus": 500,
  "type": "server",
  "retryable": true
}
```

- `503 Service Unavailable`:
```json
{
  "code": "API_UNAVAILABLE",
  "message": "We are unable to retrieve your spending summary right now.",
  "httpStatus": 503,
  "type": "network",
  "retryable": true
}
```

#### 8.1.6 Timeout & Retry Policy (Frontend)

- `timeout`: `EnvConfig.apiTimeoutMs` for `$http` requests.
- **Retry**:
  - Frontend does not auto-retry; `MonthlySummaryController.retry()` allows user-triggered retry and may choose to re-call service.


## 9. Mock Mode Specification

### 9.1 Mock JSON File

**Path**: `src/mocks/api/spend-summary.mock.json`

**Structure**:
```json
{
  "summaries": [
    {
      "cardId": "CARD-12345",
      "month": "2025-01",
      "currency": "USD",
      "metrics": {
        "totalSpend": 1234.56,
        "transactionCount": 42,
        "averageTransactionAmount": 29.39,
        "activeDaysCount": 18
      },
      "breakdown": {
        "Groceries": 300.00,
        "Restaurants": 250.50,
        "Online Shopping": 400.00,
        "Utilities": 284.06
      },
      "lastUpdated": "2025-02-01T12:00:00Z"
    },
    {
      "cardId": "CARD-12345",
      "month": "2025-02",
      "currency": "USD",
      "metrics": {
        "totalSpend": 980.10,
        "transactionCount": 35,
        "averageTransactionAmount": 28.00,
        "activeDaysCount": 17
      },
      "breakdown": {
        "Groceries": 250.00,
        "Restaurants": 220.10,
        "Online Shopping": 300.00,
        "Utilities": 210.00
      },
      "lastUpdated": "2025-03-01T12:00:00Z"
    }
  ]
}
```

### 9.2 Mock Service Behavior

**Service**: `SpendingMockService`

- Uses `$http.get('mocks/api/spend-summary.mock.json')` to load mock data once.
- Uses `$timeout` to simulate network delay (e.g., 500ms).
- Uses `$q.defer()` to create promises:

**Success Flow:**
- Find summary matching `cardId` and `month`.
- Map JSON to `SpendSummaryModel` via `_mapMockToModel`.
- Resolve deferred with model after delay.

**Failure Scenarios:**
- If `cardId`/`month` not found:
  - Construct `ErrorModel` with `code='SUMMARY_NOT_FOUND'`, `httpStatus=404`, `type='not_found'`, `retryable=false`.
  - Reject deferred after delay.
- If JSON load fails:
  - Construct `ErrorModel` with `code='MOCK_LOAD_FAILED'`, `httpStatus=500`, `type='server'`, `retryable=false`.
  - Reject deferred.

Mock responses always conform to the same schema as production.

### 9.3 Switching Between Mock and Production Mode

**Configuration file**: `env.config.json` or `env.mock.config.json`.

**Key property**:
- `useMockData: boolean`.

**Behavior**:
- `EnvConfigService.initialize()` loads environment config and stores `EnvConfig`.
- `EnvConfigService.isMockMode()` returns `EnvConfig.useMockData`.
- `MonthlySummaryController._loadSummary(month)` does:
  ```js
  if (EnvConfigService.isMockMode()) {
    return SpendingMockService.getMonthlySummary(cardId, month);
  } else {
    return SpendingApiService.getMonthlySummary(cardId, month);
  }
  ```

Changing ONLY `useMockData` flag in environment config switches between mock and production without changing code.


## 10. UI Specification

### 10.1 Overall Layout

- **Header**:
  - Bootstrap `.navbar` with logo and title "Monthly Spending Summary".
  - Fixed at top with subtle shadow.
- **Content Area** (`monthly-summary.view.html`):
  - `.container` with vertical spacing.
  - Row 1: Month selection form.
  - Row 2: KPI cards (total spend, transaction count, average transaction amount).
  - Row 3: Breakdown chart and table.
  - Row 4: Status messages (loading, empty, error) as appropriate.
- **Footer**:
  - Simple `footer` with small text: "Data is approximate and may differ from official statements.".

### 10.2 Bootstrap Grid

- Month selector row:
  - `<div class="row">`
    - `<div class="col-sm-4">` – month dropdown using `uib-datepicker-popup` or simple `<select>`.
    - `<div class="col-sm-8 text-right">` – reload/refresh button.
- KPI cards row:
  - `<div class="row kpi-row">`
    - Each card in `<div class="col-sm-4">`.
- Breakdown row:
  - `<div class="row">`
    - Chart in `<div class="col-sm-6">`.
    - Table in `<div class="col-sm-6">`.

### 10.3 KPI Cards Specification

Rendered via `monthly-summary-card` directive.

For each KPI:
- **Bootstrap classes**:
  - Outer: `panel panel-default kpi-card`.
  - Header: `panel-heading`.
  - Body: `panel-body`.
- **Card size**:
  - One card per `col-sm-4`; responsive stacking on smaller screens via Bootstrap.
- **Icons**:
  - CSS-based icons using background SVG from `assets/img/kpi-*.svg` or Font-like icons defined in CSS.
- **Labels**:
  - Titles: e.g., "Total Spend", "Transactions", "Average Transaction".
- **Values**:
  - `value` binding displayed using large font and currency formatting for amount fields.
- **Alignment**:
  - Centered text for value; left-aligned for label.
- **Borders & Shadows**:
  - Use subtle box-shadow via `theme.css`; border from Bootstrap `.panel`.

### 10.4 Tables

- Breakdown table lists categories and amounts.
- Columns: Category, Amount, Percentage of total.
- Use `.table` and `.table-striped` classes.

### 10.5 Charts

Rendered via `monthlyBreakdownChart` directive.

- **Chart type**: Doughnut chart or pie chart via Chart.js 2.9.4.
- **Labels**: Category names.
- **Legends**: Chart.js legend enabled at bottom.
- **Tooltips**: Standard Chart.js tooltips showing category and amount plus percentage.
- **Axes**: Not applicable for doughnut/pie charts.
- **Colors**:
  - Predefined color palette from `theme.css`; each category assigned consistent color.
- **Responsive behavior**:
  - Chart canvas width 100% of column; Chart.js responsive option enabled.

### 10.6 Forms & Buttons

- Month selector: `<select>` bound to `vm.availableMonths`, `ng-model="vm.selectedMonth"`, `ng-change="vm.onMonthChange(vm.selectedMonth)"`.
- Refresh button: `<button class="btn btn-primary" ng-click="vm.reloadSummary()">Refresh</button>`.

### 10.7 Typography, Colors, Spacing

- Typography: Use Bootstrap defaults (`Helvetica Neue`, `Arial`).
- Colors:
  - Primary color: bank-blue (#0055A4) for header.
  - KPI values: dark gray (#333).
  - Positive spend: teal (#00897B).
- Spacing:
  - `margin-top` on rows; `padding` inside cards.

### 10.8 States

- **Loading state**:
  - `vm.isLoading === true`.
  - Show centered spinner using `loading-spinner.svg` and text "Loading your monthly summary...".

- **Empty state**:
  - When `vm.summary.metrics.transactionCount === 0`:
    - Show empty state illustration `empty-state.svg` and message "No spending activity for this month.".

- **Error state**:
  - When `vm.error !== null`:
    - Show error illustration `error-state.svg` and message from `vm.error.message`.
    - Show `Retry` button calling `vm.retry()`.


## 11. Data Flow

### 11.1 Success Flow

User Action → Controller → Service → REST API / Mock → Model → Directive/View → UI Update.

1. **User Action**:
   - User selects a month or clicks refresh.
2. **Controller (`MonthlySummaryController`)**:
   - `onMonthChange` or `reloadSummary` sets `vm.isLoading = true`, clears `vm.error`.
   - Calls `_loadSummary(selectedMonth)`.
3. **Service**:
   - `_loadSummary` checks `EnvConfigService.isMockMode()`.
   - Calls either `SpendingApiService.getMonthlySummary(cardId, month)` or `SpendingMockService.getMonthlySummary(cardId, month)`.
4. **REST API / Mock**:
   - Production: HTTP GET to `/spend-summary` with query params.
   - Mock: Load JSON from `spend-summary.mock.json`, simulate delay via `$timeout`.
5. **Model**:
   - Service maps response JSON to `SpendSummaryModel` via model factories.
6. **Controller**:
   - Promise resolves to `SpendSummaryModel`.
   - `_handleSuccess` sets `vm.summary`, computes `vm.kpiCards`, sets `vm.isLoading = false`.
7. **Directive/View**:
   - `monthly-summary.view.html` binds `vm.summary`, renders KPI cards and chart via directives.
8. **UI Update**:
   - Angular digest updates DOM; user sees updated summary.

### 11.2 Failure Flow

1. **Service**:
   - REST call fails; `HttpInterceptor.responseError` maps error to `ErrorModel` and rejects promise.
2. **Controller**:
   - Promise rejected with `ErrorModel`.
   - `_handleError` sets `vm.error = errorModel`, `vm.isLoading = false`.
   - Logging via `LoggingService.error`.
3. **Directive/View**:
   - `monthly-summary.view.html` hides KPI cards and chart, shows error state.
4. **User Action**:
   - User clicks Retry; `vm.retry()` calls `_loadSummary` again.


## 12. Error Handling Specification

### 12.1 ErrorModel

Defined earlier; used for all user-visible errors.

### 12.2 HTTP Mapping

Implemented in `HttpInterceptor.responseError`:
- 400 → `type='validation'`.
- 401, 403 → `type='authorization'`.
- 404 → `type='not_found'`.
- 500 → `type='server'`.
- 0 or network failure → `type='network'`.

### 12.3 Validation Errors

- Month selection:
  - Client validates format and membership in `availableMonths`.
  - If invalid, no REST call, show inline message.

### 12.4 Network Errors

- `httpStatus=0` or 503 `API_UNAVAILABLE` error.
- UI displays friendly message and Retry button.

### 12.5 Retry Logic

- No automatic retries.
- User-driven `retry()` method in controller; may call service again.

### 12.6 Logging

- Errors logged via `LoggingService.error` with context including `correlationId` (from interceptor) and route.

### 12.7 User Messages

Examples:
- Validation: "Please select a valid month within the last 12 months.".
- Network: "We are unable to retrieve your spending summary right now. Please try again.".

### 12.8 Fallback Behavior

- If summary cannot be loaded, UI shows error state; no partial data displayed.


## 13. Security (Frontend Perspective)

### 13.1 Input Validation

- Ensure `month` selection is constrained to `availableMonths`.
- Avoid direct user-typed month strings; use controlled dropdown.

### 13.2 Sanitization

- All text values from API are treated as plain text; AngularJS 1.7.9 sanitation ensures safe binding.
- No HTML from API is rendered via `ng-bind-html`.

### 13.3 Authentication Hooks

- Frontend expects an existing authenticated session; token put in `Authorization` header via some upstream logic or existing interceptors; in this LLD, token injection is assumed to be handled by another interceptor or backend, not implemented here.

### 13.4 Authorization Hooks

- Frontend does not manage RBAC; relies on backend 401/403 responses.
- Errors show generic unauthorized messages.

### 13.5 Secure Communication

- All API URLs in `EnvConfig.apiBaseUrl` must use `https://`.

### 13.6 Audit Logging

- `LoggingService.audit` records significant user actions:
  - Viewing summary (month selection).
  - Retry actions.


## 14. Implementation Rules

### 14.1 ES6 Syntax

- Use `const` and `let` instead of `var` inside functions.
- Arrow functions may be used except where Angular DI is involved; use named functions for DI-annotated components.

### 14.2 Explicit `$inject` Arrays

- For each DI-enabled function (controller, service, factory, interceptor, config, run), specify `$inject` array explicitly.

### 14.3 ControllerAs Syntax

- All controllers use ControllerAs pattern; `MonthlySummaryController` uses `vm` alias.

### 14.4 Promise Handling

- Use `$q` promises for asynchronous operations.
- Always return promises from service methods.

### 14.5 Naming Conventions

- Modules: `app`.
- Controllers: `*Controller` suffix.
- Services: `*Service` suffix.
- Factories (models): `*Model` or `EnvConfig`.
- Directives: camelCase, used as kebab-case in templates.
- Files: kebab-case matching component name.

### 14.6 Folder Conventions

- `core` for shared models, services, config.
- `spending` for feature-specific components.
- `templates` for HTML views.

### 14.7 File Naming Conventions

- `<feature>/<component-type>/<name>.controller.js` etc.


## 15. Architecture Constraints

- Only one Angular module declaration: `app.module.js`.
- All other Angular files use `angular.module('app')` reference.
- No circular module dependencies because only one module exists.
- No circular service dependencies:
  - `LoggingService` uses `$injector` to lazy resolve `$http`; `HttpInterceptor` uses `LoggingService` but not vice versa.
- `HttpInterceptor` does not depend on `$http`.
- LoggingService lazily resolves `$http`.
- Startup services (EnvConfigService) do not depend on API services; they only use `$http` to get configuration.
- Each dependency is registered exactly once.


## 16. Implementation Validation Checklist

The LLD defines:

- Every source file.
- Every repository path.
- Every script reference in `index.html`.
- Every stylesheet reference.
- Every template and `templateUrl`.
- Every route and associated controller.
- Every Angular dependency and injected service.
- Every directive binding (`scope`, `bindToController`).
- Every model and its properties.
- REST API for summary data.
- Environment properties (`apiBaseUrl`, `apiTimeoutMs`, `maxLookbackMonths`, `useMockData`, `featureFlags`, `telemetry`).
- Mock responses.
- Public methods for all components.
- Script and stylesheet loading order.
- Architecture constraints to avoid circular dependencies.

This ensures the Code Generation Agent can generate the complete frontend application for QE-3198 without making any additional implementation decisions.
