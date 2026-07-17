# QE-3165 Monthly Credit Card Spend Insights - Low-Level Design (LLD)

## 1. Technology Stack

- **Frontend framework:** React 18 (TypeScript) with Vite
- **Programming language:** TypeScript for frontend, Node.js (TypeScript) for backend services
- **Styling framework:** Tailwind CSS with custom theme tokens
- **UI component library:** Headless UI + custom enterprise components
- **Responsive grid system:** CSS Grid/Flexbox via Tailwind 12-column layout utilities
- **Icon library:** Heroicons (outline/solid) + custom financial icons
- **Charting library:** Recharts (for KPI charts, bar/pie charts)
- **State management:** React Query for server state, Zustand for local UI state
- **API communication:** REST via Axios wrapper with interceptors
- **Build tool:** Vite for frontend; ts-node + npm scripts for mock API; backend assumed existing enterprise platform (only contract-level defined here)

---

## 2. Application Structure

Root layout:

- `/HLD` – existing high-level design docs (read-only)
- `/LLD` – generated low-level design docs
- `/src` – all application code

Within `src`:

- `src/app` – application bootstrap and routing
  - `src/app/App.tsx` – root React component, layout shell
  - `src/app/main.tsx` – React entry point, mounts App, providers setup
  - `src/app/routes.tsx` – central route definitions

- `src/components` – reusable UI components
  - `src/components/layout` – shell, header, sidebar, page layout
  - `src/components/navigation` – nav items, breadcrumbs
  - `src/components/common` – buttons, cards, modals, badges, tags
  - `src/components/forms` – form controls (inputs, selects, date/month pickers)
  - `src/components/tables` – table, pagination, filters row
  - `src/components/charts` – charts (donut, bar) for spend breakdown
  - `src/components/feedback` – empty states, error states, loaders
  - `src/components/insights` – domain-specific components for monthly spend insights

- `src/pages` – route-level screens
  - `src/pages/dashboard` – monthly spend dashboard
  - `src/pages/errors` – generic error/not found screens

- `src/layouts` – layout definitions
  - `src/layouts/MainLayout.tsx` – primary authenticated layout with header/sidebar
  - `src/layouts/AuthLayout.tsx` – (placeholder) for login/SSO callback if needed

- `src/services` – business services
  - `src/services/insights` – orchestration of monthly summary retrieval
  - `src/services/audit` – client-side audit event sender (if required)
  - `src/services/consent` – consent status fetcher

- `src/api` – API clients and interfaces
  - `src/api/httpClient.ts` – Axios instance with interceptors
  - `src/api/endpoints.ts` – API endpoint constants
  - `src/api/insightsApi.ts` – functions calling monthly summary endpoints
  - `src/api/consentApi.ts` – functions for consent checks

- `src/models` – TypeScript interfaces and types
  - `src/models/insights.ts` – DTOs for monthly summary, KPIs, breakdowns
  - `src/models/common.ts` – shared types (ID, date ranges, errors)

- `src/state` – state management
  - `src/state/uiStore.ts` – Zustand store for UI-level state (selection, layout prefs)
  - `src/state/sessionStore.ts` – auth/session metadata (user, roles, consent flags)

- `src/shared` – shared utilities and constants
  - `src/shared/constants.ts` – constant values for app
  - `src/shared/dateUtils.ts` – month handling utilities
  - `src/shared/formatters.ts` – currency, percent, number formatting
  - `src/shared/validation.ts` – shared validation functions for inputs
  - `src/shared/accessControl.ts` – RBAC/ABAC helpers on client side

- `src/theme` – design system implementation
  - `src/theme/tokens.ts` – color, typography, spacing tokens
  - `src/theme/themeProvider.tsx` – Theme context/provider (if needed)

- `src/assets` – static assets
  - `src/assets/icons` – custom SVGs
  - `src/assets/images` – logos, backgrounds

- `src/styles` – global styles
  - `src/styles/index.css` – Tailwind base imports, global overrides

- `src/mocks` – mock API providers
  - `src/mocks/handlers` – mock handlers for each API
  - `src/mocks/data` – JSON/sample payloads
  - `src/mocks/server.ts` – mock server bootstrap (e.g., MSW or express-based)

Every artifact below includes its repository path and purpose.

---

## 3. Design System Specification

### 3.1 Theme

- **Mode:** Light theme by default; dark mode optional later.
- **Overall tone:** Professional enterprise finance dashboard; high contrast, minimal accent colors.

