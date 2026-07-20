# Low Level Design: Monthly Spending Summary Dashboard (QE-3338)

---

## 1. Application Overview

### 1.1 Purpose
The Monthly Spending Summary Dashboard is a Single Page Application (SPA) that provides authenticated users with consolidated views of their credit card spending, budgets, and analytics. It consumes secured REST APIs exposed by backend services (Dashboard, Card Management, Transaction, Analytics, Budget) and renders:

- Summary KPIs for the selected month (total spend, credit limit, available credit, outstanding amount, utilization %, number of transactions).
- Detailed transaction tables with server-side filtering, search, sorting, and pagination.
- Analytics visualizations for category-wise spending, monthly trends, card-wise distribution, and category breakdown.
- Budget tracking widgets (monthly budget, current spend, remaining budget, utilization progress bar).
- Recent transactions widget (last 5 transactions).

The application follows all standards defined in `lldgenerationkb` and is implementation-ready for the Code Generation Agent without requiring assumptions.

### 1.2 Scope
The scope of this Epic (QE-3338) includes:

- Frontend AngularJS SPA implementing the Monthly Spending Summary Dashboard UI and behaviour.
- REST API contracts between the SPA and the API Gateway / backend services.
- Configuration and mock implementations for all defined REST endpoints.
- Models, validation, error handling, logging, and security behaviour specific to the dashboard.

Out of scope for this Epic (explicitly marked):

- Implementation of external card issuer integrations and transaction ingestion adapters.
- Administration/multi-tenant dashboards beyond individual user views.
- Budget configuration management UI (budgets are assumed to be pre-configured via other means).

---

## 2. Technology Stack

### 2.1 Frontend
- HTML5
- CSS3
- JavaScript ES6 (where compatible with AngularJS 1.7.9)
- AngularJS 1.7.9
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only)
- Chart.js 2.9.4

### 2.2 Backend (as consumed by SPA)
The SPA assumes REST APIs exposed by:
- API Gateway / Edge (HTTPS, OAuth2/OIDC JWT)
- Dashboard Service
- Card Management Service
- Transaction Service
- Analytics Service
- Budget Service

Backend implementation details are out of scope; only contracts are defined here.

### 2.3 Browsers
Supported browsers:
- Google Chrome (latest stable)
- Microsoft Edge (latest stable)

---

## 3. Architecture Design

### 3.1 Overall Architecture
- Single Page Application (SPA) built with AngularJS MVC.
- One root AngularJS module `app`.
- ControllerAs syntax used throughout.
- Dependency Injection for all components.
- REST-based communication via `$http` / `$httpBackend` (for mocks).
- Configuration-driven selection between production REST APIs and mock implementations.

### 3.2 Layering
- **Presentation Layer**: Controllers, templates, directives, filters.
- **Business & Integration Layer**: Services and factories coordinating REST calls and business rules.
- **Data Models Layer**: JavaScript model definitions encapsulating domain entities and view models.
- **Configuration Layer**: Environment-specific configuration files and constants.
- **Mock Layer**: Mock services implementing all REST contracts for local development or demo.

### 3.3 Key Responsibilities
- Controllers: coordinate UI behaviour, route navigation, and interaction with services; no business logic.
- Services: implement business logic, REST communication, data mapping, validation, error handling.
- Models: represent dashboard data structures and enforce internal validation rules.
- Directives: reusable UI components (KPI cards, charts, tables, progress bars, loading indicators, message banners).

---

## 4. Repository Structure

```text
src/
  app/
    app.module.js
    app.config.js
    app.routes.js

    controllers/
      dashboard.controller.js
      transactions.controller.js
      analytics.controller.js
      budget.controller.js

    services/
      dashboard.service.js
      card.service.js
      transaction.service.js
      analytics.service.js
      budget.service.js
      logging.service.js
      error-handler.service.js
      security.service.js

    factories/
      http-wrapper.factory.js
      kpi-card.factory.js
      chart-config.factory.js
      table-config.factory.js

    directives/
      kpiCard.directive.js
      spendingChart.directive.js
      transactionsTable.directive.js
      budgetProgress.directive.js
      loadingIndicator.directive.js
      messageBanner.directive.js

    filters/
      currencyFormat.filter.js
      dateFormat.filter.js
      percentage.filter.js

    models/
      user.model.js
      card.model.js
      transaction.model.js
      budget.model.js
      category.model.js
      dashboard-summary.model.js
      analytics-category-spend.model.js
      analytics-monthly-trend.model.js
      analytics-card-distribution.model.js
      error.model.js

    config/
      config.constants.js
      config.security.js

    routes/
      dashboard.routes.js

  templates/
    dashboard/
      dashboard.html
      dashboard-kpi-section.html
      dashboard-analytics-section.html
      dashboard-budget-section.html
      dashboard-recent-transactions.html
    transactions/
      transactions.html
    analytics/
      analytics.html
    budget/
      budget.html
    shared/
      loading-indicator.html
      message-banner.html
      kpi-card.html
      spending-chart.html
      transactions-table.html
      budget-progress.html

  assets/
    css/
      app.css
      dashboard.css
      transactions.css
      analytics.css
      budget.css
    js/
      vendor/
        (loaded via CDN where possible, defined in index.html spec)
    images/
      (icons for categories if needed)
    fonts/
      (Bootstrap/Glyphicons or equivalent)

  mock/
    mock.dashboard.service.js
    mock.card.service.js
    mock.transaction.service.js
    mock.analytics.service.js
    mock.budget.service.js

  data/
    mock-dashboard-summary.json
    mock-transactions.json
    mock-analytics-category-spend.json
    mock-analytics-monthly-trend.json
    mock-analytics-card-distribution.json
    mock-budget-summary.json

index.html
README.md

config/
  env.default.json
  env.dev.json
  env.prod.json
```

