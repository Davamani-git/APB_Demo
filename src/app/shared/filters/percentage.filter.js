(function () {
  'use strict';

  angular.module('app.core')
    .filter('percentage', [function () {
      return function (value, decimals) {
        if (value === null || value === undefined || isNaN(value)) {
          return '-';
        }
        var d = (typeof decimals === 'number') ? decimals : 1;
        return parseFloat(value).toFixed(d) + '%';
      };
    }]);
}());
