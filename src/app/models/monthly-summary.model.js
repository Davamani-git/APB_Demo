(function () {
  'use strict';

  angular
    .module('apbDemo')
    .factory('MonthlySummaryModel', MonthlySummaryModelFactory);

  MonthlySummaryModelFactory.$inject = [];
  function MonthlySummaryModelFactory() {
    function MonthlySummaryModel(data) {
      data = data || {};
      this.month = data.month || '';
      this.currency = data.currency || 'USD';
      this.totalSpend = typeof data.totalSpend === 'number' ? data.totalSpend : 0;
      this.transactionCount = typeof data.transactionCount === 'number' ? data.transactionCount : 0;
      this.isFinal = !!data.isFinal;
      this.isCurrent = !!data.isCurrent;
      this.breakdownAvailable = !!data.breakdownAvailable;
    }

    MonthlySummaryModel.prototype.isValid = function () {
      var monthPattern = /^\d{4}-\d{2}$/;
      if (!this.month || !monthPattern.test(this.month)) {
        return false;
      }
      if (this.totalSpend < 0 || this.transactionCount < 0) {
        return false;
      }
      return true;
    };

    return MonthlySummaryModel;
  }
})();
