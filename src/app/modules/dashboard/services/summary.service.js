(function() {
  'use strict';

  SummaryService.$inject = ['$http', '$q', 'ENV_CONFIG', 'LoggingService', 'MonthlySummaryModel', 'ErrorModel'];

  function SummaryService($http, $q, ENV_CONFIG, LoggingService, MonthlySummaryModel, ErrorModel) {
    this.getMonthlySummary = function(month) {
      if (ENV_CONFIG.useMockData) {
        return $q.reject('MOCK_MODE');
      }

      var deferred = $q.defer();

      if (!/^\d{4}-\d{2}$/.test(month)) {
        deferred.reject(new ErrorModel({
          code: '400',
          message: 'Invalid month selected. Please choose a valid month.'
        }));
        return deferred.promise;
      }

      var url = ENV_CONFIG.apiBaseUrl + '/spending-summary?month=' + encodeURIComponent(month);

      $http({
        method: 'GET',
        url: url,
        timeout: ENV_CONFIG.apiTimeoutMs
      }).then(function(response) {
        var data = response.data || {};
        try {
          validateSummaryResponse(data);
          deferred.resolve(new MonthlySummaryModel(data));
        } catch (e) {
          LoggingService.error('Invalid summary response', { error: e });
          deferred.reject(new ErrorModel({
            code: '500',
            message: 'Unable to process spending summary at the moment.'
          }));
        }
      }).catch(function(error) {
        LoggingService.error('SummaryService API error', { error: error });
        var errModel = new ErrorModel({
          code: (error && error.status ? String(error.status) : '500'),
          message: (error && error.data && error.data.message) ? error.data.message : 'Unable to retrieve spending summary.'
        });
        deferred.reject(errModel);
      });

      return deferred.promise;
    };

    function validateSummaryResponse(data) {
      if (!data || typeof data.month !== 'string') {
        throw new Error('month is required');
      }
      if (typeof data.totalSpend !== 'number' || data.totalSpend < 0) {
        throw new Error('totalSpend must be non-negative number');
      }
      if (typeof data.transactionCount !== 'number' || data.transactionCount < 0) {
        throw new Error('transactionCount must be non-negative number');
      }
    }
  }

  angular.module('app')
    .service('SummaryService', SummaryService);
})();
