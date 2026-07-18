(function() {
  'use strict';

  function basicSpendBreakdownChart() {
    return {
      restrict: 'E',
      scope: {
        breakdownSeries: '=',
        breakdownTiles: '=',
        mode: '@'
      },
      template: [
        '<div class="breakdown-section">',
          '<h3>Spending Breakdown</h3>',
          '<div ng-if="!breakdownSeries || !breakdownSeries.labels || breakdownSeries.labels.length === 0" class="no-data-banner">',
            'No breakdown data available for the selected month.',
          '</div>',
          '<div ng-if="breakdownSeries && breakdownSeries.labels && breakdownSeries.labels.length > 0">',
            '<div class="breakdown-chart" ng-if="mode === \"chart\"">',
              '<canvas id="spendChart-{{ $id }}" width="400" height="400"></canvas>',
            '</div>',
            '<div class="breakdown-tiles" ng-if="mode !== \"chart\"">',
              '<div class="breakdown-tile" ng-repeat="tile in breakdownTiles" ng-style="{\"border-left-color\": tile.color}">',
                '<div class="category">{{ tile.category }}</div>',
                '<div class="amount">{{ tile.amount }} <span class="percentage">{{ tile.percentage }}</span></div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>'
      ].join(''),
      link: function(scope, element, attrs) {
        var chart = null;
        var chartId = 'spendChart-' + scope.$id;
        
        function createChart() {
          if (scope.mode === 'chart' && scope.breakdownSeries && scope.breakdownSeries.labels && scope.breakdownSeries.labels.length > 0) {
            var canvas = element.find('#' + chartId)[0];
            if (canvas && window.Chart) {
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
                      position: 'bottom'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          var label = context.label || '';
                          var value = context.parsed || 0;
                          var total = context.dataset.data.reduce(function(sum, val) { return sum + val; }, 0);
                          var percentage = ((value / total) * 100).toFixed(1);
                          return label + ': $' + value.toFixed(2) + ' (' + percentage + '%)';
                        }
                      }
                    }
                  }
                }
              });
            }
          }
        }
        
        scope.$watch('breakdownSeries', function(newData) {
          if (newData) {
            setTimeout(createChart, 100); // Allow DOM to update
          }
        }, true);
        
        scope.$watch('mode', function() {
          setTimeout(createChart, 100);
        });
        
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