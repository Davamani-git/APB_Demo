(function () {
  'use strict';

  angular
    .module('apbDemo')
    .directive('monthlySummaryCard', monthlySummaryCardDirective);

  monthlySummaryCardDirective.$inject = [];
  function monthlySummaryCardDirective() {
    return {
      restrict: 'E',
      scope: {
        summary: '<',
        isLoading: '<',
        error: '<'
      },
      templateUrl: 'src/templates/components/monthly-summary-card.html',
      controller: MonthlySummaryCardController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  MonthlySummaryCardController.$inject = [];
  function MonthlySummaryCardController() {
    var vm = this;

    vm.getStatusLabel = function () {
      if (!vm.summary) {
        return '';
      }
      if (vm.summary.isCurrent) {
        return 'Current billing cycle';
      }
      if (vm.summary.isFinal) {
        return 'Finalized statement';
      }
      return '';
    };
  }
})();
