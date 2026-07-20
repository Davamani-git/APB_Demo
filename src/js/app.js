/**
 * Main AngularJS Application Module
 * @module creditCardDashboardApp
 * 
 * This is the primary module for the application.
 * It declares dependencies on other modules like 'chart.js'.
 * It also defines application-wide configurations and custom filters.
 */
(function() {
    'use strict';

    // 1. Define the main application module
    var app = angular.module('creditCardDashboardApp', ['chart.js']);

    // 2. Configure Chart.js global options
    // This ensures all charts have a consistent look and feel.
    app.config(['ChartJsProvider', function (ChartJsProvider) {
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
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var value = dataset.data[tooltipItem.index];
                        // Format tooltip values as Indian Rupees (INR)
                        return ' ' + new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
                    }
                }
            }
        });
    }]);

    // 3. Create a custom filter for INR currency formatting
    // This allows for easy currency formatting throughout the application's views.
    // Usage: {{ someValue | INR }}
    app.filter('INR', ['$filter', function ($filter) {
        return function (input) {
            if (isNaN(input)) {
                return input;
            }
            // Using Intl.NumberFormat for robust, locale-aware currency formatting.
            return new Intl.NumberFormat('en-IN', { 
                style: 'currency', 
                currency: 'INR', 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
            }).format(input);
        };
    }]);

})();