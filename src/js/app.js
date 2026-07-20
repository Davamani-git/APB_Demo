/**
 * app.js
 * 
 * Main application module for the Credit Card Expenditure Dashboard.
 * This file defines the main AngularJS module and its dependencies.
 * 
 * As a Senior UI Engineer with a background in financial institutions, I've chosen
 * a modular structure. This 'app.js' acts as the central hub, declaring the 'creditCardDashboardApp'
 * module and its dependencies ('chart.js'). This approach promotes maintainability and scalability.
 * 
 * PCI-DSS Compliance Note: In a production environment, this application would not handle raw
 * cardholder data. All sensitive data would be managed by a secure, PCI-compliant backend.
 * The frontend would interact with tokenized data, ensuring no sensitive information is ever
 * exposed or stored in the browser.
 */

(function() {
    'use strict';

    // Define the main application module
    var app = angular.module('creditCardDashboardApp', [
        'chart.js' // Dependency for data visualization
    ]);

    // Configuration block for Chart.js
    // Here we can set global options for all charts in the application.
    app.config(['ChartJsProvider', function (ChartJsProvider) {
        // Configure all charts
        ChartJsProvider.setOptions({
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
            },
            // In a real-world scenario, we would enforce strict Content Security Policies (CSP)
            // and ensure that any third-party library scripts are loaded from trusted sources
            // with integrity checks, a key aspect of mitigating XSS risks under PCI-DSS.
        });

        // Configure specific chart types
        ChartJsProvider.setOptions('doughnut', {
            cutoutPercentage: 50
        });
        ChartJsProvider.setOptions('line', {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        // Using a callback to format ticks as currency
                        callback: function(value, index, values) {
                            return '€' + value.toLocaleString('de-DE');
                        }
                    }
                }]
            }
        });
    }]);

})();
