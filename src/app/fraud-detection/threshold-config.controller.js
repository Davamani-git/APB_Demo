(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .controller('thresholdConfigController', ['$scope', 'configService', 'policyDecisionService', function($scope, configService, policyDecisionService) {
      const vm = this;
      vm.config = null;
      vm.loading = false;
      vm.saving = false;
      vm.error = null;
      vm.success = null;
      vm.init = function() {
        vm.loading = true;
        configService.getThresholds().then(function(config) {
          vm.config = angular.copy(config);
        }).catch(function(error) {
          vm.error = error.message || 'Failed to load configuration';
        }).finally(function() {
          vm.loading = false;
        });
      };
      vm.saveConfig = function() {
        if (!vm.validateConfig()) {
          vm.error = 'Invalid threshold configuration';
          return;
        }
        vm.saving = true;
        vm.error = null;
        vm.success = null;
        vm.config.lastModified = new Date().toISOString();
        vm.config.modifiedBy = sessionStorage.getItem('username') || 'system';
        configService.updateThresholds(vm.config).then(function(response) {
          vm.success = 'Configuration updated successfully';
          vm.config = angular.copy(response);
        }).catch(function(error) {
          vm.error = error.message || 'Failed to update configuration';
        }).finally(function() {
          vm.saving = false;
        });
      };
      vm.validateConfig = function() {
        if (!vm.config) return false;
        if (vm.config.lowRiskThreshold >= vm.config.mediumRiskThreshold) return false;
        if (vm.config.mediumRiskThreshold >= vm.config.highRiskThreshold) return false;
        if (vm.config.lowRiskThreshold < 0 || vm.config.highRiskThreshold > 100) return false;
        return true;
      };
      vm.resetConfig = function() {
        vm.init();
        vm.error = null;
        vm.success = null;
      };
      vm.init();
    }]);
})();