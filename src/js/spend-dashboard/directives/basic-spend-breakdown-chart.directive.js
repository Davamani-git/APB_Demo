(function() {
  'use strict';

  function basicSpendBreakdownChart() {
    return {
      restrict: 'E',
      scope: {
        breakdownSeries: '=',
        mode: '@',
        onCategoryClick: '&'
      },
      templateUrl: 'src/js/spend-dashboard/views/basic-spend-breakdown-chart.template.html',
      link: function(scope) {
        scope.$watch('breakdownSeries', function(newSeries) {
          if (!newSeries || !newSeries.length) {
            return;
          }
        });

        scope.handleTileClick = function(category) {
          scope.onCategoryClick({ category: category });
        };
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('basicSpendBreakdownChart', basicSpendBreakdownChart);
})();
