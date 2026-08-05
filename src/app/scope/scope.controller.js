(function() {
  'use strict';
  angular
    .module('execDashboard.scope')
    .controller('ScopeController', ScopeController);

  ScopeController.$inject = ['DataStoreService', 'ValidationService', 'AuditService', 'SecurityService', '$scope'];
  function ScopeController(DataStoreService, ValidationService, AuditService, SecurityService, $scope) {
    var vm = this;
    vm.scopes = DataStoreService.getScopes();
    vm.filterStatus = null;
    vm.editingScope = null;
    vm.editedScope = null;

    vm.addScope = function() {
      vm.editingScope = {};
      vm.editedScope = {
        id: 'scope-' + new Date().getTime(),
        name: '',
        status: 'Not Started',
        totalCases: 0,
        executedCases: 0,
        passedCases: 0
      };
    };

    vm.editScope = function(scope) {
      vm.editingScope = scope;
      vm.editedScope = angular.copy(scope);
    };

    vm.saveScope = function() {
      if (!vm.editedScope) {
        return;
      }
      vm.editedScope.name = SecurityService.sanitizeText(vm.editedScope.name);
      vm.editedScope.notes = SecurityService.sanitizeText(vm.editedScope.notes);
      var validation = ValidationService.validateScope(vm.editedScope);
      if (!validation.valid) {
        var errors = validation.errors;
        $scope.$emit('scope:validationErrors', errors);
        return;
      }
      if (vm.editingScope && vm.editingScope.id) {
        DataStoreService.updateScope(vm.editedScope.id, vm.editedScope);
      } else {
        DataStoreService.addScope(vm.editedScope);
      }
      AuditService.logEvent('DATA_EDIT', {
        entityType: 'SCOPE',
        id: vm.editedScope.id,
        name: vm.editedScope.name
      });
      vm.editingScope = null;
      vm.editedScope = null;
      vm.scopes = DataStoreService.getScopes();
    };

    vm.filterByStatus = function(status) {
      vm.filterStatus = status;
    };

    vm.calculateReadiness = function(scope) {
      var total = scope.totalCases || 0;
      var passed = scope.passedCases || 0;
      if (scope.status === 'Completed' && total > 0 && passed / total >= 0.95) {
        return 'Ready';
      }
      if (scope.status === 'Completed') {
        return 'Not Ready';
      }
      return 'Unknown';
    };

    DataStoreService.onChange(function(newState) {
      vm.scopes = newState.scopes || [];
    });
  }
})();
