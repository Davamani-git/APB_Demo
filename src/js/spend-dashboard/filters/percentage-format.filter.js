(function() {
  'use strict';

  percentageFormat.$inject = ['$filter'];

  function percentageFormat($filter) {
    var numberFilter = $filter('number');

    return function(value) {
      var numeric = typeof value === 'number' ? value : 0.0;
      if (numeric < 0) {
        numeric = 0.0;
      }
      if (numeric > 100) {
        numeric = 100.0;
      }
      return numberFilter(numeric, 1) + '%';
    };
  }

  angular.module('davms.spendDashboard')
    .filter('percentageFormat', percentageFormat);
})();
