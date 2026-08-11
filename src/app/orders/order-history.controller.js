(function() {
  'use strict';
  angular.module('onlineShoppingApp').controller('OrderHistoryController', ['OrderService', 'AuthService', 'ToastFactory', '$scope', OrderHistoryController]);
  function OrderHistoryController(OrderService, AuthService, ToastFactory, $scope) {
    var vm = this;
    vm.orders = [];
    vm.loading = true;
    vm.loadOrders = function() {
      var user = AuthService.getUser();
      if (!user) {
        ToastFactory.error('Please login to view orders');
        vm.loading = false;
        return;
      }
      OrderService.getOrderHistory(user.userId).then(function(orders) {
        vm.orders = orders;
        vm.loading = false;
      }).catch(function(error) {
        ToastFactory.error('Failed to load orders');
        vm.loading = false;
      });
    };
    vm.loadOrders();
  }
})();