### 3.2 Colors

Defined in `src/theme/tokens.ts`:

- `colors.primary.500 = #0052CC` (deep blue)
- `colors.primary.600 = #0747A6`
- `colors.primary.50  = #E6F0FF`
- `colors.secondary.500 = #36B37E` (green, for positive KPIs)
- `colors.danger.500 = #DE350B`
- `colors.warning.500 = #FFAB00`
- `colors.info.500 = #00B8D9`
- `colors.gray.50 = #F7F8FA`
- `colors.gray.100 = #EBECF0`
- `colors.gray.500 = #6B778C`
- `colors.gray.900 = #172B4D`
- Backgrounds: `page = #F4F5F7`, `card = #FFFFFF`

### 3.3 Typography

Defined in `src/theme/tokens.ts`:

- Base font: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Scale:
  - `h1` = 28px, 700, line-height 1.3
  - `h2` = 24px, 600
  - `h3` = 20px, 600
  - `h4` = 16px, 600
  - `body-lg` = 16px, 400
  - `body` = 14px, 400
  - `caption` = 12px, 400, gray-500

### 3.4 Grid System & Breakpoints

Using Tailwind 12-column responsive grid (configured via `tailwind.config`):

- Breakpoints:
  - `sm`: 640px (1–4 columns)
  - `md`: 768px (up to 8 columns)
  - `lg`: 1024px (12 columns, desktop)
  - `xl`: 1280px (12 columns, wide desktop)
- KPI cards and charts arranged to use ≥90% viewport width on desktop.

### 3.5 Spacing & Sizing

In `src/theme/tokens.ts`:

- Base spacing unit: 4px
- Common spacings:
  - `xs = 4px`
  - `sm = 8px`
  - `md = 16px`
  - `lg = 24px`
  - `xl = 32px`
- Page padding: `24px` on desktop, `16px` on mobile.

### 3.6 Border Radius & Shadows

- Border radius:
  - `sm = 4px`
  - `md = 8px` (default for cards, buttons)
  - `lg = 12px` (featured KPIs)
- Shadows:
  - Card default: subtle: `0 1px 3px rgba(15, 23, 42, 0.12)`
  - Hovered card: `0 4px 12px rgba(15, 23, 42, 0.16)`

### 3.7 Cards

- Repository path: `src/components/common/Card.tsx`
- Styles:
  - Background: white
  - Radius: `md`
  - Padding: `16–24px`
  - Shadow: default card shadow
  - Title (`h4`), subtitle (`caption`), value (`h2`) for KPI cards
  - Optional gradient header bar: linear-gradient primary-600 → primary-500 for featured KPIs

### 3.8 Buttons

- Repository path: `src/components/common/Button.tsx`
- Variants:
  - `primary` (solid primary)
  - `secondary` (outline)
  - `ghost` (text)
- Sizes: `sm`, `md`, `lg`
- States: default, hover, active, disabled, loading (spinner)

### 3.9 Forms

- Repository path: `src/components/forms` (e.g., `FormField.tsx`, `MonthPicker.tsx`)
- Styles:
  - 1px border, gray-100, radius `md`
  - On focus: border `primary-500`, shadow subtle
  - Labels `body-sm` bold, helper text `caption`
  - Error state: border `danger-500`, error text below field

### 3.10 Tables

- Repository path: `src/components/tables/DataTable.tsx`
- Features:
  - Sticky header on desktop
  - Row hover state, zebra stripes optional
  - Columns for category breakdown when tabular views are used

### 3.11 Icons

- Repository path: `src/components/common/Icon.tsx`
- Use Heroicons for:
  - Dashboard, calendar, trend up/down, info, warning, error
- Color-coded icons in KPI cards for spend trends, anomalies (future extensions).

### 3.12 Responsive Behavior

- Layout collapses sidebar into top nav on small screens.
- KPI cards stack vertically on `sm`/`md`, grid 4-4-4 on `lg`/`xl`.
- Charts resize to container width (100%) and maintain appropriate height (min 240px).
- All actionable touch targets ≥44x44px.

---

## 4. Component Specification

For each component: name, type, path, purpose, dependencies, inputs, outputs, public methods, events, state.

### 4.1 Layout Components

#### 4.1.1 AppShell
- **Type:** Layout
- **Path:** `src/components/layout/AppShell.tsx`
- **Purpose:** Overall shell containing header, sidebar, content area; enforces 12-column grid and consistent padding.
- **Dependencies:** React, MainLayout, navigation components.
- **Inputs:**
  - `children: ReactNode`
