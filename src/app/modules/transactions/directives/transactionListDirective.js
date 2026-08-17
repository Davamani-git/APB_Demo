(function() {
  'use strict';
  angular.module('transactionModule')
    .directive('transactionList', function() {
      return {
        restrict: 'E',
        scope: {
          transactions: '=',
          onSelect: '&',
          sortBy: '=',
          sortOrder: '=',
          onSort: '&'
        },
        templateUrl: 'src/app/modules/transactions/views/transaction-list-directive.html'
      };
    });
})();