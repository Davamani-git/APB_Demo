# Low Level Design (LLD)  QE-3318 Monthly Spending Summary Dashboard

## 1. Application Overview

### 1.1 Epic Summary

Epic ID: **QE-3318**  
Application Name: **Monthly Spending Summary Dashboard**  
Pattern: **Responsive AngularJS 1.7.9 Single Page Application (SPA)** backed by REST APIs.

This application provides a read-heavy analytics dashboard for credit card spending. It enables users to:
- View monthly spending summary and key metrics (total spend, credit limits, utilization, outstanding amounts, transaction counts).
- Manage (view-only) multiple credit cards with masked card numbers and profile attributes.
- Explore transactions via a tabular view with filtering, search, and sorting.
- Visualize spending analytics via charts (category-wise, monthly trends, card-wise distribution, category breakdown).
- Track budgets via numeric indicators and progress bars (monthly budget, current spend, remaining budget, utilization).
- View the latest 5 transactions via a dedicated widget.
- Access all functionality via a responsive UI optimized for desktop, tablet, and mobile.

### 1.2 In-Scope vs Out-of-Scope

In scope (per HLD):
- Dashboard summary tiles.
- Total monthly spend, total credit limit, available credit, outstanding amount, utilization percentage, transaction count.
- Credit card management view (read-only) with card name, issuing bank, masked card number, credit limit, available credit, current outstanding, billing date, due date.
- Transaction management table with transaction date, merchant name, category, card used, amount, payment status, remarks; search, filters, sorting.
- Spending analytics: category-wise spending, monthly trends, card-wise distribution, category breakdown for specific categories.
- Budget tracking: monthly budget, current spend, remaining budget, budget utilization %, progress bar.
- Recent transactions widget (latest 5 transactions).
- Responsive design for mobile, tablet, desktop.

Out of scope (explicit or implied by HLD):
- Payment initiation, settlements, or refunds.
- Card issuance workflows (create, close, upgrade cards).
- Dispute management, chargebacks.
- Direct handling or storage of full, unmasked PAN or other highly sensitive payment card data.
- Fine-grained ABAC beyond basic RBAC; external IAM specifics.

The LLD will strictly implement only the in-scope capabilities and will not assume additional business features.

---

## 2. Technology Stack

### 2.1 Frontend

- **HTML**: HTML5
- **CSS**: CSS3
- **JavaScript**: ES6
- **AngularJS**: 1.7.9
- **Angular Route**: 1.7.9
- **Angular Animate**: 1.7.9
- **Angular Sanitize**: 1.7.9
- **Angular UI Bootstrap**: 2.5.6
- **Bootstrap**: 3.4.1 (CSS only)
- **Chart.js**: 2.9.4

Frontend runs as a browser-based SPA. No jQuery or `bootstrap.min.js` is used unless explicitly required by future epics.

### 2.2 Backend / API Integration

The LLD focuses on the frontend app and its integration with REST APIs exposed by the backend. Backend technology stack is abstracted; APIs are consumed as HTTP(S) endpoints per HLD.

### 2.3 Browser Compatibility

Supported:
- Google Chrome (latest stable)
- Microsoft Edge (latest stable)

---

## 3. Architecture Design

### 3.1 Architectural Pattern

- **AngularJS MVC SPA**
- **ControllerAs Syntax** for controllers and directive controllers.
- **Dependency Injection** via AngularJS DI.
- **IIFE Module Pattern** for JS files.
- **REST-based Communication** using `$http` or `$http`-wrapped services.

### 3.2 Logical Frontend Architecture

- **Root Module**: `app`
- **Feature Modules (logical separation within `app`)**:
  - Dashboard Summary
  - Credit Card Management
  - Transaction Management
  - Spending Analytics
  - Budget Tracking
  - Recent Transactions
  - Shared / Core (configuration, models, services, directives, filters)

Business logic resides in **services**. Controllers coordinate UI behaviour. Directives encapsulate reusable UI widgets (cards, charts, tables). Factories create reusable models and helpers.

---

## 4. Repository Structure

Root structure:

```text
src/
  index.html
  app/
    app.module.js
    app.routes.js
    app.run.js

    config/
      config.constants.js
      env.default.json
      env.dev.json
      env.prod.json

    models/
      dashboard-summary.model.js
      card-profile.model.js
      transaction.model.js
      analytics-category.model.js
      analytics-trend-point.model.js
      analytics-card-distribution.model.js
      budget-status.model.js
      recent-transaction.model.js
      error.model.js

    services/
      dashboard.service.js
      card.service.js
      transaction.service.js
      analytics.service.js
      budget.service.js
      config.service.js
      logging.service.js
      mock-api-toggle.service.js

    factories/
      http-options.factory.js
      model-mapper.factory.js

    controllers/
      dashboard-summary.controller.js
      card-management.controller.js
      transaction-list.controller.js
      analytics.controller.js
      budget.controller.js
      recent-transactions.controller.js

    directives/
      kpi-card.directive.js
      budget-progress.directive.js
      spending-chart.directive.js
      transactions-table.directive.js
      recent-transactions-widget.directive.js

    filters/
      currency-format.filter.js
      date-format.filter.js
      percentage-format.filter.js

    routes/
      dashboard.routes.js

  templates/
    layout/
      main-layout.html
    dashboard/
      dashboard-summary.html
    cards/
      card-management.html
    transactions/
      transaction-list.html
    analytics/
      analytics.html
    budget/
      budget.html

  assets/
    css/
      app.css
      dashboard.css
      cards.css
      transactions.css
      analytics.css
      budget.css
    js/
      vendor/ (CDN references primarily, minimal local libs if needed)
    images/
      icons/
    fonts/

  mock/
    dashboard-summary.mock.json
    cards.mock.json
    transactions.mock.json
    analytics-category.mock.json
    analytics-trend.mock.json
    analytics-card-distribution.mock.json
    budget-status.mock.json
    recent-transactions.mock.json

  data/
    samples/
      sample-transactions.json
      sample-cards.json
```

Each file below is described in later sections with purpose, dependencies, and consumers.

---

## 5. Application Bootstrap Design

### 5.1 index.html

**Path**: `src/index.html`

Responsibilities:
- Define HTML5 shell for the SPA.
- Load CSS before JS.
- Bootstrap AngularJS app with `ng-app="app"`.
- Provide root `ng-view` placeholder for routed templates.
- Load required external libraries via CDN and application scripts in correct order.

Key elements:
- `<head>`:
  - `<meta charset="utf-8">`, viewport meta.
  - `<title>Monthly Spending Summary Dashboard</title>`.
  - CSS includes (in order):
    - Bootstrap 3.4.1 CSS (CDN).
    - App CSS: `assets/css/app.css` and feature-specific CSS.
