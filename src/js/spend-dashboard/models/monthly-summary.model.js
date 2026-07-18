(function() {
  'use strict';

  MonthlySummaryModelFactory.$inject = [];

  function MonthlySummaryModelFactory() {
    function MonthlySummaryModel(data) {
      data = data || {};

      this.accountId = data.accountId || '';
      this.month = data.month || '';
      this.mode = data.mode || 'billing';
      this.currencyCode = data.currencyCode || 'USD';
      this.totalSpend = parseFloat(data.totalSpend) || 0.0;
      this.transactionCount = parseInt(data.transactionCount) || 0;
      this.averageTransactionValue = parseFloat(data.averageTransactionValue) || 0.0;
      this.dataFreshness = data.dataFreshness || {
        asOfDate: new Date().toISOString().split('T')[0],
        source: 'Unknown',
        isApproximate: true
      };

      if (this.transactionCount > 0 && this.averageTransactionValue === 0) {
        this.averageTransactionValue = this.totalSpend / this.transactionCount;
      }
    }

    MonthlySummaryModel.prototype.isValid = function() {
      return this.accountId && this.month && this.totalSpend >= 0 && this.transactionCount >= 0;
    };

    return MonthlySummaryModel;
  }

  angular.module('davms.spendDashboard')
    .factory('MonthlySummaryModel', MonthlySummaryModelFactory);
})();