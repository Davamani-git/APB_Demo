(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .factory('BreakdownEntryModel', BreakdownEntryModel);

  function BreakdownEntryModel() {
    function BreakdownEntry(data) {
      data = data || {};
      this.categoryCode = data.categoryCode || '';
      this.categoryLabel = data.categoryLabel || '';
      this.amount = Number(data.amount || 0);
    }

    return BreakdownEntry;
  }
})();
