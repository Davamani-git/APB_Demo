# DAVMS - Monthly Spending Summary Dashboard

## Overview
This application implements the DAVMS (Data Analytics and Visualization for Monthly Spending) Monthly Spending Summary Dashboard as specified in Epic QE-3179.

## User Stories Implemented
- QE-3180: Monthly Total Credit Card Spend Calculation
- QE-3181: Monthly Summary KPIs Display
- QE-3182: Visual Representation of Monthly Spend
- QE-3183: Month Selection for Spending Summary
- QE-3184: Basic Breakdown of Monthly Spend

## Technology Stack
- AngularJS 1.8.2
- Bootstrap 3.4.1
- Chart.js 3.9.1
- jQuery 3.6.0

## Project Structure
```
src/
├── index.html                          # Main entry point
├── assets/
│   ├── css/
│   │   ├── app.css                     # Global styles
│   │   └── spend-dashboard.css         # Dashboard-specific styles
├── config/
│   ├── env.dev.json                    # Development configuration
│   ├── env.qa.json                     # QA configuration
│   └── env.prod.json                   # Production configuration
├── js/
│   ├── app/
│   │   ├── app.module.js               # Root application module
│   │   ├── app.config.js               # Global configuration
│   │   └── app.run.js                  # Application initialization
│   └── spend-dashboard/
│       ├── spend-dashboard.module.js   # Feature module
│       ├── spend-dashboard.routes.js   # Feature routes
│       ├── config/
│       │   └── spend-dashboard.config.js
│       ├── controllers/
│       │   └── monthly-dashboard.controller.js
│       ├── services/
│       │   ├── config.service.js
│       │   ├── logging.service.js
│       │   ├── error-handling.service.js
│       │   ├── monthly-summary-api.service.js
│       │   ├── month-selection.service.js
│       │   ├── kpi-computation.service.js
│       │   └── spend-breakdown-mapper.service.js
│       ├── factories/
│       │   └── http-interceptor.factory.js
│       ├── directives/
│       │   ├── month-selector.directive.js
│       │   ├── summary-kpi-cards.directive.js
│       │   └── basic-spend-breakdown-chart.directive.js
│       ├── filters/
│       │   ├── currency-format.filter.js
│       │   └── percentage-format.filter.js
│       ├── models/
│       │   ├── monthly-summary.model.js
│       │   └── spend-breakdown.model.js
│       └── views/
│           └── monthly-dashboard.view.html
└── telemetry/
    ├── logging.config.js
    └── metrics.config.js
```

## Running the Application

### Mock Mode (Default)
The application runs in mock mode by default with realistic test data.

1. Open `src/index.html` in a web browser using a local web server:
   ```bash
   # Using Python 3
   cd src
   python -m http.server 8000
   
   # Using Node.js http-server
   cd src
   npx http-server -p 8000
   
   # Using VS Code Live Server extension
   Right-click on index.html and select "Open with Live Server"
   ```

2. Navigate to `http://localhost:8000` in your browser

3. The dashboard will load with mock data showing:
   - Last 12 months available for selection
   - Sample spending data with realistic categories
   - Interactive charts and KPI cards

### Production Mode
To switch to production mode (real API calls):

1. Open `src/js/spend-dashboard/services/config.service.js`
2. Change `var useMockData = true;` to `var useMockData = false;`
3. Update the `apiBaseUrl` in the config object to point to your actual API endpoint
4. Ensure proper authentication tokens are configured in `http-interceptor.factory.js`

## Features

### Month Selection
- Dropdown selector showing last 12 months
- Defaults to previous month
- Updates all dashboard data when changed

### KPI Cards
- **Total Spend**: Aggregate monthly spending
- **Number of Transactions**: Total transaction count
- **Average Transaction**: Average spend per transaction

### Spending Breakdown
- Visual chart (doughnut) showing category distribution
- Tile view with amounts and percentages
- Categories include:
  - Food & Dining
  - Travel
  - Shopping
  - Entertainment
  - Utilities
  - Other

### Error Handling
- User-friendly error messages
- Graceful degradation for partial data
- Network error recovery

## API Integration

### Endpoints

#### Get Available Months
```
GET /api/davms/spend-summary/months?accountId={accountId}
```

#### Get Monthly Summary
```
GET /api/davms/spend-summary?accountId={accountId}&month={YYYY-MM}&mode={billing|calendar}
```

### Mock Data
Mock data is provided by `MonthlySummaryApiService` when `useMockData` is true. The service returns realistic spending patterns with:
- Total spend around $2,500
- 60-70 transactions per month
- Diverse category breakdown

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations
- All API calls use HTTPS in production
- Authentication tokens attached via HTTP interceptor
- No sensitive data stored in localStorage
- XSS prevention via ngSanitize
- Input validation on all user inputs

## Development Guidelines

### Module Declaration Rule
- Only one file per module uses the array form: `angular.module('name', [deps])`
- All other files use getter form: `angular.module('name')`
- This prevents module recreation and component loss

### Dependency Injection
- All services use explicit `$inject` annotation
- Maintains compatibility with minification
- Clear dependency documentation

### Code Style
- IIFE wrapping for all files
- Strict mode enabled
- ES5 compatible (runs on AngularJS 1.x)

## Testing

### Manual Testing Checklist
1. ✓ Dashboard loads without errors
2. ✓ Month selector displays 12 months
3. ✓ KPI cards show correct values
4. ✓ Chart renders with category data
5. ✓ Tiles display amounts and percentages
6. ✓ Month change updates all data
7. ✓ Error messages display correctly
8. ✓ Loading spinner shows during data fetch

## Troubleshooting

### Dashboard Not Loading
- Check browser console for errors
- Verify all script files are loading (Network tab)
- Ensure AngularJS is loaded before app scripts

### Chart Not Rendering
- Verify Chart.js is loaded
- Check that breakdown data is available
- Inspect canvas element in DOM

### API Errors
- Verify mock mode is enabled for local testing
- Check network tab for failed requests
- Review error messages in console

## License
Proprietary - Internal Use Only

## Support
For issues or questions, contact the DAVMS development team.