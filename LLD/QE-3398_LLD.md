# Low-Level Design (LLD) – QE-3398 Application Data Management

## 1. Application Overview

This LLD defines the implementation specification for the **QE-3398 Application Data Management** capability as a Single Page Application (SPA) built with **AngularJS 1.7.9** and a REST-based backend, following the standards in `lldgenerationkb`.

The application enables authorized users to:
- View, search, and filter financing application records.
- Create and edit application records through structured forms.
- Trigger and view validation results for application data.
- Explore application data using list views and detail views.
- Switch between **real data** and **mock/demo data** views, ensuring no real PII/PHI/PCI is exposed in demo mode.

This LLD covers only the UI/client, SPA bootstrap, client-side data models, REST API contracts, configuration (including mock mode), mock implementation behaviour, validation, error handling, logging, and security integration from the perspective of the AngularJS application. Backend technology choices (PostgreSQL/SQL Server, Elasticsearch/OpenSearch, IdP type, etc.) are abstracted behind REST APIs.


## 2. Technology Stack

### 2.1 Frontend Technologies
- **HTML**: HTML5
- **CSS**: CSS3
- **JavaScript**: ES6 (insofar as AngularJS 1.7.9 supports)
- **AngularJS**: 1.7.9
- **Angular Route**: 1.7.9
- **Angular Animate**: 1.7.9
- **Angular Sanitize**: 1.7.9
- **Angular UI Bootstrap**: 2.5.6
- **Bootstrap**: 3.4.1 (CSS only)
- **Chart.js**: 2.9.4

### 2.2 Browser Compatibility
- Google Chrome (current enterprise-supported version)
- Microsoft Edge (current enterprise-supported version)

### 2.3 Backend Interface
- REST-based APIs over HTTPS, returning JSON.
- Authentication via IdP-issued tokens (e.g., OAuth2/OIDC) attached as headers.

### 2.4 Constraints
- No upgrade of AngularJS beyond 1.7.9.
- No introduction of additional frontend frameworks (no React/Vue/Angular 2+).
- No inclusion of `bootstrap.min.js` or `jQuery` unless later HLD explicitly demands it (not required here).


## 3. Architecture Design

### 3.1 Client-Side Architecture
- AngularJS **SPA** with:
  - Single root module: `apbAdmApp`.
  - Angular Route for navigation between views.
  - ControllerAs syntax and IIFE pattern.
- Logical layers in the client:
  - **Presentation/UI Layer**: templates, directives and controllers.
  - **Domain Services Layer**: Angular services for Application Management, Search & Filter, Mock Data, Config, Logging.
  - **Integration Layer**: REST API integration via `$http` or `$http`-compatible wrappers.

### 3.2 Mapped HLD Components to AngularJS

| HLD Component                     | AngularJS Mapping                                                   |
|-----------------------------------|----------------------------------------------------------------------|
| Web UI / SPA (UI)                 | Views (templates), controllers, directives, filters, models         |
| API Gateway (APIGW)               | REST endpoints consumed by `ApplicationApiService`, `SearchFilterApiService`, `MockDataApiService`, etc. |
| Application Management Service    | `ApplicationManagementService` (client-side) interacting with APIGW  |
| Search & Filter Service (SFS)     | `SearchFilterService` (client-side) with `SearchFilterApiService`    |
| Mock Data Service (MDS)           | `MockDataService` and API wrapper                                    |
| Relational Database (RDB)         | Abstracted via REST APIs, represented as models                      |
| Search Index (IDX)                | Abstracted via search endpoints                                      |
| Config Store (CFG)                | `ConfigService` and env JSON files                                   |
| Identity Provider (IdP)           | External; token presence assumed, integrated via HTTP headers        |
| Cross-Cutting (LOG/MON/TRC/SEC)   | `LoggingService`, correlation IDs in API calls, config-driven flags  |


## 4. Repository Structure

The repository must contain at least the following structure for this epic:

```text
src/
  app/
    app.module.js
    app.routes.js
    config/
      config.constants.js
      env.default.json
      env.dev.json
      env.prod.json
    controllers/
      applicationList.controller.js
      applicationDetail.controller.js
      applicationEdit.controller.js
      mockData.controller.js
    services/
      applicationManagement.service.js
      searchFilter.service.js
      mockData.service.js
      config.service.js
      logging.service.js
      notification.service.js
      authToken.service.js
      httpInterceptor.service.js
    factories/
      applicationModel.factory.js
      validationResultModel.factory.js
      paginationModel.factory.js
      filterCriteriaModel.factory.js
    directives/
      applicationListTable.directive.js
      kpiCards.directive.js
      searchFilterBar.directive.js
      validationErrorsPanel.directive.js
    filters/
      dateRangeDisplay.filter.js
      currencyFormat.filter.js
      statusLabel.filter.js
    models/
      application.model.js
      applicant.model.js
      product.model.js
      terms.model.js
      collateral.model.js
      validationRule.model.js
      validationError.model.js
    routes/
      application.routes.js
  templates/
    application-list.html
    application-detail.html
    application-edit.html
    mock-data.html
    components/
      application-list-table.html
      kpi-cards.html
      search-filter-bar.html
      validation-errors-panel.html
  assets/
    css/
      app.css
    js/
      vendor.bundle.js (optional bundling descriptor)
    images/
      (icons, placeholders)
    fonts/
      (if needed)
  mock/
    data/
      applications.mock.json
      validationRules.mock.json
  data/
    (optional sample data files not used in prod)
index.html
README.md
```

