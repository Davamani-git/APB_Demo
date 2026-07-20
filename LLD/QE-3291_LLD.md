# QE-3291 Monthly Spending Summary Dashboard – Low Level Design (LLD)

## 1. Application Overview

The QE-3291 Monthly Spending Summary Dashboard is a browser-based Single Page Application (SPA) built using AngularJS 1.7.9. It presents read-heavy, analytics-oriented views over credit card spending and related KPIs. The application consumes REST APIs exposed by an enterprise Edge/API layer and renders:

- Monthly spending KPIs (total spend, total credit limit, available credit, outstanding amount, utilization %, transaction count).
- Multi-card management view (card name, issuing bank, masked number, limits, outstanding, billing/due dates).
- Transaction management table with filters (merchant, category, bank, card, date range) and sorting (amount, date) with pagination.
- Spending analytics charts (category-wise, monthly trend, card-wise distribution, category breakdown using named categories).
- Budget tracking view (monthly budget, current spend, remaining budget, utilization %, progress bar).
- Recent transactions widget (latest five transactions).

All business requirements from QE-3291 HLD are implemented strictly on the client as view and interaction specifications. The backend services (Dashboard Aggregation, Credit Card Profile, Transaction Query, Spending Analytics, Budget Management, Edge/API Gateway) are represented via REST API contracts; their internal implementations are out of scope for this LLD.

The LLD defines complete implementation specifications for the AngularJS front-end and its interaction with the REST APIs, mock implementations, models, configuration, validation, and error handling so that the Code Generation Agent can implement the application without assumptions.

## 2. Technology Stack

### 2.1 Front-end Technologies

- HTML5
- CSS3
- JavaScript (ES6-compatible, but executed in browsers supporting AngularJS 1.7.9)
- AngularJS 1.7.9
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only – bootstrap.min.css)
- Chart.js 2.9.4

### 2.2 Browser Support

- Google Chrome (latest enterprise-supported versions)
- Microsoft Edge (Chromium-based, latest enterprise-supported versions)

### 2.3 External Libraries/CDNs

Index page will reference the following via CDN:

- Bootstrap 3.4.1 CSS
- AngularJS 1.7.9
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Chart.js 2.9.4

No jQuery or bootstrap.min.js will be included unless explicitly required; QE-3291 does not require them.

## 3. Architecture Design

### 3.1 Architectural Style

- AngularJS MVC
- Single Page Application (SPA)
- Dependency Injection
- ControllerAs syntax (no $scope usage in templates)
- IIFE pattern for all Angular modules and components
- REST-based communication with backend via $http

### 3.2 Logical Layers (Front-end)

- **Presentation/UI Layer**
  - index.html
  - Templates (dashboard, cards, transactions, charts, budget, recent transactions)
  - Directives for reusable UI elements (KPI cards, chart widgets, progress bars, tables)

- **Controller Layer**
  - Coordinates user interactions, routing, and view state.
  - Delegates business logic exclusively to services.

- **Service Layer**
  - Encapsulates business logic related to dashboard KPIs, card profiles, transactions, analytics, budgets, configuration, logging.
  - Communicates with REST APIs or Mock services depending on ENV_CONFIG.useMockData.

- **Model Layer**
  - JavaScript objects representing data (MonthlySummary, CardProfile, Transaction, Analytics datasets, Budget, ErrorModel).

- **Configuration Layer**
  - ENV_CONFIG JSON files.
  - Angular constants for API URLs, timeouts, feature flags.

- **Routing Layer**
  - Angular Route configuration mapping URLs to templates and controllers.

- **Mock Layer**
  - Mock services simulating REST endpoints using $q and $timeout.

### 3.3 Cross-cutting Concerns (Front-end)

- Logging via LoggingService
- Error handling via standardized ErrorModel and interceptor
- Validation in services/controllers for inputs and responses
- Security (input validation, output encoding/sanitization via ngSanitize)
- Feature flags via ENV_CONFIG.featureFlags

## 4. Repository Structure

```text
src/
  index.html
  app/
    app.module.js
    app.routes.js
    config/
      env.default.json
      env.dev.json
      env.prod.json
      config.constants.js
    controllers/
      dashboard.controller.js
      cards.controller.js
      transactions.controller.js
      analytics.controller.js
      budget.controller.js
      recentTransactions.controller.js
    services/
      dashboard.service.js
      cards.service.js
      transactions.service.js
      analytics.service.js
      budget.service.js
      config.service.js
      logging.service.js
      errorHandling.service.js
    factories/
      models.factory.js
    directives/
      kpiCard.directive.js
      cardList.directive.js
      transactionTable.directive.js
      chartWidget.directive.js
      budgetProgress.directive.js
      recentTransactions.directive.js
    filters/
      currencyFormat.filter.js
      dateFormat.filter.js
      percentage.filter.js
    models/
      monthlySummary.model.js
      cardProfile.model.js
      transaction.model.js
      analytics.model.js
      budget.model.js
      error.model.js
    interceptors/
      httpError.interceptor.js
    routes/
      navigation.config.js
    mock/
      mock.dashboard.service.js
      mock.cards.service.js
      mock.transactions.service.js
      mock.analytics.service.js
      mock.budget.service.js
  templates/
    layout/
      main.layout.html
    dashboard/
      dashboard.view.html
      kpiCard.partial.html
      cardList.partial.html
      transactionTable.partial.html
      categoryChart.partial.html
      trendChart.partial.html
      cardDistributionChart.partial.html
      categoryBreakdownChart.partial.html
      budgetProgress.partial.html
      recentTransactions.partial.html
  assets/
    css/
      app.css
      dashboard.css
    js/
      vendor-init.js
    images/
      (icons for cards, categories, empty/error states)
    fonts/
      (optional custom fonts)
  data/
    mock/
      dashboard.summary.json
      cards.list.json
      transactions.list.json
      analytics.category.json
      analytics.trend.json
      analytics.cardDistribution.json
      analytics.categoryBreakdown.json
      budget.details.json
README.md
```

