(function() {
  'use strict';
  angular.module('onlineShoppingApp').controller('OrderDetailController', ['OrderService', 'ToastFactory', '$routeParams', '$scope', OrderDetailController]);
  function OrderDetailController(OrderService, ToastFactory, $routeParams, $scope) {
    var vm = this;
    vm.order = null;
    vm.loading = true;
    vm.loadOrder = function() {
      OrderService.getOrderById($routeParams.orderId).then(function(order) {
        vm.order = order;
        vm.loading = false;
      }).catch(function(error) {
        ToastFactory.error('Order not found');
        vm.loading = false;
      });
    };
    vm.cancelOrder = function() {
      if (!confirm('Are you sure you want to cancel this order?')) {
        return;
      }
      OrderService.cancelOrder(vm.order.orderId).then(function(order) {
        vm.order = order;
        ToastFactory.success('Order cancelled successfully. Refund will be processed within 24 hours.');
      }).catch(function(error) {
        ToastFactory.error('Failed to cancel order');
      });
    };
    vm.loadOrder();
  }
})();