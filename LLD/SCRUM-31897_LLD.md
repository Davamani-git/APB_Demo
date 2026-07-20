# Low Level Design (LLD) – SCRUM-31897 – Application Intake and Dashboard

---

## 1. Application Overview

### 1.1 Purpose

This LLD defines the implementation-ready specification for the **Application Intake and Dashboard** capability described in HLD `SCRUM-31897`.

The goal is to provide reviewers and approvers with a unified **AngularJS 1.7.9**-based web dashboard to view, search, filter, sort, and navigate financing applications across lifecycle states (**New, In Review, Approved, Rejected, etc.**) backed entirely by **mock synthetic data**.

### 1.2 Scope

This LLD covers:

- AngularJS SPA client implementation (dashboard, filters, state navigation, application summary view).
- REST API contracts between the AngularJS app and the backend.
- Backend domain services (Dashboard Service, State Service, Mock Data Service, UI Configuration Service) exposed as REST endpoints.
- Mock data generation and retrieval for synthetic financing applications.
- Configuration, validation, error handling, logging, and security standards.
- Complete repository structure for the `APB_Demo` repo under branch `INJ-001`.

Out of scope (per HLD and lldgenerationkb):

- Production integrations with real external systems (represented as adapters only).
- Implementation source code (HTML/CSS/JS/Java, etc.).
- Deployment, infrastructure provisioning, and CI/CD details.

### 1.3 Supported Browsers

- Google Chrome (latest stable).
- Microsoft Edge (latest stable).

---

## 2. Technology Stack

### 2.1 Frontend

- **HTML5** – structure of index and templates.
- **CSS3** – visual styling; Bootstrap 3.4.1 for responsive grid.
- **JavaScript (ES6)** – application logic.
- **AngularJS 1.7.9** – core SPA framework.
- **Angular Route 1.7.9** – routing.
- **Angular Animate 1.7.9** – animations for transitions and loading states.
- **Angular Sanitize 1.7.9** – secure HTML binding.
- **Angular UI Bootstrap 2.5.6** – modal/dialog, pagination, tabs.
- **Chart.js 2.9.4** – data visualizations (KPI charts, trend lines).
- **Bootstrap 3.4.1 (CSS only)** – layout and components.

Constraints:

- No jQuery usage unless explicitly added later; current design does **not** require jQuery.
- No `bootstrap.min.js`; interactive behaviour handled via AngularJS and UI Bootstrap.

### 2.2 Backend (Conceptual for Contracts)

Implementation language is not mandated in this LLD; however, the backend is assumed to expose REST endpoints compatible with JSON over HTTPS.

- **RESTful services** (JSON).
- **TLS (HTTPS)** for all client–API communication.

---

## 3. Architecture Design

### 3.1 High-Level Architecture

The application follows a **modular AngularJS SPA architecture** as required by lldgenerationkb:

- Single root Angular module: `appDashboard` (frontend).
- MVC pattern via controllers, services, directives, and templates.
- Business logic encapsulated in **services**; controllers only coordinate UI behaviour.
- UI bootstrapped via `index.html` with `ng-app="appDashboard"` and a single `ng-view`.

Backend logical services (per HLD):

- `ApplicationDashboardService` – orchestrates listing, searching, filtering, and sorting applications.
- `ApplicationStateService` – manages allowed states and provides UI-oriented metadata.
- `MockDataService` – generates and queries synthetic application data.
- `UIConfigurationService` – provides UI configuration (columns, defaults, feature flags).

### 3.2 Layered Architecture

Layers (aligned to HLD):

1. **Client Layer (AngularJS SPA)**
   - Modules: `appDashboard`, `appDashboard.controllers`, `appDashboard.services`, `appDashboard.directives`, `appDashboard.filters`, `appDashboard.models`, `appDashboard.config`.

2. **API Layer**
   - REST endpoints (documented in Section 15) exposed under `/api/dashboard/...` paths.

3. **Domain Services Layer**
   - Logical services described above, behind REST endpoints.

4. **Data Layer (Mock)**
   - Synthetic data store and configuration store (abstracted through REST).

5. **Cross-Cutting**
   - Logging, error handling, validation, configuration, security.

---

## 4. Repository Structure

All paths are relative to repo root `APB_Demo`.

