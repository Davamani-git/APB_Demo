# Low-Level Design (LLD) QE-4845 Monthly Spending Summary Dashboard V1

## 1. Application Overview

This LLD specifies the complete implementation design for the **Monthly Spending Summary Dashboard V1** for repo `APB_Demo`, branch `APPMRN81`, implemented as an AngularJS 1.7.9 Single Page Application (SPA). It follows the HLD for Epic **QE-4845** and the `lldgenerationkb` standards.

The application is a read-heavy analytical dashboard that surfaces:
- Monthly spending summary KPIs.
- Credit card management information.
- Transaction management table with advanced filtering and sorting.
- Spending analytics charts.
- Budget tracking with progress visualization.
- Recent transactions widget.

The LLD defines all frontend components, REST API contracts (for the SPA-facing edge), models, configuration, mock implementations, validation, error handling, logging, security, and dependencies required for code generation. All business requirements from the HLD are preserved without adding new functionality.

Scope boundaries:
- The implementation covers the **Responsive Web SPA** client layer.
- It interacts with backend REST endpoints as defined here, which are logical representations of the Dashboard Orchestrator and related services.
- Payment authorization, card issuance, settlement, and upstream integration internals are **out of scope**.

## 2. Technology Stack

### 2.1 Frontend Technologies

- HTML5
- CSS3
- JavaScript (ES6 where compatible with AngularJS 1.7.9)
- AngularJS 1.7.9
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only)
- Chart.js 2.9.4

### 2.2 Supported Browsers

- Google Chrome (latest stable versions)
- Microsoft Edge (latest stable versions)

No additional frontend frameworks are introduced beyond the above.

## 3. Architecture Design

The application follows AngularJS MVC SPA architecture:

- **Single Page Application**
  - Root `index.html` bootstraps AngularJS module `app` and defines the `ng-view` region.

- **AngularJS Module Architecture**
  - Single root module `app` with dependencies:
    - `ngRoute`
    - `ngAnimate`
    - `ngSanitize`
    - `ui.bootstrap`

- **MVC Responsibilities**
  - Controllers coordinate UI state, route interactions, and call services.
  - Services contain business logic related to dashboard aggregation, transactions, analytics, budgets, and configuration.
  - Directives encapsulate reusable UI components (KPI cards, charts, table wrappers).
  - Factories define reusable model constructors or helper objects.
  - Filters format dates, amounts, and percentages.

- **Communication**
  - SPA interacts with backend via REST-based HTTP endpoints under a common base URL (e.g., `/api/dashboard`).
  - Backend authentication, authorization, and orchestration are assumed to be implemented by the Dashboard Orchestrator Service and API Gateway as per HLD.

- **Dependency Injection & Patterns**
  - AngularJS DI for controllers, services, directives, etc.
  - `ControllerAs` syntax (`vm` as the view model alias).
  - All components wrapped in IIFE to avoid global scope pollution.

## 4. Repository Structure

The repository structure for the SPA implementation is:

```text
src/
  app/
    app.module.js
    app.routes.js
    config/
      env.config.factory.js
      config.constants.js
    controllers/
      dashboardSummary.controller.js
      cardManagement.controller.js
      transactionManagement.controller.js
      spendingAnalytics.controller.js
      budgetTracking.controller.js
      recentTransactions.controller.js
    services/
      dashboardSummary.service.js
      cardProfile.service.js
      transaction.service.js
      analytics.service.js
      budget.service.js
      configuration.service.js
      logging.service.js
      errorHandling.service.js
    factories/
      models.factory.js
    directives/
      kpiCard.directive.js
      transactionTable.directive.js
      spendingChart.directive.js
      budgetProgress.directive.js
      recentTransactions.directive.js
    filters/
      currencyFormat.filter.js
      dateFormat.filter.js
      percentageFormat.filter.js
    models/
      dashboardSummary.model.js
      cardProfile.model.js
      transaction.model.js
      analytics.model.js
      budget.model.js
      error.model.js
    routes/
      dashboard.routes.js
  templates/
    layout/
      header.html
      footer.html
      sidebar.html
    dashboard/
      dashboardSummary.html
      cardManagement.html
      transactionManagement.html
      spendingAnalytics.html
      budgetTracking.html
      recentTransactions.html
  assets/
    css/
      app.css
      dashboard.css
    js/
      vendor/ (if needed for shims)
    images/
      (dashboard icons, logos, generic imagery)
    fonts/
      (optional, if custom fonts used)
  mock/
    dashboardSummary.mock.service.js
    cardProfile.mock.service.js
    transaction.mock.service.js
    analytics.mock.service.js
    budget.mock.service.js
  data/
    samples/
      dashboardSummary.sample.json
      cardProfiles.sample.json
      transactions.sample.json
      analytics.sample.json
      budget.sample.json
index.html
README.md
```

