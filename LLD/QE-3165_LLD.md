# QE-3165 Monthly Credit Card Spend Summary Dashboard - Low-Level Design (LLD)

## 1. Technology Stack

- **Application Type**: Single Page Application (SPA) dashboard
- **Frontend Framework**: React 18 with TypeScript
- **Programming Language**: TypeScript for app code, JSON/YAML for configuration
- **Styling Framework**: Tailwind CSS with PostCSS
- **UI Component Library**: MUI (Material UI) v6 (or latest stable)
- **Charting Library**: Recharts (for summary charts, category breakdowns)
- **State Management**: React Query for server state + React Context for app/global UI state
- **API Communication**: Axios-based HTTP client with request/response interceptors
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library (smoke tests and key interaction flows)

Repository layout constraints:
- Only `HLD` and `LLD` folders are allowed outside `src`.
- All implementation artifacts must reside under `src`.

---

## 2. Application Structure

All paths are relative to repository root.

- `HLD/`
  - `QE-3165_HLD.md` (existing high-level design; input only, not used by runtime)
- `LLD/`
  - `QE-3165_LLD.md` (this document)
- `src/`
  - `main.tsx`
    - React/Vite entry point; bootstraps `App` with routing and providers.
  - `App.tsx`
    - Root component configuring routes, layout, global providers (React Query, theme, config context).
  - `config/`
    - `appConfig.ts`
      - Reads environment variables and centralizes app configuration: `apiBaseUrl`, `useMockApi`, feature flags, time zone info.
    - `featureFlags.ts`
      - Exposes typed feature flags (e.g., `enableCategoryBreakdown`, `enableAdvancedKpis`).
  - `routes/`
    - `routes.tsx`
      - Declares React Router routes, including the monthly spend summary dashboard route (`/insights/monthly`).
  - `layouts/`
    - `DashboardLayout/`
      - `DashboardLayout.tsx`
        - Main layout shell: top app bar, navigation/sidebar, content region, global error/toast area.
      - `DashboardLayout.styles.ts`
        - Tailwind and MUI style helpers for layout.
  - `pages/`
    - `MonthlySpendSummaryPage/`
      - `MonthlySpendSummaryPage.tsx`
        - Page-level component for QE-3165 monthly spend dashboard; wires route params/query params to view components and data hooks.
      - `MonthlySpendSummaryPage.state.ts`
        - Local hooks for page UI state: selected month, view mode, filters.
  - `components/`
    - `navigation/`
      - `AppHeader.tsx`
        - Reusable top bar: app title, month selector entry point, user/avatar placeholder.
      - `Sidebar.tsx`
        - Reusable sidebar: navigation links; highlights Monthly Insights.
    - `insights/`
      - `MonthSelector/`
        - `MonthSelector.tsx`
          - Controlled component allowing the user to select a month (YYYY-MM), with min/max constraints and validation.
      - `SummaryKpiCards/`
        - `SummaryKpiCards.tsx`
          - Renders total spend, number of transactions, and other basic KPIs as responsive cards.
      - `CategoryBreakdownChart/`
        - `CategoryBreakdownChart.tsx`
          - Renders category breakdown as donut/bar chart using Recharts.
      - `MonthlySpendSummaryView/`
        - `MonthlySpendSummaryView.tsx`
          - Composes KPI cards, category chart, and supporting UI states (loading, empty, partial data) for the selected month.
      - `SummaryLegend/`
        - `SummaryLegend.tsx`
          - Legend for chart colors and category descriptions.
    - `feedback/`
      - `LoadingState.tsx`
        - Reusable skeleton/loader for cards and charts.
      - `ErrorState.tsx`
        - Reusable error display with retry action and correlation ID placeholder.
      - `EmptyState.tsx`
        - Reusable empty state for when no summary data is available.
    - `layout/`
      - `ResponsiveContainer.tsx`
        - Wrapper for responsive behavior, applying consistent padding, max-widths, and breakpoints.
  - `services/`
    - `httpClient.ts`
      - Axios instance configuration: base URL, timeouts, interceptors.
    - `insightsService.ts`
      - Business service layer for monthly spend insights: requests, response mapping, domain-level error handling.
  - `api/`
    - `insightsApi.ts`
      - Low-level API wrapper for `/insights/monthly-summary` and related endpoints.
  - `mocks/`
    - `handlers/`
      - `insightsMockHandlers.ts`
        - Mock service handlers that simulate `/insights/monthly-summary` responses.
    - `data/`
      - `monthlySummary.mock.json`
        - Realistic example of monthly summary API response.
    - `mockServer.ts`
      - Initializes and configures mock API layer (e.g., MSW or Axios mock adapter) when `useMockApi=true`.
  - `models/`
    - `insights.ts`
      - TypeScript interfaces for monthly summary models (KPI, category breakdown, etc.).
  - `state/`
    - `queryClient.ts`
      - React Query client setup, default cache times, retry policy.
  - `utils/`
    - `date.utils.ts`
      - Helpers for month parsing, validation, formatting (YYYY-MM), current month boundaries.
    - `numberFormat.utils.ts`
      - Currency and number formatting helpers (e.g., 2 decimal places, compact notation).
    - `error.utils.ts`
      - Mapping of API errors to user-friendly messages and correlation ID extraction.
  - `constants/`
    - `insightsConstants.ts`
      - Constants for supported date range (min/max month), time zone IDs, and KPI labels.
  - `assets/`
    - `brand/`
      - `logo.svg`
    - `icons/`
      - Category icons if needed (e.g., groceries, travel).
  - `styles/`
    - `global.css`
      - Tailwind base, MUI theme overrides, global typography and layout rules.
  - `tests/`
    - `MonthlySpendSummaryPage.test.tsx`
      - Tests for page-level behavior: month selection triggers fetch, loading states, error and empty states.
    - `insightsService.test.ts`
      - Tests for business logic: inclusion/exclusion of transactions, handling of partial responses.

