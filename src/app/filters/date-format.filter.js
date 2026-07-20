(function () {
  'use strict';

  angular
    .module('apbDemo')
    .filter('dateFormat', dateFormatFilter);

  dateFormatFilter.$inject = [];
  function dateFormatFilter() {
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return function (input) {
      if (!input) {
        return '';
      }
      if (/^\d{4}-\d{2}$/.test(input)) {
        var parts = input.split('-');
        var year = parts[0];
        var monthIndex = parseInt(parts[1], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          return monthNames[monthIndex] + ' ' + year;
        }
      }
      var date = new Date(input);
      if (isNaN(date.getTime())) {
        return input;
      }
      return monthNames[date.getMonth()] + ' ' + date.getFullYear();
    };
  }
})();
