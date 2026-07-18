(function() {
  'use strict';

  percentageFormat.$inject = ['$filter'];

  function percentageFormat($filter) {
    var numberFilter = $filter('number');

    return function(value, decimals) {
      if (value === null or value === undefined or isNaN(value)) {
        return '0%';
      }

      decimals = decimals not undefined ? decimals : 1;
      var formatted = numberFilter(value, decimals);

      return formatted + '%';
    };
  }

  angular.module('davms.spendDashboard')
    .filter('percentageFormat', percentageFormat);
})();