Every file below will include documentation of purpose, dependencies, inputs/outputs, models, configuration, error handling and consumers.

## 5. Application Bootstrap Design

### 5.1 index.html

**Path**: `src/index.html`

**Purpose**: Entry point for SPA, defines root Angular app, loads CSS/JS, configures ng-view.

**Key Elements**:

- `<html lang="en" ng-app="apbDashboardApp">`
- `<head>`
  - Bootstrap 3.4.1 CSS via CDN.
  - `assets/css/app.css`, `assets/css/dashboard.css`.
- `<body>`
  - Main layout container `ng-controller="DashboardController as vm"` or layout controller as needed.
  - `<div ng-view></div>` for routing.
- Script load order:
  1. AngularJS 1.7.9
  2. Angular Route
  3. Angular Animate
  4. Angular Sanitize
  5. Angular UI Bootstrap
  6. Chart.js 2.9.4
  7. `assets/js/vendor-init.js` (if needed)
  8. `app/app.module.js`
  9. `app/config/config.constants.js`
  10. `app/app.routes.js`
  11. `app/routes/navigation.config.js`
  12. Models, filters, directives, factories, services, controllers, interceptors.

**Dependencies**:

- AngularJS and all app modules.

**States**:

- Loading state: show loading spinner until Angular bootstrap completes.
- Error state: show generic error message if app fails to initialize.

### 5.2 ENV_CONFIG Loading

ENV_CONFIG files (`env.default.json`, `env.dev.json`, `env.prod.json`) will be loaded either via:

- Static inclusion at build time; or
- A config service that retrieves appropriate JSON based on environment (implementation detail for Code Generation Agent).

LLD requires that ENV_CONFIG be available before services make HTTP calls. `config.service.js` will expose `getConfig()` returning ENV_CONFIG.

## 6. Module Design

### 6.1 Root Module

**File**: `src/app/app.module.js`

**Angular Registration**:

```js
(function () {
  'use strict';

  angular.module('apbDashboardApp', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap'
  ]);
})();
```

**Purpose**: Defines root AngularJS module for QE-3291 dashboard.

**Dependencies**:

- ngRoute: routing
- ngAnimate: animations (optional for transitions)
- ngSanitize: safe HTML binding
- ui.bootstrap: Bootstrap-based Angular components

**Consumers**:

- All controllers, services, factories, directives, filters, interceptors register against this module via `angular.module('apbDashboardApp')`.

## 7. Routing Design

### 7.1 Route Configuration

**File**: `src/app/app.routes.js`

**Angular Registration**:

```js
(function () {
  'use strict';

  angular
    .module('apbDashboardApp')
    .config(routeConfig);

  routeConfig.$inject = ['$routeProvider', '$locationProvider'];

  function routeConfig($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
      .when('/dashboard', {
        templateUrl: 'templates/dashboard/dashboard.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  }
})();
```

**Routes**:

- `/dashboard`
  - Controller: DashboardController
  - Template: `templates/dashboard/dashboard.view.html`

**Default Route**:

- Any unknown route redirects to `/dashboard`.

**Reachability**:

- `/dashboard` is reachable via index.html initial load (default route) and by direct navigation.

### 7.2 Navigation Configuration (Optional logical routes)

**File**: `src/app/routes/navigation.config.js`

**Purpose**: Define UI navigation entries if future epics introduce multiple pages. For QE-3291, single dashboard page uses a simple navigation bar.

**Structure**:

- Model defining nav items: Dashboard, (future: Settings, Budgets, etc.).
- Current implementation: one nav item anchored to `/dashboard`.

## 8. Component Registry

The following table enumerates all AngularJS components.

### 8.1 Controllers

- DashboardController (dashboard.controller.js)
- CardsController (cards.controller.js)
- TransactionsController (transactions.controller.js)
- AnalyticsController (analytics.controller.js)
- BudgetController (budget.controller.js)
- RecentTransactionsController (recentTransactions.controller.js)

### 8.2 Services

- DashboardService (dashboard.service.js)
- CardsService (cards.service.js)
- TransactionsService (transactions.service.js)
- AnalyticsService (analytics.service.js)
- BudgetService (budget.service.js)
- ConfigService (config.service.js)
- LoggingService (logging.service.js)
- ErrorHandlingService (errorHandling.service.js)

### 8.3 Factories

- ModelsFactory (models.factory.js)

### 8.4 Directives

- kpiCard (kpiCard.directive.js)
- cardList (cardList.directive.js)
- transactionTable (transactionTable.directive.js)
- chartWidget (chartWidget.directive.js)
- budgetProgress (budgetProgress.directive.js)
- recentTransactions (recentTransactions.directive.js)

### 8.5 Filters

- currencyFormat (currencyFormat.filter.js)
- dateFormat (dateFormat.filter.js)
- percentage (percentage.filter.js)

### 8.6 Models

- MonthlySummaryModel (monthlySummary.model.js)
- CardProfileModel (cardProfile.model.js)
- TransactionModel (transaction.model.js)
- AnalyticsModel (analytics.model.js)
- BudgetModel (budget.model.js)
- ErrorModel (error.model.js)

### 8.7 Interceptors

- HttpErrorInterceptor (httpError.interceptor.js)

### 8.8 Config & Constants

- ENV_CONFIG (env.*.json)
- AppConstants (config.constants.js)

Every component registry entry is expanded in sections below with name, type, path, dependencies, methods, and consumers.

