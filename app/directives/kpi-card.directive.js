(function () {
  'use strict';

  angular.module('apbDemo')
    .directive('kpiCard', kpiCard);

  kpiCard.$inject = [];

  function kpiCard() {
    return {
      restrict: 'E',
      scope: {
        kpi: '<'
      },
      templateUrl: 'templates/components/kpi-card.html',
      controller: KpiCardController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  KpiCardController.$inject = [];
  function KpiCardController() {
    var vm = this;
  }
})();
