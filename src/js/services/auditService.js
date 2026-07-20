/**
 * Audit Service
 * Role: Provides a centralized point for logging security-sensitive actions.
 * Responsibility: To create an audit trail for compliance (e.g., PCI-DSS).
 * Design Choice: Creating a dedicated service for auditing is a key architectural decision for financial applications.
 * It decouples auditing logic from business logic. In a real-world scenario, this service would not log to the console.
 * Instead, it would securely transmit encrypted log data to a write-only, tamper-proof remote logging server.
 */

(function() {
    'use strict';

    angular
        .module('creditCardDashboardApp.services')
        .factory('auditService', auditService);

    function auditService() {

        var service = {
            log: log
        };

        return service;

        /**
         * Logs a significant user or system action.
         * @param {string} action - A description of the action being logged (e.g., 'User Login', 'Data Export').
         * @param {Object} [details] - Optional object containing relevant details about the event.
         */
        function log(action, details) {
            var logEntry = {
                timestamp: new Date().toISOString(),
                action: action,
                details: details || 'No details provided.'
            };

            // In a production environment, this would send the logEntry to a secure backend endpoint.
            // For this demo, we log to the console with a clear prefix for visibility.
            console.log('[AUDIT TRAIL]', logEntry);
        }
    }
})();