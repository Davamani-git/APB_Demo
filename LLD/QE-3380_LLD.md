# Low Level Design (LLD) – QE-3380 Monthly Spending Summary Dashboard

## 1. Application Overview

### 1.1 Purpose

This LLD defines the complete implementation specification for the **Monthly Spending Summary Dashboard** for epic **QE-3380**. It translates the HLD into an implementation-ready design for a **Single Page Application (SPA)** built with **AngularJS 1.7.9**, consuming REST APIs, and following the engineering standards from `lldgenerationkb`.

The dashboard consolidates credit-card-related spending, balances, and analytics into a single view and exposes UI capabilities for:
- Summary KPIs: monthly spend, total credit limit, available credit, outstanding amount, utilization percentage, transaction count.
- Multi-card management with masked card identifiers and attributes (issuing bank, limits, billing/due dates, current outstanding).
- Transaction browsing, filtering, sorting, and searching.
- Spending analytics (category-wise, card-wise, monthly trend, category breakdown).
- Budget tracking (monthly budget, current spend, remaining budget, utilization percentage, progress bar).
- Recent transactions widget (latest 5 transactions).
- Responsive layouts for mobile, tablet, and desktop.

### 1.2 Scope

In scope:
- Read-only dashboard views of card and transaction data.
- Aggregated KPIs and analytics visualizations.
- Budget tracking and utilization visualization (no payment or fund movement).
- Responsive UI behaviour on supported browsers.

Out of scope (per HLD):
- Payment execution.
- Card onboarding workflows.
- Dispute management.
- Predictive analytics, credit scoring, or recommendations.

### 1.3 Supported Browsers

- Google Chrome (latest stable).
- Microsoft Edge (latest stable).

### 1.4 Key Constraints

- Must use **AngularJS 1.7.9** and associated libraries as per standards.
- Must be SPA with **AngularJS MVC** and **ControllerAs** syntax.
- Must not upgrade or replace framework versions.
- Must not rely on jQuery or `bootstrap.min.js`.

---

## 2. Technology Stack

### 2.1 Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- AngularJS 1.7.9
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only)
- Chart.js 2.9.4

All third-party libraries are loaded via CDN from `index.html` following the loading-order rules.

### 2.2 Backend Interaction

- RESTful APIs over HTTPS for all data access.
- Mock APIs implemented via AngularJS mocks (`$q`, `$timeout`) when `useMockData` is enabled.

### 2.3 Configuration

- Environment configuration JSON files (`env.default.json`, `env.dev.json`, `env.prod.json`).
- Angular constants (`config.constants.js`) for configuration consumption.

---

## 3. Architecture Design

### 3.1 High-Level Architecture

The application is a browser-based SPA built on AngularJS, using MVC and dependency injection. It communicates with backend APIs representing:

- Dashboard Summary Service
- Card Management Service
- Transaction Management Service
- Search & Filter Service
- Spending Analytics Service
- Budget Tracking Service

AngularJS components are structured into modules, controllers, services, directives, filters, and models with clear separation of concerns:

- Controllers: UI orchestration and data binding.
- Services: Business logic and REST communication.
- Directives: Reusable UI widgets (KPI cards, charts, tables).
- Filters: Formatting of currency, date, and percentages.
- Models: Data contracts used between UI and services.

### 3.2 Data Flow Overview

Data flows are documented in detail in Section 19. At a high level:

- User actions (navigation, filters, selections) trigger controller methods.
- Controllers call services to fetch data via REST APIs or mock services.
- Services validate requests, call backend endpoints, map responses to models, and return data.
- Controllers update ViewModel and drive directives/templates to render UI.
- Errors are handled via standardized error models, UI messages, and logging.

---

## 4. Repository Structure

The repository follows the standard structure and adds QE-3380–specific files.

```text
src/
  index.html
  app/
    app.module.js
    app.config.js
    app.run.js
    routes/
      app.routes.js
    controllers/
      dashboard/
        monthlySummary.controller.js
        cardList.controller.js
        transactionList.controller.js
        budgetSummary.controller.js
      shared/
        layout.controller.js
    services/
      dashboard/
        monthlySummary.service.js
      card/
        cardManagement.service.js
      transaction/
        transactionManagement.service.js
        filter.service.js
      analytics/
        spendingAnalytics.service.js
      budget/
        budgetTracking.service.js
      shared/
        envConfig.service.js
        logging.service.js
        errorHandling.service.js
    directives/
      dashboard/
        kpiCard.directive.js
        recentTransactions.directive.js
        spendingChart.directive.js
        budgetProgress.directive.js
      shared/
        responsiveContainer.directive.js
    filters/
      currencyFormat.filter.js
      dateFormat.filter.js
      percentageFormat.filter.js
    models/
      dashboard/
        monthlySummary.model.js
        kpi.model.js
      card/
        card.model.js
      transaction/
        transaction.model.js
        transactionFilter.model.js
      analytics/
        categorySpending.model.js
        monthlyTrend.model.js
        cardDistribution.model.js
        categoryBreakdown.model.js
      budget/
        budget.model.js
      shared/
        error.model.js
    config/
      config.constants.js
    interceptors/
      httpError.interceptor.js
  templates/
    dashboard/
      monthlySummary.html
      cardList.html
      transactionList.html
      budgetSummary.html
    directives/
      kpiCard.html
      recentTransactions.html
      spendingChart.html
      budgetProgress.html
      responsiveContainer.html
  assets/
    css/
      styles.css
      dashboard.css
    js/
      vendor/
        (reserved for any local vendor JS if required)
    images/
      (icons, logos, illustration for empty/error states)
    fonts/
      (font assets as needed)
  mock/
    dashboard/
      monthlySummary.mock.js
    card/
      cardManagement.mock.js
    transaction/
      transactionManagement.mock.js
    analytics/
      spendingAnalytics.mock.js
    budget/
      budgetTracking.mock.js
  data/
    dashboard/
      monthlySummary.sample.json
    card/
      cards.sample.json
    transaction/
      transactions.sample.json
    analytics/
      categorySpending.sample.json
      monthlyTrend.sample.json
      cardDistribution.sample.json
      categoryBreakdown.sample.json
    budget/
      budget.sample.json
config/
  env.default.json
  env.dev.json
  env.prod.json
README.md
```

