# Low-Level Design: Monthly Spending Summary Dashboard v2 (QE-3349)

## 1. Application Overview

The **Monthly Spending Summary Dashboard v2** is a responsive, read-only Single Page Application (SPA) that allows authenticated credit card holders to view:

- Monthly spending KPIs (total spend, total credit limit, available credit, outstanding amount, utilization percentage, number of transactions).
- Portfolio of multiple credit cards with card-level attributes.
- Paginated, filterable, sortable transaction table.
- Spending analytics charts (category-wise, monthly trend, card-wise, category breakdown).
- Budget tracking widgets (monthly budget, current spend, remaining budget, utilization %, progress bar).
- Recent transactions widget (latest 5 transactions).

The frontend is implemented using AngularJS 1.7.9 following the `lldgenerationkb` standards. All data is obtained via REST APIs exposed by an API Gateway and downstream domain services (Spending & Utilization Service, Card Portfolio Service, Transaction Service, Analytics Service, Budget Service, UX Configuration Service). The application is strictly read-only with respect to card and transaction data.

Business requirements from the HLD are preserved as follows:

- Every dashboard KPI, card attribute, transaction field, filter, chart, and widget defined in the HLD has a corresponding UI component, Angular controller/service, model, and REST API contract in this LLD.
- Security, RBAC/ABAC, responsiveness, resilience, and error handling are explicitly defined at implementation level.

## 2. Technology Stack

Per `lldgenerationkb`, the technology stack is constrained to:

- **Frontend**
  - HTML5
  - CSS3
  - JavaScript (ES6 where supported, compiled/transpiled if needed)
  - AngularJS 1.7.9
    - `ngRoute`
    - `ngAnimate`
    - `ngSanitize`
  - Angular UI Bootstrap 2.5.6
  - Bootstrap 3.4.1 (CSS only)
  - Chart.js 2.9.4

- **Backend (consumed, not implemented here)**
  - REST APIs via API Gateway (HTTPS/JSON)
  - Domain services: Spending & Utilization Service, Card Portfolio Service, Transaction Service, Analytics Service, Budget Service, UX Configuration Service.

- **Other**
  - No jQuery or `bootstrap.min.js` included unless explicitly required (not required in HLD).
  - All communication uses HTTPS.

## 3. Architecture Design

The application follows AngularJS MVC SPA architecture with the following characteristics:

- A single root AngularJS module: `app`.
- Controllers coordinate UI state and delegate business logic and data retrieval to services.
- Services encapsulate interaction with REST APIs and business logic (aggregation, mapping, validation).
- Models define the data structures used by controllers and services.
- Directives encapsulate reusable UI widgets (KPI cards, charts, tables, progress bars, responsive layout containers).
- Filters provide formatting for dates, currency, percentages.
- Configuration is externalized into environment JSON and constants.
- Mock implementations are provided for all REST endpoints and can be toggled via configuration (`useMockData`).

High-level mapping of HLD components to AngularJS components:

- **Responsive Dashboard SPA** → `DashboardController`, `DashboardService`, `MonthlySummaryService`, `CardPortfolioService`, `TransactionService`, `AnalyticsService`, `BudgetService`, Angular directives for cards/charts/tables, responsive layout templates.
- **API Gateway & Domain Services** → Represented via REST endpoints from the browser; their behaviour is captured in the REST API Contract section.

## 4. Repository Structure

Per `lldgenerationkb`, the repository structure for the application is:

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
    controllers/
      dashboard.controller.js
      cards.controller.js
      transactions.controller.js
      analytics.controller.js
      budget.controller.js
    services/
      monthly-summary.service.js
      card-portfolio.service.js
      transaction.service.js
      analytics.service.js
      budget.service.js
      ux-config.service.js
      logging.service.js
      notification.service.js
      error-handler.service.js
    factories/
      model-factory.js
    directives/
      kpi-card.directive.js
      card-list.directive.js
      transaction-table.directive.js
      spending-chart.directive.js
      budget-progress.directive.js
      recent-transactions.directive.js
      responsive-layout.directive.js
    filters/
      currency-format.filter.js
      date-format.filter.js
      percentage-format.filter.js
    models/
      monthly-summary.model.js
      card.model.js
      transaction.model.js
      analytics-summary.model.js
      budget.model.js
      error.model.js
    mock/
      monthly-summary.mock.service.js
      card-portfolio.mock.service.js
      transaction.mock.service.js
      analytics.mock.service.js
      budget.mock.service.js
      ux-config.mock.service.js
      data/
        monthly-summary.sample.json
        cards.sample.json
        transactions.sample.json
        analytics.sample.json
        budget.sample.json
        ux-config.sample.json
  assets/
    css/
      app.css
    js/
      vendor/
        angular.min.js
        angular-route.min.js
        angular-animate.min.js
        angular-sanitize.min.js
        ui-bootstrap-tpls.min.js
        bootstrap.min.css
        chart.min.js
    images/
    fonts/
  README.md
