(function() {
  'use strict';
  angular.module('creditDashboardApp').controller('CardsController', ['CardService', '$scope', function(CardService, $scope) {
    var vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.loadCards = function() {
      vm.loading = true;
      CardService.getCards('user123').then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
        $scope.$apply();
      }).catch(function(err) {
        vm.error = 'Failed to load cards';
        vm.loading = false;
        $scope.$apply();
      });
    };
    vm.loadCards();
  }]);
  angular.module('creditDashboardApp').controller('CardsController').$inject = ['CardService', '$scope'];
})();