(function () {
  'use strict';

  function percentageFormat() {
    return function (value) {
      if (value === null || value === undefined) {
        return 'Not available';
      }
      var num = Number(value);
      if (isNaN(num)) {
        return 'Not available';
      }
      return num.toFixed(1) + '%';
    };
  }

  angular.module('app')
    .filter('percentageFormat', percentageFormat);
})();
