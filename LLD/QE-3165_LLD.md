# QE-3165 Monthly Credit Card Spend Summary Dashboard - Low-Level Design (LLD)

> Epic: QE-3165 – Monthly total credit card spend calculation and summary dashboard
> Repository: Davamani-git/APB_Demo
> LLD Path: `LLD/QE-3165_LLD.md`

---

## 1. Technology Stack

### 1.1 Core Frontend Stack
- **Framework:** React `18.2.0`
  - Purpose: SPA rendering, component model for dashboard.
  - Compatibility: Requires Node `>=18.0.0`, npm `>=9.0.0`.
  - Mandatory rules:
    - Use **functional components** and **React Hooks** only.
    - No class components, no legacy lifecycle methods.
    - Use React StrictMode in root.

- **Language:** TypeScript `5.4.5`
  - Purpose: Static typing for reliability and better code generation.
  - Mandatory rules:
    - Enable `strict` mode, `noImplicitAny`, `strictNullChecks`.
    - All React components must be typed (`FC<Props>` or explicit prop types).

- **Build Tool / Dev Server:** Vite `5.2.0` with React + TS template
  - Purpose: Fast development server and optimized production builds.
  - Mandatory rules:
    - Single entry at `src/main.tsx`.
    - Use Vite environment variables `import.meta.env` only.

- **Routing:** React Router DOM `6.22.3`
  - Purpose: Client-side routing for monthly insights dashboard route.
  - Mandatory rules:
    - Use `createBrowserRouter` / `RouterProvider` or `BrowserRouter` + hooks from v6.
    - Do **not** use deprecated v5 APIs (`Switch`, `withRouter`, etc.).

- **State & Server Data:**
  - Global UI/Application State: Zustand `4.5.2`
    - Purpose: Lightweight global store (filters, selected month, layout flags, feature flags cache).
  - Server State / API Calls: `@tanstack/react-query` `5.40.0`
    - Purpose: Fetching, caching, and updating monthly summary APIs.
    - Mandatory rules:
      - Use **object syntax**: `useQuery({ queryKey, queryFn, ... })`, `useMutation({ mutationFn, ... })`.
      - Wrap app with `<QueryClientProvider>` at root.

- **HTTP Client:** Axios `1.7.2`
  - Purpose: REST API calls to Insights backend or mock providers.
  - Mandatory rules:
    - Create a single configured Axios instance in `src/services/httpClient.ts`.
    - Do not use `fetch` directly in components.

### 1.2 UI & Styling
- **Styling Framework:** Tailwind CSS `3.4.4`
  - Purpose: Utility-first styling with design tokens driven by config.
  - Mandatory rules:
    - Configure theme (colors, typography, spacing, etc.) in `tailwind.config.ts`.
    - Use utility classes and a small set of shared CSS classes only.

- **UI Component Library:** Material UI (MUI) `@mui/material` `5.15.20`, `@mui/icons-material` `5.15.20`
  - Purpose: Base UI components (buttons, cards, grids, tables, inputs, dialogs, tooltips).
  - Mandatory rules:
    - Wrap root with `<ThemeProvider>` using custom theme `src/theme/muiTheme.ts`.
    - Prefer MUI components with Tailwind for fine layout spacing.

- **Responsive Grid System:** MUI Grid + CSS Grid via Tailwind
  - Purpose: Implement 12-column responsive layout for dashboard.

- **Icon Library:** `@mui/icons-material` `5.15.20`
  - Purpose: Icons for KPI cards, actions, statuses.

- **Charting Library:** Recharts `2.12.7`
  - Purpose: Category breakdown charts (e.g., bar, pie) for monthly spend.
  - Mandatory rules:
    - Encapsulate charts inside shared components in `src/components/charts/`.

### 1.3 Tooling & Quality
- **Linting:** ESLint `8.57.0`, `@typescript-eslint/eslint-plugin` `7.8.0`, `@typescript-eslint/parser` `7.8.0`
- **Formatting:** Prettier `3.2.5`
- **Type Definitions:** `@types/react` `18.2.79`, `@types/react-dom` `18.2.25`

---

## 2. Application Structure

All implementation code lives under `src`. Only `HLD/` and `LLD/` are allowed at repo root besides config/build files.

```text
APB_Demo/
  HLD/
  LLD/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.ts
  postcss.config.cjs
  src/
    main.tsx
    App.tsx

    theme/
      muiTheme.ts
      tailwind.css

    config/
      env.ts
      featureFlags.ts
      apiConfig.ts

    models/
      insights.ts
      common.ts

    state/
      uiStore.ts
      insightsStore.ts

    services/
      httpClient.ts
      insightsService.ts
      mock/
        mockConfig.ts
        mockInsightsProvider.ts
        mockData.ts

    api/
      insightsApi.ts

    layouts/
      MainLayout.tsx

    routes/
      router.tsx

    components/
      common/
        PageContainer.tsx
        PageHeader.tsx
        ErrorState.tsx
        EmptyState.tsx
        LoadingState.tsx
        DateMonthPicker.tsx
        InfoTooltip.tsx
      dashboard/
        MonthlySummaryHeader.tsx
        KpiCard.tsx
        KpiCardGrid.tsx
        SpendCategoryChart.tsx
        SpendCategoryLegend.tsx
        TransactionsSummaryTable.tsx
        DashboardErrorBanner.tsx

    pages/
      insights/
        MonthlyInsightsDashboardPage.tsx

    utils/
      dateUtils.ts
      numberFormatters.ts
      errorHandling.ts

    assets/
      icons/
      images/

    constants/
      ui.ts
      insights.ts
```

