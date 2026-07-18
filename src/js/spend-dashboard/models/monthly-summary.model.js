(function () {
  'use strict';

  function MonthlySummaryModel(data) {
    var self = this;

    data = data || {};

    self.accountId = data.accountId || '';
    self.month = data.month || '';
    self.mode = data.mode || 'billing';
    self.currencyCode = data.currencyCode || '';

    var totalSpend = typeof data.totalSpend === 'number' ? data.totalSpend : 0.0;
    var transactionCount = typeof data.transactionCount === 'number' ? data.transactionCount : 0;
    var averageTransactionValue = typeof data.averageTransactionValue === 'number' ? data.averageTransactionValue : 0.0;

    if (transactionCount > 0 && totalSpend >= 0) {
      averageTransactionValue = totalSpend / transactionCount;
    }

    self.totalSpend = totalSpend;
    self.transactionCount = transactionCount;
    self.averageTransactionValue = averageTransactionValue;

    var dataFreshness = data.dataFreshness || {};
    self.dataFreshness = {
      asOfDate: dataFreshness.asOfDate || '',
      source: dataFreshness.source || '',
      isApproximate: typeof dataFreshness.isApproximate === 'boolean' ? dataFreshness.isApproximate : true
    };
  }

  function MonthlySummaryModelFactory() {
    return {
      create: function (data) {
        return new MonthlySummaryModel(data);
      }
    };
  }

  angular.module('davms.spendDashboard')
    .factory('MonthlySummaryModel', MonthlySummaryModelFactory);
})();
