(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('BreakdownService', BreakdownService);

  BreakdownService.$inject = ['BreakdownEntryModel'];

  function BreakdownService(BreakdownEntryModel) {
    this.buildBreakdownEntries = function(rawEntries) {
      rawEntries = rawEntries || [];
      return rawEntries.map(function(entry) {
        return new BreakdownEntryModel({
          categoryCode: entry.categoryCode,
          categoryLabel: entry.categoryLabel,
          amount: entry.amount
        });
      });
    };
  }
})();