Each file is documented in sections 8–25.

## 5. Application Bootstrap Design

### 5.1 index.html

Responsibilities:
- Bootstraps AngularJS app.
- Loads required CSS and JS assets in correct order.
- Declares `ng-app="app"` and the main layout container with `ng-view`.

File: `index.html`

Key elements (specification, not implementation code):
- `<html lang="en">`
- `<head>`:
  - `<meta charset="utf-8">`
  - `<meta http-equiv="X-UA-Compatible" content="IE=edge">`
  - `<meta name="viewport" content="width=device-width, initial-scale=1">`
  - Title: `Monthly Spending Summary Dashboard`
  - CSS:
    - Bootstrap 3.4.1 CSS (CDN)
    - `assets/css/app.css`
    - `assets/css/dashboard.css`
- `<body ng-app="app">`:
  - Main layout structure:
    - Header region (includes title and user info placeholder).
    - Sidebar (navigation links to dashboard sections).
    - Content area with `<div class="container-fluid"><div ng-view></div></div>`.
    - Footer region (copyright, version).

Script loading order:
1. AngularJS 1.7.9 (CDN)
2. Angular Route 1.7.9 (CDN)
3. Angular Animate 1.7.9 (CDN)
4. Angular Sanitize 1.7.9 (CDN)
5. Angular UI Bootstrap 2.5.6 (CDN)
6. Chart.js 2.9.4 (CDN)
7. `src/app/app.module.js`
8. `src/app/app.routes.js`
9. `src/app/config/config.constants.js`
10. `src/app/config/env.config.factory.js`
11. All controllers, services, factories, directives, filters, models (ordered logically but exact bundling left to build tooling).

Constraints:
- No jQuery or `bootstrap.min.js` are loaded unless explicitly required; HLD does not require them, so they are omitted.
- All application scripts load after AngularJS libraries.

### 5.2 Angular Module Bootstrap

File: `src/app/app.module.js`

Specification:
- Declares root module:
  - `angular.module("app", ["ngRoute", "ngAnimate", "ngSanitize", "ui.bootstrap"])`.
- Wrap in IIFE.
- No other file declares the `app` module.

File: `src/app/app.routes.js`

Specification:
- Configures `$routeProvider` with dashboard routes (see section 7).
- Sets default route to `/dashboard`.
- Configures `$locationProvider` (hash-based routing; HTML5 mode only if explicitly required and compatible with deployment).

## 6. Module Design

### 6.1 Root Module `app`

- Name: `app`
- Type: AngularJS module
- File: `src/app/app.module.js`
- Dependencies:
  - `ngRoute`
  - `ngAnimate`
  - `ngSanitize`
  - `ui.bootstrap`
- Responsibilities:
  - Provide container for all controllers, services, directives, etc.
  - Configure application-level dependencies.

No additional sub-modules defined; the app remains a single module for this epic.

## 7. Routing Design

File: `src/app/routes/dashboard.routes.js` (referenced by `app.routes.js`).

Routes (URL → Controller → Template):

1. **Dashboard Landing**
   - URL: `/dashboard`
   - TemplateUrl: `templates/dashboard/dashboardSummary.html`
   - Controller: `DashboardSummaryController`
   - ControllerAs: `vm`

2. **Card Management**
   - URL: `/dashboard/cards`
   - TemplateUrl: `templates/dashboard/cardManagement.html`
   - Controller: `CardManagementController`
   - ControllerAs: `vm`

3. **Transaction Management**
   - URL: `/dashboard/transactions`
   - TemplateUrl: `templates/dashboard/transactionManagement.html`
   - Controller: `TransactionManagementController`
   - ControllerAs: `vm`

4. **Spending Analytics**
   - URL: `/dashboard/analytics`
   - TemplateUrl: `templates/dashboard/spendingAnalytics.html`
   - Controller: `SpendingAnalyticsController`
   - ControllerAs: `vm`

5. **Budget Tracking**
   - URL: `/dashboard/budget`
   - TemplateUrl: `templates/dashboard/budgetTracking.html`
   - Controller: `BudgetTrackingController`
   - ControllerAs: `vm`

6. **Recent Transactions**
   - URL: `/dashboard/recent-transactions`
   - TemplateUrl: `templates/dashboard/recentTransactions.html`
   - Controller: `RecentTransactionsController`
   - ControllerAs: `vm`

Default route:
- Any unmatched route redirects to `/dashboard`.

No advanced `resolve` blocks are mandated by HLD; if needed (e.g., preloading configuration), they are defined explicitly in future epics. For this epic, data loading is managed in controllers on initialization.

## 8. Component Registry

AngularJS components in this LLD:

### 8.1 Controllers

