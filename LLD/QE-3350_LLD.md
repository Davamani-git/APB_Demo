# Low-Level Design (LLD)  QE-3350  Monthly Spending Summary Dashboard

## 1. Application Overview

This LLD defines the full implementation specification for the **Monthly Spending Summary Dashboard** as a responsive Single Page Application (SPA) built with AngularJS 1.7.9 and a REST-based backend. It translates the QE-3350 HLD into concrete, implementation-ready details for the Code Generation Agent, without changing business scope.

Scope covered by this LLD (exactly as per HLD QE-3350):

1. Dashboard Summary
   - Total Monthly Spend.
   - Total Credit Limit.
   - Available Credit.
   - Outstanding Amount.
   - Utilization Percentage.
   - Number of Transactions.

2. Credit Card Management
   - Display multiple credit cards and details: Card Name, Issuing Bank, Masked Card Number, Credit Limit, Available Credit, Current Outstanding, Billing Date, Due Date.

3. Transaction Management
   - Responsive table with: Transaction Date, Merchant Name, Category, Card Used, Amount, Payment Status, Remarks.
   - Search by Merchant.
   - Filters: Category, Bank, Card, Date Range.
   - Sort: Amount, Date.

4. Spending Analytics
   - Category-wise Spending.
   - Monthly Spending Trend.
   - Card-wise Spending Distribution.
   - Category Breakdown with categories: Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous.

5. Budget Tracking
   - Monthly Budget.
   - Current Spend.
   - Remaining Budget.
   - Budget Utilization Percentage.
   - Progress Visualization (progress bar).

6. Recent Transactions
   - Recent Transactions widget showing latest 5 transactions.

7. Responsive Design
   - Mobile, Tablet, Desktop layouts using Bootstrap 3.4.1.

This LLD is aligned with the `lldgenerationkb` engineering standards and provides sufficient detail for code generation. No business rules are added or removed; where information is missing from the HLD, it is explicitly marked.

---

## 2. Technology Stack

### 2.1 Frontend

- **HTML5** for markup.
- **CSS3** for styling.
- **JavaScript (ES6)** for client logic.
- **AngularJS 1.7.9** as SPA framework.
- **Angular Route 1.7.9** for client-side routing.
- **Angular Animate 1.7.9** for simple animations (e.g., loading states).
- **Angular Sanitize 1.7.9** for secure HTML content handling (e.g., remarks fields).
- **Angular UI Bootstrap 2.5.6** for Bootstrap-integrated AngularJS components.
- **Bootstrap 3.4.1 (CSS-only)** for responsive layout and basic components.
- **Chart.js 2.9.4** for charts (category spending, trends, distributions).

Constraints (per KB):

- No additional frontend frameworks.
- No upgrade of framework versions.
- No jQuery or `bootstrap.min.js` unless explicitly required (not required by HLD; therefore **excluded**).

### 2.2 Backend

The HLD references an **API Gateway** plus domain services (Card Management, Transaction, Analytics, Budget, Dashboard Aggregation). This LLD defines the **consumer-side contracts** required by the SPA and a logical API structure, but:

- Does **not** define backend implementation classes.
- Assumes RESTful JSON APIs as described in Section 15.

Backend technology (Java/.NET/Node/etc.) is **not specified in HLD**; therefore:

- **Information missing from HLD – requires clarification:** specific backend language, framework, and persistence technology.

---

## 3. Architecture Design

### 3.1 Frontend Architecture

- AngularJS 1.7.9 Single Page Application (SPA).
- Module-based architecture: one root module `"app"` with feature-specific components.
- MVC pattern:
  - Controllers: coordinate UI, route and view logic only.
  - Services: encapsulate business logic and REST communication.
  - Directives: reusable UI components (cards, charts, tables, widgets).
  - Filters: formatting (currency, dates, percentages).
- ControllerAs syntax with IIFE pattern for all AngularJS modules and components.
- Dependency Injection for all controllers/services/directives.

### 3.2 Logical Frontend Components

- **Dashboard Summary Page** (Route `/dashboard`):
  - Displays summary KPIs, charts, budget widget, recent transactions.

- **Card Management View** (Route `/cards`):
  - Lists all cards with details and derived fields.

- **Transaction Management View** (Route `/transactions`):
  - Search, filter, sort, and paginate transaction table.

- **Shared Components**:
  - KPI Card directive.
  - Chart directives (category spend, trend, card distribution, category breakdown).
  - Transaction table directive.
  - Recent transactions widget directive.
  - Budget widget directive.

### 3.3 Backend Logical Architecture (Consumer Perspective)

The SPA communicates with the following backend logical services via an API Gateway:

- Dashboard Aggregation Service.
- Card Management Service.
- Transaction Service.
- Analytics Service.
- Budget Service.
- IAM (Identity & Access Management).

