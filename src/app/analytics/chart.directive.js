(function() {
  'use strict';
  angular.module('spendingAnalytics')
    .directive('chartDirective', [function() {
      return {
        restrict: 'A',
        scope: {
          chartData: '=',
          chartType: '=',
          onClick: '&'
        },
        link: function(scope, element, attrs) {
          var chart = null;
          var canvas = document.createElement('canvas');
          element.append(canvas);
          var ctx = canvas.getContext('2d');
          scope.$watch('chartData', function(newData) {
            if (newData) {
              if (chart) {
                chart.destroy();
              }
              var config = {
                type: scope.chartType,
                data: newData,
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  onClick: function(evt, items) {
                    if (items.length > 0 && scope.onClick) {
                      var index = items[0]._index;
                      var label = newData.labels[index];
                      scope.onClick({ category: label });
                    }
                  }
                }
              };
              chart = new Chart(ctx, config);
            }
          });
          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    }]);
})();