(function() {
  'use strict';
  angular.module('app.creditCardDashboard')
    .controller('CreditCardDashboardController', ['CreditCardService', 'KPICalculationService', function(CreditCardService, KPICalculationService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.kpiData = null;
      vm.init = function() {
        CreditCardService.getCreditCards()
          .then(function(cardData) {
            vm.kpiData = KPICalculationService.calculateKPIs(cardData);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit card data. Please try again later.';
            vm.loading = false;
            console.error('Error fetching credit cards:', error);
          });
      };
      vm.init();
    }]);
})();