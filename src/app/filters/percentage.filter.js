(function () {
  'use strict';

  angular
    .module('execSummary.filters')
    .filter('percentage', [function () {
      return function (value) {
        var num = parseFloat(value);
        if (isNaN(num)) {
          return '0.0%';
        }
        return num.toFixed(1) + '%';
      };
    }]);
})();