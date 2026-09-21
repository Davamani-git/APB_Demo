(function() {
  'use strict';
  angular.module('creditCardApp').controller('DashboardController', ['CardService', 'TransactionService', function(CardService, TransactionService) {
    var vm = this;
    vm.kpis = {};
    vm.loading = true;
    vm.init = function() {
      CardService.getConsolidatedKPIs().then(function(kpis) {
        vm.kpis.totalCreditLimit = kpis.totalCreditLimit;
        vm.kpis.availableCredit = kpis.availableCredit;
        vm.kpis.outstandingAmount = kpis.outstandingAmount;
        return TransactionService.getCurrentMonthSpend();
      }).then(function(monthlySpend) {
        vm.kpis.monthlySpend = monthlySpend;
        vm.loading = false;
      });
    };
    vm.init();
  }]);
})();