Each file listed above is required; Code Generation Agent must implement them as specified.

---

## 5. Application Bootstrap Design

### 5.1 Root Module
- File: `src/app/app.module.js`
- Angular registration:
  - Module name: `app`
  - Dependencies: `['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'chart.js']`
- Responsibility: declare root AngularJS module.

### 5.2 Config Block
- File: `src/app/app.config.js`
- Angular registration: `angular.module('app').config(configFunction);`
- Dependencies: `$locationProvider`, `$httpProvider`, `ENV_CONFIG`, `SECURITY_CONFIG`.
- Responsibilities:
  - Configure `$locationProvider` (`html5Mode` as per environment).
  - Configure `$httpProvider` interceptors for logging and error handling.
  - Set default headers for authenticated requests (Authorization bearer token retrieval via `security.service`).

### 5.3 Run Block
- File: `src/app/app.config.js` (or separate `app.run.js` if preferred by Code Generation Agent).
- Angular registration: `angular.module('app').run(runFunction);`
- Dependencies: `$rootScope`, `$location`, `SecurityService`, `LoggingService`.
- Responsibilities:
  - Initialize global state.
  - Check authentication on route changes.
  - Initialize correlation IDs for logging.

### 5.4 Index.html

Implementation specification (no actual HTML):

- File: `index.html`
- Purpose: host SPA and bootstrap AngularJS application.

Required structure:

1. `<html>` root with language attribute.
2. `<head>`:
   - Page title: "Monthly Spending Summary Dashboard".
   - Meta tags for viewport, charset.
   - CSS includes (in this order):
     - Bootstrap 3.4.1 CSS (CDN).
     - Font/icon CSS (if needed).
     - `assets/css/app.css`.
     - `assets/css/dashboard.css`.
     - `assets/css/transactions.css`.
     - `assets/css/analytics.css`.
     - `assets/css/budget.css`.
3. `<body>`:
   - `ng-app="app"` attribute.
   - Layout:
     - Header section with application name and user info.
     - Navigation bar (route links to Dashboard, Transactions, Analytics, Budget).
     - Main content area containing `<div ng-view></div>`.
     - Footer with copyright and version information.

JavaScript includes at end of body (in this order):

1. AngularJS 1.7.9 (CDN).
2. Angular Route 1.7.9.
3. Angular Animate 1.7.9.
4. Angular Sanitize 1.7.9.
5. Angular UI Bootstrap 2.5.6.
6. Chart.js 2.9.4.
7. Application scripts:
   - `src/app/app.module.js`
   - `src/app/app.config.js`
   - `src/app/app.routes.js`
   - All controllers, services, factories, directives, filters, models, config files, mock services.

Restrictions:
- Do not include jQuery or `bootstrap.min.js` unless explicitly required by a future Epic (not the case here).

---

## 6. Module Design

Only one AngularJS module: `app`.

### 6.1 Module Declaration
- File: `src/app/app.module.js`
- Component type: Module.
- Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`, `chart.js`.

### 6.2 Registration
- Code Generation Agent must implement:
  - IIFE pattern.
  - Strict DI (`$inject`).

---

## 7. Routing Design

### 7.1 Route Definitions
- File: `src/app/app.routes.js`
- Angular registration: `angular.module('app').config(routeConfig);`
- Dependencies: `$routeProvider`.

Routes:

1. **Dashboard Route**
   - URL: `/dashboard`
   - TemplateUrl: `templates/dashboard/dashboard.html`
   - Controller: `DashboardController`
   - ControllerAs: `vm`
   - Resolve (optional): `initialSummary` via `DashboardService.getSummary(defaultMonth)`.

2. **Transactions Route**
   - URL: `/transactions`
   - TemplateUrl: `templates/transactions/transactions.html`
   - Controller: `TransactionsController`
   - ControllerAs: `vm`

3. **Analytics Route**
   - URL: `/analytics`
   - TemplateUrl: `templates/analytics/analytics.html`
   - Controller: `AnalyticsController`
   - ControllerAs: `vm`

4. **Budget Route**
   - URL: `/budget`
   - TemplateUrl: `templates/budget/budget.html`
   - Controller: `BudgetController`
   - ControllerAs: `vm`

Default route:
- When URL does not match any defined route, redirect to `/dashboard`.

Invalid routes:
- Must redirect to `/dashboard` using `$routeProvider.otherwise({ redirectTo: '/dashboard' });` in implementation.

---

## 8. Component Registry

For each component, the following attributes apply. Below is the registry.

### 8.1 Modules
- `app`
  - Type: Module
  - Path: `src/app/app.module.js`
  - Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`, `chart.js`

