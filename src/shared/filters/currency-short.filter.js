(function () {
  'use strict';

  angular
    .module('apb.shared')
    .filter('currencyShort', currencyShort);

  function currencyShort() {
    return function (amount, currencyCode) {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return '';
      }
      var value = Number(amount);
      var suffix = '';
      if (Math.abs(value) >= 1e9) {
        value = value / 1e9;
        suffix = 'B';
      } else if (Math.abs(value) >= 1e6) {
        value = value / 1e6;
        suffix = 'M';
      } else if (Math.abs(value) >= 1e3) {
        value = value / 1e3;
        suffix = 'k';
      }
      var formatted = value.toFixed(1).replace(/\.0$/, '');
      var prefix = currencyCode || '';
      if (prefix) {
        prefix += ' ';
      }
      return prefix + formatted + suffix;
    };
  }
})();
