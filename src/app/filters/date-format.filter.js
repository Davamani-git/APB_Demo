(function () {
  'use strict';

  angular.module('apbDemo')
    .filter('dateFormat', dateFormat);

  dateFormat.$inject = [];
  function dateFormat() {
    return function (monthString) {
      if (!monthString || !/^\d{4}-\d{2}$/.test(monthString)) {
        return '-';
      }
      var parts = monthString.split('-');
      var year = parts[0];
      var monthIndex = parseInt(parts[1], 10) - 1;
      var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var monthName = monthNames[monthIndex] || '';
      return monthName + ' ' + year;
    };
  }
})();