```text
APB_Demo/
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
        filters.controller.js
        state-nav.controller.js
        app-details.controller.js
      services/
        dashboard.service.js
        state.service.js
        mock-data.service.js
        config.service.js
        logging.service.js
        error-handler.service.js
      directives/
        kpi-card.directive.js
        state-tab.directive.js
        app-row.directive.js
        loading-spinner.directive.js
      filters/
        currency-format.filter.js
        date-format.filter.js
        state-label.filter.js
      models/
        application-summary.model.js
        application-detail.model.js
        application-state.model.js
        error.model.js
      routes/
        dashboard.route-config.js
      config/
        env-loader.service.js
    templates/
      dashboard.html
      filters-panel.html
      state-nav.html
      app-details.html
      components/
        kpi-card.html
        state-tab.html
        app-row.html
        loading-spinner.html
    assets/
      css/
        main.css
        dashboard.css
      js/
        vendor/
          angular.js
          angular-route.js
          angular-animate.js
          angular-sanitize.js
          ui-bootstrap.js
          chart.js
          bootstrap.css
    mock/
      data/
        applications.mock.json
        states.mock.json
        config.mock.json
      services/
        mock-dashboard.api.json
        mock-app-details.api.json
    README.md
```

Each file is defined in detail in sections 8–14 and 25.

---

## 5. Application Bootstrap Design

### 5.1 index.html Specification

**Path:** `src/index.html`

**Purpose:** Root HTML document, bootstraps AngularJS SPA and wires global layout.

**Required elements:**

- `<!DOCTYPE html>` and `<html lang="en">`.
- `<head>` containing:
  - `<meta charset="UTF-8">`, viewport meta.
  - Title: `Application Intake and Dashboard`.
  - CSS includes:
    - `assets/js/vendor/bootstrap.css` (Bootstrap 3.4.1).
    - `assets/css/main.css`.
    - `assets/css/dashboard.css`.
- `<body ng-app="appDashboard">`.
- Global layout:
  - Header bar with application title and user info placeholder.
  - Main container with `ng-view` region.
  - Footer with environment indicator (e.g., `Mock Demo Environment`).

**Script load order (bottom of body):**

1. AngularJS and libraries (from assets/js/vendor or CDNs):
   - `angular.js`
   - `angular-route.js`
   - `angular-animate.js`
   - `angular-sanitize.js`
   - `ui-bootstrap.js`
   - `chart.js`
2. Application scripts:
   - `app/app.module.js`
   - `app/app.routes.js`
   - `app/config/config.constants.js`
   - `app/config/env-loader.service.js`
   - `app/services/*.js`
   - `app/models/*.js`
   - `app/filters/*.js`
   - `app/directives/*.js`
   - `app/controllers/*.js`

No inline JS logic beyond Angular bootstrap attributes.

### 5.2 Angular Module Bootstrap

**File:** `src/app/app.module.js`

**Angular registration:**

- Create root module:

  - Name: `appDashboard`
  - Dependencies:
    - `ngRoute`
    - `ngAnimate`
    - `ngSanitize`
    - `ui.bootstrap`

**Responsibilities:**

- Define `appDashboard` module (single point). All other files use `angular.module('appDashboard')` with no dependency array.
- Register run block and global configuration if required.

**Config and Run blocks:**

- Config block to:
  - Configure `$locationProvider` as needed (e.g., HTML5 mode off for simplicity).
  - Register `$httpProvider` interceptors for error handling.
- Run block to:
  - Load environment configuration (`EnvLoaderService`).
  - Initialize logging service with environment settings.

---

## 6. Module Design

Submodules are logical; registration uses the single `appDashboard` module and namespaces by folder.

### 6.1 Logical Module Groupings

- Controllers – `appDashboard.controllers` (namespace only, physically part of `appDashboard`).
- Services – `appDashboard.services`.
- Directives – `appDashboard.directives`.
- Filters – `appDashboard.filters`.
- Models – `appDashboard.models`.

Each file uses:

```js
(function() {
  'use strict';
  angular.module('appDashboard')
    // component registrations
})();
```

---

## 7. Routing Design

**File:** `src/app/app.routes.js`

**Angular dependency:** `ngRoute`.

### 7.1 Route Definitions

1. **Dashboard Route**
   - URL: `#/dashboard`
   - Template: `templates/dashboard.html`
   - Controller: `DashboardController`
   - ControllerAs: `vm`

2. **Application Details Route**
   - URL: `#/applications/:applicationId`
   - Template: `templates/app-details.html`
   - Controller: `AppDetailsController`
   - ControllerAs: `vm`

3. **Default/Fallback Route**
   - Any unmatched URL redirects to `#/dashboard`.

### 7.2 Resolve Blocks

- For `#/dashboard`:
  - `initialConfig`: loads configuration via `ConfigService.getDashboardConfig()`.
  - `initialStates`: loads available states via `StateService.getStates()`.

- For `#/applications/:applicationId`:
  - `applicationSummary`: loads selected application summary via `DashboardService.getApplicationDetail(applicationId)`.

### 7.3 Routing Rules

- Every `templateUrl` maps to an existing template.
- Every controller exists under `controllers/` and is registered.
- Default route ensures invalid routes redirect to dashboard.

---

## 8. Component Registry

### 8.1 Controllers

- `DashboardController` – `app/controllers/dashboard.controller.js`
- `FiltersController` – `app/controllers/filters.controller.js`
- `StateNavController` – `app/controllers/state-nav.controller.js`
- `AppDetailsController` – `app/controllers/app-details.controller.js`

