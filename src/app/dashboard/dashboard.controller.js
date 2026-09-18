(function() {
  'use strict';
  angular.module('creditCardApp').controller('DashboardController', ['KpiService', 'CardService', function(KpiService, CardService) {
    var vm = this;
    vm.kpis = {};
    vm.cards = [];
    vm.loading = true;
    vm.init = function() {
      KpiService.calculateKpis().then(function(kpis) {
        vm.kpis = kpis;
      });
      CardService.getCards().then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
      });
    };
    vm.init();
  }]);
})();