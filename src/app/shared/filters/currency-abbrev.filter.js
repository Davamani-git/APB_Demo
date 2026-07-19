(function () {
  'use strict';

  CurrencyAbbrevFilter.$inject = [];

  angular.module('app')
    .filter('currencyAbbrev', CurrencyAbbrevFilter);

  function CurrencyAbbrevFilter() {
    return function (amount) {
      if (amount === null || amount === undefined) {
        return '';
      }
      var value = Number(amount);
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      }
      if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toFixed(2);
    };
  }
})();
