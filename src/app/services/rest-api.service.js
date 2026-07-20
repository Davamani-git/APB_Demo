(function () {
    'use strict';

    angular
        .module('app')
        .service('RestApiService', RestApiService);

    RestApiService.$inject = ['$http', '$q', 'EnvConfigService', 'LoggingService'];

    function RestApiService($http, $q, EnvConfigService, LoggingService) {
        function createRequest(method, url, data, config) {
            var baseUrl = EnvConfigService.get('apiBaseUrl');
            var timeout = EnvConfigService.get('apiTimeoutMs');

            var requestConfig = angular.extend({}, config, {
                method: method,
                url: baseUrl + url,
                timeout: timeout
            });

            if (data) {
                requestConfig.data = data;
            }

            LoggingService.info('API Request:', requestConfig);

            return $http(requestConfig).then(function(response) {
                return response.data;
            });
        }

        this.get = function (url, config) {
            return createRequest('GET', url, null, config);
        };

        this.post = function (url, data, config) {
            return createRequest('POST', url, data, config);
        };
    }
})();