### Key Folders & Purposes
- `src/theme/`
  - `muiTheme.ts`: Central MUI theme configuration.
  - `tailwind.css`: Base Tailwind directives and CSS variables.

- `src/config/`
  - `env.ts`: Reads and exports runtime environment variables.
  - `featureFlags.ts`: Feature flag definitions and default values.
  - `apiConfig.ts`: API base URL resolution and endpoints.

- `src/models/`
  - `insights.ts`: TypeScript interfaces for monthly summary models.
  - `common.ts`: Shared DTOs (error shape, pagination meta if needed).

- `src/state/`
  - `uiStore.ts`: Global UI state (theme mode, layout density, last error banner dismissed).
  - `insightsStore.ts`: Selected month, last successfully loaded summary metadata.

- `src/services/`
  - `httpClient.ts`: Axios instance configured with baseURL, interceptors.
  - `insightsService.ts`: Business-facing service functions to retrieve monthly summary using either real API or mock provider.
  - `mock/`: Mock API implementation.

- `src/api/`
  - `insightsApi.ts`: Low-level functions mapping to backend REST endpoints.

- `src/layouts/`
  - `MainLayout.tsx`: Top-level application shell (header, navigation, content container).

- `src/routes/`
  - `router.tsx`: Router configuration; maps dashboard route to page.

- `src/components/`
  - `common/`: Reusable, app-wide UI components.
  - `dashboard/`: Components specific to monthly insights dashboard.

- `src/pages/`
  - `insights/MonthlyInsightsDashboardPage.tsx`: Screen container for QE-3165.

- `src/utils/`
  - Utility functions (date formatting, number formatting, generic error mapping).

- `src/constants/`
  - `ui.ts`: UI-related constants (breakpoints labels, spacing values).
  - `insights.ts`: Query keys, route definitions, KPI identifiers.

---

## 3. Design System Specification

Implemented via MUI theme + Tailwind config.

### 3.1 Theme & Colors
- **Primary color:** `#1E88E5` (blue-600)
- **Primary light:** `#6AB7FF`
- **Primary dark:** `#005CB2`
- **Secondary color:** `#FFB300` (amber-600)
- **Secondary light:** `#FFE082`
- **Secondary dark:** `#C68400`
- **Background default:** `#0F172A` (dark slate)
- **Background paper/card:** `#111827`
- **Surface elevated:** `#1F2933`
- **Text primary:** `#F9FAFB`
- **Text secondary:** `#9CA3AF`
- **Border subtle:** `#1F2937`
- **Error:** `#EF5350`
- **Success:** `#4CAF50`
- **Warning:** `#FFB300`

### 3.2 Typography
- Base font family: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Font sizes:
  - `xs: 12px`, `sm: 14px`, `md: 16px`, `lg: 18px`, `xl: 20px`, `2xl: 24px`, `3xl: 30px`.
- Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold).
- Page titles: `text-2xl` / `font-semibold`.
- Card titles: `text-lg` / `font-medium`.
- Body text: `text-sm` or `text-md`.

### 3.3 Grid & Layout
- 12-column responsive layout using MUI Grid & Tailwind:
  - Desktop (`>=1280px`): 12 columns, dashboard content max width 1440px, using minimum 90% viewport width.
  - Tablet (`>=768px` and `<1280px`): 8–12 columns.
  - Mobile (`<768px`): stacked, single-column layout.
- Gaps between grid items: `16px` (mobile) to `24px` (desktop).

### 3.4 Spacing Scale
- Spacing units (px):
  - `0, 4, 8, 12, 16, 20, 24, 32, 40`.
- Horizontal page padding: `24px` on desktop, `16px` on mobile.
- Vertical section spacing: `24px`.

### 3.5 Border Radius & Shadows
- Border radius:
  - Cards & containers: `12px`.
  - Buttons & inputs: `8px`.
- Shadows:
  - Card: `0 10px 25px rgba(15, 23, 42, 0.45)`.
  - Elevated banners: `0 8px 20px rgba(0,0,0,0.35)`.

### 3.6 Component Styles
- **Cards:**
  - Background: `background.paper`.
  - Padding: `16–20px`.
  - Rounded corners and soft shadows.
  - Title at top, content in center, supporting text at bottom.

- **Buttons:**
  - Primary: Filled MUI button with primary color.
  - Secondary: Outlined button with primary border & text.
  - Icon buttons: For minor actions (reload, info).
  - Sizes: small (32px height) for dense layout, medium (40px) default.

- **Forms:**
  - Labels always visible, `text-sm`, secondary text color.
  - Inputs with subtle border and focus ring (primary color).
  - Error text in red, `text-xs`.

- **Tables:**
  - Dense rows, 48px row height.
  - Header row: slightly darker background, uppercase labels.
  - Alternating row background subtle.

- **Icons:**
  - Size 20–24px.
  - Used to indicate KPI type and states.

