(function () {
  'use strict';

  function percentageFormat() {
    return function (value) {
      if (value === null || value === undefined || isNaN(value)) {
        return '0%';
      }
      var numeric = parseFloat(value);
      return numeric.toFixed(1) + '%';
    };
  }

  angular.module('davms.spendDashboard')
    .filter('percentageFormat', percentageFormat);
})();