Each file will have a defined responsibility as detailed in subsequent sections.


## 5. Application Bootstrap Design

### 5.1 Root Module
- **Module Name**: `apbAdmApp`
- **File**: `src/app/app.module.js`
- **Registration**:
  - Declared once:
    - `angular.module("apbAdmApp", ["ngRoute", "ngAnimate", "ngSanitize", "ui.bootstrap", "chart.js"])`
- **Dependencies**:
  - `ngRoute` – routing
  - `ngAnimate` – UI animations
  - `ngSanitize` – safe HTML bindings
  - `ui.bootstrap` – Bootstrap UI components
  - `chart.js` – charts for KPIs and trend visualizations

### 5.2 Config & Run Blocks
- **Config Block** (in `app.routes.js` and `config.constants.js`):
  - Configure routes.
  - Register HTTP interceptor.
  - Define constants:
    - `ENV_CONFIG` (default values, see Configuration Design).
    - `API_ENDPOINTS` (REST URLs). 
- **Run Block** (in `app.module.js`):
  - Initialize logging context (e.g. generate UI session correlation ID).
  - Read active environment configuration via `ConfigService`.
  - Setup global error handler for route changes.


## 6. Module Design

All components use the root module `apbAdmApp`. No additional feature modules are required for this epic to prevent over-fragmentation.

- **Module**: `apbAdmApp`
  - Controllers: `ApplicationListController`, `ApplicationDetailController`, `ApplicationEditController`, `MockDataController`
  - Services: `ApplicationManagementService`, `SearchFilterService`, `MockDataService`, `ConfigService`, `LoggingService`, `NotificationService`, `AuthTokenService`, `HttpInterceptorService`
  - Factories: `ApplicationModelFactory`, `ValidationResultModelFactory`, `PaginationModelFactory`, `FilterCriteriaModelFactory`
  - Directives: `applicationListTable`, `kpiCards`, `searchFilterBar`, `validationErrorsPanel`
  - Filters: `dateRangeDisplay`, `currencyFormat`, `statusLabel`
  - Models: `ApplicationModel`, `ApplicantModel`, `ProductModel`, `TermsModel`, `CollateralModel`, `ValidationRuleModel`, `ValidationErrorModel`


## 7. Routing Design

### 7.1 Route Configuration File
- **File**: `src/app/app.routes.js`
- **Responsibility**: define URL routes, controllers, templates, and default route.

### 7.2 Routes

1. **Application List Route**
   - URL: `/applications`
   - TemplateUrl: `templates/application-list.html`
   - Controller: `ApplicationListController`
   - ControllerAs: `vm`
   - Resolve:
     - `initialListData`: calls `SearchFilterService.getInitialList()` to preload first page.

2. **Application Detail Route**
   - URL: `/applications/:applicationId`
   - TemplateUrl: `templates/application-detail.html`
   - Controller: `ApplicationDetailController`
   - ControllerAs: `vm`
   - Resolve:
     - `application`: calls `ApplicationManagementService.getApplicationById(applicationId)`.

3. **Application Edit Route**
   - URL: `/applications/:applicationId/edit`
   - TemplateUrl: `templates/application-edit.html`
   - Controller: `ApplicationEditController`
   - ControllerAs: `vm`
   - Resolve:
     - `application`: calls `ApplicationManagementService.getApplicationForEdit(applicationId)`.
     - `validationConfig`: calls `ConfigService.getValidationConfig()`.

4. **Mock Data Management Route**
   - URL: `/mock-data`
   - TemplateUrl: `templates/mock-data.html`
   - Controller: `MockDataController`
   - ControllerAs: `vm`
   - Resolve:
     - `mockSummary`: calls `MockDataService.getMockDataSummary()`.

5. **Default Route**
   - When URL not recognized, redirect to `/applications`.

### 7.3 Route Behaviour
- Invalid URLs redirect to `/applications`.
- Each route is secured via backend authorization; unauthorized access produces a 403 which is handled by global error handling in the interceptor.


## 8. Component Registry

Below is the registry of core AngularJS components.

### 8.1 Controllers
- `ApplicationListController`
  - Path: `src/app/controllers/applicationList.controller.js`
  - Depends on: `SearchFilterService`, `ApplicationModelFactory`, `PaginationModelFactory`, `FilterCriteriaModelFactory`, `NotificationService`, `LoggingService`.
  - Consumed by: `application-list.html`, directives `applicationListTable`, `searchFilterBar`, `kpiCards`.

