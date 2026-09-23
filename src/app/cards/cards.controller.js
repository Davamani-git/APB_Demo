(function() {
  'use strict';
  angular.module('creditCardApp').controller('CardsController', ['CardService', function(CardService) {
    var vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.init = function() {
      CardService.getAllCards().then(function(data) {
        vm.cards = data;
        vm.loading = false;
      });
    };
    vm.init();
  }]);
})();