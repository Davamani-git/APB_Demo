(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .directive('transactionList', ['fraudRiskService', function(fraudRiskService) {
      return {
        restrict: 'E',
        scope: {
          transactions: '=',
          onRefresh: '&'
        },
        templateUrl: 'src/app/fraud-detection/views/transaction-list.view.html',
        link: function(scope, element, attrs) {
          scope.currentPage = 1;
          scope.pageSize = 10;
          scope.sortBy = 'transactionTimestamp';
          scope.sortReverse = true;
          scope.filterRiskBand = '';
          scope.getPagedTransactions = function() {
            let filtered = scope.transactions;
            if (scope.filterRiskBand) {
              filtered = filtered.filter(function(txn) {
                return txn.riskBand === scope.filterRiskBand;
              });
            }
            const start = (scope.currentPage - 1) * scope.pageSize;
            const end = start + scope.pageSize;
            return filtered.slice(start, end);
          };
          scope.getTotalPages = function() {
            let filtered = scope.transactions;
            if (scope.filterRiskBand) {
              filtered = filtered.filter(function(txn) {
                return txn.riskBand === scope.filterRiskBand;
              });
            }
            return Math.ceil(filtered.length / scope.pageSize);
          };
          scope.setPage = function(page) {
            if (page >= 1 && page <= scope.getTotalPages()) {
              scope.currentPage = page;
            }
          };
          scope.setSortBy = function(field) {
            if (scope.sortBy === field) {
              scope.sortReverse = !scope.sortReverse;
            } else {
              scope.sortBy = field;
              scope.sortReverse = false;
            }
          };
          scope.setFilter = function(riskBand) {
            scope.filterRiskBand = riskBand;
            scope.currentPage = 1;
          };
          scope.refresh = function() {
            if (scope.onRefresh) {
              scope.onRefresh();
            }
          };
        }
      };
    }]);
})();