angular.module('fraudDetectionModule').controller('alertManagementController', ['$scope', 'alertCandidateService', function($scope, alertCandidateService) {
  var vm = this;
  vm.alerts = [];
  vm.loading = true;
  vm.error = null;
  vm.filters = {
    status: 'pending',
    riskBand: null
  };
  vm.loadAlerts = function() {
    vm.loading = true;
    vm.error = null;
    alertCandidateService.getAlerts(vm.filters).then(function(data) {
      vm.alerts = data;
      vm.loading = false;
    }).catch(function(error) {
      vm.error = 'Failed to load alerts';
      vm.loading = false;
    });
  };
  vm.reviewAlert = function(alert, decision, notes) {
    alertCandidateService.updateAlert(alert.alertId, {
      status: 'reviewed',
      reviewedBy: 'current-user',
      notes: notes || '',
      decision: decision
    }).then(function(updatedAlert) {
      var index = vm.alerts.findIndex(function(a) { return a.alertId === alert.alertId; });
      if (index !== -1) {
        vm.alerts[index] = updatedAlert;
      }
    }).catch(function(error) {
      console.error('Failed to update alert:', error);
    });
  };
  vm.deleteAlert = function(alert) {
    if (confirm('Are you sure you want to delete this alert?')) {
      alertCandidateService.deleteAlert(alert.alertId).then(function() {
        vm.alerts = vm.alerts.filter(function(a) { return a.alertId !== alert.alertId; });
      }).catch(function(error) {
        console.error('Failed to delete alert:', error);
      });
    }
  };
  vm.applyFilters = function() {
    vm.loadAlerts();
  };
  vm.loadAlerts();
}]);