```

Each file below is documented with purpose, dependencies, public methods, and consumers.

## 5. Application Bootstrap Design

### 5.1 index.html

`src/index.html` is the main HTML file and must:

- Declare the AngularJS application root using `ng-app="app"`.
- Contain a single `ng-view` region for route-based templates.
- Load CSS and JS assets in correct order.

Structure:

- **Head**
  - Meta tags for viewport and charset.
  - Title: `Monthly Spending Summary Dashboard v2`.
  - CSS includes:
    - `assets/js/vendor/bootstrap.min.css`
    - `assets/css/app.css`

- **Body**
  - `<div ng-app="app">`
    - Header (dashboard title, user info placeholder).
    - Main navigation bar (links to Dashboard, Transactions, Analytics, Budgets).
    - `<div class="container-fluid">`
      - `<div ng-view></div>` for routed views.
    - Footer (version, data freshness indicators placeholders).

- **Script includes (in order)**
  - Vendor libraries:
    - `angular.min.js`
    - `angular-route.min.js`
    - `angular-animate.min.js`
    - `angular-sanitize.min.js`
    - `ui-bootstrap-tpls.min.js`
    - `chart.min.js`
  - App scripts:
    - `app/app.module.js`
    - `app/app.routes.js`
    - `app/app.run.js`
    - `app/config/config.constants.js`
    - Controllers, services, factories, directives, filters, models.

No jQuery or `bootstrap.min.js` script is included.

### 5.2 Angular Module Bootstrap

`src/app/app.module.js`:

- Defines the root module:

  - Name: `app`
  - Dependencies: `['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']`

`src/app/app.run.js`:

- Registers a run block to:
  - Initialize `ENV_CONFIG` from `config.constants.js` and selected `env.*.json`.
  - Configure global `$http` defaults:
    - Add authorization header (token provided by hosting environment / SSO integration).
    - Set default timeout from `ENV_CONFIG.apiTimeoutMs`.
  - Register global route change handlers for loading indicators and access control.

## 6. Module Design

Root module `app` manages:

- Routing configuration via `app.routes.js`.
- Registration of core services (`monthly-summary.service.js`, `card-portfolio.service.js`, etc.).
- Registration of shared infrastructure services (`logging.service.js`, `notification.service.js`, `error-handler.service.js`).
- Registration of directives, filters, and models.

No additional Angular modules are created; components use `angular.module('app')` for registration.

## 7. Routing Design

`src/app/app.routes.js` defines application routes using `$routeProvider`:

- **Route: `/dashboard`**
  - Template: `templates/dashboard.html`
  - Controller: `DashboardController`
  - ControllerAs: `vm`
  - Resolve:
    - `monthlySummary`: calls `MonthlySummaryService.getSummary(currentPeriod)`.
    - `cards`: calls `CardPortfolioService.getCards()`.
    - `recentTransactions`: calls `TransactionService.getRecentTransactions(5)`.
    - `budgetSummary`: calls `BudgetService.getCurrentBudget()`.
    - `uxConfig`: calls `UXConfigService.getLayoutConfig('dashboard')`.

- **Route: `/transactions`**
  - Template: `templates/transactions.html`
  - Controller: `TransactionsController`
  - ControllerAs: `vm`
  - Resolve:
    - `initialPage`: calls `TransactionService.getTransactions(defaultFilters, page=1)`.
    - `uxConfig`: calls `UXConfigService.getLayoutConfig('transactions')`.

- **Route: `/analytics`**
  - Template: `templates/analytics.html`
  - Controller: `AnalyticsController`
  - ControllerAs: `vm`
  - Resolve:
    - `categorySummary`: calls `AnalyticsService.getCategorySpending(defaultRange)`.
    - `monthlyTrend`: calls `AnalyticsService.getMonthlyTrend(defaultRange)`.
    - `cardDistribution`: calls `AnalyticsService.getCardDistribution(defaultRange)`.
    - `categoryBreakdown`: calls `AnalyticsService.getCategoryBreakdown(defaultRange)`.
    - `uxConfig`: calls `UXConfigService.getLayoutConfig('analytics')`.

- **Route: `/budget`**
  - Template: `templates/budget.html`
  - Controller: `BudgetController`
  - ControllerAs: `vm`
  - Resolve:
    - `budgetSummary`: calls `BudgetService.getCurrentBudget()`.
    - `uxConfig`: calls `UXConfigService.getLayoutConfig('budget')`.

- **Default Route**
  - When no route or unknown route is requested, redirect to `/dashboard`.

All templates referenced above (`templates/dashboard.html`, `transactions.html`, `analytics.html`, `budget.html`) must exist.

## 8. Component Registry

Component registry for this LLD:

### Modules

- **Module `app`**
  - Path: `app/app.module.js`
  - Type: AngularJS module
  - Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`
  - Consumers: All other components

### Controllers

- `DashboardController` – `app/controllers/dashboard.controller.js`
- `CardsController` – `app/controllers/cards.controller.js`
- `TransactionsController` – `app/controllers/transactions.controller.js`
- `AnalyticsController` – `app/controllers/analytics.controller.js`
- `BudgetController` – `app/controllers/budget.controller.js`

### Services

