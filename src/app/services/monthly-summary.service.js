(function () {
    'use strict';

    angular.module('apbDemo')
        .service('MonthlySummaryService', MonthlySummaryService);

    MonthlySummaryService.$inject = ['$http', '$q', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

    function MonthlySummaryService($http, $q, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
        var service = this;

        service.getSummary = getSummary;

        function getSummary(month) {
            var deferred = $q.defer();
            if (!month || !/^\d{4}-\d{2}$/.test(month)) {
                var validationError = ErrorHandlingService.createClientValidationError('Invalid month format. Expected YYYY-MM.');
                deferred.reject(validationError);
                return deferred.promise;
            }

            if (EnvConfigService.getUseMockData()) {
                LoggingService.info('MonthlySummaryService using mock data.', { month: month });
                useMockSummary(month, deferred);
            } else {
                var url = buildRequestUrl(month);
                LoggingService.info('MonthlySummaryService calling API.', { url: url, month: month });
                $http.get(url).then(function (response) {
                    try {
                        validateResponse(response.data);
                        var model = ModelFactory.createMonthlySummary(response.data);
                        deferred.resolve(model);
                    } catch (e) {
                        var parseError = ErrorHandlingService.handleError(e, 'MonthlySummaryService.parse');
                        deferred.reject(parseError);
                    }
                }).catch(function (httpError) {
                    var errorModel = ErrorHandlingService.handleError(httpError, 'MonthlySummaryService.http');
                    deferred.reject(errorModel);
                });
            }

            return deferred.promise;
        }

        function buildRequestUrl(month) {
            var baseUrl = EnvConfigService.getApiBaseUrl();
            return baseUrl + API_ENDPOINTS.SPEND_SUMMARY + '?month=' + encodeURIComponent(month);
        }

        function validateResponse(data) {
            if (!data) {
                throw new Error('Monthly summary response is empty.');
            }
            if (typeof data.month !== 'string') {
                throw new Error('Monthly summary response missing month.');
            }
            if (!/^\d{4}-\d{2}$/.test(data.month)) {
                throw new Error('Monthly summary month format invalid.');
            }
            if (typeof data.currency !== 'string') {
                throw new Error('Monthly summary response missing currency.');
            }
            if (typeof data.totalSpend !== 'number') {
                throw new Error('Monthly summary response missing totalSpend.');
            }
            if (typeof data.transactionCount !== 'number') {
                throw new Error('Monthly summary response missing transactionCount.');
            }
        }

        function useMockSummary(month, deferred) {
            var datasetKey = month === '2026-07' ? 'july' : month === '2026-06' ? 'june' : 'default';
            var mockData = window.MonthlySummaryMockData && window.MonthlySummaryMockData[datasetKey];
            if (!mockData) {
                var errorModel = ErrorHandlingService.createClientValidationError('No mock summary data available for selected month.');
                deferred.reject(errorModel);
                return;
            }
            var delayMs = 600;
            var timeoutService = angular.injector(['ng']).get('$timeout');
            timeoutService(function () {
                try {
                    validateResponse(mockData);
                    var model = ModelFactory.createMonthlySummary(mockData);
                    deferred.resolve(model);
                } catch (e) {
                    var parseError = ErrorHandlingService.handleError(e, 'MonthlySummaryService.mock.parse');
                    deferred.reject(parseError);
                }
            }, delayMs);
        }
    }
})();
