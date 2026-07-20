(function () {
    'use strict';

    angular.module('apbDemo')
        .service('MonthContextService', MonthContextService);

    MonthContextService.$inject = ['$http', '$q', 'EnvConfigService', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

    function MonthContextService($http, $q, EnvConfigService, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
        var service = this;
        var cachedContext = null;

        service.getMonthContext = getMonthContext;
        service.getCachedContext = getCachedContext;

        function getMonthContext() {
            var deferred = $q.defer();

            if (EnvConfigService.getUseMockData()) {
                LoggingService.info('MonthContextService using mock data.', {});
                useMockMonthContext(deferred);
            } else {
                var url = buildRequestUrl();
                LoggingService.info('MonthContextService calling API.', { url: url });
                $http.get(url).then(function (response) {
                    try {
                        validateResponse(response.data);
                        cachedContext = response.data;
                        deferred.resolve(response.data);
                    } catch (e) {
                        var parseError = ErrorHandlingService.handleError(e, 'MonthContextService.parse');
                        deferred.reject(parseError);
                    }
                }).catch(function (httpError) {
                    var errorModel = ErrorHandlingService.handleError(httpError, 'MonthContextService.http');
                    deferred.reject(errorModel);
                });
            }

            return deferred.promise;
        }

        function getCachedContext() {
            var deferred = $q.defer();
            if (cachedContext) {
                deferred.resolve(cachedContext);
            } else {
                getMonthContext().then(function (context) {
                    deferred.resolve(context);
                }).catch(function (errorModel) {
                    deferred.reject(errorModel);
                });
            }
            return deferred.promise;
        }

        function buildRequestUrl() {
            var baseUrl = EnvConfigService.getApiBaseUrl();
            return baseUrl + API_ENDPOINTS.MONTH_CONTEXT;
        }

        function validateResponse(data) {
            if (!data || !angular.isArray(data.months)) {
                throw new Error('Month context response is invalid.');
            }
            if (typeof data.defaultMonth !== 'string') {
                throw new Error('Month context defaultMonth is missing.');
            }
        }

        function useMockMonthContext(deferred) {
            var mockData = window.MonthContextMockData && window.MonthContextMockData.context;
            if (!mockData) {
                var errorModel = ErrorHandlingService.createClientValidationError('No mock month context data available.');
                deferred.reject(errorModel);
                return;
            }
            var delayMs = 400;
            var timeoutService = angular.injector(['ng']).get('$timeout');
            timeoutService(function () {
                try {
                    validateResponse(mockData);
                    cachedContext = mockData;
                    deferred.resolve(mockData);
                } catch (e) {
                    var parseError = ErrorHandlingService.handleError(e, 'MonthContextService.mock.parse');
                    deferred.reject(parseError);
                }
            }, delayMs);
        }
    }
})();
