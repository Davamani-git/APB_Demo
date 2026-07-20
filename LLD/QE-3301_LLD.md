# Low Level Design (LLD) – QE-3301 Monthly Spending Summary Dashboard

## 1. Application Overview

### 1.1 Epic Reference
- **Epic ID**: QE-3301
- **Epic Name**: Monthly Spending Summary Dashboard
- **Source HLD**: `HLD/QE-3301_HLD.md`

### 1.2 Purpose
Implement a responsive, SPA-based Monthly Spending Summary Dashboard that surfaces:
- Dashboard summary KPIs for credit card spending and utilization.
- Management views for multiple credit cards.
- Transaction table with search, filters, and sorting.
- Analytics charts for spending trends and distributions.
- Budget tracking widgets and progress bars.
- Recent transactions widget.

This LLD defines all implementation specifications for an AngularJS 1.7.9 SPA, including modules, components, APIs, models, configuration, mocks, validations, error handling, and repository structure.

### 1.3 Supported Platforms & Browsers
- **Web**: Responsive HTML5/CSS3/JS SPA.
- **Browsers** (minimum):
  - Google Chrome (latest stable on Windows/macOS)
  - Microsoft Edge (latest stable on Windows)

### 1.4 Out-of-Scope (per HLD)
The LLD shall NOT introduce functionality beyond the HLD and shall explicitly treat these areas as external systems:
- Payment execution pipelines and card settlements.
- Dispute handling workflows.
- Non-credit-card financial products (loans, deposits, investments, etc.).
- External data warehouse analytics and reporting.

The dashboard may consume data that is produced by such systems via defined APIs but does not implement them.


## 2. Technology Stack

### 2.1 Frontend
- HTML5
- CSS3
- JavaScript (ES6 syntax where compatible with AngularJS 1.7.9)
- AngularJS 1.7.9
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only; no bootstrap.js unless explicitly added later)
- Chart.js 2.9.4

### 2.2 CDN & Library Loading
`index.html` SHALL:
- Load CSS before JS.
- Use CDN URLs for:
  - AngularJS 1.7.9
  - Angular Route 1.7.9
  - Angular Animate 1.7.9
  - Angular Sanitize 1.7.9
  - Angular UI Bootstrap 2.5.6
  - Bootstrap 3.4.1 CSS
  - Chart.js 2.9.4
- Load application scripts after framework libraries.

### 2.3 Backend Interfaces (for this frontend LLD)
The dashboard consumes REST APIs exposed by a BFF and downstream domain services; this LLD defines the REST contracts expected by the SPA. Actual backend implementation is out-of-scope; however, endpoints, payloads, and error schemas are fully specified.


## 3. Architecture Design

### 3.1 Pattern
- AngularJS MVC, single page application.
- ControllerAs syntax for all controllers.
- IIFE pattern for all AngularJS module component registrations.
- Dependency Injection for all services/controllers.

### 3.2 Layers (Frontend Perspective)
- **Presentation Layer**
  - Views/templates (HTML partials under `src/templates/`)
  - Directives encapsulating reusable UI widgets (cards, charts, tables)
  - Filters for formatting values (currency, date, percentage)

- **ViewModel Layer**
  - Controllers managing view state, routing, and user interaction.

- **Domain/Business Layer (Frontend)**
  - Services implementing business logic related to:
    - Dashboard summary aggregation (from APIs)
    - Transactions querying and filtering
    - Analytics retrieval and interpretation
    - Budget calculations against configuration

- **Integration Layer**
  - REST API client services using `$http`.
  - Mock services using `$q` and `$timeout` when `useMockData = true` in configuration.

- **Configuration & Cross-Cutting**
  - Centralized environment configuration.
  - Logging service.
  - Error handling infrastructure.
  - Security-related client concerns (token handling, sanitization).

### 3.3 High-Level Data Flow (Frontend)
User Action → Controller (view model) → Service (business + API orchestration) → REST API / Mock → Response mapping → Models → Controller → Directives/Templates → UI update.

Both success and failure flows are defined in Section 19 and 22.


## 4. Repository Structure

Root: `APB_Demo` (repo)

```text
APB_Demo/
  index.html
  README.md
  src/
    app/
      app.module.js
      app.routes.js
      app.config.js
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
      services/
        dashboard.service.js
        cards.service.js
        transactions.service.js
        analytics.service.js
        budget.service.js
        widgets.service.js
        logging.service.js
        security.service.js
      factories/
        model.factory.js
      directives/
        kpi-card.directive.js
        spending-chart.directive.js
        transactions-table.directive.js
        budget-progress.directive.js
        recent-transactions.directive.js
      filters/
        currency-format.filter.js
        date-format.filter.js
        percentage.filter.js
      models/
        card.model.js
        transaction.model.js
        analytics-summary.model.js
        budget.model.js
        error.model.js
      routes/
        dashboard.routes.js
      interceptors/
        http-error.interceptor.js
    templates/
      dashboard/
        dashboard.html
        summary-kpi.html
        cards-panel.html
        transactions-panel.html
        analytics-panel.html
        budget-panel.html
        recent-transactions-panel.html
      shared/
        kpi-card.html
        spending-chart.html
        transactions-table.html
        budget-progress.html
        recent-transactions.html
      layout/
        header.html
        footer.html
        sidebar.html
    assets/
      css/
        app.css
        dashboard.css
      js/
        vendor.js (if needed for non-Angular libs)
      images/
        kpi-icons/*
        empty-states/*
      fonts/
        (optional, if design requires)
    mock/
      dashboard.mock.js
      cards.mock.js
      transactions.mock.js
      analytics.mock.js
      budget.mock.js
      widgets.mock.js
    data/
      samples/
        cards.sample.json
        transactions.sample.json
        analytics.sample.json
        budget.sample.json
        widgets.sample.json
```