- `ApplicationDetailController`
  - Path: `src/app/controllers/applicationDetail.controller.js`
  - Depends on: `ApplicationManagementService`, `ApplicationModelFactory`, `NotificationService`, `LoggingService`.
  - Consumed by: `application-detail.html`, directive `validationErrorsPanel`.

- `ApplicationEditController`
  - Path: `src/app/controllers/applicationEdit.controller.js`
  - Depends on: `ApplicationManagementService`, `ConfigService`, `ApplicationModelFactory`, `ValidationResultModelFactory`, `NotificationService`, `LoggingService`.
  - Consumed by: `application-edit.html`, directive `validationErrorsPanel`.

- `MockDataController`
  - Path: `src/app/controllers/mockData.controller.js`
  - Depends on: `MockDataService`, `NotificationService`, `LoggingService`.
  - Consumed by: `mock-data.html`.

### 8.2 Services
- `ApplicationManagementService`
  - Path: `src/app/services/applicationManagement.service.js`
  - Depends on: `$http`, `API_ENDPOINTS`, `AuthTokenService`, `LoggingService`, `ConfigService`.
  - Consumed by: `ApplicationDetailController`, `ApplicationEditController`, `SearchFilterService` (for consistency), Mock-related flows (for segregation checks).

- `SearchFilterService`
  - Path: `src/app/services/searchFilter.service.js`
  - Depends on: `$http`, `API_ENDPOINTS`, `AuthTokenService`, `LoggingService`.
  - Consumed by: `ApplicationListController`, route resolves.

- `MockDataService`
  - Path: `src/app/services/mockData.service.js`
  - Depends on: `$http`, `API_ENDPOINTS`, `AuthTokenService`, `LoggingService`, `ConfigService`.
  - Consumed by: `MockDataController`, potential other controllers that need to switch data sources.

- `ConfigService`
  - Path: `src/app/services/config.service.js`
  - Depends on: `$http`, `ENV_CONFIG`, `LoggingService`.
  - Consumed by: `ApplicationEditController`, `MockDataService`, `ApplicationManagementService`, `app.module` run block.

- `LoggingService`
  - Path: `src/app/services/logging.service.js`
  - Depends on: none (may optionally use `$log`).
  - Consumed by: all controllers and services.

- `NotificationService`
  - Path: `src/app/services/notification.service.js`
  - Depends on: `ui.bootstrap` modal/toast components.
  - Consumed by: all controllers.

- `AuthTokenService`
  - Path: `src/app/services/authToken.service.js`
  - Depends on: `$window` or other client-side storage.
  - Consumed by: `HttpInterceptorService`, all API services.

- `HttpInterceptorService`
  - Path: `src/app/services/httpInterceptor.service.js`
  - Depends on: `$q`, `$injector`, `AuthTokenService`, `LoggingService`, `NotificationService`.
  - Consumed by: `$http` globally via config.

### 8.3 Factories
- `ApplicationModelFactory`
  - Path: `src/app/factories/applicationModel.factory.js`
  - Produces: `ApplicationModel` instances.

- `ValidationResultModelFactory`
  - Path: `src/app/factories/validationResultModel.factory.js`
  - Produces: `ValidationResultModel` instances.

- `PaginationModelFactory`
  - Path: `src/app/factories/paginationModel.factory.js`
  - Produces: `PaginationModel` with pageNumber, pageSize, totalRecords.

- `FilterCriteriaModelFactory`
  - Path: `src/app/factories/filterCriteriaModel.factory.js`
  - Produces: `FilterCriteriaModel` for search/filter.

### 8.4 Directives
- `applicationListTable`
  - Path: `src/app/directives/applicationListTable.directive.js`
  - TemplateUrl: `templates/components/application-list-table.html`
  - Scope bindings: list data, pagination, sorting callbacks.

- `kpiCards`
  - Path: `src/app/directives/kpiCards.directive.js`
  - TemplateUrl: `templates/components/kpi-cards.html`
  - Scope bindings: KPIs (values), click handlers.

- `searchFilterBar`
  - Path: `src/app/directives/searchFilterBar.directive.js`
  - TemplateUrl: `templates/components/search-filter-bar.html`
  - Scope bindings: current filter criteria, callbacks for apply/reset.

- `validationErrorsPanel`
  - Path: `src/app/directives/validationErrorsPanel.directive.js`
  - TemplateUrl: `templates/components/validation-errors-panel.html`
  - Scope bindings: validation results.

### 8.5 Filters
- `dateRangeDisplay`
  - Path: `src/app/filters/dateRangeDisplay.filter.js`
- `currencyFormat`
  - Path: `src/app/filters/currencyFormat.filter.js`
- `statusLabel`
  - Path: `src/app/filters/statusLabel.filter.js`

### 8.6 Models
Defined in `src/app/models` and used by factories.


## 9. Controller Design

