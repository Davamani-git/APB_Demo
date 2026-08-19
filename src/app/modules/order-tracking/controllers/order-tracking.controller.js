(function() {
  'use strict';
  angular.module('orderTracking')
    .controller('OrderTrackingController', ['$scope', '$routeParams', 'OrderStatusService', 'WebSocketService', 'ETAService', function($scope, $routeParams, OrderStatusService, WebSocketService, ETAService) {
      var vm = this;
      vm.orderId = $routeParams.orderId;
      vm.orderStatus = null;
      vm.eta = null;
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        OrderStatusService.getOrderStatus(vm.orderId)
          .then(function(data) {
            vm.orderStatus = data;
            $scope.orderStatus = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load order status';
            vm.loading = false;
          });
        ETAService.getETA(vm.orderId)
          .then(function(data) {
            vm.eta = data;
            $scope.eta = data;
          })
          .catch(function() {
            vm.eta = { eta: null, confidence: 'low' };
          });
        WebSocketService.connect(vm.orderId);
        ETAService.startAutoRefresh(vm.orderId, function(data) {
          vm.eta = data;
          $scope.eta = data;
        });
      };
      $scope.$on('websocket:message', function(event, data) {
        if (data.eventId && OrderStatusService.isEventProcessed(data.eventId)) {
          return;
        }
        if (vm.orderStatus && OrderStatusService.validateTransition(vm.orderStatus.currentStatus, data.status)) {
          vm.orderStatus.currentStatus = data.status;
          vm.orderStatus.statusHistory = vm.orderStatus.statusHistory || [];
          vm.orderStatus.statusHistory.push({
            status: data.status,
            timestamp: data.timestamp,
            eventId: data.eventId
          });
          vm.orderStatus.lastUpdated = new Date();
          $scope.orderStatus = vm.orderStatus;
          if (data.eventId) {
            OrderStatusService.markEventProcessed(data.eventId);
          }
        }
      });
      $scope.$on('websocket:error', function() {
        vm.error = 'Connection error. Retrying...';
      });
      $scope.$on('websocket:disconnected', function() {
        vm.error = 'Disconnected. Reconnecting...';
      });
      $scope.$on('websocket:connected', function() {
        vm.error = null;
      });
      $scope.$on('$destroy', function() {
        WebSocketService.disconnect();
        ETAService.stopAutoRefresh();
      });
      vm.init();
    }]);
})();