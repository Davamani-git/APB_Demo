/**
 * Main Application Module for the Credit Card Expenditure Dashboard.
 * As a Senior UI Engineer, I'm defining the core module and its dependencies.
 * This structure promotes modularity and separation of concerns, crucial for maintaining
 * large-scale financial applications.
 *
 * @module creditCardDashboardApp
 * @dependencies ng, chart.js
 */

(function() {
    'use strict';

    // Define the main application module
    var app = angular.module('creditCardDashboardApp', ['chart.js']);

    // --- Configuration Block ---
    app.config(['ChartJsProvider', function(ChartJsProvider) {
        // Configure all charts
        ChartJsProvider.setOptions({
            responsive: true,
            maintainAspectRatio: false,
            // In a real-world scenario, we'd define global color schemes,
            // tooltips, and other elements here to ensure brand consistency.
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var value = dataset.data[tooltipItem.index];
                        return ' ' + value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
                    }
                }
            }
        });
    }]);

})();
