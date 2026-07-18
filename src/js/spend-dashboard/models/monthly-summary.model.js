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

      var totalSpend = typeof raw.totalSpend === 'number' ? raw.totalSpend : 0.0;
      var transactionCount = typeof raw.transactionCount === 'number' ? raw.transactionCount : 0;
      var averageTransactionValue = typeof raw.averageTransactionValue === 'number' ? raw.averageTransactionValue : 0.0;

      if (transactionCount > 0 && totalSpend >= 0) {
        averageTransactionValue = totalSpend / transactionCount;
      }

      this.totalSpend = totalSpend;
      this.transactionCount = transactionCount;
      this.averageTransactionValue = averageTransactionValue;

      var dataFreshness = raw.dataFreshness || {};
      this.dataFreshness = {
        asOfDate: dataFreshness.asOfDate || '',
        source: dataFreshness.source || '',
        isApproximate: typeof dataFreshness.isApproximate === 'boolean' ? dataFreshness.isApproximate : true
      };

      validate(this);
    }

    function validate(model) {
      if (!model.accountId || typeof model.accountId !== 'string') {
        model.accountId = '';
      }
      if (typeof model.month !== 'string' || !/^\d{4}-\d{2}$/.test(model.month)) {
        model.month = '';
      }
      if (model.totalSpend < 0) {
        model.totalSpend = 0.0;
      }
      if (model.transactionCount < 0) {
        model.transactionCount = 0;
      }
      if (model.averageTransactionValue < 0) {
        model.averageTransactionValue = 0.0;
      }
    }

    return function(raw) {
      return new MonthlySummaryModel(raw);
    };
  }

  angular.module('davms.spendDashboard')
    .factory('MonthlySummaryModel', MonthlySummaryModelFactory);
})();
