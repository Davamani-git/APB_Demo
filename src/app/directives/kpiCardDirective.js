(function () {
  'use strict';

  function kpiCard() {
    return {
      restrict: 'E',
      scope: {
        title: '@',
        value: '@',
        iconClass: '@',
        tooltip: '@',
        onClick: '&'
      },
      templateUrl: 'templates/directives/kpi-card.html',
      replace: false
    };
  }

  angular.module('app')
    .directive('kpiCard', kpiCard);
})();
