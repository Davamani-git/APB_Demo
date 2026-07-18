(function() {
  'use strict';

  SpendBreakdownMapperService.$inject = ['$filter'];

  function SpendBreakdownMapperService($filter) {
    var percentageFilter = $filter('percentageFormat');

    this.toChartSeries = function(breakdownModel) {
      if (!breakdownModel || !Array.isArray(breakdownModel.categories) || breakdownModel.categories.length === 0) {
        return [];
      }

      var labels = [];
      var data = [];

      breakdownModel.categories.forEach(function(category) {
        labels.push(category.label);
        data.push(category.amount);
      });

      return [{
        labels: labels,
        data: data,
        percentages: breakdownModel.categories.map(function(category) {
          return percentageFilter(category.percentage);
        })
      }];
    };

    this.toTiles = function(breakdownModel) {
      if (!breakdownModel || !Array.isArray(breakdownModel.categories)) {
        return [];
      }

      return breakdownModel.categories.map(function(category) {
        return {
          label: category.label,
          amount: category.amount,
          percentage: percentageFilter(category.percentage)
        };
      });
    };
  }

  angular.module('davms.spendDashboard')
    .service('SpendBreakdownMapperService', SpendBreakdownMapperService);
})();
