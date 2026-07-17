'use strict';

(function () {
  function brAmountFilter($filter) {
    'ngInject';
    return function (amount, currency) {
      if (amount === null || amount === undefined) { return ''; }
      var code = currency || 'USD';
      return $filter('currency')(amount, code + ' ');
    };
  }

  angular
    .module('davBanking.billReminders')
    .filter('brAmount', brAmountFilter);
})();