- **Responsive breakpoints** (Tailwind & MUI):
  - `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.

All screens must use this design system via MUI theme + Tailwind utilities.

---

## 4. Framework Implementation Rules

### 4.1 React
- Functional components only.
- Use Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, etc.).
- Memoize heavy components using `React.memo` when necessary.
- Avoid `any`; use typed props and state.

### 4.2 React Router v6
- Use `<BrowserRouter>` (or `<RouterProvider>` with `createBrowserRouter`).
- Use hooks `useNavigate`, `useLocation`, `useParams`, `useSearchParams`.
- Route configuration defined in `src/routes/router.tsx`.
- Deprecated patterns to avoid:
  - `Switch`, `Redirect`, `withRouter`.

### 4.3 React Query v5
- Query usage:
  ```ts
  const { data, isLoading, isError } = useQuery({
    queryKey: [INSIGHTS_QUERY_KEYS.monthlySummary, selectedMonth],
    queryFn: () => insightsService.getMonthlySummary({ month: selectedMonth }),
    staleTime: 5 * 60 * 1000,
  });
  ```
- Mutation usage:
  ```ts
  const mutation = useMutation({
    mutationFn: insightsService.refreshMonthlySummary,
  });
  ```
- Do not use array syntax `useQuery(['key'], fn)`; always object syntax.

### 4.4 Axios
- Single Axios instance in `src/services/httpClient.ts`.
- Use interceptors for:
  - Attach auth headers (if needed later).
  - Global error normalization.
- Do not create ad-hoc Axios instances in components.

### 4.5 State Management (Zustand)
- Create typed stores with selectors to avoid unnecessary re-renders.
- Do not mutate state objects directly; always use setter functions.

### 4.6 Charting (Recharts)
- Encapsulate chart logic inside `SpendCategoryChart.tsx`.
- Charts must handle loading, empty, and error states via outer components.

---

## 5. Component Specification

For each component: name, type, path, purpose, dependencies, inputs, outputs/events, state.

### 5.1 Layout & Shell

#### 5.1.1 `MainLayout`
- **Type:** Layout Component
- **Path:** `src/layouts/MainLayout.tsx`
- **Purpose:** Provides application shell with header, optional navigation, and main content area constrained to 90–100% viewport width.
- **Dependencies:** React, MUI `AppBar`, `Toolbar`, `Container`, `Box`, Tailwind classes, `PageHeader`.
- **Inputs (props):**
  - `children: React.ReactNode` – page content.
- **Outputs/Events:** None.
- **State Management:** Local state for responsive menu toggle if navigation added later.

### 5.2 Common Components

#### 5.2.1 `PageContainer`
- **Type:** Container Component
- **Path:** `src/components/common/PageContainer.tsx`
- **Purpose:** Wraps each page with consistent padding, max width, and background.
- **Inputs:**
  - `children: React.ReactNode`.
  - `maxWidth?: number | string` (default: `1440`px).
- **Outputs:** None.
- **State:** None.

#### 5.2.2 `PageHeader`
- **Path:** `src/components/common/PageHeader.tsx`
- **Purpose:** Standardized page header with title, subtitle, right-aligned actions (e.g., month picker, refresh button).
- **Inputs:**
  - `title: string`.
  - `subtitle?: string`.
  - `actions?: React.ReactNode`.
- **State:** None.

#### 5.2.3 `ErrorState`
- **Path:** `src/components/common/ErrorState.tsx`
- **Purpose:** Display error messages in a standardized way.
- **Inputs:**
  - `title?: string` (default: "Something went wrong").
  - `description?: string`.
  - `onRetry?: () => void`.
- **Outputs:**
  - Calls `onRetry` when retry button clicked.

#### 5.2.4 `EmptyState`
- **Path:** `src/components/common/EmptyState.tsx`
- **Purpose:** Display empty data states (no summary available).
- **Inputs:**
  - `title: string`.
  - `description?: string`.
- **State:** None.

#### 5.2.5 `LoadingState`
- **Path:** `src/components/common/LoadingState.tsx`
- **Purpose:** Show skeletons/spinners while loading.
- **Inputs:**
  - `message?: string`.
- **State:** None.

#### 5.2.6 `DateMonthPicker`
- **Path:** `src/components/common/DateMonthPicker.tsx`
- **Purpose:** Month selection control (YYYY-MM) for the dashboard.
- **Dependencies:** MUI `TextField`, optional `DatePicker` from `@mui/x-date-pickers` if later added; initially simple dropdown / input.
- **Inputs:**
  - `value: string` – ISO month `YYYY-MM`.
  - `minMonth?: string`.
  - `maxMonth?: string`.
  - `onChange: (value: string) => void`.
- **Validation:** Ensures proper `YYYY-MM` and within min/max; invalid values disabled.
- **State:** Local internal state for UI control; not persisted.

#### 5.2.7 `InfoTooltip`
- **Path:** `src/components/common/InfoTooltip.tsx`
- **Purpose:** Display explanatory tooltips for KPIs and charts.
- **Inputs:**
  - `title: string`.
  - `description?: string`.
- **State:** None.

### 5.3 Dashboard Components

#### 5.3.1 `MonthlySummaryHeader`
- **Path:** `src/components/dashboard/MonthlySummaryHeader.tsx`
- **Purpose:** Header row for dashboard showing selected month and quick stats.
- **Inputs:**
  - `selectedMonth: string`.
  - `totalSpend: number | null`.
  - `transactionCount: number | null`.
- **State:** None.

#### 5.3.2 `KpiCard`
- **Path:** `src/components/dashboard/KpiCard.tsx`
- **Purpose:** Reusable KPI card for total spend, transaction count, average ticket size, etc.
- **Inputs:**
  - `label: string`.
  - `value: string` (pre-formatted).
  - `trend?: "up" | "down" | "flat"` (reserved for future use).
  - `icon?: React.ReactNode`.
- **State:** None.

#### 5.3.3 `KpiCardGrid`
- **Path:** `src/components/dashboard/KpiCardGrid.tsx`
- **Purpose:** Arranges KPI cards in responsive 12-column grid.
- **Inputs:**
  - `items: { id: string; label: string; value: string; icon?: React.ReactNode }[]`.
- **State:** None.

#### 5.3.4 `SpendCategoryChart`
- **Path:** `src/components/dashboard/SpendCategoryChart.tsx`
- **Purpose:** Visual category breakdown (e.g., bar or donut chart) of monthly spend.
- **Dependencies:** Recharts (`ResponsiveContainer`, `BarChart`/`PieChart` etc.).
- **Inputs:**
  - `data: { category: string; amount: number; percentage: number }[]`.
- **State:** Local hover/selection state for tooltip.

#### 5.3.5 `SpendCategoryLegend`
- **Path:** `src/components/dashboard/SpendCategoryLegend.tsx`
- **Purpose:** Legend for category chart with amounts and percentages.
- **Inputs:**
  - `data: { category: string; amount: number; percentage: number; color: string }[]`.
- **State:** None.

#### 5.3.6 `TransactionsSummaryTable`
- **Path:** `src/components/dashboard/TransactionsSummaryTable.tsx`
- **Purpose:** Tabular high-level summary (e.g., category, count of transactions, share of total) without transaction-level details.
- **Inputs:**
  - `rows: { category: string; transactionCount: number; amount: number; percentage: number }[]`.
- **State:** Local sorting state by column.

#### 5.3.7 `DashboardErrorBanner`
- **Path:** `src/components/dashboard/DashboardErrorBanner.tsx`
- **Purpose:** Shows top-of-page banner when major backend failures occur.
- **Inputs:**
  - `message: string`.
  - `onRetry?: () => void`.
- **State:** Local dismiss state (`isVisible`).

### 5.4 Page Component

#### 5.4.1 `MonthlyInsightsDashboardPage`
- **Path:** `src/pages/insights/MonthlyInsightsDashboardPage.tsx`
- **Purpose:** Main screen combining all dashboard components, orchestrating data fetch and UI states.
- **Dependencies:**
  - React Router (`useSearchParams` or `useLocation`),
  - React Query (`useQuery`),
  - Zustand stores (`insightsStore`),
  - Components defined above.
- **Inputs:** Route params & search params (month).
- **Outputs:** None (screen-level component).
- **State Management:**
  - Reads/updates selected month from `insightsStore`.
  - Handles local UI state flags for refreshing and error handling.

---

## 6. Screen/UI Specification

### 6.1 Screen: Monthly Insights Dashboard
- **Screen name:** Monthly Insights Dashboard
- **Route:** `/insights/monthly-summary` with optional query param `?month=YYYY-MM`.
- **Layout:**
  - Wrap with `MainLayout`.
  - Use `PageContainer` to center content and enforce `maxWidth`.
  - Header (`PageHeader`) shows title "Monthly credit card spend" and subtitle with selected month.
  - Actions: `DateMonthPicker` and refresh button on the right.

- **Navigation:**
  - Accessible from main navigation (placeholder link `Insights`).
  - Direct deep-link allowed with `?month=`.

- **Component Hierarchy:**
  ```
  MainLayout
    PageContainer
      PageHeader (title, subtitle, actions: DateMonthPicker, RefreshButton)
      DashboardErrorBanner (conditional)
      if loading -> LoadingState
      else if error -> ErrorState
      else if empty -> EmptyState
      else
        MonthlySummaryHeader
        KpiCardGrid
        Grid (12 columns)
          SpendCategoryChart (md+ left, full width on mobile)
          SpendCategoryLegend (md+ right, below chart on mobile)
        TransactionsSummaryTable
  ```

- **Forms:**
  - Month selection via `DateMonthPicker` (input/select).
  - Validation on blur or change: `YYYY-MM`, not in future, within allowed range (configurable via environment variable or constants).

- **Tables:**
  - `TransactionsSummaryTable` shows columns: Category, # of Transactions, Amount, Share of total (%).
  - Sortable by amount and transactions.

- **Charts:**
  - `SpendCategoryChart` uses bar or donut chart.
  - Tooltip shows category name, absolute amount (formatted) and percentage.

- **Dashboards & Widgets:**
  - KPI cards as top widgets: total spend, transaction count, optional average transaction size.

- **KPI Card Order (Top Row):**
  1. Total Spend This Month
  2. Number of Transactions
  3. Average Transaction Amount (computed on frontend if not provided: total/transactions).

- **Chart & Widget Placement:**
  - Row 1: KPI cards (3–4 across, responsive).
  - Row 2: Category chart (8 columns on desktop) + legend (4 columns on desktop).
  - Row 3: Transaction summary table (full width).

- **Grid Allocation:**
  - Desktop (`lg+`):
    - KPI cards: 4 columns each (3 cards = 12 columns).
    - Chart: `lg=8` columns.
    - Legend: `lg=4` columns.
  - Tablet (`md`):
    - KPI cards: 6 columns each (two per row), third wraps.
    - Chart and legend stacked with equal width.
  - Mobile (`sm`):
    - All components stacked full-width.

- **User Actions:**
  - Change month selection.
  - Refresh data (re-run query, bypass cache using React Query `refetch` or `invalidateQueries`).

- **Validation:**
  - Client-side:
    - Month must match regex `^\d{4}-(0[1-9]|1[0-2])$`.
    - Month cannot be in future relative to current date.
    - Month cannot be older than configured minimum (e.g., 36 months back, using constant).
  - Server-side errors surfaced via error state.

- **Loading State:**
  - While fetching data: display `LoadingState` skeletons replacing KPI row, chart and table.

- **Empty State:**
  - If API returns no data (e.g., user has no transactions that month): show `EmptyState` with message like "No credit card activity for this month".

- **Error State:**
  - Network/server errors: `DashboardErrorBanner` at top + `ErrorState` in content area with retry.
  - Business errors (e.g., consent not granted): show error banner with specific messaging and hide data sections.

- **Responsive Behavior:**
  - Must render correctly on desktop (>=1280px), tablet, and mobile down to 360px width.
  - Use flex and grid to avoid clipped content.

- **Accessibility:**
  - All interactive elements keyboard navigable.
  - ARIA labels for chart tooltips and legend.
  - Sufficient color contrast for text.

---

## 7. Business Logic Specification

### 7.1 Capability: Monthly Spend Summary Retrieval
- **Rule:** Retrieve monthly aggregated spend and summary KPIs for a valid month where user has consent.
- **Description:** When a user selects a month, the app fetches pre-aggregated monthly summary data. If not available or error, appropriate state shown.
- **Input:**
  - `month: string` in format `YYYY-MM`.
- **Processing:**
  1. Validate `month` format on client.
  2. `MonthlyInsightsDashboardPage` reads `selectedMonth` from `insightsStore` or URL.
  3. React Query issues request through `insightsService.getMonthlySummary({ month })`.
  4. Service chooses mock or real API based on runtime config.
  5. API returns summary DTO.
  6. UI maps DTO to KPI cards, chart, and table.
- **Output:**
  - Monthly summary view containing KPIs, chart, and table.
- **Validation:**
  - Month format and range.
  - API response schema validation via TypeScript types and defensive checks.
- **Exception Scenarios:**
  - Invalid month format → Client prevents submission; sets inline error on `DateMonthPicker`.
  - Month out of range → Display inline validation message; do not call API.
  - API returns consent error → Show error banner "Insights not available – consent not granted".
  - API timeout/server error → Show retryable error state.

### 7.2 Capability: Data State Handling
- **Rule:** UI must clearly differentiate between loading, empty, partial, and error states.
- **Input:**
  - React Query state flags and API response contents.
- **Processing:**
  - If `isLoading` or `isFetching` → show `LoadingState`.
  - Else if `isError` → show `DashboardErrorBanner` + `ErrorState`.
  - Else if `data` exists but contains zero total and no categories → treat as empty → `EmptyState`.
  - Else → render full dashboard.
- **Output:**
  - Appropriate UI for each state.
- **Exception Scenarios:**
  - Partial data (e.g., totalSpend but no category breakdown). UI still renders KPI cards and shows message near chart: "Category breakdown unavailable".

### 7.3 Capability: Derived Metrics Calculation
- **Rule:** Some KPIs (e.g., average transaction amount) may be derived in frontend.
- **Input:**
  - `totalSpend: number`, `transactionCount: number` from API.
- **Processing:**
  - `average = transactionCount > 0 ? totalSpend / transactionCount : 0`.
  - Formatting via `numberFormatters.ts`.
- **Output:**
  - Derived numeric values for KPI cards.
- **Exception Scenarios:**
  - Division by zero prevented by conditional.

---

## 8. API Specification

The frontend consumes a single primary API for this epic.

### 8.1 API: Get Monthly Spend Summary
- **Name:** `getMonthlySummary`
- **Endpoint:** `/insights/monthly-summary`
- **HTTP Method:** `GET`
- **Query Parameters:**
  - `month` (required, string, `YYYY-MM`).
- **Request Headers:**
  - `Authorization: Bearer <token>` (when integrated with IDP).
  - `Content-Type: application/json`.

- **Request Example (URL):**
  - `/insights/monthly-summary?month=2026-05`

- **Success Response (200):**
  ```json
  {
    "month": "2026-05",
    "currency": "USD",
    "totalSpend": 1234.56,
    "transactionCount": 42,
    "categories": [
      { "category": "Groceries", "amount": 400.25, "transactionCount": 10, "percentage": 32.43 },
      { "category": "Travel", "amount": 300.0, "transactionCount": 5, "percentage": 24.32 }
    ],
    "metadata": {
      "generatedAt": "2026-05-31T23:59:59Z",
      "dataSource": "ISD",
      "hasCompleteData": true,
      "consentStatus": "granted"
    }
  }
  ```

- **Empty Response (200 with no activity):**
  ```json
  {
    "month": "2026-05",
    "currency": "USD",
    "totalSpend": 0,
    "transactionCount": 0,
    "categories": [],
    "metadata": {
      "generatedAt": "2026-05-31T23:59:59Z",
      "dataSource": "ISD",
      "hasCompleteData": true,
      "consentStatus": "granted"
    }
  }
  ```

- **Error Responses:**
  - **400 – Validation Error**
    ```json
    {
      "errorCode": "INVALID_MONTH",
      "message": "Month must be in format YYYY-MM and within allowed range"
    }
    ```
  - **403 – Consent Not Granted**
    ```json
    {
      "errorCode": "CONSENT_REQUIRED",
      "message": "Spending insights are not available because consent has not been granted"
    }
    ```
  - **503 – Service Unavailable**
    ```json
    {
      "errorCode": "SUMMARY_UNAVAILABLE",
      "message": "Monthly summary is temporarily unavailable. Please try again later."
    }
    ```

---

## 9. Mock API & Runtime Configuration

### 9.1 Mock API Toggle
- **Config Flag:** `useMockApi`.
- **Source:** Environment variable `VITE_USE_MOCK_API` parsed as boolean.
- **Behavior:**
  - If `useMockApi === true` → `insightsService` delegates to mock provider instead of real HTTP API.
  - If `useMockApi === false` → `insightsService` calls real REST API via Axios.
  - UI components must not know the data source.

### 9.2 Mock Provider
- **Module Path:** `src/services/mock/mockInsightsProvider.ts`
- **Public Interface:**
  ```ts
  import { MonthlySummaryResponse } from "../../models/insights";

  export async function getMonthlySummaryMock(params: {
    month: string;
  }): Promise<MonthlySummaryResponse>;
  ```

- **Mock Data Storage:** `src/services/mock/mockData.ts`
  - Contains pre-defined monthly summaries keyed by month.

- **Mock Data Examples:**
  ```ts
  export const MOCK_MONTHLY_SUMMARIES: Record<string, MonthlySummaryResponse> = {
    "2026-05": {
      month: "2026-05",
      currency: "USD",
      totalSpend: 1234.56,
      transactionCount: 42,
      categories: [
        { category: "Groceries", amount: 400.25, transactionCount: 10, percentage: 32.43 },
        { category: "Travel", amount: 300.0, transactionCount: 5, percentage: 24.32 },
        { category: "Other", amount: 534.31, transactionCount: 27, percentage: 43.25 }
      ],
      metadata: {
        generatedAt: "2026-05-31T23:59:59Z",
        dataSource: "mock",
        hasCompleteData: true,
        consentStatus: "granted"
      }
    }
  };
  ```

- **Mock Provider Logic:**
  - If month key found → return corresponding mock summary.
  - If not found → return empty summary with `totalSpend = 0`, `transactionCount = 0`, `categories = []`.
  - Simulate latency using `setTimeout` (e.g., 300–800ms).
  - Randomly (configurable) simulate error cases for resilience testing.

- **Error Mock:**
  ```ts
  throw {
    response: {
      status: 503,
      data: { errorCode: "SUMMARY_UNAVAILABLE", message: "Mocked outage" }
    }
  };
  ```

### 9.3 Runtime Configuration
- **Module:** `src/services/mock/mockConfig.ts` & `src/config/env.ts`.
- `env.ts` parses:
  - `VITE_API_BASE_URL`
  - `VITE_USE_MOCK_API`
  - `VITE_MIN_MONTH`
  - `VITE_MAX_MONTH`

- `mockConfig.ts` controls:
  - Error simulation on/off.
  - Artificial delay bounds.

---

## 10. Data Models

### 10.1 Monthly Summary Models
- **Path:** `src/models/insights.ts`

```ts
export interface CategorySummary {
  category: string;
  amount: number;
  transactionCount: number;
  percentage: number;
}