## 9. Controller Design

### 9.1 DashboardController

**File**: `src/app/controllers/dashboard.controller.js`

**Component Type**: Controller

**Angular Registration**:

```js
(function () {
  'use strict';

  angular
    .module('apbDashboardApp')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = [
    'DashboardService',
    'CardsService',
    'TransactionsService',
    'AnalyticsService',
    'BudgetService',
    'LoggingService',
    'ErrorHandlingService'
  ];

  function DashboardController(
    DashboardService,
    CardsService,
    TransactionsService,
    AnalyticsService,
    BudgetService,
    LoggingService,
    ErrorHandlingService
  ) {
    var vm = this;

    // ViewModel properties and methods are defined by the Code Generation Agent
  }
})();
```

**Purpose**:

- Coordinate the main dashboard view.
- Aggregate data from multiple services for KPI tiles, multi-card view, transaction table, analytics charts, budget view, recent transactions widget.
- Manage loading, empty, and error states at the view level.

**Dependencies**:

- DashboardService: monthly summary KPIs.
- CardsService: multi-card list.
- TransactionsService: transaction table and recent transactions.
- AnalyticsService: chart datasets.
- BudgetService: budget metrics.
- LoggingService: informational logs for user actions/loading.
- ErrorHandlingService: mapping errors to UI messages.

**Inputs**:

- User-selected month (default: current month).
- Filter selections for transactions/analytics (passed to child controllers/directives when applicable).

**Outputs**:

- ViewModel objects bound to:
  - KPI cards
  - card list
  - transaction table
  - charts
  - budget progress
  - recent transactions widget

**ViewModel Properties (examples)**:

- `vm.selectedMonth`
- `vm.summary` (MonthlySummaryModel)
- `vm.cards` (Array<CardProfileModel>)
- `vm.transactions` (Array<TransactionModel>)
- `vm.transactionFilters` (filter object)
- `vm.analytics` (AnalyticsModel datasets)
- `vm.budget` (BudgetModel)
- `vm.recentTransactions` (Array<TransactionModel>)
- `vm.isLoadingSummary`, `vm.isLoadingCards`, etc.
- `vm.hasSummaryError`, `vm.summaryErrorMessage`, etc.

**Public Methods (signatures)**:

- `vm.initialize()`
  - Inputs: none
  - Outputs: populates initial month, loads summary, cards, transactions, analytics, budget, recent transactions.

- `vm.onMonthChange(newMonth)`
  - Inputs: `newMonth` (string YYYY-MM or date object)
  - Outputs: refreshes summary, analytics, budget; triggers relevant service calls.

- `vm.refreshAll()`
  - Inputs: none
  - Outputs: re-fetches all dashboard data, resets error states.

- `vm.handleError(errorContext, error)`
  - Inputs: `errorContext` (string identifier, e.g., 'summary', 'cards'), `error` (ErrorModel or HTTP error)
  - Outputs: sets appropriate error flags/messages, logs error via LoggingService and ErrorHandlingService.

**Private Methods (examples)**:

- `_loadSummary()`
- `_loadCards()`
- `_loadTransactions()`
- `_loadAnalytics()`
- `_loadBudget()`
- `_loadRecentTransactions()`

**Event Handlers**:

- Handles UI events such as refresh button clicks, month selection changes.

**Error Handling**:

- Uses ErrorHandlingService to interpret errors.
- Shows appropriate error states in the view templates.

### 9.2 CardsController

**File**: `src/app/controllers/cards.controller.js`

**Purpose**:

- Manage card list-specific behaviours inside the multi-card view section (e.g., local sorting, selection).

**Dependencies**:

- CardsService
- LoggingService

**ViewModel**:

- `vm.cards`: Array<CardProfileModel>
- `vm.selectedCardId`: identifier for a focused card (if needed for future extensions).

**Public Methods**:

- `vm.loadCards()`
- `vm.sortCardsBy(field)` (field: limit, availableCredit, outstanding)

CardsController can be used directly by cardList directive or nested inside DashboardController.

### 9.3 TransactionsController

**File**: `src/app/controllers/transactions.controller.js`

**Purpose**:

- Coordinate transaction table filters, sorting, pagination.

**Dependencies**:

- TransactionsService
- LoggingService
- ErrorHandlingService

**ViewModel**:

- `vm.filters` (merchant, category, bank, card, dateRange)
- `vm.sort` (sortField, sortDirection)
- `vm.page` (currentPage, pageSize, totalPages)
- `vm.transactions` (Array<TransactionModel>)
- `vm.isLoadingTransactions`, `vm.hasTransactionsError`, `vm.transactionsErrorMessage`

**Public Methods**:

- `vm.applyFilters()`
- `vm.clearFilters()`
- `vm.changeSort(field)`
- `vm.goToPage(pageNumber)`

### 9.4 AnalyticsController

**File**: `src/app/controllers/analytics.controller.js`

**Purpose**:

- Manage chart-specific interactions (e.g., chart filters, view selection) for category-wise spending, monthly trend, card-wise distribution, category breakdown.

**Dependencies**:

- AnalyticsService
- LoggingService
- ErrorHandlingService

**ViewModel**:

- `vm.categoryChartData`
- `vm.trendChartData`
- `vm.cardDistributionData`
- `vm.categoryBreakdownData`
- `vm.selectedMonth`
- `vm.selectedPeriodRange`

**Public Methods**:

- `vm.loadAnalyticsForMonth(month)`
- `vm.loadTrend(periodRange)`

### 9.5 BudgetController

**File**: `src/app/controllers/budget.controller.js`

**Purpose**:

- Manage budget metrics view (monthly budget, current spend, remaining budget, utilization %, progress bar) and related interactions.

**Dependencies**:

- BudgetService
- LoggingService
- ErrorHandlingService

**ViewModel**:

- `vm.budget` (BudgetModel)
- `vm.isLoadingBudget`
- `vm.hasBudgetError`
- `vm.budgetErrorMessage`

**Public Methods**:

- `vm.loadBudget(month)`

### 9.6 RecentTransactionsController

**File**: `src/app/controllers/recentTransactions.controller.js`

**Purpose**:

- Manage recent transactions widget showing latest five transactions.

**Dependencies**:

- TransactionsService
- LoggingService
- ErrorHandlingService

**ViewModel**:

- `vm.recentTransactions` (Array<TransactionModel>)
- `vm.isLoadingRecent`
- `vm.hasRecentError`
- `vm.recentErrorMessage`

**Public Methods**:

- `vm.loadRecent()`
- `vm.refreshRecent()`

## 10. Service Design

### 10.1 DashboardService

**File**: `src/app/services/dashboard.service.js`

**Purpose**:

- Encapsulate business logic for retrieving monthly summary KPIs.

**Dependencies**:

- `$http`
- `$q`
- `ConfigService`
- `LoggingService`
- `ErrorHandlingService`
- `MonthlySummaryModel`

**Configuration Used**:

- `ENV_CONFIG.apiBaseUrl`
- `ENV_CONFIG.apiTimeoutMs`

**Public Methods**:

- `getMonthlySummary(month)`
  - Inputs: `month` (string YYYY-MM or ISO date string)
  - Behaviour:
    - Build URL: `${apiBaseUrl}/dashboard/summary?month=${month}`
    - Set timeout: `apiTimeoutMs`.
    - Execute GET request.
    - Map response JSON to MonthlySummaryModel.
    - Log success/failure.
  - Returns: Promise<MonthlySummaryModel>

**Error Handling**:

- Uses ErrorHandlingService to evaluate HTTP response codes (400, 401, 403, 404, 408, 500).
- Applies retry policy (bounded, e.g., up to 3 attempts with exponential backoff) defined in Code Generation.

### 10.2 CardsService

**File**: `src/app/services/cards.service.js`

**Purpose**:

- Retrieve normalized card profiles for multi-card view.

**Dependencies**:

- `$http`
- `$q`
- `ConfigService`
- `LoggingService`
- `ErrorHandlingService`
- `CardProfileModel`

**Public Methods**:

- `getCards()`
  - Inputs: none (user identity from token).
  - Behaviour:
    - GET `${apiBaseUrl}/cards`.
    - Map response array to Array<CardProfileModel>.
    - Ensure masked card numbers only.
  - Returns: Promise<Array<CardProfileModel>>

### 10.3 TransactionsService

**File**: `src/app/services/transactions.service.js`

**Purpose**:

- Retrieve transactions list for table and recent transactions widget.

**Dependencies**:

- `$http`
- `$q`
- `ConfigService`
- `LoggingService`
- `ErrorHandlingService`
- `TransactionModel`

**Public Methods**:

- `searchTransactions(filters, sort, page)`
  - Inputs:
    - `filters`: { merchant?, category?, bank?, card?, dateFrom?, dateTo? }
    - `sort`: { field: 'amount' | 'date', direction: 'asc' | 'desc' }
    - `page`: { number, size }
  - Behaviour:
    - Validate filters (types, allowed categories, date ranges) before calling API.
    - Build query string.
    - GET `${apiBaseUrl}/transactions/search`.
    - Map response to { data: Array<TransactionModel>, totalCount }.
  - Returns: Promise<{ transactions: Array<TransactionModel>, totalCount: number }>

- `getRecentTransactions(limit)`
  - Inputs: `limit` (integer, default 5)
  - Behaviour:
    - GET `${apiBaseUrl}/transactions/recent?limit=${limit}`.
    - Map response to Array<TransactionModel>.
  - Returns: Promise<Array<TransactionModel>>

### 10.4 AnalyticsService

**File**: `src/app/services/analytics.service.js`

**Purpose**:

- Retrieve and transform analytics datasets for charts.

**Dependencies**:

- `$http`
- `$q`
- `ConfigService`
- `LoggingService`
- `ErrorHandlingService`
- `AnalyticsModel`

**Public Methods**:

- `getCategorySpending(month)`
- `getMonthlyTrend(periodRange)`
- `getCardDistribution(month)`
- `getCategoryBreakdown(month)`

All methods:

- Input validation (month format, periodRange bounds).
- Use correct endpoints (see REST API Contract section).
- Map responses to Chart.js-ready datasets via AnalyticsModel.

### 10.5 BudgetService

**File**: `src/app/services/budget.service.js`

**Purpose**:

- Retrieve budget configuration and utilization metrics.

**Dependencies**:

- `$http`
- `$q`
- `ConfigService`
- `LoggingService`
- `ErrorHandlingService`
- `BudgetModel`

**Public Methods**:

- `getBudget(month)`
  - Inputs: month.
  - Behaviour:
    - GET `${apiBaseUrl}/budget?month=${month}`.
    - Map response to BudgetModel.
  - Returns: Promise<BudgetModel>

### 10.6 ConfigService

**File**: `src/app/services/config.service.js`

**Purpose**:

- Provide access to ENV_CONFIG and AppConstants.

**Dependencies**:

- `$http` (optional if config loaded via HTTP)

**Public Methods**:

- `getConfig()`
- `getApiBaseUrl()`
- `getFeatureFlags()`
- `isMockEnabled()` (returns ENV_CONFIG.useMockData)

### 10.7 LoggingService

**File**: `src/app/services/logging.service.js`

**Purpose**:

- Centralized logging abstraction.

**Dependencies**:

- `$log`

**Public Methods**:

- `info(message, context?)`
- `warn(message, context?)`
- `error(message, context?)`
- `audit(event, details)`

Sensitive data is never logged.

### 10.8 ErrorHandlingService

**File**: `src/app/services/errorHandling.service.js`

**Purpose**:

- Map errors from REST calls into standardized ErrorModel and user-friendly messages.

**Dependencies**:

- `ErrorModel`
- `LoggingService`

**Public Methods**:

- `createErrorModel(httpError)`
- `getUserMessage(errorModel)`

## 11. Factory Design

### 11.1 ModelsFactory

**File**: `src/app/factories/models.factory.js`

**Purpose**:

- Create instances of model objects.

**Dependencies**:

- MonthlySummaryModel
- CardProfileModel
- TransactionModel
- AnalyticsModel
- BudgetModel
- ErrorModel

**Public Methods**:

- `createMonthlySummary(data)`
- `createCardProfile(data)`
- `createTransaction(data)`
- `createAnalytics(data)`
- `createBudget(data)`
- `createError(data)`

Factories remain stateless and do not perform REST operations.

## 12. Directive Design

### 12.1 kpiCard Directive

**File**: `src/app/directives/kpiCard.directive.js`

**Purpose**:

- Render an individual KPI card (e.g., Total Spend, Total Credit Limit).

**Directive Definition**:

- `restrict: 'E'`
- `scope`: isolated
- `bindToController: true`
- `controller: 'KpiCardController'` (if needed or use DashboardController context)
- `controllerAs: 'vm'`
- `templateUrl: 'templates/dashboard/kpiCard.partial.html'`

**Scope Bindings**:

- `label: '@'`
- `icon: '@'`
- `value: '='`
- `formattedValue: '@?'`
- `onClick: '&?'`

**Usage Example**:

```html
<kpi-card
  label="Total Monthly Spend"
  icon="icon-total-spend"
  value="vm.summary.totalSpend">
</kpi-card>
```

### 12.2 cardList Directive

**File**: `src/app/directives/cardList.directive.js`

**Purpose**:

- Display multi-card view.

**Directive Definition**:

- `restrict: 'E'`
- `scope`: { cards: '=' }
- `templateUrl: 'templates/dashboard/cardList.partial.html'`
- `controller: 'CardsController'`
- `controllerAs: 'vm'`

**Usage Example**:

```html
<card-list cards="vm.cards"></card-list>
```

### 12.3 transactionTable Directive

**File**: `src/app/directives/transactionTable.directive.js`

**Purpose**:

- Display responsive transactions table with filters, sorting, pagination.

**Directive Definition**:

- `restrict: 'E'`
- `scope`: {
    transactions: '=',
    filters: '=',
    sort: '=',
    page: '=',
    onFilterChange: '&',
    onSortChange: '&',
    onPageChange: '&'
  }
- `templateUrl: 'templates/dashboard/transactionTable.partial.html'`
- `controller: 'TransactionsController'`
- `controllerAs: 'vm'`

**Usage Example**:

```html
<transaction-table
  transactions="vm.transactions"
  filters="vm.transactionFilters"
  sort="vm.sort"
  page="vm.page"
  on-filter-change="vm.applyFilters()"
  on-sort-change="vm.changeSort(field)"
  on-page-change="vm.goToPage(page)">
</transaction-table>
```

### 12.4 chartWidget Directive

**File**: `src/app/directives/chartWidget.directive.js`

**Purpose**:

- Render Chart.js visualizations.

**Directive Definition**:

- `restrict: 'E'`
- `scope`: {
    config: '=', // Chart.js config object
    type: '@'
  }
- `templateUrl: 'templates/dashboard/categoryChart.partial.html'` or others based on `type`
- Use a controller or link function to initialize Chart.js.

### 12.5 budgetProgress Directive

**File**: `src/app/directives/budgetProgress.directive.js`

**Purpose**:

- Display budget progress bar and metrics.

**Directive Definition**:

- `restrict: 'E'`
- `scope`: { budget: '=' }
- `templateUrl: 'templates/dashboard/budgetProgress.partial.html'`
- `controller: 'BudgetController'`

### 12.6 recentTransactions Directive

**File**: `src/app/directives/recentTransactions.directive.js`

**Purpose**:

- Show latest five transactions as widget.

**Directive Definition**:

- `restrict: 'E'`
- `scope`: { transactions: '=' }
- `templateUrl: 'templates/dashboard/recentTransactions.partial.html'`
- `controller: 'RecentTransactionsController'`

## 13. Filter Design

### 13.1 currencyFormat Filter

**File**: `src/app/filters/currencyFormat.filter.js`

**Purpose**:

- Format numeric amounts according to configured currency.

**Input**: number

**Output**: string (e.g., "₹45,872.00")

### 13.2 dateFormat Filter

**File**: `src/app/filters/dateFormat.filter.js`

**Purpose**:

- Format dates consistently.

**Input**: Date or ISO string

**Output**: string (e.g., "20 Jul 2026")

### 13.3 percentage Filter

**File**: `src/app/filters/percentage.filter.js`

**Purpose**:

- Format decimal numbers as percentages.

**Input**: number (0–1 or 0–100, defined via config)

**Output**: string (e.g., "78%")

## 14. Model Design

### 14.1 MonthlySummaryModel

**File**: `src/app/models/monthlySummary.model.js`

**Purpose**:

- Represent monthly dashboard KPIs.

**Properties**:

- `month`: string (YYYY-MM) – required
- `totalSpend`: number (>= 0)
- `totalCreditLimit`: number (>= 0)
- `availableCredit`: number (>= 0)
- `outstandingAmount`: number (>= 0)
- `utilizationPercentage`: number (>= 0)
- `transactionCount`: number (>= 0)