### 8.2 Controllers
1. `DashboardController`
   - Type: Controller
   - Path: `src/app/controllers/dashboard.controller.js`
   - Module: `app`
   - Registration: `angular.module('app').controller('DashboardController', DashboardController);`
   - Dependencies: `$scope` (optional), `$location`, `DashboardService`, `TransactionService`, `AnalyticsService`, `BudgetService`, `LoggingService`, `ErrorHandlerService`.

2. `TransactionsController`
   - Type: Controller
   - Path: `src/app/controllers/transactions.controller.js`
   - Module: `app`
   - Dependencies: `TransactionService`, `LoggingService`, `ErrorHandlerService`.

3. `AnalyticsController`
   - Type: Controller
   - Path: `src/app/controllers/analytics.controller.js`
   - Module: `app`
   - Dependencies: `AnalyticsService`, `LoggingService`, `ErrorHandlerService`.

4. `BudgetController`
   - Type: Controller
   - Path: `src/app/controllers/budget.controller.js`
   - Module: `app`
   - Dependencies: `BudgetService`, `LoggingService`, `ErrorHandlerService`.

### 8.3 Services
- `DashboardService` → `src/app/services/dashboard.service.js`
- `CardService` → `src/app/services/card.service.js`
- `TransactionService` → `src/app/services/transaction.service.js`
- `AnalyticsService` → `src/app/services/analytics.service.js`
- `BudgetService` → `src/app/services/budget.service.js`
- `LoggingService` → `src/app/services/logging.service.js`
- `ErrorHandlerService` → `src/app/services/error-handler.service.js`
- `SecurityService` → `src/app/services/security.service.js`

All registered via `angular.module('app').service('Name', Constructor);`.

### 8.4 Factories
- `HttpWrapper` → `src/app/factories/http-wrapper.factory.js`
- `KpiCardFactory` → `src/app/factories/kpi-card.factory.js`
- `ChartConfigFactory` → `src/app/factories/chart-config.factory.js`
- `TableConfigFactory` → `src/app/factories/table-config.factory.js`

### 8.5 Directives
- `kpiCard` → `src/app/directives/kpiCard.directive.js`
- `spendingChart` → `src/app/directives/spendingChart.directive.js`
- `transactionsTable` → `src/app/directives/transactionsTable.directive.js`
- `budgetProgress` → `src/app/directives/budgetProgress.directive.js`
- `loadingIndicator` → `src/app/directives/loadingIndicator.directive.js`
- `messageBanner` → `src/app/directives/messageBanner.directive.js`

### 8.6 Filters
- `currencyFormat` → `src/app/filters/currencyFormat.filter.js`
- `dateFormat` → `src/app/filters/dateFormat.filter.js`
- `percentage` → `src/app/filters/percentage.filter.js`

### 8.7 Models
As defined in section 14.

### 8.8 Config/Constants
- `ENV_CONFIG` in `config.constants.js`
- `SECURITY_CONFIG` in `config.security.js`

---

## 9. Controller Design

### 9.1 DashboardController

- File: `src/app/controllers/dashboard.controller.js`
- Registration: `angular.module('app').controller('DashboardController', DashboardController);`
- Dependencies:
  - `DashboardService`
  - `TransactionService`
  - `AnalyticsService`
  - `BudgetService`
  - `LoggingService`
  - `ErrorHandlerService`
  - `$location`
- ControllerAs: `vm`

#### 9.1.1 ViewModel

- `vm.selectedMonth` (string, `YYYY-MM`)
- `vm.summary` (DashboardSummaryModel)
- `vm.recentTransactions` (array of TransactionModel, size up to 5)
- `vm.categorySpend` (AnalyticsCategorySpendModel)
- `vm.monthlyTrend` (AnalyticsMonthlyTrendModel)
- `vm.cardDistribution` (AnalyticsCardDistributionModel)
- `vm.budgetSummary` (BudgetModel)
- `vm.isLoadingSummary` (boolean)
- `vm.isLoadingAnalytics` (boolean)
- `vm.isLoadingBudget` (boolean)
- `vm.errorMessage` (string)
- `vm.infoMessage` (string)

#### 9.1.2 Public Methods

- `initialize()`
  - Inputs: none.
  - Behaviour: set default `selectedMonth` (current month), load summary, analytics, budget, recent transactions.
- `loadSummary()`
  - Inputs: none (uses `vm.selectedMonth`).
  - Behaviour: calls `DashboardService.getSummary(vm.selectedMonth)` and updates `vm.summary`; handles loading state and errors.