export interface SummaryMetadata {
  generatedAt: string; // ISO datetime
  dataSource: "ISD" | "CCD" | "mock";
  hasCompleteData: boolean;
  consentStatus: "granted" | "revoked" | "unknown";
}

export interface MonthlySummaryResponse {
  month: string; // YYYY-MM
  currency: string; // ISO currency code
  totalSpend: number;
  transactionCount: number;
  categories: CategorySummary[];
  metadata: SummaryMetadata;
}
```

### 10.2 Common Models
- **Path:** `src/models/common.ts`

```ts
export interface ApiErrorResponse {
  errorCode: string;
  message: string;
}
```

---

## 11. Application Flow

### 11.1 Primary Flow: View Monthly Spend Summary
1. **User Action:**
   - User navigates to `/insights/monthly-summary` (directly or via menu).

2. **Screen Activation:**
   - React Router renders `MonthlyInsightsDashboardPage` inside `MainLayout`.
   - Page reads `month` query param or uses default from `insightsStore` / current month utility.

3. **State Setup:**
   - `insightsStore` holds `selectedMonth`.
   - If not set, initialize using utility `getDefaultMonth()` from `dateUtils.ts`.

4. **Data Fetch:**
   - `useQuery` in `MonthlyInsightsDashboardPage` calls `insightsService.getMonthlySummary({ month: selectedMonth })`.
   - `insightsService`:
     - Reads `useMockApi` from `env.ts` / `featureFlags.ts`.
     - If true → invokes `getMonthlySummaryMock`.
     - Else → invokes `insightsApi.getMonthlySummary`.

5. **API Call:**
   - `insightsApi.getMonthlySummary` uses Axios instance `httpClient` with base URL `API_BASE_URL`.
   - Sends GET request to `/insights/monthly-summary?month=<selectedMonth>`.

6. **Response Handling:**
   - On success:
     - Data typed as `MonthlySummaryResponse`.
     - React Query caches response under key `["monthlySummary", selectedMonth]`.
     - UI components receive data through props.
   - On error:
     - Error normalized via `errorHandling.ts` into a user-friendly message.

7. **UI Update:**
   - **Loading:** show skeletons via `LoadingState`.
   - **Success:**
     - `MonthlySummaryHeader` shows month, total spend & transaction count.
     - `KpiCardGrid` shows KPI cards.
     - `SpendCategoryChart` + `SpendCategoryLegend` show category breakdown.
     - `TransactionsSummaryTable` shows aggregated rows.
   - **Empty:** `EmptyState` layout when totalSpend=0 and no categories.
   - **Error:** Top `DashboardErrorBanner` and center `ErrorState` with retry.

8. **Retry:**
   - Retry button triggers `queryClient.invalidateQueries({ queryKey: ["monthlySummary", selectedMonth] })` or `refetch()`.

### 11.2 State Transitions
- `selectedMonth` changes when user updates month picker → triggers React Query refetch.
- `isLoading` → `isSuccess`/`isError` based on API result.
- Error banner visibility toggled locally by `DashboardErrorBanner` when dismissed.

---

## 12. Configuration

### 12.1 `package.json`

**Path:** `package.json`

Dependencies required to run `npm install` and `npm run dev` successfully:

```json
{
  "name": "apb-demo-insights-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint \"src/**/*.{ts,tsx}\"",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  },
  "dependencies": {
    "@mui/icons-material": "5.15.20",
    "@mui/material": "5.15.20",
    "@tanstack/react-query": "5.40.0",
    "axios": "1.7.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-router-dom": "6.22.3",
    "recharts": "2.12.7",
    "zustand": "4.5.2"
  },
  "devDependencies": {
    "@types/react": "18.2.79",
    "@types/react-dom": "18.2.25",
    "@typescript-eslint/eslint-plugin": "7.8.0",
    "@typescript-eslint/parser": "7.8.0",
    "@vitejs/plugin-react-swc": "3.6.0",
    "autoprefixer": "10.4.19",
    "eslint": "8.57.0",
    "postcss": "8.4.38",
    "prettier": "3.2.5",
    "tailwindcss": "3.4.4",
    "typescript": "5.4.5",
    "vite": "5.2.0"
  }
}
```

### 12.2 Environment Variables & Runtime Config

#### 12.2.1 `.env.example`
- **Path:** `.env.example`

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_MOCK_API=true
VITE_MIN_MONTH=2023-01
VITE_MAX_MONTH=2026-12
```

