/**
 * Main AngularJS Application Module
 * Defines the application, its dependencies, and global configurations.
 */
(function() {
    'use strict';

    // Define the main application module, 'creditCardDashboardApp'
    // Dependencies: 'chart.js' for data visualization.
    var app = angular.module('creditCardDashboardApp', ['chart.js']);

    // --- Global Configuration for Chart.js --- //
    // This block configures default options for all charts in the application.
    // It ensures a consistent look and feel and is compatible with Chart.js v2.9.4.
    app.config(['ChartJsProvider', function(ChartJsProvider) {
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

    // --- Custom Currency Filter --- //
    // Creates a custom filter 'inrCurrency' to format numbers as Indian Rupees (₹).
    // This is a reusable component that can be applied in the view like: {{ myValue | inrCurrency }}
    app.filter('inrCurrency', ['$filter', function($filter) {
        return function(input) {
            if (isNaN(input)) {
                return input;
            }
            // Uses the built-in 'currency' filter with the INR symbol.
            return $filter('currency')(input, '₹', 2);
        };
    }]);

})();