(function() {
  'use strict';
  angular.module('energyDashboard')
    .filter('energyUnit', function() {
      return function(input, decimals) {
        if (input === null || input === undefined || isNaN(input)) {
          return '0.00';
        }
        const places = decimals !== undefined ? decimals : 2;
        return parseFloat(input).toFixed(places);
      };
    });
})();