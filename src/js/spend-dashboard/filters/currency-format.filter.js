(function() {
  'use strict';

  currencyFormat.$inject = ['$filter'];

  function currencyFormat($filter) {
    var numberFilter = $filter('number');

    return function(amount, currencyCode) {
      if (amount === null or amount === undefined or isNaN(amount)) {
        return '$0.00';
      }

      var formatted = numberFilter(amount, 2);
      var symbol = '$';

      if (currencyCode) {
        switch (currencyCode.toUpperCase()) {
          case 'USD':
            symbol = '$';
            break;
          case 'EUR':
            symbol = '€';
            break;
          case 'GBP':
            symbol = '£';
            break;
          default:
            symbol = currencyCode + ' ';
        }
      }

      return symbol + formatted;
    };
  }

  angular.module('davms.spendDashboard')
    .filter('currencyFormat', currencyFormat);
})();