(function() {
  'use strict';

  ssKpiCard.$inject = [];

  function ssKpiCard() {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        title: '@',
        value: '<',
        iconClass: '@',
        trendIndicator: '<',
        supportLabel: '@'
      },
      controller: KpiCardController,
      controllerAs: 'vm',
      templateUrl: 'src/app/modules/dashboard/templates/kpi-card.html'
    };
  }

  KpiCardController.$inject = [];

  function KpiCardController() {}

  angular.module('app')
    .directive('ssKpiCard', ssKpiCard);
})();
