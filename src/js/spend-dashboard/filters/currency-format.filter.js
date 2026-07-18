(function() {
  'use strict';

  currencyFormat.$inject = ['$filter'];

  function currencyFormat($filter) {
    var numberFilter = $filter('number');

    return function(amount, currencyCode) {
      var numeric = typeof amount === 'number' ? amount : 0.0;
      var formatted = numberFilter(numeric, 2);
      return (currencyCode ? currencyCode + ' ' : '') + formatted;
    };
  }

  angular.module('davms.spendDashboard')
    .filter('currencyFormat', currencyFormat);
})();
