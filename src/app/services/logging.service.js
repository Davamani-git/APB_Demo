angular.module('apbDemo.services')
.factory('LoggingService', ['$log', function($log) {
    // QE-4141: Secure communication would be enforced by using HTTPS in EnvConfig.telemetryUrl
    function info(message, context) {
        $log.info(message, context);
    }

    function error(message, context) {
        // QE-4141: Ensure no PII is logged
        $log.error(message, context);
    }

    return {
        info: info,
        error: error
    };
}]);