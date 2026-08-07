# Low Level Design (LLD) QE-4105 Monthly Spending Summary Dashboard

## 1. Application Overview

The Monthly Spending Summary Dashboard is a single page application (SPA) built using AngularJS 1.7.9. It provides authenticated users with an analytics-focused view of their credit card spending, including:

- Dashboard summary (total monthly spend, total credit limit, available credit, outstanding amount, utilization percentage, number of transactions).
- Credit card management (multiple card tiles with core attributes and masked card numbers).
- Transaction management (responsive table with searching, filtering, and sorting capabilities).
- Spending analytics (charts for category-wise spending, monthly trends, card-wise distribution, category breakdown).
- Budget tracking (monthly budget, current spend, remaining budget, budget utilization percentage, progress bar).
- Recent transactions widget (latest 5 transactions).

The LLD follows the architecture defined in the HLD while conforming strictly to `lldgenerationkb` standards:

- AngularJS 1.7.9 SPA with ControllerAs syntax and IIFE pattern.
- Clear separation of concerns between controllers, services, factories, directives, filters, and models.
- REST-based communication with a well-defined API contract.
- Centralized configuration and mock mode support.
- Complete dependency mapping and explicit validation, error handling, logging, and security design.

This LLD is implementation-ready and intended to be consumed by a Code Generation Agent to generate the complete front-end application without additional assumptions.

## 2. Technology Stack

The application uses the following technology stack (no upgrades or deviations):

- **Frontend Framework**: AngularJS 1.7.9
- **AngularJS Modules**:
  - `ngRoute` 1.7.9 (routing)
  - `ngAnimate` 1.7.9 (animations, loading indicators)
  - `ngSanitize` 1.7.9 (safe HTML rendering, output encoding)
  - `ui.bootstrap` 2.5.6 (Bootstrap components for AngularJS)
- **UI Layout & Styling**:
  - Bootstrap 3.4.1 (CSS only)
  - Custom CSS (dashboard-specific theming) under `src/assets/css/`
- **Charts**:
  - Chart.js 2.9.4
- **Language & Runtime**:
  - JavaScript (ES5/ES6 where supported by AngularJS 1.7.9)
  - HTML5, CSS3
- **Browsers Supported**:
  - Google Chrome (latest stable)
  - Microsoft Edge (latest stable)

No jQuery or `bootstrap.min.js` are included unless explicitly required; this application does **not** require jQuery.

## 3. Architecture Design

### 3.1 Architectural Style

- **SPA Architecture** using AngularJS 1.7.9.
- **MVC Pattern** implemented via AngularJS modules, controllers, and services.
- **ControllerAs** syntax for controllers (`vm` alias in templates).
- **Dependency Injection** for all components.
- **IIFE (Immediately Invoked Function Expression)** pattern for each JS file to prevent global scope pollution.
- **REST-based communication** with backend APIs exposed via an API Gateway.

### 3.2 Logical Layers (Frontend Perspective)

- **Presentation Layer (Client)**:
  - AngularJS controllers, directives, templates, filters.
  - Handles ViewModel state, user interactions, and navigation.

- **Domain Logic Layer (Client-side Services)**:
  - AngularJS services responsible for orchestrating dashboards, managing card/transaction/budget data and interacting with REST APIs.

- **Integration Layer (Client-side)**:
  - REST API services encapsulating HTTP calls to the API Gateway.
  - Mock services for offline/testing modes.

- **Configuration Layer**:
  - Environment-specific JSON configuration files.
  - Angular constants for REST endpoints, timeouts, feature flags.

### 3.3 Major Frontend Components

- Dashboard Summary Page
- Credit Card Tiles Component
- Transactions Table Page
- Analytics Charts Component
- Budget Summary Component
- Recent Transactions Widget
- Common Layout (header, footer, navigation)

These are implemented via a combination of routes, controllers, directives, services, and models as detailed below.

## 4. Repository Structure

The repository structure conforms to `lldgenerationkb` standards and is aligned with the HLD scope.

```text
src/
  app/
    controllers/
      dashboard.controller.js
      cards.controller.js
      transactions.controller.js
      analytics.controller.js
      budget.controller.js
      recent-transactions.controller.js
      layout.controller.js

    services/
      dashboard.service.js
      cards.service.js
      transactions.service.js
      analytics.service.js
      budget.service.js
      config.service.js
      logging.service.js
      security.service.js

    factories/
      model.factory.js

    directives/
      card-tile.directive.js
      kpi-card.directive.js
      transactions-table.directive.js
      analytics-charts.directive.js
      budget-summary.directive.js
      recent-transactions.directive.js

    filters/
      currency-format.filter.js
      date-format.filter.js
      percentage-format.filter.js

    models/
      dashboard-summary.model.js
      card.model.js
      transaction.model.js
      analytics-category-summary.model.js
      analytics-monthly-trend.model.js
      analytics-card-distribution.model.js
      budget-summary.model.js
      recent-transaction.model.js
      error-response.model.js

    config/
      app.module.js
      app.routes.js
      config.constants.js
      http-interceptor.config.js

    routes/
      (covered in app.routes.js)

  templates/
    layout/
      header.html
      footer.html
      sidebar.html
      shell.html

    dashboard/
      dashboard.html

    cards/
      cards.html

    transactions/
      transactions.html

    analytics/
      analytics.html

    budget/
      budget.html

    widgets/
      recent-transactions.html
      kpi-card.html
      card-tile.html
      transactions-table.html
      analytics-charts.html
      budget-summary.html

  assets/
    css/
      app.css
      dashboard.css
    js/
      (non-Angular helper utilities if required)
    images/
      (icons and illustrations for empty/error states)
    fonts/
      (if custom fonts needed)

  mock/
    dashboard-summary.mock.json
    cards.mock.json
    transactions.mock.json
    analytics-category-summary.mock.json
    analytics-monthly-trend.mock.json
    analytics-card-distribution.mock.json
    budget-summary.mock.json
    recent-transactions.mock.json

  data/
    (optional sample datasets for local testing)

index.html
README.md
```

