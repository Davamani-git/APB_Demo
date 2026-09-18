(function() {
  'use strict';
  angular.module('creditCardApp').controller('CardsController', ['CardService', 'TransactionService', function(CardService, TransactionService) {
    var vm = this;
    vm.cards = [];
    vm.transactions = [];
    vm.selectedCard = null;
    vm.loading = true;
    vm.init = function() {
      CardService.getCards().then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
      });
      TransactionService.getTransactions().then(function(transactions) {
        vm.transactions = transactions;
      });
    };
    vm.selectCard = function(card) {
      vm.selectedCard = card;
      TransactionService.getTransactionsByCard(card.id).then(function(transactions) {
        vm.cardTransactions = transactions;
      });
    };
    vm.init();
  }]);
})();