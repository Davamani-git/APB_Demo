(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('OrderTrackingController', ['$scope', '$interval', 'OrderTrackingService', 'OrderService', function($scope, $interval, OrderTrackingService, OrderService) {
    var vm = this;
    vm.orders = [];
    vm.loading = false;
    vm.selectedOrder = null;
    vm.trackingInfo = null;
    var pollingInterval = null;
    vm.init = function() {
      vm.loadOrders();
      pollingInterval = $interval(function() {
        if (vm.selectedOrder) {
          vm.refreshTracking(vm.selectedOrder.orderId);
        }
      }, 30000);
    };
    vm.loadOrders = function() {
      vm.loading = true;
      OrderService.getUserOrders().then(function(orders) {
        vm.orders = orders;
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        alert('Failed to load orders.');
        console.error('Error loading orders:', error);
      });
    };
    vm.viewTracking = function(order) {
      vm.selectedOrder = order;
      OrderTrackingService.getTrackingInfo(order.orderId).then(function(trackingInfo) {
        vm.trackingInfo = trackingInfo;
      }).catch(function(error) {
        alert('Failed to load tracking information.');
        console.error('Error loading tracking:', error);
      });
    };
    vm.refreshTracking = function(orderId) {
      OrderTrackingService.getTrackingInfo(orderId).then(function(trackingInfo) {
        vm.trackingInfo = trackingInfo;
      }).catch(function(error) {
        console.error('Error refreshing tracking:', error);
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