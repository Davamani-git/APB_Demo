# APB Demo - Monthly Spending Summary Dashboard

This repository contains an AngularJS 1.7.9 Single Page Application implementing the **Monthly Spending Summary Dashboard** for credit card customers, aligned with Epic **QE-3284** and related user stories QE-3285–QE-3290.

## Overview

The application provides a high-level monthly spending summary, including:

- Monthly total credit card spend
- Key monthly KPIs (total spend, number of transactions, average transaction value)
- Visual representation of spend using cards and charts
- Month selection to compare spending across periods
- Basic breakdown of spend as an entry point into deeper analysis experiences

All business logic, components, routes, APIs, models, and rules are implemented strictly according to the approved LLD and AngularJS Code Generation Standards.

## Technology Stack

- AngularJS 1.7.9 (ngRoute, ngAnimate, ngSanitize)
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only)
- Chart.js 2.9.4
- HTML5 / CSS3

## Repository Layout

```text
src/
  app/
    controllers/
    services/
    factories/
    directives/
    filters/
    models/
    config/
    routes/
  templates/
  assets/
    css/
    js/
    images/
    fonts/
  mock/
index.html
README.md
```

All application code lives under `src/`. The root-level `index.html` bootstraps the AngularJS application and references all scripts and styles using `src/...` paths.

## Configuration

Environment configuration is externalized under `src/app/config/`:

- `config.constants.js` – `ENV_CONFIG` default values
- `env.default.json`, `env.dev.json`, `env.prod.json` – environment-specific overrides
- `env.config.loader.js` – asynchronous loader that merges JSON config into `ENV_CONFIG`

Key configuration values:

- `apiBaseUrl`
- `apiTimeoutMs`
- `useMockData` (controls mock vs production mode)
- `featureFlags`
- `telemetry`

By default, `useMockData` is `true` so the app uses mock services and data.

## Mock Implementation

Mock data and services live under `src/mock/`:

- `src/mock/dashboard/monthlySummary.mock.data.js`
- `src/mock/dashboard/monthlySummary.mock.service.js`

Mock services simulate the `DashboardAPI` contract and support multiple datasets based on the selected month, without calling any backend.

## Running the Application

1. Serve the repository root via a static HTTP server (e.g., `http-server`, `npm serve`, or any web server).
2. Open `index.html` in a supported browser (Chrome or Edge).
3. The app will load the default environment configuration and navigate to `/monthly-summary`.

## Routes

- `/monthly-summary` – Monthly Spending Summary Dashboard (default and fallback route)

## Key Angular Components

- `MonthlySummaryController` – coordinates dashboard state and interactions
- `DashboardApiService` – wraps REST calls and mock switching
- `MonthlySummaryMockService` – mock implementation for monthly summary
- `kpiCard` directive – reusable KPI card UI
- `breakdownChart` directive – Chart.js-based category breakdown visualization
- `breakdownTable` directive – tabular breakdown view
- `monthSelector` directive – month selection component

## UI Design

The UI adheres to the Enterprise UI Specification:

- Application header, page title, breadcrumb
- Filter panel with month selector
- KPI cards for key metrics
- Charts for visual breakdown
- Responsive tables for category breakdown
- Insights and footer sections
- Responsive layout and accessible color/typography

## Notes

- The application is strictly limited to credit card aggregated summary data; non-credit-card products and transaction-level management features are out of scope.
- All controllers delegate business logic to services; controllers do not contain business logic.
