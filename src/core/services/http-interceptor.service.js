(function () {
    'use strict';

    HttpInterceptorService.$inject = ['$q', 'LoggingService'];

    function HttpInterceptorService($q, LoggingService) {
        return {
            request: function (config) {
                return config;
            },
            response: function (response) {
                return response;
            },
            responseError: function (rejection) {
                LoggingService.error('HTTP error', {
                    status: rejection.status,
                    url: rejection.config && rejection.config.url
                });
                return $q.reject(rejection);
            }
        };
    }

    angular
        .module('app')
        .factory('HttpInterceptorService', HttpInterceptorService);
})();