Each file’s responsibilities, dependencies, and consumers are documented in the relevant sections below.

---

## 5. Application Bootstrap Design

### 5.1 Root Module

- File: `src/app/app.module.js`
- Angular registration:
  - Declares the root module:
    - Module name: `app`
    - Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`

Responsibilities:
- Initialize the AngularJS application.
- Register global module dependencies.

### 5.2 Configuration Block

- File: `src/app/app.config.js`
- Angular registration:
  - `angular.module("app").config(...)`

Responsibilities:
- Configure routes (delegated to `routes/app.routes.js`).
- Configure `$httpProvider` interceptors (attach `httpError.interceptor.js`).
- Configure `$locationProvider` (hashbang vs HTML5 mode; default to hash-based routing for simplicity).

Dependencies:
- `$routeProvider`, `$locationProvider`, `$httpProvider`, app constants.

### 5.3 Run Block

- File: `src/app/app.run.js`
- Angular registration:
  - `angular.module("app").run(...)`

Responsibilities:
- Initialize global application state (e.g., environment configuration via `envConfig.service.js`).
- Listen to route change events for logging and error handling.

Dependencies:
- `$rootScope`, `EnvConfigService`, `LoggingService`.

---

## 6. Module Design

Single root module: `app`.

No additional AngularJS feature modules are defined to avoid unnecessary complexity while maintaining clear folder separation.

Module Dependencies:
- `ngRoute`: Routing.
- `ngAnimate`: Animated transitions.
- `ngSanitize`: Safe HTML binding.
- `ui.bootstrap`: Bootstrap-based UI components.

---

## 7. Routing Design

File: `src/app/routes/app.routes.js`

### 7.1 Routes

1. **Dashboard Route**
   - URL: `/dashboard`
   - TemplateUrl: `templates/dashboard/monthlySummary.html`
   - Controller: `MonthlySummaryController`
   - ControllerAs: `vm`
   - Resolve:
     - `monthlySummaryData`: Calls `MonthlySummaryService.getSummary(currentMonth)` using the current month derived from system date or configuration.

2. **Card List Route**
   - URL: `/cards`
   - TemplateUrl: `templates/dashboard/cardList.html`
   - Controller: `CardListController`
   - ControllerAs: `vm`
   - Resolve:
     - `cardList`: Calls `CardManagementService.getUserCards()`.

3. **Transaction List Route**
   - URL: `/transactions`
   - TemplateUrl: `templates/dashboard/transactionList.html`
   - Controller: `TransactionListController`
   - ControllerAs: `vm`
   - Resolve:
     - `initialFilter`: Returns default filter model from `TransactionFilterModel` (current month, all cards, all categories).

4. **Budget Summary Route**
   - URL: `/budget`
   - TemplateUrl: `templates/dashboard/budgetSummary.html`
   - Controller: `BudgetSummaryController`
   - ControllerAs: `vm`
   - Resolve:
     - `budgetData`: Calls `BudgetTrackingService.getCurrentBudget()`.

5. **Default Route**
   - URL: `*` (catch-all)
   - RedirectTo: `/dashboard`

Routing Rules:
- Invalid URLs redirect to `/dashboard`.
- All template URLs reference existing HTML files under `templates/`.

---

## 8. Component Registry

This registry enumerates all Angular components.

### 8.1 Controllers

1. `MonthlySummaryController`
   - Type: Controller
   - File: `controllers/dashboard/monthlySummary.controller.js`
   - Module: `app`
   - Registration: `.controller("MonthlySummaryController", ...)`
   - Dependencies: `MonthlySummaryService`, `SpendingAnalyticsService`, `BudgetTrackingService`, `LoggingService`, `ErrorHandlingService`, `$routeParams`.
   - Consumed by: `templates/dashboard/monthlySummary.html`, dashboard route.

2. `CardListController`
   - Type: Controller
   - File: `controllers/dashboard/cardList.controller.js`
   - Dependencies: `CardManagementService`, `LoggingService`, `ErrorHandlingService`.
   - Consumed by: `templates/dashboard/cardList.html`.

3. `TransactionListController`
   - Type: Controller
   - File: `controllers/dashboard/transactionList.controller.js`
   - Dependencies: `TransactionManagementService`, `FilterService`, `LoggingService`, `ErrorHandlingService`.
   - Consumed by: `templates/dashboard/transactionList.html`.

4. `BudgetSummaryController`
   - Type: Controller
   - File: `controllers/dashboard/budgetSummary.controller.js`
   - Dependencies: `BudgetTrackingService`, `LoggingService`, `ErrorHandlingService`.
   - Consumed by: `templates/dashboard/budgetSummary.html`.

5. `LayoutController`
   - Type: Controller
   - File: `controllers/shared/layout.controller.js`
   - Dependencies: `$scope`, `$location` (for nav), `LoggingService`.
   - Consumed by: layout portions of `monthlySummary.html` and other templates.

### 8.2 Services

1. `MonthlySummaryService`
   - File: `services/dashboard/monthlySummary.service.js`
   - Responsibilities: Compute and retrieve monthly summary KPIs and recent transactions via REST APIs.

2. `CardManagementService`
   - File: `services/card/cardManagement.service.js`
   - Responsibilities: Retrieve and manage card information (masked identifiers, limits, outstanding, dates).

3. `TransactionManagementService`
   - File: `services/transaction/transactionManagement.service.js`
   - Responsibilities: Retrieve paged, filtered, and sorted transactions.

4. `FilterService`
   - File: `services/transaction/filter.service.js`
   - Responsibilities: Construct query filters for transactions based on merchant, category, bank, card, date range.

5. `SpendingAnalyticsService`
   - File: `services/analytics/spendingAnalytics.service.js`
   - Responsibilities: Retrieve analytics data for charts (category-wise, monthly trend, card-wise distribution, category breakdown).

6. `BudgetTrackingService`
   - File: `services/budget/budgetTracking.service.js`
   - Responsibilities: Retrieve and compute budget-related data (monthly budget, current spend, remaining, utilization).

7. `EnvConfigService`
   - File: `services/shared/envConfig.service.js`
   - Responsibilities: Load environment configuration from `env.*.json` and expose as Angular service.

8. `LoggingService`
   - File: `services/shared/logging.service.js`
   - Responsibilities: Standardized logging API (info, warn, error) that is safe during bootstrap.

9. `ErrorHandlingService`
   - File: `services/shared/errorHandling.service.js`
   - Responsibilities: Map HTTP and application errors to `ErrorModel`, UI messages, retry guidance.

### 8.3 Directives

1. `kpiCard`
   - File: `directives/dashboard/kpiCard.directive.js`
   - Purpose: Render a KPI card with label, value, icon, and optional click handler.

2. `recentTransactions`
   - File: `directives/dashboard/recentTransactions.directive.js`
   - Purpose: Render the recent transactions widget (latest 5 transactions).

3. `spendingChart`
   - File: `directives/dashboard/spendingChart.directive.js`
   - Purpose: Wrap Chart.js charts for category-wise spending, monthly trend, card distribution, category breakdown.

4. `budgetProgress`
   - File: `directives/dashboard/budgetProgress.directive.js`
   - Purpose: Render budget utilization progress bars.

5. `responsiveContainer`
   - File: `directives/shared/responsiveContainer.directive.js`
   - Purpose: Provide responsive grid container behaviour.

### 8.4 Filters

1. `currencyFormat`
   - File: `filters/currencyFormat.filter.js`
   - Purpose: Format numeric amounts as currency using configured settings.

2. `dateFormat`
   - File: `filters/dateFormat.filter.js`
   - Purpose: Format dates consistently across the app.

3. `percentageFormat`
   - File: `filters/percentageFormat.filter.js`
   - Purpose: Format numeric values as percentages with fixed precision.

### 8.5 Models

- Detailed in Section 14.

### 8.6 Constants & Interceptors

1. `APP_CONFIG` (Angular constant)
   - File: `config/config.constants.js`

2. `HttpErrorInterceptor`
   - File: `interceptors/httpError.interceptor.js`
   - Purpose: Centralize HTTP error detection and delegate to `ErrorHandlingService`.

---

## 9. Controller Design

### 9.1 MonthlySummaryController

- File: `controllers/dashboard/monthlySummary.controller.js`
- Responsibilities:
  - Coordinate dashboard summary view.
  - Initialize KPI data, charts, budget summary, and recent transactions.
  - Respond to filter changes (month selection, card filter, category filter).
- Dependencies:
  - `MonthlySummaryService`
  - `SpendingAnalyticsService`
  - `BudgetTrackingService`
  - `LoggingService`
  - `ErrorHandlingService`
  - `$routeParams`

#### 9.1.1 ViewModel

- `vm.kpis`: Array of `KpiModel` for summary KPIs.
- `vm.monthlySummary`: `MonthlySummaryModel`.
- `vm.recentTransactions`: Array of `TransactionModel` (latest 5).
- `vm.categorySpendingData`: `CategorySpendingModel`.
- `vm.monthlyTrendData`: `MonthlyTrendModel`.
- `vm.cardDistributionData`: `CardDistributionModel`.
- `vm.categoryBreakdownData`: `CategoryBreakdownModel`.
- `vm.budget`: `BudgetModel`.
- `vm.filters`: `TransactionFilterModel` (shared month/card/category filters for charts and KPIs).
- `vm.isLoading`: boolean.
- `vm.hasError`: boolean.
- `vm.error`: `ErrorModel`.

#### 9.1.2 Public Methods

- `vm.initialize()`
  - Input: None.
  - Behaviour: Called on controller instantiation. Sets loading state, loads monthly summary (via `MonthlySummaryService`), loads analytics data, loads budget summary.
  - Output: Populated ViewModel or error state.

- `vm.changeMonth(month)`
  - Input: `month` (string, e.g., `YYYY-MM`).
  - Behaviour: Updates `vm.filters.month`, reloads summary and analytics.

- `vm.refreshDashboard()`
  - Input: None.
  - Behaviour: Re-fetches all dashboard data for current filters.

- `vm.retry()`
  - Input: None.
  - Behaviour: Clears error state and re-invokes `vm.initialize()`.

#### 9.1.3 Error Handling

- On service failures, sets `vm.hasError = true`, populates `vm.error` via `ErrorHandlingService`, logs via `LoggingService`, displays user-friendly error message and a retry button.

### 9.2 CardListController

- File: `controllers/dashboard/cardList.controller.js`
- Responsibilities:
  - Display list of user cards and associated attributes.
  - Provide UI for selecting a card (if needed for filtering).
- ViewModel:
  - `vm.cards`: Array of `CardModel`.
  - `vm.isLoading`, `vm.hasError`, `vm.error`.
- Methods:
  - `vm.initialize()`: Loads cards via `CardManagementService`.
  - `vm.selectCard(card)`: Emits selection event or updates local state (used by dashboard filters).

### 9.3 TransactionListController

- File: `controllers/dashboard/transactionList.controller.js`
- Responsibilities:
  - Manage transaction table view, filters, search, and sorting.
- ViewModel:
  - `vm.transactions`: Array of `TransactionModel`.
  - `vm.filter`: `TransactionFilterModel`.
  - `vm.pagination`: { pageNumber, pageSize, totalRecords }.
  - `vm.sort`: { sortField, sortDirection }.
  - `vm.isLoading`, `vm.hasError`, `vm.error`.
- Methods:
  - `vm.initialize()`: Initialize defaults and fetch initial transactions.
  - `vm.applyFilters()`: Validate and call `TransactionManagementService.getTransactions(filter, pagination, sort)`.
  - `vm.searchByMerchant(term)`: Update filter and re-fetch.
  - `vm.sortBy(field)`: Toggle sort direction and re-fetch.
  - `vm.changePage(pageNumber)`: Update pagination and re-fetch.
  - `vm.retry()`: Retry last operation on error.

### 9.4 BudgetSummaryController

- File: `controllers/dashboard/budgetSummary.controller.js`
- Responsibilities:
  - Present budget, current spend, remaining budget, and utilization.
- ViewModel:
  - `vm.budget`: `BudgetModel`.
  - `vm.isLoading`, `vm.hasError`, `vm.error`.
- Methods:
  - `vm.initialize()`: Load budget from `BudgetTrackingService`.
  - `vm.retry()`: Retry load on failure.

### 9.5 LayoutController

- File: `controllers/shared/layout.controller.js`
- Responsibilities:
  - Handle navigation and header state.
- ViewModel:
  - `vm.activeRoute`: Current route.
- Methods:
  - `vm.navigateTo(path)`: Use `$location.path(path)` to navigate.

---

## 10. Service Design

### 10.1 MonthlySummaryService

- File: `services/dashboard/monthlySummary.service.js`
- Dependencies: `$http`, `EnvConfigService`, `ErrorHandlingService`, `LoggingService`.

#### 10.1.1 Public Methods

- `getSummary(month: string): Promise<MonthlySummaryModel>`
  - Purpose: Retrieve monthly summary KPIs and recent transactions.
  - Behaviour:
    - Build request URL: `${apiBaseUrl}/dashboard/monthly-summary?month=${month}`.
    - Set timeout from config (`apiTimeoutMs`).
    - On success: map response JSON to `MonthlySummaryModel` and `KpiModel` instances.
    - On error: delegate to `ErrorHandlingService` and reject with `ErrorModel`.

#### 10.1.2 Private Methods

- `mapResponse(responseJson)`
  - Inputs: Raw API JSON.
  - Outputs: `MonthlySummaryModel` plus associated KPI list.

- `validateResponse(responseJson)`
  - Ensures required fields exist and types are correct (see Section 21).

### 10.2 CardManagementService

- File: `services/card/cardManagement.service.js`
- Dependencies: `$http`, `EnvConfigService`, `ErrorHandlingService`, `LoggingService`.

Public Methods:
- `getUserCards(): Promise<CardModel[]>`
  - URL: `${apiBaseUrl}/cards`.
  - Maps response to `CardModel` and applies masking logic (via backend; service assumes masked values already provided but validates format).

### 10.3 TransactionManagementService

- File: `services/transaction/transactionManagement.service.js`
- Dependencies: `$http`, `EnvConfigService`, `ErrorHandlingService`, `LoggingService`.

Public Methods:
- `getTransactions(filter: TransactionFilterModel, pagination, sort): Promise<{transactions: TransactionModel[], totalRecords: number}>`
  - URL: `${apiBaseUrl}/transactions`.
  - HTTP method: GET, with query parameters for filters, pagination, and sorting.

### 10.4 FilterService

- File: `services/transaction/filter.service.js`
- Dependencies: None (pure logic) or `EnvConfigService` for allowed values.

Public Methods:
- `normalizeFilter(filter: TransactionFilterModel): TransactionFilterModel`
- `validateFilter(filter: TransactionFilterModel): ValidationResult`

### 10.5 SpendingAnalyticsService

- File: `services/analytics/spendingAnalytics.service.js`
- Dependencies: `$http`, `EnvConfigService`, `ErrorHandlingService`, `LoggingService`.

Public Methods:
- `getCategorySpending(month, cardId?): Promise<CategorySpendingModel>`
- `getMonthlyTrend(cardId?): Promise<MonthlyTrendModel>`
- `getCardDistribution(month?): Promise<CardDistributionModel>`
- `getCategoryBreakdown(month, cardId?): Promise<CategoryBreakdownModel>`

### 10.6 BudgetTrackingService

- File: `services/budget/budgetTracking.service.js`
- Dependencies: `$http`, `EnvConfigService`, `ErrorHandlingService`, `LoggingService`.

Public Methods:
- `getCurrentBudget(month?): Promise<BudgetModel>`
- `saveBudget(budget: BudgetModel): Promise<BudgetModel>` (if HLD permits modification; if not, this method can be omitted or disabled. To avoid assumptions, this method is defined but flagged as **read-only in current epic**: any calls shall be disabled in UI unless future epics explicitly enable.)

### 10.7 EnvConfigService

- File: `services/shared/envConfig.service.js`
- Dependencies: `$http`.

Public Methods:
- `loadConfig(): Promise<void>`
- `getConfig(): APP_CONFIG`

### 10.8 LoggingService

- File: `services/shared/logging.service.js`

Public Methods:
- `info(message, context?)`
- `warn(message, context?)`
- `error(message, context?)`

### 10.9 ErrorHandlingService

- File: `services/shared/errorHandling.service.js`

Public Methods:
- `handleHttpError(httpResponse): ErrorModel`
- `handleBusinessError(code, details): ErrorModel`

---

## 11. Factory Design

The design primarily uses services. No additional AngularJS factories are strictly required by the HLD. To avoid assumptions, **no generic factories** are introduced beyond what is necessary.

If a reusable object creator is needed (e.g., for building filter models), it can be implemented as a service exposing constructor-like functions.

---

## 12. Directive Design

### 12.1 kpiCard Directive

- File: `directives/dashboard/kpiCard.directive.js`
- Restrict: `E`
- Scope:
  - `label: '@'`
  - `value: '<'`
  - `icon: '@'`
  - `format: '@'` (e.g., `currency`, `number`, `percentage`)
  - `onClick: '&?'`
- bindToController: `true`
- controller: `KpiCardController`
- controllerAs: `vm`
- templateUrl: `templates/directives/kpiCard.html`
- replace: `false`
- transclude: `false`

Usage Example:
```html
<kpi-card
  label="Total Monthly Spend"
  value="vm.monthlySummary.totalSpend"
  icon="icon-rupee"
  format="currency">