- **Outputs:** Rendered layout.
- **Public methods:** None.
- **Events:** None.
- **State:** None.

#### 4.1.2 MainLayout
- **Type:** Layout
- **Path:** `src/layouts/MainLayout.tsx`
- **Purpose:** Layout for authenticated insights dashboard screens.
- **Dependencies:** AppShell, SidebarNav, TopBar.
- **Inputs:**
  - `children: ReactNode`
- **Outputs:** Layout with sidebar and main content.
- **State:** Local state for sidebar collapse (desktop/mobile toggle).

#### 4.1.3 SidebarNav
- **Type:** Navigation
- **Path:** `src/components/navigation/SidebarNav.tsx`
- **Purpose:** Displays navigation items including Monthly Spend Dashboard.
- **Dependencies:** Icon, react-router `Link`.
- **Inputs:**
  - `items: NavItem[]` (label, icon, path, requiredRoles?)
- **Events:** `onNavigate(path: string)` callback optional.
- **State:** Manages active item based on current route.

#### 4.1.4 TopBar
- **Type:** Header
- **Path:** `src/components/layout/TopBar.tsx`
- **Purpose:** Shows app title, current month, user info, consent indicator.
- **Dependencies:** Icon, Typography, ConsentBadge.
- **Inputs:**
  - `title: string`
  - `currentMonth: string` (YYYY-MM)
  - `consentStatus?: "granted" | "revoked" | "unknown"`
- **State:** None.

### 4.2 Common Components

#### 4.2.1 Card
- **Type:** Presentational
- **Path:** `src/components/common/Card.tsx`
- **Purpose:** Base card used across KPIs and sections.
- **Dependencies:** None.
- **Inputs:**
  - `title?: string`
  - `subtitle?: string`
  - `children: ReactNode`
  - `variant?: "default" | "kpi" | "highlight"`
- **State:** None.

#### 4.2.2 Button
- **Type:** Control
- **Path:** `src/components/common/Button.tsx`
- **Inputs:**
  - `variant?: "primary" | "secondary" | "ghost"`
  - `size?: "sm" | "md" | "lg"`
  - `isLoading?: boolean`
  - Standard button props.
- **Events:** `onClick`.

#### 4.2.3 Icon
- **Type:** Presentational
- **Path:** `src/components/common/Icon.tsx`
- **Inputs:**
  - `name: "dashboard" | "calendar" | "trendUp" | "trendDown" | "info" | "warning" | "error" | ...`
  - `size?: number`
  - `color?: string`

#### 4.2.4 Loader
- **Type:** Feedback
- **Path:** `src/components/feedback/Loader.tsx`
- **Purpose:** Spinner/loader for async states.
- **Inputs:** `message?: string`.

#### 4.2.5 ErrorState
- **Type:** Feedback
- **Path:** `src/components/feedback/ErrorState.tsx`
- **Purpose:** Generic error presentation.
- **Inputs:**
  - `title: string`
  - `description?: string`
  - `onRetry?: () => void`

#### 4.2.6 EmptyState
- **Type:** Feedback
- **Path:** `src/components/feedback/EmptyState.tsx`
- **Purpose:** Shown when no data (e.g., no transactions for month).
- **Inputs:**
  - `title: string`
  - `description?: string`

### 4.3 Form Components

#### 4.3.1 MonthPicker
- **Type:** Controlled input
- **Path:** `src/components/forms/MonthPicker.tsx`
- **Purpose:** Allow user to select month in YYYY-MM within permitted range.
- **Dependencies:** date-fns, validation helpers.
- **Inputs:**
  - `value: string` (YYYY-MM)
  - `minMonth?: string`
  - `maxMonth?: string`
  - `onChange: (newValue: string) => void`
- **Validation:** Uses regex `^\d{4}-(0[1-9]|1[0-2])$` and range checks via `dateUtils`.
- **Events:** `onChange`.
- **State:** Local UI state for open/close, highlighted month.

### 4.4 Chart Components

#### 4.4.1 SpendByCategoryDonutChart
- **Type:** Chart
- **Path:** `src/components/charts/SpendByCategoryDonutChart.tsx`
- **Purpose:** Visual breakdown of spend by category for selected month.
- **Dependencies:** Recharts.
- **Inputs:**
  - `data: { categoryId: string; categoryName: string; amount: number; percentage: number; }[]`
