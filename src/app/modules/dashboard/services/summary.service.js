(function () {
    'use strict';

    SummaryService.$inject = ['$http', '$q', 'ENV_CONFIG', 'LoggingService', '$injector'];

    function SummaryService($http, $q, ENV_CONFIG, LoggingService, $injector) {
        var service = {
            getMonthlySummary: getMonthlySummary
        };

        return service;

        function getMonthlySummary(month) {
            if (ENV_CONFIG.useMockData) {
                var mockService = $injector.get('SummaryMockService');
                return mockService.getMonthlySummary(month);
            }
            var deferred = $q.defer();
            var url = ENV_CONFIG.apiBaseUrl + '/spending-summary?month=' + encodeURIComponent(month);

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
                    validateSummaryResponse(data);
                    var modelFactory = $injector.get('MonthlySummaryModel');
                    var summaryModel = modelFactory.createFromResponse(data);
                    deferred.resolve(summaryModel);
                } catch (e) {
                    var errorModelFactory = $injector.get('ErrorModel');
                    var errorModel = errorModelFactory.create('500', 'Unable to process spending summary.', e.message, null);
                    deferred.reject(errorModel);
                }
            }).catch(function (error) {
                var status = error.status ? error.status.toString() : '500';
                var message = 'Unable to retrieve spending information at the moment.';
                var correlationId = error.data && error.data.correlationId ? error.data.correlationId : null;
                var errorMessage = error.data && error.data.message ? error.data.message : message;
                var errorModelFactory = $injector.get('ErrorModel');
                var errorModel = errorModelFactory.create(status, errorMessage, null, correlationId);
                LoggingService.error('Summary API call failed', { status: status, correlationId: correlationId });
                deferred.reject(errorModel);
            });

            return deferred.promise;
        }

        function validateSummaryResponse(data) {
            if (!data) {
                throw new Error('Empty response');
            }
            if (!data.month) {
                throw new Error('Missing month in response');
            }
            if (typeof data.totalSpend !== 'number' || data.totalSpend < 0) {
                throw new Error('Invalid totalSpend');
            }
            if (typeof data.transactionCount !== 'number' || data.transactionCount < 0) {
                throw new Error('Invalid transactionCount');
            }
        }
    }

    angular.module('app')
        .service('SummaryService', SummaryService);

})();
