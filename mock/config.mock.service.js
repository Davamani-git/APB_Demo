(function () {
    'use strict';

    ConfigMockService.$inject = ['$q', '$timeout', 'ConfigModel'];

    function ConfigMockService($q, $timeout, ConfigModel) {
        var service = {
            getConfig: getConfig
        };

        return service;

        function getConfig() {
            var deferred = $q.defer();
            $timeout(function () {
                var data = {
                    currencyCode: 'INR',
                    trendChartType: 'line',
                    summaryChartType: 'bar',
                    colorPalette: ['#4CAF50', '#2196F3', '#FFC107'],
                    highSpendThreshold: 50000,
                    featureFlags: {
                        showCategoryBreakdown: true,
                        showAverageSpend: true
                    }
                };
                var configModel = ConfigModel.createFromResponse(data);
                deferred.resolve(configModel);
            }, 300);
            return deferred.promise;
        }
    }

    angular.module('app')
        .service('ConfigMockService', ConfigMockService);

})();