- `<body>`:
  - `<div ng-app="app">` root.
  - `<div class="container-fluid" ng-controller="AppShellController as shell">` (optional future shell controller; not required by HLD but allowed for layout).  
  - `<div ng-view></div>` placeholder for routed views.
  - Scripts (in order):
    - AngularJS 1.7.9 (CDN).
    - Angular Route, Animate, Sanitize, UI Bootstrap (CDN).
    - Chart.js 2.9.4 (CDN).
    - App scripts: `app/app.module.js`, `app/app.routes.js`, `app/app.run.js`, followed by models, services, factories, controllers, directives, filters.

No jQuery or `bootstrap.min.js` is loaded.

### 5.2 AngularJS Bootstrap

**Root module**: `app`

**File**: `src/app/app.module.js`

Responsibilities:
- Declare AngularJS module.
- Define dependencies on Angular modules and UI libs.

Module declaration:
- Dependencies:
  - `ngRoute`
  - `ngAnimate`
  - `ngSanitize`
  - `ui.bootstrap`

Only `app.module.js` contains `angular.module("app", [...])`. All other files use `angular.module("app")`.

### 5.3 app.routes.js

**File**: `src/app/app.routes.js`

Responsibilities:
- Configure `$routeProvider` for SPA routes.
- Define default route redirect.

Key routes (details in Section 7):
- `/dashboard` → Dashboard Summary view.
- `/cards` → Credit Card Management view.
- `/transactions` → Transaction Management view.
- `/analytics` → Spending Analytics view.
- `/budget` → Budget Tracking view.

Default route: redirect unknown URLs to `/dashboard`.

### 5.4 app.run.js

**File**: `src/app/app.run.js`

Responsibilities:
- Execute run-time initialization (e.g., environment config loading via `config.service.js`, global route guards if needed).
- Set up global error handlers and logging integration.

Initialisation steps:
- Load environment configuration (`ENV_CONFIG`) via `ConfigService`.
- Initialize `LoggingService` (e.g., set environment/level, attach global error handling).

---

## 6. Module Design

Logical modules are organized by feature and shared components.

### 6.1 Dashboard Module (logical)

Components:
- Controller: `DashboardSummaryController`
- Service: `DashboardService`
- Models: `DashboardSummaryModel`, `BudgetStatusModel`, `RecentTransactionModel`
- Directives: `kpi-card`, `budget-progress`, `recent-transactions-widget`, `spending-chart` (for summary charts if needed).
- Route: `/dashboard`

### 6.2 Card Management Module

Components:
- Controller: `CardManagementController`
- Service: `CardService`
- Model: `CardProfileModel`
- Directive: `kpi-card` (reused for card tiles or summary if required).
- Route: `/cards`

### 6.3 Transaction Management Module

Components:
- Controller: `TransactionListController`
- Service: `TransactionService`
- Model: `TransactionModel`
- Directive: `transactions-table`
- Route: `/transactions`

### 6.4 Analytics Module

Components:
- Controller: `AnalyticsController`
- Service: `AnalyticsService`
- Models: `AnalyticsCategoryModel`, `AnalyticsTrendPointModel`, `AnalyticsCardDistributionModel`
- Directives: `spending-chart`
- Route: `/analytics`

### 6.5 Budget Module

Components:
- Controller: `BudgetController`
- Service: `BudgetService`
- Model: `BudgetStatusModel`
- Directive: `budget-progress`
- Route: `/budget`

### 6.6 Shared/Core Module

Components:
- Services: `ConfigService`, `LoggingService`, `MockApiToggleService`
- Factories: `HttpOptionsFactory`, `ModelMapperFactory`
- Filters: Currency, date, percentage format filters.
- Models: `ErrorModel` and shared models.

---

## 7. Routing Design

**File**: `src/app/app.routes.js`

AngularJS routing via `$routeProvider`.

### 7.1 Route Definitions

1. **Dashboard Summary Route**
   - URL: `/dashboard`
   - TemplateUrl: `templates/dashboard/dashboard-summary.html`
   - Controller: `DashboardSummaryController`
   - ControllerAs: `vm`
   - Resolve (optional): `initialSummary` via `DashboardService.getSummary()`.

2. **Card Management Route**
   - URL: `/cards`
   - TemplateUrl: `templates/cards/card-management.html`
   - Controller: `CardManagementController`
   - ControllerAs: `vm`
   - Resolve: `cards` via `CardService.getCards()`.

3. **Transaction Management Route**
   - URL: `/transactions`
   - TemplateUrl: `templates/transactions/transaction-list.html`
   - Controller: `TransactionListController`
   - ControllerAs: `vm`
   - Resolve: `initialPage` via `TransactionService.getTransactions(initialFilters)`.

4. **Spending Analytics Route**
   - URL: `/analytics`
   - TemplateUrl: `templates/analytics/analytics.html`
   - Controller: `AnalyticsController`
   - ControllerAs: `vm`
   - Resolve: composite analytics via `AnalyticsService.getInitialAnalytics()`.

5. **Budget Tracking Route**
   - URL: `/budget`
   - TemplateUrl: `templates/budget/budget.html`
   - Controller: `BudgetController`
   - ControllerAs: `vm`
   - Resolve: `budgetStatus` via `BudgetService.getBudgetStatus(currentMonth)`.

### 7.2 Default Route

- For unmatched URLs, `$routeProvider.otherwise({ redirectTo: '/dashboard' })`.

All templates referenced must exist under `src/templates/...`.

---

## 8. Component Registry

For each component, this section lists name, type, path, dependencies, and consumers.

### 8.1 Controllers

1. **DashboardSummaryController**
   - Type: Controller
   - Path: `src/app/controllers/dashboard-summary.controller.js`
   - Module: `app`
   - Dependencies: `DashboardService`, `BudgetService`, `AnalyticsService`, `LoggingService`
   - Consumers: `templates/dashboard/dashboard-summary.html`

2. **CardManagementController**
   - Type: Controller
   - Path: `src/app/controllers/card-management.controller.js`
   - Module: `app`
   - Dependencies: `CardService`, `LoggingService`
   - Consumers: `templates/cards/card-management.html`

3. **TransactionListController**
   - Type: Controller
   - Path: `src/app/controllers/transaction-list.controller.js`
   - Module: `app`
   - Dependencies: `TransactionService`, `LoggingService`
   - Consumers: `templates/transactions/transaction-list.html`, `transactions-table` directive

4. **AnalyticsController**
   - Type: Controller
   - Path: `src/app/controllers/analytics.controller.js`
   - Module: `app`
   - Dependencies: `AnalyticsService`, `LoggingService`
   - Consumers: `templates/analytics/analytics.html`, `spending-chart` directive

5. **BudgetController**
   - Type: Controller
   - Path: `src/app/controllers/budget.controller.js`
   - Module: `app`
   - Dependencies: `BudgetService`, `LoggingService`
   - Consumers: `templates/budget/budget.html`, `budget-progress` directive

