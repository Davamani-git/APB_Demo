(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', 'CreditCardService', 'KPICalculationService', function($scope, CreditCardService, KPICalculationService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.cards = [];
      vm.dashboardKPIs = {};
      
      function init() {
        CreditCardService.getAllCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.dashboardKPIs = KPICalculationService.aggregateKPIs(cards);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit card data. Please try again.';
            vm.loading = false;
          });
      }
      
      init();
    }]);
})();