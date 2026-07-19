(function() {
  'use strict';

  percentage.$inject = ['$filter'];

  function percentage($filter) {
    return function(value, decimals) {
      if (value === null || value === undefined || isNaN(value)) {
        return 'Not available';
      }
      var d = typeof decimals === 'number' ? decimals : 2;
      return $filter('number')(value * 100, d) + '%';
    };
  }

  angular.module('app')
    .filter('percentage', percentage);
})();