6. **RecentTransactionsController**
   - Type: Controller
   - Path: `src/app/controllers/recent-transactions.controller.js`
   - Module: `app`
   - Dependencies: `TransactionService`, `LoggingService`
   - Consumers: `recent-transactions-widget` directive, `templates/dashboard/dashboard-summary.html` (widget inclusion)

### 8.2 Services

1. **DashboardService**
   - Type: Service
   - Path: `src/app/services/dashboard.service.js`
   - Dependencies: `$http`, `ConfigService`, `ModelMapperFactory`, `LoggingService`, `MockApiToggleService`
   - Consumers: `DashboardSummaryController`, route resolves

2. **CardService**
   - Type: Service
   - Path: `src/app/services/card.service.js`
   - Dependencies: `$http`, `ConfigService`, `ModelMapperFactory`, `LoggingService`, `MockApiToggleService`
   - Consumers: `CardManagementController`, `DashboardService`

3. **TransactionService**
   - Type: Service
   - Path: `src/app/services/transaction.service.js`
   - Dependencies: `$http`, `ConfigService`, `ModelMapperFactory`, `LoggingService`, `MockApiToggleService`
   - Consumers: `TransactionListController`, `DashboardService`, `RecentTransactionsController`, `BudgetService`, `AnalyticsService`

4. **AnalyticsService**
   - Type: Service
   - Path: `src/app/services/analytics.service.js`
   - Dependencies: `$http`, `ConfigService`, `ModelMapperFactory`, `LoggingService`, `MockApiToggleService`
   - Consumers: `AnalyticsController`, `DashboardSummaryController`

5. **BudgetService**
   - Type: Service
   - Path: `src/app/services/budget.service.js`
   - Dependencies: `$http`, `ConfigService`, `ModelMapperFactory`, `LoggingService`, `MockApiToggleService`, `TransactionService`
   - Consumers: `BudgetController`, `DashboardSummaryController`

6. **ConfigService**
   - Type: Service
   - Path: `src/app/services/config.service.js`
   - Dependencies: `$http`
   - Consumers: All other services

7. **LoggingService**
   - Type: Service
   - Path: `src/app/services/logging.service.js`
   - Dependencies: `$log`, optional external telemetry client
   - Consumers: All controllers and services

8. **MockApiToggleService**
   - Type: Service
   - Path: `src/app/services/mock-api-toggle.service.js`
   - Dependencies: `ConfigService`
   - Consumers: All services performing HTTP calls

### 8.3 Factories

1. **HttpOptionsFactory**
   - Type: Factory
   - Path: `src/app/factories/http-options.factory.js`
   - Dependencies: `ConfigService`
   - Provides: common `$http` config (headers, timeouts).
   - Consumers: `DashboardService`, `CardService`, `TransactionService`, `AnalyticsService`, `BudgetService`

2. **ModelMapperFactory**
   - Type: Factory
   - Path: `src/app/factories/model-mapper.factory.js`
   - Dependencies: none (pure functions)
   - Provides: mapping functions from raw API JSON to AngularJS models.
   - Consumers: Services

### 8.4 Directives

1. **kpi-card**
   - Type: Directive
   - Path: `src/app/directives/kpi-card.directive.js`
   - Consumers: Dashboard Summary, Card Management

2. **budget-progress**
   - Type: Directive
   - Path: `src/app/directives/budget-progress.directive.js`
   - Consumers: Dashboard Summary, Budget view

3. **spending-chart**
   - Type: Directive
   - Path: `src/app/directives/spending-chart.directive.js`
   - Consumers: Dashboard Summary (optional mini-chart), Analytics view

4. **transactions-table**
   - Type: Directive
   - Path: `src/app/directives/transactions-table.directive.js`
   - Consumers: Transaction Management view

5. **recent-transactions-widget**
   - Type: Directive
   - Path: `src/app/directives/recent-transactions-widget.directive.js`
   - Consumers: Dashboard Summary view

### 8.5 Filters

1. **currencyFormat**
   - Type: Filter
   - Path: `src/app/filters/currency-format.filter.js`
   - Consumers: All templates needing currency display

2. **dateFormat**
   - Type: Filter
   - Path: `src/app/filters/date-format.filter.js`
   - Consumers: Transaction table, recent transactions, card profile dates

3. **percentageFormat**
   - Type: Filter
   - Path: `src/app/filters/percentage-format.filter.js`
   - Consumers: Utilization, budget utilization, chart labels

### 8.6 Models

Models are defined in Section 14, but registry includes:
- `DashboardSummaryModel`
- `CardProfileModel`
- `TransactionModel`
- `AnalyticsCategoryModel`
- `AnalyticsTrendPointModel`
- `AnalyticsCardDistributionModel`
- `BudgetStatusModel`
- `RecentTransactionModel`
- `ErrorModel`

---

## 9. Controller Design

### 9.1 DashboardSummaryController

**Path**: `src/app/controllers/dashboard-summary.controller.js`

**Registration**:
- `angular.module('app').controller('DashboardSummaryController', DashboardSummaryController);`

**Dependencies (DI)**:
- `DashboardService`
- `BudgetService`
- `AnalyticsService`
- `LoggingService`

**ViewModel (`vm`) properties**:
- `vm.summary` : `DashboardSummaryModel` instance.
- `vm.budgetStatus` : `BudgetStatusModel` instance.
- `vm.categoryAnalytics` : `AnalyticsCategoryModel[]`.
- `vm.trendAnalytics` : `AnalyticsTrendPointModel[]`.
- `vm.cardDistributionAnalytics` : `AnalyticsCardDistributionModel[]`.
- `vm.recentTransactions` : `RecentTransactionModel[]`.
- `vm.selectedMonth` : string or `Date` representing current month.
- UI state flags:
  - `vm.isLoadingSummary` (boolean).
  - `vm.isLoadingBudget`.
  - `vm.isLoadingAnalytics`.
  - `vm.isLoadingRecentTransactions`.
  - `vm.summaryError` : `ErrorModel | null`.
  - `vm.budgetError`.
  - `vm.analyticsError`.
  - `vm.recentTransactionsError`.

**Public Methods**:
- `vm.initialize()`
  - Inputs: none (uses default current month from config).
  - Behaviour:
    - Set loading flags to true.
    - Call `DashboardService.getSummary(vm.selectedMonth)`.
    - Call `BudgetService.getBudgetStatus(vm.selectedMonth)`.
    - Call `AnalyticsService.getDashboardAnalytics(vm.selectedMonth)`.
    - Call `TransactionService.getRecentTransactions(limit=5)` (via `DashboardService` or directly; design chooses direct via `TransactionService` or aggregated via DashboardService; here direct call is assumed to avoid hidden logic.)
    - Map results to ViewModel properties.
    - Clear errors on success.
    - Set loading flags false.
    - On any failure, populates corresponding `ErrorModel` and logs via `LoggingService`.