- **State:** Tooltip/hover state internal.

#### 4.4.2 MonthlyTrendBarChart (for future multi-month view, kept minimal now)
- **Type:** Chart
- **Path:** `src/components/charts/MonthlyTrendBarChart.tsx`
- **Purpose:** Optional trend view when multiple months available (can be toggled off).
- **Inputs:**
  - `data: { month: string; totalSpend: number; transactionCount: number; }[]`

### 4.5 Table Components

#### 4.5.1 CategoryBreakdownTable
- **Type:** Table
- **Path:** `src/components/tables/CategoryBreakdownTable.tsx`
- **Purpose:** Tabular view of spend by category.
- **Inputs:**
  - `rows: { categoryId: string; categoryName: string; amount: number; percentage: number; transactionCount: number; }[]`

### 4.6 Domain (Insights) Components

All map directly to HLD capabilities for monthly spend summary.

#### 4.6.1 MonthlySpendDashboard
- **Type:** Screen container
- **Path:** `src/components/insights/MonthlySpendDashboard.tsx`
- **Purpose:** Main dashboard component for monthly credit card spend insights.
- **Dependencies:**
  - MonthPicker, KPI cards, charts, tables, Loader, ErrorState, EmptyState
  - `useMonthlySummary` hook (from services/api)
- **Inputs:**
  - `initialMonth?: string`
- **Outputs:** Rendered dashboard.
- **State:**
  - Selected month (local or via Zustand)
  - View preferences (chart/table toggles)

#### 4.6.2 MonthlyKpiCards
- **Type:** Composite presentational
- **Path:** `src/components/insights/MonthlyKpiCards.tsx`
- **Purpose:** Render KPI cards for total spend, transaction count, average transaction amount (if available).
- **Inputs:**
  - `summary: MonthlySummary`
- **State:** None.

#### 4.6.3 ConsentBadge
- **Type:** Indicator
- **Path:** `src/components/insights/ConsentBadge.tsx`
- **Purpose:** Visual indicator of consent status for insights.
- **Inputs:**
  - `status: "granted" | "revoked" | "unknown"`

#### 4.6.4 PartialDataNotice
- **Type:** Feedback
- **Path:** `src/components/insights/PartialDataNotice.tsx`
- **Purpose:** Shown when some data is missing (e.g., CLS or AR partial failure) but totals are available.
- **Inputs:**
  - `message: string`

### 4.7 Hooks

#### 4.7.1 useMonthlySummary
- **Type:** Custom hook
- **Path:** `src/services/insights/useMonthlySummary.ts`
- **Purpose:** Encapsulate fetching and caching of monthly summary data.
- **Dependencies:** React Query, `insightsApi`.
- **Inputs:**
  - `month: string`
- **Outputs:**
  - `{ data, isLoading, isError, error, isPartial, refetch }`

---

## 5. Screen/UI Specification

### 5.1 Screen: Monthly Spend Dashboard

- **Name:** Monthly Spend Dashboard
- **Path:** `src/pages/dashboard/MonthlySpendDashboardPage.tsx`
- **Route:** `/insights/monthly-spend`
- **Layout:**
  - Uses `MainLayout` via route composition.
  - Content area uses 12-column responsive grid.
  - Page width utilizes ≥90% of viewport on `lg` and above.

#### 5.1.1 Layout Structure (Desktop)

- **Top Row (Full width, 12 columns):**
  - Page header: Title "Monthly Credit Card Spend", MonthPicker aligned right.
- **Second Row (KPI Cards, 12 columns):**
  - 3–4 KPI cards in a 12-column grid:
    - Col spans:
      - Total Spend: `lg:col-span-4`
      - Number of Transactions: `lg:col-span-4`
      - Avg Transaction Amount (if exposed): `lg:col-span-4`
- **Third Row (Charts & Breakdown, 12 columns):**
  - Left: SpendByCategoryDonutChart card `lg:col-span-6`
  - Right: CategoryBreakdownTable card `lg:col-span-6`
- **Fourth Row (Optional Trend / Additional KPIs):**
  - Future extension area `lg:col-span-12`.

#### 5.1.2 Layout Structure (Tablet/Mobile)

- Tablet (`md`):
  - Header full width.
  - KPI cards: two per row (`md:col-span-6`).
  - Chart above table stacked vertically.
- Mobile (`sm`):
  - Single-column stack: header → MonthPicker → KPI cards stacked → chart → table.

#### 5.1.3 Navigation

