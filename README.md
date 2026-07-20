# APB Demo - Monthly Spending Summary Dashboard

This repository contains the AngularJS 1.7.9 Single Page Application for the **Monthly Spending Summary Dashboard** as defined in LLD QE-3271 and the APBDemo1 user stories.

## Technology Stack

- AngularJS 1.7.9
- Angular Route / Animate / Sanitize
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only)
- Chart.js 2.9.4

## Project Structure

```
index.html
README.md
src/
  app/
    app.module.js
    routes/
      monthly-summary.routes.js
    config/
      config.constants.js
      env.config.service.js
      env.default.json
      env.dev.json
      env.prod.json
    controllers/
      monthly-summary.controller.js
    services/
      monthly-summary.service.js
      kpi.service.js
      breakdown.service.js
      month-context.service.js
      logging.service.js
      error-handling.service.js
      http-interceptor.service.js
    factories/
      model-factory.js
    directives/
      monthly-summary-card.directive.js
      kpi-card.directive.js
      breakdown-chart.directive.js
    filters/
      currency-format.filter.js
      date-format.filter.js
      percentage.filter.js
    models/
      monthly-summary.model.js
      kpi.model.js
      breakdown.model.js
      error.model.js
  templates/
    monthly-summary.view.html
    components/
      monthly-summary-card.html
      kpi-card.html
      breakdown-chart.html
  assets/
    css/
      app.css
    js/
      chart-config.js
    images/
      icons/
        kpi-total-spend.png
        kpi-transaction-count.png
        kpi-average-spend.png
    fonts/
  mock/
    monthly-summary.mock-data.js
    kpi.mock-data.js
    breakdown.mock-data.js
    month-context.mock-data.js
```

## Running the App

1. Serve the repository with any static web server (e.g. `http-server`, `nginx`, or IDE built-in server) using the repository root as web root.
2. Open `http://localhost:<port>/index.html` in a supported browser.

By default, the app runs in **mock mode** (`useMockData: true` in `env.default.json`). To switch to production API mode, set `useMockData` to `false` in the corresponding environment JSON.

## Features

- Month selection constrained by month context API
- Monthly total spend KPI
- Transaction count KPI
- Average transaction value KPI
- Category-level spend breakdown chart
- Loading, empty, and error states per UI standards
- Enterprise banking dashboard look and feel

## Notes

- All configuration files live under `src/app/config/`.
- All mock data is implemented as JavaScript under `src/mock/` and loaded at runtime.
- `$httpProvider` interceptor is implemented in `http-interceptor.service.js` with lazy `$http` usage via `$injector` to avoid bootstrap cycles.
