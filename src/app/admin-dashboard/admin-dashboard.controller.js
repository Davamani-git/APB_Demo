(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .controller('AdminDashboardController', ['systemHealthService', '$scope', '$interval', function(systemHealthService, $scope, $interval) {
      var vm = this;
      vm.metrics = null;
      vm.analytics = null;
      vm.refreshInterval = null;
      vm.loadDashboard = function() {
        systemHealthService.getMetrics().then(function(metrics) {
          vm.metrics = metrics;
        }, function(error) {
          toastr.error('Failed to load system health metrics');
        });
        systemHealthService.getPlatformAnalytics().then(function(analytics) {
          vm.analytics = analytics;
        }, function(error) {
          toastr.error('Failed to load platform analytics');
        });
      };
      vm.startAutoRefresh = function() {
        vm.refreshInterval = $interval(function() {
          vm.loadDashboard();
        }, 30000);
      };
      $scope.$on('$destroy', function() {
        if (vm.refreshInterval) {
          $interval.cancel(vm.refreshInterval);
        }
      });
      vm.loadDashboard();
      vm.startAutoRefresh();
    }]);
})();