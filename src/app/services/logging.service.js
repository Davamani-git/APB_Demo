(function () {
    "use strict";

    LoggingService.$inject = ["$log"];

    function LoggingService($log) {
        var service = {
            info: info,
            warn: warn,
            error: error
        };

        return service;

        function info(message, context) {
            $log.info(message, sanitizeContext(context));
        }

        function warn(message, context) {
            $log.warn(message, sanitizeContext(context));
        }

        function error(message, context) {
            $log.error(message, sanitizeContext(context));
        }

        function sanitizeContext(context) {
            if (!context) {
                return {};
            }
            var safe = angular.copy(context);
            // Ensure no PII or card details are logged
            delete safe.cardNumber;
            delete safe.customerName;
            delete safe.fullAddress;
            return safe;
        }
    }

    angular
        .module("app")
        .service("LoggingService", LoggingService);
})();