- `vm.changeMonth(month)`
  - Inputs: `month` as string or `Date` type.
  - Behaviour:
    - Validate month (non-empty, within allowed lookback window from config).
    - Update `vm.selectedMonth`.
    - Re-call `vm.initialize()` or targeted load functions.

- `vm.retrySummary()`
  - Behaviour: re-invoke summary load when previous attempt failed.

- `vm.retryBudget()`
  - Behaviour: re-invoke budget load.

- `vm.retryAnalytics()`
  - Behaviour: re-invoke analytics load.

- `vm.retryRecentTransactions()`
  - Behaviour: re-invoke recent transactions load.

**Private/Internal Methods**:
- `_handleSummarySuccess(response)` → map raw data to `DashboardSummaryModel` and update `vm.summary`.
- `_handleSummaryError(error)` → populate `vm.summaryError` and log.
- Similar for budget, analytics, recent transactions.

### 9.2 CardManagementController

**Path**: `src/app/controllers/card-management.controller.js`

**Dependencies**:
- `CardService`
- `LoggingService`

**ViewModel properties**:
- `vm.cards` : `CardProfileModel[]`.
- `vm.isLoading` : boolean.
- `vm.error` : `ErrorModel | null`.

**Public Methods**:
- `vm.initialize()`
  - Calls `CardService.getCards()`.
  - Populates `vm.cards` using `CardProfileModel` array.
  - Manages `vm.isLoading` and `vm.error`.

- `vm.retry()`
  - Retries `getCards()` on failure.

No business logic beyond listing cards. Sorting or simple client-side filtering may be implemented in the controller but not altering business state.

### 9.3 TransactionListController

**Path**: `src/app/controllers/transaction-list.controller.js`

**Dependencies**:
- `TransactionService`
- `ConfigService`
- `LoggingService`

**ViewModel properties**:
- `vm.transactions` : `TransactionModel[]`.
- `vm.filters` : object containing:
  - `dateFrom`, `dateTo` (Date or string)
  - `merchant` (string)
  - `category` (string or string[])
  - `bank` (string)
  - `cardId` (string reference)
  - `paymentStatus` (string)
  - `sortBy` (enum: 'amount' | 'date')
  - `sortDirection` ('asc' | 'desc')
  - `pageNumber` (int)
  - `pageSize` (int)
- `vm.pagination` : object with `totalItems`, `pageNumber`, `pageSize`.
- `vm.isLoading` : boolean.
- `vm.error` : `ErrorModel | null`.

**Public Methods**:
- `vm.initialize()`
  - Sets default filters from `ConfigService` (e.g., current month date range, default sort order).
  - Calls `TransactionService.getTransactions(vm.filters)`.

- `vm.applyFilters()`
  - Validates filter values.
  - Resets `pageNumber` to 1.
  - Calls `getTransactions()`.

- `vm.clearFilters()`
  - Resets `vm.filters` to defaults.
  - Calls `getTransactions()`.

- `vm.sortBy(field)`
  - `field` ∈ { 'amount', 'date' }.
  - Updates `vm.filters.sortBy` and toggles sort direction.
  - Calls `getTransactions()`.

- `vm.pageChanged()`
  - Triggered by pagination controls.
  - Calls `getTransactions()` with updated `pageNumber`.

- `vm.retry()`
  - Retries last query.

**Private Methods**:
- `_buildFilters()` → ensure filter object complies with REST API contract.
- `_handleSuccess(response)` → map to `TransactionModel[]` and pagination.
- `_handleError(error)` → set `vm.error` and log.

### 9.4 AnalyticsController

**Path**: `src/app/controllers/analytics.controller.js`

**Dependencies**:
- `AnalyticsService`
- `ConfigService`
- `LoggingService`

**ViewModel properties**:
- `vm.dateRange` (optional for analytics).
- `vm.categoryAnalytics` : `AnalyticsCategoryModel[]`.
- `vm.trendAnalytics` : `AnalyticsTrendPointModel[]`.
- `vm.cardDistributionAnalytics` : `AnalyticsCardDistributionModel[]`.
- `vm.isLoading` : boolean.
- `vm.error` : `ErrorModel | null`.

**Public Methods**:
- `vm.initialize()`
  - Load default analytics data for current month via `AnalyticsService.getInitialAnalytics()`.

- `vm.refresh()`
  - Re-query analytics based on updated filters or date range.

- `vm.retry()`
  - Retry last analytics query.

### 9.5 BudgetController

**Path**: `src/app/controllers/budget.controller.js`

**Dependencies**:
- `BudgetService`
- `ConfigService`
- `LoggingService`

**ViewModel properties**:
- `vm.budgetStatus` : `BudgetStatusModel`.
- `vm.selectedMonth`.
- `vm.isLoading`.
- `vm.error`.

**Public Methods**:
- `vm.initialize()` → call `BudgetService.getBudgetStatus(vm.selectedMonth)`.
- `vm.changeMonth(month)` → validate month and reload.
- `vm.retry()` → re-fetch budget status.

### 9.6 RecentTransactionsController

**Path**: `src/app/controllers/recent-transactions.controller.js`

**Dependencies**:
- `TransactionService`
- `LoggingService`

**ViewModel properties**:
- `vm.recentTransactions` : `RecentTransactionModel[]`.
- `vm.isLoading`.
- `vm.error`.

**Public Methods**:
- `vm.initialize()` → call `TransactionService.getRecentTransactions(limit=5)`.
- `vm.retry()` → retry recent transactions retrieval.

---

## 10. Service Design

### 10.1 DashboardService

**Path**: `src/app/services/dashboard.service.js`

**Purpose**:
- Fetch aggregated monthly dashboard summary (totals, utilization, transaction counts) from backend.

**Dependencies**:
- `$http`
- `ConfigService`
- `HttpOptionsFactory`
- `ModelMapperFactory`
- `LoggingService`
- `MockApiToggleService`

**Public Methods**:
- `getSummary(month)`
  - Inputs: `month` (string, e.g., `YYYY-MM`).
  - Behaviour:
    - Build URL: `${apiBaseUrl}/v1/dashboard/summary?month=${month}`.
    - Use `HttpOptionsFactory` for headers/timeouts.
    - If `useMockData` is true, instead read `mock/dashboard-summary.mock.json` via `$http.get`.
    - Validate response using `DashboardSummaryModel` validation rules.
    - Map response to `DashboardSummaryModel` via `ModelMapperFactory`.
    - On error, log and reject with `ErrorModel`.

### 10.2 CardService

**Path**: `src/app/services/card.service.js`

**Purpose**:
- Retrieve list of credit card profiles for user.

