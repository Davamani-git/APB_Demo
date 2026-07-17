'use strict';

(function () {
  function piDateRangeFilter() {
    return function (range) {
      if (!range || !range.from || !range.to) {
        return '';
      }
      var from = new Date(range.from);
      var to = new Date(range.to);
      var diffDays = Math.round((to - from) / 86400000);
      if (diffDays <= 31) {
        return 'Last ' + diffDays + ' days';
      }
      var options = { month: 'short', year: 'numeric' };
      return from.toLocaleDateString(undefined, options) + ' - ' + to.toLocaleDateString(undefined, options);
    };
  }

  angular
    .module('davBanking.personalInsights')
    .filter('piDateRange', piDateRangeFilter);
})();
