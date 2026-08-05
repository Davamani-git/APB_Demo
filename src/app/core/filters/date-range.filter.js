(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .filter('dateRange', dateRange);

  function dateRange() {
    return function (range) {
      if (!range) {
        return '';
      }
      if (range.type === 'CURRENT_MONTH') {
        return 'Current Month';
      }
      if (range.type === 'LAST_3_MONTHS') {
        return 'Last 3 Months';
      }
      return 'Custom Range';
    };
  }
})();
