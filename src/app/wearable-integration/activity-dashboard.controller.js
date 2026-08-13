(function() {
  'use strict';
  angular.module('wearableIntegrationApp')
    .controller('ActivityDashboardController', ['$scope', '$filter', 'HealthDataService', 'SyncService', function($scope, $filter, HealthDataService, SyncService) {
      var vm = this;
      vm.dailySummary = null;
      vm.loading = true;
      vm.error = null;
      vm.loadDashboard = function() {
        vm.loading = true;
        vm.error = null;
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        HealthDataService.getDailySummary(today)
          .then(function(data) {
            vm.dailySummary = data;
            vm.loading = false;
          })
          .catch(function(err) {
            vm.error = 'Failed to load dashboard data.';
            vm.loading = false;
            console.error('Dashboard load error:', err);
          });
      };
      vm.refreshDashboard = function() {
        vm.loadDashboard();
      };
      vm.loadDashboard();
      SyncService.startSync();
      $scope.$on('$destroy', function() {
        SyncService.stopSync();
      });
    }]);
})();