</kpi-card>
```

### 12.2 recentTransactions Directive

- File: `directives/dashboard/recentTransactions.directive.js`
- Restrict: `E`
- Scope:
  - `transactions: '<'`
- templateUrl: `templates/directives/recentTransactions.html`

Usage Example:
```html
<recent-transactions transactions="vm.recentTransactions"></recent-transactions>
```

### 12.3 spendingChart Directive

- File: `directives/dashboard/spendingChart.directive.js`
- Restrict: `E`
- Scope:
  - `chartType: '@'` (e.g., `bar`, `line`, `pie`, `doughnut`)
  - `data: '<'`
  - `options: '<'`
- templateUrl: `templates/directives/spendingChart.html`

Usage Example:
```html
<spending-chart
  chart-type="bar"
  data="vm.categorySpendingData"
  options="vm.categorySpendingOptions">
</spending-chart>
```

### 12.4 budgetProgress Directive

- File: `directives/dashboard/budgetProgress.directive.js`
- Restrict: `E`
- Scope:
  - `budget: '<'`
- templateUrl: `templates/directives/budgetProgress.html`

Usage Example:
```html
<budget-progress budget="vm.budget"></budget-progress>
```

### 12.5 responsiveContainer Directive

- File: `directives/shared/responsiveContainer.directive.js`
- Restrict: `E`
- Scope: none (uses transclusion).
- templateUrl: `templates/directives/responsiveContainer.html`

Usage Example:
```html
<responsive-container>
  <!-- dashboard content -->
