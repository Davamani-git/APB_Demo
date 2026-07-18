(function() {
  'use strict';

  function MonthlySummaryModelFactory() {
    function MonthlySummaryModel(data) {
      data = data || {};
      
      this.accountId = data.accountId || '';
      this.month = data.month || '';
      this.mode = data.mode || 'billing';
      this.currencyCode = data.currencyCode || 'USD';
      this.totalSpend = data.totalSpend || 0.0;
      this.transactionCount = data.transactionCount || 0;
      this.averageTransactionValue = data.averageTransactionValue || 0.0;
      this.dataFreshness = data.dataFreshness || {
        asOfDate: new Date().toISOString().split('T')[0],
        source: 'Unknown',
        isApproximate: true
      };
      
      // Validate and compute derived values
      if (this.transactionCount > 0 && this.totalSpend > 0) {
        this.averageTransactionValue = this.totalSpend / this.transactionCount;
      }
    }

    MonthlySummaryModel.prototype.isValid = function() {
      return this.accountId && 
             this.month && 
             this.month.match(/^\d{4}-\d{2}$/) &&
             this.totalSpend >= 0 &&
             this.transactionCount >= 0;
    };

    MonthlySummaryModel.prototype.hasData = function() {
      return this.totalSpend > 0 || this.transactionCount > 0;
    };

    return MonthlySummaryModel;
  }

  angular.module('davms.spendDashboard')
    .factory('MonthlySummaryModel', MonthlySummaryModelFactory);
})();