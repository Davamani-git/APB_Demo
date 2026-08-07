(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .controller('FraudController', ['fraudDetectionService', 'userService', '$scope', function(fraudDetectionService, userService, $scope) {
      var vm = this;
      vm.alerts = [];
      vm.selectedAlert = null;
      vm.loadAlerts = function() {
        fraudDetectionService.getAlerts().then(function(alerts) {
          vm.alerts = alerts;
        }, function(error) {
          toastr.error('Failed to load fraud alerts');
        });
      };
      vm.reviewAlert = function(alert) {
        vm.selectedAlert = alert;
      };
      vm.lockAccount = function(userId) {
        if (!confirm('Are you sure you want to lock this account?')) {
          return;
        }
        userService.lockAccount(userId).then(function(response) {
          toastr.success('Account locked successfully');
          if (vm.selectedAlert) {
            fraudDetectionService.updateAlertStatus(vm.selectedAlert.alertId, 'resolved').then(function() {
              vm.loadAlerts();
              vm.selectedAlert = null;
            });
          }
        }, function(error) {
          toastr.error('Failed to lock account');
        });
      };
      vm.dismissAlert = function(alertId) {
        fraudDetectionService.updateAlertStatus(alertId, 'dismissed').then(function() {
          toastr.success('Alert dismissed');
          vm.loadAlerts();
          vm.selectedAlert = null;
        }, function(error) {
          toastr.error('Failed to dismiss alert');
        });
      };
      vm.handleAlertUpdate = function(alerts) {
        vm.alerts = alerts;
        $scope.$apply();
      };
      fraudDetectionService.startMonitoring(vm.handleAlertUpdate);
      $scope.$on('$destroy', function() {
        fraudDetectionService.stopMonitoring();
      });
      vm.loadAlerts();
    }]);
})();