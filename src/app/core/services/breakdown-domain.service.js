(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .service('BreakdownDomainService', BreakdownDomainService);

  BreakdownDomainService.$inject = ['BreakdownItemModel'];

  function BreakdownDomainService(BreakdownItemModel) {
    var self = this;

    // aggregates is expected to be an array of { categoryCode, categoryLabel, amount }
    self.computeBreakdown = function(aggregates) {
      if (!Array.isArray(aggregates) || aggregates.length === 0) {
        return [];
      }

      var total = 0;
      aggregates.forEach(function(a) {
        if (a && typeof a.amount === 'number') {
          total += a.amount;
        }
      });

      if (total <= 0) {
        return [];
      }

      var items = aggregates.map(function(a) {
        var percentage = (a.amount / total) * 100;
        return new BreakdownItemModel({
          categoryCode: a.categoryCode || '',
          categoryLabel: a.categoryLabel || '',
          amount: a.amount || 0,
          percentage: percentage
        });
      });

      return items;
    };
  }
})();
