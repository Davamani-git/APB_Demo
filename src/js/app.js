/**
 * app.js
 * Main AngularJS module for the Credit Card Dashboard application.
 * Defines the main app module, its dependencies, and configuration blocks.
 */

// Define the main application module
var app = angular.module('creditCardDashboardApp', ['chart.js']);

// --- Configuration Block ---
// Configure global settings for Chart.js
app.config(['ChartJsProvider', function (ChartJsProvider) {
    ChartJsProvider.setOptions({
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
            position: 'bottom',
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        }
    });
}]);

// --- Custom Currency Filter ---
// Formats a number as Euro currency.
app.filter('customCurrency', ['$filter', function ($filter) {
    return function (amount) {
        if (angular.isUndefined(amount) || amount === null) {
            return '€0.00';
        }
        // Use AngularJS's built-in number filter for formatting, then prepend the currency symbol.
        var number = $filter('number')(amount, 2);
        return '€' + number;
    };
}]);

/**
 * Setup Instructions:
 * 1.  Ensure you have a modern web browser (e.g., Chrome, Firefox, Edge).
 * 2.  Place the entire project folder structure on a web server or open `index.html` directly in your browser.
 *     - For best results and to avoid potential CORS issues with local files in some browsers, using a simple local web server is recommended.
 *       You can use Python's built-in server: `python -m http.server` (for Python 3) from the project root.
 * 3.  The application will initialize, load the mock data from `dataService.js`, and display the dashboard.
 * 4.  No further setup, backend, or database is required.
 *
 * Architecture and Design Decisions:
 * -   **AngularJS 1.8.x:** Chosen as per requirements. It provides a robust framework for building Single Page Applications (SPAs).
 * -   **MVC Architecture:** The application is structured following the Model-View-Controller pattern.
 *     -   **Model:** The data, managed by `dataService.js`. This service acts as the single source of truth for all application data (credit cards, transactions).
 *     -   **View:** The `index.html` file, which contains the declarative HTML structure with AngularJS directives (`ng-repeat`, `ng-click`, etc.) to bind to the controller's scope.
 *     -   **Controller:** The `dashboardController.js` file, which acts as the glue between the Model and the View. It fetches data, performs calculations, and exposes data and functions to the `$scope` for the View to use.
 * -   **Modularity & Dependency Injection:**
 *     -   The application is broken down into modules (`app.js`), services (`dataService.js`), and controllers (`dashboardController.js`).
 *     -   AngularJS's Dependency Injection (DI) is used to provide the controller with the services it needs (e.g., `dataService`, `$scope`). This makes the code more testable and maintainable.
 * -   **Mock Data in Service:** All mock data is encapsulated within the `dataService`. This decouples the controller from the data source. If a real backend were to be integrated later, only the `dataService` would need to be modified to make HTTP requests, leaving the controller and view untouched.
 * -   **Chart.js Integration:** `angular-chart.js` is used as a wrapper for Chart.js, allowing for easy integration into the AngularJS ecosystem using directives (`<canvas class="chart-line">`). This is a clean, declarative way to create charts.
 * -   **Bootstrap 5 for Responsiveness:** The UI is built on Bootstrap 5's grid system, cards, and components, ensuring a responsive and mobile-friendly design out-of-the-box.
 * -   **Extra Features:**
 *     -   **Dark Mode:** Implemented with a simple boolean flag in the controller that toggles a class on the `<body>` tag. CSS variables and overrides handle the theme switching.
 *     -   **CSV Export:** Implemented in the controller, this feature dynamically generates a CSV string from the transaction data and uses a hidden `<a>` tag to trigger a browser download.
 *     -   **Modal Popup:** Utilizes Bootstrap's native JavaScript modal component, triggered from an `ng-click` directive. A `selectedTransaction` object on the scope holds the data for the currently displayed modal.
 *
 * Screenshots Mockup Description:
 * 1.  **Main Dashboard View:** A full-screen view with a dark blue top navigation bar. Below the navbar, a series of four summary cards show "Total Monthly Spend," "Total Outstanding," "Credit Utilization" (with a progress bar), and "Total Available Credit." Below this, a section titled "My Cards" displays three stylized credit card visuals. Further down, the "Spending Analytics" section contains a doughnut chart for "Category-wise Spending" and a line chart for "Monthly Spending Trend." Finally, a large table at the bottom lists all transactions with filter controls above it.
 * 2.  **Dark Mode:** The same layout as the main view, but with a dark theme. The background is dark gray, text is light, and cards have a darker shade. The charts and colors are adjusted to be visible on the dark background.
 * 3.  **Transaction Detail Modal:** A modal dialog box appears overlaid on the main dashboard. It has a header "Transaction Details" and lists key-value pairs for a single selected transaction, such as Date, Merchant, Amount, Category, and Card Used.
 * 4.  **Mobile View:** A single-column layout. The summary cards stack vertically. The credit card visuals and charts also stack one below the other. The transaction table is horizontally scrollable to accommodate all columns. The navigation bar is compact.
 */
