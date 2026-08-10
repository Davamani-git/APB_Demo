(function() {
  'use strict';
  angular.module('transactionModule').directive('transactionDetail', [function() {
    return {
      restrict: 'E',
      scope: {
        transaction: '=',
        onClose: '&'
      },
      templateUrl: 'src/app/transactions/views/transaction-detail.html',
      link: function(scope, element, attrs) {
        scope.close = function() {
          scope.onClose();
        };
      }
    };
  }]);
})();