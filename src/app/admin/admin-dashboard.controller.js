(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('AdminDashboardController', ['$scope', 'AnalyticsService', 'UserManagementService', 'FraudMonitoringService', function($scope, AnalyticsService, UserManagementService, FraudMonitoringService) {
    var vm = this;
    vm.metrics = {};
    vm.fraudAlerts = [];
    vm.loading = false;
    vm.init = function() {
      vm.loading = true;
      AnalyticsService.getPlatformMetrics().then(function(metrics) {
        vm.metrics = metrics;
        return FraudMonitoringService.getFraudAlerts();
      }).then(function(alerts) {
        vm.fraudAlerts = alerts;
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        console.error('Error loading admin dashboard:', error);
      });
    };
    vm.investigateFraud = function(alert) {
      FraudMonitoringService.investigateAccount(alert.accountId).then(function() {
        alert('Investigation initiated for account ' + alert.accountId);
      }).catch(function(error) {
        alert('Failed to initiate investigation.');
        console.error('Error investigating fraud:', error);
      });
    };
    vm.init();
  }]);
})();