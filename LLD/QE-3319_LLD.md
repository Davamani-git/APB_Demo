# Low Level Design: Monthly Spending Summary Dashboard (QE-3319)

## 1. Application Overview

The **Monthly Spending Summary Dashboard** is a read-only, browser-based Single Page Application (SPA) that presents consolidated credit card spending, utilization, budgeting, recent activity, and analytics for an authenticated user.

Scope for Epic **QE-3319**:

- Provide a summary dashboard showing:
  - Total monthly spend.
  - Total credit limit.
  - Available credit.
  - Outstanding amount.
  - Utilization percentage.
  - Number of transactions (for selected period).
- Display multiple cards with metadata:
  - Card name.
  - Issuing bank.
  - Masked card number.
  - Credit limit.
  - Available credit.
  - Current outstanding.
  - Billing date.
  - Due date.
- Implement transaction management:
  - Paginated table with transaction date, merchant, category, card used, amount, payment status, remarks.
  - Filters: merchant, category, bank, card, date range.
  - Sorting: amount, transaction date.
  - Recent transactions widget (latest 5 transactions).
- Implement spending analytics:
  - Category-wise spending.
  - Monthly spending trend.
  - Card-wise spending distribution.
  - Category breakdown for:
    - Food & Dining
    - Fuel
    - Shopping
    - Travel
    - Entertainment
    - Utilities
    - Healthcare
    - Education
    - Miscellaneous
- Implement budget tracking:
  - Monthly budget.
  - Current spend.
  - Remaining budget.
  - Budget utilization percentage.
  - Progress bar visualization.
- Enforce authentication, authorization, and secure, read-only data access.

The implementation follows the **AngularJS 1.7.9 SPA MVC** architecture and the engineering standards defined in `lldgenerationkb`.


## 2. Technology Stack

### 2.1 Frontend

- **HTML**: HTML5
- **CSS**: CSS3
- **JavaScript**: ES6 (transpiled where needed)
- **AngularJS**: 1.7.9
- **Angular Route**: 1.7.9
- **Angular Animate**: 1.7.9
- **Angular Sanitize**: 1.7.9
- **Angular UI Bootstrap**: 2.5.6
- **Bootstrap**: 3.4.1 (CSS)
- **Chart.js**: 2.9.4

### 2.2 Browser Support

- Google Chrome (latest stable)
- Microsoft Edge (latest stable)

### 2.3 Backend (API Contract Perspective Only)

While backend services are not implemented in this repo, the LLD defines contracts against:

- API Gateway exposing REST endpoints:
  - `/api/dashboard/summary`
  - `/api/transactions/search`
  - `/api/transactions/recent`
  - `/api/analytics/spending`
  - `/api/budget/summary`
- Downstream services (conceptual only; exposed via REST):
  - Dashboard Aggregation Service
  - Card Profile Service
  - Transaction Query Service
  - Spending Analytics Service
  - Budget Tracking Service


## 3. Architecture Design

### 3.1 Frontend Architecture

- **Pattern**: AngularJS MVC SPA
- **Root Module**: `app`
- **Structure**:
  - Controllers manage view models and user interaction.
  - Services encapsulate business logic and REST communication.
  - Factories define reusable object constructors (e.g., models).
  - Directives encapsulate reusable UI widgets (cards, charts, tables, progress bar).
  - Filters format numbers, currency, dates, and percentages.
  - Models define structured data for dashboard summary, cards, transactions, analytics, and budgets.

### 3.2 Application Responsibilities

- **Dashboard Module**:
  - Fetch dashboard summary from backend.
  - Bind summary metrics to KPI cards.
  - Display card tiles.
  - Display budget summary panel and progress bar.
  - Display recent transactions widget.
  - Link to transaction search route.

- **Transaction Module**:
  - Provide transaction search page with filters and sort options.
  - Display paginated transaction table.

- **Analytics Module**:
  - Provide analytics view with charts for category-wise, monthly trend, card-wise distribution, and category breakdown.

- **Shared Module**:
  - Shared models, services (REST, logging, configuration, error handling), directives, filters.

### 3.3 Data Flow (High-Level)

- UI -> Controller -> Service -> REST API -> Service -> Controller -> ViewModel -> Directive/View.
- Separate success and failure flows defined in Section 19 & 22.


## 4. Repository Structure