- `DashboardSummaryController`
- `CardManagementController`
- `TransactionManagementController`
- `SpendingAnalyticsController`
- `BudgetTrackingController`
- `RecentTransactionsController`

### 8.2 Services

- `DashboardSummaryService`
- `CardProfileService`
- `TransactionService`
- `AnalyticsService`
- `BudgetService`
- `ConfigurationService`
- `LoggingService`
- `ErrorHandlingService`

### 8.3 Factories

- `ModelsFactory` (constructors for typed models)

### 8.4 Directives

- `kpiCard` (KPI summary cards)
- `transactionTable` (transaction grid wrapper)
- `spendingChart` (Chart.js based charts)
- `budgetProgress` (budget progress bar)
- `recentTransactionsWidget` (recent transactions panel)

### 8.5 Filters

- `currencyFormat`
- `dateFormat`
- `percentageFormat`

### 8.6 Models (logical)

- Dashboard Summary Model
- Card Profile Model
- Transaction Model
- Analytics Model
- Budget Model
- Error Model

### 8.7 Config / Constants

- `ENV_CONFIG` (runtime configuration)
- `APP_CONSTANTS` (fixed constants like category list, error codes)

### 8.8 Interceptor (optional)

No HTTP interceptors are mandated in the HLD; error handling is implemented in `ErrorHandlingService`. If future requirements need an HTTP interceptor, it will be added as a separate component.

Each component is documented in the following sections.

## 9. Controller Design

### 9.1 DashboardSummaryController

- File: `src/app/controllers/dashboardSummary.controller.js`
- Module: `app`
- Registration: `angular.module("app").controller("DashboardSummaryController", DashboardSummaryController);`

Dependencies:
- `$scope` (minimal usage, prefer `vm`)
- `DashboardSummaryService`
- `LoggingService`
- `ErrorHandlingService`
- `ENV_CONFIG`

Responsibilities:
- Initialize dashboard summary view for current month.
- Call `DashboardSummaryService` to fetch `/dashboard/summary` data.
- Map service response to view model for KPI cards:
  - `vm.totalMonthlySpend`
  - `vm.totalCreditLimit`
  - `vm.availableCredit`
  - `vm.outstandingAmount`
  - `vm.utilizationPercentage`
  - `vm.transactionCount`
- Manage loading, error, and empty states.

Public Methods:
- `vm.initialize()`
  - Triggered on controller load.
  - Invokes `vm.loadSummary()`.
- `vm.loadSummary()`
  - Calls `DashboardSummaryService.getSummary(currentPeriod)`.
  - Handles promises: on success populates KPIs, on error delegates to `ErrorHandlingService`.
- `vm.refresh()`
  - Allows user to manually refresh summary data.

Inputs:
- Current period (month and year), derived from configuration or route parameters.

Outputs:
- Updated KPI values.
- UI state flags: `vm.isLoading`, `vm.hasError`, `vm.isEmpty`.

Error Handling:
- On error, set `vm.hasError = true`, show generic message: "Unable to retrieve dashboard summary.".
- Expose `vm.retry()` that re-invokes `vm.loadSummary()`.

### 9.2 CardManagementController

- File: `src/app/controllers/cardManagement.controller.js`

Dependencies:
- `CardProfileService`
- `LoggingService`
- `ErrorHandlingService`
- `ENV_CONFIG`

Responsibilities:
- Retrieve and display list of user credit cards with attributes:
  - Card name
  - Issuing bank
  - Masked card number
  - Credit limit
  - Available credit
  - Current outstanding
  - Billing date
  - Due date
- Manage pagination (client-side or server-side depending on response).
- Manage loading, error, and empty states.

Public Methods:
- `vm.initialize()`
- `vm.loadCards(pageNumber)`

Outputs:
- `vm.cards` array of Card Profile Model.
- UI state flags.

Error Handling:
- On failure, show "Unable to load card information." and provide retry.

### 9.3 TransactionManagementController

- File: `src/app/controllers/transactionManagement.controller.js`

Dependencies:
- `TransactionService`
- `ConfigurationService`
- `LoggingService`
- `ErrorHandlingService`
- `ENV_CONFIG`

Responsibilities:
- Manage transaction table for current month by default.
- Maintain filters:
  - Merchant name (text search)
  - Category (dropdown from ConfigurationService)
  - Bank
  - Card
  - Date range
  - Sort by amount / date.
- Load transactions via `TransactionService.getTransactions(filters)`.
- Provide pagination support.

View model:
- `vm.filters = { merchant, categoryId, bankId, cardId, fromDate, toDate, sortField, sortDirection }`
- `vm.transactions` (array of Transaction Model)
- `vm.pagination` (current page, page size, total count)