### 8.2 Services

- `DashboardService` – `app/services/dashboard.service.js`
- `StateService` – `app/services/state.service.js`
- `MockDataService` – `app/services/mock-data.service.js`
- `ConfigService` – `app/services/config.service.js`
- `LoggingService` – `app/services/logging.service.js`
- `ErrorHandlerService` – `app/services/error-handler.service.js`
- `EnvLoaderService` – `app/config/env-loader.service.js`

### 8.3 Directives

- `kpiCard` – `app/directives/kpi-card.directive.js`
- `stateTab` – `app/directives/state-tab.directive.js`
- `appRow` – `app/directives/app-row.directive.js`
- `loadingSpinner` – `app/directives/loading-spinner.directive.js`

### 8.4 Filters

- `currencyFormat` – `app/filters/currency-format.filter.js`
- `dateFormat` – `app/filters/date-format.filter.js`
- `stateLabel` – `app/filters/state-label.filter.js`

### 8.5 Models

- `ApplicationSummary` – `app/models/application-summary.model.js`
- `ApplicationDetail` – `app/models/application-detail.model.js`
- `ApplicationState` – `app/models/application-state.model.js`
- `ErrorModel` – `app/models/error.model.js`

### 8.6 Configuration

- `ENV_CONFIG` constants – `app/config/config.constants.js`.
- `env.default.json`, `env.dev.json`, `env.prod.json`.

Each component’s responsibilities and dependencies are detailed below.

---

## 9. Controller Design

### 9.1 DashboardController

**File:** `app/controllers/dashboard.controller.js`

**Purpose:** Orchestrate the main dashboard view including application list, KPI cards, charts, and interaction with filters and state navigation.

**Dependencies (injected):**

- `DashboardService`
- `StateService`
- `ConfigService`
- `LoggingService`
- `ErrorHandlerService`
- `$routeParams` (if needed for contextual filters)

**ViewModel (vm):**

- `vm.applications` – `ApplicationSummary[]` list for grid/cards.
- `vm.kpis` – KPI metrics (e.g., totalApplications, inReviewCount, approvedCount, rejectedCount).
- `vm.charts` – chart configuration for Chart.js (datasets, labels).
- `vm.stateFilter` – current selected state.
- `vm.searchCriteria` – text search and filter fields.
- `vm.pagination` – `currentPage`, `pageSize`, `totalItems`.
- `vm.loading` – boolean; controls `loadingSpinner` directive.
- `vm.error` – `ErrorModel | null`.

**Public Methods:**

- `vm.initialize()` – initializes dashboard using resolved data.
- `vm.loadApplications()` – fetches application list from `DashboardService`.
- `vm.onStateChange(stateCode)` – triggered by `StateNavController`/`stateTab` selection.
- `vm.onFiltersChanged(criteria)` – called by `FiltersController` with new filters.
- `vm.onPageChange(newPage)` – updates pagination and reloads data.
- `vm.refresh()` – manual refresh of dashboard.
- `vm.viewDetails(application)` – navigates to details route.

**Error Handling:**

- On failure of `DashboardService` calls, set `vm.error` using `ErrorHandlerService`, log via `LoggingService`, show friendly error message in UI, and present a retry button.

### 9.2 FiltersController

**File:** `app/controllers/filters.controller.js`

**Purpose:** Manage filter inputs (state, product category, date range, amount bucket, search term) and emit changes to `DashboardController`.

**Dependencies:**

- `ConfigService`
- `$scope` or callback bindings via directive.

**ViewModel:**

- `vm.filters` – object containing filters: `state`, `product`, `dateRange`, `amountBucket`, `searchTerm`.

**Public Methods:**

- `vm.applyFilters()` – emit filter change event to parent.
- `vm.clearFilters()` – reset filters to defaults (from `ConfigService`).

### 9.3 StateNavController

**File:** `app/controllers/state-nav.controller.js`

**Purpose:** Control state navigation tabs (New, In Review, Approved, Rejected, etc.).

**Dependencies:**

- `StateService`

**ViewModel:**

- `vm.states` – `ApplicationState[]` list of allowed states.
- `vm.selectedState` – currently active state.

**Public Methods:**

- `vm.selectState(stateCode)` – updates selection and notifies `DashboardController` via callback.

### 9.4 AppDetailsController

**File:** `app/controllers/app-details.controller.js`

**Purpose:** Display summary details and business context for a single application.

**Dependencies:**

- `DashboardService`
- `LoggingService`
- `ErrorHandlerService`
- `$routeParams`

**ViewModel:**

- `vm.application` – `ApplicationDetail`.
- `vm.loading` – boolean for spinner.
- `vm.error` – `ErrorModel | null`.

**Public Methods:**