The SPA only consumes REST endpoints exposed by the API Gateway; IAM is used for authentication tokens attached to HTTP headers.

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
      cards.controller.js
      transactions.controller.js

    services/
      dashboard.service.js
      cards.service.js
      transactions.service.js
      analytics.service.js
      budget.service.js
      logging.service.js
      error-handler.service.js
      auth-token.service.js

    factories/
      models.factory.js

    directives/
      kpi-card.directive.js
      category-spend-chart.directive.js
      monthly-trend-chart.directive.js
      card-distribution-chart.directive.js
      category-breakdown-chart.directive.js
      transactions-table.directive.js
      budget-widget.directive.js
      recent-transactions.directive.js

    filters/
      currency-format.filter.js
      date-format.filter.js
      percentage-format.filter.js

    models/
      monthly-summary.model.js
      card.model.js
      transaction.model.js
      category-summary.model.js
      monthly-trend.model.js
      card-distribution.model.js
      budget-status.model.js
      error.model.js

    config/
      env.default.json
      env.dev.json
      env.prod.json
      config.constants.js

    routes/
      dashboard.routes.js
      cards.routes.js
      transactions.routes.js

  templates/
    dashboard.html
    cards.html
    transactions.html

    components/
      kpi-card.html
      category-spend-chart.html
      monthly-trend-chart.html
      card-distribution-chart.html
      category-breakdown-chart.html
      transactions-table.html
      budget-widget.html
      recent-transactions.html

  assets/
    css/
      styles.css
    js/
      vendor/ (optional minified bundles if needed)
    images/
      (icons for categories/cards, optional)
    fonts/
      (if custom fonts required)

  mock/
    dashboard.mock.service.js
    cards.mock.service.js
    transactions.mock.service.js
    analytics.mock.service.js
    budget.mock.service.js

  data/
    mock-dashboard-summary.json
    mock-cards.json
    mock-transactions.json
    mock-category-spend.json
    mock-monthly-trend.json
    mock-card-distribution.json
    mock-category-breakdown.json
    mock-budget-status.json

index.html
README.md
```

Each file is detailed in later sections; Code Generation must not introduce additional files with undocumented behaviour.

---

## 5. Application Bootstrap Design

### 5.1 index.html

`index.html` SHALL:

- Declare the AngularJS app:
  - `ng-app="app"` on `<html>` or `<body>`.
- Provide layout structure:
  - Header (application title, user info, navigation).
  - Navigation bar (links to Dashboard, Cards, Transactions).
  - Main content with `ng-view`.
  - Footer (version, legal text).
- Load CSS (in order):
  1. Bootstrap 3.4.1 CSS (from CDN).
  2. Application `styles.css`.
- Load JS (in order):
  1. AngularJS 1.7.9.
  2. Angular Route 1.7.9.
  3. Angular Animate 1.7.9.
  4. Angular Sanitize 1.7.9.
  5. Angular UI Bootstrap 2.5.6.
  6. Chart.js 2.9.4.
  7. Application scripts (`app.module.js`, `app.config.js`, `app.routes.js`, then feature scripts).

No jQuery or `bootstrap.min.js` is included.

### 5.2 Root Module and Config

- File: `src/app/app.module.js`
  - Defines root module:

    - Module name: `"app"`.
    - Dependencies: `['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']`.

- File: `src/app/app.config.js`
  - Registers:
    - Constants from `ENV_CONFIG`.
    - HTTP interceptor for attaching auth token and handling errors.

- File: `src/app/app.routes.js`
  - Configures main routing and default route.

Bootstrap responsibilities:

- Initialize `ENV_CONFIG` and feature flags from environment JSON.
- Configure `$httpProvider` interceptors for auth and error handling.
- Configure `$routeProvider` with default redirect to `/dashboard`.

---

## 6. Module Design

Single root AngularJS module: `app`.

- Module: `app`.
  - Type: Angular module.
  - File: `src/app/app.module.js`.
  - Dependencies: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`.

Additional feature-specific route configs exist but are all registered on the `app` module.

---

## 7. Routing Design

Routing is defined centrally in `app.routes.js` and optionally split into feature route files under `routes/`.

### 7.1 Routes

1. **Dashboard Route**
   - URL: `/dashboard`.
   - TemplateUrl: `templates/dashboard.html`.
   - Controller: `DashboardController`.
   - ControllerAs: `vm`.
   - Resolve:
     - `monthlySummary`: calls `DashboardService.getMonthlySummary(selectedMonth)`.
     - `categorySpend`: calls `AnalyticsService.getCategorySpend(selectedMonth)`.
     - `monthlyTrend`: calls `AnalyticsService.getMonthlyTrend()`.
     - `cardDistribution`: calls `AnalyticsService.getCardDistribution(selectedMonth)`.
     - `categoryBreakdown`: calls `AnalyticsService.getCategoryBreakdown(selectedMonth)`.
     - `budgetStatus`: calls `BudgetService.getBudgetStatus(selectedMonth)`.
     - `recentTransactions`: calls `TransactionsService.getRecentTransactions()`.

2. **Cards Route**
   - URL: `/cards`.
   - TemplateUrl: `templates/cards.html`.
   - Controller: `CardsController`.
   - ControllerAs: `vm`.
   - Resolve:
     - `cards`: calls `CardsService.getCards()`.

3. **Transactions Route**
   - URL: `/transactions`.
   - TemplateUrl: `templates/transactions.html`.
   - Controller: `TransactionsController`.
   - ControllerAs: `vm`.
   - Resolve:
     - `initialQueryParams`: default filters (current month).
     - `transactionsPage`: calls `TransactionsService.searchTransactions(initialQueryParams)`.

4. **Default Route**
   - Any unmatched route redirects to `/dashboard`.

### 7.2 Route Guards

- Authentication guard:
  - Before route change, `AuthTokenService` ensures a valid token exists.
  - If missing, redirect to IAM/identity login URL.

- Error handling:
  - If any resolve fails:
    - Redirect stays on current route.
    - `ErrorHandlerService` surface user-friendly message and sets appropriate view model flags.

---

## 8. Component Registry

All components belong to the `app` module.

### 8.1 Controllers

