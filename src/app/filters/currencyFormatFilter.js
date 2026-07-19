(function () {
  'use strict';

  currencyFormat.$inject = ['configService'];

  function currencyFormat(configService) {
    return function (amount) {
      if (amount === null || amount === undefined) {
        return 'Not available';
      }
      var value = Number(amount);
      if (isNaN(value)) {
        return 'Not available';
      }
      var formatted = value.toFixed(2);
      return formatted;
    };
  }

  angular.module('app')
    .filter('currencyFormat', currencyFormat);
})();
