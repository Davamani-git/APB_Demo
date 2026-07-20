/**
 * Main AngularJS Application Module
 * 
 * This file defines the main application module, 'creditCardDashboardApp'.
 * It also configures the dependencies for the application, such as 'chart.js' for data visualizations.
 * The module acts as a container for the different parts of the application (controllers, services, etc.).
 */

(function() {
    'use strict';

    // Define the main application module
    var app = angular.module('creditCardDashboardApp', [
        'chart.js' // Dependency for creating charts
    ]);

    // Configuration for Chart.js to disable animations and set responsive behavior for dark mode
    app.config(['ChartJsProvider', function (ChartJsProvider) {
        ChartJsProvider.setOptions({
            animation: {
                duration: 0 // Disable animations for faster rendering
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                labels: {
                    // This function will be called to generate the legend text color
                    fontColor: '#666' 
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: '#666'
                    },
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: '#666'
                    },
                    gridLines: {
                        display: false
                    }
                }]
            }
        });
    }]);

})();