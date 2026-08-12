(function() {
  'use strict';
  angular.module('dashboard')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          format: '&'
        },
        template: '<div class="kpi-card">' +
                  '<div class="kpi-value">{{ displayValue }}</div>' +
                  '<div class="kpi-label">{{ label }}</div>' +
                  '</div>',
        link: function(scope) {
          scope.$watch('value', function(newVal) {
            if (scope.format) {
              scope.displayValue = scope.format({ amount: newVal });
            } else {
              scope.displayValue = newVal;
            }
          });
        }
      };
    }]);
})();