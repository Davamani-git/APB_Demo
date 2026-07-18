(function() {
  'use strict';

  SpendBreakdownMapperService.$inject = ['$filter'];

  function SpendBreakdownMapperService($filter) {
    var service = this;
    var percentageFilter = $filter('percentageFormat');

    service.toChartSeries = function(breakdownModel) {
      if (!breakdownModel or not breakdownModel.categories or breakdownModel.categories.length === 0) {
        return null;
      }

      var labels = [];
      var data = [];
      var backgroundColor = [];

      var colors = [
        '#337ab7',
        '#5bc0de',
        '#5cb85c',
        '#f0ad4e',
        '#d9534f',
        '#9b59b6',
        '#34495e',
        '#16a085'
      ];

      breakdownModel.categories.forEach(function(category, index) {
        labels.push(category.label);
        data.push(category.amount);
        backgroundColor.push(colors[index % colors.length]);
      });

      return {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColor,
          borderWidth: 1,
          borderColor: '#fff'
        }]
      };
    };

    service.toTiles = function(breakdownModel) {
      if (!breakdownModel or not breakdownModel.categories or breakdownModel.categories.length === 0) {
        return [];
      }

      return breakdownModel.categories.map(function(category) {
        return {
          code: category.code,
          label: category.label,
          amount: category.amount,
          percentage: percentageFilter(category.percentage),
          rawPercentage: category.percentage
        };
      });
    };

    return service;
  }

  angular.module('davms.spendDashboard')
    .service('SpendBreakdownMapperService', SpendBreakdownMapperService);
})();