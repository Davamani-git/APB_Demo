(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .directive('chartDirective', ['analyticsService', function(analyticsService) {
      return {
        restrict: 'E',
        template: '<canvas id="salesChart" width="400" height="200"></canvas>',
        scope: {
          data: '='
        },
        link: function(scope, element, attrs) {
          var ctx = element.find('canvas')[0].getContext('2d');
          var chart = null;
          scope.$watch('data', function(newData) {
            if (!newData) return;
            if (chart) {
              chart.destroy();
            }
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: newData.labels || [],
                datasets: [{
                  label: 'Sales',
                  data: newData.values || [],
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            });
          });
        }
      };
    }]);
})();