**Public Methods**:
- `getCards()`
  - URL: `${apiBaseUrl}/v1/cards`.
  - Mock: `mock/cards.mock.json` when `useMockData`.
  - Map to `CardProfileModel[]`.
  - Enforce card number masking via mapping; assume backend already masks but service double-checks.

### 10.3 TransactionService

**Path**: `src/app/services/transaction.service.js`

**Purpose**:
- Fetch transactions for table view and recent transactions widget.

**Public Methods**:
- `getTransactions(filters)`
  - URL: `${apiBaseUrl}/v1/transactions` with query params for date range, merchant, category, bank, card, paymentStatus, sort, pagination.
  - Mock: `mock/transactions.mock.json`.
  - Validation: ensure `dateFrom <= dateTo`, allowed categories and statuses.
  - Output: object `{ items: TransactionModel[], totalItems: number }`.

- `getRecentTransactions(limit)`
  - URL: `${apiBaseUrl}/v1/transactions/recent?limit=${limit}`.
  - Mock: `mock/recent-transactions.mock.json`.
  - Output: `RecentTransactionModel[]`.

### 10.4 AnalyticsService

**Path**: `src/app/services/analytics.service.js`

**Purpose**:
- Fetch spending analytics data for charts.

**Public Methods**:
- `getCategorySpending(month)`
  - URL: `${apiBaseUrl}/v1/analytics/spending?groupBy=category&month=${month}`.
  - Mock: `mock/analytics-category.mock.json`.

- `getMonthlyTrend()`
  - URL: `${apiBaseUrl}/v1/analytics/spending?groupBy=month`.
  - Mock: `mock/analytics-trend.mock.json`.

- `getCardDistribution(month)`
  - URL: `${apiBaseUrl}/v1/analytics/spending?groupBy=card&month=${month}`.
  - Mock: `mock/analytics-card-distribution.mock.json`.

- `getInitialAnalytics(month)`
  - Aggregates above three methods, returns composite object.

### 10.5 BudgetService

**Path**: `src/app/services/budget.service.js`

**Purpose**:
- Fetch budget status (configured budget, current spend, remaining, utilization).  

**Public Methods**:
- `getBudgetStatus(month)`
  - URL: `${apiBaseUrl}/v1/budget/status?month=${month}`.
  - Mock: `mock/budget-status.mock.json`.
  - Map to `BudgetStatusModel`.

### 10.6 ConfigService

**Path**: `src/app/services/config.service.js`

**Purpose**:
- Load environment-specific configuration from JSON files.

**Public Methods**:
- `load()`
  - Reads `env.default.json` plus environment-specific file (`env.dev.json` or `env.prod.json`).

- `get(key)` / `getConfig()`
  - Returns config values (`apiBaseUrl`, `apiTimeoutMs`, `maxLookbackMonths`, `useMockData`, `featureFlags`, `telemetry`).

### 10.7 LoggingService

**Path**: `src/app/services/logging.service.js`

**Purpose**:
- Centralize logging and integrate with external telemetry if configured.

**Public Methods**:
- `info(message, context)`
- `warn(message, context)`
- `error(message, error, context)`
- `audit(action, details)`

No UI manipulation; purely logging.

### 10.8 MockApiToggleService

**Path**: `src/app/services/mock-api-toggle.service.js`

**Purpose**:
- Decide whether APIs call real endpoints or mock JSON files based on configuration.

**Public Methods**:
- `shouldUseMock()` → boolean, derived from `ENV_CONFIG.useMockData`.

---

## 11. Factory Design

### 11.1 HttpOptionsFactory

**Path**: `src/app/factories/http-options.factory.js`

**Purpose**:
- Provide reusable `$http` config (headers, timeout).

**Public Methods**:
- `create()` → returns an options object including:
  - `headers` (e.g., `Content-Type: application/json`).
  - `timeout` from `ENV_CONFIG.apiTimeoutMs`.

### 11.2 ModelMapperFactory

**Path**: `src/app/factories/model-mapper.factory.js`

**Purpose**:
- Map raw REST responses to strongly-typed models and enforce validation rules.

**Public Methods** (examples):
- `toDashboardSummaryModel(raw)`
- `toCardProfileModels(rawList)`
- `toTransactionModels(rawList)`
- `toAnalyticsCategoryModels(rawList)`
- `toAnalyticsTrendModels(rawList)`
- `toAnalyticsCardDistributionModels(rawList)`
- `toBudgetStatusModel(raw)`
- `toRecentTransactionModels(rawList)`

Each mapping method validates required fields and throws/returns `ErrorModel` on invalid structure.

---

## 12. Directive Design

### 12.1 kpi-card Directive

**Path**: `src/app/directives/kpi-card.directive.js`

**Registration**:
- `angular.module('app').directive('kpiCard', kpiCard);`

**Purpose**:
- Encapsulate KPI card UI used for summary metrics and card profiles.

**Configuration**:
- `restrict`: `'E'`
- `scope`:
  - `title: '@'`
  - `value: '@'`
  - `iconClass: '@'`
  - `tooltip: '@'`
  - `trend: '<?'` (optional trend indicator)
- `bindToController`: true
- `controller`: `KpiCardController`
- `controllerAs`: `vm`
- `templateUrl`: `templates/dashboard/kpi-card.html`
- `replace`: false
- `transclude`: false

**Usage Example**:

```html
<kpi-card
  title="Total Monthly Spend"
  value="{{ vm.summary.totalMonthlySpend | currencyFormat }}"
  icon-class="fa fa-credit-card"
  tooltip="Total amount spent in the selected month">
</kpi-card>
```

### 12.2 budget-progress Directive

**Path**: `src/app/directives/budget-progress.directive.js`

**Purpose**:
- Display budget utilization as a progress bar.

**Configuration**:
- `restrict`: `'E'`
- `scope`:
  - `status: '<'` (binding to `BudgetStatusModel`)
- `bindToController`: true
- `controller`: `BudgetProgressController`
- `controllerAs`: `vm`
- `templateUrl`: `templates/budget/budget-progress.html`
- `replace`: false
- `transclude`: false

### 12.3 spending-chart Directive

**Path**: `src/app/directives/spending-chart.directive.js`

**Purpose**:
- Wrapper around Chart.js for category-wise, trend, and card distribution charts.

**Configuration**:
- `restrict`: `'E'`
- `scope`:
  - `config: '<'` (chart configuration object)
  - `data: '<'` (data array)
- `bindToController`: true
- `controller`: `SpendingChartController`
- `controllerAs`: `vm`
- `templateUrl`: `templates/analytics/spending-chart.html`

**Chart Config Model** (JS object):
- `type`: `'bar' | 'line' | 'pie' | 'doughnut'`
- `labels`: string[]
- `datasets`: Chart.js datasets array
- `options`: Chart.js options (legend, tooltips, responsive, scales, etc.)

### 12.4 transactions-table Directive

**Path**: `src/app/directives/transactions-table.directive.js`

