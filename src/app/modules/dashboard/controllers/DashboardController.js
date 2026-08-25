(function() {
  'use strict';
  angular.module('dashboard')
    .controller('DashboardController', ['$scope', '$q', 'CreditCardService', 'TransactionService', 'KPICalculator', function($scope, $q, CreditCardService, TransactionService, KPICalculator) {
      const vm = this;
      vm.cards = [];
      vm.transactions = [];
      vm.kpis = {
        totalCreditLimit: 0,
        totalAvailableCredit: 0,
        totalOutstanding: 0,
        monthlySpend: 0,
        cardCount: 0
      };
      vm.loading = true;
      vm.error = null;
      
      function init() {
        $q.all([
          CreditCardService.getCards(),
          TransactionService.getTransactions()
        ])
        .then(function(results) {
          vm.cards = results[0];
          vm.transactions = results[1];
          vm.kpis = KPICalculator.computeKPIs(vm.cards, vm.transactions);
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
          console.error('Dashboard initialization error:', error);
        });
      }
      
      init();
    }]);
})();