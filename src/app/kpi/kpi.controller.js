(function() {
  'use strict';
  angular
    .module('execDashboard.kpi')
    .controller('KpiController', KpiController);

  KpiController.$inject = ['DataStoreService', 'ValidationService', 'AuditService', 'SecurityService', '$scope'];
  function KpiController(DataStoreService, ValidationService, AuditService, SecurityService, $scope) {
    var vm = this;
    vm.kpis = DataStoreService.getKpis();
    vm.editingKpi = null;
    vm.editedKpi = null;

    vm.editKpi = function(kpi) {
      vm.editingKpi = kpi;
      vm.editedKpi = angular.copy(kpi);
    };

    vm.saveKpi = function() {
      if (!vm.editedKpi) {
        return;
      }
      vm.editedKpi.name = SecurityService.sanitizeText(vm.editedKpi.name);
      vm.editedKpi.description = SecurityService.sanitizeText(vm.editedKpi.description);
      var validation = ValidationService.validateKpi(vm.editedKpi);
      if (!validation.valid) {
        var errors = validation.errors;
        $scope.$emit('kpi:validationErrors', errors);
        return;
      }
      DataStoreService.updateKpi(vm.editedKpi.id, vm.editedKpi);
      AuditService.logEvent('DATA_EDIT', {
        entityType: 'KPI',
        id: vm.editedKpi.id,
        name: vm.editedKpi.name
      });
      vm.editingKpi = null;
      vm.editedKpi = null;
      vm.kpis = DataStoreService.getKpis();
      vm.recalculateAggregates();
    };

    vm.recalculateAggregates = function() {
    };

    DataStoreService.onChange(function(newState) {
      vm.kpis = newState.kpis || [];
    });
  }
})();