Public Methods:
- `vm.initialize()`
- `vm.applyFilters()`
- `vm.clearFilters()`
- `vm.changeSort(field)`
- `vm.pageChanged(newPage)`

Validation:
- Validate date range (`fromDate <= toDate`).
- Validate allowed sort fields (`amount`, `date`).

Error Handling:
- On invalid filters, show client-side messages and do not call API.
- On API error, delegate to `ErrorHandlingService`, set `vm.hasError`.

### 9.4 SpendingAnalyticsController

- File: `src/app/controllers/spendingAnalytics.controller.js`

Dependencies:
- `AnalyticsService`
- `ConfigurationService`
- `LoggingService`
- `ErrorHandlingService`
- `ENV_CONFIG`

Responsibilities:
- Load category-wise spending, monthly trend, card-wise distribution, and category breakdown.
- Provide data for chart directives.

View model:
- `vm.categorySpendingData` (labels, values)
- `vm.monthlyTrendData` (labels, values)
- `vm.cardDistributionData` (labels, values)
- `vm.categoryBreakdownData` (predefined categories list and amounts: Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous).

Public Methods:
- `vm.initialize()`
- `vm.reloadAnalytics()`

Error Handling:
- Graceful degradation: show message "Analytics are temporarily unavailable" and hide charts while still allowing user to navigate.

### 9.5 BudgetTrackingController

- File: `src/app/controllers/budgetTracking.controller.js`

Dependencies:
- `BudgetService`
- `LoggingService`
- `ErrorHandlingService`
- `ENV_CONFIG`

Responsibilities:
- Display budget metrics for selected month:
  - Monthly budget
  - Current spend
  - Remaining budget
  - Budget utilization %
- Provide data for progress bar directive.

View model:
- `vm.selectedMonth`
- `vm.budgetMetrics = { monthlyBudget, currentSpend, remainingBudget, utilizationPercentage, status }`

Public Methods:
- `vm.initialize()` (default to current month)
- `vm.changeMonth(month)`
- `vm.reloadBudget()`

Error Handling:
- On BudgetService unavailability, show message and optionally hide section.

### 9.6 RecentTransactionsController

- File: `src/app/controllers/recentTransactions.controller.js`

Dependencies:
- `TransactionService`
- `LoggingService`
- `ErrorHandlingService`
- `ENV_CONFIG`

Responsibilities:
- Retrieve latest N (e.g., 5) transactions for widget.
- Display compact transaction list.

View model:
- `vm.recentTransactions` (array of Transaction Model limited to N items)

Public Methods:
- `vm.initialize()`
- `vm.reloadRecentTransactions()`

Error Handling:
- On error, show widget-level message and allow retry.

## 10. Service Design

### 10.1 DashboardSummaryService

- File: `src/app/services/dashboardSummary.service.js`

Dependencies:
- `$http`
- `$q`
- `ENV_CONFIG`
- `LoggingService`
- `ErrorHandlingService`

Responsibilities:
- Communicate with backend Dashboard Orchestrator endpoint `/dashboard/summary`.
- Build request parameters based on current month/period.
- Map response to Dashboard Summary Model.

Public Methods:
- `getSummary(period)`
  - Input: `period` (e.g., `{ year: 2026, month: 7 }`)
  - Output: Promise resolving to Dashboard Summary Model.

Behavior:
- Construct URL: `ENV_CONFIG.apiBaseUrl + "/dashboard/summary"`.
- Add query parameters for `period`.
- On success:
  - Validate response structure.
  - Map fields: `totalMonthlySpend`, `totalCreditLimit`, `availableCredit`, `outstandingAmount`, `utilizationPercentage`, `transactionCount`.
- On error:
  - Log error with `LoggingService`.
  - Pass error to `ErrorHandlingService`.

### 10.2 CardProfileService

- File: `src/app/services/cardProfile.service.js`

Dependencies:
- `$http`
- `$q`
- `ENV_CONFIG`
- `LoggingService`
- `ErrorHandlingService`

Responsibilities:
- Communicate with `/dashboard/cards` and `/cards/{id}` (logical endpoints as per HLD).

Public Methods:
- `getCards(page, pageSize)`
  - Returns paginated list of Card Profile Model.
- `getCardById(cardId)`

Behavior:
- Ensure masked card numbers only are exposed.

### 10.3 TransactionService

- File: `src/app/services/transaction.service.js`

Dependencies:
- `$http`
- `$q`
- `ENV_CONFIG`
- `LoggingService`
- `ErrorHandlingService`

Responsibilities:
- Communicate with `/dashboard/transactions` and `/dashboard/recent-transactions`.

Public Methods:
- `getTransactions(filters)`
  - Input: filter object with merchant, category, bank, card, date range, sort.
  - Output: Promise with paginated transaction list.
