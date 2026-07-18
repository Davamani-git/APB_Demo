(function () {
    'use strict';

    MonthlySummaryApiService.$inject = ['$http', '$q', 'EnvConfigService'];

    function MonthlySummaryApiService($http, $q, EnvConfigService) {
        var env = EnvConfigService.getActiveEnv();
        var service = {
            getMonthlySummary: getMonthlySummary
        };

        return service;

        function getMonthlySummary(requestModel) {
            var url = env.apiBaseUrl + '/spending-summary/monthly';
            var config = {
                timeout: env.apiTimeoutMs
            };

            return $http.post(url, requestModel, config)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }
    }

    angular
        .module('app')
        .service('MonthlySummaryApiService', MonthlySummaryApiService);
})();
