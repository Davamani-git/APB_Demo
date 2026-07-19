(function() {
  'use strict';

  currencyFormat.$inject = ['$filter', 'ENV_CONFIG'];

  function currencyFormat($filter, ENV_CONFIG) {
    return function(amount) {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return 'Not available';
      }
      var currencySymbol = ENV_CONFIG.currencySymbol || '₹';
      var formatted = $filter('number')(amount, 2);
      return currencySymbol + formatted;
    };
  }

  angular.module('app')
    .filter('currencyFormat', currencyFormat);
})();