- `vm.initialize()` – load application detail using `applicationId` from `$routeParams`.
- `vm.retry()` – re-attempt detail fetch.

---

## 10. Service Design

### 10.1 DashboardService

**File:** `app/services/dashboard.service.js`

**Purpose:** Encapsulate business logic for listing, filtering, searching, sorting applications and computing KPIs/charts.

**Dependencies:**

- `$http`
- `ENV_CONFIG`
- `MockDataService` (when `ENV_CONFIG.useMockData === true`)
- `ErrorHandlerService`

**Public Methods:**

- `getApplications(params): Promise<ApplicationSummaryPage>`
  - Inputs:
    - `params.state` (string; e.g., `NEW`, `IN_REVIEW`).
    - `params.page` (number).
    - `params.pageSize` (number).
    - `params.searchTerm` (string).
    - `params.product` (string).
    - `params.dateRange` (object: `from`, `to`).
    - `params.sortBy` (string; e.g., `submittedAt`).
    - `params.sortDirection` (`ASC`/`DESC`).
  - Behaviour:
    - When `useMockData` is true, calls `MockDataService.getApplications(params)`.
    - Otherwise, calls REST endpoint `GET /api/dashboard/applications`.
    - Maps raw responses to `ApplicationSummary` models.
    - Calculates KPIs and chart datasets.

- `getApplicationDetail(applicationId): Promise<ApplicationDetail>`
  - Behaviour similar to above; uses `MockDataService` or REST call.

- `getDashboardKpis(params): Promise<KpiSummary>`
  - Derives counts and metrics from data.

**Private Methods:**

- `buildQuery(params)` – constructs query string.
- `mapSummaryResponse(response)` – maps JSON to model.
- `validateResponse(response)` – ensures required fields are present.

### 10.2 StateService

**File:** `app/services/state.service.js`

**Purpose:** Provide allowed application states and UI metadata.

**Dependencies:**

- `$http`
- `ENV_CONFIG`
- `MockDataService`

**Public Methods:**

- `getStates(): Promise<ApplicationState[]>`
  - When `useMockData` is true, uses `MockDataService.getStates()`.
  - Otherwise, REST: `GET /api/dashboard/states`.

### 10.3 MockDataService

**File:** `app/services/mock-data.service.js`

**Purpose:** Provide mock implementation of backend behaviour.

**Dependencies:**

- `$http`
- `$q`
- `$timeout`
- `ENV_CONFIG`

**Public Methods:**

- `getApplications(params): Promise<ApplicationSummaryPage>`
  - Reads JSON from `mock/data/applications.mock.json`.
  - Applies in-memory filtering, searching, sorting.
  - Simulates latency via `$timeout` using `ENV_CONFIG.mockLatencyMs`.

- `getApplicationDetail(applicationId): Promise<ApplicationDetail>`
  - Reads from same mock JSON file.

- `getStates(): Promise<ApplicationState[]>`
  - Reads from `mock/data/states.mock.json`.

**Failure Simulation:**

- When `ENV_CONFIG.mockFailureRate > 0`, occasionally reject promises with simulated errors to validate error handling.

### 10.4 ConfigService

**File:** `app/services/config.service.js`

**Purpose:** Provide UI configuration metadata.

**Dependencies:**

- `$http`
- `ENV_CONFIG`

**Public Methods:**

- `getDashboardConfig(): Promise<DashboardConfig>`
  - Fetches config from `/api/dashboard/config` or `mock/data/config.mock.json`.

### 10.5 LoggingService

**File:** `app/services/logging.service.js`

**Purpose:** Central logging interface for client-side events.

**Dependencies:**

- `$log`
- `$http` (optional for sending logs to backend).
- `ENV_CONFIG.telemetry`.

**Public Methods:**

- `info(message, context)`
- `warn(message, context)`
- `error(message, context)`
- `audit(eventType, details)` – e.g., `DASHBOARD_LOAD`, `STATE_NAVIGATION`, `FILTER_APPLIED`.

### 10.6 ErrorHandlerService

**File:** `app/services/error-handler.service.js`

**Purpose:** Normalize HTTP and logical errors into `ErrorModel` for UI.

**Dependencies:**

- `LoggingService`

**Public Methods:**

- `toErrorModel(httpResponseOrException): ErrorModel`
  - Maps HTTP status codes to user-friendly messages.

### 10.7 EnvLoaderService

**File:** `app/config/env-loader.service.js`

**Purpose:** Load environment-specific config JSON into `ENV_CONFIG`.

**Public Methods:**

- `loadEnvConfig(envName): Promise<void>` – loads `env.{envName}.json` and merges with defaults.

---

## 11. Factory Design

No dedicated factories beyond model constructors are strictly required by the HLD. To comply with lldgenerationkb and avoid ambiguity, we define a generic model factory.

### 11.1 ModelFactory

**File:** `app/factories/model.factory.js` (not shown in repo listing; must be added under `app/factories/`).

