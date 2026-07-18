(function() {
  'use strict';

  function basicSpendBreakdownChart() {
    return {
      restrict: 'E',
      scope: {
        breakdownSeries: '=',
        mode: '@'
      },
      template: '\n        <div class="breakdown-chart-container" ng-if="hasData">\n          <canvas ng-if="displayChart" width="400" height="200"></canvas>\n          <div class="row" ng-if="!displayChart">\n            <div class="col-sm-3" ng-repeat="tile in tiles">\n              <div class="panel panel-default breakdown-tile">\n                <div class="panel-heading">{{tile.label}}</div>\n                <div class="panel-body">\n                  <div>{{tile.amountFormatted}}</div>\n                  <div>{{tile.percentageFormatted}}</div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div ng-if="!hasData">\n          <div class="alert alert-info">\n            A breakdown of your monthly spend is not available for the selected month.\n          </div>\n        </div>\n      ',
      link: function(scope, element) {
        scope.hasData = false;
        scope.displayChart = false;
        scope.tiles = [];

        scope.$watch('breakdownSeries', function(newVal) {
          if (!newVal || !newVal.length) {
            scope.hasData = false;
            return;
          }
          var series = newVal[0];
          if (!series.data || !series.data.length) {
            scope.hasData = false;
            return;
          }
          scope.hasData = true;

          scope.displayChart = scope.mode === 'chart';

          if (scope.displayChart) {
            var canvas = element.find('canvas')[0];
            if (canvas && window.Chart) {
              var ctx = canvas.getContext('2d');
              new window.Chart(ctx, {
                type: 'doughnut',
                data: {
                  labels: series.labels,
                  datasets: [{
                    data: series.data
                  }]
                },
                options: {
                  responsive: false,
                  legend: {
                    position: 'right'
                  }
                }
              });
            }
          } else {
            scope.tiles = [];
            series.labels.forEach(function(label, index) {
              var amount = series.data[index];
              var percentage = series.formattedPercentages[index];
              scope.tiles.push({
                label: label,
                amountFormatted: amount,
                percentageFormatted: percentage
              });
            });
          }
        }, true);
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('basicSpendBreakdownChart', basicSpendBreakdownChart);
})();
