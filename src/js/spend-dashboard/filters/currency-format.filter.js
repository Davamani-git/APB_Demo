(function() {
  'use strict';

  function currencyFormat($filter) {
    return function(amount, currencyCode) {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return '$0.00';
      }
      
      var formattedNumber = $filter('number')(amount, 2);
      var symbol = '$'; // Default to USD symbol
      
      // Map currency codes to symbols
      var currencySymbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'CAD': 'C$',
        'AUD': 'A$'
      };
      
      if (currencyCode && currencySymbols[currencyCode]) {
        symbol = currencySymbols[currencyCode];
      }
      
      return symbol + formattedNumber;
    };
  }

  currencyFormat.$inject = ['$filter'];

  angular.module('davms.spendDashboard')
    .filter('currencyFormat', currencyFormat);
})();