- `MonthlySummaryService` – `app/services/monthly-summary.service.js`
- `CardPortfolioService` – `app/services/card-portfolio.service.js`
- `TransactionService` – `app/services/transaction.service.js`
- `AnalyticsService` – `app/services/analytics.service.js`
- `BudgetService` – `app/services/budget.service.js`
- `UXConfigService` – `app/services/ux-config.service.js`
- `LoggingService` – `app/services/logging.service.js`
- `NotificationService` – `app/services/notification.service.js`
- `ErrorHandlerService` – `app/services/error-handler.service.js`

### Factories

- `ModelFactory` – `app/factories/model-factory.js`

### Directives

- `kpiCard` – `app/directives/kpi-card.directive.js`
- `cardList` – `app/directives/card-list.directive.js`
- `transactionTable` – `app/directives/transaction-table.directive.js`
- `spendingChart` – `app/directives/spending-chart.directive.js`
- `budgetProgress` – `app/directives/budget-progress.directive.js`
- `recentTransactions` – `app/directives/recent-transactions.directive.js`
- `responsiveLayout` – `app/directives/responsive-layout.directive.js`

### Filters

- `currencyFormat` – `app/filters/currency-format.filter.js`
- `dateFormat` – `app/filters/date-format.filter.js`
- `percentageFormat` – `app/filters/percentage-format.filter.js`

### Models

- `MonthlySummaryModel` – `app/models/monthly-summary.model.js`
- `CardModel` – `app/models/card.model.js`
- `TransactionModel` – `app/models/transaction.model.js`
- `AnalyticsSummaryModel` – `app/models/analytics-summary.model.js`
- `BudgetModel` – `app/models/budget.model.js`
- `ErrorModel` – `app/models/error.model.js`

### Config/Constants

- `ENV_CONFIG` constant – `app/config/config.constants.js`

### Mock Services

Each real service has a corresponding mock service file under `app/mock/` with the same public method signatures.

## 9. Controller Design

### 9.1 DashboardController

- **File**: `app/controllers/dashboard.controller.js`
- **Registration**: `angular.module('app').controller('DashboardController', DashboardController);`
- **Dependencies** (injected):
  - `MonthlySummaryService`
  - `CardPortfolioService`
  - `TransactionService`
  - `BudgetService`
  - `UXConfigService`
  - `NotificationService`
  - `ErrorHandlerService`
  - `LoggingService`
  - `$routeParams` (for optional period selection)

- **ViewModel (`vm`) Properties**:
  - `vm.monthlySummary`: `MonthlySummaryModel`
  - `vm.cards`: `CardModel[]`
  - `vm.recentTransactions`: `TransactionModel[]`
  - `vm.budgetSummary`: `BudgetModel`
  - `vm.layoutConfig`: UX layout configuration object
  - `vm.isLoading`: boolean
  - `vm.error`: `ErrorModel | null`
  - `vm.selectedPeriod`: string (e.g., `2026-07`) or date range object

- **Public Methods**:
  - `vm.initialize()`
    - Called on controller load.
    - Uses resolved data where available; if not, calls services to fetch summary, cards, recent transactions, budget.
  - `vm.refreshDashboard()`
    - Reloads dashboard metrics (summary, cards, budget, recent transactions) for current `vm.selectedPeriod`.
  - `vm.changePeriod(period)`
    - Updates `vm.selectedPeriod` and triggers refresh.
  - `vm.retry()`
    - Retries failed operations (summary, cards, etc.) using ErrorHandlerService guidance.

- **Inputs**:
  - Route parameters for selected period.
  - User actions: change period, click refresh, click retry.

- **Outputs**:
  - Updates to KPI cards (via `kpiCard` directive).
  - Updated card list (`cardList` directive).
  - Updated recent transactions widget.
  - Updated budget progress bar.
  - Notifications using NotificationService.

### 9.2 CardsController

- **File**: `app/controllers/cards.controller.js`
- **Purpose**: Manages card portfolio view when user navigates to dedicated cards section.
- **Dependencies**:
  - `CardPortfolioService`
  - `NotificationService`
  - `ErrorHandlerService`
  - `LoggingService`

- **ViewModel (`vm`) Properties**:
  - `vm.cards`: `CardModel[]`
  - `vm.isLoading`: boolean
  - `vm.error`: `ErrorModel | null`

- **Public Methods**:
  - `vm.initialize()` – fetch cards via `CardPortfolioService.getCards()`.
  - `vm.retry()` – retry last failed load.

### 9.3 TransactionsController

- **File**: `app/controllers/transactions.controller.js`
- **Purpose**: Manages transaction table view (filters, pagination, sorting).
- **Dependencies**:
  - `TransactionService`
  - `UXConfigService`
  - `NotificationService`
  - `ErrorHandlerService`
  - `LoggingService`

- **ViewModel (`vm`) Properties**:
  - `vm.filters`:
    - `merchant`: string
    - `category`: one of predefined categories
    - `bank`: string
    - `card`: string (card ID or masked number)
    - `dateRange`: `{ from: Date, to: Date }`
    - `amountMin`: number | null
    - `amountMax`: number | null
    - `paymentStatus`: string | null
    - `sortBy`: `'amount' | 'date'`
    - `sortOrder`: `'asc' | 'desc'`
  - `vm.pagination`:
    - `pageNumber`: number
    - `pageSize`: number
    - `totalRecords`: number
  - `vm.transactions`: `TransactionModel[]`
  - `vm.isLoading`: boolean
  - `vm.error`: `ErrorModel | null`
  - `vm.layoutConfig`: UX config

