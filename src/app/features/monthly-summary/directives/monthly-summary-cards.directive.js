(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .directive('monthlySummaryCards', monthlySummaryCards)
    .controller('MonthlySummaryCardsController', MonthlySummaryCardsController);

  function monthlySummaryCards() {
    return {
      restrict: 'E',
      scope: {
        summary: '<'
      },
      bindToController: true,
      controller: 'MonthlySummaryCardsController',
      controllerAs: 'vm',
      templateUrl: 'app/features/monthly-summary/templates/monthly-summary-cards.template.html'
    };
  }

  function MonthlySummaryCardsController() {
    var vm = this;
  }
})();
