(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .factory('KpiSummaryModel', KpiSummaryModel);

  function KpiSummaryModel() {
    function KpiSummary(data) {
      data = data || {};
      this.totalSpend = Number(data.totalSpend || 0);
      this.transactionCount = Number(data.transactionCount || 0);
      this.averageTransactionValue = Number(data.averageTransactionValue || 0);
      this.topCategoryLabel = data.topCategoryLabel || '';
      this.topCategoryAmount = Number(data.topCategoryAmount || 0);
    }

    return KpiSummary;
  }
})();
