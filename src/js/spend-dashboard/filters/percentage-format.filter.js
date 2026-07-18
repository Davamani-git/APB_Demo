(function() {
  'use strict';

  percentageFormat.$inject = ['$filter'];

  function percentageFormat($filter) {
    return function(value) {
      var numeric = typeof value === 'number' ? value : 0.0;
      var formattedNumber = $filter('number')(numeric, 1);
      return formattedNumber + '%';
    };
  }

  angular.module('davms.spendDashboard')
    .filter('percentageFormat', percentageFormat);
})();
