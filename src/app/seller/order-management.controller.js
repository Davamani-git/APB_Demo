(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('OrderManagementController', ['$scope', 'OrderManagementService', function($scope, OrderManagementService) {
    var vm = this;
    vm.orders = [];
    vm.loading = false;
    vm.statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    vm.init = function() {
      vm.loadOrders();
    };
    vm.loadOrders = function() {
      vm.loading = true;
      OrderManagementService.getSellerOrders().then(function(orders) {
        vm.orders = orders;
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        alert('Failed to load orders.');
        console.error('Error loading orders:', error);
      });
    };
    vm.updateOrderStatus = function(order) {
      OrderManagementService.updateOrderStatus(order.orderId, order.fulfillmentStatus).then(function() {
        alert('Order status updated successfully!');
      }).catch(function(error) {
        alert('Failed to update order status.');
        console.error('Error updating order:', error);
      });
    };
    vm.init();
  }]);
})();