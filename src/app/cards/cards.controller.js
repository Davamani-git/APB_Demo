(function() {
  'use strict';
  angular.module('creditCardApp').controller('CardsController', ['CardService', function(CardService) {
    var vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.init = function() {
      CardService.getAllCards().then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
      });
    };
    vm.init();
  }]);
})();