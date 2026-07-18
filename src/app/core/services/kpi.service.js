(function () {
  'use strict';

  KpiService.$inject = ['MonthlySummaryModel'];

  function KpiService(MonthlySummaryModel) {
    var service = {
      computeKpisFromAggregates: computeKpisFromAggregates
    };
    return service;

    function computeKpisFromAggregates(accountId, month, totals, currencyCode) {
      var totalSpend = typeof totals.totalAmount === 'number' ? totals.totalAmount : 0;
      var transactionCount = typeof totals.transactionCount === 'number' ? totals.transactionCount : 0;
      var average = transactionCount > 0 ? parseFloat((totalSpend / transactionCount).toFixed(2)) : 0;

      return new MonthlySummaryModel({
        accountId: accountId,
        month: month,
        totalSpend: parseFloat(totalSpend.toFixed(2)),
        transactionCount: transactionCount,
        averageTransactionAmount: average,
        currencyCode: currencyCode || 'USD',
        dataFreshness: new Date().toISOString()
      });
    }
  }

  angular.module('davmsApp')
    .service('KpiService', KpiService);
})();
