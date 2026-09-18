(function() {
  'use strict';
  angular.module('providerEnrollmentApp').controller('PayerRuleAdminController', ['$scope', 'PayerRuleService', 'AuthService', 'AuditService', PayerRuleAdminController]);
  function PayerRuleAdminController($scope, PayerRuleService, AuthService, AuditService) {
    var vm = this;
    vm.ruleSets = [];
    vm.selectedRuleSet = null;
    vm.editMode = false;
    vm.newRuleSet = { payerName: '', effectiveDate: '', requiredDocuments: [], requiredFields: [] };
    vm.loading = false;
    vm.init = function() {
      vm.loading = true;
      AuthService.getCurrentUser().then(function(user) {
        vm.currentUser = user;
        if (!AuthService.hasRole('Administrator')) {
          alert('Access denied. Administrator role required.');
          return;
        }
        return vm.loadRuleSets();
      }).finally(function() {
        vm.loading = false;
      });
    };
    vm.loadRuleSets = function() {
      return PayerRuleService.getAllRuleSets().then(function(ruleSets) {
        vm.ruleSets = ruleSets;
      });
    };
    vm.selectRuleSet = function(ruleSet) {
      vm.selectedRuleSet = angular.copy(ruleSet);
      vm.editMode = false;
    };
    vm.editRuleSet = function() {
      vm.editMode = true;
    };
    vm.saveRuleSet = function() {
      vm.loading = true;
      var promise = vm.selectedRuleSet.id ? PayerRuleService.updateRuleSet(vm.selectedRuleSet.id, vm.selectedRuleSet) : PayerRuleService.createRuleSet(vm.selectedRuleSet);
      promise.then(function(saved) {
        vm.editMode = false;
        return vm.loadRuleSets();
      }).then(function() {
        return AuditService.logEvent({ eventType: 'RuleSetModified', ruleSetId: vm.selectedRuleSet.id, userId: vm.currentUser.userId });
      }).finally(function() {
        vm.loading = false;
      });
    };
    vm.deactivateRuleSet = function(ruleSetId) {
      if (!confirm('Are you sure you want to deactivate this rule set?')) return;
      vm.loading = true;
      PayerRuleService.deactivateRuleSet(ruleSetId).then(function() {
        return vm.loadRuleSets();
      }).then(function() {
        return AuditService.logEvent({ eventType: 'RuleSetDeactivated', ruleSetId: ruleSetId, userId: vm.currentUser.userId });
      }).finally(function() {
        vm.loading = false;
      });
    };
    vm.addNewRuleSet = function() {
      vm.selectedRuleSet = angular.copy(vm.newRuleSet);
      vm.editMode = true;
    };
    vm.cancelEdit = function() {
      vm.editMode = false;
      vm.selectedRuleSet = null;
    };
    vm.init();
  }
  PayerRuleAdminController.$inject = ['$scope', 'PayerRuleService', 'AuthService', 'AuditService'];
})();