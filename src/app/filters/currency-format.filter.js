(function () {
  'use strict';

  angular
    .module('apbDemo')
    .filter('currencyFormat', currencyFormatFilter);

  currencyFormatFilter.$inject = [];
  function currencyFormatFilter() {
    return function (amount, currencyCode) {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return '-';
      }
      var code = currencyCode || 'USD';
      var sign = '';
      if (code === 'USD' || code === 'CAD' || code === 'AUD') {
        sign = '$';
      } else if (code === 'EUR') {
        sign = '€';;
      } else if (code === 'GBP') {
        sign = '£';
      } else if (code === 'INR') {
        sign = '₹';
      }
      var formatted = parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (sign) {
        return sign + formatted;
      }
      return code + ' ' + formatted;
    };
  }
})();
