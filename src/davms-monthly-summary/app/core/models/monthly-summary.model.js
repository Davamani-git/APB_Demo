(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .factory('MonthlySummaryModel', MonthlySummaryModel);

  MonthlySummaryModel.$inject = ['BreakdownEntryModel'];

  function MonthlySummaryModel(BreakdownEntryModel) {
    function MonthlySummary(data) {
      data = data || {};
      this.accountId = data.accountId || '';
      this.month = data.month || '';
      this.totalSpend = Number(data.totalSpend || 0);
      this.transactionCount = Number(data.transactionCount || 0);
      this.averageTransactionValue = Number(data.averageTransactionValue || 0);
      this.topCategoryLabel = data.topCategoryLabel || '';
      this.topCategoryAmount = Number(data.topCategoryAmount || 0);
      this.breakdownEntries = Array.isArray(data.breakdownEntries)
        ? data.breakdownEntries.map(function(entry) { return new BreakdownEntryModel(entry); })
        : [];
    }

    MonthlySummary.prototype.isEmpty = function() {
      return this.transactionCount === 0;
    };

    return MonthlySummary;
  }
})();