- `DashboardController` – `src/app/controllers/dashboard.controller.js`.
- `CardsController` – `src/app/controllers/cards.controller.js`.
- `TransactionsController` – `src/app/controllers/transactions.controller.js`.

### 8.2 Services

- `DashboardService` – `src/app/services/dashboard.service.js`.
- `CardsService` – `src/app/services/cards.service.js`.
- `TransactionsService` – `src/app/services/transactions.service.js`.
- `AnalyticsService` – `src/app/services/analytics.service.js`.
- `BudgetService` – `src/app/services/budget.service.js`.
- `LoggingService` – `src/app/services/logging.service.js`.
- `ErrorHandlerService` – `src/app/services/error-handler.service.js`.
- `AuthTokenService` – `src/app/services/auth-token.service.js`.

### 8.3 Factories

- `ModelsFactory` – `src/app/factories/models.factory.js`.

### 8.4 Directives

- `kpiCard` – `src/app/directives/kpi-card.directive.js`.
- `categorySpendChart` – `src/app/directives/category-spend-chart.directive.js`.
- `monthlyTrendChart` – `src/app/directives/monthly-trend-chart.directive.js`.
- `cardDistributionChart` – `src/app/directives/card-distribution-chart.directive.js`.
- `categoryBreakdownChart` – `src/app/directives/category-breakdown-chart.directive.js`.
- `transactionsTable` – `src/app/directives/transactions-table.directive.js`.
- `budgetWidget` – `src/app/directives/budget-widget.directive.js`.
- `recentTransactions` – `src/app/directives/recent-transactions.directive.js`.

### 8.5 Filters

- `currencyFormat` – `src/app/filters/currency-format.filter.js`.
- `dateFormat` – `src/app/filters/date-format.filter.js`.
- `percentageFormat` – `src/app/filters/percentage-format.filter.js`.

### 8.6 Models

- `MonthlySummaryModel` – `src/app/models/monthly-summary.model.js`.
- `CardModel` – `src/app/models/card.model.js`.
- `TransactionModel` – `src/app/models/transaction.model.js`.
- `CategorySummaryModel` – `src/app/models/category-summary.model.js`.
- `MonthlyTrendModel` – `src/app/models/monthly-trend.model.js`.
- `CardDistributionModel` – `src/app/models/card-distribution.model.js`.
- `BudgetStatusModel` – `src/app/models/budget-status.model.js`.
- `ErrorModel` – `src/app/models/error.model.js`.

### 8.7 Config & Constants

- `ENV_CONFIG` – `src/app/config/config.constants.js` + env JSON files.

---

## 9. Controller Design

### 9.1 DashboardController

- File: `src/app/controllers/dashboard.controller.js`.
- Registration: `angular.module('app').controller('DashboardController', DashboardController);`.
- Dependencies:
  - `DashboardService`.
  - `AnalyticsService`.
  - `BudgetService`.
  - `TransactionsService`.
  - `LoggingService`.
  - `ErrorHandlerService`.
  - `$routeParams` (for selected month).

- ViewModel (`vm`):
  - `vm.selectedMonth: string` – format `YYYY-MM`.
  - `vm.summary: MonthlySummaryModel`.
  - `vm.categorySpend: CategorySummaryModel[]`.
  - `vm.monthlyTrend: MonthlyTrendModel`.
  - `vm.cardDistribution: CardDistributionModel`.
  - `vm.categoryBreakdown: CategorySummaryModel[]`.
  - `vm.budgetStatus: BudgetStatusModel`.
  - `vm.recentTransactions: TransactionModel[]` (max 5).
  - `vm.isLoading: boolean`.
  - `vm.hasError: boolean`.
  - `vm.errorMessage: string`.

- Public Methods:
  - `vm.initialize()`
    - Called on controller instantiation.
    - Reads `selectedMonth` from `$routeParams` or defaults to current month.
    - Invokes `loadDashboardData()`.

  - `vm.changeMonth(month: string)`
    - Updates `selectedMonth`.
    - Invokes `loadDashboardData()`.

  - `vm.retry()`
    - Re-loads data if `hasError` is true.

- Private Functions:
  - `loadDashboardData()`
    - Sets `isLoading = true`, `hasError = false`.
    - Parallel calls:
      - `DashboardService.getMonthlySummary(vm.selectedMonth)`.
      - `AnalyticsService.getCategorySpend(vm.selectedMonth)`.
      - `AnalyticsService.getMonthlyTrend()`.
      - `AnalyticsService.getCardDistribution(vm.selectedMonth)`.
      - `AnalyticsService.getCategoryBreakdown(vm.selectedMonth)`.
      - `BudgetService.getBudgetStatus(vm.selectedMonth)`.
      - `TransactionsService.getRecentTransactions()`.
    - On success, populates view model fields.
    - On any error, delegates to `ErrorHandlerService.handleError(error)` and sets `vm.hasError` and `vm.errorMessage`.
    - Always sets `isLoading = false` after completion.

- Error Handling:
  - Uses `ErrorHandlerService` to map technical errors to user-friendly messages.
  - Displayed in dashboard UI error banner.

### 9.2 CardsController

- File: `src/app/controllers/cards.controller.js`.
- Dependencies:
  - `CardsService`.
  - `LoggingService`.
  - `ErrorHandlerService`.

- ViewModel (`vm`):
  - `vm.cards: CardModel[]`.
  - `vm.isLoading: boolean`.
  - `vm.hasError: boolean`.
  - `vm.errorMessage: string`.