- `loadRecentTransactions()`
  - Inputs: none.
  - Behaviour: calls `DashboardService.getRecentTransactions(vm.selectedMonth)` and updates `vm.recentTransactions`.
- `loadAnalytics()`
  - Inputs: none.
  - Behaviour: calls `AnalyticsService.getCategorySpend`, `getMonthlyTrend`, `getCardDistribution` using `vm.selectedMonth`.
- `loadBudget()`
  - Inputs: none.
  - Behaviour: calls `BudgetService.getSummary(vm.selectedMonth)` and updates `vm.budgetSummary`.
- `changeMonth(month)`
  - Inputs: `month` (string `YYYY-MM`).
  - Behaviour: update `vm.selectedMonth` and reload data via `loadSummary`, `loadAnalytics`, `loadBudget`, `loadRecentTransactions`.
- `navigateToTransactions()`
  - Behaviour: use `$location.path('/transactions')`.

#### 9.1.3 Error Handling & Logging

- All service calls wrapped via `ErrorHandlerService.handlePromise` (implementation detail in Service Design).
- On error:
  - Set `vm.errorMessage` using standardized messages.
  - Log via `LoggingService.error` with correlation ID and context.
  - Provide user-facing message banner via `messageBanner` directive.

### 9.2 TransactionsController

- File: `src/app/controllers/transactions.controller.js`
- Dependencies: `TransactionService`, `LoggingService`, `ErrorHandlerService`.
- ViewModel:
  - `vm.filters`:
    - `merchant` (string)
    - `category` (string code)
    - `bank` (string)
    - `cardId` (string)
    - `dateFrom` (string `YYYY-MM-DD`)
    - `dateTo` (string `YYYY-MM-DD`)
  - `vm.sort`:
    - `field` (enum: `date`, `amount`)
    - `direction` (enum: `asc`, `desc`)
  - `vm.pagination`:
    - `page` (int)
    - `pageSize` (int, default 20, max 100)
    - `totalItems` (int)
  - `vm.transactions` (array of TransactionModel)
  - `vm.isLoading` (boolean)
  - `vm.errorMessage` (string)

Public methods:
- `initialize()` → load initial transactions for current month.
- `search()` → triggers query with current filters.
- `resetFilters()` → resets filters and reloads.
- `changeSort(field)` → toggles direction; reloads.
- `changePage(page)` → updates `vm.pagination.page` and reloads.

### 9.3 AnalyticsController

- File: `src/app/controllers/analytics.controller.js`
- Dependencies: `AnalyticsService`, `LoggingService`, `ErrorHandlerService`.
- ViewModel:
  - `vm.selectedMonth`
  - `vm.categorySpend`
  - `vm.monthlyTrend`
  - `vm.cardDistribution`
  - `vm.isLoading`
  - `vm.errorMessage`

Public methods:
- `initialize()` → loads analytics for default month.
- `changeMonth(month)` → reloads analytics.

### 9.4 BudgetController

- File: `src/app/controllers/budget.controller.js`
- Dependencies: `BudgetService`, `LoggingService`, `ErrorHandlerService`.
- ViewModel:
  - `vm.selectedMonth`
  - `vm.budgetSummary` (BudgetModel)
  - `vm.isLoading`
  - `vm.errorMessage`

Public methods:
- `initialize()` → load budget summary for default month.
- `changeMonth(month)` → reload budget summary.

---

## 10. Service Design

### 10.1 Common Patterns

All services:
- Use `HttpWrapper` factory for REST calls to centralize timeout, retry, and error handling.
- Respect `ENV_CONFIG.apiBaseUrl` and `ENV_CONFIG.apiTimeoutMs`.
- Switch between production and mock implementations based on `ENV_CONFIG.useMockData`.
- Log important events via `LoggingService`.

### 10.2 DashboardService

- File: `src/app/services/dashboard.service.js`
- Registration: `angular.module('app').service('DashboardService', DashboardService);`
- Dependencies: `HttpWrapper`, `ENV_CONFIG`, `LoggingService`, `ErrorHandlerService`.

Public methods:

1. `getSummary(month)`
   - Input: `month` (string `YYYY-MM`).
   - REST endpoint: `GET /dashboard/summary?month={month}`.
   - Returns: Promise resolving to `DashboardSummaryModel`.

2. `getRecentTransactions(month)`
   - Input: `month` (string `YYYY-MM`).
   - REST endpoint: `GET /dashboard/recent-transactions?month={month}&limit=5`.
   - Returns: Promise resolving to array of `TransactionModel`.

Private methods:
- `mapSummaryResponse(rawResponse)` → produces `DashboardSummaryModel`.
- `validateSummaryResponse(model)` → applies validation rules (see Model Design).

### 10.3 CardService

- File: `src/app/services/card.service.js`
- Public methods:
  - `getCards()` → `GET /cards` → array of `CardModel`.

### 10.4 TransactionService

- File: `src/app/services/transaction.service.js`
- Public methods:

