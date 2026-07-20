(function () {
  'use strict';

  angular
    .module('apbDemo')
    .directive('kpiCard', kpiCardDirective);

  kpiCardDirective.$inject = [];
  function kpiCardDirective() {
    return {
      restrict: 'E',
      scope: {
        kpi: '<'
      },
      templateUrl: 'src/templates/components/kpi-card.html',
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
