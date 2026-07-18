(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .filter('currencyPrecise', currencyPrecise);

  currencyPrecise.$inject = ['$filter'];

  function currencyPrecise($filter) {
    return function(amount) {
      return $filter('currency')(amount, '$', 2);
    };
  }
})();
