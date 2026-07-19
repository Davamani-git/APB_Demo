(function () {
  'use strict';

  monthlySummaryCard.$inject = [];
  MonthlySummaryCardController.$inject = [];

  angular
    .module('app')
    .directive('monthlySummaryCard', monthlySummaryCard);

  function monthlySummaryCard() {
    return {
      restrict: 'E',
      scope: {
        title: '@',
        icon: '@',
        value: '<',
        subtitle: '@',
        cssClass: '@'
      },
      bindToController: true,
      controller: MonthlySummaryCardController,
      controllerAs: 'vm',
      templateUrl: 'app/spending/templates/components/monthly-summary-card.template.html',
      replace: false,
      transclude: false
    };
  }

  function MonthlySummaryCardController() {
    var vm = this;
    // No additional logic required; bindings handled in template
  }
})();
