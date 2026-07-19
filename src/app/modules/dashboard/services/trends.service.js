(function() {
  'use strict';

  TrendsService.$inject = ['$http', '$q', 'ENV_CONFIG', 'LoggingService', 'SixMonthTrendModel', 'ErrorModel'];

  function TrendsService($http, $q, ENV_CONFIG, LoggingService, SixMonthTrendModel, ErrorModel) {
    this.getSixMonthTrends = function() {
      if (ENV_CONFIG.useMockData) {
        return $q.reject('MOCK_MODE');
      }

      var deferred = $q.defer();
      var url = ENV_CONFIG.apiBaseUrl + '/spending-trends?range=6m';

      $http({
        method: 'GET',
        url: url,
        timeout: ENV_CONFIG.apiTimeoutMs
      }).then(function(response) {
        var data = response.data || {};
        try {
          validateTrendsResponse(data);
          deferred.resolve(new SixMonthTrendModel(data));
        } catch (e) {
          LoggingService.error('Invalid trends response', { error: e });
          deferred.reject(new ErrorModel({
            code: '500',
            message: 'Unable to process spending trends at the moment.'
          }));
        }
      }).catch(function(error) {
        LoggingService.error('TrendsService API error', { error: error });
        var errModel = new ErrorModel({
          code: (error && error.status ? String(error.status) : '500'),
          message: (error && error.data && error.data.message) ? error.data.message : 'Unable to retrieve spending trends.'
        });
        deferred.reject(errModel);
      });

      return deferred.promise;
    };

    function validateTrendsResponse(data) {
      if (!data || !Array.isArray(data.points)) {
        throw new Error('points array is required');
      }
      if (data.points.length > 6) {
        throw new Error('points length must be <= 6');
      }
      for (var i = 0; i < data.points.length; i++) {
        var p = data.points[i];
        if (!p.month || typeof p.month !== 'string') {
          throw new Error('month is required for each point');
        }
        if (typeof p.totalSpend !== 'number' || p.totalSpend < 0) {
          throw new Error('totalSpend non-negative number required');
        }
        if (typeof p.transactionCount !== 'number' || p.transactionCount < 0) {
          throw new Error('transactionCount non-negative number required');
        }
      }
    }
  }

  angular.module('app')
    .service('TrendsService', TrendsService);
})();