---

## 3. Component Specification

### 3.1 Layout & Navigation Components

#### `DashboardLayout`
- **Type**: Layout component
- **Path**: `src/layouts/DashboardLayout/DashboardLayout.tsx`
- **Purpose**: Provide the shell for the application (header, sidebar, content, background styling) used by all dashboard pages.
- **Dependencies**:
  - `AppHeader`
  - `Sidebar`
  - `ResponsiveContainer`
  - MUI components (`AppBar`, `Toolbar`, `Drawer`, `Box`)
- **Data Inputs**:
  - Children React nodes
  - Optional props for active navigation item
- **Data Outputs**:
  - Rendered layout structure
- **Public Methods/Interfaces**:
  - React component props: `{ children: ReactNode }`
- **Events**:
  - Navigation item clicks -> route changes via React Router
- **State Management**:
  - Internal UI state for sidebar collapse on small screens (local `useState`).

#### `AppHeader`
- **Type**: Presentational component
- **Path**: `src/components/navigation/AppHeader.tsx`
- **Purpose**: Shows app name, global actions, and embeds `MonthSelector` for context-aware month selection.
- **Dependencies**:
  - `MonthSelector`
  - MUI `AppBar`, `Toolbar`, `IconButton`, `Typography`
- **Data Inputs**:
  - `selectedMonth: string`
  - `onMonthChange: (month: string) => void`
- **Data Outputs**:
  - Emits new month selection via `onMonthChange`
- **Public Methods/Interfaces**:
  - Component props described above
- **Events**:
  - Month dropdown change
- **State Management**:
  - Stateless; controlled by parent (page).

#### `Sidebar`
- **Type**: Presentational component
- **Path**: `src/components/navigation/Sidebar.tsx`
- **Purpose**: Left navigation for dashboard sections; highlights Monthly Insights.
- **Dependencies**:
  - React Router `NavLink`
  - MUI `List`, `ListItem`
- **Data Inputs**:
  - Route configuration or static nav items
- **Data Outputs**:
  - Navigation events (via router)
- **Public Methods/Interfaces**:
  - `{ }` or `{ items?: SidebarItem[] }`
- **Events**:
  - Clicks to navigate between routes
- **State Management**:
  - Minimal internal state for expand/collapse of groups if needed.

### 3.2 Monthly Insights Components

#### `MonthlySpendSummaryPage`
- **Type**: Page component
- **Path**: `src/pages/MonthlySpendSummaryPage/MonthlySpendSummaryPage.tsx`
- **Purpose**: Implements route for QE-3165; orchestrates month selection, data fetching, and rendering of `MonthlySpendSummaryView` inside `DashboardLayout`.
- **Dependencies**:
  - `DashboardLayout`
  - `MonthlySpendSummaryView`
  - `useMonthlySpendSummaryPageState` (from `.state.ts`)
  - React Router (for reading query params `month`)
