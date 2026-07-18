(function() {
  'use strict';

  currencyFormat.$inject = ['$filter'];

  function currencyFormat($filter) {
    var numberFilter = $filter('number');

    return function(amount, currencyCode) {
      var value = typeof amount === 'number' ? amount : 0.0;
      var formattedNumber = numberFilter(value, 2);
      if (currencyCode) {
        return currencyCode + ' ' + formattedNumber;
      }
      return formattedNumber;
    };
  }

  angular.module('davms.spendDashboard')
    .filter('currencyFormat', currencyFormat);
})();
