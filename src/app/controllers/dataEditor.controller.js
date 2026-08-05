(function () {
  'use strict';

  angular
    .module('execSummary.controllers')
    .controller('DataEditorController', [
      'scope',
      'ScopeDataService',
      'ValidationService',
      'LoggingService',
      'ErrorHandlingService',
      '$uibModalInstance',
      function (scope, ScopeDataService, ValidationService, LoggingService, ErrorHandlingService, $uibModalInstance) {
        var vm = this;

        vm.scope = scope;
        vm.errors = {};

        vm.onFieldChange = function (fieldName) {
          var validation = ValidationService.validateScope(angular.copy(vm.scope));
          vm.errors = validation.errors;
        };

        vm.save = function () {
          var validation = ValidationService.validateScope(angular.copy(vm.scope));
          vm.errors = validation.errors;
          if (!validation.valid) {
            ErrorHandlingService.handleValidationError(validation.errors, 'scope');
            return;
          }
          var result = ScopeDataService.updateScope(vm.scope);
          if (!result.valid) {
            vm.errors = result.errors;
            ErrorHandlingService.handleValidationError(result.errors, 'scope');
            return;
          }
          LoggingService.audit('SCOPE_UPDATE', {
            scopeId: vm.scope.id,
            fieldName: 'scope',
            oldValue: null,
            newValue: vm.scope
          });
          $uibModalInstance.close(vm.scope);
        };

        vm.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }
    ]);
})();