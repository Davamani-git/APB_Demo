(function() {
  'use strict';
  angular.module('creditCardDashboard')
    .controller('DashboardController', ['KPIAggregationService', 'DataRefreshService', '$scope', function(KPIAggregationService, DataRefreshService, $scope) {
      var vm = this;
      vm.kpis = {};
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        vm.loadKPIs();
        DataRefreshService.startAutoRefresh(function(kpis) {
          vm.kpis = kpis;
          $scope.$apply();
        });
      };
      vm.loadKPIs = function() {
        vm.loading = true;
        vm.error = null;
        KPIAggregationService.getAggregatedKPIs()
          .then(function(kpis) {
            vm.kpis = kpis;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data';
            vm.loading = false;
          });
      };
      vm.refresh = function() {
        KPIAggregationService.clearCache();
        vm.loadKPIs();
      };
      $scope.$on('$destroy', function() {
        DataRefreshService.stopAutoRefresh();
      });
      vm.init();
    }]);
})();