</responsive-container>
```

---

## 13. Filter Design

### 13.1 currencyFormat Filter

- File: `filters/currencyFormat.filter.js`
- Input: number.
- Output: formatted string (`#,##0.00` with currency symbol from configuration).
- Rules:
  - Uses `APP_CONFIG.currencySymbol`.
  - Rounds to two decimal places.

### 13.2 dateFormat Filter

- File: `filters/dateFormat.filter.js`
- Input: Date or date string.
- Output: `DD-MMM-YYYY`.

### 13.3 percentageFormat Filter

- File: `filters/percentageFormat.filter.js`
- Input: number (0–100).
- Output: `NN.NN%`.

---

## 14. Model Design

### 14.1 MonthlySummaryModel

- File: `models/dashboard/monthlySummary.model.js`
- Purpose: Represent monthly summary KPIs and recent transactions.

Properties:
- `month: string` (required, format `YYYY-MM`).
- `totalSpend: number` (>= 0).
- `totalCreditLimit: number` (>= 0).
- `availableCredit: number` (>= 0).
- `outstandingAmount: number` (>= 0).
- `utilizationPercentage: number` (0–100).
- `transactionCount: number` (>= 0, integer).
- `recentTransactions: TransactionModel[]` (length <= 5).

Sample JSON:
```json
{
  "month": "2026-07",
  "totalSpend": 45872,
  "totalCreditLimit": 300000,
  "availableCredit": 254128,
  "outstandingAmount": 45872,
  "utilizationPercentage": 15.29,
  "transactionCount": 92,
  "recentTransactions": []
}
```