For every file above, sections 9–18 detail responsibilities, dependencies, and contracts.


## 5. Application Bootstrap Design

### 5.1 Angular Root Module
- **Module Name**: `app`
- **Definition File**: `src/app/app.module.js`
- **Dependencies**:
  - `ngRoute`
  - `ngAnimate`
  - `ngSanitize`
  - `ui.bootstrap`
  - `chart.js` (if using angular-chart.js wrapper; otherwise Chart.js used directly in directives)

#### Responsibilities
- Declare root AngularJS module.
- Register run and config blocks.
- Integrate global HTTP interceptor.

#### Key Specifications
- Only `app.module.js` shall call `angular.module('app', [...])`.
- All other components shall call `angular.module('app')`.

### 5.2 index.html Specification

**File**: `index.html`

**Purpose**:
- Bootstrap the AngularJS SPA.
- Define overall shell layout (header, content with `ng-view`, footer).

**Structure**:
- `<html>` with `<head>` including:
  - Title: "Monthly Spending Summary Dashboard"
  - Meta viewport for responsive behaviour.
  - Stylesheet links (Bootstrap, app.css, dashboard.css).

- `<body ng-app="app">` containing:
  - `<div ng-include="'templates/layout/header.html'"></div>`
  - `<div class="container-fluid">
       <div class="row">
         <div class="col-md-2" ng-include="'templates/layout/sidebar.html'"></div>
         <div class="col-md-10">
           <div ng-view></div>
         </div>
       </div>
     </div>`
  - `<div ng-include="'templates/layout/footer.html'"></div>`

- Script tags (in order):
  - AngularJS CDN
  - Angular Route CDN
  - Angular Animate CDN
  - Angular Sanitize CDN
  - Angular UI Bootstrap CDN
  - Chart.js CDN
  - `src/assets/js/vendor.js` (if any non-CDN libs)
  - `src/app/app.module.js`
  - `src/app/app.config.js`
  - `src/app/app.routes.js`
  - `src/app/routes/dashboard.routes.js`
  - All controllers, services, directives, filters, interceptors.


## 6. Module Design

### 6.1 Root Module `app`

**File**: `src/app/app.module.js`

**Component Type**: AngularJS module.

**Responsibilities**:
- Initialize AngularJS application.
- Declare external module dependencies.

**Depends On**:
- AngularJS core.
- `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`.

**Consumed By**:
- All controllers, services, directives, filters, interceptors.

### 6.2 Configuration Module Components

**File**: `src/app/app.config.js`

- Registers configuration blocks for:
  - HTTP interceptors.
  - Security-related settings (e.g., `$httpProvider.defaults.headers.common.Authorization` integration with token source).

**File**: `src/app/routes/dashboard.routes.js`

- Defines feature-specific routes for dashboard.

**File**: `src/app/config/config.constants.js`

- Registers AngularJS constants and values for environment configuration.


## 7. Routing Design

### 7.1 Primary Routes

**File**: `src/app/app.routes.js`

**Routes**:
1. `/dashboard`
   - `templateUrl`: `templates/dashboard/dashboard.html`
   - `controller`: `DashboardController`
   - `controllerAs`: `vm`
   - `resolve`: 
     - `initialSummary`: loads dashboard summary via `DashboardService.getSummary()`.

2. `/cards`
   - `templateUrl`: `templates/dashboard/cards-panel.html`
   - `controller`: `CardsController`
   - `controllerAs`: `vm`

3. `/transactions`
   - `templateUrl`: `templates/dashboard/transactions-panel.html`
   - `controller`: `TransactionsController`
   - `controllerAs`: `vm`

4. `/analytics`
   - `templateUrl`: `templates/dashboard/analytics-panel.html`
   - `controller`: `AnalyticsController`
   - `controllerAs`: `vm`

5. `/budget`
   - `templateUrl`: `templates/dashboard/budget-panel.html`
   - `controller`: `BudgetController`
   - `controllerAs`: `vm`

### 7.2 Default & Fallback
- **Default Route**: `/dashboard`.
- **Invalid Routes**: Redirect to `/dashboard`.

### 7.3 Route Constraints
- All `templateUrl` paths correspond to templates defined in Section 18.
- Controllers exist with specified names and are registered under module `app`.


## 8. Component Registry

All components registered on module `app`.

### 8.1 Controllers
- `DashboardController` – `src/app/controllers/dashboard.controller.js`
- `CardsController` – `src/app/controllers/cards.controller.js`
- `TransactionsController` – `src/app/controllers/transactions.controller.js`
- `AnalyticsController` – `src/app/controllers/analytics.controller.js`
- `BudgetController` – `src/app/controllers/budget.controller.js`

### 8.2 Services
- `DashboardService` – `src/app/services/dashboard.service.js`
- `CardsService` – `src/app/services/cards.service.js`
- `TransactionsService` – `src/app/services/transactions.service.js`
- `AnalyticsService` – `src/app/services/analytics.service.js`
- `BudgetService` – `src/app/services/budget.service.js`
- `WidgetsService` – `src/app/services/widgets.service.js`
- `LoggingService` – `src/app/services/logging.service.js`
- `SecurityService` – `src/app/services/security.service.js`

### 8.3 Factories
- `ModelFactory` – `src/app/factories/model.factory.js`

### 8.4 Directives
- `kpiCard` – `src/app/directives/kpi-card.directive.js`
- `spendingChart` – `src/app/directives/spending-chart.directive.js`
- `transactionsTable` – `src/app/directives/transactions-table.directive.js`
- `budgetProgress` – `src/app/directives/budget-progress.directive.js`
- `recentTransactions` – `src/app/directives/recent-transactions.directive.js`

