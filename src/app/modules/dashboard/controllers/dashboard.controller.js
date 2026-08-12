(function() {
  'use strict';
  angular.module('dashboard')
    .controller('DashboardController', ['$scope', 'KpiAggregationService', function($scope, KpiAggregationService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.kpis = {};
      vm.cards = [];
      vm.init = function() {
        KpiAggregationService.getConsolidatedKpis()
          .then(function(data) {
            vm.kpis = {
              monthlySpend: data.monthlySpend,
              totalCreditLimit: data.totalCreditLimit,
              totalAvailableCredit: data.totalAvailableCredit,
              totalOutstandingAmount: data.totalOutstandingAmount
            };
            vm.cards = data.cards;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = error.message || 'An error occurred while loading the dashboard.';
            vm.loading = false;
          });
      };
      vm.formatCurrency = function(amount) {
        return '₹' + (amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };
      vm.maskCardNumber = function(cardNumber) {
        if (!cardNumber || cardNumber.length < 4) return '****';
        return '**** **** **** ' + cardNumber.slice(-4);
      };
      vm.init();
    }]);
})();