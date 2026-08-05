(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .filter('currencyLocale', currencyLocale);

  currencyLocale.$inject = [];
  function currencyLocale() {
    return function (amount, currency, locale) {
      amount = Number(amount || 0);
      currency = currency || 'USD';
      locale = locale || 'en-US';
      try {
        return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(amount);
      } catch (e) {
        return amount.toFixed(2) + ' ' + currency;
      }
    };
  }
})();
