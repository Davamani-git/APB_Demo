/**
 * Main AngularJS Application Module
 * Defines the core module 'creditCardDashboardApp' and its dependencies.
 */

// Define the main application module
const app = angular.module('creditCardDashboardApp', ['chart.js']);

/**
 * Custom Currency Filter
 * Formats a number as Euro currency (e.g., 1234.56 -> €1,234.56).
 */
app.filter('euroCurrency', ['$filter', function ($filter) {
    return function (amount) {
        if (typeof amount !== 'number') {
            return amount;
        }
        const currency = $filter('currency')(amount, '€', 2);
        return currency;
    };
}]);

/**
 * Chart.js Global Configuration
 * Sets default options for all charts in the application for a consistent look and feel.
 * Ensures compatibility with Chart.js v2.9.4.
 */
app.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
            position: 'bottom',
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    let label = data.labels[tooltipItem.index] || '';
                    if (label) {
                        label += ': ';
                    }
                    // Format the value as currency
                    label += new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(tooltipItem.yLabel || tooltipItem.xLabel);
                    return label;
                }
            }
        }
    });
}]);