- Left sidebar with item: "Monthly Spend" (active on this route).
- Breadcrumb: `Home / Insights / Monthly Spend` (optional in `TopBar`).

#### 5.1.4 Component Hierarchy

- `MonthlySpendDashboardPage`
  - `MainLayout`
    - `TopBar`
    - `SidebarNav`
    - `MonthlySpendDashboard`
      - Header section (title, `MonthPicker`)
      - `Loader` / `ErrorState` / `EmptyState` depending on state
      - KPI section: `MonthlyKpiCards`
      - Breakdown section: `Card`
        - `SpendByCategoryDonutChart`
        - `CategoryBreakdownTable`
      - `PartialDataNotice` when applicable

#### 5.1.5 Forms

- **Month Selection Form:**
  - Single `MonthPicker` component bound to `selectedMonth` state.
  - On change: triggers data refetch via `useMonthlySummary`.
  - Validation: month format and allowed range (e.g., last 36 months, not future).

#### 5.1.6 Tables

- `CategoryBreakdownTable` columns:
  - Category
  - Amount (currency)
  - Percentage of total
  - Number of transactions
- Sorting optional (e.g., by amount descending by default).

#### 5.1.7 Charts

- `SpendByCategoryDonutChart`:
  - Each segment: category amount and percentage.
  - Legend aligned right or bottom depending on width.
  - Accessible labels for screen readers with category name and amount.

#### 5.1.8 Dashboards & Widgets

- **KPI Cards Order:**
  1. Total Monthly Spend
  2. Number of Transactions
  3. Average Transaction Amount (if provided by API)
- **Chart Placement:**
  - Donut chart on left for quick visual breakdown.
- **Widget Placement:**
  - Category table on right for detailed breakdown.
- **Container Widths & Grid Allocation:**
  - KPI section: full width, each KPI card at least 280px.
  - Breakdown section: 6/6 columns at `lg+`.
- **Section Hierarchy:**
  1. Filters (month selector)
  2. High-level KPIs
  3. Category visual breakdown (chart)
  4. Detailed breakdown table

#### 5.1.9 User Actions

- Select month.
- Retry loading on error.
- Hover/tap chart segments for details.
- Sort table columns (optional).

#### 5.1.10 States

- **Loading:**
  - Global loader overlay or skeletons for KPI cards and chart.
- **Empty:**
  - Show `EmptyState` with message like "No transactions for this month." Chart and table hidden.
- **Error:**
  - Show `ErrorState` with user-friendly message and retry button.
  - Technical details logged, not shown to users.
- **Partial:**
  - KPI totals present but category breakdown missing; show `PartialDataNotice` and hide or disable chart/table accordingly.

#### 5.1.11 Responsive Behavior

- Components shrink/stack based on breakpoints.
- Minimum left/right padding maintained to avoid clipping.
- Chart min height 240px, max 400px; width 100% of container.

---

## 6. Business Logic Specification

Business capabilities are implemented on the client only in terms of orchestration and validation; computation of totals and categorization is server-side. Below rules describe client-visible behaviors and assumptions of backend rules.

### 6.1 Capability: Month Selection & Validation

- **Rule name:** `VALID_MONTH_SELECTION`
- **Description:** Ensure only valid and allowed months can be selected.
- **Input:**
  - User-selected `month: string` (via MonthPicker).
- **Processing:**
  1. Validate against regex `^\d{4}-(0[1-9]|1[0-2])$`.
  2. Convert to date using `dateUtils.parseYearMonth`.
  3. Check `month >= MIN_ALLOWED_MONTH` and `month <= CURRENT_MONTH`.
- **Output:**
  - Validated month string; if invalid, UI shows error and no API call is made.
- **Validation:**
  - Invalid format or out-of-range triggers inline error on MonthPicker.
- **Exception scenarios:**
  - If parsing fails due to locale issues, treat as invalid and show generic error.

### 6.2 Capability: Fetch Monthly Summary

- **Rule name:** `FETCH_MONTHLY_SUMMARY`
- **Description:** Retrieve monthly spend summary from backend.
- **Input:**
  - `month` (validated).
- **Processing:**
  1. `useMonthlySummary` calls `insightsApi.getMonthlySummary(month)`.
  2. React Query caches result by `['monthlySummary', month]` key.
  3. HTTP client attaches auth token header if present.
- **Output:**
  - `MonthlySummary` data structure or error.
- **Validation:**
  - Response schema validated against `MonthlySummary` model (basic client-side checking).
