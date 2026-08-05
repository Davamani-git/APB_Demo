(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .directive('summaryChart', [function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          title: '@'
        },
        template: '<div class="summary-chart"><h4 ng-bind="title"></h4><canvas></canvas></div>',
        link: function (scope, element) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          var chartInstance = null;

          function renderChart() {
            if (!scope.data || !angular.isArray(scope.data)) {
              return;
            }
            var labels = scope.data.map(function (item) { return item.label; });
            var values = scope.data.map(function (item) { return item.value; });

            if (chartInstance) {
              chartInstance.destroy();
            }

            chartInstance = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: scope.title,
                  data: values,
                  borderColor: '#337ab7',
                  backgroundColor: 'rgba(51,122,183,0.2)',
                  fill: true
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            });
          }

          scope.$watch('data', function () {
            renderChart();
          }, true);
        }
      };
    }]);
})();
