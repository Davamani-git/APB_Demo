(function() {
  'use strict';

  function SpendBreakdownMapperService($filter) {
    var service = {
      toChartSeries: toChartSeries,
      toTiles: toTiles
    };

    return service;

    function toChartSeries(breakdownModel) {
      if (!breakdownModel || !breakdownModel.categories || !breakdownModel.categories.length) {
        return [];
      }

      var percentageFilter = $filter('percentageFormat');

      var labels = [];
      var data = [];
      var tooltips = [];

      breakdownModel.categories.forEach(function(category) {
        labels.push(category.label);
        data.push(category.amount);
        tooltips.push(percentageFilter(category.percentage));
      });

      return [{
        labels: labels,
        data: data,
        tooltips: tooltips,
        currencyCode: breakdownModel.currencyCode || ''
      }];
    }

    function toTiles(breakdownModel) {
      if (!breakdownModel || !breakdownModel.categories || !breakdownModel.categories.length) {
        return [];
      }

      var percentageFilter = $filter('percentageFormat');
      var tiles = [];

      breakdownModel.categories.forEach(function(category) {
        tiles.push({
          code: category.code,
          label: category.label,
          amount: category.amount,
          percentage: percentageFilter(category.percentage)
        });
      });

      return tiles;
    }
  }

  SpendBreakdownMapperService.$inject = ['$filter'];

  angular.module('davms.spendDashboard')
    .service('SpendBreakdownMapperService', SpendBreakdownMapperService);
})();
