(function () {
  'use strict';

  angular
    .module('ccd.shared')
    .filter('currencyWithSymbol', [
      '$filter',
      function ($filter) {
        return function (amount, currencyCode) {
          if (amount == null) {
            return '';
          }
          var currencyFilter = $filter('currency');
          var symbol = currencyCode === 'USD' ? '$' : (currencyCode || '');
          return currencyFilter(amount, symbol, 2);
        };
      }
    ]);
})();