- **Data Inputs**:
  - URL query parameter `month` (optional)
- **Data Outputs**:
  - Renders the complete screen based on selected month
- **Public Methods/Interfaces**:
  - N/A (route-level component)
- **Events**:
  - Handles month change and pushes to URL
- **State Management**:
  - Uses custom hook for selected month; leverages React Query for data.

#### `useMonthlySpendSummaryPageState`
- **Type**: Custom hook
- **Path**: `src/pages/MonthlySpendSummaryPage/MonthlySpendSummaryPage.state.ts`
- **Purpose**: Encapsulate page-specific state and interactions, including month selection and integration with data hooks.
- **Dependencies**:
  - `useSearchParams` from React Router
  - `validateMonth`, `getCurrentMonth` from `date.utils`
  - `useMonthlySummaryQuery` from `insightsService`
- **Data Inputs**:
  - Initial `month` from URL
- **Data Outputs**:
  - `{ selectedMonth, setSelectedMonth, summaryData, isLoading, isError, isEmpty, error, refetch }`
- **Public Methods/Interfaces**:
  - Hook return object
- **Events**:
  - Month change triggers query refetch and URL update
- **State Management**:
  - Local state for `selectedMonth`.

#### `MonthSelector`
- **Type**: Controlled input component
- **Path**: `src/components/insights/MonthSelector/MonthSelector.tsx`
- **Purpose**: Allow user to choose the target month (YYYY-MM), enforcing min/max and preventing future months.
- **Dependencies**:
  - MUI `TextField` or `DatePicker` (month view only)
  - `insightsConstants` for min/max month
  - `date.utils` for validation
- **Data Inputs**:
  - `value: string` (current month in `YYYY-MM`)
  - `onChange: (month: string) => void`
- **Data Outputs**:
  - Emits validated month string via `onChange`
- **Public Methods/Interfaces**:
  - Props with optional `disabled`, `label`.
- **Events**:
  - User changes selection
- **State Management**:
  - Local error state for invalid month display only (does not hold canonical value).

#### `MonthlySpendSummaryView`
- **Type**: Container/presentational component
- **Path**: `src/components/insights/MonthlySpendSummaryView/MonthlySpendSummaryView.tsx`
- **Purpose**: Visual representation of monthly spend; combines KPI cards, category chart, and feedback components.
- **Dependencies**:
  - `SummaryKpiCards`
  - `CategoryBreakdownChart`
  - `LoadingState`
  - `ErrorState`
  - `EmptyState`
  - `ResponsiveContainer`
- **Data Inputs**:
  - `data: MonthlySummary | null`
  - `isLoading: boolean`
  - `isError: boolean`
  - `isEmpty: boolean`
  - `errorMessage?: string`
  - `onRetry?: () => void`
- **Data Outputs**:
  - Renders appropriate UI state
- **Public Methods/Interfaces**:
  - Component props as above
- **Events**:
  - Retry button click -> `onRetry`
- **State Management**:
  - Stateless; state comes from props.

#### `SummaryKpiCards`
- **Type**: Presentational component
- **Path**: `src/components/insights/SummaryKpiCards/SummaryKpiCards.tsx`
- **Purpose**: Render top-level metrics as responsive cards (total spend, transaction count, average transaction amount if available).
- **Dependencies**:
  - MUI `Card`, `CardContent`, `Typography`
  - `numberFormat.utils` for currency formatting
- **Data Inputs**:
  - `totalSpend: number`
  - `transactionCount: number`
  - Optional `averageTransactionAmount?: number`
  - Currency code (e.g., `currency: string`)
- **Data Outputs**:
  - KPI cards UI
- **Public Methods/Interfaces**:
  - Props as above
- **Events**:
  - None
- **State Management**:
  - Stateless.

#### `CategoryBreakdownChart`
- **Type**: Chart component
- **Path**: `src/components/insights/CategoryBreakdownChart/CategoryBreakdownChart.tsx`
- **Purpose**: Show spend by category as donut or bar chart.
- **Dependencies**:
  - Recharts (`ResponsiveContainer`, `PieChart`, `Pie`, `Tooltip`, `Legend`)
  - `SummaryLegend`
- **Data Inputs**:
  - `categories: CategoryBreakdownItem[]`
    - Each item: `{ categoryId, categoryName, amount, percentage, color? }`