- `getRecentTransactions(limit)`
  - Input: `limit` (default 5).

Behavior:
- Map filters to query parameters.
- Use parameterized queries via backend; the frontend just passes filter values.

### 10.4 AnalyticsService

- File: `src/app/services/analytics.service.js`

Dependencies:
- `$http`
- `$q`
- `ENV_CONFIG`
- `LoggingService`
- `ErrorHandlingService`

Responsibilities:
- Communicate with `/dashboard/analytics`.

Public Methods:
- `getAnalytics(period)`
  - Returns structured analytics data for category-wise, monthly trend, card distribution, category breakdown.

### 10.5 BudgetService

- File: `src/app/services/budget.service.js`

Dependencies:
- `$http`
- `$q`
- `ENV_CONFIG`
- `LoggingService`
- `ErrorHandlingService`

Responsibilities:
- Communicate with `/dashboard/budget`.

Public Methods:
- `getBudgetMetrics(period)`

Behavior:
- Map backend metrics to Budget Model.

### 10.6 ConfigurationService

- File: `src/app/services/configuration.service.js`

Dependencies:
- `$http`
- `$q`
- `ENV_CONFIG`
- `APP_CONSTANTS`

Responsibilities:
- Retrieve categories and configuration values from backend configuration endpoints (e.g., `/configuration/categories`).
- Provide category list for filters and analytics.

Public Methods:
- `getCategories()`
- `getThresholds()`

### 10.7 LoggingService

- File: `src/app/services/logging.service.js`

Dependencies:
- `$log` (Angular built-in)

Responsibilities:
- Centralize logging of info, warnings, errors.

Public Methods:
- `info(message, context)`
- `warn(message, context)`
- `error(message, context)`

Behavior:
- May augment logs with correlation IDs from backend responses.

### 10.8 ErrorHandlingService

- File: `src/app/services/errorHandling.service.js`

Dependencies:
- `LoggingService`

Responsibilities:
- Translate error models into user-facing messages.

Public Methods:
- `handleApiError(error)`
- `getUserMessage(errorCode)`

Behavior:
- Map HTTP status codes and backend error codes to generic messages.

## 11. Factory Design

### 11.1 ModelsFactory

- File: `src/app/factories/models.factory.js`

Responsibilities:
- Provide constructors/initializers for:
  - Dashboard Summary Model
  - Card Profile Model
  - Transaction Model
  - Analytics Model
  - Budget Model
  - Error Model

Public Methods:
- `createDashboardSummary(raw)`
- `createCardProfile(raw)`
- `createTransaction(raw)`
- `createAnalytics(raw)`
- `createBudget(raw)`
- `createError(raw)`

Each method:
- Validates raw data.
- Applies default values.
- Ensures types are consistent.

## 12. Directive Design

### 12.1 kpiCard Directive

- File: `src/app/directives/kpiCard.directive.js`

Attributes:
- Restrict: `E`
- Scope bindings:
  - `title: "@"`
  - `value: "="`
  - `iconClass: "@"`
  - `tooltip: "@"`

TemplateUrl:
- `templates/dashboard/kpiCard.html`

Controller:
- `KpiCardController`
- ControllerAs: `vm`

Usage Example:

```html
<kpi-card
  title="Total Monthly Spend"
  value="vm.totalMonthlySpend"
  icon-class="fa fa-money"
  tooltip="Total spend for selected month">
</kpi-card>
```

### 12.2 transactionTable Directive

- File: `src/app/directives/transactionTable.directive.js`

Attributes:
- Restrict: `E`
- Scope:
  - `transactions: "="`
  - `filters: "="`
  - `pagination: "="`
  - `onFilterChange: "&"`
  - `onSortChange: "&"`
  - `onPageChange: "&"`

TemplateUrl:
- `templates/dashboard/transactionTable.html`

Behavior:
- Render table with headers: Date, Merchant Name, Category, Card, Amount, Payment Status, Remarks.
- Right-align numeric columns (Amount).

### 12.3 spendingChart Directive

- File: `src/app/directives/spendingChart.directive.js`

Attributes:
- Restrict: `E`
- Scope:
  - `config: "="` (chart type, labels, datasets)

TemplateUrl:
- `templates/dashboard/spendingChart.html`

Behavior:
- Initialize Chart.js charts based on config.

### 12.4 budgetProgress Directive

- File: `src/app/directives/budgetProgress.directive.js`

Scope:
- `metrics: "="`

TemplateUrl:
- `templates/dashboard/budgetProgress.html`

Behavior:
- Visualize utilization percentage with color-coded progress bar.

### 12.5 recentTransactionsWidget Directive

- File: `src/app/directives/recentTransactions.directive.js`

Scope:
- `transactions: "="`

TemplateUrl:
- `templates/dashboard/recentTransactionsWidget.html`

