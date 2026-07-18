(function() {
  'use strict';

  function MonthlySummaryModelFactory() {
    function MonthlySummaryModel(data) {
      data = data || {};

      this.accountId = data.accountId || '';
      this.month = data.month || '';
      this.mode = data.mode || 'billing';
      this.currencyCode = data.currencyCode || 'USD';

      this.totalSpend = sanitizeNumber(data.totalSpend, 0.0);
      this.transactionCount = sanitizeNumber(data.transactionCount, 0);
      this.averageTransactionValue = sanitizeNumber(data.averageTransactionValue, 0.0);

      var freshness = data.dataFreshness || {};
      this.dataFreshness = {
        asOfDate: freshness.asOfDate || '',
        source: freshness.source || '',
        isApproximate: typeof freshness.isApproximate === 'boolean' ? freshness.isApproximate : true
      };

      if (this.transactionCount > 0 && this.totalSpend >= 0 && this.averageTransactionValue === 0) {
        this.averageTransactionValue = this.totalSpend / this.transactionCount;
      }
    }

    MonthlySummaryModel.prototype.isValid = function() {
      return !!this.accountId && /^\d{4}-\d{2}$/.test(this.month) && this.totalSpend >= 0 && this.transactionCount >= 0;
    };

    function sanitizeNumber(value, defaultValue) {
      if (typeof value === 'number' && !isNaN(value)) {
        return value;
      }
      if (typeof value === 'string') {
        var parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
      return defaultValue;
    }

    function createFromResponse(response) {
      return new MonthlySummaryModel(response || {});
    }

    return {
      createFromResponse: createFromResponse
    };
  }

  angular.module('davms.spendDashboard')
    .factory('MonthlySummaryModel', MonthlySummaryModelFactory);
})();
