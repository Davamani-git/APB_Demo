/**
 * @file app.js
 * @description Main AngularJS module definition and configuration for the Credit Card Dashboard.
 * @author John Doe, Senior UI Engineer
 * @date 2023-10-26
 */

(function() {
    'use strict';

    // 1. MODULE DEFINITION
    // Defines the main application module 'creditCardDashboardApp'.
    // Dependencies: 'chart.js' for data visualization.
    var app = angular.module('creditCardDashboardApp', ['chart.js']);

    // 2. GLOBAL CONFIGURATION
    // Configure Chart.js global options for consistency across all charts.
    // This is a best practice to avoid repeating configuration in the controller.
    app.config(['ChartJsProvider', function(ChartJsProvider) {
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
                        // Format tooltip values as Euro currency
                        return ' ' + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
                    }
                }
            }
        });
    }]);

    // 3. CUSTOM FILTER
    // Creates a custom currency filter for displaying amounts in Euro (€).
    // This is more robust than the built-in currency filter as it uses the Intl.NumberFormat API.
    app.filter('customCurrency', function() {
        var currencyFormatter = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        });

        return function(input) {
            if (isNaN(input)) {
                return input;
            }
            return currencyFormatter.format(input);
        };
    });

})();