### 9.1 ApplicationListController
- **Path**: `src/app/controllers/applicationList.controller.js`
- **Registration**: `.controller("ApplicationListController", ApplicationListController)`
- **Dependencies (DI)**:
  - `SearchFilterService`
  - `ApplicationModelFactory`
  - `PaginationModelFactory`
  - `FilterCriteriaModelFactory`
  - `NotificationService`
  - `LoggingService`
- **Responsibilities**:
  - Initialize list view, filters, pagination.
  - Trigger search and filter operations via `SearchFilterService`.
  - Update view model for list, KPIs, and filter state.
  - Handle loading, empty, and error UI states.
- **ViewModel (ControllerAs `vm`)**:
  - `vm.applications` (array of `ApplicationModel`)
  - `vm.pagination` (`PaginationModel`)
  - `vm.filterCriteria` (`FilterCriteriaModel`)
  - `vm.kpis` (summary metrics: `totalApplications`, `validApplications`, etc.)
  - `vm.isLoading`, `vm.hasError`, `vm.errorMessage`
- **Key Methods**:
  - `vm.initialize()`
    - Called on controller load.
    - Uses route `initialListData` resolve; if missing, calls `SearchFilterService.getInitialList()`.
  - `vm.search()`
    - Validates filter criteria (via client-side rules) then calls `SearchFilterService.search(vm.filterCriteria, vm.pagination)`.
  - `vm.pageChanged(newPage)`
    - Updates `vm.pagination.pageNumber` and re-requests data.
  - `vm.sortBy(field)`
    - Updates sort field and direction, re-requests data.
  - `vm.clearFilters()`
    - Resets filter criteria using `FilterCriteriaModelFactory.createDefault()` and reloads list.
  - `vm.viewApplication(applicationId)`
    - Navigates to `/applications/:applicationId`.
- **Error Handling**:
  - On API errors: set `vm.hasError = true`, `vm.errorMessage` from standardized error model; log via `LoggingService.error()`; show notification.

### 9.2 ApplicationDetailController
- **Path**: `src/app/controllers/applicationDetail.controller.js`
- **Dependencies**:
  - `ApplicationManagementService`
  - `ApplicationModelFactory`
  - `NotificationService`
  - `LoggingService`
- **Responsibilities**:
  - Display full details of a single application.
  - Show validation state, including any validation errors.
- **ViewModel**:
  - `vm.application` (`ApplicationModel`)
  - `vm.validationResults` (array of `ValidationErrorModel`)
  - `vm.isLoading`, `vm.hasError`, `vm.errorMessage`
- **Methods**:
  - `vm.initialize(application)`
    - Use resolved `application` data to populate view model.
  - `vm.refresh()`
    - Re-fetch application details from backend.
- **Error Handling**:
  - Similar to `ApplicationListController`.

### 9.3 ApplicationEditController
- **Path**: `src/app/controllers/applicationEdit.controller.js`
- **Dependencies**:
  - `ApplicationManagementService`
  - `ConfigService`
  - `ApplicationModelFactory`
  - `ValidationResultModelFactory`
  - `NotificationService`
  - `LoggingService`
- **Responsibilities**:
  - Manage create/edit forms for applications.
  - Integrate client-side and server-side validation.
  - Coordinate with `ApplicationManagementService` to save changes.
- **ViewModel**:
  - `vm.application` (`ApplicationModel`)
  - `vm.validationConfig` (`ValidationRuleModel` objects)
  - `vm.validationResults` (`ValidationErrorModel` list)
  - `vm.isSaving`, `vm.hasError`, `vm.errorMessage`
- **Methods**:
  - `vm.initialize(application, validationConfig)`
    - Set initial form data and validation rules.
  - `vm.submit()`
    - Perform client-side validation; if passed, call `ApplicationManagementService.saveApplication(vm.application)`.
  - `vm.runServerValidation()`
    - Call `ApplicationManagementService.validateApplication(vm.application)` and update `vm.validationResults`.
  - `vm.cancel()`
    - Navigate back to detail or list view.
- **Error Handling**:
  - On validation failure, show detailed messages in `validationErrorsPanel` and notifications; inputs preserved.

### 9.4 MockDataController
- **Path**: `src/app/controllers/mockData.controller.js`
- **Dependencies**:
  - `MockDataService`
  - `NotificationService`
  - `LoggingService`
- **Responsibilities**:
  - Provide UI for enabling demo mode, generating, refreshing, and resetting mock datasets.
- **ViewModel**:
  - `vm.mockSummary` (counts, coverage of scenarios)
  - `vm.isProcessing`, `vm.hasError`, `vm.errorMessage`
- **Methods**:
  - `vm.initialize(mockSummary)`
  - `vm.generateMockData()`
  - `vm.refreshMockData()`
  - `vm.resetMockData()`


## 10. Service Design

