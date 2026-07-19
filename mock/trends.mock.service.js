(function() {
  'use strict';

  TrendsMockService.$inject = ['$q', '$timeout', 'ENV_CONFIG', 'SixMonthTrendModel', 'ErrorModel', 'LoggingService'];

  function TrendsMockService($q, $timeout, ENV_CONFIG, SixMonthTrendModel, ErrorModel, LoggingService) {
    this.getSixMonthTrends = function(selectedMonth) {
      var deferred = $q.defer();

      $timeout(function() {
        if (ENV_CONFIG.featureFlags && ENV_CONFIG.featureFlags.simulateTrendError) {
          LoggingService.error('Simulated trend error in mock service');
          deferred.reject(new ErrorModel({
            code: '500',
            message: 'Simulated error while loading spending trends.'
          }));
          return;
        }

        var key = selectedMonth || '2026-07';
        var raw;
        if (window.SixMonthTrendMockData && window.SixMonthTrendMockData[key]) {
          raw = window.SixMonthTrendMockData[key];
        } else {
          raw = window.SixMonthTrendMockData['no-data'];
        }

        deferred.resolve(new SixMonthTrendModel(raw));
      }, 500);

      return deferred.promise;
    };
  }

  angular.module('app')
    .service('TrendsMockService', TrendsMockService);
})();
