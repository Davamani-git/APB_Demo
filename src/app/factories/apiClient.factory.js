(function () {
    "use strict";

    ApiClientFactory.$inject = ["$http", "ENV_CONFIG"];

    function ApiClientFactory($http, ENV_CONFIG) {
        return {
            get: function (url, config) {
                var requestConfig = config || {};
                requestConfig.timeout = ENV_CONFIG.apiTimeoutMs;
                return $http.get(url, requestConfig);
            },
            post: function (url, data, config) {
                var requestConfig = config || {};
                requestConfig.timeout = ENV_CONFIG.apiTimeoutMs;
                return $http.post(url, data, requestConfig);
            }
        };
    }

    angular.module("app")
        .factory("ApiClient", ApiClientFactory);
})();
