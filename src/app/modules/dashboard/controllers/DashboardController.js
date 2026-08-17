(function() {
  'use strict';
  angular.module('creditCardDashboardModule')
    .controller('DashboardController', ['$scope', 'KPICalculationService', 'CreditCardDataService', function($scope, KPICalculationService, CreditCardDataService) {
      var vm = this;
      vm.kpis = {};
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        KPICalculationService.getKPIs()
          .then(function(kpis) {
            vm.kpis = kpis;
            return CreditCardDataService.fetchAllCards();
          })
          .then(function(cards) {
            vm.cards = cards;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data. Please try again.';
            vm.loading = false;
          });
      };
      vm.retry = function() {
        vm.loading = true;
        vm.error = null;
        CreditCardDataService.clearCache();
        vm.init();
      };
      vm.init();
    }]);
})();