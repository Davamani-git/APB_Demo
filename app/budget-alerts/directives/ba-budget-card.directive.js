'use strict';

(function () {
  function baBudgetCard() {
    return {
      restrict: 'E',
      scope: {
        budget: '=',
        onEdit: '&'
      },
      templateUrl: 'app/budget-alerts/views/ba-budget-card.html'
    };
  }

  angular
    .module('davBanking.budgetAlerts')
    .directive('baBudgetCard', baBudgetCard);
})();
