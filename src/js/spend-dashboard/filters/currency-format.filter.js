(function() {
  'use strict';

  function currencyFormat($filter) {
    return function(amount, currencyCode) {
      var numberFilter = $filter('number');
      var safeAmount = isNaN(amount) ? 0 : amount;
      var formattedNumber = numberFilter(safeAmount, 2);
      var code = currencyCode || '';
      if (code) {
        return code + ' ' + formattedNumber;
      }
      return formattedNumber;
    };
  }

  currencyFormat.$inject = ['$filter'];

  angular.module('davms.spendDashboard')
    .filter('currencyFormat', currencyFormat);
})();