### 4.1 File Responsibilities & Dependencies (High-level)

Each file is documented in detail in the Component Registry and respective design sections. At a high level:

- `app.module.js`: Defines root Angular module `app` and registers dependencies.
- `app.routes.js`: Configures SPA routes and associates controllers/templates.
- Controllers: Manage view state and delegate to services.
- Services: Contain business logic and REST interactions.
- Directives: Encapsulate reusable UI components for tiles, KPI cards, tables, charts, and widgets.
- Filters: Format currency, dates, and percentages.
- Models: Define application data structures.
- Configuration: Defines constants, environment-specific settings, and HTTP interceptors.
- Mock JSON: Provide mock responses that mirror REST API contracts.

## 5. Application Bootstrap Design

### 5.1 index.html Structure

`index.html` bootstraps the AngularJS SPA and loads required resources in the correct order.

#### 5.1.1 Layout

- Root HTML with `ng-app="app"`.
- A single `div` with `ng-view` acting as the primary view container.
- Header and footer included via layout directive/templates or via main shell view.

#### 5.1.2 Resource Loading Order

1. **CSS**:
   - Bootstrap 3.4.1 CSS via CDN.
   - `assets/css/app.css`.
   - `assets/css/dashboard.css`.

2. **JavaScript Libraries (CDN)**:
   - AngularJS 1.7.9
   - Angular Route 1.7.9
   - Angular Animate 1.7.9
   - Angular Sanitize 1.7.9
   - Angular UI Bootstrap 2.5.6
   - Chart.js 2.9.4

3. **Application Scripts**:
   - `src/app/config/app.module.js`
   - `src/app/config/app.routes.js`
   - `src/app/config/config.constants.js`
   - `src/app/config/http-interceptor.config.js`
   - Controllers, services, factories, directives, filters, models (order ensuring module config loads before components).

#### 5.1.3 Angular Bootstrap

- `ng-app="app"` attribute on `<html>` or `<body>`.
- No manual `angular.bootstrap` call; Angular auto-bootstrap is used.

### 5.2 App Module Definition

File: `src/app/config/app.module.js`

- Angular module name: `app`.
- Dependencies:
  - `ngRoute`
  - `ngAnimate`
  - `ngSanitize`
  - `ui.bootstrap`

Responsibilities:
- Define the root module.
- Register config and run blocks.

Config block responsibilities:
- Route configuration delegated to `app.routes.js`.
- HTTP interceptor registration from `http-interceptor.config.js`.

Run block responsibilities:
- Initialize global settings (e.g., load environment config via `ConfigService`).
- Set up `$rootScope` event handlers for route changes, global error notifications.

## 6. Module Design

There is a single AngularJS module `app` for the SPA.

### 6.1 Module `app`

- **Name**: `app`
- **File**: `src/app/config/app.module.js`
- **Dependencies**: `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap`
- **Registered Components**: All controllers, services, factories, directives, filters, models listed in this LLD.

Responsibilities:
- Serve as the root module for the entire dashboard application.
- Coordinate configuration and run-time initialization.

## 7. Routing Design

Routing is defined in `src/app/config/app.routes.js` using `$routeProvider`.

### 7.1 Routes

Each route uses `templateUrl`, `controller`, `controllerAs` syntax and supports navigation defined in the HLD.

1. **Dashboard Summary Route**
   - URL: `/dashboard`
   - Template: `templates/dashboard/dashboard.html`
   - Controller: `DashboardController`
   - Controller Alias: `vm`
   - Resolve:
     - `dashboardSummary`: calls `DashboardService.getSummary(selectedMonth)` using current month by default.

2. **Credit Cards Route**
   - URL: `/cards`
   - Template: `templates/cards/cards.html`
   - Controller: `CardsController`
   - Controller Alias: `vm`
   - Resolve:
     - `cards`: calls `CardsService.getCards()`.

3. **Transactions Route**
   - URL: `/transactions`
   - Template: `templates/transactions/transactions.html`
   - Controller: `TransactionsController`
   - Controller Alias: `vm`
   - Resolve:
     - `initialFilters`: default filter values from `ConfigService.getDefaultTransactionFilters()`.

4. **Analytics Route**
   - URL: `/analytics`
   - Template: `templates/analytics/analytics.html`
   - Controller: `AnalyticsController`
   - Controller Alias: `vm`
   - Resolve:
     - `categorySummary`: `AnalyticsService.getCategorySummary(defaultPeriod)`.
     - `monthlyTrend`: `AnalyticsService.getMonthlyTrend(defaultPeriod)`.
     - `cardDistribution`: `AnalyticsService.getCardDistribution(defaultPeriod)`.

5. **Budget Route**
   - URL: `/budget`
   - Template: `templates/budget/budget.html`
   - Controller: `BudgetController`
   - Controller Alias: `vm`
   - Resolve:
     - `budgetSummary`: `BudgetService.getBudgetSummary(selectedMonth)`.

6. **Default Route**
   - URL: `otherwise`
   - Redirect: `/dashboard`

### 7.2 Route Behaviour

- Invalid URLs redirect to `/dashboard`.
- Route changes trigger loading indicators; controllers show loading state until resolve promises complete.
- On route failure, a generic error view is displayed via `LayoutController` and user is offered a retry or navigation back to `/dashboard`.

## 8. Component Registry

This registry lists all major AngularJS components with their paths, dependencies, and primary responsibilities.

### 8.1 Controllers

1. `DashboardController`
   - Type: Controller
   - File: `src/app/controllers/dashboard.controller.js`
   - Module: `app`
   - Registered As: `DashboardController`
   - Dependencies:
     - `DashboardService`
     - `BudgetService`
     - `TransactionsService`
     - `AnalyticsService`
     - `LoggingService`
   - Consumers:
     - Template `templates/dashboard/dashboard.html`
     - Directives: `kpiCard`, `budgetSummary`, `analyticsCharts`, `recentTransactions`, `cardTile`