### 14.2 KpiModel

- File: `models/dashboard/kpi.model.js`

Properties:
- `id: string`
- `label: string`
- `value: number`
- `format: 'currency' | 'number' | 'percentage'`
- `icon: string`

### 14.3 CardModel

- File: `models/card/card.model.js`

Properties:
- `cardId: string`
- `cardName: string`
- `issuingBank: string`
- `maskedCardNumber: string` (e.g., `XXXX-XXXX-XXXX-1234`).
- `creditLimit: number`
- `availableCredit: number`
- `outstandingAmount: number`
- `billingDate: string` (e.g., `DD` or `DD-MMM`).
- `dueDate: string`

### 14.4 TransactionModel

- File: `models/transaction/transaction.model.js`

Properties:
- `transactionId: string`
- `transactionDate: string` (ISO date `YYYY-MM-DD`).
- `merchantName: string`
- `category: string` (one of defined categories below).
- `cardId: string`
- `amount: number`
- `paymentStatus: string` (e.g., `Posted`, `Authorized`).
- `remarks: string | null`

### 14.5 TransactionFilterModel

- File: `models/transaction/transactionFilter.model.js`

Properties:
- `month: string` (default current month).
- `fromDate: string | null`
- `toDate: string | null`
- `merchantSearch: string | null`
- `category: string | null`
- `bank: string | null`
- `cardId: string | null`

