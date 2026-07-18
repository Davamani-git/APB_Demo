(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('KpiComputationService', KpiComputationService);

  KpiComputationService.$inject = ['KpiSummaryModel'];

  function KpiComputationService(KpiSummaryModel) {
    this.computeKpis = function(transactionsOrAggregates, breakdownEntries) {
      var totalSpend = 0;
      var transactionCount = 0;

      transactionsOrAggregates.forEach(function(item) {
        totalSpend += Number(item.amount || 0);
        transactionCount += Number(item.count || 0);
      });

      var averageTransactionValue = transactionCount > 0 ? (totalSpend / transactionCount) : 0;

      var topCategoryLabel = '';
      var topCategoryAmount = 0;

      if (Array.isArray(breakdownEntries)) {
        breakdownEntries.forEach(function(entry) {
          if (Number(entry.amount) > topCategoryAmount) {
            topCategoryAmount = Number(entry.amount);
            topCategoryLabel = entry.categoryLabel;
          }
        });
      }

      return new KpiSummaryModel({
        totalSpend: totalSpend,
        transactionCount: transactionCount,
        averageTransactionValue: averageTransactionValue,
        topCategoryLabel: topCategoryLabel,
        topCategoryAmount: topCategoryAmount
      });
    };
  }
})();
