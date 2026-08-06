(function() {
  'use strict';
  angular.module('executiveDashboardApp').controller('DataManagementController', ['$scope', '$rootScope', 'DataStorageService', function($scope, $rootScope, DataStorageService) {
    var vm = this;
    vm.kpiData = [];
    vm.scopeData = [];
    function init() {
      loadData();
    }
    function loadData() {
      try {
        vm.kpiData = DataStorageService.getKpiData();
        vm.scopeData = DataStorageService.getScopeData();
      } catch(e) {
        console.error('Error loading data for editor:', e);
      }
    }
    vm.updateKpiData = function() {
      try {
        DataStorageService.saveKpiData(vm.kpiData);
        $rootScope.$broadcast('data:updated');
      } catch(e) {
        console.error('Error updating KPI data:', e);
      }
    };
    vm.updateScopeData = function() {
      try {
        DataStorageService.saveScopeData(vm.scopeData);
        $rootScope.$broadcast('data:updated');
      } catch(e) {
        console.error('Error updating scope data:', e);
      }
    };
    init();
  }]);
})();