**Purpose:** Create instances of models with defaults.

**Public Methods:**

- `createApplicationSummary(raw)` – returns `ApplicationSummary`.
- `createApplicationDetail(raw)` – returns `ApplicationDetail`.
- `createErrorModel(raw)` – returns `ErrorModel`.

Consumers:

- `DashboardService`
- `ErrorHandlerService`

---

## 12. Directive Design

### 12.1 kpiCard Directive

**File:** `app/directives/kpi-card.directive.js`

**Template:** `templates/components/kpi-card.html`

**Purpose:** Reusable KPI card component.

**Bindings:**

- `label` – `@` – KPI name.
- `value` – `<` – numeric/string value.
- `icon` – `@` – icon CSS class.
- `tooltip` – `@` – explanation.

**Configuration:**

- `restrict: 'E'`
- `scope: { label: '@', value: '<', icon: '@', tooltip: '@' }`
- `bindToController: true`
- `controllerAs: 'vm'`
- `replace: true`

**Usage Example:**

```html
<kpi-card
  label="Total Applications"
  value="vm.kpis.totalApplications"
  icon="fa fa-file-text-o"
  tooltip="Number of active financing applications">
</kpi-card>
```

### 12.2 stateTab Directive

**File:** `app/directives/state-tab.directive.js`

**Template:** `templates/components/state-tab.html`

**Purpose:** Render a navigation tab for a given state.

**Bindings:**

- `state` – `<` – `ApplicationState` object.
- `selectedState` – `<` – currently selected state code.
- `onSelect` – `&` – callback invoked with state code.

**Configuration:**

- `restrict: 'E'`
- `scope: { state: '<', selectedState: '<', onSelect: '&' }`

**Usage Example:**

```html
<state-tab
  ng-repeat="state in vm.states"
  state="state"
  selected-state="vm.selectedState"
  on-select="vm.selectState(code)">
</state-tab>
```

### 12.3 appRow Directive

**File:** `app/directives/app-row.directive.js`

**Template:** `templates/components/app-row.html`

**Purpose:** Render a single application row in the table or card layout.

**Bindings:**

- `application` – `<` – `ApplicationSummary`.
- `onViewDetails` – `&` – callback.

**Usage Example:**

```html
<tr app-row
    ng-repeat="app in vm.applications"
    application="app"
    on-view-details="vm.viewDetails(application)">
</tr>
```

### 12.4 loadingSpinner Directive

**File:** `app/directives/loading-spinner.directive.js`

**Template:** `templates/components/loading-spinner.html`

**Purpose:** Show a centered spinner and optional message while loading.

**Bindings:**

- `visible` – `<` – boolean.
- `message` – `@` – optional.

**Usage Example:**

```html
<loading-spinner visible="vm.loading" message="Loading applications..."></loading-spinner>
```

---

## 13. Filter Design

### 13.1 currencyFormat Filter

**File:** `app/filters/currency-format.filter.js`

**Purpose:** Format monetary values based on configured currency.

**Input:** number.

**Output:** formatted string (e.g., `₹10,000` or `$10,000`).

### 13.2 dateFormat Filter

**File:** `app/filters/date-format.filter.js`

**Purpose:** Format date/time stamps.

**Input:** ISO date string.

**Output:** display string (e.g., `2026-07-20 14:02`).

### 13.3 stateLabel Filter

**File:** `app/filters/state-label.filter.js`

**Purpose:** Map state codes to human-readable labels.

**Input:** state code (`NEW`, `IN_REVIEW`, etc.).

**Output:** label (`New`, `In Review`, `Approved`, `Rejected`).

---

## 14. Model Design

### 14.1 ApplicationSummary Model

**File:** `app/models/application-summary.model.js`

**Purpose:** Represent a single row in dashboard list.

**Properties:**

- `id` – string – non-PII application reference ID (synthetic).
- `product` – string – product category.
- `requestedAmountBucket` – string – e.g., `LOW`, `MEDIUM`, `HIGH`.
- `riskBand` – string – e.g., `LOW`, `MEDIUM`, `HIGH`.
- `state` – string – lifecycle state code.
- `submittedAt` – ISO datetime string.
- `lastUpdatedAt` – ISO datetime string.
- `flags` – string[] – e.g., `DATA_INCOMPLETE`, `MANUAL_REVIEW`.

**Validation:**

- `id` required.
- `state` must be one of allowed states.
- `submittedAt` and `lastUpdatedAt` must be valid dates.
- `requestedAmountBucket` and `riskBand` must be in allowed enumerations.

**Sample JSON:**

```json
{
  "id": "APP-000123",
  "product": "Working Capital Loan",
  "requestedAmountBucket": "MEDIUM",
  "riskBand": "LOW",
  "state": "IN_REVIEW",
  "submittedAt": "2026-07-01T10:32:00Z",
  "lastUpdatedAt": "2026-07-02T09:15:00Z",
  "flags": ["MANUAL_REVIEW"]
}
```

