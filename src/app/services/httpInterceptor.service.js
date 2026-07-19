(function () {
    "use strict";

    HttpInterceptorService.$inject = ["$q", "LoggingService"];

    function HttpInterceptorService($q, LoggingService) {
        return {
            request: function (config) {
                return config;
            },
            response: function (response) {
                return response;
            },
            responseError: function (rejection) {
                LoggingService.error("HTTP error", {
                    status: rejection.status,
                    config: rejection.config && {
                        url: rejection.config.url,
                        method: rejection.config.method
                    }
                });
                return $q.reject(rejection);
            }
        };
    }

    angular.module("app")
        .factory("HttpInterceptorService", HttpInterceptorService);
})();