#### 12.2.2 `.env`
- **Path:** `.env`
- Default values for local development (can be same as `.env.example`).

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_MOCK_API=true
VITE_MIN_MONTH=2023-01
VITE_MAX_MONTH=2026-12
```

#### 12.2.3 `src/config/env.ts`

- Responsibilities:
  - Read `import.meta.env` variables.
  - Expose typed config object.

```ts
interface AppEnvConfig {
  apiBaseUrl: string;
  useMockApi: boolean;
  minMonth: string;
  maxMonth: string;
}

export const envConfig: AppEnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  useMockApi: (import.meta.env.VITE_USE_MOCK_API ?? "true") === "true",
  minMonth: import.meta.env.VITE_MIN_MONTH ?? "2023-01",
  maxMonth: import.meta.env.VITE_MAX_MONTH ?? "2026-12"
};
```

#### 12.2.4 `src/config/apiConfig.ts`

```ts
import { envConfig } from "./env";

export const API_ENDPOINTS = {
  monthlySummary: `${envConfig.apiBaseUrl}/insights/monthly-summary`
};
```

### 12.3 Feature Flags

#### 12.3.1 `src/config/featureFlags.ts`

```ts
export interface FeatureFlags {
  enableAverageTicketKpi: boolean;
  enableCategoryChart: boolean;
}

