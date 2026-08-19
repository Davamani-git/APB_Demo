angular.module('fraudDetectionApp').controller('ThresholdAdminController', ['ThresholdConfigFactory', '$scope', 'PolicyDecisionService', function(ThresholdConfigFactory, $scope, PolicyDecisionService) {
  var vm = this;
  vm.thresholds = [];
  vm.loading = false;
  vm.error = null;
  vm.editMode = false;
  vm.currentThreshold = null;

  vm.init = function() {
    vm.loadThresholds();
  };

  vm.loadThresholds = function() {
    vm.loading = true;
    vm.error = null;
    ThresholdConfigFactory.getThresholds().then(function(thresholds) {
      vm.thresholds = thresholds;
      vm.loading = false;
    }).catch(function(error) {
      vm.error = 'Failed to load thresholds: ' + (error.data ? error.data.message : error.statusText);
      vm.loading = false;
    });
  };

  vm.createThreshold = function() {
    vm.editMode = true;
    vm.currentThreshold = {
      thresholdId: '',
      level: 'medium',
      minScore: 0,
      maxScore: 100,
      action: 'alert',
      enabled: true,
      updatedBy: 'ADMIN',
      updatedAt: new Date()
    };
  };

  vm.editThreshold = function(threshold) {
    vm.editMode = true;
    vm.currentThreshold = angular.copy(threshold);
  };

  vm.saveThreshold = function() {
    if (!vm.validateThreshold(vm.currentThreshold)) {
      vm.error = 'Invalid threshold configuration';
      return;
    }
    var promise;
    if (vm.currentThreshold.thresholdId && vm.thresholds.some(function(t) { return t.thresholdId === vm.currentThreshold.thresholdId; })) {
      promise = ThresholdConfigFactory.updateThreshold(vm.currentThreshold.thresholdId, vm.currentThreshold);
    } else {
      vm.currentThreshold.thresholdId = 'THR-' + Date.now();
      promise = ThresholdConfigFactory.createThreshold(vm.currentThreshold);
    }
    promise.then(function() {
      vm.loadThresholds();
      vm.cancelEdit();
      vm.showSuccess('Threshold saved successfully');
    }).catch(function(error) {
      vm.error = 'Failed to save threshold: ' + (error.data ? error.data.message : error.statusText);
    });
  };

  vm.deleteThreshold = function(threshold) {
    if (!confirm('Are you sure you want to delete this threshold?')) {
      return;
    }
    ThresholdConfigFactory.deleteThreshold(threshold.thresholdId).then(function() {
      vm.loadThresholds();
      vm.showSuccess('Threshold deleted successfully');
    }).catch(function(error) {
      vm.error = 'Failed to delete threshold: ' + (error.data ? error.data.message : error.statusText);
    });
  };

  vm.cancelEdit = function() {
    vm.editMode = false;
    vm.currentThreshold = null;
  };

  vm.validateThreshold = function(threshold) {
    if (!threshold.level || !threshold.action) {
      return false;
    }
    if (threshold.minScore < 0 || threshold.maxScore > 100 || threshold.minScore >= threshold.maxScore) {
      return false;
    }
    return true;
  };

  vm.showSuccess = function(message) {
    vm.successMessage = message;
    setTimeout(function() {
      $scope.$apply(function() {
        vm.successMessage = null;
      });
    }, 3000);
  };

  vm.init();
}]);