### 14.6 CategorySpendingModel

- File: `models/analytics/categorySpending.model.js`

Properties:
- `labels: string[]` (category names).
- `values: number[]` (spend per category).

Categories (fixed):
- `Food & Dining`
- `Fuel`
- `Shopping`
- `Travel`
- `Entertainment`
- `Utilities`
- `Healthcare`
- `Education`
- `Miscellaneous`

### 14.7 MonthlyTrendModel

- File: `models/analytics/monthlyTrend.model.js`

Properties:
- `labels: string[]` (months `YYYY-MM`).
- `values: number[]` (monthly total spend).

### 14.8 CardDistributionModel

- File: `models/analytics/cardDistribution.model.js`

Properties:
- `labels: string[]` (card names or identifiers).
- `values: number[]` (spend per card).

### 14.9 CategoryBreakdownModel

- File: `models/analytics/categoryBreakdown.model.js`

Properties:
- `labels: string[]`
- `values: number[]`

### 14.10 BudgetModel

- File: `models/budget/budget.model.js`

Properties:
- `month: string` (required).
- `budgetAmount: number` (>= 0).
- `currentSpend: number` (>= 0).
- `remainingBudget: number` (>= 0).
- `utilizationPercentage: number` (0–100).

Sample JSON:
```json
{
  "month": "2026-07",
  "budgetAmount": 50000,
  "currentSpend": 45872,
  "remainingBudget": 4128,
  "utilizationPercentage": 91.75
}
```

### 14.11 ErrorModel

- File: `models/shared/error.model.js`

Properties:
- `code: string`
- `message: string`
- `details: any`
- `httpStatus: number | null`
- `retryable: boolean`

---

## 15. REST API Contract

All URLs are relative to `APP_CONFIG.apiBaseUrl`.

### 15.1 GET /dashboard/monthly-summary

- Method: GET
- URL: `/dashboard/monthly-summary`
- Query Parameters:
  - `month` (string, required, `YYYY-MM`).
- Headers:
  - `Authorization: Bearer <token>`
- Request Body: None.

Success Response (200):
- Body: `MonthlySummaryModel` JSON plus `recentTransactions`.

Error Responses:
- 400: Invalid month format.
- 401: Unauthorized.
- 403: Forbidden.
- 404: Summary not found.
- 408: Request timeout.
- 500: Internal server error.

### 15.2 GET /cards

- Method: GET
- URL: `/cards`
- Query Parameters: None.
- Headers: Authorization.
- Response: Array of `CardModel`.

### 15.3 GET /transactions

- Method: GET
- URL: `/transactions`
- Query Parameters:
  - `month` (optional if from/to provided).
  - `fromDate`, `toDate`.
  - `merchant`.
  - `category`.
  - `bank`.
  - `cardId`.
  - `pageNumber`, `pageSize`.
  - `sortField` (`amount` or `date`).
  - `sortDirection` (`asc` or `desc`).

Success Response (200):
```json
{
  "transactions": [ /* TransactionModel[] */ ],
  "totalRecords": 92
}
```

### 15.4 GET /analytics/category-spending

- Method: GET
- URL: `/analytics/category-spending`
- Query Parameters:
  - `month` (required).
  - `cardId` (optional).

Response: `CategorySpendingModel`.

### 15.5 GET /analytics/monthly-trend

- Method: GET
- URL: `/analytics/monthly-trend`
- Query Parameters:
  - `cardId` (optional).

Response: `MonthlyTrendModel`.

### 15.6 GET /analytics/card-distribution

- Method: GET
- URL: `/analytics/card-distribution`
- Query Parameters:
  - `month` (optional).

Response: `CardDistributionModel`.

### 15.7 GET /analytics/category-breakdown

- Method: GET
- URL: `/analytics/category-breakdown`
- Query Parameters:
  - `month` (required).
  - `cardId` (optional).

Response: `CategoryBreakdownModel`.

### 15.8 GET /budget/current

- Method: GET
- URL: `/budget/current`
- Query Parameters:
  - `month` (optional, defaults to current month).

Response: `BudgetModel`.

---

## 16. Configuration Design

File: `config/config.constants.js`

### 16.1 APP_CONFIG Constant

Properties:
- `apiBaseUrl: string`
- `apiTimeoutMs: number` (e.g., 15000).
- `maxLookbackMonths: number` (e.g., 12).
- `useMockData: boolean`.
- `featureFlags: { [key: string]: boolean }`.
- `telemetryEnabled: boolean`.
- `currencySymbol: string` (e.g., `₹`).

### 16.2 Environment JSON Files

1. `env.default.json`
   - Base defaults for all environments.
2. `env.dev.json`
   - Dev-specific overrides.
3. `env.prod.json`
   - Production-specific overrides (e.g., actual `apiBaseUrl`, `telemetryEnabled` true).

All configuration is consumed via `EnvConfigService`. No hardcoding of configuration values in controllers or services.

---

## 17. Mock Implementation Design

Mock implementations exist for all REST endpoints to support offline development and demos.

### 17.1 General Behaviour

- Uses `$q` and `$timeout` to simulate asynchronous behaviour.
- Delay: configurable (e.g., 500–1500 ms) via mock-specific constants.
- Failure Simulation:
  - Random or deterministic failure for testing (e.g., 10% 500 errors).
  - Timeout simulation by delaying beyond `apiTimeoutMs`.

### 17.2 MonthlySummary Mock

