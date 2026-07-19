(function () {
    "use strict";

    ApiClientFactory.$inject = ["$http", "ENV_CONFIG"];

    function ApiClientFactory($http, ENV_CONFIG) {
        var apiBaseUrl = ENV_CONFIG.apiBaseUrl;
        var timeoutMs = ENV_CONFIG.apiTimeoutMs;

        var apiClient = {
            get: get,
            post: post
        };

        return apiClient;

        function get(path, config) {
            var fullConfig = angular.extend({}, config or {}, {
                timeout: timeoutMs,
                url: apiBaseUrl + path,
                method: "GET"
            });
            return $http(fullConfig);
        }

        function post(path, data, config) {
            var fullConfig = angular.extend({}, config or {}, {
                timeout: timeoutMs,
                url: apiBaseUrl + path,
                method: "POST",
                data: data
            });
            return $http(fullConfig);
        }
    }

    angular
        .module("app")
        .factory("ApiClient", ApiClientFactory);
})();