### 8.5 Filters
- `currencyFormat` – `src/app/filters/currency-format.filter.js`
- `dateFormat` – `src/app/filters/date-format.filter.js`
- `percentage` – `src/app/filters/percentage.filter.js`

### 8.6 Models
- `CardModel` – `src/app/models/card.model.js`
- `TransactionModel` – `src/app/models/transaction.model.js`
- `AnalyticsSummaryModel` – `src/app/models/analytics-summary.model.js`
- `BudgetModel` – `src/app/models/budget.model.js`
- `ErrorModel` – `src/app/models/error.model.js`

### 8.7 Interceptors
- `HttpErrorInterceptor` – `src/app/interceptors/http-error.interceptor.js`

### 8.8 Config/Constants
- `ENV_CONFIG` constant – `src/app/config/config.constants.js`

For each component, detailed design is provided in sections 9–17.


## 9. Controller Design

### 9.1 DashboardController

**File**: `src/app/controllers/dashboard.controller.js`

**Registration**:
- `angular.module('app').controller('DashboardController', DashboardController);`

**Dependencies**:
- `DashboardService`
- `WidgetsService`
- `LoggingService`
- `$routeParams`

**ViewModel (vm)**:
- `vm.summary` – dashboard KPI summary (total monthly spend, total credit limit, available credit, outstanding amount, utilization %, number of transactions).
- `vm.cards` – summary list of user cards (for quick view).
- `vm.recentTransactions` – latest 5 transactions.
- `vm.loading` – boolean loading flag.
- `vm.error` – `ErrorModel` for current view.

**Public Methods**:
- `vm.initialize()`
  - Called on controller init.
  - Loads summary and recent transactions.
- `vm.refreshSummary()`
  - Re-fetches summary data.
- `vm.retry()`
  - Retries failed operations when `vm.error` exists.
- `vm.navigateTo(section)`
  - Navigates to specified section route (`cards`, `transactions`, `analytics`, `budget`).

**Private Methods**:
- `_handleSummarySuccess(data)` – maps response to `vm.summary`.
- `_handleSummaryError(error)` – maps error to `vm.error` and logs.
- `_handleRecentTransactionsSuccess(data)` – updates `vm.recentTransactions`.

**Responsibilities**:
- Coordinate initial dashboard load.
- Manage top-level KPI tiles and recent transactions widget state.
- Delegate data retrieval and business logic to services.

**Error Handling**:
- Uses `HttpErrorInterceptor` standardized response.
- On error: sets `vm.error` and displays error state (message + retry button).

### 9.2 CardsController

**File**: `src/app/controllers/cards.controller.js`

**Dependencies**:
- `CardsService`
- `LoggingService`

**ViewModel**:
- `vm.cards` – list of `CardModel` instances.
- `vm.loading` – loading flag.
- `vm.error` – `ErrorModel`.

**Public Methods**:
- `vm.initialize()` – loads cards.
- `vm.refresh()` – reloads cards.

**Responsibilities**:
- Display multiple credit cards with attributes:
  - Card Name
  - Issuing Bank
  - Masked Card Number
  - Credit Limit
  - Available Credit
  - Current Outstanding
  - Billing Date
  - Due Date

### 9.3 TransactionsController

**File**: `src/app/controllers/transactions.controller.js`

**Dependencies**:
- `TransactionsService`
- `CardsService` (for card filter dropdown data)
- `LoggingService`

**ViewModel**:
- `vm.transactions` – array of `TransactionModel`.
- `vm.filters` – object with:
  - `merchant` (string)
  - `category` (string)
  - `bank` (string)
  - `cardId` (string)
  - `dateFrom` (Date)
  - `dateTo` (Date)
- `vm.sort` – object with:
  - `field` (`'amount' | 'date'`)
  - `direction` (`'asc' | 'desc'`)
- `vm.pagination` – object with:
  - `page` (number)
  - `pageSize` (number)
- `vm.loading` – boolean.
- `vm.error` – `ErrorModel`.

**Public Methods**:
- `vm.initialize()` – loads initial transaction page.
- `vm.applyFilters()` – validates filters and reloads data.
- `vm.resetFilters()` – clears filters to default.
- `vm.changeSort(field)` – toggles sort direction for amount or date.
- `vm.changePage(page)` – updates page number.

**Responsibilities**:
- Coordinate transaction table for:
  - Transaction Date
  - Merchant Name
  - Category
  - Card Used
  - Amount
  - Payment Status
  - Remarks
- Provide search by merchant, filter by category/bank/card/date range, sorting by amount/date.

**Validation**:
- Validate date ranges (`dateFrom <= dateTo`).
- Ensure sort field is supported.

### 9.4 AnalyticsController

**File**: `src/app/controllers/analytics.controller.js`

**Dependencies**:
- `AnalyticsService`
- `LoggingService`

**ViewModel**:
- `vm.categorySpending` – data for category-wise spending chart.
- `vm.monthlyTrend` – data for monthly spending trend chart.
- `vm.cardDistribution` – data for card-wise spending distribution chart.
- `vm.loading` – boolean.
- `vm.error` – `ErrorModel`.

**Public Methods**:
- `vm.initialize()` – loads all analytics charts.
- `vm.refresh()` – reloads analytics.

**Responsibilities**:
- Provide chart data for:
  - Category-wise Spending
  - Monthly Spending Trend
  - Card-wise Spending Distribution
  - Category breakdown for defined categories:
    - Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous.

### 9.5 BudgetController

**File**: `src/app/controllers/budget.controller.js`

**Dependencies**:
- `BudgetService`
- `LoggingService`

**ViewModel**:
- `vm.budgetSummary` – `BudgetModel` for current month (monthly budget, current spend, remaining budget, budget utilization %, progress bar state).
- `vm.loading` – boolean.
- `vm.error` – `ErrorModel`.

**Public Methods**:
- `vm.initialize()` – loads budget summary.
- `vm.refresh()` – reloads budget.