### 14.2 ApplicationDetail Model

**File:** `app/models/application-detail.model.js`

**Purpose:** Represent detailed summary for a single application.

**Properties:**

- All fields from `ApplicationSummary`.
- `stateHistory` – array of `{ state, changedAt }`.
- `riskScore` – number.
- `notes` – string (synthetic, non-sensitive).

**Validation:**

- `stateHistory` must be ordered by `changedAt`.

### 14.3 ApplicationState Model

**File:** `app/models/application-state.model.js`

**Purpose:** Represent an allowed application state for navigation/UI.

**Properties:**

- `code` – string – e.g., `NEW`, `IN_REVIEW`, `APPROVED`, `REJECTED`.
- `label` – string.
- `color` – string (CSS class or hex code).
- `icon` – string (icon class).
- `order` – number – ordering in tabs.

**Sample JSON:**

```json
{
  "code": "IN_REVIEW",
  "label": "In Review",
  "color": "state-in-review",
  "icon": "fa fa-search",
  "order": 2
}
```

### 14.4 ErrorModel

**File:** `app/models/error.model.js`

**Purpose:** Standard representation of errors.

**Properties:**

- `code` – string – e.g., `NETWORK_ERROR`, `VALIDATION_ERROR`.
- `httpStatus` – number – e.g., `500`.
- `message` – string – user-friendly.
- `details` – string (optional; for log correlation only).

---

## 15. REST API Contract

All URLs are relative to `/api/dashboard`.

### 15.1 List Applications

- **Method:** `GET`
- **URL:** `/api/dashboard/applications`

**Request Parameters (query):**

- `state` (optional) – lifecycle state.
- `page` (optional) – default `1`.
- `pageSize` (optional) – default `20`, max `100`.
- `searchTerm` (optional).
- `product` (optional).
- `dateFrom` (optional).
- `dateTo` (optional).
- `sortBy` (optional) – default `submittedAt`.
- `sortDirection` (optional) – default `DESC`.

**Request Headers:**

- `Authorization: Bearer <token>`.
- `Accept: application/json`.

**Success Response (200):**

```json
{
  "items": [
    {
      "id": "APP-000123",
      "product": "Working Capital Loan",
      "requestedAmountBucket": "MEDIUM",
      "riskBand": "LOW",
      "state": "IN_REVIEW",
      "submittedAt": "2026-07-01T10:32:00Z",
      "lastUpdatedAt": "2026-07-02T09:15:00Z",
      "flags": ["MANUAL_REVIEW"]
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalItems": 250,
  "kpis": {
    "totalApplications": 250,
    "newCount": 50,
    "inReviewCount": 100,
    "approvedCount": 80,
    "rejectedCount": 20
  }
}
```

**Error Responses:**

- `400` – invalid parameters.
- `401/403` – authentication/authorization failures.
- `429` – rate limit.
- `500` – internal error.

### 15.2 Get Application Detail

- **Method:** `GET`
- **URL:** `/api/dashboard/applications/{id}`

**Path Parameters:**

- `id` – application reference ID.

**Success Response (200):**

```json
{
  "id": "APP-000123",
  "product": "Working Capital Loan",
  "requestedAmountBucket": "MEDIUM",
  "riskBand": "LOW",
  "state": "IN_REVIEW",
  "submittedAt": "2026-07-01T10:32:00Z",
  "lastUpdatedAt": "2026-07-02T09:15:00Z",
  "flags": ["MANUAL_REVIEW"],
  "stateHistory": [
    {"state": "NEW", "changedAt": "2026-07-01T10:32:00Z"},
    {"state": "IN_REVIEW", "changedAt": "2026-07-01T12:00:00Z"}
  ],
  "riskScore": 0.2,
  "notes": "Synthetic demo application"
}
```

**Error Responses:**

- `404` – not found.
- Others as above.

### 15.3 Get States

- **Method:** `GET`
- **URL:** `/api/dashboard/states`

**Success Response (200):**

```json
[
  {"code": "NEW", "label": "New", "color": "state-new", "icon": "fa fa-plus", "order": 1},
  {"code": "IN_REVIEW", "label": "In Review", "color": "state-in-review", "icon": "fa fa-search", "order": 2},
  {"code": "APPROVED", "label": "Approved", "color": "state-approved", "icon": "fa fa-check", "order": 3},
  {"code": "REJECTED", "label": "Rejected", "color": "state-rejected", "icon": "fa fa-times", "order": 4}
]
```

### 15.4 Get Dashboard Config

- **Method:** `GET`
- **URL:** `/api/dashboard/config`

**Success Response (200):**

