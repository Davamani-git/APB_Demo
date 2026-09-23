(function() {
  'use strict';
  angular.module('creditDashboardApp').controller('DashboardController', ['CardService', 'KpiService', '$q', '$scope', function(CardService, KpiService, $q, $scope) {
    var vm = this;
    vm.cards = [];
    vm.kpiSummary = {};
    vm.loading = true;
    vm.error = null;
    vm.selectedMonth = '2025-02';
    vm.loadDashboard = function() {
      vm.loading = true;
      vm.error = null;
      $q.all([
        CardService.getCards('user123'),
        KpiService.getKpis('user123', vm.selectedMonth)
      ]).then(function(results) {
        vm.cards = results[0];
        vm.kpiSummary = results[1];
        vm.loading = false;
        $scope.$apply();
      }).catch(function(err) {
        vm.error = 'Failed to load dashboard data';
        vm.loading = false;
        $scope.$apply();
      });
    };
    vm.loadDashboard();
  }]);
  angular.module('creditDashboardApp').controller('DashboardController').$inject = ['CardService', 'KpiService', '$q', '$scope'];
})();