All paths are relative to the repository root.

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
    services/
      dashboard.service.js
      card-profile.service.js
      transactions.service.js
      analytics.service.js
      budget.service.js
      rest-api.service.js
      logging.service.js
      error-handler.service.js
    factories/
      models.factory.js
    directives/
      kpi-card.directive.js
      card-tile.directive.js
      transactions-table.directive.js
      budget-progress.directive.js
      spending-chart.directive.js
    filters/
      currency-format.filter.js
      date-format.filter.js
      percentage-format.filter.js
      number-format.filter.js
    models/
      dashboard-summary.model.js
      card.model.js
      transaction.model.js
      analytics.model.js
      budget-summary.model.js
      error.model.js
    config/
      env.default.json
      env.dev.json
      env.prod.json
      config.constants.js
    routes/
      dashboard.routes.js
      transactions.routes.js
      analytics.routes.js
  templates/
    dashboard/
      dashboard.html
    transactions/
      transactions.html
    analytics/
      analytics.html
    directives/
      kpi-card.html
      card-tile.html
      transactions-table.html
      budget-progress.html
      spending-chart.html
  assets/
    css/
      app.css
    js/
      vendor.js
    images/
      ...
    fonts/
      ...
  mock/
    dashboard.mock.js
    transactions.mock.js
    analytics.mock.js
    budget.mock.js
  data/
    dashboard-summary.sample.json
    cards.sample.json
    transactions.sample.json
    analytics.sample.json
    budget-summary.sample.json