**Sample JSON**:

```json
{
  "month": "2026-07",
  "totalSpend": 45872,
  "totalCreditLimit": 600000,
  "availableCredit": 554128,
  "outstandingAmount": 45872,
  "utilizationPercentage": 7.64,
  "transactionCount": 92
}
```

### 14.2 CardProfileModel

**File**: `src/app/models/cardProfile.model.js`

**Purpose**:

- Represent card attributes for multi-card view.

**Properties**:

- `cardId`: string
- `cardDisplayName`: string
- `issuingBank`: string
- `maskedCardNumber`: string (e.g., "XXXX-XXXX-XXXX-1234")
- `creditLimit`: number
- `availableCredit`: number
- `outstandingAmount`: number
- `billingDate`: string (date)
- `dueDate`: string (date)

**Sample JSON**:

```json
{
  "cardId": "CARD-001",
  "cardDisplayName": "Platinum Rewards",
  "issuingBank": "ABC Bank",
  "maskedCardNumber": "XXXX-XXXX-XXXX-1234",
  "creditLimit": 200000,
  "availableCredit": 178500,
  "outstandingAmount": 21500,
  "billingDate": "2026-07-05",
  "dueDate": "2026-07-25"
}
```

### 14.3 TransactionModel

**File**: `src/app/models/transaction.model.js`

**Purpose**:

- Represent transaction rows in table and recent transactions.

**Properties**:

- `transactionId`: string
- `transactionDate`: string (ISO date-time)
- `merchantName`: string
- `category`: string (one of configured categories)
- `bank`: string
- `cardId`: string
- `maskedCardNumber`: string
- `amount`: number
- `paymentStatus`: string (e.g., "Success", "Pending", "Failed")
- `remarks`: string (optional)

**Sample JSON**:

```json
{
  "transactionId": "TXN-001",
  "transactionDate": "2026-07-19T14:23:00Z",
  "merchantName": "SuperMart",
  "category": "Shopping",
  "bank": "ABC Bank",
  "cardId": "CARD-001",
  "maskedCardNumber": "XXXX-XXXX-XXXX-1234",
  "amount": 2450,
  "paymentStatus": "Success",
  "remarks": "Monthly groceries"
}
```

### 14.4 AnalyticsModel

**File**: `src/app/models/analytics.model.js`

**Purpose**:

- Represent analytics datasets for charts.

**Properties**:

- `categorySpending`: { labels: string[], data: number[] }
- `monthlyTrend`: { labels: string[], data: number[] }
- `cardDistribution`: { labels: string[], data: number[] }
- `categoryBreakdown`: { labels: string[], data: number[] }

**Categories** (fixed set per HLD):

- Food & Dining
- Fuel
- Shopping
- Travel
- Entertainment
- Utilities
- Healthcare
- Education
- Miscellaneous

### 14.5 BudgetModel

**File**: `src/app/models/budget.model.js`

**Purpose**:

- Represent monthly budget metrics.

**Properties**:

- `month`: string (YYYY-MM)
- `budgetAmount`: number (>= 0)
- `currentSpend`: number (>= 0)
- `remainingBudget`: number (>= 0)
- `utilizationPercentage`: number (>= 0)

**Sample JSON**:

```json
{
  "month": "2026-07",
  "budgetAmount": 50000,
  "currentSpend": 45872,
  "remainingBudget": 4130,
  "utilizationPercentage": 91.74
}
```

### 14.6 ErrorModel

**File**: `src/app/models/error.model.js`

**Purpose**:

- Represent standardized error.

**Properties**:

- `code`: string or HTTP code
- `type`: string (validation, business, network, timeout, unexpected)
- `message`: string (technical message)
- `userMessage`: string (user-friendly)
- `context`: string

## 15. REST API Contract

The front-end relies on the following REST endpoints provided by the Edge/API layer.

### 15.1 Authentication & Session

Out of scope for implementation in this LLD; assumed handled by enterprise login and token issuance. Front-end calls QE-3291 APIs with authorization headers (e.g., `Authorization: Bearer <token>`).

### 15.2 Dashboard Summary Endpoint

- **Endpoint**: `/dashboard/summary`
- **Method**: GET
- **Query Parameters**:
  - `month`: string (YYYY-MM)
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:
  - Status: 200
  - Body: MonthlySummaryModel JSON
- **Error Responses**:
  - 400 Invalid month
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Data not found
  - 408 Timeout
  - 500 Internal error

### 15.3 Cards List Endpoint

- **Endpoint**: `/cards`
- **Method**: GET
- **Success Response**:
  - 200: Array<CardProfileModel>

### 15.4 Transactions Search Endpoint

- **Endpoint**: `/transactions/search`
- **Method**: GET
- **Query Parameters**:
  - `merchant`, `category`, `bank`, `card`, `dateFrom`, `dateTo`, `sortField`, `sortDirection`, `page`, `pageSize`
- **Success Response**:
  - 200: { data: Array<TransactionModel>, totalCount: number }

### 15.5 Recent Transactions Endpoint

- **Endpoint**: `/transactions/recent`
- **Method**: GET
- **Query Parameters**:
  - `limit` (default 5)
- **Success Response**:
  - 200: Array<TransactionModel>

### 15.6 Analytics Endpoints

- **Category Spending**: `GET /analytics/category-spending?month=YYYY-MM`
- **Monthly Trend**: `GET /analytics/monthly-trend?from=YYYY-MM&to=YYYY-MM`
- **Card Distribution**: `GET /analytics/card-distribution?month=YYYY-MM`
- **Category Breakdown**: `GET /analytics/category-breakdown?month=YYYY-MM`

All analytics endpoints return JSON shapes compatible with AnalyticsModel.

