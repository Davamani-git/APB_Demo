(function() {
  'use strict';
  angular.module('transactionModule')
    .directive('transactionDetail', function() {
      return {
        restrict: 'E',
        scope: {
          transaction: '=',
          onClose: '&'
        },
        templateUrl: 'src/app/modules/transactions/views/transaction-detail-directive.html'
      };
    });
})();