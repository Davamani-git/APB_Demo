# Monthly Spending Summary Dashboard

This repository contains the AngularJS single-page application for the Monthly Spending Summary Dashboard, generated based on the approved Low Level Design (LLD) for Epic QE-3319.

## Overview

The application provides a comprehensive, read-only view of a user's credit card spending, including:
- A summary dashboard with key performance indicators (KPIs).
- A detailed, filterable, and sortable transaction history.
- Spending analytics with various chart visualizations.
- Budget tracking against monthly goals.

## Technology Stack

- **AngularJS**: 1.7.9
- **Angular Route**: 1.7.9
- **UI Bootstrap**: 2.5.6
- **Bootstrap CSS**: 3.4.1
- **Chart.js**: 2.9.4
- **Font Awesome**: 4.7.0

## Running the Application

1.  Serve the repository root directory using a simple HTTP server (e.g., `python -m http.server`).
2.  Open a web browser and navigate to the server address (e.g., `http://localhost:8000`).

The application is configured to run in mock mode by default (`useMockData: true`). To switch to production mode, change this flag in `src/app/config/env.default.json` and ensure the backend APIs are available at the configured `apiBaseUrl`.