(function () {
    'use strict';

    MonthlySummaryService.$inject = ['MonthlySummaryApiService', 'MonthlySummaryMockService', 'EnvConfigService', '$q'];

    function MonthlySummaryService(MonthlySummaryApiService, MonthlySummaryMockService, EnvConfigService, $q) {
        var service = {
            getMonthlySummary: getMonthlySummary
        };

        return service;

        function getMonthlySummary(requestModel) {
            var useMock = EnvConfigService.isMockMode();
            var promise;

            if (useMock) {
                promise = MonthlySummaryMockService.getMonthlySummary(requestModel)
                    .then(function (response) {
                        return response.data;
                    });
            } else {
                promise = MonthlySummaryApiService.getMonthlySummary(requestModel);
            }

            return promise.then(function (data) {
                return data;
            }).catch(function (error) {
                return $q.reject(error);
            });
        }
    }

    angular
        .module('app')
        .service('MonthlySummaryService', MonthlySummaryService);
})();
