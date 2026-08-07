/*
File: app.js
Description: Main AngularJS module definition for the application.
Author: Senior UI Engineer
Date: 2024-07-25
*/

// Define the main AngularJS module for the application.
// 'chart.js' is injected as a dependency to enable charting capabilities.
var app = angular.module('creditCardDashboardApp', ['chart.js']);

// Configuration block for Chart.js global settings
app.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
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
