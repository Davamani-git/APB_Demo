(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .controller('InventoryController', ['$scope', 'InventoryService', 'NotificationService', function($scope, InventoryService, NotificationService) {
      var vm = this;
      vm.inventory = [];
      vm.sellerId = sessionStorage.getItem('sellerId');
      vm.init = function() {
        vm.loadInventory();
        InventoryService.connectWebSocket(vm.sellerId);
        $scope.$on('inventory:update', function(event, data) {
          if (data.isLowStock) {
            NotificationService.showNotification('Low inventory alert for product: ' + data.productId, 'warning');
          }
          vm.loadInventory();
        });
      };
      vm.loadInventory = function() {
        if (!vm.sellerId) {
          NotificationService.showNotification('Seller ID not found', 'error');
          return;
        }
        InventoryService.getAllInventory(vm.sellerId)
          .then(function(inventory) {
            vm.inventory = inventory;
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to load inventory: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.updateInventory = function(item) {
        if (!item.inventoryId || item.quantity < 0) {
          NotificationService.showNotification('Invalid inventory data', 'error');
          return;
        }
        InventoryService.updateInventory(item.inventoryId, { quantity: item.quantity })
          .then(function(response) {
            NotificationService.showNotification('Inventory updated successfully', 'success');
            vm.loadInventory();
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to update inventory: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.setThreshold = function(item) {
        if (!item.inventoryId || item.lowStockThreshold < 0) {
          NotificationService.showNotification('Invalid threshold value', 'error');
          return;
        }
        InventoryService.setThreshold(item.inventoryId, item.lowStockThreshold)
          .then(function(response) {
            NotificationService.showNotification('Threshold updated successfully', 'success');
            vm.loadInventory();
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to update threshold: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      $scope.$on('$destroy', function() {
        InventoryService.disconnectWebSocket();
      });
      vm.init();
    }]);
})();