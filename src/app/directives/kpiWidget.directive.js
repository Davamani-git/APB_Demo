(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('kpiWidget', function() {
      return {
        restrict: 'E',
        scope: {
          value: '=',
          label: '@'
        },
        template: '<div class="kpi-card"><div class="kpi-value">{{value | number:2}}</div><div class="kpi-label">{{label}}</div></div>'
      };
    });
})();