2. `CardsController`
   - File: `src/app/controllers/cards.controller.js`
   - Dependencies:
     - `CardsService`
     - `LoggingService`

3. `TransactionsController`
   - File: `src/app/controllers/transactions.controller.js`
   - Dependencies:
     - `TransactionsService`
     - `ConfigService`
     - `LoggingService`

4. `AnalyticsController`
   - File: `src/app/controllers/analytics.controller.js`
   - Dependencies:
     - `AnalyticsService`
     - `ConfigService`
     - `LoggingService`

5. `BudgetController`
   - File: `src/app/controllers/budget.controller.js`
   - Dependencies:
     - `BudgetService`
     - `AnalyticsService`
     - `LoggingService`

6. `RecentTransactionsController`
   - File: `src/app/controllers/recent-transactions.controller.js`
   - Dependencies:
     - `TransactionsService`
     - `LoggingService`

7. `LayoutController`
   - File: `src/app/controllers/layout.controller.js`
   - Dependencies:
     - `$location`
     - `ConfigService`

### 8.2 Services

1. `DashboardService`
   - File: `src/app/services/dashboard.service.js`
   - Dependencies: `$http`, `$q`, `ConfigService`, `LoggingService`, `SecurityService`

2. `CardsService`
   - File: `src/app/services/cards.service.js`
   - Dependencies: `$http`, `$q`, `ConfigService`, `LoggingService`, `SecurityService`

3. `TransactionsService`
   - File: `src/app/services/transactions.service.js`
   - Dependencies: `$http`, `$q`, `ConfigService`, `LoggingService`, `SecurityService`

4. `AnalyticsService`
   - File: `src/app/services/analytics.service.js`
   - Dependencies: `$http`, `$q`, `ConfigService`, `LoggingService`, `SecurityService`

5. `BudgetService`
   - File: `src/app/services/budget.service.js`
   - Dependencies: `$http`, `$q`, `ConfigService`, `LoggingService`, `SecurityService`

6. `ConfigService`
   - File: `src/app/services/config.service.js`
   - Dependencies: `$http`, `$q`

7. `LoggingService`
   - File: `src/app/services/logging.service.js`
   - Dependencies: `$log`

8. `SecurityService`
   - File: `src/app/services/security.service.js`
   - Dependencies: `$window`, `$q`

### 8.3 Factories

1. `ModelFactory`
   - File: `src/app/factories/model.factory.js`
   - Dependencies: None (pure factory)
   - Purpose: Create instances of models with default values (e.g., DashboardSummaryModel, CardModel, TransactionModel).

### 8.4 Directives

1. `cardTile`
   - File: `src/app/directives/card-tile.directive.js`
   - Template: `templates/widgets/card-tile.html`

2. `kpiCard`
   - File: `src/app/directives/kpi-card.directive.js`
   - Template: `templates/widgets/kpi-card.html`

3. `transactionsTable`
   - File: `src/app/directives/transactions-table.directive.js`
   - Template: `templates/widgets/transactions-table.html`

4. `analyticsCharts`
   - File: `src/app/directives/analytics-charts.directive.js`
   - Template: `templates/widgets/analytics-charts.html`

5. `budgetSummary`
   - File: `src/app/directives/budget-summary.directive.js`
   - Template: `templates/widgets/budget-summary.html`

6. `recentTransactions`
   - File: `src/app/directives/recent-transactions.directive.js`
   - Template: `templates/widgets/recent-transactions.html`

### 8.5 Filters

1. `currencyFormat`
   - File: `src/app/filters/currency-format.filter.js`

2. `dateFormat`
   - File: `src/app/filters/date-format.filter.js`

3. `percentageFormat`
   - File: `src/app/filters/percentage-format.filter.js`

### 8.6 Models

Models are JS objects defined under `src/app/models/` and created via `ModelFactory`.

- `DashboardSummaryModel`
- `CardModel`
- `TransactionModel`
- `AnalyticsCategorySummaryModel`
- `AnalyticsMonthlyTrendModel`
- `AnalyticsCardDistributionModel`
- `BudgetSummaryModel`
- `RecentTransactionModel`
- `ErrorResponseModel`

## 9. Controller Design

### 9.1 DashboardController

- **File**: `src/app/controllers/dashboard.controller.js`
- **Registered As**: `DashboardController`
- **Alias**: `vm`
- **Dependencies**: `DashboardService`, `BudgetService`, `TransactionsService`, `AnalyticsService`, `LoggingService`

#### Responsibilities

- Initialize dashboard summary for the current month.
- Display KPI cards:
  - Total Monthly Spend
  - Total Credit Limit
  - Available Credit
  - Outstanding Amount
  - Utilization Percentage
  - Number of Transactions
- Coordinate budget summary, analytics charts, and recent transactions widget on the dashboard.
- Handle user interactions for changing selected month and refreshing data.
- Manage loading, empty, and error states for dashboard components.

#### ViewModel State

- `vm.selectedMonth`: string (YYYY-MM) representing the current selected month.
- `vm.dashboardSummary`: `DashboardSummaryModel` instance.
- `vm.budgetSummary`: `BudgetSummaryModel` instance.
- `vm.analyticsCategorySummary`: `AnalyticsCategorySummaryModel`.
- `vm.analyticsMonthlyTrend`: `AnalyticsMonthlyTrendModel`.
- `vm.analyticsCardDistribution`: `AnalyticsCardDistributionModel`.
- `vm.recentTransactions`: Array of `RecentTransactionModel` (max 5).
- `vm.isLoading`: boolean.
- `vm.hasError`: boolean.
- `vm.errorMessage`: string.

#### Public Methods

- `vm.initialize()`
  - Called on controller instantiation.
  - Loads dashboard summary, budget summary, analytics, and recent transactions for the default month.

