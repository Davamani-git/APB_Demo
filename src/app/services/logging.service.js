(function () {
    "use strict";

    angular.module("app")
        .service("LoggingService", LoggingService);

    LoggingService.$inject = ["$log"];

    function LoggingService($log) {
        this.info = function (message, context) {
            $log.info(format(message, context));
        };

        this.warn = function (message, context) {
            $log.warn(format(message, context));
        };

        this.error = function (message, context) {
            $log.error(format(message, context));
        };

        this.audit = function (event, data) {
            $log.info("AUDIT: " + event, data || {});
        };

        function format(message, context) {
            if (!context) {
                return message;
            }
            try {
                return message + " | " + JSON.stringify(context);
            } catch (e) {
                return message;
            }
        }
    }
})();