### 10.1 ApplicationManagementService
- **Path**: `src/app/services/applicationManagement.service.js`
- **Purpose**: Encapsulate client-side business logic for application create/edit, detail retrieval, and server-side validation calls.
- **Public Methods**:
  - `getApplicationById(applicationId)`
    - Inputs: `applicationId` (string/number)
    - Outputs: Promise resolving to `ApplicationModel`.
  - `getApplicationForEdit(applicationId)`
    - Inputs: `applicationId`
    - Outputs: Promise resolving to `ApplicationModel` with additional editable metadata.
  - `saveApplication(application)`
    - Inputs: `ApplicationModel`
    - Outputs: Promise resolving to updated `ApplicationModel`.
  - `validateApplication(application)`
    - Inputs: `ApplicationModel`
    - Outputs: Promise resolving to `ValidationResultModel`.
- **Dependencies**:
  - `$http`
  - `API_ENDPOINTS` (constants)
  - `AuthTokenService`
  - `LoggingService`
  - `ConfigService`
- **REST Endpoints Used**:
  - `GET /api/applications/{id}`
  - `GET /api/applications/{id}/edit`
  - `POST /api/applications`
  - `PUT /api/applications/{id}`
  - `POST /api/applications/{id}/validate`
- **Error Handling**:
  - Map server error responses to `ErrorModel` (see Error Handling section).
  - Log failures; reject promises with standardized error objects.

### 10.2 SearchFilterService
- **Path**: `src/app/services/searchFilter.service.js`
- **Purpose**: Provide search and filter operations, managing pagination and sorting.
- **Public Methods**:
  - `getInitialList()`
    - Outputs: Promise resolving to `{ applications: ApplicationModel[], pagination, kpis }`.
  - `search(filterCriteria, pagination)`
    - Inputs: `FilterCriteriaModel`, `PaginationModel`
    - Outputs: Promise resolving to same structure.
- **Dependencies**:
  - `$http`
  - `API_ENDPOINTS`
  - `AuthTokenService`
  - `LoggingService`
- **REST Endpoints Used**:
  - `GET /api/applications` with query parameters:
    - `page`, `pageSize`, `sortField`, `sortDirection`, `status`, `productType`, `dateFrom`, `dateTo`.

### 10.3 MockDataService
- **Path**: `src/app/services/mockData.service.js`
- **Purpose**: Provide operations to generate, refresh, and reset mock application data.
- **Public Methods**:
  - `getMockDataSummary()`
  - `generateMockData()`
  - `refreshMockData()`
  - `resetMockData()`
- **Dependencies**:
  - `$http`
  - `API_ENDPOINTS`
  - `AuthTokenService`
  - `LoggingService`
  - `ConfigService`
- **REST Endpoints Used**:
  - `GET /api/mock/applications/summary`
  - `POST /api/mock/applications/generate`
  - `POST /api/mock/applications/refresh`
  - `POST /api/mock/applications/reset`

### 10.4 ConfigService
- **Path**: `src/app/services/config.service.js`
- **Purpose**: Load environment and validation configuration.
- **Public Methods**:
  - `getEnvConfig()` – reads `env.<env>.json`.
  - `getValidationConfig()` – calls `/api/config/validation`.
- **Dependencies**:
  - `$http`
  - `ENV_CONFIG`
  - `LoggingService`

### 10.5 LoggingService
- **Path**: `src/app/services/logging.service.js`
- **Purpose**: Centralized logging from the SPA.
- **Public Methods**:
  - `info(message, context)`
  - `warn(message, context)`
  - `error(message, context)`
- **Dependencies**:
  - Optional: `$log`.

### 10.6 NotificationService
- **Path**: `src/app/services/notification.service.js`
- **Purpose**: User notifications.
- **Public Methods**:
  - `success(message)`
  - `error(message)`
  - `warning(message)`
  - `info(message)`

### 10.7 AuthTokenService
- **Path**: `src/app/services/authToken.service.js`
- **Purpose**: Manage access tokens provided by IdP.
- **Public Methods**:
  - `getToken()`
  - `setToken(token)`
  - `clearToken()`

### 10.8 HttpInterceptorService
- **Path**: `src/app/services/httpInterceptor.service.js`
- **Purpose**: Attach tokens, handle errors globally.
- **Public Methods**:
  - Implements `$http` interceptor methods: `request`, `response`, `responseError`.


## 11. Factory Design

### 11.1 ApplicationModelFactory
- **Path**: `src/app/factories/applicationModel.factory.js`
- **Purpose**: Create `ApplicationModel` objects.
- **Method**:
  - `create(rawData)` → `ApplicationModel`

### 11.2 ValidationResultModelFactory
- **Path**: `src/app/factories/validationResultModel.factory.js`
- **Purpose**: Create `ValidationResultModel` objects.
- **Method**:
  - `create(rawData)` → `ValidationResultModel`

### 11.3 PaginationModelFactory
- **Path**: `src/app/factories/paginationModel.factory.js`
- **Purpose**: Encapsulate pagination attributes.
- **Method**:
  - `createDefault()` → page=1, pageSize=25, totalRecords=0

### 11.4 FilterCriteriaModelFactory
- **Path**: `src/app/factories/filterCriteriaModel.factory.js`
- **Purpose**: Encapsulate search and filter criteria.
- **Method**:
  - `createDefault()` → default filter state.


