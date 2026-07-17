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
      var abs = Math.abs(amount);
      var sign = amount < 0 ? '-' : '';
      var suffix = '';
      var value = abs;

      if (abs >= 1000000000) {
        value = abs / 1000000000;
        suffix = 'B';
      } else if (abs >= 1000000) {
        value = abs / 1000000;
        suffix = 'M';
      } else if (abs >= 1000) {
        value = abs / 1000;
        suffix = 'k';
      }

      var formatted = value.toFixed(value >= 100 ? 0 : 1);
      var prefix = currencyCode || '';
      if (prefix) {
        prefix = prefix + ' ';
      }

      return sign + prefix + formatted + suffix;
    };
  }
})();