1. `getTransactions(filters, sort, pagination)`
   - Endpoint: `GET /transactions` with query parameters:
     - `merchant`, `category`, `bank`, `cardId`, `dateFrom`, `dateTo`, `sortField`, `sortDirection`, `page`, `pageSize`.
   - Returns: `{ items: TransactionModel[], totalItems: number }`.

2. `getRecentTransactions(month, limit)`
   - Endpoint: `GET /transactions/recent?month={month}&limit={limit}`.

### 10.5 AnalyticsService

- File: `src/app/services/analytics.service.js`
- Public methods:

1. `getCategorySpend(month)` → `GET /analytics/category-spend?month={month}` → `AnalyticsCategorySpendModel`.
2. `getMonthlyTrend(monthFrom, monthTo)` → `GET /analytics/monthly-trend?from={monthFrom}&to={monthTo}` → `AnalyticsMonthlyTrendModel`.
3. `getCardDistribution(month)` → `GET /analytics/card-distribution?month={month}` → `AnalyticsCardDistributionModel`.

### 10.6 BudgetService

- File: `src/app/services/budget.service.js`
- Public methods:

1. `getSummary(month)` → `GET /budget/summary?month={month}` → `BudgetModel`.
2. `getUtilization(month)` → `GET /budget/utilization?month={month}` → may reuse `BudgetModel` fields.

### 10.7 LoggingService

- File: `src/app/services/logging.service.js`
- Responsibilities:
  - Provide `info`, `warn`, `error`, `audit` methods.
  - Attach correlation IDs and user context when available.
  - Avoid logging sensitive data (full card numbers, personally identifiable information beyond IDs).

### 10.8 ErrorHandlerService

- File: `src/app/services/error-handler.service.js`
- Responsibilities:
  - Normalize backend error responses into `ErrorModel`.
  - Map HTTP status codes to user-facing messages.
  - Provide helper `handlePromise(promise, successCallback, errorCallback)`.

### 10.9 SecurityService

- File: `src/app/services/security.service.js`
- Responsibilities:
  - Manage JWT/OAuth2 tokens (obtain from existing enterprise auth flow).
  - Provide `getAuthHeader()` that returns `Authorization: Bearer {token}`.
  - Expose `isAuthenticated()` for route guards.

---

## 11. Factory Design

### 11.1 HttpWrapper Factory

- File: `src/app/factories/http-wrapper.factory.js`
- Responsibilities:
  - Wrap `$http` calls with:
    - Timeouts as per `ENV_CONFIG.apiTimeoutMs`.
    - Retry policy (e.g., 2 retries, exponential backoff) for transient errors.
    - Centralized error mapping via `ErrorHandlerService`.

### 11.2 KpiCardFactory

- File: `src/app/factories/kpi-card.factory.js`
- Responsibilities:
  - Build objects representing KPI card configuration (label, icon, value, formatting).

### 11.3 ChartConfigFactory

- File: `src/app/factories/chart-config.factory.js`
- Responsibilities:
  - Provide Chart.js configuration for bar, line, pie/doughnut charts used by analytics views.

### 11.4 TableConfigFactory

- File: `src/app/factories/table-config.factory.js`
- Responsibilities:
  - Define table column meta (name, field, alignment, sortable) for transactions table.

---

## 12. Directive Design

### 12.1 kpiCard Directive

- File: `src/app/directives/kpiCard.directive.js`
- Restrict: `E`
- Scope:
  - `title: '@'`
  - `icon: '@'`
  - `value: '<'`
  - `formatter: '&?'`
- Controller: `KpiCardController`
- ControllerAs: `vm`
- TemplateUrl: `templates/shared/kpi-card.html`

### 12.2 spendingChart Directive

- File: `src/app/directives/spendingChart.directive.js`
- Restrict: `E`
- Scope:
  - `chartData: '<'`
  - `chartOptions: '<'`
  - `chartType: '@'`
- TemplateUrl: `templates/shared/spending-chart.html`

### 12.3 transactionsTable Directive

- File: `src/app/directives/transactionsTable.directive.js`
- Restrict: `E`
- Scope:
  - `transactions: '<'`
  - `config: '<'`
  - `onSortChange: '&'`
  - `onPageChange: '&'`
- TemplateUrl: `templates/shared/transactions-table.html`

### 12.4 budgetProgress Directive

- File: `src/app/directives/budgetProgress.directive.js`
- Restrict: `E`
- Scope:
  - `budget: '<'`
- TemplateUrl: `templates/shared/budget-progress.html`

### 12.5 loadingIndicator Directive

- File: `src/app/directives/loadingIndicator.directive.js`
- Restrict: `E`
- Scope:
  - `isLoading: '<'`
- TemplateUrl: `templates/shared/loading-indicator.html`

### 12.6 messageBanner Directive

- File: `src/app/directives/messageBanner.directive.js`
- Restrict: `E`
- Scope:
  - `message: '<'`
  - `type: '@'`
- TemplateUrl: `templates/shared/message-banner.html`

---

## 13. Filter Design

### 13.1 currencyFormat Filter

