(function() {
  'use strict';

  SpendBreakdownMapperService.$inject = ['$filter'];

  function SpendBreakdownMapperService($filter) {
    var self = this;

    self.toChartSeries = toChartSeries;
    self.toTiles = toTiles;

    function toChartSeries(breakdownModel) {
      if (!breakdownModel || !Array.isArray(breakdownModel.categories)) {
        return [];
      }
      var percentageFilter = $filter('percentageFormat');

      var labels = [];
      var data = [];
      var formattedPercentages = [];

      breakdownModel.categories.forEach(function(category) {
        labels.push(category.label);
        data.push(category.amount);
        formattedPercentages.push(percentageFilter(category.percentage));
      });

      return [{
        mode: breakdownModel.mode,
        labels: labels,
        data: data,
        formattedPercentages: formattedPercentages,
        totalAmount: breakdownModel.totalAmount
      }];
    }

    function toTiles(breakdownModel) {
      if (!breakdownModel || !Array.isArray(breakdownModel.categories)) {
        return [];
      }
      var currencyFilter = $filter('currencyFormat');
      var percentageFilter = $filter('percentageFormat');

      return breakdownModel.categories.map(function(category) {
        return {
          code: category.code,
          label: category.label,
          amountFormatted: currencyFilter(category.amount),
          percentageFormatted: percentageFilter(category.percentage)
        };
      });
    }
  }

  angular.module('davms.spendDashboard')
    .service('SpendBreakdownMapperService', SpendBreakdownMapperService);
})();