- **Exception scenarios:**
  - HTTP 4xx/5xx → error state, allow retry.
  - Network timeouts → show error with retry.

### 6.3 Capability: Consent Verification (Client Awareness)

- **Rule name:** `CHECK_INSIGHTS_CONSENT`
- **Description:** Reflect server-side consent status in UI.
- **Input:**
  - `userId` (from session), implicit.
- **Processing:**
  1. Optional call to `consentApi.getConsentStatus('monthly_insights')` on app load or dashboard entry.
  2. Store result in `sessionStore`.
- **Output:**
  - Consent badge state; disabled dashboard if consent not granted.
- **Validation:**
  - If consent is revoked/denied, do not fire summary fetch requests.
- **Exception scenarios:**
  - Consent API unavailable: show `unknown` status and block insights by default.

### 6.4 Capability: Partial Data Handling

- **Rule name:** `HANDLE_PARTIAL_SUMMARY`
- **Description:** When backend indicates partial data (e.g., only totals, no breakdown), adjust UI.
- **Input:**
  - Response flag `isPartial: boolean` or missing sections.
- **Processing:**
  1. If `isPartial` true or `categories` array empty but `totalSpend > 0`, set `isPartial` in hook output.
  2. Show `PartialDataNotice` and hide chart/table if not reliable.
- **Output:**
  - Updated UI state.
- **Validation:**
  - Ensure at least totals are present before displaying KPIs.
- **Exception scenarios:**
  - Unexpected schema: treat as error and show ErrorState.

### 6.5 Capability: Accessibility & Compliance Feedback

- **Rule name:** `A11Y_UI_STATES`
- **Description:** Ensure major states are accessible (screen reader-friendly, focus management).
- **Input:**
  - UI state transitions.
- **Processing:**
  1. When error or empty state appears, move focus to the state container.
  2. Provide ARIA labels for charts.
- **Output:**
  - Improved accessibility; no user-visible functional change.
- **Exception scenarios:**
  - None (non-critical; log for future improvements only).

---

## 7. API Specification

Backend services (AS/AR/CM/etc.) exist outside this repo; this LLD defines the frontend contract and mock API layer. All URLs are relative to a configurable base URL.

### 7.1 API: Get Monthly Summary

- **Name:** `GetMonthlySummary`
- **Path (frontend constant):** `INSIGHTS_MONTHLY_SUMMARY`
- **Endpoint:** `GET /insights/monthly-summary`
- **Query Parameters:**
  - `month` (string, required, format YYYY-MM)
- **Headers:**
  - `Authorization: Bearer <token>` (if authenticated context is needed)
  - `X-Correlation-Id` (generated by client if not present)
- **Response 200 (application/json):**
  ```json
  {
    "month": "2026-05",
    "currency": "USD",
    "totalSpend": 1234.56,
    "transactionCount": 42,
    "averageTransactionAmount": 29.39,
    "categories": [
      {
        "categoryId": "groceries",
        "categoryName": "Groceries",
        "amount": 345.67,
        "percentage": 28.0,
        "transactionCount": 12
      }
    ],
    "isPartial": false
  }
  ```
- **Error responses:**
  - `400 Bad Request` – invalid month format or out of allowed range
    ```json
    { "code": "INVALID_MONTH", "message": "Month must be in format YYYY-MM and within allowed range." }
    ```
  - `401 Unauthorized` – missing or invalid auth token
    ```json
    { "code": "UNAUTHORIZED", "message": "Authentication required." }
    ```
  - `403 Forbidden` – lack of consent or insufficient roles
    ```json
    { "code": "INSIGHTS_ACCESS_DENIED", "message": "You are not allowed to view spending insights." }
    ```
  - `404 Not Found` – no data for this month
    ```json
    { "code": "SUMMARY_NOT_FOUND", "message": "No summary data found for the requested month." }
    ```
  - `503 Service Unavailable` – backend service down
    ```json
    { "code": "SERVICE_UNAVAILABLE", "message": "Spending insights are temporarily unavailable. Please try again later." }
    ```

### 7.2 API: Get Consent Status (Optional)

- **Name:** `GetInsightsConsentStatus`
- **Endpoint:** `GET /consent/insights-status`
- **Query Parameters:** none (uses auth context).
- **Response 200:**
  ```json
  {
    "feature": "monthly_insights",
    "status": "granted",
    "consentId": "cns_1234567890",
    "updatedAt": "2026-05-01T08:00:00Z"
  }
  ```
