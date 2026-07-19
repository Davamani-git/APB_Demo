(function () {
    'use strict';

    HttpInterceptorService.$inject = ['$q', 'LoggingService'];

    function HttpInterceptorService($q, LoggingService) {
        return {
            request: function (config) {
                // Attach Authorization header from existing banking session if available.
                // In this generated code, we assume it is provided by server-side templating or another script.
                config.headers = config.headers || {};
                // Example placeholder, do not log token.
                // config.headers['Authorization'] = 'Bearer ' + window.sessionToken;
                return config;
            },
            response: function (response) {
                return response;
            },
            responseError: function (rejection) {
                LoggingService.error('HTTP response error', {
                    status: rejection.status,
                    url: rejection.config && rejection.config.url
                });
                return $q.reject(rejection);
            }
        };
    }

    angular.module('app')
        .factory('HttpInterceptorService', HttpInterceptorService);
})();