- `vm.changeMonth(month)`
  - Input: `month` (string, YYYY-MM).
  - Behaviour: Updates `vm.selectedMonth` and reloads data.

- `vm.refreshData()`
  - Behaviour: Re-fetches dashboard summary, budget summary, analytics, and recent transactions for `vm.selectedMonth`.

- `vm.retry()`
  - Behaviour: Called when an error state is displayed; attempts to reload all dashboard components.

#### Error Handling

- If any service call fails:
  - `vm.hasError = true`.
  - `vm.errorMessage` set to a user-friendly message (e.g., "Unable to retrieve dashboard information. Please try again.").
  - Error logged via `LoggingService.error()` with correlation id from `ErrorResponseModel`.

### 9.2 CardsController

- **File**: `src/app/controllers/cards.controller.js`
- **Dependencies**: `CardsService`, `LoggingService`

#### Responsibilities

- Retrieve and display list of cards with:
  - Card name
  - Issuing bank
  - Masked card number
  - Credit limit
  - Available credit
  - Current outstanding
  - Billing date
  - Due date
- Handle loading, empty, and error states for card list.

#### ViewModel State

- `vm.cards`: Array of `CardModel`.
- `vm.isLoading`: boolean.
- `vm.hasError`: boolean.
- `vm.errorMessage`: string.

#### Public Methods

- `vm.initialize()`
  - Loads card list via `CardsService.getCards()`.

- `vm.retry()`
  - Retries card fetch on error.

### 9.3 TransactionsController

- **File**: `src/app/controllers/transactions.controller.js`
- **Dependencies**: `TransactionsService`, `ConfigService`, `LoggingService`

#### Responsibilities

- Display responsive transactions table with fields:
  - Transaction date
  - Merchant name
  - Category
  - Card used
  - Amount
  - Payment status
  - Remarks
- Manage filters and search capabilities:
  - Search by merchant.
  - Filter by category, bank, card, date range.
  - Sort by amount and date.
- Coordinate pagination and loading states.

#### ViewModel State

- `vm.filters`:
  - `vm.filters.merchant`: string.
  - `vm.filters.category`: string.
  - `vm.filters.bank`: string.
  - `vm.filters.cardId`: string.
  - `vm.filters.dateFrom`: Date/string.
  - `vm.filters.dateTo`: Date/string.

- `vm.sort`:
  - `vm.sort.field`: 'amount' | 'date'.
  - `vm.sort.direction`: 'asc' | 'desc'.

- `vm.pagination`:
  - `vm.pagination.page`: number.
  - `vm.pagination.pageSize`: number (configured via `ConfigService`).

- `vm.transactions`: Array of `TransactionModel`.
- `vm.totalCount`: number.
- `vm.isLoading`: boolean.
- `vm.hasError`: boolean.
- `vm.errorMessage`: string.

#### Public Methods

- `vm.initialize()`
  - Loads initial filters from `ConfigService` and fetches first page of transactions.

- `vm.applyFilters()`
  - Validates filter values (date ranges, category, card) and calls `TransactionsService.searchTransactions(filters, sort, pagination)`.

- `vm.changePage(page)`
  - Updates pagination and re-fetches transaction list.

- `vm.changeSort(field)`
  - Toggles sort direction and re-fetches transaction list.

- `vm.clearFilters()`
  - Resets filters to default values and reloads data.

- `vm.retry()`
  - Retries transactions fetch after error.

### 9.4 AnalyticsController

- **File**: `src/app/controllers/analytics.controller.js`
- **Dependencies**: `AnalyticsService`, `ConfigService`, `LoggingService`

#### Responsibilities

- Manage analytics views and chart filters.
- Load category-wise spending, monthly trend, and card-wise distribution analytics.
- Provide chart configuration and handle loading/error states.

#### ViewModel State

- `vm.period`: selected period (e.g., last 3 months, last 6 months), derived from `ConfigService`.
- `vm.categorySummary`: `AnalyticsCategorySummaryModel`.
- `vm.monthlyTrend`: `AnalyticsMonthlyTrendModel`.
- `vm.cardDistribution`: `AnalyticsCardDistributionModel`.
- `vm.isLoading`: boolean.
- `vm.hasError`: boolean.
- `vm.errorMessage`: string.

#### Public Methods

- `vm.initialize()`
  - Loads default period and fetches analytics data.

- `vm.changePeriod(period)`
  - Updates period and reloads analytics data.

- `vm.retry()`
  - Retries analytics fetch on error.

### 9.5 BudgetController

- **File**: `src/app/controllers/budget.controller.js`
- **Dependencies**: `BudgetService`, `AnalyticsService`, `LoggingService`

#### Responsibilities

- Display budget tracking view:
  - Monthly budget
  - Current spend
  - Remaining budget
  - Budget utilization percentage
  - Progress bar indicating utilization
- Manage selection of month/period for budget view.

#### ViewModel State

- `vm.selectedMonth`: string (YYYY-MM).
- `vm.budgetSummary`: `BudgetSummaryModel`.
- `vm.isLoading`: boolean.
- `vm.hasError`: boolean.
- `vm.errorMessage`: string.

#### Public Methods

- `vm.initialize()`
  - Loads budget summary via `BudgetService.getBudgetSummary(selectedMonth)`.

- `vm.changeMonth(month)`
  - Changes selected month and reloads budget summary.

- `vm.retry()`
  - Retries budget fetch after error.

### 9.6 RecentTransactionsController

- **File**: `src/app/controllers/recent-transactions.controller.js`
- **Dependencies**: `TransactionsService`, `LoggingService`

#### Responsibilities

- Load latest 5 transactions for display in the widget.
- Manage loading and error states specific to the widget.

#### ViewModel State

- `vm.recentTransactions`: Array of `RecentTransactionModel` (max length 5).
- `vm.isLoading`: boolean.
- `vm.hasError`: boolean.
- `vm.errorMessage`: string.

