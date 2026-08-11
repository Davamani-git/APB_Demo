(function() {
  'use strict';
  angular.module('app.insights')
    .directive('spendingPatternChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<canvas id="spendingChart" width="400" height="200"></canvas>',
        link: function(scope, element) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          scope.$watch('data', function(data) {
            if (data && window.Chart) {
              new Chart(ctx, {
                type: 'line',
                data: {
                  labels: data.labels || [],
                  datasets: [{
                    label: 'Spending',
                    data: data.values || [],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false
                }
              });
            }
          });
        }
      };
    }]);
})();