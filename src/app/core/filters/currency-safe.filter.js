(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .filter('currencySafe', currencySafeFilter);

  function currencySafeFilter() {
    return function (amount, currency) {
      if (amount === null || amount === undefined) {
        return '';
      }
      const safeAmount = Math.round(amount * 100) / 100;
      const code = currency || '';
      return code + ' ' + safeAmount.toFixed(2);
    };
  }
})();
