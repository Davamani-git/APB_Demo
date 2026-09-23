(function() {
  'use strict';
  angular.module('creditDashboardApp').controller('CardDetailController', ['CardService', 'TransactionService', '$routeParams', '$scope', function(CardService, TransactionService, $routeParams, $scope) {
    var vm = this;
    vm.card = null;
    vm.transactions = [];
    vm.loading = true;
    vm.error = null;
    vm.sortField = 'txnDate';
    vm.sortReverse = true;
    vm.filterCategory = '';
    vm.loadCardDetail = function() {
      vm.loading = true;
      var cardId = $routeParams.cardId;
      CardService.getCardById(cardId).then(function(card) {
        vm.card = card;
        return TransactionService.getTransactions('user123', cardId, null);
      }).then(function(transactions) {
        vm.transactions = transactions;
        vm.loading = false;
        $scope.$apply();
      }).catch(function(err) {
        vm.error = 'Failed to load card details';
        vm.loading = false;
        $scope.$apply();
      });
    };
    vm.setSortField = function(field) {
      if (vm.sortField === field) {
        vm.sortReverse = !vm.sortReverse;
      } else {
        vm.sortField = field;
        vm.sortReverse = false;
      }
    };
    vm.filteredTransactions = function() {
      if (!vm.filterCategory) return vm.transactions;
      return vm.transactions.filter(function(txn) {
        return txn.category === vm.filterCategory;
      });
    };
    vm.loadCardDetail();
  }]);
  angular.module('creditDashboardApp').controller('CardDetailController').$inject = ['CardService', 'TransactionService', '$routeParams', '$scope'];
})();