#### Public Methods

- `vm.initialize()`
  - Calls `TransactionsService.getRecentTransactions(limit)` with `limit = 5`.

- `vm.retry()`
  - Retries fetch after error.

### 9.7 LayoutController

- **File**: `src/app/controllers/layout.controller.js`
- **Dependencies**: `$location`, `ConfigService`

#### Responsibilities

- Manage global layout elements (header, footer, sidebar).
- Provide navigation functions (e.g., `navigateToDashboard`, `navigateToTransactions`).

#### ViewModel State

- `vm.currentRoute`: string.

#### Public Methods

- `vm.navigate(path)`
  - Calls `$location.path(path)`.

## 10. Service Design

### 10.1 DashboardService

- **File**: `src/app/services/dashboard.service.js`
- **Dependencies**: `$http`, `$q`, `ConfigService`, `LoggingService`, `SecurityService`

#### Responsibilities

- Retrieve dashboard summary from API Gateway.
- Map response into `DashboardSummaryModel`.
- Coordinate calls to card, transaction, and analytics APIs if the backend provides separate endpoints.

#### Public Methods

- `getSummary(month)`
  - Input: `month` (string YYYY-MM).
  - Behaviour:
    - Builds URL: `ConfigService.getApiBaseUrl() + '/dashboard/summary?month=' + month`.
    - Sends `GET` request with appropriate headers (auth token via `SecurityService`).
    - Applies timeout from `ConfigService.getApiTimeoutMs()`.
    - On success:
      - Validates response schema against `DashboardSummaryModel`.
      - Maps response into `DashboardSummaryModel`.
    - On error:
      - Logs error via `LoggingService.error()`.
      - Rejects promise with `ErrorResponseModel`.

### 10.2 CardsService

- **File**: `src/app/services/cards.service.js`

#### Public Methods

- `getCards()`
  - Behaviour:
    - Calls `GET /cards` on API Gateway.
    - Maps response list into array of `CardModel`.
    - Enforces masking rules (although API should already mask).

### 10.3 TransactionsService

- **File**: `src/app/services/transactions.service.js`

#### Public Methods

- `searchTransactions(filters, sort, pagination)`
  - Input: `filters`, `sort`, `pagination`.
  - Builds query string with merchant, category, bank, card, date range, sort, page, pageSize.
  - Calls `GET /transactions`.
  - Validates filter ranges (dateFrom <= dateTo, amount ranges where applicable).
  - Maps response into `TransactionModel` array and total count.

- `getRecentTransactions(limit)`
  - Input: `limit` (number, default 5, max 10).
  - Calls `GET /transactions/recent?limit=limit`.
  - Maps response to `RecentTransactionModel` array.

### 10.4 AnalyticsService

- **File**: `src/app/services/analytics.service.js`

#### Public Methods

- `getCategorySummary(period)`
  - Calls `GET /analytics/category?period=...`.
  - Returns `AnalyticsCategorySummaryModel`.

- `getMonthlyTrend(period)`
  - Calls `GET /analytics/monthlyTrend?period=...`.
  - Returns `AnalyticsMonthlyTrendModel`.

- `getCardDistribution(period)`
  - Calls `GET /analytics/cardDistribution?period=...`.
  - Returns `AnalyticsCardDistributionModel`.

### 10.5 BudgetService

- **File**: `src/app/services/budget.service.js`

#### Public Methods

- `getBudgetSummary(month)`
  - Calls `GET /budget/summary?month=...`.
  - Returns `BudgetSummaryModel`.

### 10.6 ConfigService

- **File**: `src/app/services/config.service.js`

#### Responsibilities

- Load environment configuration from `env.default.json`, `env.dev.json`, `env.prod.json`.
- Provide accessors:
  - `getApiBaseUrl()`
  - `getApiTimeoutMs()`
  - `getMaxLookbackMonths()`
  - `getDefaultTransactionFilters()`
  - `isMockModeEnabled()`
  - `getFeatureFlags()`

### 10.7 LoggingService

- **File**: `src/app/services/logging.service.js`

#### Responsibilities

- Provide centralized logging for info, warning, error, and audit events.

#### Public Methods

- `info(message, context)`
- `warn(message, context)`
- `error(message, context)`
- `audit(message, context)`

### 10.8 SecurityService

- **File**: `src/app/services/security.service.js`

#### Responsibilities

- Handle client-side token storage and retrieval.
- Attach authorization headers to API calls.
- Provide helper methods for checking authentication status.

#### Public Methods

- `getAuthToken()`
- `isAuthenticated()`
- `attachAuthHeaders(config)`

## 11. Factory Design

### 11.1 ModelFactory

- **File**: `src/app/factories/model.factory.js`

#### Responsibilities

- Create model instances with default values.

#### Public Methods (Examples)

- `createDashboardSummary()` -> `DashboardSummaryModel`
- `createCard()` -> `CardModel`
- `createTransaction()` -> `TransactionModel`
- `createBudgetSummary()` -> `BudgetSummaryModel`

All factory methods:
- Initialize required fields with defaults.
- Ensure numeric fields default to 0, boolean to false, and strings to empty.

## 12. Directive Design

### 12.1 cardTile Directive

- **File**: `src/app/directives/card-tile.directive.js`
- **Restrict**: `E`
- **Scope**:
  - `card`: `=` (two-way binding, `CardModel`)
- **TemplateUrl**: `templates/widgets/card-tile.html`
- **Controller**: `CardTileController` (if needed for formatting behaviour)
- **ControllerAs**: `vm`
- **bindToController**: true

#### Usage Example

```html
<card-tile card="vm.card"></card-tile>
```

### 12.2 kpiCard Directive

- **File**: `src/app/directives/kpi-card.directive.js`
- **Restrict**: `E`
- **Scope**:
  - `label`: `@`
  - `value`: `@`
  - `iconClass`: `@`
  - `valueFormat`: `@` (e.g., 'currency', 'percentage', 'number')
