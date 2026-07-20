(function () {
  'use strict';

  angular.module('apbDemo')
    .factory('MonthlySummaryModel', MonthlySummaryModelFactory);

  MonthlySummaryModelFactory.$inject = [];

  function MonthlySummaryModelFactory() {
    function MonthlySummaryModel(data) {
      this.month = data.month || '';
      this.currency = data.currency || '';
      this.totalSpend = typeof data.totalSpend === 'number' ? data.totalSpend : 0;
      this.transactionCount = typeof data.transactionCount === 'number' ? data.transactionCount : 0;
      this.isFinal = !!data.isFinal;
      this.isCurrent = !!data.isCurrent;
      this.breakdownAvailable = !!data.breakdownAvailable;
    }

    return MonthlySummaryModel;
  }
})();
