(function() {
  'use strict';
  angular.module('creditCardDashboardModule')
    .directive('kpiWidget', function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          currency: '@'
        },
        template: '<div class="kpi-widget"><h3>{{label}}</h3><div class="value"><span ng-if="currency">{{currency}}</span>{{value | number:2}}</div></div>'
      };
    });
})();