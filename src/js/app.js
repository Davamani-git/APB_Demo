/**
 * Main AngularJS Application Module
 * Defines the application, its dependencies, and global configurations.
 */
(function() {
    'use strict';

    // 1. Define the main application module
    var app = angular.module('creditCardDashboardApp', [
        'chart.js' // Dependency for chart visualizations
    ]);

    // 2. Configure Chart.js global options for better visuals and responsiveness
    app.config(['ChartJsProvider', function(ChartJsProvider) {
        ChartJsProvider.setOptions({
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: '#6c757d' // Default font color
                }
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function(previousValue, currentValue) {
                            return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return ' ' + data.labels[tooltipItem.index] + ': ₹' + currentValue.toLocaleString('en-IN') + ' (' + percentage + '%)';
                    }
                }
            }
        });
    }]);

    // 3. Create a custom filter for Indian Rupee (INR) currency format
    app.filter('INR', ['$filter', function($filter) {
        return function(input) {
            if (isNaN(input)) {
                return input;
            }
            // Format number with 2 decimal places and prepend Rupee symbol
            var formatted = $filter('number')(input, 2);
            return '₹' + formatted.toLocaleString('en-IN');
        };
    }]);

})();