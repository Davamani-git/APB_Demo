(function () {
  'use strict';

  function currencyFormat() {
    return function (amount, currencyCode) {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return '0.00';
      }

      var value = parseFloat(amount);
      var formatted = value.toFixed(2);
      if (currencyCode) {
        return currencyCode + ' ' + formatted;
      }
      return formatted;
    };
  }

  angular.module('davms.spendDashboard')
    .filter('currencyFormat', currencyFormat);
})();
