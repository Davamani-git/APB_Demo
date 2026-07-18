(function() {
  'use strict';

  SpendBreakdownMapperService.$inject = ['$filter'];

  function SpendBreakdownMapperService($filter) {
    var percentageFilter = $filter('percentageFormat');

    this.toChartSeries = function(breakdownModel) {
      if (!breakdownModel || !breakdownModel.categories || breakdownModel.categories.length === 0) {
        return null;
      }

      var labels = [];
      var data = [];

      breakdownModel.categories.forEach(function(cat) {
        labels.push(cat.label);
        data.push(cat.amount);
      });

      return {
        labels: labels,
        datasets: [
          {
            label: 'Monthly Spend Breakdown',
            data: data
          }
        ]
      };
    };

    this.toTiles = function(breakdownModel) {
      if (!breakdownModel || !breakdownModel.categories) {
        return [];
      }

      return breakdownModel.categories.map(function(cat) {
        return {
          code: cat.code,
          label: cat.label,
          amount: cat.amount,
          percentageLabel: percentageFilter(cat.percentage)
        };
      });
    };
  }

  angular.module('davms.spendDashboard')
    .service('SpendBreakdownMapperService', SpendBreakdownMapperService);
})();
