(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .controller('OrderController', ['$scope', 'OrderService', 'NotificationService', function($scope, OrderService, NotificationService) {
      var vm = this;
      vm.orders = [];
      vm.sellerId = sessionStorage.getItem('sellerId');
      vm.init = function() {
        vm.loadOrders();
      };
      vm.loadOrders = function() {
        if (!vm.sellerId) {
          NotificationService.showNotification('Seller ID not found', 'error');
          return;
        }
        OrderService.getOrders(vm.sellerId)
          .then(function(orders) {
            vm.orders = orders;
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to load orders: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.updateOrderStatus = function(orderId, status) {
        if (!orderId || !status) {
          NotificationService.showNotification('Invalid order data', 'error');
          return;
        }
        OrderService.updateOrderStatus(orderId, status)
          .then(function(response) {
            NotificationService.showNotification('Order status updated successfully', 'success');
            vm.loadOrders();
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to update order status: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.updateShippingInfo = function(orderId, trackingId) {
        if (!orderId || !trackingId) {
          NotificationService.showNotification('Invalid shipping data', 'error');
          return;
        }
        OrderService.updateShippingInfo(orderId, trackingId)
          .then(function(response) {
            NotificationService.showNotification('Shipping info updated successfully', 'success');
            vm.loadOrders();
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to update shipping info: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.init();
    }]);
})();