- File: `src/app/filters/currencyFormat.filter.js`
- Input: numeric amount.
- Output: formatted currency string based on configured currency (e.g., `ENV_CONFIG.currency` if defined, else default).

### 13.2 dateFormat Filter

- File: `src/app/filters/dateFormat.filter.js`
- Input: date value.
- Output: formatted date string (e.g., `DD MMM YYYY`).

### 13.3 percentage Filter

- File: `src/app/filters/percentage.filter.js`
- Input: numeric 0-1 or 0-100.
- Output: string with `%`, normalized to 0-100.

---

## 14. Model Design

### 14.1 UserModel

- File: `src/app/models/user.model.js`
- Properties:
  - `userId` (string, required)
  - `displayName` (string, required)

### 14.2 CardModel

- File: `src/app/models/card.model.js`
- Properties:
  - `cardId` (string, required)
  - `userId` (string, required)
  - `cardName` (string, required)
  - `issuingBank` (string, required)
  - `maskedCardNumber` (string, required; format `XXXX-XXXX-XXXX-1234`)
  - `creditLimit` (number, required, >= 0)
  - `availableCredit` (number, required, >= 0)
  - `currentOutstanding` (number, required, >= 0)
  - `billingDate` (string `YYYY-MM-DD`, required)
  - `dueDate` (string `YYYY-MM-DD`, required)

### 14.3 TransactionModel

- File: `src/app/models/transaction.model.js`
- Properties:
  - `transactionId` (string, required)
  - `userId` (string, required)
  - `cardId` (string, required)
  - `transactionDate` (string `YYYY-MM-DD`, required)
  - `merchantName` (string, required)
  - `categoryCode` (string, required)
  - `amount` (number, required, >= 0)
  - `paymentStatus` (enum: `PENDING`, `POSTED`, `FAILED`, required)
  - `remarks` (string, optional)

### 14.4 BudgetModel

- File: `src/app/models/budget.model.js`
- Properties:
  - `budgetId` (string, required)
  - `userId` (string, required)
  - `month` (string `YYYY-MM`, required)
  - `totalBudgetAmount` (number, required, >= 0)
  - `currentSpendAmount` (number, required, >= 0)
  - `remainingBudgetAmount` (number, required, >= 0)
  - `utilizationPercentage` (number, required, 0-100)

### 14.5 CategoryModel

- File: `src/app/models/category.model.js`
- Properties:
  - `categoryCode` (string, required)
  - `description` (string, required)

Pre-defined categories (codes and descriptions):
- `FOOD_DINING` → Food & Dining
- `FUEL` → Fuel
- `SHOPPING` → Shopping
- `TRAVEL` → Travel
- `ENTERTAINMENT` → Entertainment
- `UTILITIES` → Utilities
- `HEALTHCARE` → Healthcare
- `EDUCATION` → Education
- `MISC` → Miscellaneous

### 14.6 DashboardSummaryModel

- File: `src/app/models/dashboard-summary.model.js`
- Properties:
  - `month` (string `YYYY-MM`, required)
  - `totalMonthlySpend` (number, required, >= 0)
  - `totalCreditLimit` (number, required, >= 0)
  - `availableCredit` (number, required, >= 0)
  - `outstandingAmount` (number, required, >= 0)
  - `utilizationPercentage` (number, required, 0-100)
  - `transactionCount` (number, required, >= 0)

### 14.7 AnalyticsCategorySpendModel

- File: `src/app/models/analytics-category-spend.model.js`
- Properties:
  - `month` (string `YYYY-MM`, required)
  - `categories` (array of objects with `categoryCode`, `amount` (>= 0))

### 14.8 AnalyticsMonthlyTrendModel

- File: `src/app/models/analytics-monthly-trend.model.js`
- Properties:
  - `months` (array of string `YYYY-MM`, required)
  - `totalSpendPerMonth` (array of number, required, aligned to `months`)

### 14.9 AnalyticsCardDistributionModel

- File: `src/app/models/analytics-card-distribution.model.js`
- Properties:
  - `month` (string `YYYY-MM`, required)
  - `cards` (array of objects with `cardName`, `amount` (>= 0))

### 14.10 ErrorModel

- File: `src/app/models/error.model.js`
- Properties:
  - `code` (string, required)
  - `message` (string, required)
  - `httpStatus` (number, required)
  - `correlationId` (string, required)

---

## 15. REST API Contract

All URLs are relative to `ENV_CONFIG.apiBaseUrl`.

### 15.1 Dashboard Summary

Endpoint: `GET /dashboard/summary`

- Query Parameters:
  - `month` (string `YYYY-MM`, required)
- Headers:
  - `Authorization: Bearer {token}`
- Request Body: none
- Success Response:
  - Status: `200 OK`
  - Body: `DashboardSummaryModel` JSON
