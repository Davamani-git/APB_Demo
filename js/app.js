/**
 * Main AngularJS Application Module
 * Defines the application and its dependencies.
 */

// 1. Create the main application module 'creditCardDashboardApp'.
// 2. Inject 'chart.js' for data visualization capabilities.
const app = angular.module('creditCardDashboardApp', ['chart.js']);

/**
 * Custom Currency Filter: inrCurrency
 * Formats a number as Indian Rupees (₹).
 * 
 * @param {number} amount - The numerical value to format.
 * @returns {string} - The formatted currency string (e.g., "₹1,23,456.78").
 */
app.filter('inrCurrency', ['$filter', function ($filter) {
    return function (amount) {
        if (angular.isUndefined(amount) || amount === null) {
            return '₹0.00';
        }
        // Using a simple regex for Indian comma separation for demonstration.
        // A more robust library like Intl.NumberFormat is recommended for production.
        let formattedAmount = $filter('number')(amount, 2);
        let x = formattedAmount.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        let rgx = /(\d+)(\d{3})/; 
        let z = x1.split(',');
        x1 = z[0];
        let y = z.length > 1 ? ',' + z.slice(1).join('') : '';
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return '₹' + x1 + y + x2;
    };
}]);

/**
 * Chart.js Global Configuration
 * Sets default options for all charts in the application for a consistent look and feel.
 */
app.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            }
        }
    });
}]);
