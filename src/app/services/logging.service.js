(function () {
    'use strict';

    LoggingService.$inject = ['$log'];

    function LoggingService($log) {
        var service = {
            info: info,
            warn: warn,
            error: error
        };

        function info(message, context) {
            $log.info('[INFO] ' + message, safeContext(context));
        }

        function warn(message, context) {
            $log.warn('[WARN] ' + message, safeContext(context));
        }

        function error(message, context) {
            $log.error('[ERROR] ' + message, safeContext(context));
        }

        function safeContext(context) {
            if (!context) {
                return {};
            }
            var sanitized = angular.copy(context);
            if (sanitized.cardNumber) {
                delete sanitized.cardNumber;
            }
            if (sanitized.customerName) {
                delete sanitized.customerName;
            }
            return sanitized;
        }

        return service;
    }

    angular.module('app')
        .service('LoggingService', LoggingService);
})();
