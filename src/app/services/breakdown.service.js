(function () {
    'use strict';

    angular.module('apbDemo')
        .service('BreakdownService', BreakdownService);

    BreakdownService.$inject = ['$http', '$q', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

    function BreakdownService($http, $q, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
        var service = this;

        service.getBreakdown = getBreakdown;

        function getBreakdown(month) {
            var deferred = $q.defer();
            if (!month || !/^\d{4}-\d{2}$/.test(month)) {
                var validationError = ErrorHandlingService.createClientValidationError('Invalid month format for breakdown.');
                deferred.reject(validationError);
                return deferred.promise;
            }

            if (EnvConfigService.getUseMockData()) {
                LoggingService.info('BreakdownService using mock data.', { month: month });
                useMockBreakdown(month, deferred);
            } else {
                var url = buildRequestUrl(month);
                LoggingService.info('BreakdownService calling API.', { url: url, month: month });
                $http.get(url).then(function (response) {
                    try {
                        validateResponse(response.data);
                        var model = ModelFactory.createBreakdown(response.data);
                        deferred.resolve(model);
                    } catch (e) {
                        var parseError = ErrorHandlingService.handleError(e, 'BreakdownService.parse');
                        deferred.reject(parseError);
                    }
                }).catch(function (httpError) {
                    var errorModel = ErrorHandlingService.handleError(httpError, 'BreakdownService.http');
                    deferred.reject(errorModel);
                });
            }

            return deferred.promise;
        }

        function buildRequestUrl(month) {
            var baseUrl = EnvConfigService.getApiBaseUrl();
            return baseUrl + API_ENDPOINTS.SPEND_BREAKDOWN + '?month=' + encodeURIComponent(month);
        }

        function validateResponse(data) {
            if (!data) {
                throw new Error('Breakdown response is empty.');
            }
            if (typeof data.month !== 'string') {
                throw new Error('Breakdown response missing month.');
            }
            if (!angular.isArray(data.categories)) {
                throw new Error('Breakdown categories must be an array.');
            }
        }

        function useMockBreakdown(month, deferred) {
            var datasetKey = month === '2026-07' ? 'july' : month === '2026-06' ? 'june' : 'default';
            var mockData = window.BreakdownMockData && window.BreakdownMockData[datasetKey];
            if (!mockData) {
                var errorModel = ErrorHandlingService.createClientValidationError('No mock breakdown data available for selected month.');
                deferred.reject(errorModel);
                return;
            }
            var delayMs = 700;
            var timeoutService = angular.injector(['ng']).get('$timeout');
            timeoutService(function () {
                try {
                    validateResponse(mockData);
                    var model = ModelFactory.createBreakdown(mockData);
                    deferred.resolve(model);
                } catch (e) {
                    var parseError = ErrorHandlingService.handleError(e, 'BreakdownService.mock.parse');
                    deferred.reject(parseError);
                }
            }, delayMs);
        }
    }
})();
