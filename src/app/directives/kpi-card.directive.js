(function() {
  'use strict';
  angular.module('creditCardApp').directive('kpiCard', [function() {
    return {
      restrict: 'E',
      scope: {
        title: '=',
        value: '=',
        icon: '='
      },
      template: '<div class="kpi-card"><div class="kpi-icon">{{icon}}</div><div class="kpi-content"><h4>{{title}}</h4><p class="kpi-value">{{value | number}}</p></div></div>'
    };
  }]);
})();