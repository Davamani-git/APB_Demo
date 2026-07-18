(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .filter('currencySafe', currencySafe);

  currencySafe.$inject = ['$filter'];

  function currencySafe($filter) {
    var currencyFilter = $filter('currency');

    return function(amount, currencyCode) {
      if (amount === null || typeof amount === 'undefined') {
        return '';
      }
      var symbol = '$';
      if (currencyCode === 'EUR') {
        symbol = '€';
      } else if (currencyCode === 'GBP') {
        symbol = '£';
      } else if (currencyCode === 'USD') {
        symbol = '$';
      }
      return currencyFilter(amount, symbol);
    };
  }
})();
