(function () {
    'use strict';

    ApiClientFactory.$inject = ['$http', 'ENV_CONFIG'];

    function ApiClientFactory($http, ENV_CONFIG) {
        var service = {
            get: get,
            post: post
        };

        function get(url, config) {
            var finalConfig = angular.extend({}, config || {}, {
                timeout: ENV_CONFIG.apiTimeoutMs
            });
            return $http.get(url, finalConfig);
        }

        function post(url, data, config) {
            var finalConfig = angular.extend({}, config || {}, {
                timeout: ENV_CONFIG.apiTimeoutMs
            });
            return $http.post(url, data, finalConfig);
        }

        return service;
    }

    angular.module('app')
        .factory('ApiClient', ApiClientFactory);
})();
