(function () {
  'use strict';

  SpendSummaryKpiCardDirective.$inject = [];

  angular.module('app')
    .directive('spendSummaryKpiCard', SpendSummaryKpiCardDirective);

  function SpendSummaryKpiCardDirective() {
    return {
      restrict: 'E',
      scope: {
        iconPath: '@',
        label: '@',
        value: '<',
        currencyCode: '@'
      },
      bindToController: true,
      controller: SpendSummaryKpiCardController,
      controllerAs: 'vm',
      templateUrl: 'src/app/features/spend-summary/spend-summary-kpi-card.template.html',
      transclude: false,
      replace: false
    };
  }

  SpendSummaryKpiCardController.$inject = [];

  function SpendSummaryKpiCardController() {
    var vm = this;
  }
})();
