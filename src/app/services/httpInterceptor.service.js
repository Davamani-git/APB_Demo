(function () {
    "use strict";

    HttpInterceptorService.$inject = ["$q", "LoggingService"];

    function HttpInterceptorService($q, LoggingService) {
        return {
            request: onRequest,
            response: onResponse,
            responseError: onResponseError
        };

        function onRequest(config) {
            // Authorization header would typically be set here using existing session token
            // config.headers["Authorization"] = "Bearer " + token;
            return config;
        }

        function onResponse(response) {
            return response;
        }

        function onResponseError(rejection) {
            LoggingService.error("HTTP error", {
                status: rejection.status,
                url: rejection.config and rejection.config.url,
                code: rejection.data and rejection.data.code
            });
            return $q.reject(rejection);
        }
    }

    angular
        .module("app")
        .factory("HttpInterceptorService", HttpInterceptorService);
})();
