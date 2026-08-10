(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionController', ['transactionService', 'creditCardService', 'analyticsService', '$scope', function(transactionService, creditCardService, analyticsService, $scope) {
    const vm = this;
    vm.transactions = [];
    vm.cards = [];
    vm.spendBreakdown = [];
    vm.selectedCardId = null;
    vm.currentPage = 1;
    vm.pageSize = 50;
    vm.totalItems = 0;
    vm.loading = false;
    vm.error = null;
    vm.selectedTransaction = null;
    vm.init = function() {
      vm.loadCards();
      vm.loadTransactions();
    };
    vm.loadCards = function() {
      creditCardService.getUserCards()
        .then(function(cards) {
          vm.cards = cards;
        })
        .catch(function(error) {
          vm.error = error;
        });
    };
    vm.loadTransactions = function() {
      vm.loading = true;
      vm.error = null;
      transactionService.getTransactions(vm.currentPage, vm.pageSize, vm.selectedCardId)
        .then(function(data) {
          vm.transactions = data.transactions || data;
          vm.totalItems = data.total || vm.transactions.length;
          vm.spendBreakdown = analyticsService.calculateSpendBreakdown(vm.transactions);
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = error;
          vm.loading = false;
        });
    };
    vm.filterByCard = function(cardId) {
      vm.selectedCardId = cardId;
      vm.currentPage = 1;
      vm.loadTransactions();
    };
    vm.pageChanged = function() {
      vm.loadTransactions();
    };
    vm.viewTransactionDetail = function(transaction) {
      vm.selectedTransaction = transaction;
    };
    vm.closeDetail = function() {
      vm.selectedTransaction = null;
    };
    vm.init();
  }]);
})();