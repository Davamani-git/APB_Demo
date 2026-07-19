(function () {
    'use strict';

    ConfigService.$inject = ['$http', '$q', 'ENV_CONFIG', 'LoggingService', '$injector'];

    function ConfigService($http, $q, ENV_CONFIG, LoggingService, $injector) {
        var service = {
            getConfig: getConfig
        };

        return service;

        function getConfig() {
            if (ENV_CONFIG.useMockData) {
                var mockService = $injector.get('ConfigMockService');
                return mockService.getConfig();
            }
            var deferred = $q.defer();
            var url = ENV_CONFIG.apiBaseUrl + '/spending-config';

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
                    validateConfigResponse(data);
                    var configModelFactory = $injector.get('ConfigModel');
                    var configModel = configModelFactory.createFromResponse(data);
                    deferred.resolve(configModel);
                } catch (e) {
                    var errorModelFactory = $injector.get('ErrorModel');
                    var errorModel = errorModelFactory.create('500', 'Unable to process configuration.', e.message, null);
                    deferred.reject(errorModel);
                }
            }).catch(function (error) {
                var status = error.status ? error.status.toString() : '500';
                var message = 'Unable to retrieve configuration at the moment.';
                var correlationId = error.data && error.data.correlationId ? error.data.correlationId : null;
                var errorMessage = error.data && error.data.message ? error.data.message : message;
                var errorModelFactory = $injector.get('ErrorModel');
                var errorModel = errorModelFactory.create(status, errorMessage, null, correlationId);
                LoggingService.error('Config API call failed', { status: status, correlationId: correlationId });
                deferred.reject(errorModel);
            });

            return deferred.promise;
        }

        function validateConfigResponse(data) {
            if (!data) {
                throw new Error('Empty config response');
            }
            if (!data.currencyCode) {
                throw new Error('Missing currencyCode in config');
            }
            if (!data.trendChartType) {
                throw new Error('Missing trendChartType in config');
            }
            if (!data.summaryChartType) {
                throw new Error('Missing summaryChartType in config');
            }
            if (!data.colorPalette || !angular.isArray(data.colorPalette)) {
                throw new Error('Invalid colorPalette in config');
            }
        }
    }

    angular.module('app')
        .service('ConfigService', ConfigService);

})();
