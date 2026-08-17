(function() {
  'use strict';
  angular.module('transactionModule')
    .controller('TransactionController', ['$scope', 'DataAggregationService', function($scope, DataAggregationService) {
      var vm = this;
      vm.transactions = [];
      vm.selectedTransaction = null;
      vm.loading = true;
      vm.error = null;
      vm.filters = { searchText: '', cardId: '' };
      vm.sortBy = 'transactionDate';
      vm.sortOrder = 'desc';
      vm.init = function() {
        DataAggregationService.getAggregatedTransactions()
          .then(function(transactions) {
            vm.transactions = transactions;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions. Please try again.';
            vm.loading = false;
          });
      };
      vm.setSelectedTransaction = function(transaction) {
        vm.selectedTransaction = transaction;
      };
      vm.clearSelection = function() {
        vm.selectedTransaction = null;
      };
      vm.retry = function() {
        vm.loading = true;
        vm.error = null;
        vm.init();
      };
      vm.setSortBy = function(field) {
        if (vm.sortBy === field) {
          vm.sortOrder = vm.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          vm.sortBy = field;
          vm.sortOrder = 'asc';
        }
      };
      vm.init();
    }]);
})();