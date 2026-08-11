(function() {
  'use strict';
  angular.module('energyDashboard')
    .filter('costFormat', function() {
      return function(input) {
        if (input === null || input === undefined || isNaN(input)) {
          return '$0.00';
        }
        return '$' + parseFloat(input).toFixed(2);
      };
    });
})();