- **Data Outputs**:
  - Chart visualization
- **Public Methods/Interfaces**:
  - Props as above
- **Events**:
  - Hover for tooltips
- **State Management**:
  - Internal transient UI state (e.g., active segment for highlighting).

#### `SummaryLegend`
- **Type**: Presentational component
- **Path**: `src/components/insights/SummaryLegend/SummaryLegend.tsx`
- **Purpose**: Display label and color mapping for each category.
- **Dependencies**:
  - MUI `List`
- **Data Inputs**:
  - `categories: CategoryBreakdownItem[]`
- **Data Outputs**:
  - Legend items
- **Public Methods/Interfaces**:
  - Props as above
- **Events**:
  - None
- **State Management**:
  - Stateless.

### 3.3 Feedback Components

#### `LoadingState`
- **Type**: Presentational component
- **Path**: `src/components/feedback/LoadingState.tsx`
- **Purpose**: Show skeleton loaders for KPI cards and chart during data fetch.
- **Dependencies**:
  - MUI `Skeleton`, `Box`
- **Data Inputs**:
  - Optional props like `variant` (cards+chart / full-page)
- **Data Outputs**:
  - Loading UI
- **State Management**:
  - Stateless.

#### `ErrorState`
- **Type**: Presentational component
- **Path**: `src/components/feedback/ErrorState.tsx`
- **Purpose**: Display user-friendly error message with retry button.
- **Dependencies**:
  - MUI `Alert`, `Button`
- **Data Inputs**:
  - `title?: string`
  - `message: string`
  - `onRetry?: () => void`
- **Data Outputs**:
  - Error UI and optional retry button
- **State Management**:
  - Stateless.

#### `EmptyState`
- **Type**: Presentational component
- **Path**: `src/components/feedback/EmptyState.tsx`
- **Purpose**: Display when no monthly summaries are available (e.g., no card usage, consent not granted, or outside allowed range).
- **Dependencies**:
  - MUI `Typography`, `Box`
- **Data Inputs**:
  - `title: string`
  - `description?: string`
- **Data Outputs**:
  - Empty state UI
- **State Management**:
  - Stateless.

### 3.4 Shared Layout Component

#### `ResponsiveContainer`
- **Type**: Layout wrapper
- **Path**: `src/components/layout/ResponsiveContainer.tsx`
- **Purpose**: Enforce reusable responsive behavior (max width, padding, spacing) across dashboard pages.
- **Dependencies**:
  - MUI `Container`
- **Data Inputs**:
  - `children`
- **Data Outputs**:
  - Wrapped content with consistent spacing
- **State Management**:
  - Stateless.

---

## 4. Screen/UI Specification

### Screen: Monthly Credit Card Spend Summary Dashboard

- **Route/Page**: `/insights/monthly`
- **Layout Structure**:
  - Root: `DashboardLayout`
    - Header: `AppHeader` with application title and `MonthSelector` aligned right
    - Sidebar: `Sidebar` with "Monthly Insights" nav item active
    - Content: `ResponsiveContainer` hosting `MonthlySpendSummaryView`
- **Navigation**:
  - Accessible from sidebar.
  - Browser navigation: `?month=YYYY-MM` query parameter controls the selected month.
- **Component Hierarchy**:
  - `MonthlySpendSummaryPage`
    - `DashboardLayout`
      - `AppHeader`
        - `MonthSelector`
      - `Sidebar`
      - `ResponsiveContainer`
        - `MonthlySpendSummaryView`
          - `LoadingState` / `ErrorState` / `EmptyState`
          - `SummaryKpiCards`
          - `CategoryBreakdownChart`
            - `SummaryLegend`
- **Forms**:
  - `MonthSelector` acts as a minimal form element with validation on change.
- **Tables**:
  - Not required in this epic; all information via cards and charts.
- **Charts/Dashboards/Widgets**:
  - KPI cards widget: total spend, transaction count, optional average transaction.
  - Category breakdown chart (donut/bar): category labels, amounts, and percentage share.
- **User Actions**:
  - Select a month.
  - Retry data load after an error.
- **Validation Rules (UI-level)**:
  - Month must match regex `^\d{4}-(0[1-9]|1[0-2])$`.
  - Month must not be in the future relative to current system month.
  - Month must be within configured history window (`MIN_SUPPORTED_MONTH` to `currentMonth`). Out-of-range selection displays helper text and prevents API call.