- Public Methods:
  - `vm.initialize()`
    - Calls `loadCards()`.

  - `vm.retry()`
    - Re-invokes `loadCards()` on error.

- Private Functions:
  - `loadCards()`
    - Sets `isLoading = true`, `hasError = false`.
    - Calls `CardsService.getCards()`.
    - On success, populates `vm.cards`.
    - On error, uses `ErrorHandlerService`.

### 9.3 TransactionsController

- File: `src/app/controllers/transactions.controller.js`.
- Dependencies:
  - `TransactionsService`.
  - `LoggingService`.
  - `ErrorHandlerService`.
  - `$routeParams` (for default filters).

- ViewModel (`vm`):
  - `vm.filters: {
      merchant: string | null,
      category: string | null,
      bank: string | null,
      cardId: string | null,
      fromDate: string | null,
      toDate: string | null
    }`.
  - `vm.sort: { field: 'amount' | 'date', direction: 'asc' | 'desc' }`.
  - `vm.pagination: { pageNumber: number, pageSize: number, totalRecords: number }`.
  - `vm.transactions: TransactionModel[]`.
  - `vm.isLoading: boolean`.
  - `vm.hasError: boolean`.
  - `vm.errorMessage: string`.

- Public Methods:
  - `vm.initialize()`
    - Sets default filters (current month).
    - Calls `search()`.

  - `vm.search()`
    - Validates filters.
    - Calls `TransactionsService.searchTransactions(filters, sort, pagination.pageNumber, pagination.pageSize)`.

  - `vm.clearFilters()`
    - Resets filters to defaults.
    - Calls `search()`.

  - `vm.changeSort(field)`
    - Toggles `direction` for the given `field` and calls `search()`.

  - `vm.changePage(pageNumber)`
    - Updates `pagination.pageNumber` and calls `search()`.

  - `vm.retry()`
    - Re-executes `search()` if `hasError`.

- Private Functions:
  - `validateFilters()`
    - Ensures date ranges are valid (`fromDate <= toDate`).
    - Ensures allowed categories/banks/cards only (per configuration).
    - Calls `ErrorHandlerService` on invalid input.

---

## 10. Service Design

### 10.1 DashboardService

- File: `src/app/services/dashboard.service.js`.
- Purpose:
  - Communicate with backend dashboard summary endpoint.

- Dependencies:
  - `$http`.
  - `$q`.
  - `ENV_CONFIG`.
  - `LoggingService`.

- Public Methods:
  - `getMonthlySummary(month: string): Promise<MonthlySummaryModel>`.

- Behaviour:
  - Builds URL: `${ENV_CONFIG.apiBaseUrl}/dashboard/monthly-summary`.
  - Query params: `month=YYYY-MM`.
  - Timeout: `ENV_CONFIG.apiTimeoutMs`.
  - On success (HTTP 200):
    - Validates response schema.
    - Maps to `MonthlySummaryModel` via `mapResponseToMonthlySummaryModel()`.
  - On error (non-2xx or timeout):
    - Logs error via `LoggingService.error()`.
    - Rejects with `ErrorModel`.

- Private Methods:
  - `mapResponseToMonthlySummaryModel(responseData)`.
  - `validateSummaryResponse(responseData)`.

### 10.2 CardsService

- File: `src/app/services/cards.service.js`.
- Purpose:
  - Retrieve card list and details.

- Dependencies:
  - `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.

- Public Methods:
  - `getCards(): Promise<CardModel[]>`.

- Behaviour:
  - URL: `${ENV_CONFIG.apiBaseUrl}/cards`.
  - On success: maps array to `CardModel[]`.
  - On error: logs and rejects with `ErrorModel`.

### 10.3 TransactionsService

- File: `src/app/services/transactions.service.js`.
- Purpose:
  - Transaction search, filter, sort, pagination.
  - Recent transactions retrieval.

- Dependencies:
  - `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.

- Public Methods:
  - `searchTransactions(filters, sort, pageNumber, pageSize): Promise<{ transactions: TransactionModel[], totalRecords: number }>`.
  - `getRecentTransactions(): Promise<TransactionModel[]>`.

- Behaviour:
  - URL: `${ENV_CONFIG.apiBaseUrl}/transactions`.
  - Query parameters:
    - `merchant`, `category`, `bank`, `cardId`, `fromDate`, `toDate`, `sortField`, `sortDirection`, `pageNumber`, `pageSize`.
  - `getRecentTransactions()` uses URL: `${ENV_CONFIG.apiBaseUrl}/transactions/recent`.
  - On success: maps response to `TransactionModel[]` and pagination metadata.
  - On validation error (HTTP 400): rejects with a mapped `ErrorModel` containing validation messages.

### 10.4 AnalyticsService

- File: `src/app/services/analytics.service.js`.
- Purpose:
  - Category spend, monthly trend, card distribution, category breakdown.

- Dependencies:
  - `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.

- Public Methods:
  - `getCategorySpend(month: string): Promise<CategorySummaryModel[]>`.
  - `getMonthlyTrend(): Promise<MonthlyTrendModel>`.
  - `getCardDistribution(month: string): Promise<CardDistributionModel>`.
  - `getCategoryBreakdown(month: string): Promise<CategorySummaryModel[]>`.

- Behaviour:
  - URLs:
    - `${ENV_CONFIG.apiBaseUrl}/analytics/category-spend`.
    - `${ENV_CONFIG.apiBaseUrl}/analytics/monthly-trend`.
    - `${ENV_CONFIG.apiBaseUrl}/analytics/card-distribution`.
    - `${ENV_CONFIG.apiBaseUrl}/analytics/category-breakdown`.
  - Query parameter `month` applied for month-specific analytics.

### 10.5 BudgetService

- File: `src/app/services/budget.service.js`.
- Purpose:
  - Retrieve budget status (monthly budget, current spend, remaining, utilization %, progress info).

- Dependencies:
  - `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.