## 12. Directive Design

### 12.1 applicationListTable Directive
- **Path**: `src/app/directives/applicationListTable.directive.js`
- **Restrict**: `E`
- **Scope**:
  - `applications: "="`
  - `pagination: "="`
  - `onPageChange: "&"`
  - `onSortChanged: "&"`
- **Controller**: `ApplicationListTableController` (if needed)
- **ControllerAs**: `vm`
- **TemplateUrl**: `templates/components/application-list-table.html`
- **Usage Example**:
  ```html
  <application-list-table
      applications="vm.applications"
      pagination="vm.pagination"
      on-page-change="vm.pageChanged(page)"
      on-sort-changed="vm.sortBy(field)">
  </application-list-table>
  ```

### 12.2 kpiCards Directive
- **Path**: `src/app/directives/kpiCards.directive.js`
- **Scope**:
  - `kpis: "="`
- **TemplateUrl**: `templates/components/kpi-cards.html`
- **Usage**:
  ```html
  <kpi-cards kpis="vm.kpis"></kpi-cards>
  ```

### 12.3 searchFilterBar Directive
- **Path**: `src/app/directives/searchFilterBar.directive.js`
- **Scope**:
  - `filterCriteria: "="`
  - `onApply: "&"`
  - `onReset: "&"`
- **TemplateUrl**: `templates/components/search-filter-bar.html`

### 12.4 validationErrorsPanel Directive
- **Path**: `src/app/directives/validationErrorsPanel.directive.js`
- **Scope**:
  - `validationResults: "="`
- **TemplateUrl**: `templates/components/validation-errors-panel.html`


## 13. Filter Design

### 13.1 dateRangeDisplay
- **Purpose**: Format date ranges for display.
- **Input**: `{ from: Date, to: Date }`
- **Output**: `"YYYY-MM-DD to YYYY-MM-DD"` string.

### 13.2 currencyFormat
- **Purpose**: Format monetary values.
- **Input**: number, optional currency code.
- **Output**: formatted string with currency symbol/code based on configuration.

### 13.3 statusLabel
- **Purpose**: Map status codes to human-friendly labels (e.g. `PENDING`, `APPROVED`).
- **Input**: status code string.
- **Output**: label string.


## 14. Model Design

### 14.1 ApplicationModel
- **Properties**:
  - `id` (string/number)
  - `referenceNumber` (string)
  - `status` (string)
  - `productType` (string)
  - `submittedDate` (ISO date string)
  - `lastUpdatedDate` (ISO date string)
  - `applicant` (`ApplicantModel`)
  - `terms` (`TermsModel`)
  - `collateral` (`CollateralModel`)
- **Validation**:
  - `id` required for existing applications.
  - `referenceNumber` required, unique per environment (server-side enforcement).

### 14.2 ApplicantModel
- **Properties**:
  - `name` (string)
  - `segment` (string)
  - Potential sensitive fields exist in backend but are **not exposed** in UI for mock/demo.

### 14.3 ProductModel
- **Properties**:
  - `productCode` (string)
  - `productName` (string)

### 14.4 TermsModel
- **Properties**:
  - `amount` (number)
  - `currency` (string)
  - `durationMonths` (number)
  - `interestRate` (number)

### 14.5 CollateralModel
- **Properties**:
  - `type` (string)
  - `value` (number)

### 14.6 ValidationRuleModel
- **Properties**:
  - `field` (string)
  - `ruleType` (string) – e.g., `REQUIRED`, `RANGE`, `FORMAT`, `CONSISTENCY`.
  - `parameters` (object)

### 14.7 ValidationErrorModel
- **Properties**:
  - `field` (string)
  - `code` (string)
  - `message` (string)
  - `severity` (string – `ERROR`, `WARNING`)

### 14.8 Sample JSON

```json
{
  "id": "APP-12345",
  "referenceNumber": "FIN-2026-0001",
  "status": "PENDING",
  "productType": "INSTALLMENT_LOAN",
  "submittedDate": "2026-07-19",
  "lastUpdatedDate": "2026-07-20",
  "applicant": {
    "name": "Demo Applicant",
    "segment": "RETAIL"
  },
  "terms": {
    "amount": 50000,
    "currency": "USD",
    "durationMonths": 36,
    "interestRate": 5.5
  },
  "collateral": {
    "type": "PROPERTY",
    "value": 80000
  }
}
```


## 15. REST API Contract

All APIs are exposed behind an API Gateway and consumed via HTTPS.

### 15.1 List Applications
- **Name**: `ListApplications`
- **Method**: `GET`
- **URL**: `/api/applications`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `X-Correlation-ID: <uuid>`
- **Query Parameters**:
  - `page` (int, default 1)
  - `pageSize` (int, default 25, max 100)
  - `sortField` (string)
  - `sortDirection` (`asc`/`desc`)
  - `status` (string)
  - `productType` (string)
  - `dateFrom` (ISO date)
  - `dateTo` (ISO date)
