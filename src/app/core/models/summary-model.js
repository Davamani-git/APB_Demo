(function () {
  'use strict';

  function MonthlySummaryModel(data) {
    data = data || {};
    this.accountId = data.accountId || '';
    this.month = data.month || '';
    this.totalSpend = typeof data.totalSpend === 'number' ? data.totalSpend : 0;
    this.transactionCount = typeof data.transactionCount === 'number' ? data.transactionCount : 0;
    this.averageTransactionAmount = typeof data.averageTransactionAmount === 'number' ? data.averageTransactionAmount : 0;
    this.currencyCode = data.currencyCode || 'USD';
    this.dataFreshness = data.dataFreshness || null;
  }

  angular.module('davmsApp')
    .factory('MonthlySummaryModel', function () {
      return MonthlySummaryModel;
    });
})();
