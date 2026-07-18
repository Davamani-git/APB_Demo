(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .filter('monthDisplay', monthDisplay);

  function monthDisplay() {
    return function(month) {
      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return month;
      }
      var year = month.substring(0, 4);
      var monthPart = month.substring(5, 7);
      var monthIndex = parseInt(monthPart, 10) - 1;
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var name = months[monthIndex] || monthPart;
      return name + ' ' + year;
    };
  }
})();
