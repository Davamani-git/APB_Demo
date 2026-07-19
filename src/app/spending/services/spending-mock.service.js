(function () {
  'use strict';

  SpendingMockService.$inject = ['$http', '$q', '$timeout', 'EnvConfigService', 'LoggingService', 'SpendSummaryModel', 'MetricsModel', 'ErrorModel'];

  angular
    .module('app')
    .service('SpendingMockService', SpendingMockService);

  function SpendingMockService($http, $q, $timeout, EnvConfigService, LoggingService, SpendSummaryModel, MetricsModel, ErrorModel) {
    var self = this;
    var _mockData = null;
    var _mockLoadPromise = null;

    self.getMonthlySummary = getMonthlySummary;

    function getMonthlySummary(cardId, month) {
      var deferred = $q.defer();

      _ensureMockDataLoaded()
        .then(function (data) {
          var summaries = (data && data.summaries) || [];
          var match = summaries.find(function (s) {
            return s.cardId === cardId && s.month === month;
          });

          var delayMs = 500;

          if (match) {
            $timeout(function () {
              var summaryModel = _mapMockToModel(match);
              deferred.resolve(summaryModel);
            }, delayMs);
          } else {
            $timeout(function () {
              var errorModel = new ErrorModel({
                code: 'SUMMARY_NOT_FOUND',
                message: 'No spending summary is available for the selected month.',
                httpStatus: 404,
                type: 'not_found',
                retryable: false,
                correlationId: ''
              });
              deferred.reject(errorModel);
            }, delayMs);
          }
        })
        .catch(function () {
          var errorModel = new ErrorModel({
            code: 'MOCK_LOAD_FAILED',
            message: 'Unable to load mock spending summary data.',
            httpStatus: 500,
            type: 'server',
            retryable: false,
            correlationId: ''
          });
          deferred.reject(errorModel);
        });

      return deferred.promise;
    }

    function _ensureMockDataLoaded() {
      if (_mockLoadPromise) {
        return _mockLoadPromise;
      }

      var deferred = $q.defer();

      $http.get('mocks/api/spend-summary.mock.json')
        .then(function (response) {
          _mockData = response.data || {};
          deferred.resolve(_mockData);
        })
        .catch(function (error) {
          LoggingService.error('Failed to load mock data', { error: error });
          deferred.reject(error);
        });

      _mockLoadPromise = deferred.promise;
      return _mockLoadPromise;
    }

    function _mapMockToModel(raw) {
      var metrics = new MetricsModel(raw.metrics || {});
      var props = {
        cardId: raw.cardId,
        month: raw.month,
        currency: raw.currency,
        metrics: metrics,
        breakdown: raw.breakdown || {},
        lastUpdated: raw.lastUpdated
      };
      return new SpendSummaryModel(props);
    }
  }
})();