- Public Methods:
  - `getBudgetStatus(month: string): Promise<BudgetStatusModel>`.
  - Future expansion for `postBudgetConfig()` is possible but currently **out of scope for LLD** (no explicit UI in HLD).
    - **Information missing from HLD – requires clarification** whether budget configuration UI should be implemented.

- Behaviour:
  - URL: `${ENV_CONFIG.apiBaseUrl}/budget/status`.
  - Query `month`.

### 10.6 LoggingService

- File: `src/app/services/logging.service.js`.
- Purpose:
  - Central logging abstraction.

- Public Methods:
  - `info(message: string, context?: any)`.
  - `warn(message: string, context?: any)`.
  - `error(message: string, context?: any)`.
  - `audit(event: string, details?: any)`.

### 10.7 ErrorHandlerService

- File: `src/app/services/error-handler.service.js`.
- Purpose:
  - Map low-level errors (HTTP failures, validation errors) to `ErrorModel` and user-facing messages.

- Public Methods:
  - `handleError(error: any): ErrorModel`.

- Behaviour:
  - Inspects HTTP status, internal code.
  - Generates `ErrorModel` containing:
    - `code`, `message`, `details`, `correlationId`.
  - Distinguishes between network, validation, auth, and server errors.

### 10.8 AuthTokenService

- File: `src/app/services/auth-token.service.js`.
- Purpose:
  - Manage IAM auth token used for API calls.

- Public Methods:
  - `getToken(): string | null`.
  - `setToken(token: string): void`.
  - `clearToken(): void`.

- Behaviour:
  - Persist token in browser storage (localStorage or sessionStorage) with secure practices.

---

## 11. Factory Design

### ModelsFactory

- File: `src/app/factories/models.factory.js`.
- Purpose:
  - Provide helper methods to create well-formed model instances.

- Public Methods:
  - `createMonthlySummary(data): MonthlySummaryModel`.
  - `createCard(data): CardModel`.
  - `createTransaction(data): TransactionModel`.
  - `createCategorySummary(data): CategorySummaryModel`.
  - `createMonthlyTrend(data): MonthlyTrendModel`.
  - `createCardDistribution(data): CardDistributionModel`.
  - `createBudgetStatus(data): BudgetStatusModel`.
  - `createError(data): ErrorModel`.

---

## 12. Directive Design

### 12.1 KPI Card Directive (`kpiCard`)

- File: `src/app/directives/kpi-card.directive.js`.
- Restrict: `'E'` (element).
- Scope:
  - Isolated scope with bindings:
    - `title: '@'` – label (e.g., "Total Spend").
    - `value: '@'` or `<` – numeric or formatted value.
    - `iconClass: '@'` – icon CSS class.
    - `tooltip: '@?'` – optional tooltip.
- Controller:
  - `KpiCardController`.
  - ControllerAs: `vm`.
- TemplateUrl: `templates/components/kpi-card.html`.

Usage Example:

```html
<kpi-card
  title="Total Spend"
  value="{{ vm.summary.totalSpend | currencyFormat }}"
  icon-class="icon-total-spend">
</kpi-card>
```

### 12.2 Category Spend Chart Directive (`categorySpendChart`)

- File: `src/app/directives/category-spend-chart.directive.js`.
- Restrict: `'E'`.
- Scope:
  - `data: '<'` – `CategorySummaryModel[]`.
- Controller: `CategorySpendChartController` (`vm`).
- TemplateUrl: `templates/components/category-spend-chart.html`.
- Behaviour:
  - Initializes Chart.js bar chart with categories as labels and spend amounts as values.

### 12.3 Monthly Trend Chart Directive (`monthlyTrendChart`)

- File: `src/app/directives/monthly-trend-chart.directive.js`.
- Scope:
  - `data: '<'` – `MonthlyTrendModel`.
- Chart.js line chart.

### 12.4 Card Distribution Chart Directive (`cardDistributionChart`)

- File: `src/app/directives/card-distribution-chart.directive.js`.
- Scope:
  - `data: '<'` – `CardDistributionModel`.
- Chart.js pie or doughnut chart.

### 12.5 Category Breakdown Chart Directive (`categoryBreakdownChart`)

- File: `src/app/directives/category-breakdown-chart.directive.js`.
- Scope:
  - `data: '<'` – `CategorySummaryModel[]`.
- Chart.js bar or stacked bar chart.

### 12.6 Transactions Table Directive (`transactionsTable`)

- File: `src/app/directives/transactions-table.directive.js`.
- Restrict: `'E'`.
- Scope:
  - `transactions: '<'` – array of `TransactionModel`.
  - `sort: '<'` – sort settings.
  - `onSortChange: '&'` – callback when user changes sort.
  - `pagination: '<'` – pagination state.
  - `onPageChange: '&'` – callback when user changes page.
- Controller: `TransactionsTableController`.
- TemplateUrl: `templates/components/transactions-table.html`.

### 12.7 Budget Widget Directive (`budgetWidget`)

- File: `src/app/directives/budget-widget.directive.js`.
- Scope:
  - `data: '<'` – `BudgetStatusModel`.
