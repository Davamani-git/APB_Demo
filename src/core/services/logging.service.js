(function () {
    'use strict';

    LoggingService.$inject = ['$injector'];

    function LoggingService($injector) {
        var httpInstance;

        var service = {
            info: info,
            warn: warn,
            error: error
        };

        return service;

        function getHttp() {
            if (!httpInstance) {
                httpInstance = $injector.get('$http');
            }
            return httpInstance;
        }

        function info(message, context) {
            console.log('[INFO]', message, context || {});
        }

        function warn(message, context) {
            console.warn('[WARN]', message, context || {});
        }

        function error(message, context) {
            console.error('[ERROR]', message, context || {});
            var http = getHttp();
            var telemetryPayload = {
                level: 'error',
                message: message,
                context: context || {}
            };
            http.post('https://dev.telemetry.davms1.example.com/logs', telemetryPayload);
        }
    }

    angular
        .module('app')
        .service('LoggingService', LoggingService);
})();
