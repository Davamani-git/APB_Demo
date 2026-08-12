(function() {
  'use strict';
  angular.module('creditCardDashboard').controller('DashboardController', ['$scope', 'CreditCardService', 'KPICalculator', 'DataRefreshService', function($scope, CreditCardService, KPICalculator, DataRefreshService) {
    var vm = this;
    vm.cards = [];
    vm.kpis = {};
    vm.loading = true;
    vm.error = null;
    vm.lastUpdated = null;

    function loadDashboardData() {
      vm.loading = true;
      vm.error = null;
      CreditCardService.getAllCards().then(function(cards) {
        vm.cards = cards;
        vm.kpis = KPICalculator.calculateKPIs(cards);
        vm.lastUpdated = new Date();
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load credit card data. Please try again.';
        vm.loading = false;
      });
    }

    function init() {
      loadDashboardData();
      DataRefreshService.startAutoRefresh(loadDashboardData);
    }

    $scope.$on('$destroy', function() {
      DataRefreshService.stopAutoRefresh();
    });

    init();
  }]);
})();