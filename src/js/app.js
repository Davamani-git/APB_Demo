/*
Senior UI Engineer With PCI-DSS Compliance Expertise
Project: Credit Card Expenditure Dashboard
File: js/app.js
Description: Main AngularJS application module definition and configuration.
*/

(function() {
    'use strict';

    // Define the main application module
    var app = angular.module('creditCardDashboardApp', ['chart.js']);

    // Configuration block for Chart.js provider
    // This ensures charts are responsive and adapt to container size.
    // Compatible with Chart.js 2.9.4 and angular-chart.js 1.1.1
    app.config(function(ChartJsProvider) {
        ChartJsProvider.setOptions({
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
            }
        });
    });

})();
