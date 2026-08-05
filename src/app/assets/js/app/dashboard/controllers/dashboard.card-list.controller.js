(function(){
  'use strict';
  angular.module('appmrn25.dashboard')
    .controller('CardListController', ['$scope', function($scope){
      var vm = this;
      vm.getCards = function(){
        return vm.cards || [];
      };
      vm.onCardClick = function(card){
        if(vm.onSelect){
          vm.onSelect({ cardId: card.cardId });
        }
      };
    }]);
})();