- **Public Methods**:
  - `vm.initialize()` – load initial page using `TransactionService.getTransactions(vm.filters, pageNumber)`.
  - `vm.applyFilters()` – validate filters and call `TransactionService.getTransactions()`.
  - `vm.changePage(pageNumber)` – update pagination and reload.
  - `vm.sortBy(field)` – update sorting config and reload.
  - `vm.clearFilters()` – reset filters to default and reload.
  - `vm.retry()` – retry last failed request.

### 9.4 AnalyticsController

- **File**: `app/controllers/analytics.controller.js`
- **Purpose**: Manages spending analytics charts.
- **Dependencies**:
  - `AnalyticsService`
  - `UXConfigService`
  - `NotificationService`
  - `ErrorHandlerService`
  - `LoggingService`

- **ViewModel (`vm`) Properties**:
  - `vm.dateRange`: time range for analytics
  - `vm.categorySummary`: `AnalyticsSummaryModel`
  - `vm.monthlyTrend`: `AnalyticsSummaryModel`
  - `vm.cardDistribution`: `AnalyticsSummaryModel`
  - `vm.categoryBreakdown`: `AnalyticsSummaryModel`
  - `vm.isLoading`: boolean
  - `vm.error`: `ErrorModel | null`
  - `vm.layoutConfig`: UX config

- **Public Methods**:
  - `vm.initialize()` – loads all analytics datasets.
  - `vm.changeRange(dateRange)` – updates date range and reloads analytics data.
  - `vm.retry()` – retries failed analytics calls.

### 9.5 BudgetController

- **File**: `app/controllers/budget.controller.js`
- **Purpose**: Manages budget summary view.
- **Dependencies**:
  - `BudgetService`
  - `UXConfigService`
  - `NotificationService`
  - `ErrorHandlerService`
  - `LoggingService`

- **ViewModel (`vm`) Properties**:
  - `vm.budgetSummary`: `BudgetModel`
  - `vm.isLoading`: boolean
  - `vm.error`: `ErrorModel | null`

- **Public Methods**:
  - `vm.initialize()` – loads current budget summary.
  - `vm.retry()` – retries budget load.

Controllers do not implement business logic; they coordinate services and view models.

## 10. Service Design

All services follow explicit DI and use REST APIs or mock equivalents.

### 10.1 MonthlySummaryService

- **File**: `app/services/monthly-summary.service.js`
- **Registration**: `angular.module('app').service('MonthlySummaryService', MonthlySummaryService);`
- **Dependencies**:
  - `$http`
  - `$q`
  - `ENV_CONFIG`
  - `LoggingService`
  - `ErrorHandlerService`

- **Public Methods**:
  - `getSummary(periodOrRange): Promise<MonthlySummaryModel>`
    - Input: period identifier (e.g., `2026-07`) or `{ from: Date, to: Date }`.
    - Behaviour:
      - Build GET request: `GET ENV_CONFIG.apiBaseUrl + '/dashboard/summary?period=...'`.
      - Apply timeout from `ENV_CONFIG.apiTimeoutMs`.
      - On success, validate response using `_validateResponse()` and map to `MonthlySummaryModel` via `_mapResponse()`.
      - On error, delegate to `ErrorHandlerService` and reject with `ErrorModel`.

- **Private Methods**:
  - `_buildRequest(periodOrRange)` – constructs query string.
  - `_mapResponse(apiResponse)` – converts raw JSON to `MonthlySummaryModel`.
  - `_validateResponse(apiResponse)` – ensures required fields are present and non-negative.

### 10.2 CardPortfolioService

- **File**: `app/services/card-portfolio.service.js`
- **Public Methods**:
  - `getCards(): Promise<CardModel[]>`
    - GET `ENV_CONFIG.apiBaseUrl + '/cards'`.
    - Validates masking and required fields.

### 10.3 TransactionService

- **File**: `app/services/transaction.service.js`
- **Public Methods**:
  - `getTransactions(filters, pageNumber): Promise<{ transactions: TransactionModel[], totalRecords: number }>`
  - `getRecentTransactions(limit): Promise<TransactionModel[]>`

Inputs for `getTransactions`:

- `filters` as defined in `TransactionsController`.
- Validation:
  - Date range must be within maximum lookback from `ENV_CONFIG.maxLookbackMonths`.
  - Category from allowed set.
  - Amount bounds numeric and `amountMin <= amountMax`.

### 10.4 AnalyticsService

- **File**: `app/services/analytics.service.js`
- **Public Methods**:
  - `getCategorySpending(dateRange): Promise<AnalyticsSummaryModel>`
  - `getMonthlyTrend(dateRange): Promise<AnalyticsSummaryModel>`
  - `getCardDistribution(dateRange): Promise<AnalyticsSummaryModel>`
  - `getCategoryBreakdown(dateRange): Promise<AnalyticsSummaryModel>`

Each method calls corresponding REST endpoints (`/analytics/spending/category`, `/analytics/spending/monthly-trend`, etc.) and maps results to chart-ready datasets (labels, values, metadata).

### 10.5 BudgetService