export const defaultFeatureFlags: FeatureFlags = {
  enableAverageTicketKpi: true,
  enableCategoryChart: true
};
```

### 12.4 HTTP Client Configuration

#### 12.4.1 `src/services/httpClient.ts`

```ts
import axios from "axios";
import { envConfig } from "../config/env";

export const httpClient = axios.create({
  baseURL: envConfig.apiBaseUrl,
  timeout: 10000
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error shape
    return Promise.reject(error);
  }
);
```

### 12.5 Insights API Wrapper

#### 12.5.1 `src/api/insightsApi.ts`

```ts
import { httpClient } from "../services/httpClient";
import { MonthlySummaryResponse } from "../models/insights";

export async function getMonthlySummary(params: { month: string }): Promise<MonthlySummaryResponse> {
  const response = await httpClient.get<MonthlySummaryResponse>("/insights/monthly-summary", {
    params: { month: params.month }
  });
  return response.data;
}
```

### 12.6 Insights Service

#### 12.6.1 `src/services/insightsService.ts`

```ts
import { envConfig } from "../config/env";
import { MonthlySummaryResponse } from "../models/insights";
import * as insightsApi from "../api/insightsApi";
import { getMonthlySummaryMock } from "./mock/mockInsightsProvider";

export async function getMonthlySummary(params: { month: string }): Promise<MonthlySummaryResponse> {
  if (envConfig.useMockApi) {
    return getMonthlySummaryMock(params);
  }
  return insightsApi.getMonthlySummary(params);
}
```

### 12.7 Mock Config & Provider

#### 12.7.1 `src/services/mock/mockConfig.ts`

```ts
export const mockConfig = {
  simulateLatency: true,
  minDelayMs: 300,
  maxDelayMs: 800,
  simulateErrors: false,
  errorRate: 0.05
};

