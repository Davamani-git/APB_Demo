(function() {
  'use strict';
  angular.module('creditCardDashboard')
    .controller('DashboardController', ['$scope', 'CreditCardService', function($scope, CreditCardService) {
      var vm = this;
      vm.dashboardData = null;
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        CreditCardService.getDashboardData()
          .then(function(data) {
            vm.dashboardData = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data. Please try again later.';
            vm.loading = false;
          });
      };
      vm.init();
    }]);
})();