**Responsibilities**:
- Display budget tracking cards and progress bar.


## 10. Service Design

### 10.1 DashboardService

**File**: `src/app/services/dashboard.service.js`

**Purpose**:
- Provide aggregated dashboard summary metrics.

**Dependencies**:
- `$http`
- `ENV_CONFIG`
- `LoggingService`

**Public Methods**:
- `getSummary()`
  - Parameters: none.
  - Returns: Promise resolving to `AnalyticsSummaryModel` (includes totalMonthlySpend, totalCreditLimit, availableCredit, outstandingAmount, utilizationPercentage, transactionCount).

**REST Endpoints Used**:
- `GET {ENV_CONFIG.apiBaseUrl}/dashboard/summary`

**Business Logic**:
- Map backend payload to `AnalyticsSummaryModel`.

**Error Handling**:
- On non-2xx: delegate to `HttpErrorInterceptor`, then reject with `ErrorModel`.

### 10.2 CardsService

**File**: `src/app/services/cards.service.js`

**Purpose**:
- Retrieve card metadata for card management and filters.

**Dependencies**:
- `$http`
- `ENV_CONFIG`
- `LoggingService`

**Public Methods**:
- `getCards()`
  - Returns: Promise resolving to `CardModel[]`.

**REST Endpoint**:
- `GET {ENV_CONFIG.apiBaseUrl}/cards`

**Business Rules**:
- Ensure card numbers are masked (provided by backend) before passing to UI.

### 10.3 TransactionsService

**File**: `src/app/services/transactions.service.js`

**Purpose**:
- Provide transactional data with filters, sorting, and pagination.

**Dependencies**:
- `$http`
- `ENV_CONFIG`
- `LoggingService`

**Public Methods**:
- `getTransactions(filters, sort, pagination)`
  - Parameters:
    - `filters` (merchant, category, bank, cardId, dateFrom, dateTo)
    - `sort` (field, direction)
    - `pagination` (page, pageSize)
  - Returns: Promise resolving to `{ items: TransactionModel[], totalCount: number }`.

**REST Endpoint**:
- `GET {ENV_CONFIG.apiBaseUrl}/transactions`
- Query parameters: `merchant`, `category`, `bank`, `cardId`, `dateFrom`, `dateTo`, `sortField`, `sortDirection`, `page`, `pageSize`.

**Validation**:
- Service performs additional validation on filter ranges and sort fields before invoking API; logs and rejects invalid input.

### 10.4 AnalyticsService

**File**: `src/app/services/analytics.service.js`

**Purpose**:
- Fetch analytics aggregates for charts.

**Dependencies**:
- `$http`
- `ENV_CONFIG`
- `LoggingService`

**Public Methods**:
- `getCategorySpending(month)`
- `getMonthlyTrend(range)`
- `getCardDistribution(month)`

**REST Endpoints**:
- `GET {ENV_CONFIG.apiBaseUrl}/analytics/categories?month={month}`
- `GET {ENV_CONFIG.apiBaseUrl}/analytics/monthly-trend?range={range}`
- `GET {ENV_CONFIG.apiBaseUrl}/analytics/card-distribution?month={month}`

### 10.5 BudgetService

**File**: `src/app/services/budget.service.js`

**Purpose**:
- Retrieve budget definitions and current utilization.

**Dependencies**:
- `$http`
- `ENV_CONFIG`
- `LoggingService`

**Public Methods**:
- `getBudgetSummary(month)`

**REST Endpoint**:
- `GET {ENV_CONFIG.apiBaseUrl}/budget?month={month}`

**Business Rules**:
- Map backend response into `BudgetModel` including:
  - `monthlyBudget`
  - `currentSpend`
  - `remainingBudget`
  - `utilizationPercentage`
  - `status` (e.g., `OK`, `WARNING`, `OVERSPEND` based on thresholds from configuration).

### 10.6 WidgetsService

**File**: `src/app/services/widgets.service.js`

**Purpose**:
- Provide widget-specific data such as recent transactions.

**Dependencies**:
- `$http`
- `ENV_CONFIG`
- `LoggingService`

**Public Methods**:
- `getRecentTransactions(limit)`

**REST Endpoint**:
- `GET {ENV_CONFIG.apiBaseUrl}/widgets/recent-transactions?limit={limit}`

### 10.7 LoggingService

**File**: `src/app/services/logging.service.js`

**Purpose**:
- Centralize logging across application.

**Dependencies**:
- `$log`

**Public Methods**:
- `info(message, context)`
- `warn(message, context)`
- `error(message, context)`
- `audit(eventType, context)`

**Rules**:
- Must not log sensitive information (e.g., full card number, PII).

### 10.8 SecurityService

**File**: `src/app/services/security.service.js`

**Purpose**:
- Handle token storage, HTTP authorization header integration, and basic sanitization.

**Dependencies**:
- `$window`

**Public Methods**:
- `getToken()`
- `setToken(token)`
- `clearToken()`

**Consumers**:
- `HttpErrorInterceptor` (for correlation ID, token presence checks).


## 11. Factory Design

### 11.1 ModelFactory

**File**: `src/app/factories/model.factory.js`

**Purpose**:
- Provide helper functions to instantiate and normalize models.

**Dependencies**:
- None (stateless).

**Public Methods**:
- `createCardModel(raw)` → `CardModel`
- `createTransactionModel(raw)` → `TransactionModel`
- `createAnalyticsSummaryModel(raw)` → `AnalyticsSummaryModel`
- `createBudgetModel(raw)` → `BudgetModel`
- `createErrorModel(raw)` → `ErrorModel`

**Rules**:
- Must not perform REST calls.
- Stateless; returns new objects per invocation.


## 12. Directive Design

### 12.1 kpiCard Directive