export function getRandomDelay() {
  const { minDelayMs, maxDelayMs } = mockConfig;
  return Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs;
}
```

#### 12.7.2 `src/services/mock/mockData.ts`

```ts
import { MonthlySummaryResponse } from "../../models/insights";

export const MOCK_MONTHLY_SUMMARIES: Record<string, MonthlySummaryResponse> = {
  "2026-05": {
    month: "2026-05",
    currency: "USD",
    totalSpend: 1234.56,
    transactionCount: 42,
    categories: [
      { category: "Groceries", amount: 400.25, transactionCount: 10, percentage: 32.43 },
      { category: "Travel", amount: 300.0, transactionCount: 5, percentage: 24.32 },
      { category: "Other", amount: 534.31, transactionCount: 27, percentage: 43.25 }
    ],
    metadata: {
      generatedAt: "2026-05-31T23:59:59Z",
      dataSource: "mock",
      hasCompleteData: true,
      consentStatus: "granted"
    }
  }
};
```

#### 12.7.3 `src/services/mock/mockInsightsProvider.ts`

```ts
import { MOCK_MONTHLY_SUMMARIES } from "./mockData";
import { MonthlySummaryResponse } from "../../models/insights";
import { mockConfig, getRandomDelay } from "./mockConfig";

export async function getMonthlySummaryMock(params: { month: string }): Promise<MonthlySummaryResponse> {
  const { month } = params;
  const simulateError = mockConfig.simulateErrors && Math.random() < mockConfig.errorRate;

  await new Promise((resolve) => setTimeout(resolve, mockConfig.simulateLatency ? getRandomDelay() : 0));

  if (simulateError) {
    const error: any = new Error("Mocked outage");
    error.response = {
      status: 503,
      data: {
        errorCode: "SUMMARY_UNAVAILABLE",
        message: "Monthly summary is temporarily unavailable. Please try again later."
      }
    };
    throw error;
  }

  const summary = MOCK_MONTHLY_SUMMARIES[month];

  if (!summary) {
    return {
      month,
      currency: "USD",
      totalSpend: 0,
      transactionCount: 0,
      categories: [],
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: "mock",
        hasCompleteData: true,
        consentStatus: "granted"
      }
    };
  }

  return summary;
}
```

### 12.8 Stores

#### 12.8.1 `src/state/insightsStore.ts`

```ts
import { create } from "zustand";