### 15.7 Budget Endpoint

- **Endpoint**: `GET /budget?month=YYYY-MM`
- **Success Response**:
  - 200: BudgetModel JSON

### 15.8 Common Contract Rules

- All endpoints use HTTPS.
- Timeout settings respect `ENV_CONFIG.apiTimeoutMs`.
- Retry is implemented at service level (where appropriate), not by controller.

## 16. Configuration Design

### 16.1 ENV_CONFIG

**Files**:

- `src/app/config/env.default.json`
- `src/app/config/env.dev.json`
- `src/app/config/env.prod.json`

**Example Properties**:

```json
{
  "apiBaseUrl": "https://api.example.com/qe3291",
  "apiTimeoutMs": 10000,
  "maxLookbackMonths": 12,
  "useMockData": false,
  "featureFlags": {
    "showCardDistribution": true,
    "showCategoryBreakdown": true,
    "showBudgetWidget": true,
    "showRecentTransactionsWidget": true
  },
  "telemetry": {
    "enabled": true
  }
}
```

### 16.2 config.constants.js

**File**: `src/app/config/config.constants.js`

**Purpose**:

- Define Angular constants derived from ENV_CONFIG.

**Constants**:

- `APP_CONFIG`: holds apiBaseUrl, apiTimeoutMs, maxLookbackMonths, featureFlags, telemetry.

### 16.3 Configuration Rules

- No configuration values hardcoded in controllers/services.
- `useMockData` toggles between real REST services and mock services without code changes.

## 17. Mock Implementation Design

Mock services mirror REST APIs.

### 17.1 General Rules

- Use `$q` and `$timeout` for async simulation.
- Respect same models, status codes, and error structures.
- Provide sample JSON files under `data/mock`.

### 17.2 Mock DashboardService

**File**: `src/app/mock/mock.dashboard.service.js`

**Behaviour**:

- On `getMonthlySummary(month)`:
  - Use `$http.get('data/mock/dashboard.summary.json')` or in-memory object.
  - `$timeout` to simulate delay.

### 17.3 Mock CardsService

**File**: `src/app/mock/mock.cards.service.js`

- Returns mock cards from `data/mock/cards.list.json`.

### 17.4 Mock TransactionsService

**File**: `src/app/mock/mock.transactions.service.js`

- Filter transactions from `data/mock/transactions.list.json` in-memory.

### 17.5 Mock AnalyticsService

**File**: `src/app/mock/mock.analytics.service.js`

- Serve Chart.js-compatible datasets from JSON files.

### 17.6 Mock BudgetService

**File**: `src/app/mock/mock.budget.service.js`

- Serve BudgetModel from `data/mock/budget.details.json`.

## 18. UI Specification

### 18.1 Layout

**Template**: `templates/layout/main.layout.html`

- Header: application title "Monthly Spending Summary" and month selector (dropdown or date picker).
- Content: Bootstrap container with rows for KPI cards, filters, charts, tables, budget, recent transactions.
- Footer: © text or enterprise brand.

### 18.2 Dashboard View

**Template**: `templates/dashboard/dashboard.view.html`

Sections in order:

1. KPI Summary (KPI cards in Bootstrap grid).
2. Filters (for month and transactions).
3. Charts (category spending, trend, card distribution, category breakdown).
4. Transaction table.
5. Budget tracking widget.
6. Recent transactions widget.

### 18.3 KPI Cards

- Use Bootstrap `col-md-2 col-sm-4 col-xs-6` per card.
- Cards show icon, label, value (using filters for currency/percentage).

### 18.4 Charts

- Category-wise spending: bar or doughnut chart.
- Monthly trend: line chart.
- Card distribution: pie chart.
- Category breakdown: bar chart.

All charts support loading, empty, and error states.

### 18.5 Transaction Table

- Bootstrap table with columns: Date, Merchant, Category, Card, Amount, Status, Remarks.
- Sorting icons on Date and Amount columns.
- Pagination controls using ui.bootstrap pagination component.

### 18.6 Budget Widget

- Shows budget amount, current spend, remaining, utilization %.
- Progress bar using Bootstrap.

### 18.7 Recent Transactions Widget

- Shows last five transactions in condensed list.

### 18.8 Responsive Behaviour

- Use Bootstrap grid breakpoints for desktop, tablet, mobile.
- On smaller screens, cards stack vertically; tables may scroll horizontally within container.

### 18.9 Accessibility

- Keyboard navigation to filters, table, and widgets.
- Meaningful labels for inputs and buttons.
- Sufficient color contrast for text and charts.

### 18.10 Loading, Empty, and Error States

- Loading: spinners and disabled controls.
- Empty: messages like "No transactions for selected filters".
- Error: messages like "Unable to retrieve dashboard data. Please try again." with retry controls.

## 19. Data Flow

For each user flow described in HLD, the front-end data flow is:

### 19.1 Flow: Dashboard Summary Retrieval

- User opens dashboard.
- DashboardController.initialize() calls DashboardService.getMonthlySummary(month).
- Service invokes `/dashboard/summary` REST or mock.
- Successful response -> MonthlySummaryModel -> vm.summary -> KPI cards.
- Failure -> ErrorModel -> vm.hasSummaryError -> error section.

### 19.2 Flow: Card List Retrieval

- DashboardController.initialize() or CardsController.loadCards() calls CardsService.getCards().
- Response -> Array<CardProfileModel> -> vm.cards -> cardList directive.

### 19.3 Flow: Transaction Search

- User updates filters in transactionTable.
- TransactionsController.applyFilters() builds filter object and calls TransactionsService.searchTransactions().
- Response -> transactions & totalCount -> table and pagination.

### 19.4 Flow: Analytics Charts

