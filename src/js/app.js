/**
 * Main AngularJS Application Module
 * 
 * ARCHITECTURE & DESIGN DECISIONS:
 * 
 * 1.  **Modular Architecture:** The application is structured into modules, services, and controllers to promote separation of concerns, a core principle of AngularJS.
 *     -   `app.js`: The main module definition and configuration block. It acts as the entry point for the Angular app.
 *     -   `dataService.js`: A dedicated service for data handling. This encapsulates the logic for fetching and managing the mock data. By using a service, we make our controllers leaner and independent of the data source. If we were to switch to a real API, only the service would need changes, not the controllers.
 *     -   `dashboardController.js`: The controller holds the presentation logic. It consumes the `dataService`, performs calculations for the view, and handles user interactions. It avoids direct data manipulation, delegating that to the service.
 * 
 * 2.  **MVVM (Model-View-ViewModel) Pattern:** AngularJS implements the MVVM pattern. 
 *     -   **Model:** The data, which is provided by `dataService.js` and exposed to the view via the controller's `$scope`.
 *     -   **View:** The `index.html` file, which is a declarative template binding to the ViewModel.
 *     -   **ViewModel:** The `$scope` object within `dashboardController.js`. It acts as the glue, preparing the model data for the view and processing user events.
 * 
 * 3.  **Dependency Injection (DI):** AngularJS's built-in DI is used to provide dependencies (like `$scope`, `$filter`, and our custom `dataService`) to the controller. This makes the components loosely coupled and easier to test in isolation.
 * 
 * 4.  **Data Binding:** Two-way data binding (`ng-model`) is used for filter inputs, allowing the view to update the model automatically. One-way data binding (`{{ }}` or `ng-bind`) is used for displaying data, ensuring the view updates whenever the model changes.
 * 
 * 5.  **Custom Filter:** A custom filter (`inrCurrency`) is created for currency formatting. This is a reusable component that can be applied declaratively in the HTML, promoting clean and readable templates.
 * 
 * 6.  **External Libraries:** The choice of libraries (Bootstrap, Chart.js, Font Awesome) is based on creating a modern, responsive, and visually appealing UI without extensive custom CSS. `angular-chart.js` is used as a wrapper to integrate Chart.js seamlessly into the AngularJS digest cycle.
 * 
 * 7.  **Single Page Application (SPA):** The entire application runs from a single `index.html` file, with dynamic content managed by AngularJS. This provides a fluid user experience without full page reloads.
 */

// Define the main application module
const app = angular.module('creditCardDashboardApp', ['chart.js']);

// Configure Chart.js global options
app.config(['ChartJsProvider', function (ChartJsProvider) {
    ChartJsProvider.setOptions({
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
            position: 'bottom',
        },
    });
}]);

// Custom filter to format numbers as INR currency (₹)
app.filter('inrCurrency', ['$filter', function ($filter) {
    return function (input) {
        if (isNaN(input)) {
            return input;
        }
        // Format the number with commas and prepend the Rupee symbol
        var formatted = $filter('number')(input, 2);
        return '₹ ' + formatted;
    };
}]);
