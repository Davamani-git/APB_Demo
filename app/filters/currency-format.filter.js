(function () {
  'use strict';

  angular.module('apbDemo')
    .filter('currencyFormat', currencyFormat);

  currencyFormat.$inject = [];

  function currencyFormat() {
    return function (input, currencyCode) {
      if (typeof input !== 'number') {
        return '';
      }
      var code = currencyCode || 'USD';
      var value = input.toFixed(2);
      return code + ' ' + value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
  }
})();
