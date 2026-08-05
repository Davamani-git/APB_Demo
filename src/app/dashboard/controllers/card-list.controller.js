(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .controller('CardListController', CardListController);

  CardListController.$inject = [];
  function CardListController() {
    var vm = this;
    vm.selectedCard = null;

    vm.selectCard = function (card) {
      vm.selectedCard = card;
    };
  }
})();