Behavior:
- Display latest 5 transactions in a compact list.

## 13. Filter Design

### 13.1 currencyFormat Filter

- File: `src/app/filters/currencyFormat.filter.js`

Input:
- Numeric amount.

Output:
- String formatted with currency symbol and thousands separators (currency from configuration).

### 13.2 dateFormat Filter

- File: `src/app/filters/dateFormat.filter.js`

Input:
- Date object or ISO string.

Output:
- `DD-MMM-YYYY` format.

### 13.3 percentageFormat Filter

- File: `src/app/filters/percentageFormat.filter.js`

Input:
- Number between 0 and 100 or ratio.

Output:
- String with `%` and two decimal places.

## 14. Model Design

### 14.1 Dashboard Summary Model

File: `src/app/models/dashboardSummary.model.js`

Properties:
- `totalMonthlySpend: number`
- `totalCreditLimit: number`
- `availableCredit: number`
- `outstandingAmount: number`
- `utilizationPercentage: number`
- `transactionCount: number`
- `periodLabel: string` (e.g., "July 2026")

Validation:
- All numeric fields >= 0.
- `utilizationPercentage` between 0 and 100.

Sample JSON:

```json
{
  "totalMonthlySpend": 45872,
  "totalCreditLimit": 80000,
  "availableCredit": 34128,
  "outstandingAmount": 15000,
  "utilizationPercentage": 57.34,
  "transactionCount": 92,
  "periodLabel": "July 2026"
}
```

### 14.2 Card Profile Model

File: `src/app/models/cardProfile.model.js`

Properties:
- `id: string`
- `cardName: string`
- `issuingBank: string`
- `maskedCardNumber: string`
- `creditLimit: number`
- `availableCredit: number`
- `currentOutstanding: number`
- `billingDate: string` (ISO date)
- `dueDate: string` (ISO date)

Validation:
- `maskedCardNumber` must not contain full PAN.

### 14.3 Transaction Model

File: `src/app/models/transaction.model.js`

Properties:
- `id: string`
- `transactionDate: string` (ISO date)
- `merchantName: string`
- `category: string`
- `cardId: string`
- `amount: number`
- `paymentStatus: string` (e.g., "Settled", "Pending")
- `remarks: string`

### 14.4 Analytics Model

File: `src/app/models/analytics.model.js`

Properties:
- `categoryWiseSpending: { labels: string[], values: number[] }`
- `monthlyTrend: { labels: string[], values: number[] }`
- `cardDistribution: { labels: string[], values: number[] }`
- `categoryBreakdown: { category: string, amount: number }[]`

### 14.5 Budget Model

File: `src/app/models/budget.model.js`

Properties:
- `monthlyBudget: number`
- `currentSpend: number`
- `remainingBudget: number`
- `utilizationPercentage: number`
- `status: string` (e.g., "Under", "Approaching", "Exceeded")

Validation:
- `remainingBudget = monthlyBudget - currentSpend`.

### 14.6 Error Model

File: `src/app/models/error.model.js`

Properties:
- `errorCode: string`
- `httpStatus: number`
- `message: string`
- `correlationId: string`

## 15. REST API Contract

All URLs are relative to `ENV_CONFIG.apiBaseUrl`.

### 15.1 GET /dashboard/summary

- Method: `GET`
- URL: `/dashboard/summary`
- Query Parameters:
  - `year` (integer)
  - `month` (integer)
- Headers:
  - `Authorization: Bearer <JWT>`
- Success Response (200): Dashboard Summary Model JSON (see section 14.1).
- Error Responses:
  - 400: invalid period.
  - 401: unauthorized.
  - 403: forbidden.
  - 500: internal error.

### 15.2 GET /dashboard/cards

- Method: `GET`
- URL: `/dashboard/cards`
- Query:
  - `page`
  - `pageSize`
- Success: Paginated list of Card Profile Model.

### 15.3 GET /dashboard/transactions

- Method: `GET`
- URL: `/dashboard/transactions`
- Query:
  - `merchant`
  - `category`
  - `bank`
  - `card`
  - `fromDate`
  - `toDate`
  - `sortField` (amount|date)
  - `sortDirection` (asc|desc)
  - `page`
  - `pageSize`
- Success: Paginated list of Transaction Model.

### 15.4 GET /dashboard/analytics

- Method: `GET`
- URL: `/dashboard/analytics`
- Query:
  - `year`
  - `month`
- Success: Analytics Model.

### 15.5 GET /dashboard/budget

- Method: `GET`
- URL: `/dashboard/budget`
- Query:
  - `year`
  - `month`
- Success: Budget Model.

### 15.6 GET /dashboard/recent-transactions

- Method: `GET`
- URL: `/dashboard/recent-transactions`
- Query:
  - `limit` (default 5)