**File**: `src/app/directives/kpi-card.directive.js`

**Purpose**:
- Render a KPI card with label, value, icon, and optional click behaviour.

**Scope Bindings**:
- `label` – `@`
- `value` – `<`
- `icon` – `@`
- `tooltip` – `@?`
- `onClick` – `&?`

**Configuration**:
- `restrict`: `E`
- `scope`: isolated.
- `bindToController`: true.
- `controller`: inline or dedicated controller.
- `controllerAs`: `vm`.
- `templateUrl`: `templates/shared/kpi-card.html`.

**UI Specs**:
- Bootstrap card style with:
  - Consistent width/height.
  - Icon on left or top.
  - Value in large font.
  - Label in smaller font.

### 12.2 spendingChart Directive

**File**: `src/app/directives/spending-chart.directive.js`

**Purpose**:
- Render Chart.js charts for spending analytics.

**Scope Bindings**:
- `chartData` – `<`
- `chartOptions` – `<`
- `chartType` – `@` (e.g., `bar`, `line`, `pie`, `doughnut`).

**Configuration**:
- `restrict`: `E`
- `scope`: isolated.
- `bindToController`: true.
- `controllerAs`: `vm`.
- `templateUrl`: `templates/shared/spending-chart.html`.

**States**:
- Loading: spinner overlay.
- Empty: message "No data available for selected period".
- Error: message from `ErrorModel`.

### 12.3 transactionsTable Directive

**File**: `src/app/directives/transactions-table.directive.js`

**Purpose**:
- Render responsive table for transactions with sorting and pagination.

**Scope Bindings**:
- `items` – `<` (array of `TransactionModel`).
- `pagination` – `<`.
- `onPageChange` – `&`.
- `onSortChange` – `&`.

**Configuration**:
- `restrict`: `E`
- `scope`: isolated.
- `templateUrl`: `templates/shared/transactions-table.html`.

**UI Specs**:
- Columns: Date, Merchant, Category, Card, Amount, Status, Remarks.
- Right-align numeric values (Amount).
- Date formatted via `dateFormat` filter.

### 12.4 budgetProgress Directive

**File**: `src/app/directives/budget-progress.directive.js`

**Purpose**:
- Render progress bar representing budget utilization.

**Scope Bindings**:
- `budget` – `<` (`BudgetModel`).

**Configuration**:
- `restrict`: `E`
- `templateUrl`: `templates/shared/budget-progress.html`.

**UI Specs**:
- Progress bar colour changes based on status:
  - `OK` – green.
  - `WARNING` – amber.
  - `OVERSPEND` – red.

### 12.5 recentTransactions Directive

**File**: `src/app/directives/recent-transactions.directive.js`

**Purpose**:
- Render list of recent transactions.

**Scope Bindings**:
- `items` – `<` (`TransactionModel[]`).

**Configuration**:
- `restrict`: `E`
- `templateUrl`: `templates/shared/recent-transactions.html`.


## 13. Filter Design

### 13.1 currencyFormat Filter

**File**: `src/app/filters/currency-format.filter.js`

**Purpose**:
- Format numeric values into currency strings according to configured currency.

**Input**:
- number.

**Output**:
- string (e.g., "₹45,872.00" or "$45,872.00").

### 13.2 dateFormat Filter

**File**: `src/app/filters/date-format.filter.js`

**Purpose**:
- Format date/time values into consistent UI representation.

**Input**:
- Date or ISO string.

**Output**:
- string (e.g., "2026-07-20").

### 13.3 percentage Filter

**File**: `src/app/filters/percentage.filter.js`

**Purpose**:
- Convert decimal values (0–1 or 0–100) into percentage display with `x%`.

**Input**:
- number.