```json
{
  "defaultState": "IN_REVIEW",
  "pageSize": 20,
  "visibleColumns": ["id", "product", "requestedAmountBucket", "riskBand", "state", "submittedAt"],
  "featureFlags": {
    "enableCharts": true,
    "enableKpiCards": true
  }
}
```

---

## 16. Configuration Design

### 16.1 ENV_CONFIG Constants

**File:** `app/config/config.constants.js`

**Purpose:** Central configuration object.

**Properties:**

- `apiBaseUrl` – string – base URL (e.g., `/api/dashboard`).
- `apiTimeoutMs` – number – e.g., `5000`.
- `maxPageSize` – number – `100`.
- `useMockData` – boolean.
- `mockLatencyMs` – number – e.g., `300`.
- `mockFailureRate` – number (0–1).
- `featureFlags` – object.
- `telemetry` – object – e.g., `enabled`, `endpoint`.

**Configuration Files:**

- `src/app/config/env.default.json` – baseline values.
- `src/app/config/env.dev.json` – development overrides.
- `src/app/config/env.prod.json` – production/demo overrides.

### 16.2 Consumers

- `DashboardService` – uses `apiBaseUrl`, `apiTimeoutMs`, `maxPageSize`, `useMockData`.
- `MockDataService` – uses `mockLatencyMs`, `mockFailureRate`.
- `LoggingService` – uses `telemetry`.

No configuration is hard-coded in controllers.

---

## 17. Mock Implementation Design

### 17.1 Mock Data Files

- `mock/data/applications.mock.json` – list of synthetic applications.
- `mock/data/states.mock.json` – allowed states.
- `mock/data/config.mock.json` – UI configuration.

### 17.2 Mock Behaviour

- When `ENV_CONFIG.useMockData === true`:
  - `DashboardService` and `StateService` delegate to `MockDataService`.
  - No external network calls are made.

### 17.3 Mock Response Consistency

- Mock JSON structures exactly match REST response contracts defined in Section 15.
- Mock latency and intermittent failures are simulated using `$timeout` and `$q.reject` according to `mockLatencyMs` and `mockFailureRate`.

---

## 18. UI Specification

### 18.1 Layout

**Template:** `templates/dashboard.html`

**Structure:**

- Header: fixed top bar with title and navigation.
- Main Content:
  - Row 1: KPI cards (4–5 cards) using `kpiCard` directive.
  - Row 2: Filters panel (left) and state navigation tabs (top of list).
  - Row 3: Applications table or card grid.
  - Row 4: Charts (e.g., bar chart of applications by state, line chart of submissions over time).
- Footer: environment label and version.

Uses Bootstrap grid:

- `container-fluid` and `row` / `col-md-*` classes.

### 18.2 Tables

- Columns: `ID`, `Product`, `Amount Bucket`, `Risk Band`, `State`, `Submitted At`, `Last Updated`.
- Sorting via click on column header; sorting metadata stored in `vm.pagination.sortBy`, etc.
- Pagination using Angular UI Bootstrap pagination component.

### 18.3 Charts

- Chart.js 2.9.4.

Examples:

- Bar chart: number of applications by state.
- Line chart: submissions over time (last 30 days).

### 18.4 States Visual Representation

- Each state has distinct color and icon (from `ApplicationState` model).
- Non-color cues (icons, labels) ensure accessibility.

### 18.5 Loading/Empty/Error States

- `loadingSpinner` directive shows loading overlay when `vm.loading` is true.
- Empty state: message `"No applications found for selected criteria."` and suggestion to change filters.
- Error state: message `"Unable to retrieve applications."` with `Retry` button bound to `vm.refresh()`.

### 18.6 Accessibility

- Buttons and links have `aria-label` and clear text.
- Tab order flows logically: filters → state tabs → applications list.
- High contrast themes via CSS.

---

## 19. Data Flow

### 19.1 Dashboard Initial Load

1. `DashboardController.initialize()` invoked on route activation.
2. Controller reads resolved `initialConfig` and `initialStates`.
3. Sets `vm.stateFilter` and pagination defaults.
4. Calls `DashboardService.getApplications(params)`.
5. `DashboardService` uses either REST or `MockDataService` based on `useMockData`.
6. Response mapped to `ApplicationSummary[]` and KPIs.
7. View displays data and charts.

### 19.2 State Navigation

1. User clicks a state tab; `StateNavController.selectState(stateCode)`.
2. Emits callback to `DashboardController.onStateChange(stateCode)`.
3. Dashboard reloads applications with new `state` filter.

### 19.3 Filtering/Search

1. User changes filters in filters panel.
2. `FiltersController.applyFilters()` builds filter object.
3. Passes to `DashboardController.onFiltersChanged(criteria)`.
4. Dashboard reloads via `DashboardService.getApplications()`.

### 19.4 Application Detail View

1. User clicks an application row.
2. `DashboardController.viewDetails(application)` navigates to route `#/applications/{id}`.
3. `AppDetailsController.initialize()` calls `DashboardService.getApplicationDetail(id)`.
4. UI renders details or error state.