- **Loading State**:
  - While data is being fetched:
    - Show `LoadingState` with 2–3 card skeletons and a chart skeleton.
- **Empty State**:
  - If API returns no summary data (e.g., user has no transactions) but no error:
    - Show `EmptyState` with message such as "No spending data available for this month." and keep `MonthSelector` enabled.
- **Error State**:
  - For network/server errors or consent/authorization denial:
    - Show `ErrorState` with friendly message derived from error type:
      - Consent not granted -> "Insights are currently unavailable. Please enable spending insights in your preferences."
      - Unauthorized -> "You do not have access to this summary."
      - Service unavailable -> "We are unable to load your summary right now. Please try again."
    - Retry button triggers refetch.
- **Responsive Behavior**:
  - Mobile (≤ 600px):
    - Sidebar collapses into a menu accessible from header.
    - KPI cards stack vertically.
    - Chart spans full width.
  - Tablet (600px–1024px):
    - Sidebar collapsible.
    - KPI cards in 2 columns.
    - Chart below cards.
  - Desktop (≥ 1024px):
    - Full sidebar.
    - KPI cards in a 3 or 4-column grid.
    - Chart to the right or below based on available width.
- **Visual Style**:
  - Minimal and elegant enterprise-grade dashboard.
  - Use soft background gradient in header.
  - Cards with rounded corners, soft shadows, and subtle hover elevation.
  - Typography: use MUI defaults tuned for clarity; titles in medium weight.
  - Smooth transitions on hover and chart animations (Recharts defaults). 
- **Accessibility**:
  - All interactive elements keyboard-navigable.
  - Sufficient color contrast for charts and text.
  - ARIA labels for chart regions and month selector.

---

## 5. Business Logic Specification

### Business Capability 1: Monthly Spend Calculation (Frontend Interpretation)

> Core computation happens server-side as per HLD; frontend assumes response is pre-aggregated and applies only interpretation and conditional display logic.

#### Rule 1: Valid Month Selection
- **Description**: Ensure only valid and supported months are used when requesting summaries.
- **Input Conditions**:
  - User-selected `month` string from `MonthSelector`.
- **Processing Logic**:
  1. Check that `month` matches `YYYY-MM` regex.
  2. Parse year and month to a Date object (use `date.utils`).
  3. Confirm date is not in the future.
  4. Confirm date is ≥ `MIN_SUPPORTED_MONTH` (from `insightsConstants`).
- **Output Result**:
  - Valid: propagate value to `selectedMonth` state and trigger API call.
  - Invalid: local error message; do not trigger API.
- **Validation Rules**:
  - Use separate, debounced validation for manual text input.
- **Exception Scenarios**:
  - If parsing fails, treat as invalid and show error "Enter a valid month (YYYY-MM).".

#### Rule 2: Handling Partial Data
- **Description**: Display partial summaries when only some metrics are available.
- **Input Conditions**:
  - API response where category breakdown or optional KPIs may be missing.
- **Processing Logic**:
  1. If `totalSpend` and `transactionCount` exist, render KPI cards.
  2. If `categories` array is missing or empty, hide chart and show short note "Category breakdown is currently unavailable." inside the view (not full-page empty).
- **Output Result**:
  - UX reflects partial availability without treating it as a global error.
- **Validation Rules**:
  - Use TypeScript guards to ensure fields exist before rendering.
- **Exception Scenarios**:
  - If all primary fields are missing (no total, no count), treat as error and show `ErrorState`.

#### Rule 3: Error Mapping
- **Description**: Map error responses to user-friendly UI messages.
- **Input Conditions**:
  - Error object from React Query/axios.
- **Processing Logic**:
  1. Inspect HTTP status and error code (from API contract).
  2. Map to user messages:
     - 401/403 -> access/authorization message.
     - 409 with `code="CONSENT_REQUIRED"` -> consent-specific message.
     - 503 or network error -> temporary unavailability message.
  3. Extract correlation ID from headers/body if provided and log via console or monitoring.
- **Output Result**:
  - Tuple `{ userMessage, correlationId? }` used by `ErrorState`.
- **Validation Rules**:
  - Fallback generic message if mapping fails.
- **Exception Scenarios**:
  - Unexpected error shape -> still show generic message and log details.

