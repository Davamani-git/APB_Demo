(function () {
    'use strict';

    angular.module('apbDemo')
        .service('KpiService', KpiService);

    KpiService.$inject = ['$http', '$q', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

    function KpiService($http, $q, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
        var service = this;

        service.getKpis = getKpis;

        function getKpis(month) {
            var deferred = $q.defer();
            if (!month || !/^\d{4}-\d{2}$/.test(month)) {
                var validationError = ErrorHandlingService.createClientValidationError('Invalid month format for KPI.');
                deferred.reject(validationError);
                return deferred.promise;
            }

            if (EnvConfigService.getUseMockData()) {
                LoggingService.info('KpiService using mock data.', { month: month });
                useMockKpis(month, deferred);
            } else {
                var url = buildRequestUrl(month);
                LoggingService.info('KpiService calling API.', { url: url, month: month });
                $http.get(url).then(function (response) {
                    try {
                        validateResponse(response.data);
                        var models = ModelFactory.createKpiList(response.data);
                        deferred.resolve(models);
                    } catch (e) {
                        var parseError = ErrorHandlingService.handleError(e, 'KpiService.parse');
                        deferred.reject(parseError);
                    }
                }).catch(function (httpError) {
                    var errorModel = ErrorHandlingService.handleError(httpError, 'KpiService.http');
                    deferred.reject(errorModel);
                });
            }

            return deferred.promise;
        }

        function buildRequestUrl(month) {
            var baseUrl = EnvConfigService.getApiBaseUrl();
            return baseUrl + API_ENDPOINTS.SPEND_KPIS + '?month=' + encodeURIComponent(month);
        }

        function validateResponse(data) {
            if (!angular.isArray(data)) {
                throw new Error('KPI response is not an array.');
            }
        }

        function useMockKpis(month, deferred) {
            var datasetKey = month === '2026-07' ? 'july' : month === '2026-06' ? 'june' : 'default';
            var mockData = window.KpiMockData && window.KpiMockData[datasetKey];
            if (!mockData) {
                var errorModel = ErrorHandlingService.createClientValidationError('No mock KPI data available for selected month.');
                deferred.reject(errorModel);
                return;
            }
            var delayMs = 500;
            var timeoutService = angular.injector(['ng']).get('$timeout');
            timeoutService(function () {
                try {
                    validateResponse(mockData);
                    var models = ModelFactory.createKpiList(mockData);
                    deferred.resolve(models);
                } catch (e) {
                    var parseError = ErrorHandlingService.handleError(e, 'KpiService.mock.parse');
                    deferred.reject(parseError);
                }
            }, delayMs);
        }
    }
})();
