(function () {
  'use strict';

  SpendingSummaryService.$inject = ['$q', 'configService', 'httpClientFactory', 'loggingService', 'MonthlySummaryModel', 'insightsFormattingService', 'ErrorModel', '$injector'];

  function SpendingSummaryService($q, configService, httpClientFactory, loggingService, MonthlySummaryModel, insightsFormattingService, ErrorModel, $injector) {
    function getMonthlySummary(month) {
      var deferred = $q.defer();

      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        deferred.reject(ErrorModel.create({
          code: 'ERR_INVALID_MONTH',
          httpStatus: 400,
          message: 'The selected month is invalid.',
          technicalMessage: 'Month must be in YYYY-MM format.',
          retryable: false
        }));
        return deferred.promise;
      }

      configService.isMockEnabled().then(function (useMock) {
        if (useMock) {
          var mockService = $injector.get('spendingSummaryMockService');
          mockService.getMonthlySummary(month).then(function (raw) {
            try {
              var model = MonthlySummaryModel.create(raw);
              var formatted = insightsFormattingService.formatMonthlySummary(model);
              deferred.resolve(formatted);
            } catch (e) {
              loggingService.error('Failed to create MonthlySummaryModel from mock data', { exception: e });
              deferred.reject(ErrorModel.create({
                code: 'ERR_DATA_UNAVAILABLE',
                httpStatus: 500,
                message: 'Spending data is temporarily unavailable. Please try again later.',
                technicalMessage: e.message,
                retryable: true
              }));
            }
          }).catch(function (err) {
            loggingService.error('Mock monthly summary retrieval failed', { error: err });
            deferred.reject(ErrorModel.create({
              code: 'ERR_DATA_UNAVAILABLE',
              httpStatus: 503,
              message: 'Spending data is temporarily unavailable. Please try again later.',
              technicalMessage: err && (err.message || err.toString()),
              retryable: true
            }));
          });
        } else {
          configService.getConfig().then(function (cfg) {
            var url = cfg.apiBaseUrl + '/spending-summary?month=' + encodeURIComponent(month);
            var options = {
              timeout: cfg.apiTimeoutMs
            };
            httpClientFactory.get(url, options).then(function (response) {
              try {
                var model = MonthlySummaryModel.create(response.data);
                var formatted = insightsFormattingService.formatMonthlySummary(model);
                deferred.resolve(formatted);
              } catch (e) {
                loggingService.error('Failed to create MonthlySummaryModel from API response', { exception: e });
                deferred.reject(ErrorModel.create({
                  code: 'ERR_DATA_UNAVAILABLE',
                  httpStatus: 500,
                  message: 'Spending data is temporarily unavailable. Please try again later.',
                  technicalMessage: e.message,
                  retryable: true
                }));
              }
            }).catch(function (httpError) {
              loggingService.error('Monthly summary API call failed', { error: httpError, month: month });
              var status = httpError.status;
              var errorBody = httpError.data || {};
              var errorModel;
              if (status === 400) {
                errorModel = ErrorModel.create({
                  code: errorBody.code || 'ERR_INVALID_MONTH',
                  httpStatus: 400,
                  message: errorBody.message || 'The selected month is invalid.',
                  technicalMessage: 'API reported invalid month.',
                  correlationId: errorBody.correlationId,
                  retryable: false
                });
              } else if (status === 401 || status === 403) {
                errorModel = ErrorModel.create({
                  code: errorBody.code || 'ERR_UNAUTHORIZED_ACCESS',
                  httpStatus: status,
                  message: 'You are not authorized to view this data.',
                  technicalMessage: 'Authorization error when fetching monthly summary.',
                  correlationId: errorBody.correlationId,
                  retryable: false
                });
              } else if (status === 404) {
                errorModel = ErrorModel.create({
                  code: errorBody.code || 'ERR_NO_DATA',
                  httpStatus: 404,
                  message: 'No spending data available for the selected month.',
                  technicalMessage: 'No data found for the requested month.',
                  correlationId: errorBody.correlationId,
                  retryable: false
                });
              } else {
                errorModel = ErrorModel.create({
                  code: errorBody.code || 'ERR_DATA_UNAVAILABLE',
                  httpStatus: status,
                  message: errorBody.message || 'Spending data is temporarily unavailable. Please try again later.',
                  technicalMessage: 'Upstream service error when fetching monthly summary.',
                  correlationId: errorBody.correlationId,
                  retryable: true
                });
              }
              deferred.reject(errorModel);
            });
          }).catch(function (cfgError) {
            loggingService.error('Failed to load configuration for monthly summary', { error: cfgError });
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
      getMonthlySummary: getMonthlySummary
    };
  }

  angular.module('app')
    .service('spendingSummaryService', SpendingSummaryService);
})();
