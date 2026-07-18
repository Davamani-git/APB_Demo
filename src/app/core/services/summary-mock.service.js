(function () {
  'use strict';

  SummaryMockService.$inject = ['$q', '$timeout', 'KpiService', 'BreakdownService', 'ErrorModel'];

  function SummaryMockService($q, $timeout, KpiService, BreakdownService, ErrorModel) {
    var service = {
      getMonthlySummary: getMonthlySummary
    };
    return service;

    function getMonthlySummary(accountId, monthContext) {
      var deferred = $q.defer();

      $timeout(function () {
        if (accountId === 'ERROR') {
          deferred.reject(new ErrorModel('ERR_SERVER_ERROR', 500, 'Mock server error', null, true));
          return;
        }

        var mockApiResponse = {
          accountId: accountId,
          month: monthContext.requestedMonth,
          currencyCode: 'USD',
          totals: {
            totalAmount: 2450.75,
            transactionCount: 42
          },
          breakdown: {
            FOOD: 650.25,
            ONLINE: 900.0,
            TRAVEL: 550.5,
            OTHER: 349.99
          },
          dataFreshness: new Date().toISOString()
        };

        var summary = KpiService.computeKpisFromAggregates(
          mockApiResponse.accountId,
          mockApiResponse.month,
          mockApiResponse.totals,
          mockApiResponse.currencyCode
        );
        summary.dataFreshness = mockApiResponse.dataFreshness;

        var breakdown = BreakdownService.computeBreakdownFromAggregates(mockApiResponse.breakdown);

        deferred.resolve({ summary: summary, breakdown: breakdown });
      }, 500);

      return deferred.promise;
    }
  }

  angular.module('davmsApp')
    .service('SummaryMockService', SummaryMockService);
})();