interface InsightsState {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export const useInsightsStore = create<InsightsState>((set) => ({
  selectedMonth: "", // to be initialized in page using utils/dateUtils
  setSelectedMonth: (month) => set({ selectedMonth: month })
}));
```

#### 12.8.2 `src/state/uiStore.ts`

```ts
import { create } from "zustand";

interface UiState {
  lastErrorBannerDismissedAt?: string;
  setLastErrorBannerDismissedAt: (isoDate: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  lastErrorBannerDismissedAt: undefined,
  setLastErrorBannerDismissedAt: (isoDate) => set({ lastErrorBannerDismissedAt: isoDate })
}));
```

### 12.9 Utilities

#### 12.9.1 `src/utils/dateUtils.ts`

```ts
import { envConfig } from "../config/env";

export function getCurrentMonth(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export function getDefaultMonth(): string {
  return getCurrentMonth();
}

export function isValidMonth(month: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
}

export function isMonthInRange(month: string): boolean {
  const { minMonth, maxMonth } = envConfig;
  return month >= minMonth && month <= maxMonth;
}
```

#### 12.9.2 `src/utils/numberFormatters.ts`

```ts
export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
```

#### 12.9.3 `src/utils/errorHandling.ts`

```ts
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../models/common";

export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const status = axiosError.response?.status;
  const code = axiosError.response?.data?.errorCode;

  if (status === 403 && code === "CONSENT_REQUIRED") {
    return "Spending insights are not available because consent has not been granted.";
  }

  if (status === 400 && code === "INVALID_MONTH") {
    return "Month must be in format YYYY-MM and within the allowed range.";
  }

  return "Monthly summary is temporarily unavailable. Please try again later.";
}
```

### 12.10 Routes

#### 12.10.1 `src/constants/insights.ts`

```ts
export const INSIGHTS_ROUTES = {
  monthlySummary: "/insights/monthly-summary"
} as const;

export const INSIGHTS_QUERY_KEYS = {
  monthlySummary: "monthlySummary"
} as const;
```

#### 12.10.2 `src/routes/router.tsx`

```ts
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MonthlyInsightsDashboardPage } from "../pages/insights/MonthlyInsightsDashboardPage";
import { INSIGHTS_ROUTES } from "../constants/insights";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={INSIGHTS_ROUTES.monthlySummary} element={<MonthlyInsightsDashboardPage />} />
        <Route path="*" element={<Navigate to={INSIGHTS_ROUTES.monthlySummary} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 12.11 Root Components

#### 12.11.1 `src/main.tsx`

```ts
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRouter } from "./routes/router";
import { muiTheme } from "./theme/muiTheme";
import "./theme/tailwind.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
```

#### 12.11.2 `src/theme/muiTheme.ts`

```ts
import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1E88E5"
    },
    secondary: {
      main: "#FFB300"
    },
    background: {
      default: "#0F172A",
      paper: "#111827"
    },
    text: {
      primary: "#F9FAFB",
      secondary: "#9CA3AF"
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif"
    ].join(",")
  }
});
```

#### 12.11.3 `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E88E5",
        secondary: "#FFB300",
        background: {
          DEFAULT: "#0F172A",
          card: "#111827"
        }
      },
      borderRadius: {
        card: "12px",
        button: "8px"
      },
      boxShadow: {
        card: "0 10px 25px rgba(15, 23, 42, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
```

#### 12.11.4 `src/theme/tailwind.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-background text-white;
}
```

With this configuration, running `npm install` followed by `npm run dev` must start the development server with the monthly insights dashboard functional using mock data by default.