**Output**:
- string (e.g., "78%".


## 14. Model Design

### 14.1 CardModel

**File**: `src/app/models/card.model.js`

**Properties**:
- `id` – string, required.
- `name` – string, card name.
- `bank` – string, issuing bank.
- `maskedNumber` – string, masked card number (e.g., "XXXX-XXXX-XXXX-1234").
- `creditLimit` – number ≥ 0.
- `availableCredit` – number ≥ 0.
- `outstandingAmount` – number ≥ 0.
- `billingDate` – string (YYYY-MM-DD).
- `dueDate` – string (YYYY-MM-DD).

**Sample JSON**:
```json
{
  "id": "card-123",
  "name": "Primary Card",
  "bank": "ABC Bank",
  "maskedNumber": "XXXX-XXXX-XXXX-1234",
  "creditLimit": 200000,
  "availableCredit": 150000,
  "outstandingAmount": 50000,
  "billingDate": "2026-07-15",
  "dueDate": "2026-08-05"
}
```

### 14.2 TransactionModel

**File**: `src/app/models/transaction.model.js`

**Properties**:
- `id` – string, required.
- `date` – string (ISO date).
- `merchant` – string.
- `category` – string.
- `cardId` – string.
- `cardName` – string.
- `bank` – string.
- `amount` – number ≥ 0.
- `status` – string (e.g., "Completed", "Pending").
- `remarks` – string (optional).

**Sample JSON**:
```json
{
  "id": "txn-001",
  "date": "2026-07-10",
  "merchant": "SuperMart",
  "category": "Shopping",
  "cardId": "card-123",
  "cardName": "Primary Card",
  "bank": "ABC Bank",
  "amount": 998.50,
  "status": "Completed",
  "remarks": "Weekend groceries"
}
```

### 14.3 AnalyticsSummaryModel

**File**: `src/app/models/analytics-summary.model.js`

**Properties**:
- `month` – string (YYYY-MM), required.
- `totalMonthlySpend` – number ≥ 0.
- `totalCreditLimit` – number ≥ 0.
- `availableCredit` – number ≥ 0.
- `outstandingAmount` – number ≥ 0.
- `utilizationPercentage` – number between 0 and 100.
- `transactionCount` – integer ≥ 0.

**Sample JSON**:
```json
{
  "month": "2026-07",
  "totalMonthlySpend": 45872,
  "totalCreditLimit": 200000,
  "availableCredit": 154128,
  "outstandingAmount": 45872,
  "utilizationPercentage": 22.94,
  "transactionCount": 92
}
```

### 14.4 BudgetModel

**File**: `src/app/models/budget.model.js`

**Properties**:
- `month` – string (YYYY-MM).
- `monthlyBudget` – number ≥ 0.
- `currentSpend` – number ≥ 0.
- `remainingBudget` – number ≥ 0.
- `utilizationPercentage` – number between 0 and 100.
- `status` – string (`"OK" | "WARNING" | "OVERSPEND"`).

**Sample JSON**:
```json
{
  "month": "2026-07",
  "monthlyBudget": 50000,
  "currentSpend": 45872,
  "remainingBudget": 4138,
  "utilizationPercentage": 91.74,
  "status": "WARNING"
}
```

### 14.5 ErrorModel

**File**: `src/app/models/error.model.js`

**Properties**:
- `code` – string (e.g., `"DASH-001"`).
- `message` – string (user-friendly message).
- `details` – string (developer-oriented, not exposed to user).
- `correlationId` – string.

**Sample JSON**:
```json
{
  "code": "DASH-001",
  "message": "Some analytics are temporarily unavailable. Please try again later.",
  "details": "AnalyticsSvc timeout",
  "correlationId": "abc123"
}
```


## 15. REST API Contract

All APIs are relative to `ENV_CONFIG.apiBaseUrl`.

### 15.1 Dashboard Summary – `GET /dashboard/summary`

- **Method**: GET
- **URL**: `/dashboard/summary`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Query Parameters**: optional `month` (default: current month).
- **Request Body**: none.

**Success Response**:
- Status: 200
- Body: `AnalyticsSummaryModel`.

**Error Responses**:
- 400 – Invalid request (e.g., invalid month).
- 401 – Unauthorized.
- 403 – Forbidden.
- 404 – Summary not found.
- 408 – Timeout.
- 500 – Internal server error.

**Timeout**:
- `ENV_CONFIG.apiTimeoutMs` (e.g., 5000 ms).

**Retry Policy**:
- Client-side: 3 attempts with exponential backoff for transient errors (e.g., 5xx, 408).

### 15.2 Cards – `GET /cards`

- **Method**: GET
- **URL**: `/cards`

**Response**:
- 200: `CardModel[]`.

Errors: same pattern as 15.1.

### 15.3 Transactions – `GET /transactions`

- **Method**: GET
- **URL**: `/transactions`
- **Query Parameters**:
  - `merchant`
  - `category`
  - `bank`
  - `cardId`
  - `dateFrom` (YYYY-MM-DD)
  - `dateTo` (YYYY-MM-DD)
  - `sortField` in {`amount`, `date`}
  - `sortDirection` in {`asc`, `desc`}
  - `page` (integer ≥ 1)
  - `pageSize` (integer in allowed range).

**Response**:
- 200: `{ "items": [TransactionModel], "totalCount": number }`.

### 15.4 Analytics – Categories

**Method**: GET
**URL**: `/analytics/categories`
**Query**: `month`.

**Response**:
- 200: Array of `{ category: string, totalSpend: number }` for categories:
  - Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous.

### 15.5 Analytics – Monthly Trend

**Method**: GET
**URL**: `/analytics/monthly-trend`
**Query**: `range` (e.g., `"6M"` for last six months).

**Response**:
- 200: Array of `{ month: string, totalSpend: number }`.

### 15.6 Analytics – Card Distribution

**Method**: GET
**URL**: `/analytics/card-distribution`
**Query**: `month`.

**Response**:
- 200: Array of `{ cardName: string, totalSpend: number }`.

### 15.7 Budget – `GET /budget`

**Method**: GET
**URL**: `/budget`
**Query**: `month`.

**Response**:
- 200: `BudgetModel`.

### 15.8 Widgets – Recent Transactions – `GET /widgets/recent-transactions`

**Method**: GET
**URL**: `/widgets/recent-transactions`
**Query**: `limit` (default 5).

**Response**:
- 200: `TransactionModel[]`.

### 15.9 Error Schema

All error responses use:

```json
{
  "code": "DASH-001",
  "message": "Some analytics are temporarily unavailable. Please try again later.",
  "correlationId": "abc123"
}
```


## 16. Configuration Design

### 16.1 ENV_CONFIG Constant

**File**: `src/app/config/config.constants.js`

**Properties**:
- `apiBaseUrl` – string; default from `env.default.json`.
- `apiTimeoutMs` – number; default 5000.
- `maxLookbackMonths` – number; e.g., 12.
- `useMockData` – boolean; `false` in prod, `true` in dev.
- `featureFlags` – object; e.g., `{ enableBudget: true, enableCardDistribution: true }`.
- `telemetry` – object; e.g., `{ enabled: true }`.

### 16.2 Environment Files

**env.default.json**:
- Baseline configuration values.

**env.dev.json**:
- Overrides for dev environment (e.g., mock mode enabled).

**env.prod.json**:
- Production configuration with real `apiBaseUrl`, `useMockData = false`.

**Rules**:
- No configuration shall be hardcoded in controllers or services; all must come through `ENV_CONFIG`.
- Toggling `useMockData` switches between production and mock services without code changes.


## 17. Mock Implementation Design

Mock services live in `src/mock/*.js` and sample data in `src/data/samples/*.json`.

### 17.1 Mock Mode Behaviour

- When `ENV_CONFIG.useMockData === true`, services use mock implementations instead of `$http`:
  - `DashboardService` → `dashboard.mock.js`
  - `CardsService` → `cards.mock.js`
  - `TransactionsService` → `transactions.mock.js`
  - `AnalyticsService` → `analytics.mock.js`
  - `BudgetService` → `budget.mock.js`
  - `WidgetsService` → `widgets.mock.js`

### 17.2 Mock Implementation Standards

- Use `$q` and `$timeout` to simulate network latency and failures.
- Have the same method signatures and return the same models and error schema as production services.
- Simulate:
  - Success responses with sample JSON from `data/samples`.
  - Delay (e.g., 300–800 ms) via `$timeout`.
  - Failure conditions such as 500 or timeout by rejecting promises with `ErrorModel`.

### 17.3 Example Mock Scenario

- `dashboard.mock.js`:
  - `getSummary()` resolves `AnalyticsSummaryModel` sample JSON after 400 ms.

- `transactions.mock.js`:
  - `getTransactions()` resolves sample transactions with filters applied in-memory.


## 18. UI Specification

### 18.1 Overall Layout

- Header: `templates/layout/header.html`
  - Contains logo, page title, user info, and navigation tabs for Dashboard, Cards, Transactions, Analytics, Budget.
- Sidebar: `templates/layout/sidebar.html`
  - Optional quick filters or card list.
- Main Content: `templates/dashboard/dashboard.html`
  - Uses Bootstrap container and rows.
- Footer: `templates/layout/footer.html`
  - Contains copyright and version info.

### 18.2 Dashboard Page Structure (`dashboard.html`)

Order of components:
1. KPI Summary section – `summary-kpi.html` using `kpiCard` directive.
2. Filters (if any global filters, e.g., month selector).
3. Charts – `analytics-panel.html` using `spendingChart` directive.
4. Detailed panels – cards, transactions, budget, recent transactions.

### 18.3 KPI Cards

Each KPI card:
- Fields:
  - Label: e.g., "Total Monthly Spend".
  - Value: formatted via `currencyFormat` or `percentage` filter.
  - Icon: e.g., money, credit-card, list.
- Layout:
  - Bootstrap `col-md-3 col-sm-6` grid.
  - Card height consistent (e.g., 150px).

### 18.4 Charts

- Category-wise Spending: bar or pie chart.
- Monthly Spending Trend: line chart.
- Card-wise Spending Distribution: pie or doughnut chart.

Chart behaviour:
- Responsive resizing.
- Tooltips showing category/card and value.
- Legends indicating colours.

### 18.5 Transaction Table

Specs:
- Columns: Date, Merchant, Category, Card, Amount, Status, Remarks.
- Sorting: clicking on Amount or Date toggles asc/desc.
- Pagination: `vm.pagination` controls page navigation.
- Empty State: message "No transactions found for selected criteria.".
- Error State: shows `vm.error.message` with retry button.

### 18.6 Budget Panel

Specs:
- Text fields for Monthly Budget, Current Spend, Remaining Budget, Utilization Percentage.
- Progress bar with colour-coded status (green/amber/red).

### 18.7 Recent Transactions Widget

Specs:
- List of 5 recent transactions.
- Each item shows date, merchant, amount, and status.

### 18.8 Responsive Behaviour

- Desktop/Laptop:
  - Full dashboard layout with sidebar, multiple columns.
- Tablet:
  - Sidebar collapses to top; fewer columns per row.
- Mobile:
  - Single-column layout; stacked cards and widgets.

No horizontal scroll for typical usage; vertical scroll allowed.

### 18.9 Accessibility

- Keyboard navigation:
  - TAB order follows top-to-bottom, left-to-right.
- ARIA labels:
  - Provided for icons and interactive elements.
- Colour contrast:
  - Must meet WCAG AA where possible.

### 18.10 UI States

- Loading State:
  - Spinner overlay for main dashboard and charts.
  - Disabled buttons during load.

- Empty State:
  - Display informative messages when no data.

- Error State:
  - Display friendly messages with retry actions.


## 19. Data Flow

### 19.1 Dashboard Summary – Success Flow

1. User navigates to `/dashboard`.
2. `DashboardController.initialize()` is invoked.
3. Controller calls `DashboardService.getSummary()`.
4. Service calls `GET /dashboard/summary` (or mock).
5. Backend returns `AnalyticsSummaryModel` JSON.
6. Service maps JSON via `ModelFactory.createAnalyticsSummaryModel`.
7. Controller updates `vm.summary` and passes values to `kpiCard` directive.
8. UI shows updated KPI cards.

### 19.2 Cards – Success Flow

1. User navigates to `/cards` or cards panel.
2. `CardsController.initialize()` is invoked.
3. Calls `CardsService.getCards()`.
4. Backend returns `CardModel[]`.
5. Controller updates `vm.cards`.
6. UI renders card list.

### 19.3 Transactions – Success Flow

1. User navigates to `/transactions`.
2. `TransactionsController.initialize()` loads initial transactions.
3. Controller builds filters, sort, and pagination.
4. Calls `TransactionsService.getTransactions(filters, sort, pagination)`.
5. Backend returns items and totalCount.
6. Service maps to `TransactionModel[]`.
7. Controller sets `vm.transactions` and `vm.pagination`.
8. `transactionsTable` directive renders table.

### 19.4 Analytics – Success Flow

1. User navigates to `/analytics`.
2. `AnalyticsController.initialize()` calls analytics service methods.
3. Services call respective `/analytics/*` endpoints.
4. Responses mapped to chart data structures.
5. Controller sets `vm.categorySpending`, `vm.monthlyTrend`, `vm.cardDistribution`.
6. `spendingChart` directive renders Chart.js instances.

### 19.5 Budget – Success Flow

1. User navigates to `/budget`.
2. `BudgetController.initialize()` calls `BudgetService.getBudgetSummary(month)`.
3. Backend returns `BudgetModel`.
4. Controller sets `vm.budgetSummary`.
5. `budgetProgress` directive renders progress bar and metrics.

### 19.6 Recent Transactions – Success Flow

1. DashboardController calls `WidgetsService.getRecentTransactions(5)` during `initialize()`.
2. Backend returns `TransactionModel[]` (max 5). 
3. Controller sets `vm.recentTransactions`.
4. `recentTransactions` directive renders widget.


## 20. Business Rules

### 20.1 Utilization Calculation

- Utilization Percentage = `(outstandingAmount / totalCreditLimit) * 100`.
- Display as percentage; cap at 100 if outstanding exceeds total credit limit.

### 20.2 Budget Status

- `OK`: utilizationPercentage ≤ threshold1 (e.g., 80%).
- `WARNING`: threshold1 < utilizationPercentage ≤ threshold2 (e.g., 90%).
- `OVERSPEND`: utilizationPercentage > threshold2.
- Thresholds retrieved from configuration (ConfigDB via backend) and surfaced via `BudgetService`.

### 20.3 Category Mapping

- Backend maps transactions to categories using ConfigDB; frontend assumes category values in allowed list.

### 20.4 Transaction Filters

- Merchant search uses case-insensitive substring match.
- Date range inclusive: `dateFrom` and `dateTo` included in filter.


## 21. Validation Rules

### 21.1 UI Input Validation

- Merchant search string max length (e.g., 100 chars); disallow special characters known to cause issues (`<`, `>` etc.).
- Date range validation: `dateFrom` must not be after `dateTo`.
- Page size between allowed min and max (e.g., 10–100).

### 21.2 API Request Validation (Client-Side)

- Before calling `TransactionsService.getTransactions`, controller ensures all filters are valid; invalid inputs show errors instead of API calls.

### 21.3 Model Validation

- CardModel numeric fields must be ≥ 0.
- TransactionModel amount must be ≥ 0.
- AnalyticsSummaryModel transactionCount must be ≥ 0.


## 22. Error Handling

### 22.1 HTTP Error Interceptor

**File**: `src/app/interceptors/http-error.interceptor.js`

**Responsibilities**:
- Intercept all `$http` responses.
- Map error responses into `ErrorModel`.
- Attach `correlationId` from response headers or body.

### 22.2 Component-Level Error Behaviour

- Controllers assign `vm.error` when operations fail.
- UI shows error banner with `vm.error.message` and retry button.

### 22.3 Error Types

- Network Errors: show "Unable to reach server" message.
- Timeout Errors: show "Request timed out" message.
- Validation Errors: show user-friendly guidance (e.g., "Please select a valid date range").


## 23. Logging Design

- All errors logged via `LoggingService.error` with context (controller name, operation, correlationId).
- Audit events logged via `LoggingService.audit` for:
  - Dashboard view.
  - Filter changes.
  - Budget view.

Logs exclude sensitive data; only IDs and high-level context.


## 24. Security Design

- Token Handling: `SecurityService` manages tokens; `$http` configured to include `Authorization` header if token present.
- Output Encoding: use `ngSanitize` and AngularJS binding for HTML-safe rendering.
- Input Sanitization: restrict special characters in filter fields as per validation.
- RBAC: enforced by backend; frontend uses token-provided claims only as hints (e.g., feature flags).


## 25. Dependency Map

### 25.1 File-Level Dependencies

- `app.module.js` → AngularJS core modules.
- `app.routes.js` → `ngRoute`, controllers, templates.
- Controllers → Services, LoggingService, HttpErrorInterceptor (indirect).
- Services → `$http`, `ENV_CONFIG`, LoggingService.
- Directives → Controllers (if any), templates, Chart.js (for spendingChart).
- Filters → none (pure).
- Models → none (pure data structures).
- Mocks → `$q`, `$timeout`, ModelFactory.

### 25.2 Component Consumers

- DashboardController consumes DashboardService, WidgetsService.
- CardsController consumes CardsService.
- TransactionsController consumes TransactionsService, CardsService.
- AnalyticsController consumes AnalyticsService.
- BudgetController consumes BudgetService.
- Directives consumed by dashboard templates.


## 26. LLD Validation Checklist

- [x] Application Overview – defined.
- [x] Technology Stack – fixed and compliant.
- [x] Architecture Design – AngularJS MVC SPA with DI.
- [x] Repository Structure – complete and explicit.
- [x] Application Bootstrap Design – module and index.html specified.
- [x] Module Design – root module and config described.
- [x] Routing Design – routes, templates, controllers mapped.
- [x] Component Registry – controllers/services/directives/filters/models listed.
- [x] Controller Design – responsibilities, methods, dependencies specified.
- [x] Service Design – endpoints, methods, and contracts defined.
- [x] Factory Design – model factory defined and stateless.
- [x] Directive Design – bindings, templates, behaviour defined.
- [x] Filter Design – input/output formatting specified.
- [x] Model Design – properties, validation, and sample JSON provided.
- [x] REST API Contract – URLs, methods, responses, errors, timeouts, retries outlined.
- [x] Configuration Design – ENV_CONFIG and env files specified.
- [x] Mock Implementation Design – parity and behaviour described.
- [x] UI Specification – layout, components, responsiveness, states defined.
- [x] Data Flow – success flows for main features outlined.
- [x] Business Rules – utilization, budget, filters described.
- [x] Validation Rules – UI and model validation detailed.
- [x] Error Handling – interceptor and component behaviour described.
- [x] Logging Design – info/warn/error/audit defined.
- [x] Security Design – token handling, sanitization, RBAC boundary described.
- [x] Dependency Map – file-level and component consumers documented.
- [x] LLD Boundary – no source code; only specifications.

This LLD passes all quality gates from `lldgenerationkb` and is implementation-ready for the Code Generation Agent.