---

## 20. Business Rules

### 20.1 State Rules

- Allowed states: `NEW`, `IN_REVIEW`, `APPROVED`, `REJECTED` (minimum set; extensible).
- Transitions (for demo):
  - `NEW -> IN_REVIEW -> APPROVED` or `REJECTED`.

Detailed transition criteria are **not specified in the HLD** and must be agreed with business stakeholders; this LLD does not assume specific reasons for transitions.

### 20.2 Filtering Rules

- Page size must not exceed `ENV_CONFIG.maxPageSize`.
- Date range must be valid (from ≤ to).
- Search term limited to non-sensitive reference IDs.

### 20.3 Mock Data Coverage

- Synthetic data set must include at least:
  - `50` NEW applications.
  - `100` IN_REVIEW applications.
  - `80` APPROVED applications.
  - `20` REJECTED applications.

Exact numbers are not provided in the HLD; these are implementation defaults and should be configurable.

---

## 21. Validation Rules

### 21.1 Client-Side Validation

- Query params built by controllers must respect allowed ranges and enumerations.
- Forms (if any, e.g., filter forms) validate required fields before calling services.

### 21.2 API Request Validation

- Backend validates:
  - `pageSize` ≤ `ENV_CONFIG.maxPageSize`.
  - `state` ∈ allowed states.
  - `sortBy` ∈ allowed fields.

### 21.3 Response Validation

- `DashboardService.validateResponse()` ensures required fields exist before mapping models.

---

## 22. Error Handling

### 22.1 Error Types

- Validation errors (400).
- Authentication/authorization errors (401/403).
- Not found (404).
- Rate limiting (429).
- Internal errors (5xx).

### 22.2 Client Handling

- `ErrorHandlerService.toErrorModel()` converts errors to `ErrorModel`.
- Controllers store `ErrorModel` in `vm.error` and show messages.
- Retry actions call the same service method again.

---

## 23. Logging Design

### 23.1 Client-Side Logging

- `LoggingService.audit()` called on:
  - Dashboard load.
  - State change.
  - Filter applied.
  - Application detail view.

### 23.2 Server-Side Logging

- REST endpoints log requests, responses, errors, and performance metrics.

Sensitive data is never logged.

---

## 24. Security Design

- All REST calls use HTTPS.
- `Authorization` header using bearer token, validated by API gateway.
- Input validation and output shaping per Section 15.
- No real PII; only synthetic data used.
- Secrets (e.g., API keys) stored in secure configuration (out of scope of frontend).

---

## 25. Dependency Map

### 25.1 Controllers

- `DashboardController`
  - Depends on: `DashboardService`, `StateService`, `ConfigService`, `LoggingService`, `ErrorHandlerService`.
  - Consumed by: `dashboard.html` template.

- `FiltersController`
  - Depends on: `ConfigService`.
  - Consumed by: `filters-panel.html`.

- `StateNavController`
  - Depends on: `StateService`.
  - Consumed by: `state-nav.html`.

- `AppDetailsController`
  - Depends on: `DashboardService`, `LoggingService`, `ErrorHandlerService`.
  - Consumed by: `app-details.html`.

### 25.2 Services

- `DashboardService`
  - Depends on: `$http`, `ENV_CONFIG`, `MockDataService`, `ErrorHandlerService`.

- `StateService`
  - Depends on: `$http`, `ENV_CONFIG`, `MockDataService`.

- `MockDataService`
  - Depends on: `$http`, `$q`, `$timeout`, `ENV_CONFIG`.

- `ConfigService`
  - Depends on: `$http`, `ENV_CONFIG`.

- `LoggingService`
  - Depends on: `$log`, `$http`, `ENV_CONFIG.telemetry`.

- `ErrorHandlerService`
  - Depends on: `LoggingService`.

### 25.3 Directives and Filters

- `kpiCard`, `stateTab`, `appRow`, `loadingSpinner` – depend on controllers for data.
- Filters depend only on their input values.

---

## 26. LLD Validation Checklist

The LLD satisfies the lldgenerationkb quality gates:

1. Uses mandated technology stack (AngularJS 1.7.9, Bootstrap 3.4.1, Chart.js 2.9.4).
2. Defines complete repository structure.
3. Fully specifies `index.html` and Angular bootstrap.
4. Defines all required modules and routes.
5. Lists all controllers, services, directives, filters, and models.
6. Provides REST contracts and mock behaviour.
7. Specifies configuration and mock implementation toggling via `useMockData`.
8. Describes UI layout, KPI cards, charts, tables, and states.
9. Documents data flows, business rules, validation, error handling, logging, and security.
10. Does not include implementation source code, only specifications.

Known ambiguity: detailed business criteria for state transitions are not fully specified in the HLD; this LLD identifies this as a missing detail and does not assume specific rules.
