(function () {
    'use strict';

    TrendsMockService.$inject = ['$q', '$timeout', 'SixMonthTrendModel', 'ErrorModel', 'ENV_CONFIG'];

    function TrendsMockService($q, $timeout, SixMonthTrendModel, ErrorModel, ENV_CONFIG) {
        var service = {
            getSixMonthTrends: getSixMonthTrends
        };

        var sampleData = window.TrendsMockData || {};

        return service;

        function getSixMonthTrends() {
            var deferred = $q.defer();

            if (ENV_CONFIG.featureFlags.simulateTrendsTimeout) {
                return $q.reject(ErrorModel.create('408', 'The trends request timed out.', null, null));
            }

            $timeout(function () {
                if (ENV_CONFIG.featureFlags.simulateTrendsError) {
                    deferred.reject(ErrorModel.create('500', 'Mocked error retrieving trends.', null, 'mock-trends-error'));
                    return;
                }

                var data = sampleData['default'];
                if (!data) {
                    data = {
                        range: '6m',
                        points: [],
                        chartData: {
                            labels: [],
                            datasets: []
                        },
                        chartOptions: {
                            responsive: true
                        }
                    };
                    var modelEmpty = SixMonthTrendModel.createFromResponse(data);
                    deferred.resolve(modelEmpty);
                    return;
                }

                var model = SixMonthTrendModel.createFromResponse(data);
                deferred.resolve(model);
            }, 500);

            return deferred.promise;
        }
    }

    angular.module('app')
        .service('TrendsMockService', TrendsMockService);

})();