- AnalyticsController.loadAnalyticsForMonth(month) and loadTrend(periodRange) call AnalyticsService methods.
- Response -> analytics datasets -> Chart.js config -> chartWidget directive renders charts.

### 19.5 Flow: Budget Tracking

- BudgetController.loadBudget(month) calls BudgetService.getBudget().
- Response -> BudgetModel -> budgetProgress directive.

### 19.6 Flow: Recent Transactions

- RecentTransactionsController.loadRecent() calls TransactionsService.getRecentTransactions(5).
- Response -> vm.recentTransactions -> recentTransactions directive.

## 20. Business Rules

### 20.1 Monthly Summary Computation

- totalSpend: sum of transaction amounts for the selected month.
- transactionCount: count of transactions for selected month.
- utilizationPercentage: (outstandingAmount / totalCreditLimit) * 100.

Validation:

- totalCreditLimit > 0 for utilization calculation; if 0, utilization = 0.

### 20.2 Card Masking

- UI must never show full card numbers; only maskedCardNumber from API is used.

### 20.3 Filters

- Date range: dateFrom <= dateTo, within maxLookbackMonths.
- Category must be one of configured categories.

### 20.4 Budget Rules

- budgetAmount >= 0.
- currentSpend >= 0.
- remainingBudget = max(0, budgetAmount - currentSpend).

## 21. Validation Rules

### 21.1 Form-level Validation

- Filters inputs validated for type and allowed values before API call.
- Month selection must be valid and within maxLookbackMonths.

### 21.2 API Request Validation

- Services validate required parameters; missing/invalid leads to ErrorModel without calling API.

### 21.3 API Response Validation

- Services check presence and types of expected fields before mapping to models.

### 21.4 Model Validation

- Constructors or factory methods validate properties (non-negative amounts, required fields present).

## 22. Error Handling

### 22.1 Error Types

- Validation errors (client-side)
- Business errors (from backend)
- Network errors
- Timeout errors
- Unexpected errors

### 22.2 Error Flows

- HTTP errors intercepted by HttpErrorInterceptor.
- Interceptor constructs ErrorModel via ErrorHandlingService and rejects promise with ErrorModel.
- Controllers catch errors, call ErrorHandlingService.getUserMessage(), update view state.
- LoggingService records errors.

## 23. Logging Design

### 23.1 Logging Categories

- Info: page loads, filter changes, successful API calls.
- Warning: slow responses, partial data.
- Error: failed API calls, unexpected exceptions.
- Audit: access to budget and card data.

### 23.2 Logging Rules

- No sensitive information (full card numbers, credentials) is logged.

## 24. Security Design

### 24.1 Input Validation & Sanitization

- Filters sanitized; unsafe characters removed or escaped.
- ngSanitize used for any HTML binding.

### 24.2 Authorization

- All API calls include Authorization header; backend enforces user-based access.

### 24.3 Secure Communication

- Only HTTPS endpoints are configured in ENV_CONFIG.apiBaseUrl.

### 24.4 Sensitive Data Handling

- UI limited to masked card numbers and non-sensitive analytics.

## 25. Dependency Map

### 25.1 File-level Dependencies

- `index.html` depends on app.module.js, config.constants.js, app.routes.js, controllers, services, directives, filters, models.
- Controllers depend on services, LoggingService, ErrorHandlingService, models.
- Services depend on $http, $q, ConfigService, LoggingService, ErrorHandlingService, models.
- Directives depend on controllers and templates.
- Filters depend on no external services.
- Models have no dependencies.

### 25.2 Component Consumers

- DashboardController consumes DashboardService, CardsService, TransactionsService, AnalyticsService, BudgetService.
- KPI cards directive consumes MonthlySummaryModel properties.
- TransactionTable directive consumes TransactionModel.
- ChartWidget directive consumes AnalyticsModel.
- BudgetProgress directive consumes BudgetModel.
- RecentTransactions directive consumes TransactionModel.

## 26. LLD Validation Checklist

- Application Overview: defined and aligned with QE-3291 HLD.
- Technology Stack: AngularJS 1.7.9, Bootstrap 3.4.1, Chart.js 2.9.4 – versions not upgraded.
- Architecture: SPA, MVC, DI, ControllerAs, IIFE – all applied.
- Repository Structure: fully defined, no undocumented files.
- Bootstrap: index.html, ng-app, ng-view, script loading order defined.
- Module Design: single root module; others reference existing module.
- Routing: default route `/dashboard` with valid template and controller.
- Component Registry: all controllers, services, factories, directives, filters, models, interceptors documented.
- Controller Design: business logic delegated to services; inputs/outputs defined.
- Service Design: REST communication, mock support, models, configuration, error handling specified.
- Factory Design: stateless; object creation only.
- Directive Design: templates, bindings, usage examples defined.
- Filter Design: input/output and formatting rules defined.
- Model Design: properties, types, sample JSON, validation rules defined.
- REST API Contract: endpoints, methods, parameters, responses defined.
- Configuration Design: ENV_CONFIG and constants; centralization enforced.
- Mock Implementation Design: one mock per REST endpoint; uses $q and $timeout.
- UI Specification: layout, dashboard sections, charts, tables, forms, responsive behaviour, accessibility, states defined.
- Data Flow: success/failure flows for all main features defined.
- Business Rules: computations documented; card masking rules included.
- Validation Rules: forms, requests, responses, models defined.
- Error Handling: ErrorModel, interceptor, mapping to user messages defined.
- Logging Design: info/warn/error/audit categories defined.
- Security Design: input validation, sanitization, authorization, secure communication defined.
- Dependency Map: dependencies/consumers enumerated.
- Quality Gates: all mandatory LLD sections present; boundaries respected (no source code implementation provided).
