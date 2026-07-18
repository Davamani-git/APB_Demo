(function () {
  'use strict';

  function basicSpendBreakdownChart() {
    return {
      restrict: 'E',
      scope: {
        breakdownSeries: '=',
        mode: '@'
      },
      template: [
        '<div class="breakdown-chart-container" ng-if="hasData">',
        '  <div ng-if="mode === \"tiles\"">',
        '    <div class="row">',
        '      <div class="col-sm-3" ng-repeat="tile in tiles" class="breakdown-tile">',
        '        <div class="panel panel-default">',
        '          <div class="panel-heading">{{tile.label}}</div>',
        '          <div class="panel-body">',
        '            <div class="breakdown-amount">{{tile.amount | currencyFormat}}</div>',
        '            <div class="breakdown-percentage">{{tile.percentage}}</div>',
        '          </div>',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div ng-if="mode !== \"tiles\"">',
        '    <canvas></canvas>',
        '  </div>',
        '</div>',
        '<div ng-if="!hasData">',
        '  <p>No breakdown is available for the selected month. Either there is insufficient data or the breakdown cannot be displayed at this time.</p>',
        '</div>'
      ].join(''),
      link: function (scope, element) {
        scope.$watch('breakdownSeries', function (series) {
          if (!series || !series.length) {
            scope.hasData = false;
            scope.tiles = [];
            return;
          }
          scope.hasData = true;
          var s = series[0];
          scope.tiles = [];
          if (scope.mode === 'tiles') {
            for (var i = 0; i < s.labels.length; i++) {
              scope.tiles.push({
                label: s.labels[i],
                amount: s.data[i],
                percentage: s.percentages && s.percentages[i] ? s.percentages[i] : ''
              });
            }
          } else {
            var canvas = element.find('canvas')[0];
            if (canvas && window.Chart) {
              var ctx = canvas.getContext('2d');
              new window.Chart(ctx, {
                type: 'doughnut',
                data: {
                  labels: s.labels,
                  datasets: [{
                    data: s.data
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
        }, true);
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('basicSpendBreakdownChart', basicSpendBreakdownChart);
})();
