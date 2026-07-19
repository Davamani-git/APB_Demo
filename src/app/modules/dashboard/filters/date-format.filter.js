(function() {
  'use strict';

  function dateFormat() {
    return function(monthStr) {
      if (!monthStr || typeof monthStr !== 'string' || monthStr.length !== 7) {
        return '';
      }
      var parts = monthStr.split('-');
      if (parts.length !== 2) {
        return '';
      }
      var year = parts[0];
      var monthIndex = parseInt(parts[1], 10) - 1;
      if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
        return '';
      }
      var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames[monthIndex] + ' ' + year;
    };
  }

  angular.module('app')
    .filter('dateFormat', dateFormat);
})();
