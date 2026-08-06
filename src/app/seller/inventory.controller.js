(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('InventoryController', ['$scope', '$interval', 'InventoryService', 'NotificationService', function($scope, $interval, InventoryService, NotificationService) {
    var vm = this;
    vm.inventory = [];
    vm.loading = false;
    var pollingInterval = null;
    vm.init = function() {
      vm.loadInventory();
      pollingInterval = $interval(function() {
        vm.refreshInventory();
      }, 60000);
    };
    vm.loadInventory = function() {
      vm.loading = true;
      InventoryService.getInventory().then(function(inventory) {
        vm.inventory = inventory;
        vm.checkLowStock();
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        alert('Failed to load inventory.');
        console.error('Error loading inventory:', error);
      });
    };
    vm.refreshInventory = function() {
      InventoryService.getInventory().then(function(inventory) {
        vm.inventory = inventory;
        vm.checkLowStock();
      }).catch(function(error) {
        console.error('Error refreshing inventory:', error);
      });
    };
    vm.updateStock = function(item) {
      InventoryService.updateStock(item.productId, item.currentStock).then(function() {
        alert('Stock updated successfully!');
      }).catch(function(error) {
        alert('Failed to update stock.');
        console.error('Error updating stock:', error);
      });
    };
    vm.checkLowStock = function() {
      vm.inventory.forEach(function(item) {
        if (item.currentStock <= item.lowStockThreshold && !item.alertSent) {
          NotificationService.sendLowStockAlert(item.productId, item.currentStock);
          item.alertSent = true;
        }
      });
    };
    $scope.$on('$destroy', function() {
      if (pollingInterval) {
        $interval.cancel(pollingInterval);
      }
    });
    vm.init();
  }]);
})();