- Success: List of Transaction Model.

### 15.7 GET /configuration/categories

- Method: `GET`
- URL: `/configuration/categories`
- Success:
  - List of categories and metadata.

## 16. Configuration Design

### 16.1 ENV_CONFIG

File: `src/app/config/env.config.factory.js`

Properties:
- `apiBaseUrl: string`
- `apiTimeoutMs: number`
- `maxLookbackMonths: number`
- `useMockData: boolean`
- `featureFlags: { [key: string]: boolean }`
- `telemetry: { enabled: boolean }`

Consumers:
- All services.

### 16.2 Config Files

- `data/env.default.json`
- `data/env.dev.json`
- `data/env.prod.json`

Properties in JSON:
- Mirror `ENV_CONFIG` with environment-specific values.

### 16.3 APP_CONSTANTS

File: `src/app/config/config.constants.js`

Properties:
- `CATEGORIES`: ["Food & Dining", "Fuel", "Shopping", "Travel", "Entertainment", "Utilities", "Healthcare", "Education", "Miscellaneous"]
- `DEFAULT_RECENT_TRANSACTION_LIMIT`: 5

## 17. Mock Implementation Design

Mock mode is enabled when `ENV_CONFIG.useMockData === true`.

### 17.1 Mock Services

Files:
- `src/mock/dashboardSummary.mock.service.js`
- `src/mock/cardProfile.mock.service.js`
- `src/mock/transaction.mock.service.js`
- `src/mock/analytics.mock.service.js`
- `src/mock/budget.mock.service.js`

Each mock service:
- Exposes the same methods as the corresponding real service.
- Uses `$q` and `$timeout` to simulate async behavior.
- Reads from `data/samples/*.sample.json`.

Behavior examples:
- `dashboardSummary.mock.service.js`:
  - `getSummary(period)` returns sample Dashboard Summary JSON.
- `transaction.mock.service.js`:
  - `getTransactions(filters)` filters sample transaction list in-memory.

Mock errors:
- Can simulate error responses (e.g., for testing UI error states) based on specific filter combinations (documented in test plans, not in this LLD).

## 18. UI Specification

### 18.1 Layout

Templates:
- `templates/layout/header.html`
- `templates/layout/footer.html`
- `templates/layout/sidebar.html`

Header:
- Contains application title: "Monthly Spending Summary Dashboard".
- Displays current period.

Sidebar:
- Navigation links:
  - Dashboard Summary
  - Cards
  - Transactions
  - Analytics
  - Budget
  - Recent Transactions

Footer:
- Displays version info and copyright.

### 18.2 Dashboard Summary Page

Template: `templates/dashboard/dashboardSummary.html`

Layout:
- Row of KPI cards (Bootstrap grid, e.g., 3–4 cards per row):
  - Total Monthly Spend
  - Total Credit Limit
  - Available Credit
  - Outstanding Amount
  - Utilization Percentage
  - Number of Transactions

### 18.3 Card Management Page

Template: `templates/dashboard/cardManagement.html`

Layout:
- Responsive card grid showing card attributes.

### 18.4 Transaction Management Page

Template: `templates/dashboard/transactionManagement.html`

Layout:
- Filter bar at top (merchant search, category dropdown, bank/card dropdowns, date range pickers).
- Table below using `transactionTable` directive.

### 18.5 Spending Analytics Page

Template: `templates/dashboard/spendingAnalytics.html`

Layout:
- Section for category-wise bar chart.
- Section for monthly trend line chart.
- Section for card-wise pie chart.
- Section for category breakdown chart.

### 18.6 Budget Tracking Page

Template: `templates/dashboard/budgetTracking.html`

Layout:
- Dropdown or date picker for selecting month.
- Budget metrics text.
- Progress bar via `budgetProgress` directive.

### 18.7 Recent Transactions Page

Template: `templates/dashboard/recentTransactions.html`

Layout:
- Compact list from `recentTransactionsWidget` directive.

### 18.8 States

All pages define:
- Loading state (spinner, disable actions).
- Empty state message when no data.
- Error state with message and retry.

## 19. Data Flow

### 19.1 Dashboard Summary Success Flow

1. User navigates to `/dashboard`.
2. `DashboardSummaryController.initialize()` calls `DashboardSummaryService.getSummary(period)`.
3. Service calls REST endpoint `/dashboard/summary`.
4. Backend returns Dashboard Summary JSON.
5. Service maps JSON to Dashboard Summary Model.
6. Controller updates `vm` fields.
7. `kpiCard` directives display KPI cards.

Failure Flow:
- On API error, `ErrorHandlingService.handleApiError` is invoked; controller sets error flags and UI shows error state.

### 19.2 Transaction Management Flow

