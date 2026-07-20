(function () {
    'use strict';

    angular.module('apbDemo')
        .factory('HttpInterceptorService', HttpInterceptorService);

    HttpInterceptorService.$inject = ['$q', 'EnvConfigService', 'LoggingService'];

    function HttpInterceptorService($q, EnvConfigService, LoggingService) {
        return {
            request: function (config) {
                var token = null;
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                var timeoutMs = EnvConfigService.getApiTimeoutMs();
                config.timeout = timeoutMs;
                LoggingService.info('HTTP request initiated.', { url: config.url, method: config.method });
                return config;
            },
            response: function (response) {
                LoggingService.info('HTTP response received.', { url: response.config.url, status: response.status });
                return response;
            },
            responseError: function (rejection) {
                LoggingService.error('HTTP response error.', { url: rejection.config ? rejection.config.url : '', status: rejection.status });
                return $q.reject(rejection);
            }
        };
    }
})();
