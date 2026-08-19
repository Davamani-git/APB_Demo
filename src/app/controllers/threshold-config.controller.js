(function() {
  'use strict';
  angular.module('fraudAlertApp')
    .controller('ThresholdConfigController', ['$scope', 'ConfigService', 'RiskThresholdFactory', function($scope, ConfigService, RiskThresholdFactory) {
      var vm = this;
      vm.thresholds = {};
      vm.loading = true;
      vm.error = null;
      vm.success = null;

      vm.init = function() {
        vm.loadThresholds();
      };

      vm.loadThresholds = function() {
        vm.loading = true;
        vm.error = null;
        RiskThresholdFactory.getThresholds()
          .then(function(thresholds) {
            vm.thresholds = angular.copy(thresholds);
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Error loading thresholds: ' + (error.message || error);
            vm.loading = false;
            $scope.$apply();
          });
      };

      vm.saveThresholds = function() {
        vm.error = null;
        vm.success = null;
        vm.loading = true;

        RiskThresholdFactory.updateThresholds(vm.thresholds)
          .then(function(updated) {
            vm.thresholds = angular.copy(updated);
            vm.success = 'Thresholds updated successfully';
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Error updating thresholds: ' + (error.message || error);
            vm.loading = false;
            $scope.$apply();
          });
      };

      vm.resetToDefaults = function() {
        ConfigService.getDefaultThresholds()
          .then(function(defaults) {
            vm.thresholds = angular.copy(defaults);
            $scope.$apply();
          });
      };

      vm.init();
    }]);
})();