# APB Demo - Monthly Spending Summary Dashboard

This repository contains the AngularJS 1.7.9 Single Page Application for the Monthly Spending Summary Dashboard (QE-3271) aligned with the APBDemo1 epics.

## Overview

The application provides credit card customers with a high-level monthly spending summary, KPIs, and category breakdown visuals. It supports:

- Month selection within allowed billing cycles.
- KPI visualization (total spend, transaction count, average transaction value).
- Category breakdown charts as an entry point to deeper insights.
- Mock and production modes switched via environment configuration.

## Tech Stack

- AngularJS 1.7.9 (ngRoute, ngAnimate, ngSanitize)
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only)
- Chart.js 2.9.4

## Structure

All application code is under `src/` per standards:

- `src/app` - AngularJS modules, controllers, services, directives, filters, models, config, routes
- `src/templates` - HTML templates
- `src/assets` - CSS, JS, images, fonts
- `src/mock` - JavaScript mock data files

## Running

Serve the repository root with a static server and open `index.html` in a browser. Ensure internet connectivity for CDN-loaded libraries.