- **File**: `app/services/budget.service.js`
- **Public Methods**:
  - `getCurrentBudget(): Promise<BudgetModel>`

Endpoint: `GET ENV_CONFIG.apiBaseUrl + '/budgets/current'`.

### 10.6 UXConfigService

- **File**: `app/services/ux-config.service.js`
- **Public Methods**:
  - `getLayoutConfig(viewName: string): Promise<any>`

Endpoint: `GET ENV_CONFIG.apiBaseUrl + '/ux/config?view=' + viewName`.

### 10.7 LoggingService

- **File**: `app/services/logging.service.js`
- **Purpose**: Centralized logging.
- **Public Methods**:
  - `info(message, context?)`
  - `warn(message, context?)`
  - `error(message, context?)`
  - `audit(message, context?)`

### 10.8 NotificationService

- **File**: `app/services/notification.service.js`
- **Purpose**: User-facing notifications via toast/modal.
- **Public Methods**:
  - `success(message)`
  - `warning(message)`
  - `error(message)`
  - `info(message)`

### 10.9 ErrorHandlerService

- **File**: `app/services/error-handler.service.js`
- **Purpose**: Standardize error handling.
- **Public Methods**:
  - `handleHttpError(response): ErrorModel`
  - `handleValidationError(details): ErrorModel`
  - `handleUnexpectedError(error): ErrorModel`

Services do not manipulate DOM; UI updates are done by controllers/directives.

## 11. Factory Design

### ModelFactory

- **File**: `app/factories/model-factory.js`
- **Purpose**: Create model instances from raw API responses.
- **Public Methods**:
  - `createMonthlySummary(raw): MonthlySummaryModel`
  - `createCard(raw): CardModel`
  - `createTransaction(raw): TransactionModel`
  - `createAnalyticsSummary(raw): AnalyticsSummaryModel`
  - `createBudget(raw): BudgetModel`
  - `createError(raw): ErrorModel`

Consumers: all services.

## 12. Directive Design

### 12.1 kpiCard Directive

- **File**: `app/directives/kpi-card.directive.js`
- **Usage Example**:

```html
<kpi-card
  label="Total Monthly Spend"
  icon="fa-credit-card"
  value="vm.monthlySummary.totalSpend"
  format="currency">
</kpi-card>
```

- **Configuration**:
  - `restrict: 'E'`
  - `scope`:
    - `label: '@'`
    - `icon: '@'`
    - `value: '<'`
    - `format: '@'`
  - `bindToController: true`
  - `controller: KpiCardController`
  - `controllerAs: 'vm'`
  - `templateUrl: 'templates/directives/kpi-card.html'`

### 12.2 cardList Directive

Displays multiple credit cards with attributes specified in HLD.

- **Usage**:

```html
<card-list cards="vm.cards"></card-list>
```

- **Scope**:
  - `cards: '<'` (`CardModel[]`)

Template shows card name, issuing bank, masked card number, credit limit, available credit, outstanding amount, billing date, due date using Bootstrap cards.

### 12.3 transactionTable Directive

- **Usage**:

```html
<transaction-table
  transactions="vm.transactions"
  pagination="vm.pagination"
  on-page-change="vm.changePage(page)"
  on-sort="vm.sortBy(field)">
</transaction-table>
```

- **Scope**:
  - `transactions: '<'`
  - `pagination: '<'`
  - `onPageChange: '&'`
  - `onSort: '&'`

Template defines table columns:

- Transaction date
- Merchant name
- Category
- Card used (masked)
- Amount
- Payment status
- Remarks

Uses Bootstrap table classes, right-aligns numeric columns, left-aligns text, formats dates and currency using filters.

### 12.4 spendingChart Directive

- **Usage**:

```html
<spending-chart
  type="'bar'"
  data="vm.categorySummary"
  title="'Category-wise Spending'">
</spending-chart>
```

- **Scope**:
  - `type: '@'` (`'bar' | 'line' | 'pie' | 'doughnut'`)
  - `data: '<'` (`AnalyticsSummaryModel`)
  - `title: '@'`

Internally initializes Chart.js (2.9.4) using provided datasets.

### 12.5 budgetProgress Directive

- **Usage**:

```html
<budget-progress budget="vm.budgetSummary"></budget-progress>
```

- **Scope**:
  - `budget: '<'` (`BudgetModel`)

Displays progress bar representing budget utilization and textual summary (monthly budget, current spend, remaining budget).

### 12.6 recentTransactions Directive

- **Usage**:

```html
<recent-transactions transactions="vm.recentTransactions"></recent-transactions>
```

- **Scope**:
  - `transactions: '<'` (`TransactionModel[]`)

Displays latest 5 transactions with date, merchant, amount, and category.

### 12.7 responsiveLayout Directive

- **Usage**:

```html
<responsive-layout config="vm.layoutConfig">
  <!-- child components like KPI cards, charts, tables -->
</responsive-layout>
```

- **Scope**:
  - `config: '<'`

Template uses Bootstrap grid with configuration-driven widget ordering and collapse behaviour for mobile/tablet/desktop.

All directives reference existing templates under `src/templates/directives/` which must be created accordingly.

## 13. Filter Design

### 13.1 currencyFormat