### Business Capability 2: Display of Monetary Values

#### Rule 4: Currency Formatting
- **Input Conditions**:
  - `totalSpend`, `category.amount`, currency code.
- **Processing Logic**:
  - Use `Intl.NumberFormat` with appropriate locale (`en-XX` configurable) and `currency` style.
- **Output Result**:
  - Consistent currency display with 2 decimal places.
- **Validation Rules**:
  - If currency code missing, default to configuration value.
- **Exception Scenarios**:
  - If formatting throws, fall back to plain number with 2 decimals.

---

## 6. API Specification

Base URL is determined by configuration (`apiBaseUrl`) and must be identical for mock and real implementations at the interface level.

### API: Get Monthly Spend Summary

- **API Name**: `getMonthlySpendSummary`
- **Endpoint**: `GET /insights/monthly-summary`
- **Query Parameters**:
  - `month` (required, string, `YYYY-MM`)
- **HTTP Method**: GET
- **Request Headers**:
  - `Authorization: Bearer <token>` (not used by mock but present in interface)
  - `Content-Type: application/json`
- **Request Payload**:
  - None (query parameter only)
- **Response Contract (200 OK)**:
  ```json
  {
    "month": "2026-05",
    "currency": "USD",
    "totalSpend": 1523.45,
    "transactionCount": 42,
    "averageTransactionAmount": 36.27,
    "categories": [
      {
        "categoryId": "GROCERIES",
        "categoryName": "Groceries",
        "amount": 450.12,
        "percentage": 29.57
      },
      {
        "categoryId": "TRAVEL",
        "categoryName": "Travel",
        "amount": 320.0,
        "percentage": 21.01
      }
    ],
    "metadata": {
      "isPrecomputed": true,
      "dataSource": "ISD",
      "generatedAt": "2026-05-02T10:15:30Z",
      "partial": false
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`
    - Body: `{ "code": "INVALID_MONTH", "message": "Month must be in format YYYY-MM and not in the future." }`
  - `401 Unauthorized`
    - Body: `{ "code": "UNAUTHORIZED", "message": "Authentication required." }`
  - `403 Forbidden`
    - Body: `{ "code": "ACCESS_DENIED", "message": "You are not allowed to view this summary." }`
  - `409 Conflict` (consent issues)
    - Body: `{ "code": "CONSENT_REQUIRED", "message": "Insights consent is required to access this feature." }`
  - `503 Service Unavailable`
    - Body: `{ "code": "SERVICE_UNAVAILABLE", "message": "Insights service is temporarily unavailable." }`

Implementation:
- **File Path**: `src/api/insightsApi.ts`
- **Functions**:
  - `getMonthlySpendSummary(month: string): Promise<MonthlySummaryDto>`
    - Uses `httpClient` Axios instance.

---

## 7. Mock API and Data Configuration

### Configuration Flag

- **Flag Name**: `useMockApi`
- **Location**:
  - Defined in `src/config/appConfig.ts` from environment variable `VITE_USE_MOCK_API`.
- **Behavior**:
  - `useMockApi = true` -> Configure mock server, route all `insightsApi` calls through mock handlers.
  - `useMockApi = false` -> Use real HTTP requests to configured `apiBaseUrl`.

UI components must remain unaware of mock vs real APIs; only the service layer and configuration manage this concern.

### Mock Provider

- **File Path**: `src/mocks/handlers/insightsMockHandlers.ts`
- **Purpose**: Provide mock response logic for `/insights/monthly-summary` endpoint.
- **Interface**:
  - Exports `registerInsightsMocks(httpClient: AxiosInstance): void` or MSW handlers equivalent.

#### Mock Data Structure

- **File Path**: `src/mocks/data/monthlySummary.mock.json`
- **Structure**:
  ```json
  {
    "month": "2026-05",
    "currency": "USD",
    "totalSpend": 1523.45,
    "transactionCount": 42,
    "averageTransactionAmount": 36.27,
    "categories": [
      {
        "categoryId": "GROCERIES",
        "categoryName": "Groceries",
        "amount": 450.12,
        "percentage": 29.57
      },
      {
        "categoryId": "TRAVEL",
        "categoryName": "Travel",
        "amount": 320.0,
        "percentage": 21.01
      }
    ],
    "metadata": {
      "isPrecomputed": true,
      "dataSource": "MOCK",
      "generatedAt": "2026-05-02T10:15:30Z",
      "partial": false
    }
  }
  ```