- **Error responses:**
  - `401`, `403` as above.
  - `503` indicating consent service unavailable.

---

## 8. Mock API & Runtime Configuration

### 8.1 Mock API Toggle

- **Config flag:** `useMockApi: boolean`
- **Location:**
  - `src/shared/constants.ts` – default value.
  - Overridable via `VITE_USE_MOCK_API` env variable.

Behavior:

- When `useMockApi = true`:
  - Frontend uses mock providers under `src/mocks` instead of real HTTP calls.
  - No real backend endpoints are called.
  - Mock data mimics shape of real API responses.
- When `useMockApi = false`:
  - Axios client uses configured `VITE_API_BASE_URL`.

Switching between modes requires only environment configuration; UI components call API abstraction (`insightsApi`, `consentApi`) which internally decide whether to use mocks.

### 8.2 Mock Provider Specification

#### 8.2.1 Mock for GetMonthlySummary

- **Mock provider path:**
  - `src/mocks/handlers/insightsMonthlySummaryHandler.ts`
- **Mock data path:**
  - `src/mocks/data/monthlySummary.sample.json`
- **Mock data structure:** matches real API response:
  ```json
  {
    "month": "2026-05",
    "currency": "USD",
    "totalSpend": 1850.75,
    "transactionCount": 58,
    "averageTransactionAmount": 31.91,
    "categories": [
      {
        "categoryId": "groceries",
        "categoryName": "Groceries",
        "amount": 520.5,
        "percentage": 28.1,
        "transactionCount": 18
      },
      {
        "categoryId": "travel",
        "categoryName": "Travel",
        "amount": 430.0,
        "percentage": 23.2,
        "transactionCount": 5
      }
    ],
    "isPartial": false
  }
  ```
- **Success scenario:**
  - For any valid past month: respond 200 with data; adjust totals per month seed (e.g., algorithmically vary amounts) to simulate realistic usage.
- **Empty scenario:**
  - For months older than a configured retention window or months with no data: return 404 `SUMMARY_NOT_FOUND`.
- **Error scenario:**
  - For a specific test month (e.g., `2099-01`), simulate 503 error.

#### 8.2.2 Mock for GetInsightsConsentStatus

- **Mock provider path:**
  - `src/mocks/handlers/consentStatusHandler.ts`
- **Mock data path:**
  - `src/mocks/data/consentStatus.sample.json`
- **Mock data structure:**
  ```json
  {
    "feature": "monthly_insights",
    "status": "granted",
    "consentId": "cns_mock_001",
    "updatedAt": "2026-05-01T08:00:00Z"
  }
  ```
- **Success scenario:**
  - Default: `status = "granted"`.
- **Empty/denied scenario:**
  - Toggle in mock configuration to return `status = "revoked"` or `"denied"` to block dashboard.
- **Error scenario:**
  - Simulate 503 for a given test user or feature flag.

### 8.3 Mock Server Bootstrap

- **Path:** `src/mocks/server.ts`
- **Purpose:** Initialize MSW or similar library; register handlers and start in development mode when `useMockApi` is true.

---

## 9. Data Models

All models are defined in `src/models`.

### 9.1 MonthlySummary

- **Path:** `src/models/insights.ts`
- **Name:** `MonthlySummary`
- **Attributes:**
  - `month: string` – required, YYYY-MM, validated.
  - `currency: string` – required, ISO 4217 currency code.
  - `totalSpend: number` – required, >= 0.
  - `transactionCount: number` – required, integer >= 0.
  - `averageTransactionAmount?: number` – optional, >= 0.
  - `categories: CategorySpendBreakdown[]` – required, can be empty array.
  - `isPartial: boolean` – required.
- **Validation rules:**
  - `month` via regex and range.
  - numeric fields must be finite; negative values rejected at deserialization.

### 9.2 CategorySpendBreakdown

- **Path:** `src/models/insights.ts`
- **Name:** `CategorySpendBreakdown`
- **Attributes:**
  - `categoryId: string` – required.
  - `categoryName: string` – required.
  - `amount: number` – required, >= 0.
  - `percentage: number` – required, 0–100.
  - `transactionCount: number` – required, integer >= 0.

### 9.3 ApiError

- **Path:** `src/models/common.ts`
- **Name:** `ApiError`
- **Attributes:**
  - `code: string` – required.
  - `message: string` – required.
  - `details?: unknown` – optional.

### 9.4 ConsentStatus

