(function() {
  'use strict';
  angular.module('transactionManagement')
    .controller('TransactionController', ['$scope', '$timeout', 'TransactionService', 'CardService', 'CategoryService', function($scope, $timeout, TransactionService, CardService, CategoryService) {
      var vm = this;
      var filterTimeout;
      vm.loading = true;
      vm.error = null;
      vm.transactions = [];
      vm.cards = [];
      vm.categories = [];
      vm.filters = {
        cardId: '',
        category: '',
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        searchTerm: '',
        sortBy: 'date',
        sortOrder: 'desc'
      };
      vm.pagination = {
        currentPage: 1,
        pageSize: 50,
        totalItems: 0,
        totalPages: 0
      };
      function loadTransactions() {
        vm.loading = true;
        TransactionService.getTransactions(vm.filters, vm.pagination).then(function(result) {
          vm.transactions = result.transactions;
          vm.pagination.totalItems = result.total;
          vm.pagination.totalPages = Math.ceil(result.total / vm.pagination.pageSize);
          var cardIds = vm.transactions.map(function(t) { return t.cardId; }).filter(function(id, index, self) { return self.indexOf(id) === index; });
          return CardService.getCardDetails(cardIds);
        }).then(function(cards) {
          var cardMap = {};
          cards.forEach(function(card) {
            cardMap[card.cardId] = card;
          });
          vm.transactions.forEach(function(transaction) {
            if (cardMap[transaction.cardId]) {
              transaction.cardNumber = cardMap[transaction.cardId].cardNumber;
            }
          });
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load transactions. Please try again.';
          vm.loading = false;
          console.error('Transaction error:', error);
        });
      }
      CategoryService.getCategoryList().then(function(categories) {
        vm.categories = categories;
      });
      CardService.getCardDetails([]).then(function() {
        loadTransactions();
      });
      vm.applyFilter = function() {
        if (filterTimeout) {
          $timeout.cancel(filterTimeout);
        }
        filterTimeout = $timeout(function() {
          vm.pagination.currentPage = 1;
          loadTransactions();
        }, 300);
      };
      vm.changePage = function(page) {
        if (page < 1 || page > vm.pagination.totalPages) return;
        vm.pagination.currentPage = page;
        loadTransactions();
      };
      vm.changeSort = function(field) {
        if (vm.filters.sortBy === field) {
          vm.filters.sortOrder = vm.filters.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          vm.filters.sortBy = field;
          vm.filters.sortOrder = 'asc';
        }
        loadTransactions();
      };
    }]);
})();