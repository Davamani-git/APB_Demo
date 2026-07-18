(function () {
  'use strict';

  function currencyNoSymbol() {
    return function (input) {
      var value = typeof input === 'number' ? input : parseFloat(input) || 0;
      return value.toFixed(2);
    };
  }

  angular.module('davmsApp')
    .filter('currencyNoSymbol', currencyNoSymbol);
})();
