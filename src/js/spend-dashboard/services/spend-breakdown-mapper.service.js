(function () {
  'use strict';

  SpendBreakdownMapperService.$inject = ['$filter'];

  function SpendBreakdownMapperService($filter) {
    var self = this;

    self.toChartSeries = function (breakdownModel) {
      if (!breakdownModel || !Array.isArray(breakdownModel.categories) || breakdownModel.categories.length === 0) {
        return [];
      }

      var percentageFormatter = $filter('percentageFormat');

      var labels = [];
      var data = [];

      breakdownModel.categories.forEach(function (c) {
        labels.push(c.label);
        data.push(c.amount);
      });

      return [{
        labels: labels,
        data: data,
        percentages: breakdownModel.categories.map(function (c) {
          return percentageFormatter(c.percentage);
        })
      }];
    };

    self.toTiles = function (breakdownModel) {
      if (!breakdownModel || !Array.isArray(breakdownModel.categories)) {
        return [];
      }

      var percentageFormatter = $filter('percentageFormat');

      return breakdownModel.categories.map(function (c) {
        return {
          label: c.label,
          amount: c.amount,
          percentage: percentageFormatter(c.percentage)
        };
      });
    };
  }

  angular.module('davms.spendDashboard')
    .service('SpendBreakdownMapperService', SpendBreakdownMapperService);
})();
