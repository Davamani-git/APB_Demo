(function () {
  'use strict';

  angular.module('apbDemo')
    .directive('monthlySummaryCard', monthlySummaryCard);

  function monthlySummaryCard() {
    return {
      restrict: 'E',
      scope: {
        summary: '<'
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
  }
})();
