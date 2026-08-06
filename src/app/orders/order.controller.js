(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('OrderController', ['$scope', '$routeParams', 'OrderService', 'NotificationService', 'RefundService', function($scope, $routeParams, OrderService, NotificationService, RefundService) {
    var vm = this;
    vm.order = null;
    vm.loading = false;
    vm.cancelling = false;
    vm.init = function() {
      vm.loading = true;
      var orderId = $routeParams.id;
      OrderService.getOrderDetails(orderId).then(function(order) {
        vm.order = order;
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        alert('Failed to load order details.');
        console.error('Error loading order:', error);
      });
    };
    vm.cancelOrder = function() {
      if (!confirm('Are you sure you want to cancel this order? A refund will be initiated.')) {
        return;
      }
      vm.cancelling = true;
      RefundService.requestRefund(vm.order.orderId, vm.order.totalAmount, 'Customer requested cancellation').then(function(refundResult) {
        return OrderService.updateOrderStatus(vm.order.orderId, 'Cancelled');
      }).then(function() {
        NotificationService.sendRefundConfirmation(vm.order.orderId, vm.order.totalAmount);
        alert('Order cancelled successfully. Refund will be processed within 24 hours.');
        vm.order.orderStatus = 'Cancelled';
        vm.cancelling = false;
      }).catch(function(error) {
        vm.cancelling = false;
        alert('Failed to cancel order: ' + (error.message || 'Please try again.'));
        console.error('Error cancelling order:', error);
      });
    };
    vm.init();
  }]);
})();