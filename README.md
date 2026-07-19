# APB_Demo - Spending Summary Dashboard (QE-3250)

This repository contains the AngularJS 1.7.9 Single Page Application implementation of the Spending Summary Dashboard for credit card customers.

## Overview

The dashboard provides:

- Monthly spending summary with key metrics.
- Six-month spending trend visualization.
- Summary KPI cards and Chart.js-based charts.
- Month selection for contextual views.

Mock mode is enabled by default and can be toggled via environment configuration (`useMockData`).

## Technology Stack

- AngularJS 1.7.9
- Angular Route, Animate, Sanitize
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS)
- Chart.js 2.9.4
- Font Awesome 4.7.0

## Structure

- `index.html` - Root page and script/style includes
- `src/app` - AngularJS app modules, controllers, services, directives, filters, models
- `src/templates` - HTML templates
- `assets/css` - CSS styles
- `src/mock` - Mock service implementations
- `src/data/mock` - Mock JSON datasets

Run via any static HTTP server (e.g., `python -m http.server`) and open `index.html`.