- **File**: `app/filters/currency-format.filter.js`
- **Input**: number, optional currency code (default from ENV_CONFIG)
- **Output**: formatted currency string (e.g., `₹45,872.00` or `USD 1,234.56`).

### 13.2 dateFormat

- **File**: `app/filters/date-format.filter.js`
- **Input**: Date or ISO string
- **Output**: `DD MMM YYYY`.

### 13.3 percentageFormat

- **File**: `app/filters/percentage-format.filter.js`
- **Input**: number between 0 and 1 or 0 and 100
- **Output**: formatted percentage with `%` suffix.

Filters are stateless and pure.

## 14. Model Design

### 14.1 MonthlySummaryModel

- **File**: `app/models/monthly-summary.model.js`
- **Fields**:
  - `month`: string (e.g., `2026-07`) – required
  - `totalSpend`: number – required, `>= 0`
  - `totalCreditLimit`: number – required, `>= 0`
  - `availableCredit`: number – required, `>= 0`
  - `outstandingAmount`: number – required, `>= 0`
  - `utilizationPercentage`: number – required, between `0` and `100`
  - `transactionCount`: number – required, integer `>= 0`
  - `currency`: string – required (e.g., `INR`, `USD`)

- **Sample JSON**:

```json
{
  "month": "2026-07",
  "totalSpend": 45872,
  "totalCreditLimit": 250000,
  "availableCredit": 204128,
  "outstandingAmount": 45872,
  "utilizationPercentage": 18.35,
  "transactionCount": 92,
  "currency": "INR"
}
```

### 14.2 CardModel

- **File**: `app/models/card.model.js`
- **Fields**:
  - `id`: string – required (internal identifier or token)
  - `cardName`: string – required
  - `issuingBank`: string – required
  - `maskedCardNumber`: string – required (format: `**** **** **** 1234`)
  - `creditLimit`: number – required, `>= 0`
  - `availableCredit`: number – required, `>= 0`
  - `currentOutstanding`: number – required, `>= 0`
  - `billingDate`: string or Date – required
  - `dueDate`: string or Date – required

- **Sample JSON**:

```json
{
  "id": "card-001",
  "cardName": "Platinum Rewards",
  "issuingBank": "ABC Bank",
  "maskedCardNumber": "**** **** **** 1234",
  "creditLimit": 100000,
  "availableCredit": 8428,
  "currentOutstanding": 91572,
  "billingDate": "2026-07-10",
  "dueDate": "2026-07-25"
}
```

### 14.3 TransactionModel

- **File**: `app/models/transaction.model.js`
- **Fields**:
  - `id`: string – required
  - `transactionDate`: string or Date – required
  - `merchantName`: string – required
  - `category`: string – required; one of:
    - `Food & Dining`, `Fuel`, `Shopping`, `Travel`, `Entertainment`, `Utilities`, `Healthcare`, `Education`, `Miscellaneous`
  - `cardId`: string – required
  - `maskedCardNumber`: string – required
  - `amount`: number – required, `> 0`
  - `paymentStatus`: string – required (e.g., `Posted`, `Pending`, `Failed`)
  - `remarks`: string – optional

- **Sample JSON**:

```json
{
  "id": "txn-123",
  "transactionDate": "2026-07-15T10:32:00Z",
  "merchantName": "SuperMart",
  "category": "Shopping",
  "cardId": "card-001",
  "maskedCardNumber": "**** **** **** 1234",
  "amount": 1543.75,
  "paymentStatus": "Posted",
  "remarks": "Monthly groceries"
}
```

### 14.4 AnalyticsSummaryModel

- **File**: `app/models/analytics-summary.model.js`
- **Fields**:
  - `labels`: string[] – required
  - `values`: number[] – required, aligned with labels
  - `datasetLabel`: string – required
  - `metadata`: object – optional (e.g., colours, tooltips)

### 14.5 BudgetModel

- **File**: `app/models/budget.model.js`
- **Fields**:
  - `month`: string – required
  - `monthlyBudget`: number – required, `>= 0`
  - `currentSpend`: number – required, `>= 0`
  - `remainingBudget`: number – required, `>= 0`
  - `budgetUtilizationPercentage`: number – required, between `0` and `100`
  - `currency`: string – required

- **Sample JSON**:

```json
{
  "month": "2026-07",
  "monthlyBudget": 50000,
  "currentSpend": 45872,
  "remainingBudget": 4138,
  "budgetUtilizationPercentage": 91.74,
  "currency": "INR"
}
```

### 14.6 ErrorModel

- **File**: `app/models/error.model.js`
- **Fields**:
  - `code`: string or number – required
  - `message`: string – required
  - `details`: object – optional
  - `correlationId`: string – optional

## 15. REST API Contract

All endpoints are prefixed with `ENV_CONFIG.apiBaseUrl` and secured with HTTPS.

### 15.1 GET /dashboard/summary

- **URL**: `/dashboard/summary`
- **Method**: GET
- **Headers**:
  - `Authorization: Bearer <access_token>`
  - `Accept: application/json`
- **Query Parameters**:
  - `period`: string (e.g., `2026-07`) or `from`/`to` for date range
- **Success Response (200)**:
  - Body: `MonthlySummaryModel` JSON.
