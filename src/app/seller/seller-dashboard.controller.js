(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('SellerDashboardController', ['$scope', 'AnalyticsService', 'OrderManagementService', 'InventoryService', function($scope, AnalyticsService, OrderManagementService, InventoryService) {
    var vm = this;
    vm.metrics = {};
    vm.recentOrders = [];
    vm.lowStockProducts = [];
    vm.loading = false;
    vm.init = function() {
      vm.loading = true;
      AnalyticsService.getSellerMetrics().then(function(metrics) {
        vm.metrics = metrics;
        return OrderManagementService.getRecentOrders(5);
      }).then(function(orders) {
        vm.recentOrders = orders;
        return InventoryService.getLowStockProducts();
      }).then(function(products) {
        vm.lowStockProducts = products;
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        console.error('Error loading dashboard:', error);
      });
    };
    vm.init();
  }]);
})();