(function () {
  'use strict';

  angular
    .module('apbDemo')
    .filter('percentage', percentageFilter);

  percentageFilter.$inject = [];
  function percentageFilter() {
    return function (value, fractionSize) {
      if (value === null || value === undefined || isNaN(value)) {
        return '-';
      }
      var size = typeof fractionSize === 'number' ? fractionSize : 1;
      var num = parseFloat(value);
      if (num <= 1) {
        num = num * 100;
      }
      return num.toFixed(size) + '%';
    };
  }
})();
