(function () {
  'use strict';

  angular
    .module('execSummary.filters')
    .filter('statusLabel', [function () {
      return function (status) {
        if (status === 'IN_PROGRESS') {
          return 'In Progress';
        }
        if (status === 'DESIGN_IN_PROGRESS') {
          return 'Design In Progress';
        }
        if (status === 'COMPLETED') {
          return 'Completed';
        }
        return 'Unknown';
      };
    }]);
})();