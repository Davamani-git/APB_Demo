'use strict';

(function () {
  function baAlertStatusFilter() {
    return function (status) {
      switch (status) {
        case 'DELIVERED':
          return 'Delivered';
        case 'FAILED':
          return 'Failed';
        case 'ACKNOWLEDGED':
          return 'Acknowledged';
        default:
          return status || '';
      }
    };
  }

  angular
    .module('davBanking.budgetAlerts')
    .filter('baAlertStatus', baAlertStatusFilter);
})();
