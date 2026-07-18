(function() {
  'use strict';

  currencyFormat.$inject = ['$filter'];

  function currencyFormat($filter) {
    return function(amount, currencyCode) {
      var numeric = typeof amount === 'number' ? amount : 0.0;
      var formattedNumber = $filter('number')(numeric, 2);
      var code = currencyCode || '';
      if (code) {
        return code + ' ' + formattedNumber;
      }
      return formattedNumber;
    };
  }

  angular.module('davms.spendDashboard')
    .filter('currencyFormat', currencyFormat);
})();
