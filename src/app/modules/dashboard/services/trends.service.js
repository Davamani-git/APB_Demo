(function () {
    'use strict';

    TrendsService.$inject = ['$http', '$q', 'ENV_CONFIG', 'LoggingService', '$injector'];

    function TrendsService($http, $q, ENV_CONFIG, LoggingService, $injector) {
        var service = {
            getSixMonthTrends: getSixMonthTrends
        };

        return service;

        function getSixMonthTrends() {
            if (ENV_CONFIG.useMockData) {
                var mockService = $injector.get('TrendsMockService');
                return mockService.getSixMonthTrends();
            }
            var deferred = $q.defer();
            var url = ENV_CONFIG.apiBaseUrl + '/spending-trends?range=6m';

            $http({
                method: 'GET',
                url: url,
                timeout: ENV_CONFIG.apiTimeoutMs,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                try {
                    var data = response.data;
                    validateTrendsResponse(data);
                    var modelFactory = $injector.get('SixMonthTrendModel');
                    var trendsModel = modelFactory.createFromResponse(data);
                    deferred.resolve(trendsModel);
                } catch (e) {
                    var errorModelFactory = $injector.get('ErrorModel');
                    var errorModel = errorModelFactory.create('500', 'Unable to process spending trends.', e.message, null);
                    deferred.reject(errorModel);
                }
            }).catch(function (error) {
                var status = error.status ? error.status.toString() : '500';
                var message = 'Unable to retrieve spending trends at the moment.';
                var correlationId = error.data && error.data.correlationId ? error.data.correlationId : null;
                var errorMessage = error.data && error.data.message ? error.data.message : message;
                var errorModelFactory = $injector.get('ErrorModel');
                var errorModel = errorModelFactory.create(status, errorMessage, null, correlationId);
                LoggingService.error('Trends API call failed', { status: status, correlationId: correlationId });
                deferred.reject(errorModel);
            });

            return deferred.promise;
        }

        function validateTrendsResponse(data) {
            if (!data || !data.points || !angular.isArray(data.points)) {
                throw new Error('Invalid trends response');
            }
            if (data.points.length > 6) {
                throw new Error('Too many trend points');
            }
            for (var i = 0; i < data.points.length; i++) {
                var point = data.points[i];
                if (!point.month) {
                    throw new Error('Missing month in trend point');
                }
                if (typeof point.totalSpend !== 'number' || point.totalSpend < 0) {
                    throw new Error('Invalid totalSpend in trend point');
                }
                if (typeof point.transactionCount !== 'number' || point.transactionCount < 0) {
                    throw new Error('Invalid transactionCount in trend point');
                }
            }
        }
    }

    angular.module('app')
        .service('TrendsService', TrendsService);

})();