- **TemplateUrl**: `templates/widgets/kpi-card.html`
- **ControllerAs**: `vm`

#### Usage Example

```html
<kpi-card label="Total Spend" value="{{ vm.dashboardSummary.totalSpend | currencyFormat }}" icon-class="fa fa-credit-card" value-format="currency"></kpi-card>
```

### 12.3 transactionsTable Directive

- **File**: `src/app/directives/transactions-table.directive.js`
- **Restrict**: `E`
- **Scope**:
  - `transactions`: `=` (array of `TransactionModel`)
  - `filters`: `=`
  - `sort`: `=`
  - `pagination`: `=`
  - `onFilterChange`: `&`
  - `onSortChange`: `&`
  - `onPageChange`: `&`
- **TemplateUrl**: `templates/widgets/transactions-table.html`
- **ControllerAs**: `vm`

#### Usage Example

```html
<transactions-table
  transactions="vm.transactions"
  filters="vm.filters"
  sort="vm.sort"
  pagination="vm.pagination"
  on-filter-change="vm.applyFilters()"
  on-sort-change="vm.changeSort(field)"
  on-page-change="vm.changePage(page)">
</transactions-table>
```

### 12.4 analyticsCharts Directive

- **File**: `src/app/directives/analytics-charts.directive.js`

#### Scope

- `categorySummary`: `=`
- `monthlyTrend`: `=`
- `cardDistribution`: `=`

#### Template

- `templates/widgets/analytics-charts.html`

Charts use Chart.js 2.9.4 with responsive configuration to render:
- Bar chart for category-wise spending.
- Line chart for monthly trend.
- Pie/doughnut chart for card-wise distribution.

### 12.5 budgetSummary Directive

- **File**: `src/app/directives/budget-summary.directive.js`

#### Scope

- `budgetSummary`: `=` (`BudgetSummaryModel`)

#### Template

- `templates/widgets/budget-summary.html`

Displays:
- Monthly budget.
- Current spend.
- Remaining budget.
- Utilization percentage with a progress bar.

### 12.6 recentTransactions Directive

- **File**: `src/app/directives/recent-transactions.directive.js`

#### Scope

- `recentTransactions`: `=` (array of `RecentTransactionModel`)

#### Template

- `templates/widgets/recent-transactions.html`

Displays latest 5 transactions with date, merchant, amount, and status.

## 13. Filter Design

### 13.1 currencyFormat Filter

- **File**: `src/app/filters/currency-format.filter.js`

#### Input

- Number representing monetary amount.

#### Output

- Formatted currency string (e.g., `₹1,234.50` or `$1,234.50` as per configuration).

#### Behaviour

- Uses configuration from `ConfigService` for currency symbol and locale.

### 13.2 dateFormat Filter

- **File**: `src/app/filters/date-format.filter.js`

#### Input

- Date object or ISO date string.

#### Output

- Formatted date string (e.g., `DD MMM YYYY`).

### 13.3 percentageFormat Filter

- **File**: `src/app/filters/percentage-format.filter.js`

#### Input

- Number between 0 and 1 or 0 and 100.

#### Output

- Percentage string with `%` suffix.

## 14. Model Design

All models are plain JavaScript objects used to represent data throughout the client.

### 14.1 DashboardSummaryModel

- **File**: `src/app/models/dashboard-summary.model.js`

#### Properties

- `totalSpend`: number (>= 0, required).
- `totalCreditLimit`: number (>= 0, required).
- `availableCredit`: number (>= 0, required).
- `outstandingAmount`: number (>= 0, required).
- `utilizationPercentage`: number (0–100, required).
- `transactionCount`: number (>= 0, required).
- `month`: string (YYYY-MM, required).

#### Sample JSON

```json
{
  "totalSpend": 120000.50,
  "totalCreditLimit": 300000.00,
  "availableCredit": 180000.00,
  "outstandingAmount": 120000.00,
  "utilizationPercentage": 40.0,
  "transactionCount": 125,
  "month": "2026-07"
}
```

### 14.2 CardModel

- **File**: `src/app/models/card.model.js`

#### Properties

- `id`: string (required).
- `cardName`: string (required).
- `issuingBank`: string (required).
- `maskedCardNumber`: string (required, masked format like `XXXX-XXXX-XXXX-1234`).
- `creditLimit`: number (>= 0, required).
- `availableCredit`: number (>= 0, required).
- `outstandingAmount`: number (>= 0, required).
- `billingDate`: string (YYYY-MM-DD, required).
- `dueDate`: string (YYYY-MM-DD, required).
- `utilizationPercentage`: number (0–100, derived).

### 14.3 TransactionModel

- **File**: `src/app/models/transaction.model.js`

#### Properties

- `id`: string (required).
- `cardId`: string (required).
- `transactionDate`: string (ISO date, required).
- `merchantName`: string (required).
- `category`: string (one of defined categories, required).
- `amount`: number (>= 0, required).
- `paymentStatus`: string (e.g., `PAID`, `PENDING`, `FAILED`).
- `remarks`: string (optional).

### 14.4 AnalyticsCategorySummaryModel

- **File**: `src/app/models/analytics-category-summary.model.js`

#### Properties

- `categories`: array of objects:
  - `categoryName`: string.
  - `totalSpend`: number.

### 14.5 AnalyticsMonthlyTrendModel

- **File**: `src/app/models/analytics-monthly-trend.model.js`

#### Properties

- `months`: array of strings (YYYY-MM).
- `values`: array of numbers (spend per month).

### 14.6 AnalyticsCardDistributionModel

- **File**: `src/app/models/analytics-card-distribution.model.js`

#### Properties

- `cards`: array of objects:
  - `cardName`: string.
  - `totalSpend`: number.

### 14.7 BudgetSummaryModel

- **File**: `src/app/models/budget-summary.model.js`

#### Properties

