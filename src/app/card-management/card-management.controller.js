(function() {
  'use strict';
  angular.module('cardManagement')
    .controller('CardManagementController', ['CardManagementService', '$scope', function(CardManagementService, $scope) {
      var vm = this;
      vm.cards = [];
      vm.selectedCard = null;
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        vm.loadCards();
      };
      vm.loadCards = function() {
        vm.loading = true;
        vm.error = null;
        CardManagementService.getCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.selectedCard = CardManagementService.getSelectedCard();
            vm.loading = false;
            if (vm.selectedCard) {
              $scope.$broadcast('cardSelected', vm.selectedCard);
            }
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit cards';
            vm.loading = false;
          });
      };
      vm.selectCard = function(card) {
        vm.selectedCard = card;
        CardManagementService.setSelectedCard(card);
        $scope.$broadcast('cardSelected', card);
      };
      vm.maskCardNumber = function(cardNumber) {
        if (!cardNumber) return '';
        return '**** **** **** ' + cardNumber.slice(-4);
      };
      vm.init();
    }]);
})();