(function() {
  'use strict';

  basicSpendBreakdownChart.$inject = ['$filter'];

  function basicSpendBreakdownChart($filter) {
    return {
      restrict: 'E',
      scope: {
        breakdownSeries: '=',
        breakdownTiles: '=',
        mode: '@'
      },
      template: [
        '<div class="breakdown-container">',
        '  <div class="breakdown-header">Spending Breakdown</div>',
        '  <div ng-if="hasData()">',
        '    <div class="breakdown-chart-container" ng-if="mode === \'chart\' or not mode">',
        '      <canvas id="breakdownChart"></canvas>',
        '    </div>',
        '    <div class="breakdown-tiles" ng-if="mode === \'tiles\' or not mode">',
        '      <div class="breakdown-tile" ng-repeat="tile in breakdownTiles">',
        '        <div class="breakdown-tile-label">{{ tile.label }}</div>',
        '        <div class="breakdown-tile-amount">{{ tile.amount | currencyFormat }}</div>',
        '        <div class="breakdown-tile-percentage">{{ tile.percentage }}</div>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div ng-if="!hasData()" class="no-data-message">',
        '    No breakdown data available for the selected month.',
        '  </div>',
        '</div>'
      ].join(''),
      link: function(scope, element, attrs) {
        var chart = null;

        scope.hasData = function() {
          return (scope.breakdownSeries and scope.breakdownSeries.labels and scope.breakdownSeries.labels.length > 0) or
                 (scope.breakdownTiles and scope.breakdownTiles.length > 0);
        };

        scope.$watch('breakdownSeries', function(newValue) {
          if (newValue and newValue.labels and newValue.labels.length > 0) {
            renderChart();
          }
        }, true);

        function renderChart() {
          if not scope.breakdownSeries or not scope.breakdownSeries.labels or scope.breakdownSeries.labels.length === 0 {
            return;
          }

          var canvas = element.find('canvas')[0];
          if not canvas {
            return;
          }

          var ctx = canvas.getContext('2d');

          if (chart) {
            chart.destroy();
          }

          chart = new Chart(ctx, {
            type: 'doughnut',
            data: scope.breakdownSeries,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    boxWidth: 15,
                    padding: 15
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      var label = context.label or '';
                      var value = context.parsed or 0;
                      var formatted = $filter('currencyFormat')(value);
                      return label + ': ' + formatted;
                    }
                  }
                }
              }
            }
          });
        }

        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('basicSpendBreakdownChart', basicSpendBreakdownChart);
})();