- `month`: string (YYYY-MM, required).
- `monthlyBudget`: number (>= 0, required).
- `currentSpend`: number (>= 0, required).
- `remainingBudget`: number (>= 0, required).
- `budgetUtilizationPercentage`: number (0–100, required).

### 14.8 RecentTransactionModel

- **File**: `src/app/models/recent-transaction.model.js`

#### Properties

- `id`: string.
- `transactionDate`: string.
- `merchantName`: string.
- `amount`: number.
- `paymentStatus`: string.

### 14.9 ErrorResponseModel

- **File**: `src/app/models/error-response.model.js`

#### Properties

- `statusCode`: number.
- `message`: string.
- `correlationId`: string.

## 15. REST API Contract

The frontend interacts with the API Gateway using REST endpoints defined by the HLD.

### 15.1 Common Standards

- **Base URL**: Provided by `ConfigService.getApiBaseUrl()` (e.g., `https://api.example.com`).
- **Authentication**: Authorization header with bearer token provided by `SecurityService.getAuthToken()`.
- **Timeout**: `ConfigService.getApiTimeoutMs()` (e.g., 5000 ms).
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <token>`

- **Error Response Structure** (mapped to `ErrorResponseModel`):

```json
{
  "statusCode": 500,
  "message": "Unable to process the request.",
  "correlationId": "abc123"
}
```

### 15.2 `GET /dashboard/summary`

- **Purpose**: Get dashboard summary for a given month.
- **Method**: `GET`
- **URL**: `/dashboard/summary?month={YYYY-MM}`
- **Query Parameters**:
  - `month`: required, format `YYYY-MM`.

- **Success (200)**:
  - Body: `DashboardSummaryModel` JSON.

- **Errors**:
  - `400 Bad Request`: invalid month format.
  - `401 Unauthorized`: missing/invalid token.
  - `403 Forbidden`: unauthorized user.
  - `404 Not Found`: no data for given month.
  - `408 Request Timeout`: slow backend.
  - `500 Internal Server Error`: unexpected error.

### 15.3 `GET /cards`

- **Purpose**: Retrieve cards for the authenticated user.
- **Success (200)**:
  - Body: array of `CardModel`.

### 15.4 `GET /transactions`

- **Purpose**: Search and filter transactions.
- **Query Parameters**:
  - `merchant`: optional.
  - `category`: optional (must be one of defined categories).
  - `bank`: optional.
  - `cardId`: optional.
  - `dateFrom`: optional, `YYYY-MM-DD`.
  - `dateTo`: optional, `YYYY-MM-DD`.
  - `sortField`: `amount` | `date`.
  - `sortDirection`: `asc` | `desc`.
  - `page`: number.
  - `pageSize`: number.

- **Success (200)**:
  - Body:

```json
{
  "items": [ /* array of TransactionModel */ ],
  "totalCount": 1000
}
```

### 15.5 `GET /transactions/recent`

- **Purpose**: Get most recent transactions.
- **Query Parameters**:
  - `limit`: optional (default 5, max 10).

- **Success (200)**:
  - Body: array of `RecentTransactionModel`.

### 15.6 `GET /analytics/category`

- **Purpose**: Get category-wise spending.
- **Query Parameters**:
  - `period`: e.g., `last3Months`, `last6Months`.

- **Success (200)**:
  - Body: `AnalyticsCategorySummaryModel`.

### 15.7 `GET /analytics/monthlyTrend`

- **Purpose**: Get monthly spending trend.

- **Success (200)**:
  - Body: `AnalyticsMonthlyTrendModel`.

### 15.8 `GET /analytics/cardDistribution`

- **Purpose**: Get card-wise spending distribution.

- **Success (200)**:
  - Body: `AnalyticsCardDistributionModel`.

### 15.9 `GET /budget/summary`

- **Purpose**: Get budget summary for a month.
- **Query Parameters**:
  - `month`: required.

- **Success (200)**:
  - Body: `BudgetSummaryModel`.

## 16. Configuration Design

### 16.1 Environment Configuration Files

- `env.default.json`
- `env.dev.json`
- `env.prod.json`

#### Properties

- `apiBaseUrl`: string.
- `apiTimeoutMs`: number.
- `maxLookbackMonths`: number.
- `useMockData`: boolean.
- `featureFlags`: object.
- `telemetry`: object.

### 16.2 Angular Constants

File: `src/app/config/config.constants.js`

- `ENV_CONFIG`: constant containing loaded environment configuration.

Consumers:
- `ConfigService`.
- All services that need base URL, timeouts, or feature flags.

## 17. Mock Implementation Design

Each REST endpoint has a corresponding mock JSON file under `mock/`.

### 17.1 Mock Mode Behaviour

- When `useMockData = true` in environment JSON:
  - Services load data from mock JSON files using `$http.get('mock/<file>.json')` instead of API.
  - Mock responses mimic the real API contracts exactly (same fields, types, status codes where applicable).

### 17.2 Mock Files

- `dashboard-summary.mock.json`: `DashboardSummaryModel` sample.
- `cards.mock.json`: array of `CardModel`.
- `transactions.mock.json`: paginated transaction sample.
- `analytics-category-summary.mock.json`: `AnalyticsCategorySummaryModel` sample.
- `analytics-monthly-trend.mock.json`: `AnalyticsMonthlyTrendModel` sample.
- `analytics-card-distribution.mock.json`: `AnalyticsCardDistributionModel` sample.
- `budget-summary.mock.json`: `BudgetSummaryModel` sample.
- `recent-transactions.mock.json`: array of `RecentTransactionModel`.

Mock responses include:
- Success data.
- Empty datasets.
- Simulated error responses using a separate mock error JSON if needed.

## 18. UI Specification

### 18.1 Layout

- **Shell Layout** (`templates/layout/shell.html`):
  - Header with application title "Monthly Spending Summary".
  - Navigation bar with links to Dashboard, Cards, Transactions, Analytics, Budget.
  - Main content area (`ng-view`).
  - Footer with environment and version info.

- **Responsive Behaviour**:
  - On desktop: horizontal navigation bar, multi-column dashboard.
  - On tablet/mobile: collapsed navigation (hamburger), stacked cards and charts.

### 18.2 Dashboard Page (`templates/dashboard/dashboard.html`)

- **Sections**:
  - KPI Summary row of KPI cards.
  - Budget summary section.
  - Analytics charts section.
  - Recent transactions widget.
  - Card tiles section.

### 18.3 Cards Page (`templates/cards/cards.html`)

- Grid of card tiles (one tile per card) with masked card numbers and financial info.

### 18.4 Transactions Page (`templates/transactions/transactions.html`)

- Filters panel (top) with fields for merchant, category, bank, card, date range.
- Transactions table (below) with sorting and pagination.

### 18.5 Analytics Page (`templates/analytics/analytics.html`)

- Filters for analytics period and card selection.
- Multiple charts for category summary, monthly trend, and card distribution.

### 18.6 Budget Page (`templates/budget/budget.html`)

- Month selector.
- Budget summary widget with progress bar.

## 19. Data Flow

### 19.1 Dashboard Success Flow

User selects month (or default month):

1. `DashboardController.initialize()` calls `DashboardService.getSummary(month)`.
2. `DashboardService` calls `GET /dashboard/summary` (or mock file).
3. API returns `DashboardSummaryModel`.
4. `DashboardService` validates and maps to model.
5. Controller updates `vm.dashboardSummary`.
6. KPI cards, budget summary, analytics charts, and recent transactions widgets update via bindings.

### 19.2 Dashboard Failure Flow

1. API call fails (network, timeout, 500).
2. `DashboardService` logs error and rejects with `ErrorResponseModel`.
3. Controller sets `vm.hasError` and `vm.errorMessage`.
4. UI shows error banner with Retry button.
5. User clicks Retry; `vm.retry()` re-invokes `initialize()`.

Similar success and failure flows apply to Cards, Transactions, Analytics, Budget, and Recent Transactions as per their controllers and services.

## 20. Business Rules

### 20.1 Monthly Window

- The HLD notes ambiguity between calendar month vs billing cycle.
- LLD will treat **month** as a logical period provided by backend (string `YYYY-MM`), and uses it as-is without redefining business logic.
- Backend must ensure consistency; frontend displays received values.

### 20.2 Utilization Percentage

- Utilization percentage displayed on dashboard and card tiles is provided by backend.
- Frontend must not recompute; only formats value.

### 20.3 Category Breakdown

- Categories displayed (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous) are provided via analytics data and configuration.
- Frontend only renders categories present in responses.

### 20.4 Budget Calculations

- Budget summary values (budget, spend, remaining, utilization) are provided by backend.
- Frontend does not modify or recalculate.

## 21. Validation Rules

### 21.1 Client-side Input Validation

- **Date Range**:
  - `dateFrom` and `dateTo` must be valid dates.
  - `dateFrom` <= `dateTo`.
  - Range must not exceed `ConfigService.getMaxLookbackMonths()`.

- **Merchant Search**:
  - String length limited (e.g., <= 100 characters).
  - No special characters that could cause injection; sanitized via `ngSanitize`.

- **Category/Bank/Card Filters**:
  - Allow only values from lists provided by backend/config.

### 21.2 Response Validation

- Each service validates required properties in responses before mapping to models.
- If validation fails, services log error and return `ErrorResponseModel`.

## 22. Error Handling

- Standard error mapping for REST calls:
  - 400: Show validation error message.
  - 401: Redirect to login or show authentication error.
  - 403: Show authorization error.
  - 404: Show "No data" message.
  - 408: Show timeout error and suggest retry.
  - 500: Show generic error message.

- All errors include correlation ID when available.

## 23. Logging Design

- Logging handled by `LoggingService` with methods for info, warning, error, and audit.
- Important events (route changes, filter applications, errors) are logged along with context.
- Sensitive data (card numbers, user credentials) are never logged.

## 24. Security Design

- Token-based authentication enforced via `SecurityService`.
- All REST requests include bearer tokens.
- Input validation and output encoding use AngularJS best practices and `ngSanitize`.
- No direct handling of full card numbers; only masked numbers are displayed.

## 25. Dependency Map

### 25.1 Controllers to Services

- `DashboardController`: DashboardService, BudgetService, TransactionsService, AnalyticsService, LoggingService.
- `CardsController`: CardsService, LoggingService.
- `TransactionsController`: TransactionsService, ConfigService, LoggingService.
- `AnalyticsController`: AnalyticsService, ConfigService, LoggingService.
- `BudgetController`: BudgetService, AnalyticsService, LoggingService.
- `RecentTransactionsController`: TransactionsService, LoggingService.
- `LayoutController`: ConfigService.

### 25.2 Services to Config/Logging/Security

- All API-facing services depend on `ConfigService`, `LoggingService`, and `SecurityService`.

### 25.3 Directives to Models

- UI directives are bound to typed models as defined in Model Design.

## 26. LLD Validation Checklist

The LLD has been validated against `lldgenerationkb` quality gates:

- Mandatory sections 1–26 are present.
- Technology stack conforms to AngularJS 1.7.9 SPA standards.
- Repository structure is fully defined with clear file responsibilities.
- All components (controllers, services, factories, directives, filters, models, configuration) are explicitly defined.
- REST API contracts are specified for all required features.
- Mock implementation design matches API contracts and supports `useMockData` flag.
- UI specification covers layout, dashboard, cards, transactions, analytics, budget, and widgets with responsive behaviour.
- Data flows include success and failure scenarios.
- Business rules, validation, error handling, logging, and security are detailed and do not conflict with HLD.
- No implementation assumptions about backend business logic are made beyond what HLD specifies; frontend treats backend as source of truth.

Validation status: **PASS**
