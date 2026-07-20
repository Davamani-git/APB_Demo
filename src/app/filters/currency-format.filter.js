(function () {
  'use strict';

  angular.module('apbDemo')
    .filter('currencyFormat', currencyFormat);

  currencyFormat.$inject = [];
  function currencyFormat() {
    return function (amount, currency) {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return '-';
      }
      var symbol = '';
      switch (currency) {
        case 'USD':
          symbol = '$';
          break;
        case 'INR':
          symbol = '₹';
          break;
        case 'EUR':
          symbol = '€';
          break;
        default:
          symbol = '';
      }
      return symbol + parseFloat(amount).toFixed(2);
    };
  }
})();
