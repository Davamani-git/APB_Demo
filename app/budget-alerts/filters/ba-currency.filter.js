'use strict';

(function () {
  function baCurrencyFilter($filter) {
    'ngInject';
    return function (amount, currencyCode) {
      if (amount === null || amount === undefined) {
        return '';
      }
      var code = currencyCode || 'USD';
      return $filter('currency')(amount, code + ' ');
    };
  }

  angular
    .module('davBanking.budgetAlerts')
    .filter('baCurrency', baCurrencyFilter);
})();
