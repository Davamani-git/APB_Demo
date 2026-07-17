(function () {
  'use strict';

  angular.module('app.core')
    .filter('currencySafe', [function () {
      return function (amount, currency) {
        if (amount === null || amount === undefined || isNaN(amount)) {
          return '-';
        }
        var symbol = currency === 'USD' ? '$' : '';
        return symbol + parseFloat(amount).toFixed(2);
      };
    }]);
}());
