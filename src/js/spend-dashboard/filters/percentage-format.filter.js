(function() {
  'use strict';

  function percentageFormat($filter) {
    return function(value, decimals) {
      if (value === null || value === undefined || isNaN(value)) {
        return '0%';
      }
      
      decimals = decimals || 1;
      var percentage = value * 100;
      
      return $filter('number')(percentage, decimals) + '%';
    };
  }

  percentageFormat.$inject = ['$filter'];

  angular.module('davms.spendDashboard')
    .filter('percentageFormat', percentageFormat);
})();