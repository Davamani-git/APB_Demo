(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('MonthlySummaryService', MonthlySummaryService);

  MonthlySummaryService.$inject = ['$http', '$q', 'ApiEndpointService', 'EnvConfigService', 'MockDataService', 'KpiComputationService', 'BreakdownService', 'MonthSelectionService', 'MonthlySummaryModel', 'ErrorModel'];

  function MonthlySummaryService($http, $q, ApiEndpointService, EnvConfigService, MockDataService, KpiComputationService, BreakdownService, MonthSelectionService, MonthlySummaryModel, ErrorModel) {

    this.getAvailableMonths = function(accountId) {
      if (EnvConfigService.isMockMode()) {
        return MockDataService.getAvailableMonths(accountId).then(function(response) {
          return response.data;
        });
      }
      var url = ApiEndpointService.getAvailableMonthsUrl(accountId);
      return $http.get(url, { timeout: EnvConfigService.getConfig().apiTimeoutMs })
        .then(function(response) {
          return response.data;
        });
    };

    this.getMonthlySummary = function(accountId, month) {
      var config = EnvConfigService.getConfig();

      if (!MonthSelectionService.isValidMonth(month, config.maxLookbackMonths)) {
        return $q.reject(new ErrorModel({
          statusCode: 400,
          technicalMessage: 'Invalid month selection',
          userMessage: 'Selected month is out of allowed range.',
          retryable: false
        }));
      }

      var promise;

      if (EnvConfigService.isMockMode()) {
        promise = MockDataService.getMonthlySummary(accountId, month);
      } else {
        var url = ApiEndpointService.getMonthlySummaryUrl(accountId, month);
        promise = $http.get(url, { timeout: config.apiTimeoutMs });
      }

      return promise.then(function(response) {
        var data = response.data;
        var aggregates = data.aggregates || [];
        var breakdownEntries = BreakdownService.buildBreakdownEntries(data.breakdownEntries);
        var kpiSummary = KpiComputationService.computeKpis(aggregates, breakdownEntries);

        var summary = new MonthlySummaryModel({
          accountId: data.accountId,
          month: data.month,
          totalSpend: kpiSummary.totalSpend,
          transactionCount: kpiSummary.transactionCount,
          averageTransactionValue: kpiSummary.averageTransactionValue,
          topCategoryLabel: kpiSummary.topCategoryLabel,
          topCategoryAmount: kpiSummary.topCategoryAmount,
          breakdownEntries: breakdownEntries
        });

        return summary;
      });
    };
  }
})();