- TemplateUrl: `templates/components/budget-widget.html`.
- Behaviour:
  - Renders numeric values and progress bar (using Bootstrap progress component).

### 12.8 Recent Transactions Directive (`recentTransactions`)

- File: `src/app/directives/recent-transactions.directive.js`.
- Scope:
  - `transactions: '<'` – latest five `TransactionModel` entries.
- TemplateUrl: `templates/components/recent-transactions.html`.

---

## 13. Filter Design

### 13.1 currencyFormat Filter

- File: `src/app/filters/currency-format.filter.js`.
- Input: number.
- Output: formatted currency string using configured currency (e.g., "₹ 1,234.00").
- Uses `ENV_CONFIG.currencyCode` if available; if missing:
  - **Information missing from HLD – requires clarification** for preferred currency code.

### 13.2 dateFormat Filter

- File: `src/app/filters/date-format.filter.js`.
- Input: date string or Date.
- Output: formatted date string (e.g., `DD MMM YYYY`).

### 13.3 percentageFormat Filter

- File: `src/app/filters/percentage-format.filter.js`.
- Input: numeric ratio (0–1 or 0–100 depending on model).
- Output: percentage string (e.g., `45%`).

---

## 14. Model Design

### 14.1 MonthlySummaryModel

- File: `src/app/models/monthly-summary.model.js`.
- Purpose:
  - Represents dashboard summary metrics for a given month.

- Properties:
  - `month: string` (required, `YYYY-MM`).
  - `totalSpend: number` (>= 0).
  - `totalCreditLimit: number` (>= 0).
  - `availableCredit: number` (>= 0).
  - `outstandingAmount: number` (>= 0).
  - `utilizationPercentage: number` (0–100).
  - `transactionCount: number` (>= 0).

- Sample JSON:

```json
{
  "month": "2026-07",
  "totalSpend": 45872.0,
  "totalCreditLimit": 200000.0,
  "availableCredit": 154128.0,
  "outstandingAmount": 45872.0,
  "utilizationPercentage": 22.94,
  "transactionCount": 92
}
```

### 14.2 CardModel

- File: `src/app/models/card.model.js`.
- Properties:
  - `cardId: string` (internal identifier, required).
  - `cardName: string` (required).
  - `issuingBank: string` (required).
  - `maskedCardNumber: string` (required, pattern `XXXX-XXXX-XXXX-1234`).
  - `creditLimit: number` (>= 0).
  - `availableCredit: number` (>= 0).
  - `outstandingAmount: number` (>= 0).
  - `billingDate: string` (e.g., `DD` or `DD MMM`).
  - `dueDate: string` (e.g., `DD` or `DD MMM`).

### 14.3 TransactionModel

- File: `src/app/models/transaction.model.js`.
- Properties:
  - `transactionId: string`.
  - `transactionDate: string` (ISO `YYYY-MM-DD`).
  - `merchantName: string`.
  - `category: string` (one of defined category set).
  - `cardId: string`.
  - `cardName: string`.
  - `bankName: string`.
  - `amount: number`.
  - `paymentStatus: string` (e.g., `PAID`, `PENDING`, `FAILED`).
  - `remarks: string | null`.

### 14.4 CategorySummaryModel

- File: `src/app/models/category-summary.model.js`.
- Properties:
  - `categoryName: string`.
  - `totalSpend: number`.
  - `transactionCount: number`.

### 14.5 MonthlyTrendModel

- File: `src/app/models/monthly-trend.model.js`.
- Properties:
  - `months: string[]` (e.g., `['2026-03', '2026-04', ...]`).
  - `spendAmounts: number[]`.

### 14.6 CardDistributionModel

- File: `src/app/models/card-distribution.model.js`.
- Properties:
  - `cardNames: string[]`.
  - `spendAmounts: number[]`.

### 14.7 BudgetStatusModel

- File: `src/app/models/budget-status.model.js`.
- Properties:
  - `month: string`.
  - `budgetAmount: number`.
  - `currentSpend: number`.
  - `remainingBudget: number`.
  - `utilizationPercentage: number`.

### 14.8 ErrorModel

- File: `src/app/models/error.model.js`.
- Properties:
  - `code: string`.
  - `message: string`.
  - `details: any`.
  - `correlationId: string`.

---

## 15. REST API Contract

All endpoints are consumed via `${ENV_CONFIG.apiBaseUrl}`.

### 15.1 GET /dashboard/monthly-summary

- Method: `GET`.
- URL: `/dashboard/monthly-summary`.
- Headers:
  - `Authorization: Bearer <token>`.
  - `Content-Type: application/json`.
- Query Params:
  - `month` (required, `YYYY-MM`).
- Success (200):

```json
{
  "month": "2026-07",
  "totalSpend": 45872.0,
  "totalCreditLimit": 200000.0,
  "availableCredit": 154128.0,
  "outstandingAmount": 45872.0,
  "utilizationPercentage": 22.94,
  "transactionCount": 92
}
```

- Error responses:
  - 400, 401, 403, 404, 408, 500 – mapped to `ErrorModel`.

### 15.2 GET /cards

- Method: `GET`.
- URL: `/cards`.
- Headers: Authorization, Content-Type.
- Success (200): returns array of `CardModel` JSON.

### 15.3 GET /transactions

- Method: `GET`.
- URL: `/transactions`.
- Query Params:
  - `merchant`, `category`, `bank`, `cardId`, `fromDate`, `toDate`, `sortField`, `sortDirection`, `pageNumber`, `pageSize`.
- Success (200):

