(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .filter('dateRange', dateRangeFilter);

  function dateRangeFilter() {
    return function (input) {
      if (!input || !input.from || !input.to) {
        return '';
      }
      const from = new Date(input.from);
      const to = new Date(input.to);
      const diffDays = Math.round((to - from) / (1000 * 60 * 60 * 24));
      if (diffDays <= 31) {
        return 'Last ' + diffDays + ' days';
      }
      const diffMonths = Math.round(diffDays / 30);
      return 'Last ' + diffMonths + ' months';
    };
  }
})();