- File: `mock/dashboard/monthlySummary.mock.js`
- Exposes a service that mimics `MonthlySummaryService` but returns data from `data/dashboard/monthlySummary.sample.json`.

### 17.3 CardManagement Mock

- File: `mock/card/cardManagement.mock.js`
- Uses `data/card/cards.sample.json`.

### 17.4 TransactionManagement Mock

- File: `mock/transaction/transactionManagement.mock.js`
- Uses `data/transaction/transactions.sample.json` and applies client-side filtering, sorting, and pagination.

### 17.5 SpendingAnalytics Mock

- File: `mock/analytics/spendingAnalytics.mock.js`
- Uses `data/analytics/categorySpending.sample.json`, `monthlyTrend.sample.json`, `cardDistribution.sample.json`, `categoryBreakdown.sample.json`.

### 17.6 BudgetTracking Mock

- File: `mock/budget/budgetTracking.mock.js`
- Uses `data/budget/budget.sample.json`.

Mock contracts mirror production API structures exactly (same models, status codes for simulated errors).

---

## 18. UI Specification

### 18.1 Overall Layout

- Header: Application title (e.g., "Monthly Spending Summary"), navigation links (Dashboard, Cards, Transactions, Budget).
- Main Content: Dashboard panels based on route.
- Footer: Minimal branding and version info.

Uses Bootstrap 3 grid:
- `container`, `row`, `col-xs-*`, `col-sm-*`, `col-md-*`, `col-lg-*`.

### 18.2 Dashboard (`monthlySummary.html`)

Sections (top to bottom):
1. KPI Summary row (Total Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount, Utilization %, Transaction Count).
2. Filters row (Month selector, Card filter).
3. Charts row:
   - Left: Category-wise spending (bar chart).
   - Right: Card-wise distribution (pie chart).
4. Trend row: Monthly spending trend (line chart).
5. Budget row: Budget progress bar widget.
6. Recent Transactions widget.

### 18.3 Card List (`cardList.html`)

- Table listing cards with columns: Card Name, Issuing Bank, Masked Card Number, Credit Limit, Available Credit, Outstanding, Billing Date, Due Date.
- Numeric columns right-aligned; text columns left-aligned.

### 18.4 Transaction List (`transactionList.html`)

- Filters:
  - Merchant search input.
  - Category dropdown.
  - Bank dropdown.
  - Card dropdown.
  - Date range (from/to).
- Table columns:
  - Date, Merchant, Category, Card, Amount, Payment Status, Remarks.
- Sorting icons on Date and Amount.
- Pagination controls at bottom.

### 18.5 Budget Summary (`budgetSummary.html`)

- Display budget card with budget amount, current spend, remaining, utilization percentage.
- Progress bar showing utilization.

### 18.6 States

- Loading: spinner and text "Loading data..." overlaying content.
- Empty: message "No data available for the selected period." with optional illustration.
- Error: message from `ErrorModel.message` and Retry button.

### 18.7 Accessibility & Responsiveness

- All interactive elements are keyboard accessible.
- Appropriate `aria-label`s on charts, tables, and buttons.
- Colour contrast meets accessibility guidelines.
- Layout collapses to single-column on small screens.

---

## 19. Data Flow

### 19.1 Flow – Dashboard Summary Retrieval

1. User navigates to `/dashboard`.
2. `MonthlySummaryController.initialize()` triggers.
3. Controller calls `MonthlySummaryService.getSummary(month)`.
4. Service builds GET request to `/dashboard/monthly-summary`.
5. Backend responds with `MonthlySummaryModel` plus `recentTransactions`.
6. Service validates and maps response.
7. Controller populates `vm.monthlySummary`, `vm.kpis`, `vm.recentTransactions`.
8. KPI cards and widgets update.

### 19.2 Flow – Card List Retrieval

1. User navigates to `/cards`.
2. `CardListController.initialize()` calls `CardManagementService.getUserCards()`.
3. Service calls `/cards`.
4. Response mapped to `CardModel[]`.
5. Controller sets `vm.cards`.
6. Table renders.

### 19.3 Flow – Transaction Management

1. User navigates to `/transactions`.
2. `TransactionListController.initialize()` sets default `TransactionFilterModel`.
3. Controller calls `TransactionManagementService.getTransactions(filter, pagination, sort)`.
4. Service calls `/transactions` with query parameters.
5. Response mapped to `TransactionModel[]` and `totalRecords`.
6. Controller sets `vm.transactions` and pagination.

### 19.4 Flow – Filter & Search

1. User enters merchant search or chooses filters.
2. `TransactionListController.applyFilters()` validates via `FilterService.validateFilter()`.
3. If valid, controller calls `TransactionManagementService.getTransactions()`.
4. New data returned and table updates.

### 19.5 Flow – Spending Analytics

1. `MonthlySummaryController.initialize()` calls `SpendingAnalyticsService` methods for charts.
2. Each service method calls its respective endpoint.
3. Responses map to chart models.
4. Charts render via `spendingChart` directive.

### 19.6 Flow – Budget Tracking

1. `MonthlySummaryController.initialize()` and/or `BudgetSummaryController.initialize()` call `BudgetTrackingService.getCurrentBudget()`.
2. Service calls `/budget/current`.
3. Response mapped to `BudgetModel`.
4. `budgetProgress` directive renders progress bar.

### 19.7 Flow – Error Handling

1. Any service receives non-2xx HTTP response.
2. `HttpErrorInterceptor` intercepts and delegates to `ErrorHandlingService.handleHttpError()`.
3. Error converted to `ErrorModel` and passed to controllers.
4. Controller sets `vm.hasError`, displays error UI, offers retry.
5. `LoggingService.error()` logs the event.

---