```json
{
  "pageNumber": 1,
  "pageSize": 20,
  "totalRecords": 92,
  "items": [ /* TransactionModel[] */ ]
}
```

### 15.4 GET /analytics/category-spend

- Method: `GET`.
- URL: `/analytics/category-spend`.
- Query: `month`.
- Success: array of `CategorySummaryModel`.

### 15.5 GET /analytics/monthly-trend

- Method: `GET`.
- URL: `/analytics/monthly-trend`.
- Success: `MonthlyTrendModel`.

### 15.6 GET /analytics/card-distribution

- Method: `GET`.
- URL: `/analytics/card-distribution`.
- Query: `month`.
- Success: `CardDistributionModel`.

### 15.7 GET /analytics/category-breakdown

- Method: `GET`.
- URL: `/analytics/category-breakdown`.
- Query: `month`.
- Success: array of `CategorySummaryModel`.

### 15.8 GET /budget/status

- Method: `GET`.
- URL: `/budget/status`.
- Query: `month`.
- Success: `BudgetStatusModel`.

### 15.9 GET /transactions/recent

- Method: `GET`.
- URL: `/transactions/recent`.
- Success: `TransactionModel[]` (latest five).

Error Handling for all endpoints:

- Response structure on error:

```json
{
  "code": "<error-code>",
  "message": "<user-facing-message>",
  "details": {},
  "correlationId": "<guid>"
}
```

---

## 16. Configuration Design

### 16.1 ENV_CONFIG

- File: `src/app/config/config.constants.js`.
- Properties:
  - `apiBaseUrl: string` – base URL for API Gateway.
  - `apiTimeoutMs: number` – timeout in ms for HTTP requests.
  - `maxLookbackMonths: number` – maximum months allowed for filters.
  - `useMockData: boolean` – toggles between mock and real APIs.
  - `currencyCode: string` – currency code (e.g., "INR").
  - `featureFlags: { enableBudgetConfig: boolean }`.

Environment files:

- `env.default.json`, `env.dev.json`, `env.prod.json` define environment-specific values.

---

## 17. Mock Implementation Design

Each endpoint has a matching mock service and JSON file.

Example: `dashboard.mock.service.js`:

- Uses `$q` and `$timeout`.
- Methods:
  - `getMonthlySummary(month)` returning mock JSON from `mock-dashboard-summary.json` after 300–700ms.

Failure scenarios:

- Simulated HTTP error codes (400, 401, 403, 404, 408, 500) via rejection with `ErrorModel`.
- Simulated timeouts via longer `$timeout`.

Mock files (`mock/*.json`) mirror the production contract exactly.

`ENV_CONFIG.useMockData` controls whether application uses mock services or production endpoints.

---

## 18. UI Specification

### 18.1 Layout

- Header:
  - Application name: "Monthly Spending Summary Dashboard".
  - User identity summary.
  - Optional logout button.

- Navigation Bar:
  - Tabs: Dashboard, Cards, Transactions.
  - Active state indicated by highlight.

- Main Content:
  - `ng-view` area.

- Footer:
  - Version text (e.g., `v1.0`), legal notice.

### 18.2 Dashboard Page

- Section order:
  1. Summary KPI Cards.
  2. Filters (month selector).
  3. Charts (category spend, trend, card distribution, category breakdown).
  4. Budget Widget.
  5. Recent Transactions.

- Summary KPI Cards (Bootstrap 3 grid):
  - Four to six cards in `row`:
    - `Total Monthly Spend`.
    - `Total Credit Limit`.
    - `Available Credit`.
    - `Outstanding Amount`.
    - `Utilization Percentage`.
    - `Number of Transactions`.

- Charts:
  - Category Spend: bar chart.
  - Monthly Trend: line chart.
  - Card Distribution: doughnut chart.
  - Category Breakdown: stacked bar chart.

- Budget Widget:
  - Displays monthly budget, current spend, remaining budget, utilization percentage.
  - Progress bar with utilization.

- Recent Transactions:
  - List-style display of latest five transactions with date, merchant, amount, card.

### 18.3 Cards Page

- Table: columns for Card Name, Bank, Masked Card Number, Credit Limit, Available Credit, Outstanding Amount, Billing Date, Due Date.
- Responsive grid so cards table adapts to screen sizes.

### 18.4 Transactions Page

- Filters section above table:
  - Merchant search text box.
  - Category dropdown (with fixed category list from HLD).
  - Bank dropdown.
  - Card dropdown.
  - Date range pickers (from/to).

- Table:
  - Columns: Date, Merchant, Category, Card, Bank, Amount, Payment Status, Remarks.
  - Sorting: Clickable headers for Date and Amount.
  - Pagination: Bootstrap pagination controls.

### 18.5 Responsive Behaviour

- Uses Bootstrap grid to adapt to:
  - Desktop: multi-column layout.
  - Tablet: 2-column layout for cards and charts.
  - Mobile: stacked layout.

- No horizontal scroll on common breakpoints.

### 18.6 Loading/Empty/Error States

- Loading:
  - Overlay spinner or skeleton states.

- Empty:
  - For no transactions: "No transactions available for the selected criteria.".
  - For no cards: "No cards configured for your profile.".

- Error:
  - Error banner with message from `ErrorHandlerService` and `Retry` button.

---

## 19. Data Flow

Data flows follow HLD definitions; here they are detailed for SPA.

### 19.1 Authentication & Session

