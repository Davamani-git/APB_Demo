(function () {
  'use strict';

  SpendSummaryTableDirective.$inject = [];

  angular.module('app')
    .directive('spendSummaryTable', SpendSummaryTableDirective);

  function SpendSummaryTableDirective() {
    return {
      restrict: 'E',
      scope: {
        cardSummaries: '<',
        currencyCode: '@'
      },
      bindToController: true,
      controller: SpendSummaryTableController,
      controllerAs: 'vm',
      templateUrl: 'src/app/features/spend-summary/spend-summary-table.template.html',
      transclude: false,
      replace: false
    };
  }

  SpendSummaryTableController.$inject = [];

  function SpendSummaryTableController() {
    var vm = this;
  }
})();
