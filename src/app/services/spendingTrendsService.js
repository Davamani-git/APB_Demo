(function () {
  'use strict';

  SpendingTrendsService.$inject = ['$q', 'configService', 'httpClientFactory', 'loggingService', 'SpendingTrendModel', 'insightsFormattingService', 'ErrorModel', '$injector'];

  function SpendingTrendsService($q, configService, httpClientFactory, loggingService, SpendingTrendModel, insightsFormattingService, ErrorModel, $injector) {
    function getSixMonthTrends() {
      var deferred = $q.defer();

      configService.isMockEnabled().then(function (useMock) {
        if (useMock) {
          var mockService = $injector.get('spendingTrendsMockService');
          mockService.getSixMonthTrends().then(function (raw) {
            try {
              var model = SpendingTrendModel.create(raw);
              var formatted = insightsFormattingService.formatSpendingTrends(model);
              deferred.resolve(formatted);
            } catch (e) {
              loggingService.error('Failed to create SpendingTrendModel from mock data', { exception: e });
              deferred.reject(ErrorModel.create({
                code: 'ERR_DATA_UNAVAILABLE',
                httpStatus: 500,
                message: 'Spending trend data is temporarily unavailable. Please try again later.',
                technicalMessage: e.message,
                retryable: true
              }));
            }
          }).catch(function (err) {
            loggingService.error('Mock trend retrieval failed', { error: err });
            deferred.reject(ErrorModel.create({
              code: 'ERR_DATA_UNAVAILABLE',
              httpStatus: 503,
              message: 'Spending trend data is temporarily unavailable. Please try again later.',
              technicalMessage: err && (err.message || err.toString()),
              retryable: true
            }));
          });
        } else {
          configService.getConfig().then(function (cfg) {
            var url = cfg.apiBaseUrl + '/spending-trends?range=6m';
            var options = {
              timeout: cfg.apiTimeoutMs
            };
            httpClientFactory.get(url, options).then(function (response) {
              try {
                var model = SpendingTrendModel.create(response.data);
                var formatted = insightsFormattingService.formatSpendingTrends(model);
                deferred.resolve(formatted);
              } catch (e) {
                loggingService.error('Failed to create SpendingTrendModel from API response', { exception: e });
                deferred.reject(ErrorModel.create({
                  code: 'ERR_DATA_UNAVAILABLE',
                  httpStatus: 500,
                  message: 'Spending trend data is temporarily unavailable. Please try again later.',
                  technicalMessage: e.message,
                  retryable: true
                }));
              }
            }).catch(function (httpError) {
              loggingService.error('Six-month trends API call failed', { error: httpError });
              var status = httpError.status;
              var errorBody = httpError.data || {};
              var errorModel;
              if (status === 400) {
                errorModel = ErrorModel.create({
                  code: errorBody.code || 'ERR_INVALID_RANGE',
                  httpStatus: 400,
                  message: errorBody.message || 'The requested trend range is invalid.',
                  technicalMessage: 'API reported invalid trend range.',
                  correlationId: errorBody.correlationId,
                  retryable: false
                });
              } else if (status === 401 || status === 403) {
                errorModel = ErrorModel.create({
                  code: errorBody.code || 'ERR_UNAUTHORIZED_ACCESS',
                  httpStatus: status,
                  message: 'You are not authorized to view this trend data.',
                  technicalMessage: 'Authorization error when fetching trend data.',
                  correlationId: errorBody.correlationId,
                  retryable: false
                });
              } else if (status === 404) {
                errorModel = ErrorModel.create({
                  code: errorBody.code || 'ERR_NO_DATA',
                  httpStatus: 404,
                  message: 'No spending trend data available for the last 6 months.',
                  technicalMessage: 'No data found for the requested trend period.',
                  correlationId: errorBody.correlationId,
                  retryable: false
                });
              } else {
                errorModel = ErrorModel.create({
                  code: errorBody.code || 'ERR_DATA_UNAVAILABLE',
                  httpStatus: status,
                  message: errorBody.message || 'Spending trend data is temporarily unavailable. Please try again later.',
                  technicalMessage: 'Upstream service error when fetching spending trends.',
                  correlationId: errorBody.correlationId,
                  retryable: true
                });
              }
              deferred.reject(errorModel);
            });
          }).catch(function (cfgError) {
            loggingService.error('Failed to load configuration for spending trends', { error: cfgError });
            deferred.reject(ErrorModel.create({
              code: 'ERR_CONFIG',
              httpStatus: 500,
              message: 'Configuration error. Please contact support.',
              technicalMessage: cfgError && (cfgError.message || cfgError.toString()),
              retryable: false
            }));
          });
        }
      });

      return deferred.promise;
    }

    return {
      getSixMonthTrends: getSixMonthTrends
    };
  }

  angular.module('app')
    .service('spendingTrendsService', SpendingTrendsService);
})();