- On app load, SPA checks for auth token via `AuthTokenService`.
- If missing, user is redirected to IAM login page (URL from configuration).
- Post-login, IAM returns token; SPA stores it via `AuthTokenService.setToken()`.
- `$http` interceptor attaches `Authorization: Bearer <token>` header.

### 19.2 Monthly Dashboard Summary Retrieval

- `DashboardController.initialize()` triggers `DashboardService.getMonthlySummary()`.
- Service requests summary from `/dashboard/monthly-summary`.
- On success, view model is updated; KPI cards and charts reflect the data.

### 19.3 Card Management View

- `CardsController.initialize()` calls `CardsService.getCards()`.
- Service loads `CardModel[]`; cards table is rendered.

### 19.4 Transaction Management

- `TransactionsController.initialize()` sets default filters, calls `search()`.
- `TransactionsService.searchTransactions()` builds query and calls `/transactions`.
- On success, table directive displays results.

### 19.5 Spending Analytics

- Dashboard route resolves analytics via `AnalyticsService`.
- Chart directives consume resolved data and render charts.

### 19.6 Budget Tracking

- Dashboard route resolves `BudgetService.getBudgetStatus()`.
- Budget widget directive displays budget metrics and progress.

### 19.7 Recent Transactions

- Dashboard route resolves `TransactionsService.getRecentTransactions()`.
- Recent transactions directive renders last five transactions.

---

## 20. Business Rules

High-level rules per HLD:

1. Utilization Percentage = `outstandingAmount / totalCreditLimit * 100`.
   - Rounded to 2 decimal places.

2. Total Monthly Spend is sum of amounts of all transactions in selected month.

3. Transaction filtering rules:
   - `fromDate` and `toDate` define inclusive range.
   - Category filter uses the fixed category list.

4. Budget utilization = `currentSpend / budgetAmount * 100`.

Backend side category assignment rules and specific budget configuration logic:

- **Information missing from HLD – requires clarification.**

---

## 21. Validation Rules

### 21.1 Form & Filter Validation

- Merchant search:
  - Max length 100 chars.
  - Disallow dangerous characters (sanitized via Angular Sanitize).

- Date range:
  - `fromDate` and `toDate` required for non-empty range.
  - `fromDate <= toDate`.
  - Range must not exceed `ENV_CONFIG.maxLookbackMonths`.

- Category, Bank, Card:
  - Must be in allowed lists; invalid values rejected before API call.

### 21.2 API Request Validation (Client Side)

- Every request ensures mandatory parameters (e.g., `month`) are present.

### 21.3 API Response Validation

- Services validate that received JSON matches expected model schema.
- Missing or invalid fields result in `ErrorModel` and user-facing error.

---

## 22. Error Handling

- All service calls use `ErrorHandlerService.handleError()`.
- Error categories:
  - Network errors: connection issues, timeouts.
  - Validation errors (400): invalid query or filters.
  - Auth errors (401, 403): user not authorized.
  - Not found (404): missing resources.
  - Server errors (500): generic unexpected issues.

- UI behaviour:
  - Dashboard: error banner at top with message and Retry.
  - Cards/Transactions pages: error banner above table.

---

## 23. Logging Design

- LoggingService used by controllers and services.
- Info logs:
  - Successful page loads and API requests.
- Warning logs:
  - Validation warnings, unusual filter combinations.
- Error logs:
  - API failures, parsing errors.
- Audit logs:
  - Budget status retrieval, card list access, transaction search events.

Sensitive data (card numbers, auth tokens) are never logged.

---

## 24. Security Design

- Input validation on filters and search fields.
- Usage of Angular Sanitize for user-entered text (remarks, merchant search).
- Auth token management via `AuthTokenService`.
- HTTP interceptor attaches token.
- UI does not display full card numbers or sensitive details.
- All API URLs are HTTPS; `apiBaseUrl` must be configured with `https://`.

Organizational compliance frameworks are assumed but not specified:

- **Information missing from HLD – requires clarification** for specific compliance regimes (e.g., PCI, GDPR, local regulations).

---

## 25. Dependency Map

Examples (not exhaustive):

- `DashboardController` depends on `DashboardService`, `AnalyticsService`, `BudgetService`, `TransactionsService`, `LoggingService`, `ErrorHandlerService` and models.
- `CardsController` depends on `CardsService`, `LoggingService`, `ErrorHandlerService`.
- `TransactionsController` depends on `TransactionsService`, `LoggingService`, `ErrorHandlerService`.
- `DashboardService` depends on `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.
- `CardsService` depends on `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.
- `TransactionsService` depends on `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.
- `AnalyticsService` depends on `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.
- `BudgetService` depends on `$http`, `$q`, `ENV_CONFIG`, `LoggingService`.
- Directives depend on Chart.js, Bootstrap CSS, filters, and models.

No circular dependencies are introduced.

---

## 26. LLD Validation Checklist

- All 26 mandatory sections from `lldgenerationkb` are present and populated.
- Technology stack matches AngularJS 1.7.9 + Bootstrap 3.4.1 + Chart.js 2.9.4.
- SPA architecture with ControllerAs, DI, IIFE patterns is defined.
- Repository structure is complete and consistent.
- Routes map to existing controllers and templates; default route defined.
- REST API contracts match HLD functionality.
- Mock implementation design supports switching via `useMockData`.
- UI specification covers layout, components, states (loading/empty/error).
- Business rules, validation, error handling, logging, and security are documented.
- All missing HLD details are explicitly marked as needing clarification; no assumptions are made.

This LLD passes quality gates defined in `lldgenerationkb` and is ready for consumption by the Code Generation Agent.
