(function() {
  'use strict';
  angular.module('app.shopping')
    .controller('OrderController', ['$scope', 'OrderService', 'NotificationService', function($scope, OrderService, NotificationService) {
      var vm = this;
      vm.orders = [];
      vm.selectedOrder = null;
      vm.trackingInfo = null;
      vm.loading = false;
      vm.error = null;
      vm.init = function() {
        vm.loadOrders();
      };
      vm.loadOrders = function() {
        vm.loading = true;
        vm.error = null;
        OrderService.getOrderHistory()
          .then(function(data) {
            vm.orders = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load orders. Please try again.';
            vm.loading = false;
            NotificationService.showNotification('Error loading orders', 'error');
          });
      };
      vm.viewOrderDetails = function(order) {
        vm.selectedOrder = order;
        vm.trackOrder(order.orderId);
      };
      vm.trackOrder = function(orderId) {
        OrderService.trackOrder(orderId)
          .then(function(data) {
            vm.trackingInfo = data;
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to load tracking info', 'error');
          });
      };
      vm.cancelOrder = function(orderId) {
        if (confirm('Are you sure you want to cancel this order?')) {
          OrderService.cancelOrder(orderId)
            .then(function(data) {
              NotificationService.showNotification('Order cancelled successfully', 'success');
              vm.loadOrders();
            })
            .catch(function(error) {
              NotificationService.showNotification('Failed to cancel order', 'error');
            });
        }
      };
      vm.requestRefund = function(orderId) {
        if (confirm('Are you sure you want to request a refund for this order?')) {
          OrderService.requestRefund(orderId)
            .then(function(data) {
              NotificationService.showNotification('Refund request submitted', 'success');
              vm.loadOrders();
            })
            .catch(function(error) {
              NotificationService.showNotification('Failed to request refund', 'error');
            });
        }
      };
      vm.closeDetails = function() {
        vm.selectedOrder = null;
        vm.trackingInfo = null;
      };
      vm.init();
    }]);
})();