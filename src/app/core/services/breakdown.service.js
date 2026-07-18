(function () {
  'use strict';

  BreakdownService.$inject = ['BreakdownModel'];

  function BreakdownService(BreakdownModel) {
    var service = {
      computeBreakdownFromAggregates: computeBreakdownFromAggregates
    };
    return service;

    function computeBreakdownFromAggregates(aggregates) {
      var agg = aggregates || {};
      var categories = [];
      var keys = Object.keys(agg);
      var total = keys.reduce(function (sum, key) {
        return sum + (typeof agg[key] === 'number' ? agg[key] : 0);
      }, 0);

      keys.forEach(function (key) {
        var amount = typeof agg[key] === 'number' ? agg[key] : 0;
        var percentage = total > 0 ? parseFloat(((amount / total) * 100).toFixed(2)) : 0;
        var label = mapCategoryLabel(key);
        categories.push({
          code: key,
          label: label,
          amount: parseFloat(amount.toFixed(2)),
          percentage: percentage
        });
      });

      return new BreakdownModel({ categories: categories });
    }

    function mapCategoryLabel(code) {
      switch (code) {
        case 'FOOD': return 'Food & Dining';
        case 'ONLINE': return 'Online Purchases';
        case 'TRAVEL': return 'Travel';
        case 'OTHER': return 'Other';
        default: return code;
      }
    }
  }

  angular.module('davmsApp')
    .service('BreakdownService', BreakdownService);
})();
