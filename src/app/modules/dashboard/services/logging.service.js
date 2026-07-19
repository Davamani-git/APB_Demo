(function () {
    'use strict';

    LoggingService.$inject = ['$log'];

    function LoggingService($log) {
        var service = {
            info: info,
            warn: warn,
            error: error
        };

        return service;

        function info(message, context) {
            $log.info(formatMessage(message, context));
        }

        function warn(message, context) {
            $log.warn(formatMessage(message, context));
        }

        function error(message, context) {
            $log.error(formatMessage(message, context));
        }

        function formatMessage(message, context) {
            var safeContext = {};
            if (context && typeof context === 'object') {
                Object.keys(context).forEach(function (key) {
                    if (key === 'token' || key === 'cardNumber' || key === 'pan') {
                        return;
                    }
                    safeContext[key] = context[key];
                });
            }
            return message + ' | context: ' + JSON.stringify(safeContext);
        }
    }

    angular.module('app')
        .service('LoggingService', LoggingService);

})();
