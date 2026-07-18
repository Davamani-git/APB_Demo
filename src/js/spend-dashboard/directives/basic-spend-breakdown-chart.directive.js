(function() {
  'use strict';

  function basicSpendBreakdownChart() {
    return {
      restrict: 'E',
      scope: {
        breakdownSeries: '=',
        breakdownTiles: '=',
        mode: '@',
        onCategoryClick: '&'
      },
      template: [
        '<div class="davms-breakdown-section">',
        '  <div ng-if="!hasData">',
        '    <p class="davms-no-data-message">A breakdown is not available for the selected month.</p>',
        '  </div>',
        '  <div ng-if="hasData">',
        '    <div ng-if="useChart">',
        '      <canvas></canvas>',
        '    </div>',
        '    <div class="davms-breakdown-tiles row" ng-if="!useChart">',
        '      <div class="col-sm-4" ng-repeat="tile in breakdownTiles" ng-click="handleTileClick(tile)">',
        '        <div class="panel panel-default">',
        '          <div class="panel-heading">{{tile.label}}</div>',
        '          <div class="panel-body">',
        '            <div><strong>{{tile.amount | currencyFormat}}</strong></div>',
        '            <div>{{tile.percentageLabel}}</div>',
        '          </div>',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join(''),
      link: function(scope, element) {
        scope.useChart = scope.mode === 'chart';
        scope.hasData = !!(scope.breakdownSeries || (scope.breakdownTiles && scope.breakdownTiles.length));

        scope.handleTileClick = function(tile) {
          scope.onCategoryClick({ category: tile });
        };

        scope.$watch('breakdownSeries', function(newVal) {
          if (!newVal || !scope.useChart) {
            return;
          }
          var canvas = element.find('canvas')[0];
          if (!canvas) {
            return;
          }
          var ctx = canvas.getContext('2d');
          // Use a simple pie chart representation; actual charting details are non-critical for requirements.
          /* global Chart */
          if (typeof Chart !== 'undefined') {
            new Chart(ctx, {
              type: 'pie',
              data: newVal,
              options: {
                responsive: true,
                legend: {
                  position: 'bottom'
                }
              }
            });
          }
        });
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('basicSpendBreakdownChart', basicSpendBreakdownChart);
})();
