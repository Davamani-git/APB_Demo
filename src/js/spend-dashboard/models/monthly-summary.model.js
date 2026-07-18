(function() {
  'use strict';

  function MonthlySummaryModelFactory() {
    function MonthlySummaryModel(raw) {
      raw = raw || {};

      this.accountId = typeof raw.accountId === 'string' ? raw.accountId : '';
      this.month = typeof raw.month === 'string' ? raw.month : '';
      this.mode = typeof raw.mode === 'string' ? raw.mode : 'billing';
      this.currencyCode = typeof raw.currencyCode === 'string' ? raw.currencyCode : '';

      var totalSpend = typeof raw.totalSpend === 'number' ? raw.totalSpend : 0.0;
      var transactionCount = typeof raw.transactionCount === 'number' ? raw.transactionCount : 0;
      var averageTransactionValue = typeof raw.averageTransactionValue === 'number' ? raw.averageTransactionValue : 0.0;

      if (totalSpend < 0) {
        totalSpend = 0.0;
      }
      if (transactionCount < 0) {
        transactionCount = 0;
      }

      this.totalSpend = totalSpend;
      this.transactionCount = transactionCount;

      if (transactionCount > 0 && totalSpend >= 0) {
        this.averageTransactionValue = totalSpend / transactionCount;
      } else {
        this.averageTransactionValue = averageTransactionValue;
      }

      var dataFreshness = raw.dataFreshness || {};
      this.dataFreshness = {
        asOfDate: typeof dataFreshness.asOfDate === 'string' ? dataFreshness.asOfDate : '',
        source: typeof dataFreshness.source === 'string' ? dataFreshness.source : '',
        isApproximate: typeof dataFreshness.isApproximate === 'boolean' ? dataFreshness.isApproximate : true
      };

      // Basic validation for month format: YYYY-MM
      if (!/^\d{4}-\d{2}$/.test(this.month)) {
        this.month = '';
        this.dataFreshness.isApproximate = true;
      }

      if (!this.accountId) {
        this.dataFreshness.isApproximate = true;
      }

      if (this.totalSpend < 0) {
        this.totalSpend = 0.0;
      }
      if (this.transactionCount < 0) {
        this.transactionCount = 0;
      }
    }

    return function(raw) {
      return new MonthlySummaryModel(raw);
    };
  }

  angular.module('davms.spendDashboard')
    .factory('MonthlySummaryModel', MonthlySummaryModelFactory);
})();