- **Error Responses**:
  - `400` – invalid period/date range
  - `401` – unauthorized
  - `403` – forbidden
  - `404` – no data for given period
  - `408` – timeout
  - `500` – internal error

### 15.2 GET /cards

- **URL**: `/cards`
- **Method**: GET
- **Headers**: same as above
- **Success Response (200)**:
  - Body: `CardModel[]`.

### 15.3 GET /transactions

- **URL**: `/transactions`
- **Method**: GET
- **Query Parameters**:
  - `merchant`: string (optional)
  - `category`: string (optional, must be one of allowed categories)
  - `bank`: string (optional)
  - `cardId`: string (optional)
  - `from`: ISO date (optional)
  - `to`: ISO date (optional)
  - `amountMin`: number (optional)
  - `amountMax`: number (optional)
  - `paymentStatus`: string (optional)
  - `sortBy`: `amount` or `date` (optional)
  - `sortOrder`: `asc` or `desc` (optional)
  - `pageNumber`: integer (required)
  - `pageSize`: integer (optional, default from server)

- **Success Response (200)**:
  - Body:

```json
{
  "transactions": [ /* TransactionModel[] */ ],
  "totalRecords": 500
}
```

### 15.4 GET /transactions/recent

- **URL**: `/transactions/recent`
- **Query Parameters**:
  - `limit`: integer (default 5)

- **Success Response (200)**:
  - Body: `TransactionModel[]` ordered by latest `transactionDate`.

### 15.5 Analytics Endpoints

- **GET /analytics/spending/category**
  - Query: `from`, `to`.
  - Response: `AnalyticsSummaryModel` for category-wise spending.

- **GET /analytics/spending/monthly-trend**
  - Response: monthly spending trend.

- **GET /analytics/spending/card-distribution**
  - Response: card-wise spending distribution.

- **GET /analytics/spending/category-breakdown**
  - Response: category breakdown.

### 15.6 GET /budgets/current

- **URL**: `/budgets/current`
- **Method**: GET
- **Response**: `BudgetModel`.

### 15.7 GET /ux/config

- **URL**: `/ux/config`
- **Query Parameters**:
  - `view`: `dashboard | transactions | analytics | budget`

- **Response**: JSON layout configuration object.

All endpoints follow the same error response structure using `ErrorModel`.

## 16. Configuration Design

### 16.1 ENV_CONFIG Constant

- **File**: `app/config/config.constants.js`
- **Definition**:
  - `ENV_CONFIG.apiBaseUrl`: string; environment-specific base URL.
  - `ENV_CONFIG.apiTimeoutMs`: number; default HTTP timeout.
  - `ENV_CONFIG.maxLookbackMonths`: number; max months for historical queries.
  - `ENV_CONFIG.useMockData`: boolean; toggles between real and mock services.
  - `ENV_CONFIG.featureFlags`: object; toggles widgets.
  - `ENV_CONFIG.telemetryEnabled`: boolean; toggles client telemetry.
  - `ENV_CONFIG.currencyCode`: string; default currency.

### 16.2 Environment Files

- `env.default.json`, `env.dev.json`, `env.prod.json` define values for `ENV_CONFIG` fields.

Consumers: `app.run.js`, all services.

## 17. Mock Implementation Design

Each service has a mock equivalent in `app/mock/` that adheres to the same public method signatures and models.

### Example: MonthlySummaryMockService

- **File**: `app/mock/monthly-summary.mock.service.js`
- **Behaviour**:
  - Uses `$q` and `$timeout`.
  - Returns `MonthlySummaryModel` created from `monthly-summary.sample.json` after simulated delay (`ENV_CONFIG.mockDelayMs`).
  - Simulates scenarios:
    - Success: valid response.
    - Timeout: rejects after delay with timeout ErrorModel.
    - Empty: returns empty KPIs when data file missing.
    - Invalid: triggers validation error for testing.

Similar patterns apply to card, transaction, analytics, budget, and UX config mock services.

Mock selection:

- When `ENV_CONFIG.useMockData === true`, DI configuration swaps real services with mock services via Angular provider configuration in `app.module.js` or a dedicated `mock.config.js` file.

## 18. UI Specification

### 18.1 Dashboard Layout (templates/dashboard.html)

Order of sections:

1. **KPI Summary**
   - Row of `kpi-card` directives for:
     - Total Monthly Spend
     - Total Credit Limit
     - Available Credit
     - Outstanding Amount
     - Utilization Percentage
     - Number of Transactions

2. **Budget Widget**
   - `budget-progress` directive.

3. **Spending Analytics Charts (summary view)**
   - `spending-chart` for category-wise spending.
   - `spending-chart` for monthly trend.

4. **Card Portfolio**
   - `card-list` directive.

5. **Recent Transactions**
   - `recent-transactions` directive.

All arranged using Bootstrap grid with responsive breakpoints:

- Desktop: 3 KPI cards per row, card list and charts side-by-side where space permits.
- Tablet: 2 KPI cards per row.
- Mobile: 1 KPI card per row; card list and charts stacked.

### 18.2 Transactions Layout (templates/transactions.html)

Sections:

- Filter bar (top) with form controls for merchant, category, bank, card, date range, amount range, payment status, sort by, sort order.
- Apply/Clear buttons.
- `transaction-table` directive below.

### 18.3 Analytics Layout (templates/analytics.html)

Sections:

- Date range selector.
- Four charts arranged using Bootstrap:
  - Category-wise spending (bar).
  - Monthly spending trend (line).
  - Card-wise distribution (pie/doughnut).
  - Category breakdown (stacked bar or doughnut).

### 18.4 Budget Layout (templates/budget.html)

- Budget summary (textual values) and `budget-progress` directive.

All templates include loading indicators, empty states, and error banners.

## 19. Data Flow

Example: Dashboard Summary (Flow 2 from HLD)

1. User navigates to `/dashboard`.
2. Angular route resolves `monthlySummary`, `cards`, `recentTransactions`, `budgetSummary`, `uxConfig` via corresponding services.
3. `DashboardController.initialize()` assigns resolved data to `vm.*` models.
4. KPI cards, budget progress, charts, card list, recent transactions directives render based on `vm`.
5. On error, ErrorHandlerService returns `ErrorModel`; controller sets `vm.error` and NotificationService shows message.

Example: Transactions View (Flow 4)

1. User navigates to `/transactions` and sees filter bar.
2. User applies filters; `TransactionsController.applyFilters()` validates inputs.
3. Controller calls `TransactionService.getTransactions(vm.filters, vm.pagination.pageNumber)`.
4. Service builds `GET /transactions` URL with filters, calls API.
5. API returns paginated `TransactionModel[]` and `totalRecords`.
6. Controller updates `vm.transactions` and `vm.pagination`.
7. `transaction-table` directive renders table.

Analytics and budget flows follow analogous patterns using respective services and models.

## 20. Business Rules

Key business rules from HLD:

1. **Monthly Period Definition**
   - Configurable via backend; UI displays selected period (e.g., `Jul 2026`).
   - Services must treat `period` consistently across summary and budget calculations.

2. **Card Masking**
   - Only masked card numbers are displayed; full PAN never displayed.

3. **Category Enumeration**
   - Transactions must use one of the predefined categories; unknown categories mapped to `Miscellaneous`.

4. **Budget Utilization**
   - `budgetUtilizationPercentage = (currentSpend / monthlyBudget) * 100`.
   - If `monthlyBudget = 0`, utilization is defined as `0`.

5. **Transaction Filters**
   - Date range cannot exceed `ENV_CONFIG.maxLookbackMonths`.
   - Amount ranges must be valid (min <= max).

6. **Responsive Layout**
   - UX config service may reorder or collapse widgets by device type but must retain all business information.

## 21. Validation Rules

Validation applied in services and controllers:

- **MonthlySummaryService**: verify non-negative numeric fields and valid utilization percentage.
- **CardPortfolioService**: verify card masking, required fields, non-negative limits/outstanding.
- **TransactionService**: validate filter inputs, category values, amount ranges, date ranges.
- **AnalyticsService**: ensure labels and values arrays align and values non-negative.
- **BudgetService**: validate budget numbers and utilization percentage.

Client-side validation is performed before sending filter parameters; server-side validation is enforced by API.

## 22. Error Handling

- Standardized via `ErrorHandlerService` and `ErrorModel`.
- For HTTP errors, controllers:
  - Set `vm.error`.
  - Use NotificationService to show user-friendly messages.
  - Provide `Retry` actions in UI.
- Common user messages:
  - Summary: `"Unable to retrieve dashboard summary. Please try again."`
  - Transactions: `"Unable to retrieve transactions. Please adjust filters or try again."`
  - Analytics: `"Analytics are currently unavailable. Please try again later."`
  - Budget: `"Unable to retrieve budget information. Please try again."`

## 23. Logging Design

- All services log significant events:
  - Request start/end.
  - Errors with correlation IDs.
  - Filter usage (anonymized).
- LoggingService ensures no sensitive data is logged.

## 24. Security Design

- Inputs sanitized using Angular built-ins (`ngSanitize`) and additional checks.
- REST calls include `Authorization` header with token.
- No direct handling of authentication; assumed done by hosting environment and API Gateway.
- No PII beyond identifiers displayed; card numbers masked.
- Potential security risks (such as injection via filters) mitigated by validation and output encoding.

## 25. Dependency Map

- Controllers depend on services, filters, directives.
- Services depend on `$http`, `$q`, `ENV_CONFIG`, Logging and ErrorHandler.
- Directives depend on models and filters.
- Filters depend on no services (pure functions).
- Mock services depend on `$q`, `$timeout`, sample JSON.

No circular dependencies exist; LoggingService does not depend on business services.

## 26. LLD Validation Checklist

- All mandatory sections from `lldgenerationkb` are present.
- Technology stack conforms to AngularJS 1.7.9 SPA guidelines.
- All HLD business requirements (KPI summary, card portfolio, transactions, filters, analytics, budget, recent transactions, security, resilience) have corresponding components.
- REST API contracts defined for all data interactions described in HLD.
- Configuration and mock designs support non-disruptive switching between mock and real data.
- Validation, error handling, logging, and security rules are explicitly specified.
- No implementation assumptions beyond HLD and `lldgenerationkb` standards.