**Purpose**:
- Reusable table directive for transaction management page.

**Configuration**:
- `restrict`: `'E'`
- `scope`:
  - `transactions: '<'`
  - `filters: '<'`
  - `onSort: '&'`
  - `onFilter: '&'`
  - `onPageChange: '&'`
- `bindToController`: true
- `controller`: `TransactionsTableController`
- `controllerAs`: `vm`
- `templateUrl`: `templates/transactions/transactions-table.html`

Columns:
- Transaction Date
- Merchant Name
- Category
- Card Used
- Amount
- Payment Status
- Remarks

Supports:
- Sorting (clickable header).
- Filter inputs.
- Pagination controls.

### 12.5 recent-transactions-widget Directive

**Path**: `src/app/directives/recent-transactions-widget.directive.js`

**Purpose**:
- Display latest 5 transactions.

**Configuration**:
- `restrict`: `'E'`
- `scope`:
  - `transactions: '<'` (RecentTransactionModel[])
- `bindToController`: true
- `controller`: `RecentTransactionsWidgetController`
- `controllerAs`: `vm`
- `templateUrl`: `templates/dashboard/recent-transactions-widget.html`

---

## 13. Filter Design

### 13.1 currencyFormat Filter

**Path**: `src/app/filters/currency-format.filter.js`

**Purpose**:
- Display numeric values as currency using configured format (symbol, decimal places).

**Input**: number  
**Output**: string formatted currency.

Configuration-driven behaviour via `ConfigService` (e.g., currency symbol, locale).

### 13.2 dateFormat Filter

**Path**: `src/app/filters/date-format.filter.js`

**Purpose**:
- Format dates consistently across application.

**Input**: Date or ISO date string  
**Output**: string (e.g., `DD MMM YYYY`).

### 13.3 percentageFormat Filter

**Path**: `src/app/filters/percentage-format.filter.js`

**Purpose**:
- Format utilization and budget percentages.

**Input**: number between 0 and 1 or 0 and 100 (config-controlled).  
**Output**: string (e.g., `45%`).

---

## 14. Model Design

All models are JavaScript constructor functions or plain objects documented here.

### 14.1 DashboardSummaryModel

**Path**: `src/app/models/dashboard-summary.model.js`

**Properties**:
- `totalMonthlySpend` : number (>= 0, required).
- `totalCreditLimit` : number (>= 0, required).
- `availableCredit` : number (>= 0, required).
- `outstandingAmount` : number (>= 0, required).
- `utilizationPercentage` : number (0–100, required).
- `transactionCount` : number (>= 0, integer, required).
- `month` : string (format `YYYY-MM`, required).

**Validation Rules**:
- All numeric fields must be non-negative.
- `utilizationPercentage` must be between 0 and 100.
- `month` must match `YYYY-MM` and be within `maxLookbackMonths` of current date.

**Sample JSON**:

```json
{
  "totalMonthlySpend": 24500.50,
  "totalCreditLimit": 500000.00,
  "availableCredit": 475499.50,
  "outstandingAmount": 24500.50,
  "utilizationPercentage": 4.9,
  "transactionCount": 123,
  "month": "2025-07"
}
```

### 14.2 CardProfileModel

**Path**: `src/app/models/card-profile.model.js`

**Properties**:
- `cardId`: string (internal reference, not PAN, required).
- `cardName`: string (required).
- `issuingBank`: string (required).
- `maskedCardNumber`: string (required, pattern `XXXX-XXXX-XXXX-1234` or similar).
- `creditLimit`: number (>= 0, required).
- `availableCredit`: number (>= 0, required).
- `currentOutstanding`: number (>= 0, required).
- `billingDate`: string (ISO date, required).
- `dueDate`: string (ISO date, required).

**Validation Rules**:
- Card number must be masked; disallow unmasked patterns.
- `availableCredit + currentOutstanding` should be approximately `creditLimit` (within tolerance).

**Sample JSON**:

```json
{
  "cardId": "CARD-001",
  "cardName": "Platinum Rewards",
  "issuingBank": "ABC Bank",
  "maskedCardNumber": "XXXX-XXXX-XXXX-1234",
  "creditLimit": 200000,
  "availableCredit": 175000,
  "currentOutstanding": 25000,
  "billingDate": "2025-07-05",
  "dueDate": "2025-07-25"
}
```

### 14.3 TransactionModel

**Path**: `src/app/models/transaction.model.js`

**Properties**:
- `transactionId`: string (required).
- `transactionDate`: string (ISO date-time, required).
- `merchantName`: string (required).
- `category`: string (required, one of defined categories).
- `cardId`: string (required).
- `cardName`: string (optional display field).
- `amount`: number (>= 0, required).
- `paymentStatus`: string (enum: `PAID`, `PENDING`, `FAILED`, etc.).
- `remarks`: string (optional).

**Validation Rules**:
- `category` must be one of configured categories: `Food & Dining`, `Fuel`, `Shopping`, `Travel`, `Entertainment`, `Utilities`, `Healthcare`, `Education`, `Miscellaneous`.

### 14.4 AnalyticsCategoryModel

**Path**: `src/app/models/analytics-category.model.js`

**Properties**:
- `category`: string (one of configured categories).
- `totalSpend`: number (>= 0).

**Sample JSON**:

```json
{
  "category": "Food & Dining",
  "totalSpend": 5600.75
}
```

### 14.5 AnalyticsTrendPointModel

**Path**: `src/app/models/analytics-trend-point.model.js`

**Properties**:
- `month`: string (e.g., `2025-01`).
- `totalSpend`: number.

### 14.6 AnalyticsCardDistributionModel

**Path**: `src/app/models/analytics-card-distribution.model.js`

**Properties**:
- `cardName`: string.
- `totalSpend`: number.

### 14.7 BudgetStatusModel

**Path**: `src/app/models/budget-status.model.js`

**Properties**:
- `month`: string (`YYYY-MM`).
- `budgetAmount`: number (>= 0).
- `currentSpend`: number (>= 0).
- `remainingBudget`: number (>= 0).
- `budgetUtilizationPercentage`: number (0–100).

**Validation Rules**:
- `remainingBudget = budgetAmount - currentSpend` (>= 0).
- `budgetUtilizationPercentage = (currentSpend / budgetAmount) * 100` (within tolerance).

### 14.8 RecentTransactionModel

**Path**: `src/app/models/recent-transaction.model.js`

**Properties**:
- `transactionId`
- `transactionDate`
- `merchantName`
- `category`
- `amount`

### 14.9 ErrorModel

**Path**: `src/app/models/error.model.js`

**Properties**:
- `code`: string (e.g., `NETWORK_ERROR`, `VALIDATION_ERROR`, `SERVER_ERROR`).
- `message`: string (user-friendly message).
- `details`: object (optional, not shown to user directly).

---

