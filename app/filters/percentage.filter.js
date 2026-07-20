(function () {
  'use strict';

  angular.module('apbDemo')
    .filter('percentage', percentage);

  percentage.$inject = [];

  function percentage() {
    return function (input) {
      if (typeof input !== 'number') {
        return '';
      }
      return input.toFixed(2) + '%';
    };
  }
})();
