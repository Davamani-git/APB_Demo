(function() {
  'use strict';

  function percentageFormat($filter) {
    return function(value) {
      var safeValue = isNaN(value) ? 0 : value;
      var numberFilter = $filter('number');
      var formatted = numberFilter(safeValue, 1);
      return formatted + '%';
    };
  }

  percentageFormat.$inject = ['$filter'];

  angular.module('davms.spendDashboard')
    .filter('percentageFormat', percentageFormat);
})();
