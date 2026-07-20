(function () {
  'use strict';

  angular.module('apbDemo')
    .factory('MonthlySummaryModel', MonthlySummaryModelFactory);

  MonthlySummaryModelFactory.$inject = [];

  function MonthlySummaryModelFactory() {
    function MonthlySummaryModel(data) {
      this.month = data && data.month || '';
      this.currency = data && data.currency || 'USD';
      this.totalSpend = data && typeof data.totalSpend === 'number' ? data.totalSpend : 0;
      this.transactionCount = data && typeof data.transactionCount === 'number' ? data.transactionCount : 0;
      this.isFinal = !!(data && data.isFinal);
      this.isCurrent = !!(data && data.isCurrent);
      this.breakdownAvailable = !!(data && data.breakdownAvailable);
    }

    return MonthlySummaryModel;
  }
})();