## 15. REST API Contract

Each endpoint matches HLD definitions.

### 15.1 GET /v1/dashboard/summary

- Method: `GET`
- URL: `/v1/dashboard/summary`
- Query Parameters:
  - `month` (string `YYYY-MM`, required)
- Request Headers:
  - `Authorization: Bearer <token>`
- Response 200:
  - Body: `DashboardSummaryModel` JSON.
- Errors:
  - 400: invalid `month`.
  - 401: unauthorized.
  - 403: forbidden.
  - 500/503: server/downstream errors.

### 15.2 GET /v1/cards

- Method: `GET`
- URL: `/v1/cards`
- Response 200: array of `CardProfileModel`.

### 15.3 GET /v1/transactions

- Method: `GET`
- URL: `/v1/transactions`
- Query Parameters:
  - `dateFrom`, `dateTo`
  - `merchant`
  - `category`
  - `bank`
  - `cardId`
  - `paymentStatus`
  - `sortBy`
  - `sortDirection`
  - `pageNumber`
  - `pageSize`
- Response 200:
  - Body:

```json
{
  "items": [ /* TransactionModel[] */ ],
  "totalItems": 500
}
```

### 15.4 GET /v1/analytics/spending

- Method: `GET`
- URL: `/v1/analytics/spending`
- Query Parameters:
  - `groupBy`: `category` | `month` | `card`
  - `month` (optional, for `category`/`card`)
- Response 200:
  - For `category`: `AnalyticsCategoryModel[]`
  - For `month`: `AnalyticsTrendPointModel[]`
  - For `card`: `AnalyticsCardDistributionModel[]`

### 15.5 GET /v1/budget/status

- Method: `GET`
- URL: `/v1/budget/status`
- Query Parameters:
  - `month`
- Response 200: `BudgetStatusModel` JSON.

### 15.6 GET /v1/transactions/recent

- Method: `GET`
- URL: `/v1/transactions/recent`
- Query Parameters:
  - `limit` (int, default 5)
- Response 200: `RecentTransactionModel[]`.

### 15.7 Error Response Structure

For all endpoints, error response format:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Unable to retrieve spending information.",
  "details": {
    "field": "month",
    "issue": "Invalid value"
  }
}
```

Status codes follow HLD (400, 401, 403, 404, 429, 500, 503).  
Frontend maps these to `ErrorModel` and user-facing messages.

---

## 16. Configuration Design

### 16.1 ENV_CONFIG

**File**: `src/app/config/env.default.json`

Properties:
- `apiBaseUrl`: string (e.g., `https://api.example.com`).
- `apiTimeoutMs`: number (e.g., 10000).
- `maxLookbackMonths`: number (e.g., 12).
- `useMockData`: boolean.
- `featureFlags`: object (e.g., `{ "enableAdvancedAnalytics": true }`).
- `telemetry`: object (e.g., `{ "enabled": true, "endpoint": "https://telemetry.example.com" }`).

Environment-specific overrides: `env.dev.json`, `env.prod.json` with same keys.

### 16.2 Configuration Consumers

- All services use `apiBaseUrl`, `apiTimeoutMs`.
- `DashboardSummaryController` and `BudgetController` use `maxLookbackMonths` for month selection validation.
- `MockApiToggleService` uses `useMockData`.
- Chart-related views may use `featureFlags.enableAdvancedAnalytics`.
- `LoggingService` uses `telemetry` config.

No hardcoded URLs or environment constants inside controllers/services.

---

## 17. Mock Implementation Design

For each endpoint there is a corresponding mock JSON file.

### 17.1 Mock Files

- Dashboard Summary: `src/mock/dashboard-summary.mock.json`
- Cards: `src/mock/cards.mock.json`
- Transactions: `src/mock/transactions.mock.json`
- Analytics Category: `src/mock/analytics-category.mock.json`
- Analytics Trend: `src/mock/analytics-trend.mock.json`
- Analytics Card Distribution: `src/mock/analytics-card-distribution.mock.json`
- Budget Status: `src/mock/budget-status.mock.json`
- Recent Transactions: `src/mock/recent-transactions.mock.json`

Mock behaviour:
- Use `$http.get` with local file path.
- Use `$q` and `$timeout` to simulate network delay.
- Provide success, timeout, empty data, and error scenarios for testing.

Mock JSON structure exactly matches production contracts.

---

## 18. UI Specification

### 18.1 Layout

**Template**: `templates/layout/main-layout.html`

Structure:
- Header: app title, optional user info.
- Navigation bar: links to Dashboard, Cards, Transactions, Analytics, Budget.
- Main content: `ng-view` with feature views.
- Footer: copyright, last refresh timestamp.

Responsive design via Bootstrap grid:
- Use `.container-fluid` and `.row` / `.col-xs-*` / `.col-sm-*` / `.col-md-*` classes.

### 18.2 Dashboard Summary UI (templates/dashboard/dashboard-summary.html)

Sections:
1. Page title: "Monthly Spending Summary".
2. Month selector (dropdown or date input).  
3. KPI cards:
   - Total Monthly Spend
   - Total Credit Limit
   - Available Credit
   - Outstanding Amount
   - Utilization Percentage
   - Number of Transactions
4. Budget progress bar section via `budget-progress` directive.
5. Spending analytics summary charts via `spending-chart` directive.
6. Recent transactions widget via `recent-transactions-widget`.

### 18.3 Card Management UI (templates/cards/card-management.html)

- Page title: "Credit Cards".
- List of cards presented either as table or cards using `kpi-card` directive.
- Display fields: card name, issuing bank, masked card number, credit limit, available credit, current outstanding, billing date, due date.

### 18.4 Transaction Management UI (templates/transactions/transaction-list.html)

- Filters section: inputs for merchant search, category dropdown, bank dropdown, card dropdown, payment status dropdown, date range controls.
- Actions: Apply Filters, Clear Filters.
- Table section: `transactions-table` directive.
- Pagination controls at bottom.

### 18.5 Analytics UI (templates/analytics/analytics.html)

- Page title: "Spending Analytics".
- Filters: month selector (where relevant).
- Chart area: multiple `spending-chart` instances for category-wise, trends, card distribution.

### 18.6 Budget UI (templates/budget/budget.html)

- Page title: "Budget Tracking".
- Month selector.
- Budget numbers (budgetAmount, currentSpend, remainingBudget).
- Budget progress via `budget-progress` directive.

### 18.7 Responsive Behaviour

- Cards and charts stack on smaller screens.
- Transaction table uses horizontal scroll or stacked layout for mobile.
- Navigation collapses into hamburger menu for small screens.

### 18.8 Accessibility

- All controls have labels.
- ARIA attributes for charts and widgets where relevant.
- Keyboard navigation supported; no interactive element requires mouse only.

### 18.9 UI States

