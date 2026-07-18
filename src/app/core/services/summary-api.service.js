(function () {
  'use strict';

  SummaryApiService.$inject = ['$http', '$q', 'ConfigService', 'MonthSelectionService', 'KpiService', 'BreakdownService', 'SummaryMockService'];

  function SummaryApiService($http, $q, ConfigService, MonthSelectionService, KpiService, BreakdownService, SummaryMockService) {
    var service = {
      getMonthlySummary: getMonthlySummary
    };
    return service;

    function getMonthlySummary(accountId, month) {
      var deferred = $q.defer();

      var monthContext;
      try {
        monthContext = MonthSelectionService.resolveMonthContext(month);
      } catch (e) {
        deferred.reject(e);
        return deferred.promise;
      }

      if (ConfigService.isMockMode()) {
        SummaryMockService.getMonthlySummary(accountId, monthContext)
          .then(function (result) { deferred.resolve(result); })
          .catch(function (err) { deferred.reject(err); });
      } else {
        var env = ConfigService.getEnvConfig();
        var url = env.apiBaseUrl + '/summary';

        $http({
          method: 'GET',
          url: url,
          params: {
            accountId: accountId,
            month: month
          },
          timeout: env.apiTimeoutMs
        }).then(function (response) {
          var data = response.data || {};
          var totals = data.totals || {};
          var summary = KpiService.computeKpisFromAggregates(
            data.accountId,
            data.month,
            {
              totalAmount: totals.totalAmount,
              transactionCount: totals.transactionCount
            },
            data.currencyCode
          );

          // Override freshness if provided by API
          summary.dataFreshness = data.dataFreshness || summary.dataFreshness;

          var breakdown = BreakdownService.computeBreakdownFromAggregates(data.breakdown || {});
          deferred.resolve({ summary: summary, breakdown: breakdown });
        }).catch(function (err) {
          deferred.reject(err);
        });
      }

      return deferred.promise;
    }
  }

  angular.module('davmsApp')
    .service('SummaryApiService', SummaryApiService);
})();
