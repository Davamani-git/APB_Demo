(function() {
  'use strict';

  MonthlySummaryModelFactory.$inject = [];

  function MonthlySummaryModelFactory() {
    function MonthlySummaryModel(raw) {
      raw = raw || {};

      this.accountId = raw.accountId || '';
      this.month = raw.month || '';
      this.mode = raw.mode || 'billing';
      this.currencyCode = raw.currencyCode || '';
      this.totalSpend = typeof raw.totalSpend === 'number' ? raw.totalSpend : 0.0;
      this.transactionCount = typeof raw.transactionCount === 'number' ? raw.transactionCount : 0;
      this.averageTransactionValue = typeof raw.averageTransactionValue === 'number'
        ? raw.averageTransactionValue
        : (this.transactionCount > 0 ? this.totalSpend / this.transactionCount : 0.0);
      this.dataFreshness = raw.dataFreshness || {
        asOfDate: '',
        source: '',
        isApproximate: true
      };
    }

    MonthlySummaryModel.prototype.hasActivity = function() {
      return this.transactionCount > 0 && this.totalSpend > 0;
    };

    return function(raw) {
      return new MonthlySummaryModel(raw);
    };
  }

  angular.module('davms.spendDashboard')
    .factory('MonthlySummaryModel', MonthlySummaryModelFactory);
})();