- **Success Response** (`200`):
  - Body:
    ```json
    {
      "applications": [/* ApplicationModel summary objects */],
      "pagination": {
        "page": 1,
        "pageSize": 25,
        "totalRecords": 87
      },
      "kpis": {
        "totalApplications": 87,
        "validApplications": 80,
        "invalidApplications": 7
      }
    }
    ```
- **Error Responses**:
  - `400` – Invalid query parameters.
  - `401` – Unauthorized.
  - `403` – Forbidden.
  - `500` – Internal error.

### 15.2 Get Application Details
- **Name**: `GetApplication`
- **Method**: `GET`
- **URL**: `/api/applications/{id}`
- **Path Parameters**:
  - `id` – application identifier.
- **Success (`200`)**: `ApplicationModel` with additional detail fields.
- **Errors**:
  - `404` – Not found.
  - Other standard errors as above.

### 15.3 Get Application for Edit
- **Name**: `GetApplicationForEdit`
- **Method**: `GET`
- **URL**: `/api/applications/{id}/edit`
- **Success (`200`)**: application data with edit metadata and allowed values.

### 15.4 Create Application
- **Name**: `CreateApplication`
- **Method**: `POST`
- **URL**: `/api/applications`
- **Body**: `ApplicationModel` without `id`.
- **Success (`201`)**:
  - Returns `ApplicationModel` with `id` and server-generated metadata.
- **Error Codes**:
  - `400` – Validation failure (with detailed validation errors).
  - `409` – Conflict (e.g., duplicate referenceNumber).

### 15.5 Update Application
- **Name**: `UpdateApplication`
- **Method**: `PUT`
- **URL**: `/api/applications/{id}`
- **Body**: `ApplicationModel`.
- **Success (`200`)**: updated `ApplicationModel`.

### 15.6 Validate Application
- **Name**: `ValidateApplication`
- **Method**: `POST`
- **URL**: `/api/applications/{id}/validate`
- **Body**: `ApplicationModel`.
- **Success (`200`)**:
  - Returns `ValidationResultModel` summarizing validation outcome:
  ```json
  {
    "isValid": true,
    "errors": []
  }
  ```
- **Errors**:
  - `400` – Invalid payload.

### 15.7 Config Endpoints
- `GET /api/config/validation`
- `GET /api/config/ui` (optional for metadata).

### 15.8 Mock Data Endpoints
As described in Service Design.


## 16. Configuration Design

### 16.1 ENV_CONFIG (config.constants.js)

- **Path**: `src/app/config/config.constants.js`
- **Constant**: `ENV_CONFIG`
- **Properties**:
  - `apiBaseUrl` (string) – e.g., `"https://api.example.com"`.
  - `apiTimeoutMs` (int) – default `30000`.
  - `maxPageSize` (int) – `100`.
  - `useMockData` (boolean) – toggles between production and mock endpoints.
  - `featureFlags` (object) – e.g., `{ "mockDataManagement": true }`.
  - `telemetryEnabled` (boolean).

Changing `useMockData` alone must switch between production and mock data without code changes.

### 16.2 Environment JSON Files

- **Files**:
  - `env.default.json`
  - `env.dev.json`
  - `env.prod.json`
- **Properties**:
  - `apiBaseUrl`
  - `useMockData`
  - `featureFlags`

These are loaded by `ConfigService.getEnvConfig()` at startup.


## 17. Mock Implementation Design

### 17.1 Mock Data Behaviour
- For every REST endpoint that returns application data, a corresponding mock endpoint exists when `useMockData = true`:
  - `GET /api/mock/applications`
  - `GET /api/mock/applications/{id}`
  - etc.
- Mock endpoints return data structures identical to production endpoints.

### 17.2 Mock Data Files
- **Path**: `mock/data/applications.mock.json`
- **Content**: array of `ApplicationModel` objects with synthetic values.

### 17.3 Simulated Conditions
- Mocks simulate:
  - Normal success responses (200/201).
  - Validation errors.
  - Timeouts and server errors for testing.

Mock responses must adhere to the same JSON structure and HTTP response shapes as the production endpoints.


## 18. UI Specification

### 18.1 Overall Layout

- **index.html**:
  - Declares `ng-app="apbAdmApp"`.
  - Contains `<div ng-view></div>` as the main content area.
  - Includes:
    - Bootstrap 3.4.1 CSS (CDN).
    - `app.css`.
    - AngularJS 1.7.9 (CDN).
    - `ngRoute`, `ngAnimate`, `ngSanitize`, `ui.bootstrap` (CDN).
    - Chart.js 2.9.4 (CDN).
    - Application script files (`app.module.js`, `app.routes.js`, others).

- Layout sections:
  - Header: application title, navigation menu (Applications, Mock Data).
  - Main content: `ng-view` controlled region.
  - Footer: environment indicator (e.g., Dev/Prod/Mock).

### 18.2 Application List Page (templates/application-list.html)
- Components:
  - Page title: "Applications".
  - KPI cards (top row) – total, valid, invalid.
  - Search filter bar (below KPI cards).
  - Application list table (main content).