- **Path:** `src/models/common.ts`
- **Name:** `ConsentStatus`
- **Attributes:**
  - `feature: string` – required.
  - `status: "granted" | "revoked" | "denied" | "unknown"` – required.
  - `consentId?: string` – optional.
  - `updatedAt?: string` – optional ISO timestamp.

---

## 10. Application Flow

### 10.1 Primary Flow: View Monthly Spend Summary

1. **User Action:**
   - User navigates to `/insights/monthly-spend`.
2. **Screen:**
   - `MonthlySpendDashboardPage` within `MainLayout` renders.
3. **Component:**
   - `MonthlySpendDashboard` initializes with default month (current month or last completed month).
4. **Business Logic:**
   - `VALID_MONTH_SELECTION` validates default month.
5. **Service/API:**
   - `useMonthlySummary` triggers `FETCH_MONTHLY_SUMMARY` which calls `insightsApi.getMonthlySummary`.
   - If `useMockApi` is true, request is handled by mock; else real backend.
6. **Response:**
   - On 200: `MonthlySummary` data returned.
   - On 404: treat as empty data.
   - On other error: error state.
7. **UI Update:**
   - Loading state → replaced by KPI cards, chart, and table populated from response.
   - If categories array empty and totalSpend > 0: set partial state and show `PartialDataNotice`.

### 10.2 Alternate Flow: Change Month

1. **User Action:**
   - User selects a different month using `MonthPicker`.
2. **Component:**
   - `MonthPicker` fires `onChange(newMonth)`.
3. **Business Logic:**
   - `VALID_MONTH_SELECTION` validates new month; if valid, update selected month in `uiStore`.
4. **Service/API:**
   - `useMonthlySummary` detects month change and refetches from API.
5. **Response → UI Update:**
   - As in primary flow; previous data may be cached to avoid flicker.

### 10.3 Alternate Flow: No Consent / Revoked Consent

1. **User Action:**
   - User navigates to dashboard.
2. **Service/API:**
   - `CHECK_INSIGHTS_CONSENT` fetches consent status.
3. **Response:**
   - If `status !== "granted"`, do not call summary API.
4. **UI Update:**
   - Show message "Spending insights are unavailable because you have not granted consent." with informational guidance.

### 10.4 Error Flow: Backend Unavailable

1. **User Action:**
   - User attempts to view dashboard or change month.
2. **Service/API:**
   - Call to `GetMonthlySummary` returns 503 or network error.
3. **Business Logic:**
   - `FETCH_MONTHLY_SUMMARY` interprets as error.
4. **UI Update:**
   - `ErrorState` rendered with retry option.

---

## 11. Configuration

### 11.1 package.json Requirements

Minimal relevant dependencies:

- **Dependencies:**
  - `react`, `react-dom`
  - `react-router-dom`
  - `axios`
  - `@tanstack/react-query`
  - `zustand`
  - `recharts`
  - `tailwindcss`, `postcss`, `autoprefixer`
  - `clsx` (optional for classNames)
  - `date-fns`
- **DevDependencies:**
  - `typescript`
  - `vite`
  - `@vitejs/plugin-react`
  - `msw` (if using MSW for mocks)

### 11.2 Environment Variables

Files:

- `.env` – used locally.
- `.env.example` – committed with placeholder values.

Variables:

- `VITE_API_BASE_URL` – base URL for real backend APIs.
  - Default (in `.env.example`): `https://api.example.com`
- `VITE_USE_MOCK_API` – toggle for mock API.
  - Default: `true`
- `VITE_LOG_LEVEL` – optional, default `info`.

### 11.3 Runtime Configuration

- **Config path:** `src/shared/constants.ts`
- **Exports:**
  - `API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.example.com"`
  - `USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true"`
  - `MIN_ALLOWED_MONTH` (e.g., 36 months back from today, computed in `dateUtils`)
  - `FEATURE_FLAGS = { monthlyInsightsDashboard: true }`

### 11.4 useMockApi Behavior

- At app start (`main.tsx`):
  - If `USE_MOCK_API` is true, initialize mock server (`src/mocks/server.ts`) before rendering React app.
- API clients (`insightsApi`, `consentApi`):
  - If `USE_MOCK_API` true, route calls through mock handlers instead of Axios.
  - Exposed function signatures remain identical between real and mock implementations.

This LLD provides all necessary implementation details so the Code Generation Agent can scaffold and implement the complete Monthly Credit Card Spend Insights dashboard aligned with the given high-level design.