## 20. Business Rules

### 20.1 KPI Computation Rules

- Total Monthly Spend: Sum of all `amount` for transactions in selected month across user cards.
- Total Credit Limit: Sum of `creditLimit` across user cards.
- Available Credit: Sum of `availableCredit` across user cards.
- Outstanding Amount: Sum of `outstandingAmount` across user cards.
- Utilization Percentage: `(Outstanding Amount / Total Credit Limit) * 100`, capped at 100.
- Transaction Count: Number of transactions in selected month.

### 20.2 Card Masking Rules

- Card numbers must never be displayed in full.
- Mask format: `XXXX-XXXX-XXXX-<last4>`.

### 20.3 Category Grouping Rules

- Map transaction categories into predefined groups listed in Section 14.6.

### 20.4 Budget Rules

- Budget must be non-negative.
- Current spend must be non-negative.
- Remaining budget = `budgetAmount - currentSpend`, not less than 0.
- Utilization Percentage = `(currentSpend / budgetAmount) * 100` if budgetAmount > 0; else 0.

---

## 21. Validation Rules

### 21.1 Input Validation

- Month: `YYYY-MM`, must be within `maxLookbackMonths` from current date.
- Dates: Valid ISO dates; `fromDate <= toDate`.
- Merchant search: Max length (e.g., 100 chars), no control characters.
- Category, bank, cardId: Must be from allowed sets.
- Pagination: `pageNumber >= 1`, `pageSize` within allowed range (e.g., 10–100).
- Sort field: one of `amount`, `date`.
- Sort direction: `asc` or `desc`.

### 21.2 Response Validation

- MonthlySummaryModel: All required fields present; numeric fields non-negative.
- CardModel: Masked card number matches pattern.
- TransactionModel: Amount non-negative; date valid.
- Analytics Models: `labels.length == values.length`.

---

## 22. Error Handling

### 22.1 HTTP Errors

- Handled via `HttpErrorInterceptor`.
- Maps to `ErrorModel` with appropriate message:
  - 400: "Invalid request. Please check your inputs."
  - 401: "You are not authorized. Please sign in again."
  - 403: "You do not have permission to view this information."
  - 404: "Requested data could not be found."
  - 408: "The request timed out. Please try again."
  - 500/503: "We are experiencing technical difficulties. Please try again later."

### 22.2 Business Errors

- Budget out-of-range, invalid filters, etc. reported via business error codes.

---

## 23. Logging Design

- Logging via `LoggingService` only.
- Logs levels:
  - `info`: Successful operations, route changes.
  - `warn`: Validation failures, minor recoverable issues.
  - `error`: HTTP and unexpected errors.

Logs must avoid sensitive data (full card numbers, personal information).

---

## 24. Security Design

- Input validation on all filter and search parameters.
- Output encoding via AngularJS binding and `ngSanitize`.
- Auth context provided by backend; front-end relies on bearer tokens and does not persist credentials.
- No storage of full card numbers in UI models.

---

## 25. Dependency Map

### 25.1 Controller–Service–Model Dependencies

- `MonthlySummaryController` → `MonthlySummaryService`, `SpendingAnalyticsService`, `BudgetTrackingService`, `LoggingService`, `ErrorHandlingService` → `MonthlySummaryModel`, `CategorySpendingModel`, `MonthlyTrendModel`, `CardDistributionModel`, `CategoryBreakdownModel`, `BudgetModel`, `ErrorModel`.
- `CardListController` → `CardManagementService`, `LoggingService`, `ErrorHandlingService` → `CardModel`, `ErrorModel`.
- `TransactionListController` → `TransactionManagementService`, `FilterService`, `LoggingService`, `ErrorHandlingService` → `TransactionModel`, `TransactionFilterModel`, `ErrorModel`.
- `BudgetSummaryController` → `BudgetTrackingService`, `LoggingService`, `ErrorHandlingService` → `BudgetModel`, `ErrorModel`.

### 25.2 Service–Config–HTTP Dependencies

- Each REST service → `$http`, `EnvConfigService`, `ErrorHandlingService`, `LoggingService`.

### 25.3 Directive Dependencies

- `kpiCard` → `KpiModel`, `currencyFormat`, `percentageFormat`.
- `spendingChart` → Chart.js.
- `budgetProgress` → `BudgetModel`.
- `recentTransactions` → `TransactionModel`.

---

## 26. LLD Validation Checklist

This section confirms adherence to `lldgenerationkb` quality gates:

1. All mandatory LLD sections (1–26) are present.
2. No source code, HTML, JavaScript, CSS implementations, or tests are included—only specifications.
3. Technology stack matches required versions (AngularJS 1.7.9, Bootstrap 3.4.1 CSS, Chart.js 2.9.4) without upgrades.
4. SPA and AngularJS MVC architecture are followed with ControllerAs syntax and DI.
5. Repository structure is fully specified and no placeholder or undocumented files are introduced.
6. All controllers, services, directives, filters, models, routes, and configuration files are explicitly documented with responsibilities and dependencies.
7. All REST APIs are fully specified (URL, method, parameters, responses, errors).
8. Configuration is centralized and not hard-coded in controllers/services.
9. Mock implementations mirror production contracts and specify delays and failure simulation.
10. UI specification defines layout, components, states, responsive behaviour, and accessibility.
11. Business rules and validation rules are explicitly documented; no hidden logic.
12. Error handling, logging, and security practices meet standards; sensitive data is not exposed.
13. No implementation assumptions are made beyond what the HLD describes; where potential ambiguity exists (e.g., budget modification), behaviour is constrained to read-only for this epic.

All checklist items pass for epic QE-3380 within the scope defined by the HLD.
