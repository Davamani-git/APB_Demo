'use strict';

(function () {
  function baAlertRow() {
    return {
      restrict: 'A',
      scope: {
        alert: '='
      },
      templateUrl: 'app/budget-alerts/views/ba-alert-row.html'
    };
  }

  angular
    .module('davBanking.budgetAlerts')
    .directive('baAlertRow', baAlertRow);
})();
