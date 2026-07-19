(function () {
    "use strict";

    HttpInterceptorService.$inject = ["$q", "LoggingService"];

    function HttpInterceptorService($q, LoggingService) {
        function request(config) {
            return config;
        }

        function response(response) {
            return response;
        }

        function responseError(rejection) {
            LoggingService.error("HTTP error", {
                status: rejection.status,
                url: rejection.config && rejection.config.url
            });
            return $q.reject(rejection);
        }

        return {
            request: request,
            response: response,
            responseError: responseError
        };
    }

    angular.module("app")
        .factory("HttpInterceptorService", HttpInterceptorService);
}());
