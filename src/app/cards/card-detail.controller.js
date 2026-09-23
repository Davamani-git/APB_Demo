(function() {
  'use strict';
  angular.module('creditCardApp').controller('CardDetailController', ['$routeParams', 'CardService', 'TransactionService', function($routeParams, CardService, TransactionService) {
    var vm = this;
    vm.card = {};
    vm.transactions = [];
    vm.loading = true;
    vm.init = function() {
      var cardId = $routeParams.cardId;
      CardService.getCardById(cardId).then(function(card) {
        vm.card = card;
        return TransactionService.getTransactionsByCard(cardId);
      }).then(function(transactions) {
        vm.transactions = transactions;
        vm.loading = false;
      });
    };
    vm.init();
  }]);
})();