- Error Responses:
  - `400 Bad Request` (invalid month format)
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found` (no data for month)
  - `408 Request Timeout`
  - `500 Internal Server Error`

### 15.2 Recent Transactions

Endpoint: `GET /dashboard/recent-transactions`

- Query Parameters:
  - `month` (string, required)
  - `limit` (int, optional, default 5, max 10)
- Response: array of `TransactionModel`.

### 15.3 Transactions Listing

Endpoint: `GET /transactions`

- Query Parameters:
  - `merchant` (string, optional)
  - `category` (string, optional)
  - `bank` (string, optional)
  - `cardId` (string, optional)
  - `dateFrom` (string `YYYY-MM-DD`, optional)
  - `dateTo` (string `YYYY-MM-DD`, optional)
  - `sortField` (enum `date` | `amount`, optional)
  - `sortDirection` (enum `asc` | `desc`, optional)
  - `page` (int, default 1)
  - `pageSize` (int, default 20, max 100)
- Response:
  - Status: `200 OK`
  - Body: `{ items: TransactionModel[], totalItems: number }`

### 15.4 Analytics Category Spend

Endpoint: `GET /analytics/category-spend`

- Query Parameters: `month` (string, required)
- Response: `AnalyticsCategorySpendModel`.

### 15.5 Analytics Monthly Trend

Endpoint: `GET /analytics/monthly-trend`

- Query Parameters:
  - `from` (string `YYYY-MM`, required)
  - `to` (string `YYYY-MM`, required)
- Response: `AnalyticsMonthlyTrendModel`.

### 15.6 Analytics Card Distribution

Endpoint: `GET /analytics/card-distribution`

- Query Parameters: `month` (string, required)
- Response: `AnalyticsCardDistributionModel`.

### 15.7 Budget Summary

Endpoint: `GET /budget/summary`

- Query Parameters: `month` (string, required)
- Response: `BudgetModel`.

### 15.8 Common Error Response Format

Error body:
```json
{
  "code": "<APP_SPECIFIC_ERROR_CODE>",
  "message": "<User friendly message>",
  "httpStatus": <number>,
  "correlationId": "<UUID>"
}
```

---

## 16. Configuration Design

### 16.1 ENV_CONFIG

Defined in `src/app/config/config.constants.js` and environment JSON files.

Properties:
- `apiBaseUrl` (string, required)
- `apiTimeoutMs` (number, required; default 5000ms)
- `maxLookbackMonths` (number, required; default 12)
- `useMockData` (boolean, required)
- `featureFlags` (object; may include `enableAdvancedAnalytics`, etc.)
- `telemetry` (object)
- `currency` (string, optional, e.g. `INR`)

### 16.2 Environment Files

- `config/env.default.json`
- `config/env.dev.json`
- `config/env.prod.json`

Each defines values for `ENV_CONFIG` properties. Code Generation Agent must implement loading logic; LLD only specifies properties.

### 16.3 Security Configuration

- File: `src/app/config/config.security.js`
- Defines:
  - Token storage strategy (memory/local storage).
  - Header names for authentication.

---

## 17. Mock Implementation Design

For each REST endpoint defined, a corresponding mock must exist.

### 17.1 Mock Services Files

- `mock.dashboard.service.js`
- `mock.card.service.js`
- `mock.transaction.service.js`
- `mock.analytics.service.js`
- `mock.budget.service.js`

Each mock service:
- Uses `$q` and `$timeout` to simulate async behaviour.
- Reads from `data/*.json` files defined earlier.
- Simulates:
  - Success responses.
  - Timeout (delayed response beyond `ENV_CONFIG.apiTimeoutMs` when configured).
  - Failure (reject promises with `ErrorModel`).
  - Empty results.

`ENV_CONFIG.useMockData` controls selection between real and mock services (e.g., via provider configuration or conditional registration).

---

## 18. UI Specification

### 18.1 Overall Layout

- Header:
  - Application title.
  - Logged-in user name.
- Navigation bar:
  - Links to Dashboard, Transactions, Analytics, Budget.
  - Active route highlighting.
- Content area:
  - Uses Bootstrap `container` and `row`/`col-*` grid.
- Footer:
  - Copyright.
  - Version.

### 18.2 Dashboard Page (`dashboard.html`)

Sections (top to bottom):

1. **KPI Summary Section** (`dashboard-kpi-section.html`):
   - Grid of 4-6 KPI cards (total monthly spend, utilization %, total credit limit, available credit, outstanding amount, transaction count).
2. **Budget Section** (`dashboard-budget-section.html`):
   - Budget progress bar using `budgetProgress` directive.
3. **Analytics Section** (`dashboard-analytics-section.html`):
   - Category spend chart (bar/pie using `spendingChart`).
   - Monthly trend chart (line).
   - Card distribution chart (pie/doughnut).
4. **Recent Transactions Section** (`dashboard-recent-transactions.html`):
   - Table of last 5 transactions.

Responsive behaviour:
- On large screens: KPI cards in a single row; charts and tables arranged in multi-column layout.
- On small screens: KPI cards stacked; charts and tables use full width.

### 18.3 Transactions Page (`transactions.html`)

- Filter panel at top (merchant, category, bank, card, date range).
- Search and reset buttons.
- Transactions table using `transactionsTable` directive.
- Pagination controls at bottom.

### 18.4 Analytics Page (`analytics.html`)

- Month selector.
- Category spend chart.
- Monthly trend chart.
- Card distribution chart.

### 18.5 Budget Page (`budget.html`)

- Month selector.
- Budget summary KPI.
- Budget progress bar.

### 18.6 Loading, Empty, Error States

- `loadingIndicator` directive shows spinner when `isLoading` flags are true.
- `messageBanner` directive shows messages:
  - Type `info` for empty states (e.g., "No transactions for selected criteria.").
  - Type `error` for failures.

---

## 19. Data Flow

### 19.1 Dashboard Summary Flow

User selects month → `DashboardController.changeMonth` → `DashboardService.getSummary` → API Gateway `/dashboard/summary` → Dashboard Service → Card/Transaction/Budget services & DB/CACHE → Response mapped to `DashboardSummaryModel` → Controller updates `vm.summary` → KPI cards and budget progress update.

### 19.2 Transactions Flow

User sets filters/search → `TransactionsController.search` → `TransactionService.getTransactions` → API `/transactions` → Transaction Service → DB → Response mapped to `TransactionModel[]` → Controller updates `vm.transactions` and pagination → `transactionsTable` directive renders.

### 19.3 Analytics Flow

User views analytics → `AnalyticsController.initialize/changeMonth` → `AnalyticsService.getCategorySpend/getMonthlyTrend/getCardDistribution` → APIs → Analytics Service → DB/CACHE → Response models → Controller updates view models → `spendingChart` directive renders charts.

### 19.4 Budget Flow

User views budget → `BudgetController.initialize/changeMonth` → `BudgetService.getSummary` → API `/budget/summary` → Budget Service → DB → Response → `BudgetModel` → Controller updates `vm.budgetSummary` → `budgetProgress` directive renders.

---

## 20. Business Rules

### 20.1 Spending & Utilization Rules

- Utilization percentage = `(outstandingAmount / totalCreditLimit) * 100`, capped at 100.
- TotalMonthlySpend includes all posted transactions within selected month.

### 20.2 Budget Rules

- RemainingBudgetAmount = `totalBudgetAmount - currentSpendAmount`, floored at 0.
- UtilizationPercentage for budget = `(currentSpendAmount / totalBudgetAmount) * 100`, capped at 100.

### 20.3 Category Aggregation Rules

- Category spend sums transaction amounts grouped by `categoryCode`.
- Transactions with unknown categoryCode are grouped under `MISC`.

### 20.4 Transaction Filtering Rules

- Date range filters must be validated: `dateFrom <= dateTo`.
- Missing `dateFrom` or `dateTo` defaults to selected month boundaries.

---

## 21. Validation Rules

### 21.1 Input Validation

- Month format: `YYYY-MM`.
- Date format: `YYYY-MM-DD`.
- Pagination: `page >= 1`, `1 <= pageSize <= 100`.
- Sort field and direction must be in allowed sets.

### 21.2 Model Validation

- Numeric fields must be non-negative.
- Required fields must be present.
- UtilizationPercentage fields must be 0-100.

### 21.3 API Response Validation

- Verify response models conform to definitions before mapping.
- If invalid, log error and surface standardized error to user.

---

## 22. Error Handling

- All API failures yield `ErrorModel` from services.
- Controllers set `errorMessage` and use `messageBanner` directive.
- HTTP status mapping:
  - 400 → show validation error message.
  - 401/403 → show "Not authorized" and redirect to login if appropriate.
  - 404 → show "No data for selected criteria.".
  - 408/500 → show "Unable to retrieve data. Please try again.".

---

## 23. Logging Design

- Use `LoggingService` for all logs.
- Log levels: `info`, `warn`, `error`, `audit`.
- Include correlationId, route, and userId when available.
- Do not log sensitive data.

---

## 24. Security Design

- All REST calls include `Authorization` header from `SecurityService`.
- UI does not display full card numbers; uses `maskedCardNumber` only.
- Input fields are validated and sanitized where necessary.
- No sensitive data in logs.

---

## 25. Dependency Map

- Controllers depend on services, LoggingService, ErrorHandlerService.
- Services depend on HttpWrapper, ENV_CONFIG, LoggingService, ErrorHandlerService.
- Directives depend on models and configuration factories.
- Models used by controllers/services, not dependent on other components.

---

## 26. LLD Validation Checklist

- All 26 sections present: YES.
- Technology stack matches `lldgenerationkb`: YES.
- Architecture follows AngularJS MVC SPA: YES.
- Repository structure fully specified: YES.
- All routes have controllers and templates defined: YES.
- REST contracts defined for all required dashboard endpoints: YES.
- Configuration properties documented: YES.
- Mock implementations specified for each endpoint: YES.
- UI specification covers layout, responsiveness, states: YES.
- Business rules, validation, error handling, logging, security documented: YES.
- No source code or actual HTML/CSS/JS implementation included: YES.

This LLD complies with the quality gates and is ready for Code Generation Agent implementation.
