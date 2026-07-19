(function () {
  'use strict';

  SpendingTrendsMockService.$inject = ['$q', '$timeout'];

  function SpendingTrendsMockService($q, $timeout) {
    var mockTrend = {
      startMonth: '2026-02',
      endMonth: '2026-07',
      currency: 'USD',
      points: [
        { month: '2026-02', totalSpend: 900.50, transactionCount: 30 },
        { month: '2026-03', totalSpend: 1000.00, transactionCount: 32 },
        { month: '2026-04', totalSpend: 1100.25, transactionCount: 35 },
        { month: '2026-05', totalSpend: 950.00, transactionCount: 28 },
        { month: '2026-06', totalSpend: 1200.00, transactionCount: 40 },
        { month: '2026-07', totalSpend: 1250.75, transactionCount: 42 }
      ]
    };

    function getSixMonthTrends() {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve(mockTrend);
      }, 900);
      return deferred.promise;
    }

    return {
      getSixMonthTrends: getSixMonthTrends
    };
  }

  angular.module('app')
    .service('spendingTrendsMockService', SpendingTrendsMockService);
})();
