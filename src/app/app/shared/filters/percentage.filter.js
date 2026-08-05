(function () {
  'use strict';

  angular
    .module('ccd.shared')
    .filter('percentage', [
      function () {
        return function (value, decimals) {
          if (value == null) {
            return '';
          }
          var precision = typeof decimals === 'number' ? decimals : 2;
          var num = Number(value);
          if (isNaN(num)) {
            return '';
          }
          return (num * 100).toFixed(precision) + '%';
        };
      }
    ]);
})();
