(function () {
    "use strict";

    ApiClientFactory.$inject = ["$http", "ENV_CONFIG"];

    function ApiClientFactory($http, ENV_CONFIG) {
        function get(url, config) {
            var requestConfig = config || {};
            requestConfig.timeout = ENV_CONFIG.apiTimeoutMs;
            return $http.get(url, requestConfig);
        }

        function post(url, data, config) {
            var requestConfig = config || {};
            requestConfig.timeout = ENV_CONFIG.apiTimeoutMs;
            return $http.post(url, data, requestConfig);
        }

        return {
            get: get,
            post: post
        };
    }

    angular.module("app")
        .factory("ApiClient", ApiClientFactory);
}());
