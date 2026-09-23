(function() {
  'use strict';
  angular.module('creditCardApp').controller('DashboardController', ['CardService', function(CardService) {
    var vm = this;
    vm.kpis = {};
    vm.loading = true;
    vm.init = function() {
      CardService.getConsolidatedKPIs().then(function(data) {
        vm.kpis = data;
        vm.loading = false;
      });
    };
    vm.init();
  }]);
})();