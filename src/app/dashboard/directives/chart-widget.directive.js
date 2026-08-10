(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .directive('chartWidget', ['analyticsService', function(analyticsService) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          type: '@'
        },
        template: '<div class="chart-container"><canvas id="chart-{{chartId}}" class="chart chart-{{type}}" chart-data="chartData" chart-labels="chartLabels" chart-series="chartSeries" chart-options="chartOptions"></canvas></div>',
        link: function(scope, element, attrs) {
          scope.chartId = Math.random().toString(36).substr(2, 9);
          scope.chartData = [];
          scope.chartLabels = [];
          scope.chartSeries = [];
          scope.chartOptions = {
            responsive: true,
            maintainAspectRatio: false
          };
          scope.$watch('data', function(newData) {
            if (!newData) return;
            if (scope.type === 'line' && Array.isArray(newData)) {
              scope.chartLabels = newData.map(function(d) {
                return d.month || d.period;
              });
              scope.chartData = [newData.map(function(d) {
                return d.spend || d.value;
              })];
              scope.chartSeries = ['Spend'];
            } else if (scope.type === 'pie' && typeof newData === 'object') {
              scope.chartLabels = Object.keys(newData);
              scope.chartData = Object.values(newData);
            }
          }, true);
        }
      };
    }]);
})();