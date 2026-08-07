(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .controller('InventoryController', ['inventoryService', 'alertService', '$scope', function(inventoryService, alertService, $scope) {
      var vm = this;
      vm.inventory = [];
      vm.sellerId = 'current';
      vm.alerts = [];
      vm.loadInventory = function() {
        inventoryService.getInventory(vm.sellerId).then(function(inventory) {
          vm.inventory = inventory;
        }, function(error) {
          toastr.error('Failed to load inventory');
        });
      };
      vm.updateStock = function(item) {
        var stockData = {
          currentStock: item.currentStock,
          lowStockThreshold: item.lowStockThreshold
        };
        inventoryService.updateStock(item.productId, stockData).then(function(response) {
          toastr.success('Stock updated successfully');
        }, function(error) {
          toastr.error('Failed to update stock');
        });
      };
      vm.handleLowStockAlert = function(item) {
        vm.alerts.push({
          productId: item.productId,
          productName: item.productName,
          currentStock: item.currentStock,
          threshold: item.lowStockThreshold,
          timestamp: new Date()
        });
        toastr.warning('Low stock alert: ' + item.productName + ' (Stock: ' + item.currentStock + ')');
      };
      inventoryService.startMonitoring(vm.sellerId, vm.handleLowStockAlert);
      $scope.$on('$destroy', function() {
        inventoryService.stopMonitoring();
      });
      vm.loadInventory();
    }]);
})();