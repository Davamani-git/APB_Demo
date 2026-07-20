(function () {
    'use strict';

    angular.module('apbDemo')
        .service('LoggingService', LoggingService);

    LoggingService.$inject = ['EnvConfigService'];

    function LoggingService(EnvConfigService) {
        var service = this;

        service.info = info;
        service.warn = warn;
        service.error = error;

        function info(message, context) {
            console.info('[INFO] ' + message, context || {});
            sendToTelemetry('info', message, context);
        }

        function warn(message, context) {
            console.warn('[WARN] ' + message, context || {});
            sendToTelemetry('warn', message, context);
        }

        function error(message, context) {
            console.error('[ERROR] ' + message, context || {});
            sendToTelemetry('error', message, context);
        }

        function sendToTelemetry(level, message, context) {
            var telemetryConfig = EnvConfigService.getTelemetryConfig();
            if (!telemetryConfig || !telemetryConfig.enabled) {
                return;
            }
            // Placeholder for production telemetry forwarding; no business logic here.
        }
    }
})();
