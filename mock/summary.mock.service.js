(function () {
    'use strict';

    SummaryMockService.$inject = ['$q', '$timeout', 'MonthlySummaryModel', 'ErrorModel', 'ENV_CONFIG'];

    function SummaryMockService($q, $timeout, MonthlySummaryModel, ErrorModel, ENV_CONFIG) {
        var service = {
            getMonthlySummary: getMonthlySummary
        };

        var sampleData = window.SummaryMockData || {};

        return service;

        function getMonthlySummary(month) {
            var deferred = $q.defer();

            if (ENV_CONFIG.featureFlags.simulateSummaryTimeout) {
                return $q.reject(ErrorModel.create('408', 'The summary request timed out.', null, null));
            }

            $timeout(function () {
                if (ENV_CONFIG.featureFlags.simulateSummaryError) {
                    deferred.reject(ErrorModel.create('500', 'Mocked error retrieving monthly summary.', null, 'mock-summary-error'));
                    return;
                }

                var record = sampleData[month];
                if (!record) {
                    var emptyModel = MonthlySummaryModel.create(month, 0, 0, 0, 'INR', {}, null, null, true);
                    deferred.resolve(emptyModel);
                    return;
                }

                var model = MonthlySummaryModel.createFromResponse(record);
                deferred.resolve(model);
            }, 500);

            return deferred.promise;
        }
    }

    angular.module('app')
        .service('SummaryMockService', SummaryMockService);

})();
