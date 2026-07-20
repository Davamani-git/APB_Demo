(function () {
  'use strict';

  angular.module('apbDemo')
    .filter('dateFormat', dateFormat);

  dateFormat.$inject = [];

  function dateFormat() {
    return function (input) {
      if (!input) {
        return '';
      }
      if (/^\d{4}-\d{2}$/.test(input)) {
        var parts = input.split('-');
        var year = parts[0];
        var monthIndex = parseInt(parts[1], 10) - 1;
        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var monthName = monthNames[monthIndex] || '';
        return monthName + ' ' + year;
      }
      return input;
    };
  }
})();