#### Mock Scenarios

All scenarios adhere to the real API contract.

1. **Success Scenario**
   - Condition: Valid month within supported range.
   - Behavior: Return JSON from `monthlySummary.mock.json` with `month` adjusted to requested month and generated timestamps.

2. **Empty Scenario**
   - Condition: Valid month but no spending (e.g., before card activation).
   - Behavior: Return:
     ```json
     {
       "month": "2026-03",
       "currency": "USD",
       "totalSpend": 0,
       "transactionCount": 0,
       "averageTransactionAmount": 0,
       "categories": [],
       "metadata": {
         "isPrecomputed": true,
         "dataSource": "MOCK",
         "generatedAt": "2026-03-01T00:00:00Z",
         "partial": false
       }
     }
     ```
   - Frontend interprets `transactionCount === 0` and `categories.length === 0` as empty state.

3. **Error Scenario (Consent Required)**
   - Condition: E.g., month < first consent date or explicit toggle.
   - Behavior: Respond with HTTP 409 and body:
     ```json
     {
       "code": "CONSENT_REQUIRED",
       "message": "Insights consent is required to access this feature."
     }
     ```

4. **Error Scenario (Service Unavailable)**
   - Condition: Simulate downtime via feature flag.
   - Behavior: Respond with HTTP 503 and body as per API spec.

### Mock Server Initialization

- **File Path**: `src/mocks/mockServer.ts`
- **Responsibilities**:
  - When `useMockApi=true`, initialize mock handlers on app startup (before first React render).
  - Ensure handlers intercept all `GET /insights/monthly-summary` calls.

---

## 8. Data Models

All models defined in `src/models/insights.ts`.

### 8.1 DTOs (API Layer)

#### `MonthlySummaryDto`
- **Attributes**:
  - `month: string` (required) — `YYYY-MM`.
  - `currency: string` (required) — ISO 4217 code.
  - `totalSpend: number` (required) — aggregated monthly spend.
  - `transactionCount: number` (required) — count of included transactions.
  - `averageTransactionAmount?: number` (optional) — may be omitted by backend.
  - `categories?: CategoryBreakdownItemDto[]` (optional) — may be absent or empty.
  - `metadata?: MonthlySummaryMetadataDto` (optional).

#### `CategoryBreakdownItemDto`
- **Attributes**:
  - `categoryId: string` (required) — stable identifier.
  - `categoryName: string` (required).
  - `amount: number` (required).
  - `percentage: number` (required) — 0–100.

#### `MonthlySummaryMetadataDto`
- **Attributes**:
  - `isPrecomputed: boolean` (required).
  - `dataSource: string` (required) — e.g., `ISD`, `CCD`, `MOCK`.
  - `generatedAt: string` (required) — ISO timestamp.
  - `partial: boolean` (required).

### 8.2 Domain Models (Frontend)

#### `MonthlySummary`
- **Attributes**:
  - `month: string` (required).
  - `currency: string` (required).
  - `totalSpend: number` (required).
  - `transactionCount: number` (required).
  - `averageTransactionAmount: number | null` (required but can be null if absent in DTO).
  - `categories: CategoryBreakdownItem[]` (required, default to empty array).
  - `metadata: MonthlySummaryMetadata | null`.
- **Validation Rules**:
  - `totalSpend >= 0`.
  - `transactionCount >= 0`.
  - `0 <= category.percentage <= 100` and sum ~ 100 (not enforced strictly in UI).

#### `CategoryBreakdownItem`
- **Attributes**:
  - `id: string` — same as `categoryId`.
  - `name: string`.
  - `amount: number`.
  - `percentage: number`.
  - `color?: string` — optional UI color mapping.

#### `MonthlySummaryMetadata`
- **Attributes**:
  - `isPrecomputed: boolean`.
  - `dataSource: string`.
  - `generatedAt: Date`.
  - `partial: boolean`.

Mapping from DTO to domain handled in `insightsService.ts`.

---

## 9. Application Flow

End-to-end flow from user interaction to UI update.

1. **User Action**
   - User navigates to `/insights/monthly` or selects "Monthly Insights" from sidebar.
2. **Screen Initialization**
   - `MonthlySpendSummaryPage` mounts.
   - `useMonthlySpendSummaryPageState` reads `month` from query params.
   - If absent or invalid, selects current month (`getCurrentMonth`) within constraints.
