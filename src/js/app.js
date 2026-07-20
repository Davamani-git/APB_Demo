/**
 * Main AngularJS Application File
 * Defines the primary module and its dependencies.
 * As a Senior Engineer, I structure the app into sub-modules for controllers and services
 * to improve organization and maintainability, which is crucial for larger applications.
 */

(function() {
    'use strict';

    // Define sub-modules first to avoid load order issues.
    angular.module('creditCardDashboardApp.services', []);
    angular.module('creditCardDashboardApp.controllers', []);

    // Define the main application module.
    var app = angular.module('creditCardDashboardApp', [
        'chart.js',
        'creditCardDashboardApp.controllers',
        'creditCardDashboardApp.services'
    ]);

    /**
     * Configuration block for Chart.js.
     * This is the correct place for global provider configurations.
     * Here, we set global options for all charts to be responsive and maintain aspect ratio.
     * This follows the best practice of configuring modules before they are used.
     */
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
                        return data.labels[tooltipItem.index] + ': €' + value.toFixed(2);
                    }
                }
            }
        });
    }]);

})();