(function() {
  'use strict';

  function SpendBreakdownMapperService($filter) {
    var categoryColors = [
      '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1',
      '#fd7e14', '#20c997', '#e83e8c', '#6c757d', '#17a2b8'
    ];

    function toChartSeries(breakdownModel) {
      if (!breakdownModel || !breakdownModel.hasData()) {
        return {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
          }]
        };
      }

      var labels = [];
      var data = [];
      var backgroundColor = [];
      var borderColor = [];

      breakdownModel.categories.forEach(function(category, index) {
        labels.push(category.label);
        data.push(category.amount);
        
        var color = categoryColors[index % categoryColors.length];
        backgroundColor.push(color);
        borderColor.push(color);
      });

      return {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1
        }]
      };
    }

    function toTiles(breakdownModel) {
      if (!breakdownModel || !breakdownModel.hasData()) {
        return [];
      }

      return breakdownModel.categories.map(function(category, index) {
        return {
          category: category.label,
          amount: $filter('currencyFormat')(category.amount),
          percentage: $filter('percentageFormat')(category.percentage / 100),
          color: categoryColors[index % categoryColors.length],
          code: category.code
        };
      });
    }

    return {
      toChartSeries: toChartSeries,
      toTiles: toTiles
    };
  }

  SpendBreakdownMapperService.$inject = ['$filter'];

  angular.module('davms.spendDashboard')
    .service('SpendBreakdownMapperService', SpendBreakdownMapperService);
})();