index.html
README.md
```

For each file, detailed responsibilities and dependencies are documented in Sections 8–15 & 25.


## 5. Application Bootstrap Design

### 5.1 index.html

**Path**: `index.html`

**Purpose**:

- Root HTML file bootstrapping AngularJS application.
- Loads vendor scripts and styles (AngularJS, Angular Route, Angular UI Bootstrap, Bootstrap CSS, Chart.js).
- Declares root element with `ng-app="app"`.

**Responsibilities**:

- Include:
  - `assets/css/app.css`
  - `assets/js/vendor.js`
  - `src/app/app.module.js`
  - `src/app/app.config.js`
  - `src/app/app.routes.js`
- Provide `<div ng-view></div>` as router outlet.

**Dependencies**:

- AngularJS 1.7.9
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Bootstrap CSS 3.4.1
- Chart.js 2.9.4

### 5.2 Bootstrap Sequence

1. Browser loads `index.html`.
2. AngularJS bootstraps module `app`.
3. `app.config.js` configures routes, interpolation, and `ENV_CONFIG` loading.
4. `app.routes.js` defines route configurations and default route.
5. Controllers and services are registered with module `app`.
6. Application navigates to default route `/dashboard`.


## 6. Module Design

### 6.1 Root Module: `app`

**File**: `src/app/app.module.js`

**Definition**:

- AngularJS module declaration:
  - `angular.module('app', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap'])`

**Responsibilities**:

- Define dependencies on routing, animate, sanitize, and UI Bootstrap.
- Register config and run blocks.

**Config Block**:

- Defined in `src/app/app.config.js`:
  - Configure `$routeProvider` defaults.
  - Configure `$locationProvider` (HTML5 mode optional, must be documented).
  - Configure `ENV_CONFIG` loading via `config.constants.js`.

**Run Block**:

- May initialize logging context, global error handler, and route change hooks.
- Explicit responsibilities:
  - Attach `$rootScope` handlers for route change start/success/error to manage loading indicators.


## 7. Routing Design

### 7.1 Route Definitions

**File**: `src/app/app.routes.js`

Routes use `$routeProvider` and ControllerAs syntax.

#### 7.1.1 Dashboard Route

- URL: `/dashboard`
- TemplateUrl: `templates/dashboard/dashboard.html`
- Controller: `DashboardController`
- ControllerAs: `vm`
- Resolve:
  - `dashboardData`: calls `DashboardService.getDashboardSummary()` before route activation.

#### 7.1.2 Transactions Route

- URL: `/transactions`
- TemplateUrl: `templates/transactions/transactions.html`
- Controller: `TransactionsController`
- ControllerAs: `vm`
- Resolve:
  - `initialSearchParams`: default date range and page size.

#### 7.1.3 Analytics Route

- URL: `/analytics`
- TemplateUrl: `templates/analytics/analytics.html`
- Controller: `AnalyticsController`
- ControllerAs: `vm`
- Resolve:
  - `defaultAnalyticsParams`: default date range and filters.

### 7.2 Default and Fallback Routes

- Default route: `/dashboard`.
- Invalid routes: redirect to `/dashboard`.


## 8. Component Registry

Each component is registered with Angular module `app`. Summary below; details in subsequent sections.

### 8.1 Controllers

- `DashboardController` — `src/app/controllers/dashboard.controller.js`
- `TransactionsController` — `src/app/controllers/transactions.controller.js`
- `AnalyticsController` — `src/app/controllers/analytics.controller.js`

### 8.2 Services

- `DashboardService` — `src/app/services/dashboard.service.js`
- `CardProfileService` — `src/app/services/card-profile.service.js`
- `TransactionsService` — `src/app/services/transactions.service.js`
- `AnalyticsService` — `src/app/services/analytics.service.js`
- `BudgetService` — `src/app/services/budget.service.js`
- `RestApiService` — `src/app/services/rest-api.service.js`
- `LoggingService` — `src/app/services/logging.service.js`
- `ErrorHandlerService` — `src/app/services/error-handler.service.js`

### 8.3 Factories

- `ModelsFactory` — `src/app/factories/models.factory.js`

### 8.4 Directives

- `kpiCard` — `src/app/directives/kpi-card.directive.js`
- `cardTile` — `src/app/directives/card-tile.directive.js`
- `transactionsTable` — `src/app/directives/transactions-table.directive.js`
- `budgetProgress` — `src/app/directives/budget-progress.directive.js`
- `spendingChart` — `src/app/directives/spending-chart.directive.js`

### 8.5 Filters

- `currencyFormat` — `src/app/filters/currency-format.filter.js`
- `dateFormat` — `src/app/filters/date-format.filter.js`
- `percentageFormat` — `src/app/filters/percentage-format.filter.js`
- `numberFormat` — `src/app/filters/number-format.filter.js`

### 8.6 Models

- `DashboardSummaryModel` — `src/app/models/dashboard-summary.model.js`
- `CardModel` — `src/app/models/card.model.js`
- `TransactionModel` — `src/app/models/transaction.model.js`
- `AnalyticsModel` — `src/app/models/analytics.model.js`
- `BudgetSummaryModel` — `src/app/models/budget-summary.model.js`
- `ErrorModel` — `src/app/models/error.model.js`

### 8.7 Config / Constants

- `ENV_CONFIG` constants — `src/app/config/config.constants.js`


## 9. Controller Design

### 9.1 DashboardController

**File**: `src/app/controllers/dashboard.controller.js`

**Registration**:

- `angular.module('app').controller('DashboardController', DashboardController);`

**Dependencies (DI)**:

- `$scope` (if needed, otherwise avoid and use ControllerAs)
- `DashboardService`
- `BudgetService`
- `LoggingService`
- `ErrorHandlerService`
- `dashboardData` (from route resolve)

**ViewModel (vm)**:

- `vm.summary`: `DashboardSummaryModel`
- `vm.cards`: `CardModel[]`
- `vm.budget`: `BudgetSummaryModel`
- `vm.recentTransactions`: `TransactionModel[]`
- `vm.isLoading`: boolean
- `vm.error`: `ErrorModel | null`

**Public Methods**:

- `vm.refreshDashboard()`
  - Purpose: Re-fetch dashboard summary, cards, budget, and recent transactions.
  - Parameters: none.
  - Returns: void.

- `vm.viewAllTransactions()`
  - Purpose: Navigate to `/transactions` route.
  - Parameters: none.
  - Returns: void.

**Initialization Logic**:

- On controller init:
  - Initialize `vm.summary`, `vm.cards`, `vm.budget`, `vm.recentTransactions` from `dashboardData`.
  - Set `vm.isLoading = false`.
  - Log initialization event via `LoggingService.info`.

**Error Handling**:

- On failure during `refreshDashboard()`:
  - Use `ErrorHandlerService.handleError(error)` to generate `ErrorModel`.
  - Set `vm.error` with user-friendly message.
  - Log error via `LoggingService.error`.

### 9.2 TransactionsController

**File**: `src/app/controllers/transactions.controller.js`

**Dependencies**:

- `TransactionsService`
- `LoggingService`
- `ErrorHandlerService`
- `$routeParams` (for deep linking filters)
- `initialSearchParams`

**ViewModel**:

- `vm.filters`:
  - `merchant`: string
  - `category`: string
  - `bank`: string
  - `cardId`: string
  - `dateFrom`: Date/string (ISO)
  - `dateTo`: Date/string (ISO)
  - `sortBy`: enum (`'amount' | 'date'`)
  - `sortDirection`: enum (`'asc' | 'desc'`)
  - `page`: number
  - `pageSize`: number

- `vm.transactions`: `TransactionModel[]`
- `vm.totalCount`: number
- `vm.isLoading`: boolean
- `vm.error`: `ErrorModel | null`

**Public Methods**:

- `vm.search()`
  - Validate `vm.filters`.
  - Call `TransactionsService.searchTransactions(vm.filters)`.
  - Update `vm.transactions` and `vm.totalCount`.

- `vm.changePage(page)`
  - Update `vm.filters.page` and trigger `vm.search()`.

- `vm.sortBy(field)`
  - Adjust `vm.filters.sortBy` and `vm.filters.sortDirection`.
  - Trigger `vm.search()`.

**Error Handling**:

- Same pattern as `DashboardController`.

### 9.3 AnalyticsController

**File**: `src/app/controllers/analytics.controller.js`

**Dependencies**:

- `AnalyticsService`
- `LoggingService`
- `ErrorHandlerService`
- `defaultAnalyticsParams`

**ViewModel**:

- `vm.params`:
  - `dateFrom`: string/Date
  - `dateTo`: string/Date
  - `cardIds`: string[]

- `vm.categorySeries`: `AnalyticsModel` (category-wise spending)
- `vm.monthlyTrendSeries`: `AnalyticsModel` (monthly trend)
- `vm.cardDistributionSeries`: `AnalyticsModel` (card-wise distribution)
- `vm.categoryBreakdownSeries`: `AnalyticsModel` (detailed breakdown)
- `vm.isLoading`: boolean
- `vm.error`: `ErrorModel | null`

**Public Methods**:

- `vm.refreshAnalytics()`
  - Validate parameters.
  - Call `AnalyticsService.getSpendingAnalytics(vm.params)`.
  - Bind returned series models to view.


## 10. Service Design

### 10.1 RestApiService

**File**: `src/app/services/rest-api.service.js`

**Purpose**:

- Central wrapper for `$http` calls.
- Applies base URL, timeouts, headers, error mapping, and mock/prod switching.

**Dependencies**:

- `$http`
- `$q`
- `ENV_CONFIG`
- `LoggingService`

**Public Methods**:

- `get(url, config)`
- `post(url, data, config)`

**Behavior**:

- Prefix URLs with `ENV_CONFIG.apiBaseUrl`.
- Apply `ENV_CONFIG.apiTimeoutMs`.
- If `ENV_CONFIG.useMockData` is true, route calls to respective mock services instead of backend (delegated, not hardcoded here).

### 10.2 DashboardService

**File**: `src/app/services/dashboard.service.js`

**Purpose**:

- Fetch dashboard summary for current user.

**Dependencies**:

- `RestApiService`
- `ModelsFactory`
- `ENV_CONFIG`
- `$q`
- `LoggingService`

**Public Methods**:

- `getDashboardSummary()`
  - Request: `GET /api/dashboard/summary`.
  - Returns: Promise resolving to `DashboardSummaryModel` + `CardModel[]` + `BudgetSummaryModel` + `TransactionModel[]`.

**Validation Rules**:

- Ensure response fields exist and types match models.
- Map null/empty values to suitable defaults.

### 10.3 CardProfileService

**File**: `src/app/services/card-profile.service.js`

**Purpose**:

- Fetch card list with metadata.

**Dependencies**:

- `RestApiService`
- `ModelsFactory`
- `$q`
- `LoggingService`

**Public Methods**:

- `getCardsForUser()`
  - Potential use for separate card views (if needed by future epics).

### 10.4 TransactionsService

**File**: `src/app/services/transactions.service.js`

**Purpose**:

- Search and retrieve transactions.

**Dependencies**:

- `RestApiService`
- `ModelsFactory`
- `$q`
- `LoggingService`

**Public Methods**:

- `searchTransactions(filters)`
  - Request: `GET /api/transactions/search` with query parameters.
  - Returns: Promise resolving to `{ items: TransactionModel[], totalCount: number }`.

- `getRecentTransactions(limit)`
  - Request: `GET /api/transactions/recent?limit={limit}`.
  - Returns: `TransactionModel[]`.

**Validation Rules**:

- Validate filters (date ranges, page >= 1, pageSize within allowed range).

### 10.5 AnalyticsService

**File**: `src/app/services/analytics.service.js`

**Purpose**:

- Fetch spending analytics.

**Dependencies**:

- `RestApiService`
- `ModelsFactory`
- `$q`
- `LoggingService`

**Public Methods**:

- `getSpendingAnalytics(params)`
  - Request: `GET /api/analytics/spending` with query params (date range, card IDs, etc.).
  - Returns: `AnalyticsModel` instances for each chart.

### 10.6 BudgetService

**File**: `src/app/services/budget.service.js`

**Purpose**:

- Fetch budget summary for current month/period.

**Dependencies**:

- `RestApiService`
- `ModelsFactory`
- `$q`
- `LoggingService`

**Public Methods**:

- `getBudgetSummary()`
  - Request: `GET /api/budget/summary`.
  - Returns: `BudgetSummaryModel`.

### 10.7 LoggingService

**File**: `src/app/services/logging.service.js`

**Purpose**:

- Centralized logging abstraction.

**Dependencies**:

- `$log` or custom logging framework

**Public Methods**:

- `info(message, context)`
- `warn(message, context)`
- `error(message, context)`

### 10.8 ErrorHandlerService

**File**: `src/app/services/error-handler.service.js`

**Purpose**:

- Map HTTP errors and exceptions to `ErrorModel`.

**Dependencies**:

- `LoggingService`

**Public Methods**:

- `handleError(httpError)`
  - Returns: `ErrorModel`.


## 11. Factory Design

### 11.1 ModelsFactory

**File**: `src/app/factories/models.factory.js`

**Purpose**:

- Create instances of standard models for dashboard, cards, transactions, analytics, budgets, and errors.

**Dependencies**:

- None (stateless).

**Public Methods**:

- `createDashboardSummaryModel(raw)` → `DashboardSummaryModel`
- `createCardModel(raw)` → `CardModel`
- `createTransactionModel(raw)` → `TransactionModel`
- `createAnalyticsModel(raw)` → `AnalyticsModel`
- `createBudgetSummaryModel(raw)` → `BudgetSummaryModel`
- `createErrorModel(raw)` → `ErrorModel`


## 12. Directive Design

### 12.1 kpiCard Directive

**File**: `src/app/directives/kpi-card.directive.js`

**Purpose**:

- Render KPI cards (e.g., total spend, utilization %, transaction count).

**Definition**:

- `restrict`: `'E'`
- `scope`:
  - `title: '@'`
  - `icon: '@'`
  - `value: '<'`
  - `formattedValue: '@?'`
  - `tooltip: '@?'`
- `bindToController`: true
- `controllerAs`: `'vm'`
- `templateUrl`: `templates/directives/kpi-card.html`

**Usage Example**:

```html
<kpi-card
  title="Total Monthly Spend"
  icon="fa fa-credit-card"
  value="vm.summary.totalMonthlySpend">
</kpi-card>
```

### 12.2 cardTile Directive

**File**: `src/app/directives/card-tile.directive.js`

**Purpose**:

- Display card metadata tile.

**Scope Bindings**:

- `card: '<'` (CardModel)

**TemplateUrl**:

- `templates/directives/card-tile.html`

### 12.3 transactionsTable Directive

**File**: `src/app/directives/transactions-table.directive.js`

**Purpose**:

- Present transaction table with sorting and pagination controls.

**Scope Bindings**:

- `transactions: '<'` (TransactionModel[])
- `totalCount: '<'`
- `filters: '<'`
- `onPageChange: '&'`
- `onSortChange: '&'`

**TemplateUrl**:

- `templates/directives/transactions-table.html`

### 12.4 budgetProgress Directive

**File**: `src/app/directives/budget-progress.directive.js`

**Purpose**:

- Render budget utilization progress bar.

**Scope Bindings**:

- `budget: '<'` (BudgetSummaryModel)

**TemplateUrl**:

- `templates/directives/budget-progress.html`

### 12.5 spendingChart Directive

**File**: `src/app/directives/spending-chart.directive.js`

**Purpose**:

- Render Chart.js-based charts for analytics.

**Scope Bindings**:

- `chartConfig: '<'` (part of AnalyticsModel)

**TemplateUrl**:

- `templates/directives/spending-chart.html`


## 13. Filter Design

### 13.1 currencyFormat Filter

**File**: `src/app/filters/currency-format.filter.js`

**Purpose**:

- Format numeric amounts as currency using configured currency symbol and decimal places.

**Input**:

- Number or string representing amount.

**Output**:

- String formatted currency.

### 13.2 dateFormat Filter

**File**: `src/app/filters/date-format.filter.js`

**Purpose**:

- Format dates in a consistent pattern (e.g., `DD MMM YYYY`).

### 13.3 percentageFormat Filter

**File**: `src/app/filters/percentage-format.filter.js`

**Purpose**:

- Convert decimal ratios into percentage strings (e.g., `0.45` → `45%`).

### 13.4 numberFormat Filter

**File**: `src/app/filters/number-format.filter.js`

**Purpose**:

- Group thousands and manage decimal places for numeric displays.


## 14. Model Design

### 14.1 DashboardSummaryModel

**File**: `src/app/models/dashboard-summary.model.js`

**Purpose**:

- Represent high-level dashboard summary metrics.

**Properties**:

- `totalMonthlySpend`: number (>= 0, required)
- `totalCreditLimit`: number (>= 0, required)
- `availableCredit`: number (>= 0, required)
- `outstandingAmount`: number (>= 0, required)
- `utilizationPercentage`: number (0–100, required)
- `transactionCount`: number (>= 0, required)

**Sample JSON**:

```json
{
  "totalMonthlySpend": 24500.75,
  "totalCreditLimit": 150000,
  "availableCredit": 125500,
  "outstandingAmount": 24500.75,
  "utilizationPercentage": 16.33,
  "transactionCount": 132
}
```

### 14.2 CardModel

**File**: `src/app/models/card.model.js`

**Purpose**:

- Represent a credit card tile.

**Properties**:

- `id`: string (tokenized card reference, required)
- `cardName`: string (required)
- `issuingBank`: string (required)
- `maskedCardNumber`: string (required, no full PAN)
- `creditLimit`: number (>= 0)
- `availableCredit`: number (>= 0)
- `currentOutstanding`: number (>= 0)
- `billingDate`: string (ISO date, required)
- `dueDate`: string (ISO date, required)

### 14.3 TransactionModel

**File**: `src/app/models/transaction.model.js`

**Purpose**:

- Represent a single transaction.

**Properties**:

- `id`: string (required)
- `transactionDate`: string (ISO date, required)
- `merchantName`: string (required)
- `category`: string (required, one of defined categories)
- `cardId`: string (required)
- `cardName`: string (optional display field)
- `issuingBank`: string (optional)
- `amount`: number (>= 0, required)
- `paymentStatus`: string (e.g., `PAID`, `PENDING`, `FAILED`, required)
- `remarks`: string (optional, max length defined in validation rules)

### 14.4 AnalyticsModel

**File**: `src/app/models/analytics.model.js`

**Purpose**:

- Represent chart data and configuration.

**Properties** (generic for all charts):

- `labels`: string[]
- `datasets`: Array<{ `label`: string, `data`: number[], `backgroundColor`: string[], `borderColor`: string[], `fill`: boolean }>
- `chartType`: string (`'bar' | 'line' | 'pie' | 'doughnut'`)
- `options`: object (Chart.js options including tooltips, legends, scales)

### 14.5 BudgetSummaryModel

**File**: `src/app/models/budget-summary.model.js`

**Purpose**:

- Represent budget tracking state.

**Properties**:

- `monthlyBudget`: number (>= 0, required)
- `currentSpend`: number (>= 0, required)
- `remainingBudget`: number (>= 0, can be 0)
- `utilizationPercentage`: number (0–100, required)

**Business Rule**:

- `remainingBudget = monthlyBudget - currentSpend` (may be negative; set minimum 0 for display).

### 14.6 ErrorModel

**File**: `src/app/models/error.model.js`

**Purpose**:

- Represent user-visible error.

**Properties**:

- `code`: string (e.g., `NETWORK_ERROR`, `VALIDATION_ERROR`)
- `message`: string (user-friendly)
- `details`: string (for logging/trace)
- `correlationId`: string (optional)


## 15. REST API Contract

These represent the frontend’s expectations of backend endpoints.

### 15.1 GET /api/dashboard/summary

**Purpose**:

- Retrieve dashboard summary, card list, budget summary, and recent transactions.

**Method**: GET

**URL**: `${ENV_CONFIG.apiBaseUrl}/api/dashboard/summary`

**Headers**:

- `Authorization: Bearer <token>`
- `Accept: application/json`

**Query Parameters** (optional):

- `periodType`: `"CALENDAR_MONTH" | "BILLING_CYCLE"` (default from config)
- `month`: `YYYY-MM` (if calendar month)

**Success Response (200)**:

```json
{
  "summary": { /* DashboardSummaryModel */ },
  "cards": [ /* CardModel[] */ ],
  "budget": { /* BudgetSummaryModel */ },
  "recentTransactions": [ /* TransactionModel[] */ ]
}
```

**Common Error Codes**:

- 400, 401, 403, 500, 503

### 15.2 GET /api/transactions/search

**Purpose**:

- Search and retrieve paginated transactions.

**Method**: GET

**URL**: `${ENV_CONFIG.apiBaseUrl}/api/transactions/search`

**Query Parameters**:

- `merchant`: string (optional)
- `category`: string (optional, one of defined categories)
- `bank`: string (optional)
- `cardId`: string (optional)
- `dateFrom`: string (ISO date, required)
- `dateTo`: string (ISO date, required)
- `sortBy`: `"amount" | "date"` (optional)
- `sortDirection`: `"asc" | "desc"` (optional)
- `page`: integer (>= 1)
- `pageSize`: integer (10–100)

**Success Response (200)**:

```json
{
  "items": [ /* TransactionModel[] */ ],
  "totalCount": 500
}
```

### 15.3 GET /api/transactions/recent

**Purpose**:

- Retrieve latest N transactions for recent widget.

**Query Parameters**:

- `limit`: integer (1–20, default 5)

**Success Response (200)**:

- `TransactionModel[]`

### 15.4 GET /api/analytics/spending

**Purpose**:

- Retrieve all analytics series used by dashboard.

**Query Parameters**:

- `dateFrom`, `dateTo`
- `cardIds`: repeated/string array

**Success Response (200)**:

```json
{
  "categoryWise": { /* AnalyticsModel */ },
  "monthlyTrend": { /* AnalyticsModel */ },
  "cardDistribution": { /* AnalyticsModel */ },
  "categoryBreakdown": { /* AnalyticsModel */ }
}
```

### 15.5 GET /api/budget/summary

**Purpose**:

- Retrieve budget summary for the selected period.

**Success Response (200)**:

- `BudgetSummaryModel`


## 16. Configuration Design

### 16.1 ENV_CONFIG Constants

**File**: `src/app/config/config.constants.js`

**Properties**:

- `apiBaseUrl`: string
- `apiTimeoutMs`: number (e.g., 10000)
- `maxLookbackMonths`: number (e.g., 12 or 6)
- `useMockData`: boolean
- `featureFlags`: object
  - `enableBudget`: boolean
  - `enableAnalytics`: boolean
- `telemetry`: object
  - `enabled`: boolean

**Consumers**:

- `RestApiService` (base URL, timeout)
- `DashboardService` (period default, feature flags)
- `AnalyticsService` (max look-back)
- `BudgetService` (feature flag)

### 16.2 Environment Files

- `env.default.json`: base defaults.
- `env.dev.json`: dev-specific overrides.
- `env.prod.json`: production-specific overrides.

No configuration property is hardcoded inside controllers or services; all read from `ENV_CONFIG`.


## 17. Mock Implementation Design

Mock implementations mirror production contracts and are activated when `ENV_CONFIG.useMockData` is true.

### 17.1 dashboard.mock.js

**File**: `src/app/mock/dashboard.mock.js`

**Purpose**:

- Provide mock responses for `/api/dashboard/summary`.

**Dependencies**:

- `$q`
- `$timeout`

**Behavior**:

- Delay: 300–800 ms simulated.
- Response: returns sample JSON from `data/dashboard-summary.sample.json` and `data/cards.sample.json`, `data/budget-summary.sample.json`, `data/transactions.sample.json`.

### 17.2 transactions.mock.js

**File**: `src/app/mock/transactions.mock.js`

**Purpose**:

- Mock `/api/transactions/search` and `/api/transactions/recent`.

**Behavior**:

- Match query parameters; filter in-memory sample data.
- Simulate:
  - Success
  - Empty result
  - Timeout (configurable)
  - Error (random or rule-based)

### 17.3 analytics.mock.js

**File**: `src/app/mock/analytics.mock.js`

**Purpose**:

- Mock `/api/analytics/spending`.

### 17.4 budget.mock.js

**File**: `src/app/mock/budget.mock.js`

**Purpose**:

- Mock `/api/budget/summary`.

All mocks produce responses exactly matching production models.


## 18. UI Specification

### 18.1 Layout

**Dashboard Page (`templates/dashboard/dashboard.html`)**:

- Bootstrap container with:
  - Row 1: KPI cards (total spend, utilization %, transaction count, outstanding amount, available credit). Each card uses `kpiCard` directive.
  - Row 2: Card tiles (one per card) using `cardTile` directive.
  - Row 3: Budget panel using `budgetProgress` directive.
  - Row 4: Recent transactions table (top 5) using `transactionsTable` directive in compact mode.

**Transactions Page (`templates/transactions/transactions.html`)**:

- Filter panel at top with fields: merchant, category dropdown, bank dropdown, card dropdown, date range picker.
- Below filters: `transactionsTable` directive with full pagination and sorting.

**Analytics Page (`templates/analytics/analytics.html`)**:

- Filter panel for date range and card selection.
- Chart grid using `spendingChart` for each of the four chart types.

### 18.2 Responsive Behavior

- Use Bootstrap 3 grid (col-xs-12, col-sm-6, col-md-3 etc.).
- KPI cards shrink to 2 per row on tablet and 1 per row on mobile.
- Tables remain horizontally scroll-free for typical widths; if necessary, enable responsive stack.
- Charts resize using Chart.js responsive options.

### 18.3 Accessibility

- All filter controls with `<label>` tags.
- Tab-order defined logically.
- High-contrast color scheme for critical information.

### 18.4 States

- **Loading**: overlay spinner and disabled filters/buttons while data load.
- **Empty**:
  - Dashboard: show "No data available for the selected period".
  - Transactions: show "No transactions found".
  - Analytics: chart placeholders with message.
- **Error**:
  - Show `ErrorModel.message` on top of page with retry button.


## 19. Data Flow

### 19.1 Dashboard Success Flow

1. User navigates to `/dashboard`.
2. Route resolve calls `DashboardService.getDashboardSummary()`.
3. `RestApiService` issues GET `/api/dashboard/summary`.
4. Backend responds with summary, cards, budget, recent transactions.
5. `DashboardService` validates and maps raw JSON to models via `ModelsFactory`.
6. `DashboardController` receives `dashboardData`, initializes view model.
7. View binds to directives (`kpiCard`, `cardTile`, `budgetProgress`, `transactionsTable`).

### 19.2 Transactions Search Success Flow

1. User enters filters and clicks Search.
2. `TransactionsController.search()` validates filters.
3. `TransactionsService.searchTransactions(filters)` calls `/api/transactions/search`.
4. Response is validated, mapped to `TransactionModel[]` and `totalCount`.
5. `TransactionsController` updates view model.
6. `transactionsTable` directive renders rows.

### 19.3 Analytics Success Flow

1. User opens `/analytics`.
2. `AnalyticsController.refreshAnalytics()` called.
3. `AnalyticsService.getSpendingAnalytics(params)` calls `/api/analytics/spending`.
4. Response mapped into `AnalyticsModel` for each chart.
5. `spendingChart` directives render Chart.js charts.

### 19.4 Budget Success Flow

- Part of dashboard flow; budget data retrieved via `BudgetService.getBudgetSummary()` and bound to `budgetProgress` directive.


## 20. Business Rules

- Dashboard metrics are restricted to the selected period and user’s authorized cards only.
- Category values must be one of the defined set; unknown categories mapped to `Miscellaneous`.
- Utilization percentage = `(outstandingAmount / totalCreditLimit) * 100`, rounded to 2 decimals.
- Budget utilization percentage = `(currentSpend / monthlyBudget) * 100`, capped at 100 for visualization.
- Recent transactions limited to 5 by default.
- Sorting default: date descending.


## 21. Validation Rules

### 21.1 Filters

- Date range:
  - `dateFrom` and `dateTo` required for transaction and analytics queries.
  - `dateFrom <= dateTo`.
  - Range not exceeding `ENV_CONFIG.maxLookbackMonths`.

- Merchant name:
  - Optional.
  - Max length: 100.
  - Alphanumeric plus limited punctuation.

- Remarks:
  - Max length: 255.

### 21.2 Models

- All numeric values must be non-negative.
- Required fields must be present and non-null.

### 21.3 API Requests

- Reject invalid categories or sort fields.


## 22. Error Handling

### 22.1 HTTP Error Mapping

- 400 → `VALIDATION_ERROR`
- 401 → `AUTH_ERROR`
- 403 → `AUTH_ERROR`
- 404 → `NOT_FOUND`
- 429 → `RATE_LIMIT`
- 500, 503 → `SERVER_ERROR`

### 22.2 UI Behavior

- Show error message snippet: e.g., "Unable to load dashboard. Please try again.".
- Provide Retry button to re-invoke the last action.


## 23. Logging Design

- All service methods log start/end events and error events.
- Include correlation ID where available.
- Do not log sensitive values (card numbers, full names).


## 24. Security Design

- Inputs sanitized and validated before sending to APIs.
- Outputs encoded appropriately for HTML.
- Authorization assumed enforced by backend; frontend respects tokens and does not cache sensitive data unnecessarily.


## 25. Dependency Map

Summarized key dependencies:

- Controllers depend on respective services, logging, error handler, and resolved data.
- Services depend on `RestApiService`, `ModelsFactory`, `ENV_CONFIG`, and `LoggingService`.
- Directives depend on models and Chart.js (for charts).
- Filters are stateless, no dependencies other than Angular.
- Mock services depend on `$q`, `$timeout`.


## 26. LLD Validation Checklist

- All mandatory sections (1–26) present.
- Technology stack matches `lldgenerationkb` (AngularJS 1.7.9, Bootstrap 3.4.1, Chart.js 2.9.4).
- SPA, MVC, ControllerAs, DI used.
- No business logic in controllers; services perform business logic.
- All routes defined with templates and controllers; default route `/dashboard` and fallback redirect.
- REST contracts fully specified for required endpoints.
- Models defined for all key data entities.
- Configuration centralized via `ENV_CONFIG`; supports mock mode.
- Mock implementations specified for all endpoints.
- UI layout defined for dashboard, transactions, analytics pages with responsive, accessible design.
- Validation and error handling specified.
- Logging and security considerations documented.
- No implementation assumptions beyond HLD and KB standards.