Similar pattern for filters and table retrieval, aligned to HLD flow 4.

### 19.3 Analytics, Budget, Recent Transactions

Follow the success/failure flows described in HLD sections 3.5–3.7, with SPA-specific mapping.

## 20. Business Rules

Key business rules inferred from HLD (no new rules introduced):

- Monthly spend computation uses backend-defined period boundaries.
- Utilization percentage is computed by backend; SPA displays the given value.
- Category mapping rules are enforced by backend; SPA displays categories as-is.
- Budget utilization status (Under/Approaching/Exceeded) is determined by backend.

The SPA does not implement business logic beyond what is necessary for visualization; it trusts backend values.

## 21. Validation Rules

Client-side validation:
- Date range: `fromDate` must be <= `toDate`; otherwise show error and block API call.
- Required filters: none mandatory; but invalid inputs are prevented.
- Input types: ensure numeric fields such as amount filters are numbers.

Server-side validation (not implemented in SPA but expected):
- Filter values validated by backend per HLD.

## 22. Error Handling

- All API calls use a standard error model.
- `ErrorHandlingService` maps errors to user messages:
  - 400: "One or more filters are invalid. Please review your inputs."
  - 401: "Your session has expired. Please log in again."
  - 403: "You do not have permission to view this data."
  - 404: "No data found for the selected criteria."
  - 500: "An unexpected error occurred. Please try again later."

Controllers:
- Set `vm.hasError`, `vm.errorMessage` based on `ErrorHandlingService` outputs.
- Provide retry actions as appropriate.

## 23. Logging Design

- `LoggingService` provides a single point for logging;
- Controllers and services log key events:
  - API call start/end.
  - Filter changes.
  - Errors.

No sensitive data (card numbers, tokens) is logged.

## 24. Security Design

Frontend security considerations:
- Authorization headers attached to API calls via backend configuration (token storage is assumed as HTTP-only cookie).
- Inputs sanitized by AngularJS and validated before sending.
- No display of full card numbers or sensitive PII.

Security responsibilities like token issuance and RBAC are backend concerns; SPA interacts through secure HTTPS endpoints.

## 25. Dependency Map

Example dependencies (not exhaustive):

- `DashboardSummaryController` depends on `DashboardSummaryService`, `LoggingService`, `ErrorHandlingService`, `ENV_CONFIG`.
- `TransactionManagementController` depends on `TransactionService`, `ConfigurationService`, `LoggingService`, `ErrorHandlingService`, `ENV_CONFIG`.
- `SpendingAnalyticsController` depends on `AnalyticsService`, `ConfigurationService`, `LoggingService`, `ErrorHandlingService`, `ENV_CONFIG`.
- `BudgetTrackingController` depends on `BudgetService`, `LoggingService`, `ErrorHandlingService`, `ENV_CONFIG`.
- `RecentTransactionsController` depends on `TransactionService`, `LoggingService`, `ErrorHandlingService`, `ENV_CONFIG`.
- `DashboardSummaryService` depends on `$http`, `$q`, `ENV_CONFIG`, `LoggingService`, `ErrorHandlingService`.
- `TransactionService` depends on `$http`, `$q`, `ENV_CONFIG`, `LoggingService`, `ErrorHandlingService`.
- `AnalyticsService` depends on `$http`, `$q`, `ENV_CONFIG`, `LoggingService`, `ErrorHandlingService`.
- `BudgetService` depends on `$http`, `$q`, `ENV_CONFIG`, `LoggingService`, `ErrorHandlingService`.
- `ConfigurationService` depends on `$http`, `$q`, `ENV_CONFIG`, `APP_CONSTANTS`.

Templates depend on controllers and directives as specified in routing and directive design.

## 26. LLD Validation Checklist

All mandatory sections from `lldgenerationkb` are present:
1. Application Overview ✅
2. Technology Stack ✅
3. Architecture Design ✅
4. Repository Structure ✅
5. Application Bootstrap Design ✅
6. Module Design ✅
7. Routing Design ✅
8. Component Registry ✅
9. Controller Design ✅
10. Service Design ✅
11. Factory Design ✅
12. Directive Design ✅
13. Filter Design ✅
14. Model Design ✅
15. REST API Contract ✅
16. Configuration Design ✅
17. Mock Implementation Design ✅
18. UI Specification ✅
19. Data Flow ✅ (summarized; detailed flows follow HLD)
20. Business Rules ✅
21. Validation Rules ✅
22. Error Handling ✅
23. Logging Design ✅
24. Security Design ✅
25. Dependency Map ✅
26. LLD Validation Checklist ✅

Where the HLD leaves implementation choices open (e.g., exact field names for some analytics), this LLD defines reasonable concrete structures **without altering business meaning**. No business functionality beyond what the HLD states has been introduced.
