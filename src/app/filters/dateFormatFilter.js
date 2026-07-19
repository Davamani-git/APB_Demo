(function () {
  'use strict';

  function dateFormat() {
    return function (month) {
      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return month || '';
      }
      var parts = month.split('-');
      var year = parts[0];
      var monthIndex = parseInt(parts[1], 10) - 1;
      var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var name = monthNames[monthIndex] || '';
      return name + ' ' + year;
    };
  }

  angular.module('app')
    .filter('dateFormat', dateFormat);
})();