- Responsive design using Bootstrap grid.

### 18.3 Application Detail Page
- Shows key attributes of a single application.
- Validation status summary and list of validation errors (if any).

### 18.4 Application Edit Page
- Form with grouped sections for applicant, product, terms, collateral.
- Client-side validation with real-time feedback.
- Buttons: Save, Validate, Cancel.

### 18.5 Mock Data Page
- Controls for enabling/disabling mock mode.
- Actions: Generate, Refresh, Reset mock data.
- Summary display of mock dataset coverage.


## 19. Data Flow

### 19.1 Success Flow – List View
1. User navigates to `/applications`.
2. `ApplicationListController.initialize()`
3. `SearchFilterService.getInitialList()` calls `GET /api/applications`.
4. API Gateway forwards to Search & Filter Service and returns JSON.
5. Controller maps response to `ApplicationModel` list, `PaginationModel`, and KPIs.
6. UI renders table and KPI cards.

### 19.2 Success Flow – Edit & Validate
1. User navigates to `/applications/{id}/edit`.
2. Route resolves `application` and `validationConfig`.
3. `ApplicationEditController.initialize()` sets view model.
4. User edits fields and clicks "Save".
5. Controller validates inputs; calls `ApplicationManagementService.saveApplication()`.
6. Backend persists changes and returns updated model.
7. UI shows success notification.

### 19.3 Failure Flow – Validation Errors
1. Save attempt fails due to validation errors.
2. Backend returns validation error list.
3. Controller populates `vm.validationResults`.
4. `validationErrorsPanel` displays errors with field references.

### 19.4 Mock Data Flow
1. User opens `/mock-data`.
2. `MockDataController.initialize()` loads `mockSummary` via `MockDataService.getMockDataSummary()`.
3. User clicks "Generate Mock Data".
4. Service calls `POST /api/mock/applications/generate`.
5. On success, UI shows notification and updates summary.


## 20. Business Rules

High-level business rules from HLD translated into SPA-level behaviour:

1. **Data Integrity Rules** (enforced server-side, surfaced client-side):
   - Applications must have consistent applicant, terms, and collateral.
   - Reference numbers must be unique.
   - Status transitions may be restricted (the workflow itself is out of scope, but UI must not assume rules beyond what backend allows).

2. **Search & Filter Rules**:
   - Pagination and sorting must ensure list load SLA (<2s for up to 100 records); SPA must avoid unnecessary round trips.

3. **Mock Data Rules**:
   - Mock data must be clearly separated and identifiable (via tags or schema separation in backend). UI surfaces this via environment indicator.


## 21. Validation Rules

### 21.1 Client-Side Validation
- Required fields: product type, amount, duration, applicant name.
- Format checks: dates must be valid ISO strings, numeric fields must be numbers.

### 21.2 Server-Side Validation (exposed to client)
- Completeness checks and business rules handled by backend via validation API.
- The SPA displays server validation errors and prevents commit when invalid.


## 22. Error Handling

- All `$http` calls go through `HttpInterceptorService`.
- On `4xx` errors:
  - Show an appropriate error message via `NotificationService`.
  - For `401`, redirect to login/SSO entrypoint.
- On `5xx` errors:
  - Show generic error: "Unable to complete the request. Please try again later".
  - Log details via `LoggingService.error()`.
- For network timeouts:
  - Provide retry option on relevant screens.


## 23. Logging Design

- Each API call includes `X-Correlation-ID` generated at UI start.
- Controllers and services log key actions:
  - `info` for successful operations.
  - `warn` for validation warnings.
  - `error` for failures.
- Sensitive information (e.g., applicant personal details) is not logged.


## 24. Security Design

- SPA uses tokens issued by IdP via `AuthTokenService`.
- All requests over HTTPS.
- Input validation for forms to prevent malformed data being sent.
- Output encoding ensured via AngularJS built-in binding plus `ngSanitize`.
- RBAC enforced by backend; SPA respects authorization errors and does not attempt to circumvent.


## 25. Dependency Map

- Controllers depend on services and factories, never directly on `$http`.
- Services depend on `$http`, constants, and other services (e.g., `LoggingService`).
- Directives depend on controllers and models via scope bindings.
- Filters are standalone functions.


## 26. LLD Validation Checklist

The LLD is validated against `lldgenerationkb`:
- Mandatory sections (1–26) present.
- Technology stack adheres to AngularJS 1.7.9 and associated tools.
- SPA architecture with single root module and routing defined.
- Repository structure conforms to required minimum and maps each file to responsibilities.
- All key components (controllers, services, directives, filters, models) are defined with dependencies and responsibilities.
- REST API contracts are fully specified for list, detail, edit, validation, configuration, and mock data.
- Configuration and mock implementation design ensure `useMockData` toggle behaviour.
- UI specification covers layout, pages, components, and states.
- Data flow, business rules, validation, error handling, logging, and security are documented.

No violations detected against the quality gates defined in `lldgenerationkb`.