For each view:
- Loading: show spinner and disable controls.
- Empty: show friendly message (e.g., "No transactions found for the selected filters.").
- Error: show message (e.g., "Unable to retrieve spending information.") and Retry button.

---

## 19. Data Flow

### 19.1 Dashboard Summary Flow

1. User navigates to `/dashboard`.
2. `DashboardSummaryController.initialize()` triggers.
3. Controller calls `DashboardService.getSummary(month)`.
4. DashboardService calls REST API `/v1/dashboard/summary` (or mock).
5. Response is mapped to `DashboardSummaryModel`.
6. Controller updates `vm.summary`.
7. UI shows KPI cards via `kpi-card` directive.

### 19.2 Card Management Flow

1. User navigates to `/cards`.
2. `CardManagementController.initialize()` calls `CardService.getCards()`.
3. Service fetches data from `/v1/cards`.
4. Map to `CardProfileModel[]`.
5. UI displays cards.

### 19.3 Transaction Management Flow

1. User navigates to `/transactions`.
2. Controller loads default filters and calls `TransactionService.getTransactions(filters)`.
3. Service calls `/v1/transactions` with query params.
4. Response mapped to `TransactionModel[]` and pagination.
5. UI displays table via `transactions-table` directive.
6. User changes filters or sort; controller re-calls service.

### 19.4 Analytics Flow

1. User navigates to `/analytics`.
2. `AnalyticsController.initialize()` uses `AnalyticsService.getInitialAnalytics()`.
3. Service calls `/v1/analytics/spending` with appropriate groupBy.
4. Results mapped to analytics models.
5. Charts rendered via `spending-chart` directive.

### 19.5 Budget Flow

1. User navigates to `/budget` or sees budget widget on dashboard.
2. Controller calls `BudgetService.getBudgetStatus(month)`.
3. Service calls `/v1/budget/status`.
4. Response mapped to `BudgetStatusModel`.
5. UI shows numbers and progress bar via `budget-progress`.

### 19.6 Recent Transactions Flow

1. DashboardSummary view includes `recent-transactions-widget`.
2. `RecentTransactionsController.initialize()` calls `TransactionService.getRecentTransactions(5)`.
3. Service calls `/v1/transactions/recent?limit=5`.
4. Response mapped to `RecentTransactionModel[]`.
5. Widget displays latest transactions.

---

## 20. Business Rules

- Dashboard summary calculations are performed server-side; frontend displays values as-is.
- Card numbers are always masked; full PAN is never displayed.
- Filters support only allowed categories, statuses, and date ranges (config-driven).
- Analytics categories strictly follow configured set; unknown categories are mapped to `Miscellaneous`.
- Budget utilization must not exceed 100%; if backend returns > 100%, UI caps display at 100 but logs discrepancy.

---

## 21. Validation Rules

### 21.1 Form & Filter Validation

- Merchant search: max length (e.g., 100 characters), no control characters.
- Date range: `dateFrom` cannot be after `dateTo`, and range cannot exceed `maxLookbackMonths`.
- Category, bank, card, paymentStatus must be among values fetched from configuration/metadata.

### 21.2 API Request Validation (Client-side)

- Controllers verify filters before calling services; invalid inputs display errors and do not call backend.

### 21.3 API Response Validation

- ModelMapperFactory validates required fields before constructing models.
- Missing or invalid fields result in `ErrorModel` and user-friendly error.

### 21.4 Configuration Validation

- ConfigService ensures required keys exist and types are correct.

---

## 22. Error Handling

- All service calls use `.catch()` to handle errors.
- Errors are mapped into `ErrorModel` and set on controllers.
- UI displays appropriate messages and offers Retry actions.
- Known error types:
  - Network error.
  - Timeout.
  - Validation error.
  - Server error.
- In case of analytics or budget service failure, core dashboard still loads; affected sections display error states.

---

## 23. Logging Design

- LoggingService is used by all controllers/services for:
  - Info logs: successful data loads.
  - Warning logs: validation issues.
  - Error logs: API failures.
  - Audit logs: page views and key filter changes.

- No sensitive data (like card IDs that could be sensitive) is logged.

---

## 24. Security Design

- All API calls include Authorization header (token assumed to be managed outside the scope of this frontend LLD).
- Input validation prevents injection attacks through filters/search.
- Output sanitization via Angular Sanitize for any HTML from backend (if present).
- Card data is limited to non-sensitive attributes and masked numbers.
- No PII beyond necessary for display is introduced by frontend.

---

## 25. Dependency Map

### Controllers

- DashboardSummaryController → DashboardService, BudgetService, AnalyticsService, LoggingService.
- CardManagementController → CardService, LoggingService.
- TransactionListController → TransactionService, ConfigService, LoggingService.
- AnalyticsController → AnalyticsService, ConfigService, LoggingService.
- BudgetController → BudgetService, ConfigService, LoggingService.
- RecentTransactionsController → TransactionService, LoggingService.

### Services

- DashboardService → `$http`, ConfigService, HttpOptionsFactory, ModelMapperFactory, LoggingService, MockApiToggleService.
- CardService → `$http`, ConfigService, HttpOptionsFactory, ModelMapperFactory, LoggingService, MockApiToggleService.
- TransactionService → `$http`, ConfigService, HttpOptionsFactory, ModelMapperFactory, LoggingService, MockApiToggleService.
- AnalyticsService → `$http`, ConfigService, HttpOptionsFactory, ModelMapperFactory, LoggingService, MockApiToggleService.
- BudgetService → `$http`, ConfigService, HttpOptionsFactory, ModelMapperFactory, LoggingService, MockApiToggleService.
- ConfigService → `$http`.
- LoggingService → `$log`, telemetry client.
- MockApiToggleService → ConfigService.

### Directives

- kpi-card → No service dependencies; uses values via attributes.
- budget-progress → Consumes BudgetStatusModel.
- spending-chart → Uses Chart.js.
- transactions-table → Receives data and callbacks from TransactionListController.
- recent-transactions-widget → Receives data from RecentTransactionsController.

### Filters

- currencyFormat → ConfigService (for currency format).
- dateFormat → ConfigService (for date format).
- percentageFormat → ConfigService (for percentage format).

---

## 26. LLD Validation Checklist

- [x] Follows HLD scope and requirements exactly.
- [x] Uses prescribed AngularJS, Bootstrap, Chart.js versions.
- [x] Defines repository structure and all components (controllers, services, factories, directives, filters, models, templates).
- [x] Defines SPA routing and default route.
- [x] Provides REST API contracts aligning with HLD endpoints.
- [x] Details configuration, mock implementation, validation, error handling, and logging.
- [x] Specifies UI layout, states, and responsiveness.
- [x] Documents dependency map for all components.
- [x] Does not introduce out-of-scope business features.
- [x] Contains sufficient implementation detail for a Code Generation Agent to generate the application without assumptions.
