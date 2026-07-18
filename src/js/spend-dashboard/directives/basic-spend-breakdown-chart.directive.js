(function() {
  'use strict';

  function basicSpendBreakdownChart() {
    return {
      restrict: 'E',
      scope: {
        breakdownSeries: '<',
        mode: '<'
      },
      template: '<div class="breakdown-chart-container">' +
        '<canvas ng-if="useChart" id="davms-breakdown-chart"></canvas>' +
        '<div class="row" ng-if="!useChart">' +
        '<div class="col-sm-4" ng-repeat="tile in tiles">' +
        '<div class="panel panel-default">' +
        '<div class="panel-heading">{{tile.label}}</div>' +
        '<div class="panel-body">' +
        '<div>{{tile.amount | currencyFormat:currencyCode}}</div>' +
        '<div>{{tile.percentage}}</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="breakdown-message" ng-if="!hasData">' +
        '<p>The basic breakdown of monthly spend is not available for the selected month.</p>' +
        '</div>' +
        '</div>',
      link: function(scope) {
        scope.useChart = scope.mode === 'chart';
        scope.tiles = [];
        scope.currencyCode = '';
        scope.hasData = false;

        scope.$watch('breakdownSeries', function(newVal) {
          if (Array.isArray(newVal) && newVal.length > 0) {
            scope.hasData = true;
            scope.useChart = scope.mode === 'chart';
            if (scope.useChart) {
              renderChart(newVal[0]);
            } else {
              scope.tiles = buildTiles(newVal[0]);
            }
          } else {
            scope.hasData = false;
          }
        });

        scope.$watch('mode', function(newVal) {
          scope.useChart = newVal === 'chart';
        });

        function buildTiles(series) {
          var tiles = [];
          if (!series || !Array.isArray(series.labels) || !Array.isArray(series.data)) {
            return tiles;
          }
          for (var i = 0; i < series.labels.length; i++) {
            tiles.push({
              label: series.labels[i],
              amount: series.data[i],
              percentage: Array.isArray(series.percentages) ? series.percentages[i] : ''
            });
          }
          return tiles;
        }

        function renderChart(series) {
          var canvas = document.getElementById('davms-breakdown-chart');
          if (!canvas || !window.Chart || !series) {
            return;
          }
          var ctx = canvas.getContext('2d');
          // Simple pie chart representation
          new window.Chart(ctx, {
            type: 'pie',
            data: {
              labels: series.labels,
              datasets: [{
                data: series.data
              }]
            },
            options: {
              responsive: true,
              legend: {
                position: 'bottom'
              }
            }
          });
        }
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('basicSpendBreakdownChart', basicSpendBreakdownChart);
})();