3. **Component & Business Logic**
   - Hook validates selected month (Rule 1).
   - Hook calls `useMonthlySummaryQuery(selectedMonth)` (React Query hook defined in `insightsService.ts`).
4. **Service / API Layer**
   - `useMonthlySummaryQuery` uses `insightsApi.getMonthlySpendSummary(selectedMonth)`.
   - `insightsApi` invokes `httpClient.get('/insights/monthly-summary', { params: { month } })`.
   - If `useMockApi=true`, `mockServer`/mock handlers intercept and return mock response.
   - If `useMockApi=false`, request is sent to real backend (`apiBaseUrl`).
5. **Response Handling**
   - On success (200):
     - `insightsService` maps `MonthlySummaryDto` to `MonthlySummary` domain model.
     - React Query caches result keyed by `['monthlySummary', month]`.
     - Hook exposes `summaryData` and flags to component.
   - On error (4xx/5xx):
     - Error is passed to `error.utils.ts` which applies Rule 3 (error mapping).
6. **UI Update**
   - While loading: `MonthlySpendSummaryView` shows `LoadingState`.
   - On success:
     - If `transactionCount === 0` and `categories.length === 0` -> `EmptyState` with appropriate message.
     - Else -> render `SummaryKpiCards` and `CategoryBreakdownChart`.
   - On error:
     - `MonthlySpendSummaryView` shows `ErrorState` with user-friendly message and retry action.
7. **State Changes**
   - Selecting a new month updates `selectedMonth`, pushes new query param, invalidates/fetches new React Query cache entry, and re-renders view.

This flow is identical regardless of mock vs real API; only data source differs based on configuration.

---

## 10. Configuration

### Configuration Files

- **`src/config/appConfig.ts`**
  - Exports:
    ```ts
    export interface AppConfig {
      apiBaseUrl: string;
      useMockApi: boolean;
      defaultCurrency: string;
      minSupportedMonth: string; // YYYY-MM
    }

    export const appConfig: AppConfig = {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
      defaultCurrency: import.meta.env.VITE_DEFAULT_CURRENCY ?? 'USD',
      minSupportedMonth: import.meta.env.VITE_MIN_SUPPORTED_MONTH ?? '2015-01'
    };
    ```

- **`src/config/featureFlags.ts`**
  - Exports:
    ```ts
    export const featureFlags = {
      enableCategoryBreakdown: true,
      enableAdvancedKpis: false
    } as const;
    ```

### Environment Variables

- `VITE_API_BASE_URL`
  - Base URL for real backend APIs (e.g., `https://api.example.com`).
- `VITE_USE_MOCK_API`
  - `'true'` or `'false'`; controls whether mock API is active.
- `VITE_DEFAULT_CURRENCY`
  - Default display currency if not provided by API.
- `VITE_MIN_SUPPORTED_MONTH`
  - Earliest month allowed by UI (string `YYYY-MM`).

### Constants

- **File**: `src/constants/insightsConstants.ts`
- **Contents**:
  ```ts
  export const MIN_SUPPORTED_MONTH = appConfig.minSupportedMonth;

  export const INSIGHTS_ROUTE = '/insights/monthly';

  export const KPI_LABELS = {
    totalSpend: 'Total Spend',
    transactionCount: 'Number of Transactions',
    averageTransactionAmount: 'Average Transaction Amount'
  } as const;
  ```

### Mock API Configuration

- **Initialization in `main.tsx`**:
  - Before rendering `App`, conditionally import and start `mockServer` if `appConfig.useMockApi` is true.
- **`src/mocks/mockServer.ts`**:
  - Provides `initMockServer(): Promise<void>` to configure MSW or Axios mocks.

### `useMockApi` Behavior

- When `useMockApi = true`:
  - No network calls made to real backend for `/insights/monthly-summary`.
  - All calls resolved by `insightsMockHandlers` using data from `monthlySummary.mock.json` and the mock scenarios described.
  - Application must be fully functional (all UI flows) based solely on mock data.

- When `useMockApi = false`:
  - HTTP calls made to `${apiBaseUrl}/insights/monthly-summary` with real authentication headers.
  - Error handling and state updates are identical; only difference is data source.

This LLD contains all artifacts and contracts necessary for code generation of the QE-3165 monthly spend summary dashboard without further reference to the HLD.