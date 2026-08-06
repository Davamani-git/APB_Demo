(function() {
  'use strict';
  angular.module('shoppingPlatform').directive('chartDirective', [function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '@'
      },
      template: '<canvas id="myChart" width="400" height="200"></canvas>',
      link: function(scope, element, attrs) {
        var ctx = element.find('canvas')[0].getContext('2d');
        var chart = null;
        scope.$watch('chartData', function(newVal) {
          if (newVal && ctx) {
            if (chart) {
              chart.destroy();
            }
            chart = new Chart(ctx, {
              type: scope.chartType || 'line',
              data: newVal,
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }
            });
          }
        });
        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }]);
})();