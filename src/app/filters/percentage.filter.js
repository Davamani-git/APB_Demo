(function () {
  'use strict';

  angular.module('apbDemo')
    .filter('percentage', percentage);

  percentage.$inject = [];
  function percentage() {
    return function (value) {
      if (value === null || value === undefined || isNaN(value)) {
        return '-';
      }
      return parseFloat(value).toFixed(2) + '%';
    };
  }
})();
