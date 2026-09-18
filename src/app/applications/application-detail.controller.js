(function() {
  'use strict';
  angular.module('providerEnrollmentApp').controller('ApplicationDetailController', ['$scope', '$routeParams', '$timeout', 'ApplicationService', 'ReadinessService', 'DocumentService', 'AuditService', ApplicationDetailController]);
  function ApplicationDetailController($scope, $routeParams, $timeout, ApplicationService, ReadinessService, DocumentService, AuditService) {
    var vm = this;
    vm.application = null;
    vm.payerStatuses = [];
    vm.selectedPayer = null;
    vm.requirementDetails = [];
    vm.auditTrail = [];
    vm.loading = false;
    vm.showAuditTrail = false;
    vm.init = function() {
      vm.loading = true;
      ApplicationService.getApplication($routeParams.id).then(function(application) {
        vm.application = application;
        return ReadinessService.getApplicationStatus(application.id);
      }).then(function(statusData) {
        vm.payerStatuses = statusData.payerStatuses;
        if (vm.payerStatuses.length > 0) {
          vm.selectPayer(vm.payerStatuses[0]);
        }
      }).finally(function() {
        vm.loading = false;
      });
    };
    vm.selectPayer = function(payerStatus) {
      vm.selectedPayer = payerStatus;
      ReadinessService.getRequirementDetails(vm.application.id, payerStatus.payerId).then(function(requirements) {
        vm.requirementDetails = requirements;
      });
    };
    vm.onDocumentUploaded = function() {
      $timeout(function() {
        ReadinessService.evaluateApplication(vm.application.id).then(function() {
          return ReadinessService.getApplicationStatus(vm.application.id);
        }).then(function(statusData) {
          vm.payerStatuses = statusData.payerStatuses;
          if (vm.selectedPayer) {
            var updated = vm.payerStatuses.find(function(ps) { return ps.payerId === vm.selectedPayer.payerId; });
            if (updated) vm.selectPayer(updated);
          }
        });
      }, 500);
    };
    vm.loadAuditTrail = function() {
      vm.showAuditTrail = !vm.showAuditTrail;
      if (vm.showAuditTrail && vm.auditTrail.length === 0) {
        AuditService.getAuditTrail(vm.application.id).then(function(trail) {
          vm.auditTrail = trail;
        });
      }
    };
    vm.init();
  }
  ApplicationDetailController.$inject = ['$scope', '$routeParams', '$timeout', 'ApplicationService', 'ReadinessService', 'DocumentService', 'AuditService'];
})();