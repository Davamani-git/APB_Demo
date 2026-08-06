(function() {
  'use strict';
  angular.module('cardManagement')
    .controller('TransactionController', ['TransactionService', '$scope', function(TransactionService, $scope) {
      var vm = this;
      vm.transactions = [];
      vm.loading = false;
      vm.error = null;
      vm.filters = {
        dateRange: null,
        minAmount: null,
        maxAmount: null,
        merchantName: '',
        pageNumber: 1,
        pageSize: 20
      };
      vm.currentCardId = null;
      $scope.$on('cardSelected', function(event, card) {
        vm.currentCardId = card.cardId;
        vm.filters.pageNumber = 1;
        vm.loadTransactions();
      });
      vm.loadTransactions = function() {
        if (!vm.currentCardId) return;
        vm.loading = true;
        vm.error = null;
        TransactionService.getTransactions(vm.currentCardId, vm.filters)
          .then(function(transactions) {
            vm.transactions = transactions;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions';
            vm.loading = false;
            vm.transactions = [];
          });
      };
      vm.applyFilters = function() {
        vm.filters.pageNumber = 1;
        vm.loadTransactions();
      };
      vm.nextPage = function() {
        vm.filters.pageNumber++;
        vm.loadTransactions();
      };
      vm.previousPage = function() {
        if (vm.filters.pageNumber > 1) {
          vm.filters.pageNumber--;
          vm.loadTransactions();
        }
      };
    }]);
})();